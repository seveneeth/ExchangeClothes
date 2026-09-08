"""云端数据存储层：去掉 SQLite，改为“每用户一个 JSON 文件”。

位置：backend/userdata/<uid>.json（可用环境变量 USERDATA_DIR 覆盖）。

说明：本项目目标用户 < 10 人、单实例部署，文件存储零依赖、易查看与备份。
为做到“只改本文件、调用方（saves.py / stats.py / main.py）无需改动”，本层保留：
  - 与原先完全同名同签名的函数：init_db / upsert_save / load_save /
    merge_counters / apply_event / load_stats / delete_user；
  - 模块级 _dumps（saves.py 会用 database._dumps(payload) 预序列化后传入，
    因此 upsert_save 同时兼容 str(JSON) 或 dict 两种 payload）。

并发：单进程内一把线程锁 + 原子写（临时文件 + rename），避免写坏文件。
"""
from __future__ import annotations

import json
import os
import re
import threading

from fastapi import HTTPException

# 存储根目录：默认 backend/userdata，可用环境变量 USERDATA_DIR 覆盖
_BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # .../backend
USERDATA_DIR = os.environ.get("USERDATA_DIR", os.path.join(_BASE, "userdata"))

_SAFE_UID = re.compile(r"^[A-Za-z0-9_\-]{1,96}$")  # uid 由客户端生成，形如 p_xxx_yyy
_lock = threading.Lock()


def _ensure_dir() -> None:
    os.makedirs(USERDATA_DIR, exist_ok=True)


def _path_for(uid: str) -> str:
    if not _SAFE_UID.match(uid):
        raise HTTPException(status_code=400, detail="非法的玩家标识")
    return os.path.join(USERDATA_DIR, uid + ".json")


def _read(uid: str) -> dict | None:
    """返回该用户的整份数据对象；不存在（或损坏）返回 None。"""
    p = _path_for(uid)
    try:
        with open(p, "r", encoding="utf-8") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError, OSError):
        return None


def _write(uid: str, data: dict) -> None:
    """原子写入：先写临时文件再 rename，避免读到半截内容。"""
    p = _path_for(uid)
    tmp = p + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
    os.replace(tmp, p)


def _blank(uid: str, ts: float) -> dict:
    return {
        "uid": uid,
        "created_at": ts,
        "save": None,      # { "payload": {...}, "updated_at": ts }
        "stats": None,     # { "counters": {...}, "unlocks": [...], "updated_at": ts }
    }


# ---------- 兼容：saves.py 会调用 database._dumps(payload) 预序列化 ----------
def _dumps(obj) -> str:
    return json.dumps(obj, ensure_ascii=False, separators=(",", ":"))


def _load_stats_of(data: dict) -> tuple[dict, list[str]]:
    st = data.get("stats") or {}
    counters = st.get("counters") or {}
    unlocks = st.get("unlocks") or []
    return counters, unlocks


# ---------- 初始化 ----------
def init_db() -> None:
    _ensure_dir()


# ---------- 云存档 ----------
def upsert_save(uid: str, payload, ts: float) -> None:
    """上传 / 覆盖云存档。payload 允许为 dict 或 _dumps 产出的 JSON 字符串。"""
    if isinstance(payload, str):  # 兼容 saves.py 用 _dumps 预序列化
        payload = json.loads(payload)
    _ensure_dir()
    with _lock:
        data = _read(uid) or _blank(uid, ts)
        data["save"] = {"payload": payload, "updated_at": ts}
        _write(uid, data)


def load_save(uid: str) -> dict:
    data = _read(uid)
    if data is None or not data.get("save"):
        raise HTTPException(status_code=404, detail="暂无云端存档")
    return {"uid": uid, "payload": data["save"]["payload"], "updated_at": data["save"]["updated_at"]}


# ---------- 成就 / 统计 ----------
def merge_counters(uid: str, counters: dict, unlocks: list[str], ts: float) -> dict:
    """合并客户端累计计数与解锁成就，返回合并后统计。"""
    _ensure_dir()
    with _lock:
        data = _read(uid) or _blank(uid, ts)
        cur_c, cur_u = _load_stats_of(data)
        merged_c = dict(cur_c)
        for k, v in (counters or {}).items():
            if isinstance(v, (int, float)):
                merged_c[k] = max(float(merged_c.get(k, 0)), float(v))  # 取更大
        merged_u = list(dict.fromkeys(cur_u + (unlocks or [])))         # 取并集
        data["stats"] = {"counters": merged_c, "unlocks": merged_u, "updated_at": ts}
        _write(uid, data)
        return {"uid": uid, "counters": merged_c, "unlocks": merged_u, "updated_at": ts}


def apply_event(uid: str, event: str, delta: float, ts: float) -> dict:
    """为单个事件累加计数（成就/统计）。"""
    _ensure_dir()
    with _lock:
        data = _read(uid) or _blank(uid, ts)
        cur_c, cur_u = _load_stats_of(data)
        merged_c = dict(cur_c)
        merged_c[event] = round(float(merged_c.get(event, 0)) + float(delta), 4)
        data["stats"] = {"counters": merged_c, "unlocks": cur_u, "updated_at": ts}
        _write(uid, data)
        return {"uid": uid, "counters": merged_c, "unlocks": cur_u, "updated_at": ts}


def load_stats(uid: str) -> dict:
    data = _read(uid)
    if data is None:
        raise HTTPException(status_code=404, detail="用户不存在")
    cur_c, cur_u = _load_stats_of(data)
    return {"uid": uid, "counters": cur_c, "unlocks": cur_u,
            "updated_at": (data.get("stats") or {}).get("updated_at")}


# ---------- 删除 ----------
def delete_user(uid: str) -> None:
    with _lock:
        try:
            os.remove(_path_for(uid))
        except FileNotFoundError:
            pass
