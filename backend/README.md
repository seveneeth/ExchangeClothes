# 梦幻衣橱 · FastAPI 后端

提供 **云存档同步** 与 **成就 / 统计** 两类接口。数据持久化到 SQLite（文件见
`backend/data/wardrobe.db`，首次启动自动创建），仅依赖 `fastapi` 与 `uvicorn`，无额外数据库服务。

## 启动

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- 交互式文档：http://127.0.0.1:8000/docs
- 健康检查：http://127.0.0.1:8000/health

## 环境变量

| 变量 | 说明 | 默认 |
| --- | --- | --- |
| `CORS_ORIGINS` | 允许跨域来源，逗号分隔；`*` 表示放开 | `*`（本地调试够用，生产请收紧） |
| `PORT` | 服务端口（用 `python app/main.py` 直接跑时生效） | `8000` |
| `WARDROBE_DB_DIR` | 数据库所在目录 | `backend/data` |

## 接口一览

### 云存档
- `POST /api/save`   body `{ "uid", "payload": {…} }` —— 覆盖上传云存档
- `GET  /api/save/{uid}` —— 拉取云存档，返回 `{ uid, payload, updated_at }`；无存档 `404`
- `DELETE /api/save/{uid}` —— 删除该玩家云端存档与统计

### 成就 / 统计（服务端聚合，即使清掉本地也不丢）
- `POST /api/stats/merge`   body `{ "uid", "counters": {事件:数值}, "unlocks": [成就id] }` —— 合并整包计数与解锁
- `POST /api/stats/events`  body `{ "uid", "events": [{ "name":"worn","delta":1 }] }` —— 逐条累加事件
- `GET  /api/stats/{uid}` —— 读取服务端统计与解锁成就

## 目录结构

```
backend/
├── app/
│   ├── main.py        # FastAPI 入口 + CORS
│   ├── database.py    # SQLite 存取层
│   ├── schemas.py     # Pydantic 模型
│   ├── utils.py
│   └── routers/
│       ├── saves.py   # 云存档路由
│       └── stats.py   # 统计路由
├── data/              # SQLite 数据库（运行时生成）
├── requirements.txt
└── README.md
```

> 客户端封装见 `uni-app/common/api.js`；地址在 `uni-app/common/config.js` 的 `API_BASE` 修改。
