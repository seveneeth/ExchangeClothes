"""云端存档路由。"""
from __future__ import annotations

from fastapi import APIRouter

from .. import database, schemas
from ..utils import now_ts

router = APIRouter(prefix="/api", tags=["saves"])


@router.post("/save")
def save(doc: schemas.SaveRequest) -> dict:
    """上传 / 覆盖云端存档。"""
    ts = now_ts()
    database.upsert_save(doc.uid, database._dumps(doc.payload), ts)
    return {"ok": True, "uid": doc.uid, "updated_at": ts}


@router.get("/save/{uid}")
def load(uid: str) -> dict:
    """拉取云端存档；无存档时返回 404。"""
    return database.load_save(uid)


@router.delete("/save/{uid}")
def clear(uid: str) -> dict:
    """删除该玩家的云端存档与统计。"""
    database.delete_user(uid)
    return {"ok": True, "uid": uid}
