/* 云端 API（FastAPI backend）封装。
   所有方法都“尽力而为”：网络失败 / 后端未启动时 resolve(false)，
   不影响本地玩法。真正的数据优先走本地 storage。
*/
import cfg from './config.js';
import { getJSON, setJSON } from './storage.js';

const base = () => cfg.API_BASE.replace(/\/+$/, '');
const CLOUD_KEY = 'cloud.uid';

function req(method, path, data) {
  return new Promise(resolve => {
    if (!cfg.CLOUD_ENABLED) return resolve({ ok: false, reason: 'disabled' });
    uni.request({
      url: base() + path,
      method,
      data: data || {},
      timeout: 5000,
      header: { 'content-type': 'application/json' },
      success: res => resolve({ ok: true, status: res.statusCode, data: res.data }),
      fail: () => resolve({ ok: false, reason: 'network' }),
    });
  });
}

/* 稳定玩家标识：本地生成后常驻 */
export function getUid() {
  let uid = getJSON(CLOUD_KEY, null);
  if (!uid) {
    uid = 'p_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    setJSON(CLOUD_KEY, uid);
  }
  return uid;
}

/* 上传云存档（payload 为完整本地状态文档） */
export async function saveToCloud(payload) {
  const uid = getUid();
  const r = await req('POST', '/api/save', { uid, payload });
  return r.ok && r.status === 200;
}

/* 拉取云存档，返回 payload 或 null */
export async function loadFromCloud() {
  const uid = getUid();
  const r = await req('GET', '/api/save/' + encodeURIComponent(uid));
  if (r.ok && r.status === 200 && r.data && r.data.payload != null) return r.data.payload;
  return null;
}

/* 合并成就计数与解锁（整包同步） */
export async function mergeStats(counters, unlocks) {
  const uid = getUid();
  const r = await req('POST', '/api/stats/merge', { uid, counters, unlocks });
  return r.ok && r.status === 200 ? r.data : null;
}

/* 上报单个事件（含次数），返回最新统计 */
export async function reportEvent(name, delta = 1) {
  const uid = getUid();
  const r = await req('POST', '/api/stats/events', { uid, events: [{ name, delta }] });
  return r.ok && r.status === 200 ? r.data : null;
}

/* 读取服务端统计 */
export async function getStats() {
  const uid = getUid();
  const r = await req('GET', '/api/stats/' + encodeURIComponent(uid));
  if (r.ok && r.status === 200) return r.data;
  return null;
}

export function isOnline() { return cfg.CLOUD_ENABLED; }
