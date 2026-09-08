/* 全局配置 */
export default {
  // FastAPI 后端地址。
  //  - 本机 H5 调试：保持 http://127.0.0.1:8000
  //  - 真机 / 局域网：改成电脑局域网 IP，如 http://192.168.1.5:8000
  //  - 部署到小程序 / 线上：填 https 域名（微信需在后台配置 request 合法域名）
  API_BASE: 'http://127.0.0.1:8000',

  // 云端开关：false 时完全离线（仅本地存储）
  CLOUD_ENABLED: true,

  // 本地存档 key 前缀
  STORE_PREFIX: 'dw_',
};
