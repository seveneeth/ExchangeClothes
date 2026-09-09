# 梦幻衣橱 · uni-app 版

由 `web-prototype/`（纯 DOM/SVG 网页原型）移植而来的 **uni-app（Vue2）单页换装游戏**，保留完整玩法：
分类换装、互斥规则、角色/发型/发色/肤色/瞳色/眼型定制、随机搭配、搭配评分、11 项成就、
本地存档、云端存档（对接 `backend/` FastAPI）、衣橱（最多 8 套）、分享计数。

## 运行方式

### 方式 A：HBuilderX（推荐，免配置）

1. 打开 HBuilderX → 文件 → 打开目录 → 选择本 `uni-app/` 文件夹。
2. 菜单：运行 → 运行到浏览器 → Chrome（H5）。

> 本项目不需要 `npm install`，也无需 `package.json`——HBuilderX 会自动识别 `manifest.json`/`pages.json` 并内置编译。

### 方式 B：CLI（可选）

本项目也可作为标准 uni-app 工程用 `@dcloudio/uni-app` 的 CLI 跑，但需自行初始化依赖，此处不展开。

## 目录结构

```
uni-app/
├── pages.json
├── manifest.json
├── main.js
├── App.vue
├── common/
│   ├── avatar.js     # 纯 SVG 角色/物品渲染（由 data.js + render.js 移植，无 DOM 依赖）
│   ├── gamecore.js   # 规则/评分/成就/每类可选列表（由 app.js + features.js 移植）
│   ├── storage.js    # 本地存储封装（uni.* 优先，localStorage/内存兜底）
│   ├── api.js        # 云端 API 封装（FastAPI backend）
│   └── config.js     # 后端地址 / 云端开关
└── pages/index/index.vue   # 主游戏界面
```

## 关键设计

- **渲染**：`avatarSVG(cfg)` 返回整身 SVG，经 `svgToDataUri()` 转 base64 交给 `<image>`。
  与浏览器原型逐像素一致（分层、渐变小礼服 `d6`、旋转贝雷帽等都保留）。
- **数据流**：所有纯逻辑在 `common/`；界面组件只做展示与交互，逻辑经 `gamecore`/`avatar` 复用。
- **本地存档**：key `dw_game`（cfg / ach / outfits）。**云端**仅在点击「☁️ 上传云端存档」或首启自动拉取时与后端通信，
  后端不可用时静默回退离线，不影响本地玩法。

## 连接后端

默认后端地址为 `http://127.0.0.1:8000`（见 `common/config.js` 的 `API_BASE`）：

- 本机 H5：保持不变即可，后端已开 CORS `*`。
- 真机 / 局域网：把 `API_BASE` 改成电脑局域网 IP，如 `http://192.168.1.5:8000`。
- 若要接小程序 / 上线：改成 https 域名，并在平台后台配置 `request` 合法域名。

先在 `backend/` 按 [`../backend/README.md`](../backend/README.md) 启动服务。

## 关于微信小程序端（Canvas 渲染，进行中）

`<image>`/`cover-image` **不支持 SVG**，因此小程序端需要用 Canvas 重绘。当前进展：

- `common/svg2canvas.js`：轻量 SVG→Canvas2D 解释器。复用 `avatar.js` 生成的同一段 SVG 字符串，
  解析后画到标准 2d `ctx`（支持 path/circle/ellipse/rect/line、linearGradient、rotate、M/L/C/Q/A/Z+q）。
  已用 Node mock 全量验证：6 角色 / 51 物品 / 11 发型 / 弧线帽饰 / d6 渐变裙均无错、无 NaN。
- `common/canvasctx.js`：跨端获取 `<canvas type="2d">` 标准 2D 上下文（H5 与 mp-weixin）。
- `components/canvas-avatar.vue`：把 `cfg` 形象画到 `<canvas type="2d">` 的可复用组件（mp-weixin 的渲染入口）。
- `pages/ab/ab.vue`：A/B 校验页，右栏即用 `canvas-avatar` 组件绘制，可在 H5 对照左侧 SVG `<image>` 检查解释器是否正确。

待办（依赖在 H5/开发者工具实际跑起来对照，才能逐像素收敛）：
1. 用 H5 打开「🎨 A/B」，确认右栏 Canvas 与左栏 SVG 视觉一致；把不一致项反馈给作者迭代 svg2canvas。
2. 把主游戏 `pages/index/index.vue` 的舞台形象在 **mp-weixin** 下改用 `canvas-avatar`（H5 仍可用 `<image>`）。
3. 选项缩略图在 mp-weixin 端也需转成 PNG/Canvas（mp `<image>` 不认 SVG），方案为离屏 canvas 栅格化后用 `<image>` 显示。

本地/云端存档均不受平台影响（见上文）。
