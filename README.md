# 梦幻衣橱 · ChangeCloseGame

一个程序化换装小游戏。仓库内包含三部分：

| 目录 | 说明 |
| --- | --- |
| `web-prototype/` | **原始浏览器原型**（纯 DOM/SVG，直接双击 `index` 需本地起 HTTP 服务）。原 `app.js / data.js / render.js / features.js / style.css` 均保留于此。 |
| `uni-app/` | **uni-app 版**（Vue2 单页），保留完整玩法，角色用现有 SVG 代码渲染到 `<image>`。H5 / App 端可跑。 |
| `backend/` | **FastAPI 后端**：云存档同步 + 成就/统计。 |

> 说明：因为微信小程序端 `<image>`/`cover-image` 不支持 SVG，而本作全部视觉均为程序化 SVG，因此 **uni-app 版以 H5（浏览器）/ App 为目标运行**，可做到视觉 100% 还原、改动最小。若要上微信小程序，需把渲染层换成 Canvas（见各 README 的后续指引）。

---

## 快速开始（uni-app 版）

用 **HBuilderX** 打开 `uni-app/` 目录 → 运行 → 运行到浏览器（H5）即可玩；无需 npm。

详细说明见 [`uni-app/README.md`](uni-app/README.md)。

## 启动后端

```bash
cd backend
python -m venv .venv
# Windows:  .venv\Scripts\activate     macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

接口文档：http://127.0.0.1:8000/docs 。详细说明见 [`backend/README.md`](backend/README.md)。

---

## 玩法

左侧选择分类（角色 / 发型 / 发色 / 肤色 / 瞳色 / 眼型 / 各服饰类别），下方点击单品即可穿戴；
连衣裙与上/下/裙装互斥、裙与裤互斥，自动规避穿模。支持随机搭配、评分、成就、本地 + 云端存档、衣橱（最多 8 套）、分享计数。

数据源由 `web-prototype` 的程序化 SVG 移植而来（`uni-app/common/avatar.js`），渲染逻辑与原型完全一致。
