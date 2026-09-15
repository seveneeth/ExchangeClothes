/* =====================================================
   梦幻衣橱 · 功能层
   本地存储 / 搭配评分 / 成就系统 / 分享卡片 / 特效
   ===================================================== */

/* ---------- 安全存储 ---------- */
const store = {
  get(key, def){
    try { const v = localStorage.getItem('dw_' + key); return v ? JSON.parse(v) : def; }
    catch (e){ return def; }
  },
  set(key, val){
    try { localStorage.setItem('dw_' + key, JSON.stringify(val)); } catch (e){}
  },
};

/* ---------- 搭配管理（最多 8 套） ---------- */
const MAX_OUTFITS = 8;
function getOutfits(){ return store.get('outfits', []); }
function saveOutfit(name, cfg, score){
  const list = getOutfits();
  if (list.length >= MAX_OUTFITS) return false;
  list.unshift({ name, cfg, score: score || null, time: Date.now() });
  store.set('outfits', list);
  return true;
}
function deleteOutfit(idx){
  const list = getOutfits();
  list.splice(idx, 1);
  store.set('outfits', list);
}

/* ---------- 颜色工具（评分用） ---------- */
function hexToHsl(hex){
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (mx + mn) / 2;
  if (mx !== mn){
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
function scoreOutfit(cfg){
  const it = cfg.items || {};
  const worn = Object.keys(it).filter(k => it[k] && ITEM_MAP[it[k]]);
  const items = worn.map(k => ITEM_MAP[it[k]]);
  const dims = {};

  /* 1. 完整度 35 分 */
  let complete = 0;
  if (it.dress || (it.top && (it.bottom || it.skirt))) complete += 18;
  else if (it.top || it.bottom || it.skirt) complete += 8;
  if (it.shoes) complete += 8;
  if (it.hat) complete += 3;
  complete += Math.min(6, [it.headwear, it.earrings, it.necklace].filter(Boolean).length * 2);
  dims.complete = Math.round(complete / 35 * 100);

  /* 2. 色彩和谐 30 分 */
  let harmony = 12; // 基础分
  const chroma = [];
  items.forEach(i => i.colors.forEach(c => {
    const [h, s] = hexToHsl(c);
    if (s > 0.22 && !(c === '#f6f6f8')) chroma.push(Math.round(h / 30) % 12);
  }));
  if (chroma.length){
    const fams = [...new Set(chroma)];
    if (fams.length === 1) harmony = 30;
    else if (fams.length === 2){
      const [a, b2] = fams;
      const gap = Math.min(Math.abs(a - b2), 12 - Math.abs(a - b2));
      harmony = gap <= 2 ? 28 : (gap >= 5 ? 22 : 18); // 相邻或互补都和谐，中间尴尬
    } else harmony = Math.max(8, 20 - (fams.length - 3) * 4);
  }
  dims.harmony = Math.round(harmony / 30 * 100);

  /* 3. 风格统一 25 分 */
  let style = 6;
  if (items.length){
    const tagCount = {};
    items.forEach(i => i.tags.forEach(t => tagCount[t] = (tagCount[t] || 0) + 1));
    const dom = Math.max(...Object.values(tagCount));
    const total = items.reduce((n, i) => n + i.tags.length, 0);
    style = Math.round(6 + 19 * (dom / total * 1.6 > 1 ? 1 : dom / total * 1.6));
  }
  dims.style = Math.round(style / 25 * 100);

  /* 4. 点睛度 10 分 */
  const bonus = [it.hat, it.headwear, it.earrings, it.necklace].filter(Boolean).length;
  dims.bonus = Math.round(Math.min(10, bonus * 2.5) / 10 * 100);

  const score = Math.round(complete / 35 * 35 + harmony / 30 * 30 + style / 25 * 25 + Math.min(10, bonus * 2.5));
  const stars = Math.max(1, Math.min(5, Math.round(score / 20)));

  /* 评语与建议 */
  const best = Object.entries(dims).sort((a, b2) => b2[1] - a[1])[0][0];
  const praise = {
    complete: '整套Look相当完整，从上到下都安排得明明白白！',
    harmony:  '色彩感觉一流，配色和谐又高级！',
    style:    '风格超级统一，主题感十足，像从杂志里走出来的！',
    bonus:    '配饰点睛太绝了，细节控狂喜！',
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
    [0,  '🌱 刚起步的穿搭，多试试不同单品吧'],
  ];
  const comment = comments.find(c => score >= c[0])[1] + ' ' + praise[best];

  return { score, stars, dims, comment, tips: tips.slice(0, 3) };
}

/* ---------- 成就系统 ---------- */
const ACHIEVEMENTS = [
  { id: 'first',    icon: '👗', name: '初次登场',   desc: '第一次换装',           goal: 1,  type: 'count', key: 'dressed' },
  { id: 'fullset',  icon: '🧥', name: '全套出击',   desc: '同时穿上衣、下装和鞋子', goal: 1,  type: 'flag',  key: 'fullset' },
  { id: 'try30',    icon: '🛍️', name: '试衣间常客', desc: '试穿 30 件不同单品',    goal: 30, type: 'set',   key: 'tried' },
  { id: 'dress5',   icon: '👑', name: '裙子收藏家', desc: '试穿 5 条不同连衣裙',   goal: 5,  type: 'set',   key: 'triedDress' },
  { id: 'save5',    icon: '💾', name: '收藏爱好者', desc: '保存 5 套搭配',         goal: 5,  type: 'count', key: 'saved' },
  { id: 'color8',   icon: '🎨', name: '发色魔法师', desc: '尝试 8 种不同发色',     goal: 8,  type: 'set',   key: 'hairTried' },
  { id: 'style20',  icon: '🔄', name: '百变星人',   desc: '累计更换 20 次造型',    goal: 20, type: 'count', key: 'dressed' },
  { id: 'random10', icon: '🎲', name: '命运搭配师', desc: '使用 10 次随机搭配',    goal: 10, type: 'count', key: 'randoms' },
  { id: 'perfect',  icon: '⭐', name: '完美瞬间',   desc: '获得 90 分以上评分',    goal: 1,  type: 'flag',  key: 'perfect' },
  { id: 'share1',   icon: '📤', name: '分享达人',   desc: '分享一次搭配',          goal: 1,  type: 'count', key: 'shared' },
  { id: 'allcat',   icon: '🏅', name: '十八般武艺', desc: '佩戴过全部服饰类别',    goal: 9,  type: 'set',   key: 'cats' },
];
const CAT_KEYS = ['top', 'bottom', 'skirt', 'dress', 'shoes', 'hat', 'headwear', 'earrings', 'necklace'];

const achState = store.get('ach', { progress: {}, unlocked: [] });

function achProgress(a){
  if (achState.unlocked.includes(a.id)) return { cur: a.goal, done: true };
  const p = achState.progress[a.key] || {};
  if (a.type === 'set') return { cur: (p.items || []).length, done: false };
  if (a.type === 'count') return { cur: p.n || 0, done: false };
  return { cur: p.done ? 1 : 0, done: false };
}
function achTrack(key, action, val){
  const p = achState.progress[key] = achState.progress[key] || {};
  if (action === 'set'){ p.items = p.items || []; if (!p.items.includes(val)) p.items.push(val); }
  else if (action === 'inc') p.n = (p.n || 0) + (val || 1);
  else if (action === 'flag') p.done = true;
  store.set('ach', achState);
}
function achCheck(){
  const newly = [];
  ACHIEVEMENTS.forEach(a => {
    if (achState.unlocked.includes(a.id)) return;
    const { cur } = achProgress(a);
    if (cur >= a.goal){ achState.unlocked.push(a.id); newly.push(a); }
  });
  if (newly.length) store.set('ach', achState);
  return newly;
}

/* ---------- Toast ---------- */
function toast(msg, gold){
  const box = document.getElementById('toasts');
  const t = document.createElement('div');
  t.className = 'toast' + (gold ? ' gold' : '');
  t.textContent = msg;
  box.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, 2300);
  while (box.children.length > 4) box.firstChild.remove();
}

/* ---------- 撒花 ---------- */
function confetti(n){
  const box = document.getElementById('confetti');
  const emojis = ['✨', '🎉', '💖', '⭐', '🌸', '🎀', '💫'];
  for (let i = 0; i < (n || 18); i++){
    const p = document.createElement('span');
    p.className = 'confetti-p';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = Math.random() * 100 + 'vw';
    p.style.top = (-4) + 'vh';
    p.style.fontSize = (12 + Math.random() * 14) + 'px';
    p.style.animationDuration = (1.6 + Math.random() * 1.6) + 's';
    p.style.animationDelay = (Math.random() * 0.5) + 's';
    box.appendChild(p);
    setTimeout(() => p.remove(), 3600);
  }
}

/* ---------- 分享卡片 ---------- */
function makeShareCard(cfg, scoreInfo){
  return new Promise(resolve => {
    const W = 750, H = 1000;
    const canvas = document.createElement('canvas');
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext('2d');
    // 背景
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#3a2a63'); g.addColorStop(0.55, '#4a2a6d'); g.addColorStop(1, '#1d1438');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // 装饰圆
    ctx.globalAlpha = 0.1; ctx.fillStyle = '#ff7eb6';
    ctx.beginPath(); ctx.arc(90, 130, 160, 0, 7); ctx.fill();
    ctx.fillStyle = '#5eead4';
    ctx.beginPath(); ctx.arc(680, 860, 190, 0, 7); ctx.fill();
    ctx.globalAlpha = 1;
    // 标题
    ctx.fillStyle = '#ffd76e'; ctx.font = '800 52px "PingFang SC","Microsoft YaHei",sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎀 梦幻衣橱 · 我的穿搭 🎀', W / 2, 110);
    // 白色展台
    const px = 135, py = 170, pw = W - 270, ph = 620;
    ctx.fillStyle = 'rgba(255,255,255,.94)';
    roundRect(ctx, px, py, pw, ph, 28); ctx.fill();
    // 角色
    const svg = avatarSVG(cfg, {});
    const img = new Image();
    img.onload = () => {
      const ih = ph - 60, iw = ih * (320 / 560);
      ctx.drawImage(img, W / 2 - iw / 2, py + 30, iw, ih);
      // 下方信息
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
      ctx.font = '700 40px "PingFang SC","Microsoft YaHei",sans-serif';
      ctx.fillText(CHARACTERS[cfg.charId].name + ' 的今日穿搭', W / 2, 850);
      if (scoreInfo){
        ctx.font = '700 34px sans-serif';
        ctx.fillStyle = '#ffd76e';
        ctx.fillText('★'.repeat(scoreInfo.stars) + '☆'.repeat(5 - scoreInfo.stars) + '  ' + scoreInfo.score + ' 分', W / 2, 906);
      }
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.font = '24px sans-serif';
      ctx.fillText(new Date().toLocaleDateString('zh-CN') + ' · 快来打造你的梦幻衣橱吧', W / 2, 952);
      resolve(canvas);
    };
    img.onerror = () => resolve(canvas);
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
}
function roundRect(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function downloadCanvas(canvas, name){
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = name || 'my-outfit.png';
  document.body.appendChild(a); a.click(); a.remove();
}
