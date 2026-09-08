"""梦幻衣橱 · FastAPI 应用入口。

启动：
    cd backend
    python -m venv .venv
    .venv\\Scripts\\activate          # Windows
    pip install -r requirements.txt
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

交互文档：http://127.0.0.1:8000/docs
"""
from __future__ import annotations

import os
import time

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .routers import saves, stats

app = FastAPI(title="梦幻衣橱 Wardrobe API", version="1.0.0", description="云存档同步 + 成就统计")

# 跨域：默认放开，便于本地 H5 调试。生产环境请用 CORS_ORIGINS 收紧。
_origins = [
    o.strip()
    for o in os.environ.get("CORS_ORIGINS", "*").split(",")
    if o.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins or ["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 启动时初始化数据库表
init_db()

app.include_router(saves.router)
app.include_router(stats.router)


@app.get("/health")
def health() -> dict:
    return {"ok": True, "service": "wardrobe", "time": time.time()}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=int(os.environ.get("PORT", 8000)), reload=True)
