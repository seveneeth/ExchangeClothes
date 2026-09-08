"""SQLite 存取层（使用标准库 sqlite3，避免额外依赖）。

同一进程内 FastAPI 线程并发访问 SQLite：使用单连接 + 锁，简单可靠。
数据文件默认落在 backend/data/wardrobe.db。
"""
from __future__ import annotations

import os
import sqlite3
import threading

from fastapi import HTTPException

# 允许通过环境变量覆盖数据库路径（便于部署到容器 / 网络盘）。
_DB_DIR = os.environ.get("WARDROBE_DB_DIR", os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "data"))
DB_PATH = os.path.join(_DB_DIR, "wardrobe.db")

_lock = threading.Lock()
_conn: sqlite3.Connection | None = None


def _get_conn() -> sqlite3.Connection:
    global _conn
    if _conn is None:
        os.makedirs(_DB_DIR, exist_ok=True)
        _conn = sqlite3.connect(DB_PATH, check_same_thread=False)
        _conn.execute("PRAGMA journal_mode=WAL")
    return _conn


def init_db() -> None:
    c = _get_conn()
    with _lock, c:
        c.executescript(
            """
            CREATE TABLE IF NOT EXISTS users (
                uid        TEXT PRIMARY KEY,
                created_at REAL NOT NULL
            );

            CREATE TABLE IF NOT EXISTS saves (
                uid        TEXT PRIMARY KEY,
                payload    TEXT NOT NULL,
                updated_at REAL NOT NULL,
                FOREIGN KEY (uid) REFERENCES users(uid)
            );

            CREATE TABLE IF NOT EXISTS stats (
                uid        TEXT PRIMARY KEY,
                counters   TEXT NOT NULL,   -- JSON：{ 事件名: 累计值 }
                unlocks    TEXT NOT NULL,   -- JSON：[成就 id, ...]
                updated_at REAL NOT NULL,
                FOREIGN KEY (uid) REFERENCES users(uid)
            );
            """
        )


def _user_exists(uid: str) -> bool:
    c = _get_conn()
    row = c.execute("SELECT 1 FROM users WHERE uid=?", (uid,)).fetchone()
    return row is not None


def ensure_user(uid: str, now: float) -> None:
    c = _get_conn()
    with _lock, c:
        c.execute("INSERT OR IGNORE INTO users(uid, created_at) VALUES (?, ?)", (uid, now))


def upsert_save(uid: str, payload: str, ts: float) -> None:
    c = _get_conn()
    with _lock, c:
        ensure_user(uid, ts)
        c.execute(
            "INSERT INTO saves(uid, payload, updated_at) VALUES (?, ?, ?) "
            "ON CONFLICT(uid) DO UPDATE SET payload=excluded.payload, updated_at=excluded.updated_at",
            (uid, payload, ts),
        )


def load_save(uid: str) -> dict | None:
    if not _user_exists(uid):
        raise HTTPException(status_code=404, detail="用户不存在，无云端存档")
    c = _get_conn()
    row = c.execute("SELECT payload, updated_at FROM saves WHERE uid=?", (uid,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="暂无云端存档")
    import json

    try:
        payload = json.loads(row[0])
    except Exception:
        payload = None
    return {"uid": uid, "payload": payload, "updated_at": row[1]}


def merge_counters(uid: str, counters: dict, unlocks: list[str], ts: float) -> dict:
    """把客户端上报的累计计数与解锁合并进服务端，返回合并后的统计。"""
    c = _get_conn()
    with _lock, c:
        ensure_user(uid, ts)
        cur = c.execute("SELECT counters, unlocks FROM stats WHERE uid=?", (uid,)).fetchone()
        if cur is None:
            stored_c, stored_u = {}, []
        else:
            import json

            stored_c = json.loads(cur[0])
            stored_u = json.loads(cur[1])
        # 计数器取“更大”者（数值统计用 max 合并）
        merged_c = dict(stored_c)
        for k, v in (counters or {}).items():
            if not isinstance(v, (int, float)):
                continue
            merged_c[k] = max(float(merged_c.get(k, 0)), float(v))
        # 解锁成就取并集
        merged_u = list(dict.fromkeys((stored_u or []) + (unlocks or [])))
        c.execute(
            "INSERT INTO stats(uid, counters, unlocks, updated_at) VALUES (?, ?, ?, ?) "
            "ON CONFLICT(uid) DO UPDATE SET counters=excluded.counters, unlocks=excluded.unlocks, "
            "updated_at=excluded.updated_at",
            (uid, _dumps(merged_c), _dumps(merged_u), ts),
        )
        return {"uid": uid, "counters": merged_c, "unlocks": merged_u, "updated_at": ts}


def apply_event(uid: str, event: str, delta: float, ts: float) -> dict:
    """为单个事件累加计数并落库（成就/统计）。"""
    c = _get_conn()
    with _lock, c:
        ensure_user(uid, ts)
        cur = c.execute("SELECT counters, unlocks FROM stats WHERE uid=?", (uid,)).fetchone()
        if cur is None:
            stored_c, stored_u = {}, []
        else:
            import json

            stored_c = json.loads(cur[0])
            stored_u = json.loads(cur[1])
        merged_c = dict(stored_c)
        merged_c[event] = round(float(merged_c.get(event, 0)) + float(delta), 4)
        merged_u = list(stored_u)
        c.execute(
            "INSERT INTO stats(uid, counters, unlocks, updated_at) VALUES (?, ?, ?, ?) "
            "ON CONFLICT(uid) DO UPDATE SET counters=excluded.counters, unlocks=excluded.unlocks, "
            "updated_at=excluded.updated_at",
            (uid, _dumps(merged_c), _dumps(merged_u), ts),
        )
        return {"uid": uid, "counters": merged_c, "unlocks": merged_u, "updated_at": ts}


def load_stats(uid: str) -> dict:
    if not _user_exists(uid):
        raise HTTPException(status_code=404, detail="用户不存在")
    c = _get_conn()
    cur = c.execute("SELECT counters, unlocks, updated_at FROM stats WHERE uid=?", (uid,)).fetchone()
    if cur is None:
        return {"uid": uid, "counters": {}, "unlocks": [], "updated_at": None}
    import json

    return {"uid": uid, "counters": json.loads(cur[0]), "unlocks": json.loads(cur[1]), "updated_at": cur[2]}


def delete_user(uid: str) -> None:
    c = _get_conn()
    with _lock, c:
        c.execute("DELETE FROM saves WHERE uid=?", (uid,))
        c.execute("DELETE FROM stats WHERE uid=?", (uid,))
        c.execute("DELETE FROM users WHERE uid=?", (uid,))


def _dumps(obj) -> str:
    import json

    return json.dumps(obj, ensure_ascii=False, separators=(",", ":"))
