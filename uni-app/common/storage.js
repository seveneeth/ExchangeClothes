/* 统一本地存储（单条编码路径，避免双重 JSON.stringify）。
   所有值都以 JSON 字符串形式写入，读回时反序列化；优先 uni.*，其次 localStorage / 内存兜底。
*/
import cfg from './config.js';

const mem = {}; // 无任何存储环境时的兜底

function backend() {
  if (typeof uni !== 'undefined' && uni && typeof uni.getStorageSync === 'function') return 'uni';
  if (typeof localStorage !== 'undefined') return 'local';
  return 'mem';
}

const keyOf = k => cfg.STORE_PREFIX + k;

export function getStore(key, def) {
  const k = keyOf(key);
  try {
    const b = backend();
    let raw = null;
    if (b === 'uni') { const v = uni.getStorageSync(k); raw = (v === '' || v == null) ? null : v; }
    else if (b === 'local') { raw = localStorage.getItem(k); }
    else raw = (k in mem) ? mem[k] : null;
    if (raw == null) return def;
    return JSON.parse(raw); // 无论类型统一反序列化
  } catch (e) { return def; }
}

export function setStore(key, val) {
  const k = keyOf(key);
  try {
    const raw = JSON.stringify(val);
    const b = backend();
    if (b === 'uni') uni.setStorageSync(k, raw);
    else if (b === 'local') localStorage.setItem(k, raw);
    else mem[k] = raw;
  } catch (e) { /* ignore */ }
}

export function removeStore(key) {
  const k = keyOf(key);
  try {
    const b = backend();
    if (b === 'uni') uni.removeStorageSync(k);
    else if (b === 'local') localStorage.removeItem(k);
    else delete mem[k];
  } catch (e) { /* ignore */ }
}

// 与原先命名一致（存 / 取任意 JSON 值，含字符串 / 布尔 / 对象）
export const getJSON = getStore;
export const setJSON = setStore;
