/* =====================================================
   梦幻衣橱 · 渲染层 v2
   2D 线条风正面角色 · 分层 SVG 组装 · 微动效
   体型轮廓由 data.js 共享函数提供，服装与身体天然贴合
   ===================================================== */

/* ---------- 体型模型：由角色参数推导所有锚点 ---------- */
function makeBody(charId){
  const c = CHARACTERS[charId];
  const cx = 160;
  const hr = 35 * c.head, hry = 41 * c.head;
  const cy = 100;
  const fs = c.head;                        // 面部/四肢缩放系数
  const neckW = 8.5 * fs * c.neck;
  const neckTop = cy + hry - 9;
  const shoulderY = neckTop + 14 + 7 * c.neck;
  const h = c.h;
  const chestY = shoulderY + 30 * h;
  const waistY = shoulderY + 74 * h;
  const hipY = shoulderY + 116 * h;
  const kneeY = hipY + 94 * h;
  const ankleY = kneeY + 102 * h;
  const footY = ankleY + 9;
  const shoulderHalf = 44 * c.sw;
  const chestHalf = 40 * c.ww;
  const waistHalf = 29 * c.ww;
  const hipHalf = 38 * c.hw;
  const armX = shoulderHalf - 2;
  const armW = 12.5 * fs;
  const elbowX = armX + 12 * fs, elbowY = shoulderY + 64 * h;
  const wristX = armX + 7 * fs,  wristY = shoulderY + 126 * h;
  const legGap = Math.max(9, hipHalf * 0.40);
  const legW = Math.max(12, Math.min(30, legGap * 1.6));
  const footX = legGap + 3;
  return { cx, cy, hr, hry, fs, neckW, neckTop, shoulderY, chestY, waistY, hipY, kneeY, ankleY, footY,
    shoulderHalf, chestHalf, waistHalf, hipHalf, armX, armW, elbowX, wristX, elbowY, wristY, legGap, legW, footX,
    skin: null, charId, char: c };
}

/* ---------- 五官 ---------- */
function eyeSVG(x, y, s, shape, eyeC, skin, big){
  const dk = '#2f2438';
  const ry = { round: 6, almond: 4.8, narrow: 3.3, sparkle: 6, sleepy: 5.6 }[shape] || 6;
  let iris = `<ellipse cx="${x}" cy="${y}" rx="${5.1 * s}" ry="${ry * s}" fill="${eyeC}"/>` +
    `<ellipse cx="${x}" cy="${y + 0.4 * s}" rx="${2.2 * s}" ry="${ry * s * 0.55}" fill="#241a2e"/>` +
    `<circle cx="${x - 1.8 * s}" cy="${y - 2.1 * s}" r="${1.7 * s}" fill="#fff"/>` +
    `<circle cx="${x + 1.9 * s}" cy="${y + 2.1 * s}" r="${0.9 * s}" fill="#fff" opacity=".85"/>`;
  if (shape === 'sparkle'){
    iris += `<circle cx="${x + 2.2 * s}" cy="${y - 2.6 * s}" r="${1.3 * s}" fill="#fff"/>` +
      `<circle cx="${x - 2.6 * s}" cy="${y + 1.4 * s}" r="${0.8 * s}" fill="#fff" opacity=".9"/>`;
  }
  let lash = `<path d="M ${x - 6.3 * s},${y - ry * s * 0.75} Q ${x},${y - (ry + 2.6) * s} ${x + 6.3 * s},${y - ry * s * 0.75}" stroke="${dk}" stroke-width="${2.2 * s}" fill="none" stroke-linecap="round"/>`;
  if (shape === 'narrow')
    lash = `<path d="M ${x - 6.3 * s},${y - ry * s * 0.8} Q ${x},${y - (ry + 2.2) * s} ${x + 6.3 * s},${y - ry * s * 0.8} M ${x + 5.6 * s},${y - ry * s * 0.55} q ${2.6 * s},${-0.6 * s} ${4 * s},${-2.6 * s}" stroke="${dk}" stroke-width="${2.2 * s}" fill="none" stroke-linecap="round"/>`;
  if (shape === 'almond')
    lash += `<path d="M ${x + 5.6 * s},${y - 2.6 * s} q ${2.8 * s},${-1 * s} ${4.2 * s},${-3.2 * s}" stroke="${dk}" stroke-width="${1.8 * s}" fill="none" stroke-linecap="round"/>`;
  if (shape === 'sleepy'){
    iris += `<path d="M ${x - 6.6 * s},${y - 0.6 * s} Q ${x},${y - 7 * s} ${x + 6.6 * s},${y - 0.6 * s} L ${x + 6.6 * s},${y - 5.5 * s} Q ${x},${y - 11 * s} ${x - 6.6 * s},${y - 5.5 * s} Z" fill="${skin}"/>` +
      `<path d="M ${x - 6.6 * s},${y - 0.8 * s} Q ${x},${y - 7.2 * s} ${x + 6.6 * s},${y - 0.8 * s}" stroke="${dk}" stroke-width="${2 * s}" fill="none" stroke-linecap="round"/>`;
  }
  return iris + lash;
}
function mouthSVG(b, type, fs){
  const { cx, cy } = b, my = cy + 24 * fs;
  const c1 = '#d96a7a';
  if (type === 'grin')
    return `<path d="M ${cx - 9 * fs},${my - 1} Q ${cx},${my + 8 * fs} ${cx + 9 * fs},${my - 1} Q ${cx},${my + 2 * fs} ${cx - 9 * fs},${my - 1} Z" fill="#e8756f"/>`;
  if (type === 'happy')
    return `<path d="M ${cx - 8 * fs},${my} Q ${cx},${my + 11 * fs} ${cx + 8 * fs},${my} Z" fill="#e0757f"/>` +
      `<path d="M ${cx - 5 * fs},${my + 0.5} Q ${cx},${my + 4 * fs} ${cx + 5 * fs},${my + 0.5} Z" fill="#ffb3c0"/>`;
  if (type === 'calm')
    return `<path d="M ${cx - 5 * fs},${my + 1} Q ${cx},${my + 3.5 * fs} ${cx + 5 * fs},${my + 1}" stroke="${c1}" stroke-width="${2 * fs}" fill="none" stroke-linecap="round"/>`;
  return `<path d="M ${cx - 6.5 * fs},${my} Q ${cx},${my + 5 * fs} ${cx + 6.5 * fs},${my}" stroke="${c1}" stroke-width="${2.1 * fs}" fill="none" stroke-linecap="round"/>`;
}
function faceSVG(b, cfg, skin, hairC){
  const { cx, cy, fs } = b;
  const eyeC = EYECOLORS[cfg.eyeColor], shape = cfg.eyeShape;
  const s = fs * (b.char.eyeBig || 1);
  const ex = 14.5 * fs, ey = cy + 5 * fs;
  const browC = shade(hairC, -0.3), browY = ey - 9.5 * s;
  let brows;
  if (b.char.mouth === 'calm')
    brows = [-1, 1].map(sd => `<line x1="${cx + sd * ex - 5 * s}" y1="${browY - 0.5}" x2="${cx + sd * ex + 5 * s}" y2="${browY - 0.5}" stroke="${browC}" stroke-width="${2 * s}" stroke-linecap="round"/>`).join('');
  else
    brows = [-1, 1].map(sd => `<path d="M ${cx + sd * ex - 5.2 * s},${browY + 1} Q ${cx + sd * ex},${browY - 3 * s} ${cx + sd * ex + 5.2 * s},${browY + 1}" stroke="${browC}" stroke-width="${2 * s}" fill="none" stroke-linecap="round"/>`).join('');
  const eyes = eyeSVG(cx - ex, ey, s, shape, eyeC, skin) + eyeSVG(cx + ex, ey, s, shape, eyeC, skin);
  const nose = `<path d="M ${cx + 1.5 * fs},${cy + 13 * fs} q ${2.5 * fs},${3 * fs} ${-0.5 * fs},${5.5 * fs}" stroke="${shade(skin, -0.2)}" stroke-width="${1.6 * fs}" fill="none" stroke-linecap="round"/>`;
  const mouth = mouthSVG(b, b.char.mouth, fs);
  const blush = b.char.lash ?
    [-1, 1].map(sd => `<ellipse cx="${cx + sd * 22 * fs}" cy="${cy + 17 * fs}" rx="${6.5 * fs}" ry="${3.4 * fs}" fill="#ff9db0" opacity=".38"/>`).join('') : '';
  return `<g id="g-eyes">${eyes}</g>${brows}${nose}${mouth}${blush}`;
}

/* ---------- 头部（含脖颈 / 耳朵 / 脸部） ---------- */
function headSVG(b, cfg, skin, hairC){
  const { cx, cy, hr, hry, fs, neckW, neckTop, shoulderY: sy } = b;
  const dk = shade(skin, -0.1);
  return `<g id="g-head">` +
    `<path d="M ${cx - neckW},${neckTop - 3} L ${cx - neckW},${sy + 6} Q ${cx},${sy + 14} ${cx + neckW},${sy + 6} L ${cx + neckW},${neckTop - 3} Z" fill="${dk}" stroke="${INK}" stroke-width="2.4"/>` +
    [-1, 1].map(sd => `<ellipse cx="${cx + sd * (hr + 1)}" cy="${cy + hry * 0.22}" rx="${5 * fs}" ry="${7.5 * fs}" fill="${skin}" stroke="${INK}" stroke-width="2.2"/>`).join('') +
    `<ellipse cx="${cx}" cy="${cy}" rx="${hr}" ry="${hry}" fill="${skin}" stroke="${INK}" stroke-width="3"/>` +
    `<g id="g-face" transform="translate(0,0)">${faceSVG(b, cfg, skin, hairC)}</g>` +
    `</g>`;
}

/* ---------- 身体（腿 + 脚 + 躯干 + 手臂 + 手） ---------- */
function bodySVG(b, skin){
  return [-1, 1].map(sd => limbPath(legPts(b, sd), b.legW, skin)).join('') +
    [-1, 1].map(sd => `<ellipse cx="${footCX(b, sd)}" cy="${b.footY}" rx="${11.5 * b.fs}" ry="${6.5 * b.fs}" fill="${skin}" stroke="${INK}" stroke-width="2.4"/>`).join('') +
    `<path d="${torsoPath(b, 0)}" fill="${skin}" stroke="${INK}" stroke-width="3"/>` +
    [-1, 1].map(sd => limbPath(armPts(b, sd), b.armW, skin)).join('') +
    [-1, 1].map(sd => `<circle cx="${b.cx + sd * b.wristX}" cy="${b.wristY + 5}" r="${5.8 * b.fs}" fill="${skin}" stroke="${INK}" stroke-width="2.4"/>`).join('');
}

/* ---------- 主渲染：完整角色（正面） ---------- */
function avatarSVG(cfg, opts){
  opts = opts || {};
  const b = makeBody(cfg.charId);
  const skin = cfg.skinColor || SKINS[cfg.skin];
  const hairC = HAIRCOLORS[cfg.hairColor];
  const it = cfg.items || {};
  const draw = id => ITEM_MAP[id] ? ITEM_MAP[id].draw(b) : '';
  const hair = HAIRSTYLES[cfg.hair];
  const hairBack = hair ? hair.back(b, hairC) : '';
  const hairFront = hair ? hair.front(b, hairC) : '';

  const layers = [
    ['hairback', hairBack],
    ['legs', bodySVG(b, skin)],
    ['shoes', it.shoes ? draw(it.shoes) : ''],
    ['bottom', it.bottom ? draw(it.bottom) : (it.skirt ? draw(it.skirt) : '')],
    ['dress', it.dress ? draw(it.dress) : ''],
    ['top', it.top ? draw(it.top) : ''],
    ['necklace', it.necklace ? draw(it.necklace) : ''],
    ['head', headSVG(b, cfg, skin, hairC)],
    ['hairfront', hairFront],
    ['hat', it.hat ? draw(it.hat) : ''],
    ['headwear', it.headwear ? draw(it.headwear) : ''],
    ['earrings', it.earrings ? draw(it.earrings) : ''],
  ];

  const inner = layers.map(([k, v]) => v ? `<g id="g-${k}" data-layer="${k}">${v}</g>` : '').join('');
  const shadowY = b.footY + 12;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 560" ${opts.attrs || ''}>` +
    `<ellipse cx="160" cy="${shadowY}" rx="${62 * b.fs}" ry="11" fill="rgba(10,5,30,.3)"/>` +
    `<g id="g-breath"><g id="g-figure">${inner}</g></g></svg>`;
}

/* ---------- 头顶出画构图：让发顶贴住画面上缘 ----------
   按当前角色 + 发型的实际最高点动态下移 viewBox 顶部，
   头顶被画面上缘裁掉（不露出），底边保持 560 不变；
   同步把舞台容器宽高比改为 320/(560-ny)，使画面与内容
   严丝合缝：头顶贴上缘、脚踩下缘，面部与比例不失真。
   返回裁剪量 ny（未裁返回 0） */
function applyTopCrop(svg, cfg){
  try{
    let top = Infinity;
    ['#g-hairback', '#g-hairfront', '#g-head'].forEach(sel => {
      const g = svg.querySelector(sel);
      if (g){ const bb = g.getBBox(); if (bb.height && bb.y < top) top = bb.y; }
    });
    if (top === Infinity) return 0;
    const b = makeBody(cfg.charId);
    const ny = Math.min(top + 4, b.cy - b.hry * 0.5);   // 微裁 4px，且绝不裁到额头
    if (ny <= 0) return 0;
    svg.setAttribute('viewBox', '0 ' + ny.toFixed(1) + ' 320 ' + (560 - ny).toFixed(1));
    return ny;
  } catch(e){ return 0; }
}

/* ---------- 渲染到舞台 ---------- */
function renderStage(el, cfg, opts){
  opts = opts || {};
  el.innerHTML = avatarSVG(cfg, { attrs: 'class="avatar-svg"' });
  const ny = applyTopCrop(el.querySelector('svg'), cfg);
  el.style.aspectRatio = ny > 0 ? ('320 / ' + (560 - ny).toFixed(1)) : '';
  el.classList.toggle('floor', true);
  (opts.changed || []).forEach(k => {
    const g = el.querySelector(`#g-${k}`);
    if (g){ g.classList.remove('pop'); void g.getBoundingClientRect(); g.classList.add('pop'); }
  });
  if (opts.swap){ el.classList.remove('char-swap'); void el.getBoundingClientRect(); el.classList.add('char-swap'); }
}

/* ---------- 眨眼调度 ---------- */
const blinkTimers = new Map();
function startBlink(el){
  stopBlink(el);
  const tick = () => {
    const eyes = el.querySelector('#g-eyes');
    if (eyes){
      eyes.classList.add('blink');
      setTimeout(() => eyes.classList.remove('blink'), 130);
    }
    blinkTimers.set(el, setTimeout(tick, 2600 + Math.random() * 2600));
  };
  blinkTimers.set(el, setTimeout(tick, 1800 + Math.random() * 2000));
}
function stopBlink(el){
  const t = blinkTimers.get(el);
  if (t){ clearTimeout(t); blinkTimers.delete(t); }
}

/* ---------- 小尺寸渲染（卡片缩略图 / 头像） ---------- */
const MANNEQUIN = { charId: 'yu', skin: 1, hair: null, hairColor: 5, eyeColor: 0, eyeShape: 'round', skinColor: '#ece7f2', items: {} };
function itemThumbSVG(itemId){
  const it = ITEM_MAP[itemId];
  if (!it) return '';
  const cfg = JSON.parse(JSON.stringify(MANNEQUIN));
  cfg.items[it.cat] = itemId;
  // 根据类别裁剪视野，让物品更突出
  let vb = '70 50 180 480';
  if (it.cat === 'top' || it.cat === 'dress' || it.cat === 'skirt' || it.cat === 'bottom') vb = '85 140 150 330';
  if (it.cat === 'shoes') vb = '90 400 140 130';
  if (it.cat === 'hat' || it.cat === 'headwear') vb = '85 4 150 158';
  if (it.cat === 'earrings' || it.cat === 'necklace') vb = '100 70 120 150';
  const svg = avatarSVG(cfg, { attrs: '' });
  return svg.replace('viewBox="0 0 320 560"', `viewBox="${vb}"`);
}
function headThumbSVG(cfg){
  const b = makeBody(cfg.charId);
  const vb = `${b.cx - 66} ${b.cy - b.hry - 42} 132 152`;
  const full = avatarSVG(cfg, { attrs: '' });
  return full.replace('viewBox="0 0 320 560"', `viewBox="${vb}"`);
}
function hairThumbSVG(hairId){
  const cfg = JSON.parse(JSON.stringify(MANNEQUIN));
  cfg.hair = hairId; cfg.skinColor = '#f2d8c8'; cfg.hairColor = 5;
  return headThumbSVG(cfg);
}
function eyeShapeThumbSVG(shapeId){
  const s = 2.2, ex = 30, ey = 34;
  const eye = eyeSVG(-ex, ey, s, shapeId, '#5a4a8a', '#f2d8c8') + eyeSVG(ex, ey, s, shapeId, '#5a4a8a', '#f2d8c8');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-60 4 120 62">${eye}</svg>`;
}
