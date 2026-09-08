"""成就 / 统计路由。"""
from __future__ import annotations

from fastapi import APIRouter

from .. import database, schemas
from ..utils import now_ts

router = APIRouter(prefix="/api", tags=["stats"])


@router.post("/stats/merge")
def merge_stats(req: schemas.StatsMergeRequest) -> dict:
    """合并客户端累计计数与解锁成就（用于定期整包同步）。"""
    ts = req.ts or now_ts()
    return database.merge_counters(req.uid, req.counters, req.unlocks, ts)


@router.post("/stats/events")
def report_events(req: schemas.EventsRequest) -> dict:
    """上报一批事件并逐条累加，返回最新统计。"""
    ts = req.ts or now_ts()
    result = None
    for ev in req.events:
        result = database.apply_event(req.uid, ev.name, ev.delta, ts)
    return result or {"uid": req.uid, "counters": {}, "unlocks": [], "updated_at": ts}


@router.get("/stats/{uid}")
def get_stats(uid: str) -> dict:
    """读取该玩家服务端统计与已解锁成就。"""
    return database.load_stats(uid)
