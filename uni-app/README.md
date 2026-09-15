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

### 方式 C：微信小程序（mp-weixin）

1. 微信开发者工具：设置 → 安全设置 → 打开「服务端口」。
2. HBuilderX → 运行 → 运行到小程序模拟器 → 微信开发者工具；或手动导入编译产物
   `uni-app/unpackage/dist/dev/mp-weixin/`（内含 `app.json`）。
3. 小程序端「详情 → 本地设置」勾选「不校验合法域名」（云端接口 `http://127.0.0.1:8000` 仅为本地 H5 调试用）。

小程序端所有角色/缩略图走 `<canvas type="2d">` + `svg2canvas` 绘制（见下文），H5/App 端仍用 SVG `<image>`。

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

- **渲染**：`avatarSVG(cfg)` 返回整身 SVG。H5/App 端经 `svgToDataUri()` 转 base64 交给 `<image>`，
  与浏览器原型逐像素一致（分层、渐变小礼服 `d6`、旋转贝雷帽等都保留）；
  **微信小程序端 `<image>` 对 SVG data-URI 支持不可靠**，改用 `<canvas type="2d">` + `svg2canvas.js` 绘制，
  视觉与 SVG 同一份几何（`pages/ab/ab.vue` 提供 A/B 对照校验）。
- **数据流**：所有纯逻辑在 `common/`；界面组件只做展示与交互，逻辑经 `gamecore`/`avatar` 复用。
- **本地存档**：key `dw_game`（cfg / ach / outfits）。**云端**仅在点击「☁️ 上传云端存档」或首启自动拉取时与后端通信，
  后端不可用时静默回退离线，不影响本地玩法。

## 连接后端

默认后端地址为 `http://127.0.0.1:8000`（见 `common/config.js` 的 `API_BASE`）：

- 本机 H5：保持不变即可，后端已开 CORS `*`。
- 真机 / 局域网：把 `API_BASE` 改成电脑局域网 IP，如 `http://192.168.1.5:8000`。
- 若要接小程序 / 上线：改成 https 域名，并在平台后台配置 `request` 合法域名。

先在 `backend/` 按 [`../backend/README.md`](../backend/README.md) 启动服务。

## 关于微信小程序端（Canvas 渲染）

微信小程序端 `<image>` 显示 SVG data-URI 不可靠（真机逻辑层还没有 `btoa`，且对 base64/SVG 支持受限），
因此小程序端把 `avatar.js` 生成的同一段 SVG 用 Canvas 重绘。当前状态：

- `common/svg2canvas.js`：轻量 SVG→Canvas2D 解释器。复用 `avatar.js` 生成的同一段 SVG 字符串，
  解析后画到标准 2d `ctx`（支持 path/circle/ellipse/rect/line、linearGradient、rotate、M/L/C/Q/A/Z+q）。
  已用 Node mock 全量验证：6 角色 / 51 物品 / 11 发型 / 弧线帽饰 / d6 渐变裙均无错、无 NaN。
- `common/canvasctx.js`：跨端获取 `<canvas type="2d">` 标准 2D 上下文（H5 与 mp-weixin）。
- `components/canvas-avatar.vue`：把 `cfg` 形象画到 `<canvas type="2d">`（舞台形象，mp-weixin 渲染入口）。
- `components/thumb-canvas.vue`：通用 SVG→canvas 缩略图组件，自动读取 SVG 根节点 `viewBox`，
  按 `contain`/`fill` 缩放绘制；用于选项格（物品/发型/眼型/角色缩略图）与衣橱行、分享预览。
- `common/avatar.js` 的 `svgToDataUri` 已补纯 JS base64 兜底（不再依赖 `btoa`）。
- 主页面 `pages/index/index.vue` 用条件编译（`MP-WEIXIN`）分流：
  H5/App 保持 SVG `<image>`（像素级一致），mp-weixin 端舞台/缩略图全部走上述 Canvas 组件。
- 背景图位于 `uni-app/static/background.png`，以 `/static/background.png` 引用（mp 构建会打包 `static/`）。
- `pages/ab/ab.vue`：A/B 校验页，右栏用 `canvas-avatar` 组件绘制，可在 H5 对照左侧 SVG `<image>` 检查解释器。

已知注意事项：
1. A/B 视觉收敛：不同物品的渐变/曲线是近似绘制，若有差异请以 `pages/ab/ab.vue` 逐项对照并在 `svg2canvas` 迭代。
2. 样式兼容：wxss 对 `conic-gradient`、`backdrop-filter` 等支持有限（评分环为 `conic-gradient`），
   在真机/开发者工具如发现装饰缺失属样式降级，不影响玩法。
3. 云端接口在小程序端需用已配置合法域名的 https 地址（见 `common/config.js`），否则显示「云端不可用(离线)」。

本地/云端存档均不受平台影响（见上文）。
