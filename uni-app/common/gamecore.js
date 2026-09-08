/* 纯游戏规则 / 计算逻辑（无 UI、无 DOM 依赖）：
   互斥规则、每类可选列表、搭配评分、成就定义与判定。
   从原 web-prototype 的 app.js / features.js 移植。
*/
import { CHARACTERS, ITEMS, ITEM_MAP, HAIRSTYLES, EYESHAPES, HAIRCOLORS, EYECOLORS, TAG_NAMES } from './avatar.js';

export const MAX_OUTFITS = 8;

/* 互斥规则：连衣裙 vs 上下/裙/裤 等 */
export const EXCLUSIVE = {
  dress: ['top', 'bottom', 'skirt'],
  top: ['dress'],
  bottom: ['dress', 'skirt'],
  skirt: ['dress', 'bottom'],
};

const ITEMS_BY_CAT = {};
ITEMS.forEach(it => (ITEMS_BY_CAT[it.cat] = ITEMS_BY_CAT[it.cat] || []).push(it));
export { ITEMS_BY_CAT };

export function deepClone(o) { return JSON.parse(JSON.stringify(o)); }

export function defaultCfg(charId) {
  const c = deepClone(CHARACTERS[charId].preset);
  return Object.assign({ charId, items: {} }, c, { items: c.items || {} });
}

export function getChoiceThumb(kind, id) {
  // 供 UI 缩略图使用：items -> itemThumbSVG，hair -> hairThumbSVG，eyeShape -> eyeShapeThumbSVG
  // 由调用方（index.vue）处理，这里保留接口说明
}

/* ---------- 颜色工具（评分用） ---------- */
export function hexToHsl(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (mx + mn) / 2;
  if (mx !== mn) {
    const d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0));
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [h, s, l];
}

/* ---------- 搭配评分 ---------- */
export function scoreOutfit(cfg) {
  const it = cfg.items || {};
  const worn = Object.keys(it).filter(k => it[k] && ITEM_MAP[it[k]]);
  const items = worn.map(k => ITEM_MAP[it[k]]);
  const dims = {};
  let complete = 0;
  if (it.dress || (it.top && (it.bottom || it.skirt))) complete += 18;
  else if (it.top || it.bottom || it.skirt) complete += 8;
  if (it.shoes) complete += 8;
  if (it.hat) complete += 3;
  complete += Math.min(6, [it.headwear, it.earrings, it.necklace].filter(Boolean).length * 2);
  dims.complete = Math.round(complete / 35 * 100);
  let harmony = 12;
  const chroma = [];
  items.forEach(i => i.colors.forEach(c => {
    const [h, s] = hexToHsl(c);
    if (s > 0.22 && !(c === '#f6f6f8')) chroma.push(Math.round(h / 30) % 12);
  }));
  if (chroma.length) {
    const fams = [...new Set(chroma)];
    if (fams.length === 1) harmony = 30;
    else if (fams.length === 2) {
      const [a, b2] = fams;
      const gap = Math.min(Math.abs(a - b2), 12 - Math.abs(a - b2));
      harmony = gap <= 2 ? 28 : (gap >= 5 ? 22 : 18);
    } else harmony = Math.max(8, 20 - (fams.length - 3) * 4);
  }
  dims.harmony = Math.round(harmony / 30 * 100);
  let style = 6;
  if (items.length) {
    const tagCount = {};
    items.forEach(i => i.tags.forEach(t => tagCount[t] = (tagCount[t] || 0) + 1));
    const dom = Math.max(...Object.values(tagCount));
    const total = items.reduce((n, i) => n + i.tags.length, 0);
    style = Math.round(6 + 19 * (dom / total * 1.6 > 1 ? 1 : dom / total * 1.6));
  }
  dims.style = Math.round(style / 25 * 100);
  const bonus = [it.hat, it.headwear, it.earrings, it.necklace].filter(Boolean).length;
  dims.bonus = Math.round(Math.min(10, bonus * 2.5) / 10 * 100);
  const score = Math.round(complete / 35 * 35 + harmony / 30 * 30 + style / 25 * 25 + Math.min(10, bonus * 2.5));
  const stars = Math.max(1, Math.min(5, Math.round(score / 20)));
  const best = Object.entries(dims).sort((a, b2) => b2[1] - a[1])[0][0];
  const praise = {
    complete: '整套Look相当完整，从上到下都安排得明明白白！',
    harmony: '色彩感觉一流，配色和谐又高级！',
    style: '风格超级统一，主题感十足，像从杂志里走出来的！',
    bonus: '配饰点睛太绝了，细节控狂喜！',
  };
  const tips = [];
  if (!it.shoes) tips.push('还没穿鞋子哦，挑一双鞋会让整体更完整');
  if (!it.dress && it.top && !it.bottom && !it.skirt) tips.push('上半身有了，再选一条裤装或裙装吧');
  if (!it.dress && !it.top) tips.push('别忘了穿上衣～');
  if (!it.hat && !it.headwear) tips.push('试试加一顶帽子或头饰，层次感立刻不一样');
  if (!it.earrings && !it.necklace) tips.push('耳饰或项链能提升精致度哦');
  if (dims.harmony < 60) tips.push('配色稍有冲突，可以试试同色系或对比色系单品');
  if (!tips.length) tips.push('已经很棒啦！试试「随机搭配」碰撞新灵感吧');
  const comments = [
    [90, '✨ 惊为天人！这就是本季最佳穿搭！'],
    [75, '👏 非常出色的搭配，时髦度满分！'],
    [60, '👍 不错的搭配，已经有模有样啦！'],
    [40, '🙂 有潜力的搭配，再调整一下细节吧'],
    [0, '🌱 刚起步的穿搭，多试试不同单品吧'],
  ];
  const comment = comments.find(c => score >= c[0])[1] + ' ' + praise[best];
  return { score, stars, dims, comment, tips: tips.slice(0, 3) };
}

/* ---------- 成就系统 ---------- */
export const ACHIEVEMENTS = [
  { id: 'first', icon: '👗', name: '初次登场', desc: '第一次换装', goal: 1, type: 'count', key: 'dressed' },
  { id: 'fullset', icon: '🧥', name: '全套出击', desc: '同时穿上衣、下装和鞋子', goal: 1, type: 'flag', key: 'fullset' },
  { id: 'try30', icon: '🛍️', name: '试衣间常客', desc: '试穿 30 件不同单品', goal: 30, type: 'set', key: 'tried' },
  { id: 'dress5', icon: '👑', name: '裙子收藏家', desc: '试穿 5 条不同连衣裙', goal: 5, type: 'set', key: 'triedDress' },
  { id: 'save5', icon: '💾', name: '收藏爱好者', desc: '保存 5 套搭配', goal: 5, type: 'count', key: 'saved' },
  { id: 'color8', icon: '🎨', name: '发色魔法师', desc: '尝试 8 种不同发色', goal: 8, type: 'set', key: 'hairTried' },
  { id: 'style20', icon: '🔄', name: '百变星人', desc: '累计更换 20 次造型', goal: 20, type: 'count', key: 'dressed' },
  { id: 'random10', icon: '🎲', name: '命运搭配师', desc: '使用 10 次随机搭配', goal: 10, type: 'count', key: 'randoms' },
  { id: 'perfect', icon: '⭐', name: '完美瞬间', desc: '获得 90 分以上评分', goal: 1, type: 'flag', key: 'perfect' },
  { id: 'share1', icon: '📤', name: '分享达人', desc: '分享一次搭配', goal: 1, type: 'count', key: 'shared' },
  { id: 'allcat', icon: '🏅', name: '十八般武艺', desc: '佩戴过全部服饰类别', goal: 9, type: 'set', key: 'cats' },
];
export const CAT_KEYS = ['top', 'bottom', 'skirt', 'dress', 'shoes', 'hat', 'headwear', 'earrings', 'necklace'];

/* 成就状态操作：传入持久化对象 { progress:{}, unlocked:[] } */
export function achProgress(achState, a) {
  if (achState.unlocked.includes(a.id)) return { cur: a.goal, done: true };
  const p = achState.progress[a.key] || {};
  if (a.type === 'set') return { cur: (p.items || []).length, done: false };
  if (a.type === 'count') return { cur: p.n || 0, done: false };
  return { cur: p.done ? 1 : 0, done: false };
}
export function achTrack(achState, key, action, val) {
  const p = achState.progress[key] = achState.progress[key] || {};
  if (action === 'set') { p.items = p.items || []; if (!p.items.includes(val)) p.items.push(val); }
  else if (action === 'inc') p.n = (p.n || 0) + (val || 1);
  else if (action === 'flag') p.done = true;
}
export function achCheck(achState) {
  const newly = [];
  ACHIEVEMENTS.forEach(a => {
    if (achState.unlocked.includes(a.id)) return;
    const { cur } = achProgress(achState, a);
    if (cur >= a.goal) { achState.unlocked.push(a.id); newly.push(a); }
  });
  return newly;
}

/* 便捷：试穿/完整度追踪（需配合 achTrack/achCheck 使用） */
export function trackTry(achState, cat, id) {
  achTrack(achState, 'dressed', 'inc');
  if (id) {
    achTrack(achState, 'tried', 'set', id);
    if (cat === 'dress') achTrack(achState, 'triedDress', 'set', id);
    achTrack(achState, 'cats', 'set', cat);
  }
}

export const TAG_NAME = (t) => TAG_NAMES[t] || t;
export function itemName(id) { return ITEM_MAP[id] ? ITEM_MAP[id].name : id; }
export function catCountOfItems(cat) { return (ITEMS_BY_CAT[cat] || []).length; }
export function getItemsByCat(cat) { return ITEMS_BY_CAT[cat] || []; }
export function countHair() { return Object.keys(HAIRSTYLES).length; }
export function countEyes() { return EYESHAPES.length; }
export function countChars() { return Object.keys(CHARACTERS).length; }
export { HAIRCOLORS, EYECOLORS, EYESHAPES };
