"""Pydantic 请求/响应模型。"""
from __future__ import annotations

from typing import Any, Optional

from pydantic import BaseModel, Field


class SaveRequest(BaseModel):
    uid: str = Field(..., min_length=1, max_length=96, description="玩家唯一标识")
    payload: dict[str, Any] = Field(default_factory=dict, description="云端存档内容（客户端完整状态）")


class StatsMergeRequest(BaseModel):
    uid: str = Field(..., min_length=1, max_length=96)
    counters: dict[str, float] = Field(default_factory=dict, description="各事件累计值")
    unlocks: list[str] = Field(default_factory=list, description="已解锁成就 id")
    ts: Optional[float] = None


class EventIn(BaseModel):
    name: str = Field(..., min_length=1, max_length=64, description="事件名，如 dressed / random / share")
    delta: float = Field(1.0, description="累加量，默认 1")


class EventsRequest(BaseModel):
    uid: str = Field(..., min_length=1, max_length=96)
    events: list[EventIn] = Field(default_factory=list)
    ts: Optional[float] = None
