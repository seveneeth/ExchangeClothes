/* =========================================================================
   梦幻衣橱 · 纯 SVG 生成模块（由原 web-prototype/data.js + render.js 移植）
   纯函数，无 DOM 依赖：输入 cfg，输出完整角色的 SVG 字符串。
   uni-app 端把 SVG 转 base64 后交给 <image> 渲染（H5 / App 均可显示）。
   ========================================================================= */

/* ---------- 颜色工具 ---------- */
export function shade(hex, p) { // p: -1 变暗 ~ 1 变亮
  if (!hex) return hex;
  if (hex.indexOf('url(') === 0) return hex; // 渐变引用不改色
  const n = parseInt(hex.slice(1), 16);
  if (isNaN(n)) return hex;
  let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const t = p < 0 ? 0 : 255, a = Math.abs(p);
  r = Math.round(r + (t - r) * a); g = Math.round(g + (t - g) * a); b = Math.round(b + (t - b) * a);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}

function heart(x, y, s, fill, extra) {
  return `<path d="M ${x},${y + s * 0.9} C ${x - s * 1.4},${y - s * 0.4} ${x - s * 0.6},${y - s * 1.5} ${x},${y - s * 0.4} C ${x + s * 0.6},${y - s * 1.5} ${x + s * 1.4},${y - s * 0.4} ${x},${y + s * 0.9} Z" fill="${fill}" ${extra || ''}/>`;
}
function star5(cx, cy, r, fill, extra) {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const rr = i % 2 === 0 ? r : r * 0.45;
    const a = -Math.PI / 2 + i * Math.PI / 5;
    d += (i === 0 ? 'M' : 'L') + (cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1);
  }
  return `<path d="${d} Z" fill="${fill}" ${extra || ''}/>`;
}
function waveEdge(x0, x1, y, waves, amp) { // 波浪下摆（支持任意方向）
  const w = (x1 - x0) / waves; let d = '';
  for (let i = 0; i < waves; i++) {
    const a = x0 + i * w;
    d += ` Q ${(a + w * 0.5).toFixed(1)},${(y + amp).toFixed(1)} ${(a + w).toFixed(1)},${y}`;
  }
  return d;
}
function bodyHalfAt(b, y) { // 躯干在某 y 的半宽
  const pts = [[b.shoulderY, b.shoulderHalf], [b.chestY, b.chestHalf], [b.waistY, b.waistHalf], [b.hipY, b.hipHalf]];
  if (y <= pts[0][0]) return pts[0][1];
  for (let i = 1; i < pts.length; i++) {
    if (y <= pts[i][0]) {
      const t = (y - pts[i - 1][0]) / (pts[i][0] - pts[i - 1][0]);
      return pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t;
    }
  }
  return pts[3][1];
}

/* ---------- 线稿风格 ---------- */
export const INK = '#4a3455';
function inked(fill, w) { return `fill="${fill}" stroke="${INK}" stroke-width="${w || 2.6}" stroke-linejoin="round"`; }
function limbPath(pts, w, color) { // 双描边：墨线粗描 + 彩色细描
  return `<path d="${pts}" stroke="${INK}" stroke-width="${w + 3.2}" fill="none" stroke-linecap="round"/>` +
    `<path d="${pts}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
}

/* ---------- 共享体型轮廓（角色与服装同一套函数，保证贴合） ---------- */
function armPts(b, side) {
  const { cx, shoulderY: sy, armX, elbowX, elbowY, wristX, wristY } = b;
  return `M ${cx + side * armX},${sy + 8} Q ${cx + side * elbowX},${elbowY} ${cx + side * wristX},${wristY}`;
}
function armPtsT(b, side, t) {
  const { cx, shoulderY: sy, armX, elbowX, elbowY, wristX, wristY } = b;
  const x0 = cx + side * armX, y0 = sy + 8;
  const x1 = cx + side * elbowX, y1 = elbowY;
  const x2 = cx + side * wristX, y2 = wristY;
  const u = 1 - t;
  const bx = u * u * x0 + 2 * u * t * x1 + t * t * x2;
  const by = u * u * y0 + 2 * u * t * y1 + t * t * y2;
  return `M ${x0.toFixed(1)},${y0} Q ${x1.toFixed(1)},${y1} ${bx.toFixed(1)},${by.toFixed(1)}`;
}
function legPts(b, side, endY) {
  const { cx, hipY: hy, ankleY, legGap } = b;
  const y2 = endY || ankleY;
  const t = Math.max(0, Math.min(1, (y2 - hy - 6) / (ankleY - hy - 6)));
  return `M ${cx + side * legGap},${hy + 6} L ${(cx + side * (legGap - 1.5 * t)).toFixed(1)},${y2}`;
}
function legCenterX(b, side, y) {
  const { hipY: hy, ankleY, legGap } = b;
  const t = Math.max(0, Math.min(1, (y - hy - 6) / (ankleY - hy - 6)));
  return b.cx + side * (legGap - 1.5 * t);
}
function footCX(b, side) { return b.cx + side * b.footX; }
function torsoPath(b, e) {
  e = e || 0;
  const { cx, shoulderY: sy, waistY: wy, hipY: hy, shoulderHalf: sh, chestHalf: ch, waistHalf: wh, hipHalf: hh } = b;
  return `M ${cx - sh - e},${sy + 2}
    C ${cx - ch - e - 1},${sy + 16} ${cx - wh - e + 1},${wy - 11} ${cx - wh - e},${wy + 7}
    C ${cx - wh - e - 1},${hy - 11} ${cx - hh - e},${hy - 3} ${cx - hh - e},${hy + 7}
    Q ${cx},${hy + 19} ${cx + hh + e},${hy + 7}
    C ${cx + hh + e},${hy - 3} ${cx + wh + e + 1},${hy - 11} ${cx + wh + e},${wy + 7}
    C ${cx + wh + e + 1},${wy - 11} ${cx + ch + e + 1},${sy + 16} ${cx + sh + e},${sy + 2}
    Q ${cx},${sy + 13} ${cx - sh - e},${sy + 2} Z`;
}
function torsoTopPath(b, e, hemY) {
  const { cx, shoulderY: sy, waistY: wy, shoulderHalf: sh, chestHalf: ch, waistHalf: wh } = b;
  const hw = bodyHalfAt(b, hemY) + e;
  return `M ${cx - sh - e},${sy + 2}
    C ${cx - ch - e - 1},${sy + 16} ${cx - wh - e + 1},${wy - 11} ${cx - hw},${hemY}
    L ${cx + hw},${hemY}
    C ${cx + wh + e + 1},${wy - 11} ${cx + ch + e + 1},${sy + 16} ${cx + sh + e},${sy + 2}
    Q ${cx},${sy + 13} ${cx - sh - e},${sy + 2} Z`;
}

/* ---------- 调色板 ---------- */
export const SKINS = ['#ffe3d0', '#fcd0b0', '#f2b98e', '#dda27a', '#b37a50', '#8a5a38'];
export const HAIRCOLORS = ['#2b2b33', '#5b3a29', '#8a5a33', '#c98a3d', '#f0cd7a', '#e87a8f', '#a78bfa', '#5eb8f0', '#7dc9a0', '#e8e4ee'];
export const EYECOLORS = ['#4a3b2a', '#2f6f4f', '#3a6ea8', '#7a4fd0', '#c05a3a', '#d47fa6', '#e0a63c', '#7a828e'];
export const EYESHAPES = [
  { id: 'round', name: '圆圆眼' },
  { id: 'almond', name: '杏眼' },
  { id: 'narrow', name: '丹凤眼' },
  { id: 'sparkle', name: '星光眼' },
  { id: 'sleepy', name: '睡眼' },
];

/* ---------- 6 位角色 ---------- */
export const CHARACTERS = {
  yu: { name: '小玉', desc: '纤细 · 甜美系', head: 1.00, sw: 0.94, ww: 0.90, hw: 1.00, h: 1.00, neck: 1.00, mouth: 'smile', lash: true,
    preset: { hair: 'long', hairColor: 1, skin: 1, eyeColor: 3, eyeShape: 'almond', items: { top: 't1', bottom: 'p1', shoes: 'sh1' } } },
  zhe: { name: '阿哲', desc: '阳光 · 运动系', head: 0.96, sw: 1.24, ww: 1.08, hw: 0.98, h: 1.05, neck: 1.18, mouth: 'grin', lash: false,
    preset: { hair: 'short', hairColor: 0, skin: 2, eyeColor: 0, eyeShape: 'narrow', items: { top: 't2', bottom: 'p4', shoes: 'sh1' } } },
  yuan: { name: '圆圆', desc: '圆润 · 可爱系', head: 1.05, sw: 1.10, ww: 1.42, hw: 1.38, h: 0.96, neck: 1.05, mouth: 'happy', lash: true,
    preset: { hair: 'curly', hairColor: 4, skin: 0, eyeColor: 6, eyeShape: 'round', items: { dress: 'd1', shoes: 'sh4', necklace: 'n1' } } },
  man: { name: '小满', desc: '活泼 · 小不点', head: 1.28, sw: 0.80, ww: 0.82, hw: 0.85, h: 0.78, neck: 0.92, mouth: 'happy', lash: true, eyeBig: 1.28,
    preset: { hair: 'twin', hairColor: 3, skin: 0, eyeColor: 1, eyeShape: 'sparkle', items: { top: 't6', bottom: 'p2', shoes: 'sh1', headwear: 'hw1' } } },
  gao: { name: '高小姐', desc: '高挑 · 优雅系', head: 0.94, sw: 0.96, ww: 0.86, hw: 1.02, h: 1.10, neck: 1.05, mouth: 'calm', lash: true,
    preset: { hair: 'bun', hairColor: 0, skin: 1, eyeColor: 4, eyeShape: 'narrow', items: { dress: 'd5', shoes: 'sh5', earrings: 'e1' } } },
  chen: { name: '老陈', desc: '敦厚 · 暖心系', head: 1.04, sw: 1.20, ww: 1.30, hw: 1.14, h: 0.92, neck: 1.22, mouth: 'smile', lash: false,
    preset: { hair: 'buzz', hairColor: 1, skin: 3, eyeColor: 7, eyeShape: 'round', items: { top: 't3', bottom: 'p1', shoes: 'sh2' } } },
};

/* ---------- 服装绘制基础件 ---------- */
function topBase(b, o) {
  const { cx, shoulderY: sy, waistY: wy, neckW } = b;
  const c = o.c, dk = o.dk || shade(c, -0.18);
  const e = o.slim ? 3 : 5.5;
  const hemY = o.hemY || wy + 10;
  let s = `<path d="${torsoTopPath(b, e, hemY)}" ${inked(c)}/>`;
  const collar = o.collar || 'round';
  if (collar === 'round')
    s += `<path d="M ${cx - neckW - 3},${sy + 3} Q ${cx},${sy + 16} ${cx + neckW + 3},${sy + 3}" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
  else if (collar === 'v')
    s += `<path d="M ${cx - neckW - 5},${sy + 1} L ${cx},${sy + 30} L ${cx + neckW + 5},${sy + 1}" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linejoin="round"/>`;
  if (o.hood) {
    s += `<path d="M ${cx - b.shoulderHalf * 0.74},${sy - 3} Q ${cx},${sy - 30} ${cx + b.shoulderHalf * 0.74},${sy - 3} Q ${cx + b.shoulderHalf * 0.5},${sy + 9} ${cx},${sy + 5} Q ${cx - b.shoulderHalf * 0.5},${sy + 9} ${cx - b.shoulderHalf * 0.74},${sy - 3} Z" ${inked(dk, 2.2)}/>` +
      `<line x1="${cx - 5}" y1="${sy + 8}" x2="${cx - 6}" y2="${sy + 24}" stroke="#fff" stroke-width="2" stroke-linecap="round"/><line x1="${cx + 5}" y1="${sy + 8}" x2="${cx + 6}" y2="${sy + 24}" stroke="#fff" stroke-width="2" stroke-linecap="round"/>`;
  }
  if (o.pocket) {
    const pw = b.waistHalf * 0.95;
    s += `<rect x="${cx - pw / 2}" y="${hemY - 17}" width="${pw}" height="13" rx="4" fill="none" stroke="${INK}" stroke-width="2" opacity=".75"/>`;
  }
  if (o.stripes) {
    [sy + 24, sy + 42, sy + 60].forEach(y => {
      if (y < hemY - 4) {
        const hw2 = bodyHalfAt(b, y) + e - 1;
        s += `<rect x="${cx - hw2}" y="${y}" width="${hw2 * 2}" height="6.5" rx="3.2" fill="${o.stripes}" opacity=".92"/>`;
      }
    });
  }
  if (o.buttons) {
    [0.3, 0.55, 0.8].forEach(t => {
      const y = sy + 14 + (hemY - sy - 14) * t;
      s += `<circle cx="${cx}" cy="${y}" r="1.9" fill="${INK}" opacity=".8"/>`;
    });
    s += `<line x1="${cx}" y1="${sy + 10}" x2="${cx}" y2="${hemY - 2}" stroke="${INK}" stroke-width="1.4" opacity=".55"/>`;
  }
  s += sleeveSVG(b, o.sleeve, c, dk);
  if (o.hemLine) s += `<line x1="${cx - (bodyHalfAt(b, hemY) + e - 2)}" y1="${hemY - 3}" x2="${cx + (bodyHalfAt(b, hemY) + e - 2)}" y2="${hemY - 3}" stroke="${dk}" stroke-width="2" opacity=".6"/>`;
  return s;
}
function sleeveSVG(b, type, c, dk) {
  if (!type || type === 'none') return '';
  const { cx, shoulderY: sy, chestHalf, chestY, armX, armW, wristX, wristY } = b;
  if (type === 'strap')
    return [-1, 1].map(sd => `<path d="M ${cx + sd * (armX - 4)},${sy + 3} L ${cx + sd * chestHalf * 0.58},${chestY - 4}" stroke="${c}" stroke-width="6" stroke-linecap="round"/>`).join('');
  if (type === 'puff')
    return [-1, 1].map(sd => `<circle cx="${cx + sd * (armX + 0.5)}" cy="${sy + 10}" r="${12.5 * b.fs}" ${inked(c, 2.2)}/>`).join('');
  if (type === 'wide')
    return [-1, 1].map(sd =>
      limbPath(armPts(b, sd), armW * 2.35, c) +
      `<ellipse cx="${cx + sd * (wristX + 5)}" cy="${wristY - 3}" rx="${10 * b.fs}" ry="${14 * b.fs}" ${inked(dk, 2)} opacity=".9"/>`
    ).join('');
  if (type === 'long')
    return [-1, 1].map(sd =>
      limbPath(armPts(b, sd), armW + 4.5, c) +
      `<circle cx="${cx + sd * wristX}" cy="${wristY - 3}" r="${(armW + 4.5) / 2 + 1}" fill="${dk}" stroke="${INK}" stroke-width="1.6"/>`
    ).join('');
  return [-1, 1].map(sd => limbPath(armPtsT(b, sd, 0.45), armW + 6, c)).join('');
}
function pantsBase(b, o) {
  const { cx, waistY: wy, hipY: hy, hipHalf: hh, waistHalf: wh, kneeY, ankleY, legW } = b;
  const c = o.c, dk = o.dk || shade(c, -0.2);
  const endY = o.len === 'short' ? hy + (kneeY - hy) * 0.5 : ankleY - 4;
  const w = o.slim ? legW + 2 : legW + 4.5;
  let s = '';
  // 腿带先画（在下），臀部后画（在上），让“长条(腿)位于偏圆形臀部下方”
  [-1, 1].forEach(sd => {
    const lx = legCenterX(b, sd, endY);
    s += limbPath(legPts(b, sd, endY), w, c);
    if (o.cuffs)
      s += `<rect x="${lx - w / 2 - 1}" y="${endY - 9}" width="${w + 2}" height="9" rx="4" fill="${dk}" stroke="${INK}" stroke-width="1.6"/>`;
    if (o.cargoPockets)
      s += `<rect x="${lx - w * 0.38}" y="${(hy + kneeY) / 2 - 8}" width="${w * 0.76}" height="14" rx="3.5" fill="${dk}" opacity=".9" stroke="${INK}" stroke-width="1.4"/>`;
  });
  s += `<path d="M ${cx - wh - 3},${wy - 2} L ${cx + wh + 3},${wy - 2}
    C ${cx + hh + 7},${hy + 1} ${cx + hh + 5},${hy + 15} ${cx + hh * 0.22},${hy + 19}
    L ${cx - hh * 0.22},${hy + 19}
    C ${cx - hh - 5},${hy + 15} ${cx - hh - 7},${hy + 1} ${cx - wh - 3},${wy - 2} Z" ${inked(c)}/>`;
  s += `<rect x="${cx - wh - 3}" y="${wy - 2}" width="${(wh + 3) * 2}" height="7" rx="3" fill="${dk}" stroke="${INK}" stroke-width="1.8"/>`;
  if (o.belt) s += `<rect x="${cx - wh - 3.5}" y="${wy - 3}" width="${(wh + 3.5) * 2}" height="6" rx="3" fill="${o.belt}"/><rect x="${cx - 4}" y="${wy - 3.5}" width="8" height="7" rx="2" fill="${shade(o.belt, 0.3)}"/>`;
  return s;
}
function skirtBase(b, o) {
  const { cx, waistY: wy, waistHalf: wh, hipHalf: hh } = b;
  const c = o.c, dk = o.dk || shade(c, -0.16);
  const hw = wh + (hh - wh) * 0.5 + wh * o.flare + 6;
  const hemY = wy + o.len;
  let s = `<path d="M ${cx - wh - 3},${wy - 2} L ${cx - hw},${hemY} ${o.hem === 'wave' ? waveEdge(cx - hw, cx + hw, hemY, o.waves || 5, o.amp || 5) : `L ${cx + hw},${hemY}`} C ${cx + hw},${hemY - 10} ${cx + hw * 0.8},${hemY - 26} ${cx + wh + 3},${wy - 2} Z" ${inked(c)}/>`;
  s += `<rect x="${cx - wh - 3}" y="${wy - 3}" width="${(wh + 3) * 2}" height="8" rx="3.5" fill="${dk}" stroke="${INK}" stroke-width="1.8"/>`;
  if (o.pleats) {
    for (let i = 1; i <= 5; i++) {
      const t = i / 6;
      s += `<line x1="${cx - wh * 0.85 + t * wh * 1.7}" y1="${wy + 12}" x2="${cx - hw * 0.88 + t * hw * 1.76}" y2="${hemY - 4}" stroke="${dk}" stroke-width="1.8" opacity=".45"/>`;
    }
  }
  if (o.plaid) {
    const c2 = o.plaid;
    for (let i = 1; i <= 4; i++) {
      const t = i / 5;
      s += `<line x1="${cx - wh * 0.8 + t * wh * 1.6}" y1="${wy + 10}" x2="${cx - hw * 0.85 + t * hw * 1.7}" y2="${hemY - 3}" stroke="${c2}" stroke-width="2.4" opacity=".65"/>`;
    }
    [0.3, 0.55, 0.8].forEach(t => {
      const y = wy + 10 + (hemY - wy - 10) * t;
      const hw2 = wh + (hw - wh) * t;
      s += `<line x1="${cx - hw2 * 0.92}" y1="${y}" x2="${cx + hw2 * 0.92}" y2="${y}" stroke="${c2}" stroke-width="2.2" opacity=".6"/>`;
    });
  }
  if (o.layers) { // 蛋糕裙层叠
    [0.45, 0.72].forEach((t, i) => {
      const y = wy + o.len * t, hw2 = wh + (hw - wh) * t;
      s += `<path d="M ${cx - hw2 * 0.94},${y} ${waveEdge(cx - hw2 * 0.94, cx + hw2 * 0.94, y, 6, 4)} " fill="none" stroke="${shade(c, i ? -0.1 : 0.22)}" stroke-width="3" opacity=".8"/>`;
    });
  }
  if (o.pocket) s += `<rect x="${cx + hw * 0.25}" y="${wy + o.len * 0.35}" width="14" height="12" rx="3" fill="${dk}" opacity=".85" stroke="${INK}" stroke-width="1.4"/>`;
  return s;
}
function dressBase(b, o) {
  const { cx, waistY: wy, waistHalf: wh } = b;
  const bc = o.bodiceC || o.c, sk = o.skirtC || o.c;
  const bdk = o.dk || shade(bc, -0.16), sdk = shade(sk, -0.14);
  let s = skirtBase(b, { c: sk, dk: sdk, len: o.len, flare: o.flare, hem: o.hem, waves: o.waves, amp: o.amp, layers: o.layers });
  s += topBase(b, { c: bc, dk: bdk, hemY: wy + 6, collar: o.collar || 'round', sleeve: o.sleeve || 'none' });
  if (o.wrap) { // 汉服交领
    const { shoulderY: sy, neckW } = b;
    s += `<path d="M ${cx - neckW - 6},${sy + 2} L ${cx + wh * 0.55},${wy + 2} L ${cx + wh * 0.55},${wy - 5} L ${cx - neckW - 6},${sy - 4} Z" fill="${o.wrap}" opacity=".95"/>` +
      `<path d="M ${cx + neckW + 6},${sy + 2} L ${cx - wh * 0.2},${wy + 2} L ${cx - wh * 0.2},${wy - 5} L ${cx + neckW + 6},${sy - 4} Z" fill="${o.wrap}"/>`;
  }
  if (o.sash) {
    s += `<rect x="${cx - wh - 4}" y="${wy - 4}" width="${(wh + 4) * 2}" height="9" rx="4" fill="${o.sash}"/>`;
    if (o.bowKnot) s += bowSVG(cx + wh * 0.7, wy, 8, o.sash);
  }
  if (o.flowers) {
    (o.flowerPos || [[-0.4, 0.3], [0.35, 0.55], [-0.1, 0.8]]).forEach(([fx, fy]) => {
      const fx2 = cx + fx * wh * 1.4, fy2 = wy + o.len * fy * 0.6 + 10;
      s += `<circle cx="${fx2}" cy="${fy2}" r="4.5" fill="${o.flowers}"/><circle cx="${fx2}" cy="${fy2}" r="1.8" fill="${shade(o.flowers, 0.45)}"/>`;
    });
  }
  if (o.seqDots) {
    for (let i = 0; i < 14; i++) {
      const t = i / 14, y = b.shoulderY + 20 + (wy + o.len * 0.8 - b.shoulderY - 20) * ((i * 7) % 10) / 10;
      const hw2 = bodyHalfAt(b, Math.min(y, b.hipY)) + wh * 0.9 * t;
      const x = cx + (((i * 13) % 20) / 10 - 1) * hw2 * 0.8;
      s += star5(x, y, 2.2, '#fff', 'opacity=".9"');
    }
  }
  if (o.slit) {
    const hemY = wy + o.len, x0 = cx + (wh + (b.hipHalf - wh) * 0.5 + wh * o.flare + 6) * 0.45;
    s += `<path d="M ${x0},${hemY} L ${x0 * 1.02 - cx * 0.02 + cx},${hemY - o.len * 0.45}" stroke="${INK}" stroke-width="3" stroke-linecap="round" opacity=".5"/>`;
  }
  return s;
}
function bowSVG(x, y, s, c, dk) {
  dk = dk || shade(c, -0.2);
  return `<path d="M ${x},${y} L ${x - s * 1.7},${y - s} L ${x - s * 1.5},${y + s * 0.9} Z" fill="${c}"/>` +
    `<path d="M ${x},${y} L ${x + s * 1.7},${y - s} L ${x + s * 1.5},${y + s * 0.9} Z" fill="${c}"/>` +
    `<circle cx="${x}" cy="${y}" r="${s * 0.42}" fill="${dk}"/>`;
}
function shoesBase(b, o) {
  const c = o.c, dk = shade(c, -0.22), sole = o.sole || '#f6f3f8';
  let s = '';
  [-1, 1].forEach(sd => {
    const x = footCX(b, sd), fy = b.footY, ay = b.ankleY, w = 14.5 * b.fs;
    if (o.type === 'sneaker' || o.type === 'canvas') {
      s += `<rect x="${x - w}" y="${fy - 8 * b.fs}" width="${2 * w}" height="${15 * b.fs}" rx="${7 * b.fs}" ${inked(c)}/>` +
        `<path d="M ${x - w + 1.5},${fy + 3 * b.fs} L ${x + w - 1.5},${fy + 3 * b.fs}" stroke="${sole}" stroke-width="${3.5 * b.fs}" stroke-linecap="round"/>`;
      if (o.type === 'sneaker')
        s += `<path d="M ${x + sd * w * 0.15},${fy - 4 * b.fs} L ${x + sd * w * 0.72},${fy - 4 * b.fs} M ${x + sd * w * 0.15},${fy - 0.5 * b.fs} L ${x + sd * w * 0.72},${fy - 0.5 * b.fs}" stroke="${shade(c, -0.28)}" stroke-width="1.5" opacity=".7"/>`;
      else
        s += `<rect x="${x - w + 2}" y="${fy - 2}" width="${2 * w - 4}" height="2.8" fill="${o.accent || '#e86a6a'}" opacity=".9"/>`;
    } else if (o.type === 'leather') {
      s += `<ellipse cx="${x + sd * 1.5}" cy="${fy + 0.5}" rx="${w}" ry="${7.8 * b.fs}" ${inked(c)}/>` +
        `<path d="M ${x - w * 0.5},${fy + 2} Q ${x + sd * 1.5},${fy - 3.5 * b.fs} ${x + w * 0.45},${fy + 1}" stroke="${shade(c, 0.3)}" stroke-width="1.6" fill="none"/>`;
    } else if (o.type === 'boot') {
      const bw = w * 0.92, topY = ay - 34 * b.fs;
      s += `<path d="M ${x - bw},${fy + 7 * b.fs} L ${x - bw},${topY + 6 * b.fs} Q ${x - bw},${topY} ${x - bw + 7 * b.fs},${topY} L ${x + bw - 7 * b.fs},${topY} Q ${x + bw},${topY} ${x + bw},${topY + 6 * b.fs} L ${x + bw},${fy + 7 * b.fs} Z" ${inked(c)}/>` +
        `<rect x="${x - bw + 1}" y="${fy + 3 * b.fs}" width="${2 * bw - 2}" height="${4 * b.fs}" rx="2" fill="${sole}"/>` +
        `<rect x="${x - 4.5 * b.fs}" y="${ay - 22 * b.fs}" width="${9 * b.fs}" height="${3.5 * b.fs}" rx="1.8" fill="${shade(c, 0.35)}"/>`;
    } else if (o.type === 'sandal') {
      s += `<ellipse cx="${x}" cy="${fy + 3.5}" rx="${w}" ry="${5.5 * b.fs}" ${inked(c)}/>` +
        `<path d="M ${x - w * 0.6},${fy + 2} L ${x + w * 0.55},${fy - 3.5 * b.fs} M ${x - w * 0.6},${fy - 3.5 * b.fs} L ${x + w * 0.55},${fy + 2}" stroke="${dk}" stroke-width="3" stroke-linecap="round"/>` +
        `<path d="M ${x - w * 0.7},${ay + 3} Q ${x},${ay - 2} ${x + w * 0.7},${ay + 3}" stroke="${dk}" stroke-width="2.6" fill="none"/>`;
    } else if (o.type === 'heels') {
      s += `<path d="M ${x - w * 0.85},${fy + 4.5} Q ${x - w * 0.2},${fy - 7 * b.fs} ${x + w},${fy - 2 * b.fs} L ${x + w * 0.95},${fy + 3.5} Q ${x},${fy + 6.5} ${x - w * 0.85},${fy + 4.5} Z" ${inked(c)}/>` +
        `<rect x="${x + w * 0.45}" y="${fy + 3}" width="${4.2 * b.fs}" height="${8 * b.fs}" rx="1.8" fill="${dk}"/>` +
        `<path d="M ${x - w * 0.65},${ay + 2.5} Q ${x},${ay - 3.5} ${x + w * 0.65},${ay + 2.5}" stroke="${dk}" stroke-width="2.6" fill="none"/>` +
        `<path d="M ${x - w * 0.6},${fy - 2 * b.fs} Q ${x},${fy - 6 * b.fs} ${x + w * 0.7},${fy - 3 * b.fs}" stroke="${shade(c, 0.4)}" stroke-width="1.4" fill="none" opacity=".8"/>`;
    }
  });
  return s;
}

/* ---------- 发型 ---------- */
function hairCap(b, c, opt) {
  opt = opt || {};
  const { cx, cy, hr, hry } = b;
  const rx = hr * (opt.rx || 1.06), drop = opt.drop == null ? 0.12 : opt.drop;
  return `<path d="M ${cx - rx},${cy + hry * drop}
    C ${cx - rx - 3},${cy - hry * (opt.top || 1.16)} ${cx + rx + 3},${cy - hry * (opt.top || 1.16)} ${cx + rx},${cy + hry * drop}
    C ${cx + rx * 0.55},${cy - hry * 0.4} ${cx - rx * 0.55},${cy - hry * 0.4} ${cx - rx},${cy + hry * drop} Z" fill="${c}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`;
}
function sideLocks(b, c, len) {
  const { cx, cy, hr } = b, dk = shade(c, -0.15);
  return [-1, 1].map(sd =>
    `<path d="M ${cx + sd * hr * 0.96},${cy - 6} Q ${cx + sd * hr * 1.1},${cy + len * 0.5} ${cx + sd * hr * 0.82},${cy + len} Q ${cx + sd * hr * 0.7},${cy + len * 0.4} ${cx + sd * hr * 0.8},${cy - 8} Z" fill="${c}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>` +
    `<path d="M ${cx + sd * hr * 0.94},${cy} Q ${cx + sd * hr * 1.0},${cy + len * 0.45} ${cx + sd * hr * 0.85},${cy + len * 0.8}" stroke="${dk}" stroke-width="1.5" fill="none" opacity=".6"/>`
  ).join('');
}

/* 完整头发帽：盖住整个头顶到眉毛（贴合头型、不越顶、不露头皮、不方） */
function fringeSVG(b, c, o) {
  o = o || {};
  const { cx, cy, hr, hry } = b;
  const rx = hr * (o.rx || 1.0);
  const ey = cy - hry * (o.bottom || 0.04);   // 眉毛线
  const top = cy - hry * (o.top || 0.99);     // 头顶（略低于头顶，避免凸起）
  const drop = cy + hry * (o.drop || 0.04);   // 底缘弧下垂点（仍高于眼睛）
  let d = `M ${(cx - rx).toFixed(1)},${ey.toFixed(1)}`;
  d += ` C ${(cx - rx).toFixed(1)},${(cy - hry * 0.55).toFixed(1)} ${(cx - rx * 0.6).toFixed(1)},${top.toFixed(1)} ${cx},${top.toFixed(1)}`;
  d += ` C ${(cx + rx * 0.6).toFixed(1)},${top.toFixed(1)} ${(cx + rx).toFixed(1)},${(cy - hry * 0.55).toFixed(1)} ${(cx + rx).toFixed(1)},${ey.toFixed(1)}`;
  d += ` Q ${cx},${drop.toFixed(1)} ${(cx - rx).toFixed(1)},${ey.toFixed(1)} Z`;
  return `<path d="${d}" fill="${o.fill || c}"/>`;
}
export const HAIRSTYLES = {
  short: {
    name: '清爽短发',
    back(b, c) { return hairCap(b, c, { rx: 1.04 }); },
    front(b, c) {
      const { cx, cy, hr, hry } = b;
      return hairCap(b, c) + sideLocks(b, c, 26 * b.fs) +
        `<path d="M ${cx - hr * 0.55},${cy - hry * 0.42} Q ${cx - hr * 0.3},${cy - hry * 0.1} ${cx - hr * 0.05},${cy - hry * 0.4}" stroke="${shade(c, -0.2)}" stroke-width="1.6" fill="none" opacity=".5"/>`;
    }
  },
  long: {
    name: '及腰长直发',
    back(b, c) {
      const { cx, cy, hr, hry, fs } = b, y1 = b.waistY + 30 * fs;
      return `<path d="M ${cx - hr * 1.06},${cy + hry * 0.2}
        C ${cx - hr * 1.16},${cy - hry * 1.1} ${cx + hr * 1.16},${cy - hry * 1.1} ${cx + hr * 1.06},${cy + hry * 0.2}
        C ${cx + hr * 1.14},${cy + 55 * fs} ${cx + hr * 1.05},${y1 - 38 * fs} ${cx + hr * 0.98},${y1}
        L ${cx - hr * 0.98},${y1}
        C ${cx - hr * 1.05},${y1 - 38 * fs} ${cx - hr * 1.14},${cy + 55 * fs} ${cx - hr * 1.06},${cy + hry * 0.2} Z" fill="${c}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`;
    },
    front(b, c) {
      return hairCap(b, c) + sideLocks(b, c, 84 * b.fs) +
        `<path d="M ${b.cx - b.hr * 0.5},${b.cy - b.hry * 0.45} Q ${b.cx},${b.cy - b.hry * 0.12} ${b.cx + b.hr * 0.5},${b.cy - b.hry * 0.45}" stroke="${shade(c, -0.22)}" stroke-width="1.8" fill="none" opacity=".55"/>`;
    }
  },
  twin: {
    name: '双马尾',
    back(b, c) {
      const { cx, cy, hr, hry, fs } = b, dk = shade(c, -0.15);
      let s = hairCap(b, c, { rx: 1.05 });
      [-1, 1].forEach(sd => {
        const x0 = cx + sd * hr * 1.02, y0 = cy - hry * 0.35;
        s += `<path d="M ${x0},${y0} C ${x0 + sd * 34 * fs},${y0 - 6} ${x0 + sd * 30 * fs},${y0 + 46 * fs} ${x0 + sd * 16 * fs},${y0 + 72 * fs} C ${x0 + sd * 6},${y0 + 50 * fs} ${x0 - sd * 4},${y0 + 22 * fs} ${x0},${y0 - 4} Z" fill="${c}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>` +
          `<path d="M ${x0 + sd * 8},${y0 + 18 * fs} Q ${x0 + sd * 18 * fs},${y0 + 36 * fs} ${x0 + sd * 12 * fs},${y0 + 58 * fs}" stroke="${dk}" stroke-width="1.6" fill="none" opacity=".6"/>` +
          `<circle cx="${x0}" cy="${y0 + 2}" r="5.5" fill="${shade(c, -0.3)}"/>`;
      });
      return s;
    },
    front(b, c) {
      const { cx, cy, hr, hry } = b;
      let s = hairCap(b, c);
      s += `<path d="M ${cx - hr * 1.02},${cy - hry * 0.28} Q ${cx - hr * 0.7},${cy - hry * 0.02} ${cx - hr * 0.4},${cy - hry * 0.24} Q ${cx - hr * 0.15},${cy - hry * 0.04} ${cx + hr * 0.15},${cy - hry * 0.24} Q ${cx + hr * 0.45},${cy - hry * 0.03} ${cx + hr * 1.02},${cy - hry * 0.28} L ${cx + hr * 1.02},${cy - hry * 0.5} Q ${cx},${cy - hry * 1.05} ${cx - hr * 1.02},${cy - hry * 0.5} Z" fill="${c}"/>`;
      return s;
    }
  },
  pony: {
    name: '高马尾',
    back(b, c) {
      const { cx, cy, hr, hry, fs } = b;
      const y0 = cy - hry * 0.98;
      return hairCap(b, c, { rx: 1.04 }) +
        `<path d="M ${cx},${y0} Q ${cx + hr * 1.7},${cy - hry * 0.5} ${cx + hr * 0.95},${cy + 52 * fs} Q ${cx + hr * 0.7},${cy + 20 * fs} ${cx},${y0 + 4} Z" fill="${c}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>` +
        `<circle cx="${cx + 2}" cy="${y0 + 3}" r="6" fill="${shade(c, -0.3)}"/>`;
    },
    front(b, c) {
      const { cx, cy, hr, hry } = b;
      return hairCap(b, c, { drop: 0.05, top: 1.1 }) +
        `<path d="M ${cx - hr * 0.85},${cy - hry * 0.36} Q ${cx - hr * 0.3},${cy - hry * 0.06} ${cx + hr * 0.25},${cy - hry * 0.3}" stroke="${shade(c, -0.22)}" stroke-width="1.6" fill="none" opacity=".5"/>`;
    }
  },
  bob: {
    name: '波波头',
    back(b, c) {
      const { cx, cy, hr, hry } = b;
      return `<path d="M ${cx - hr * 1.08},${cy - hry * 0.1}
        C ${cx - hr * 1.18},${cy - hry * 1.12} ${cx + hr * 1.18},${cy - hry * 1.12} ${cx + hr * 1.08},${cy - hry * 0.1}
        C ${cx + hr * 1.12},${cy + hry * 0.75} ${cx + hr * 0.9},${cy + hry * 0.82} ${cx + hr * 0.6},${cy + hry * 0.78}
        Q ${cx},${cy + hry * 0.95} ${cx - hr * 0.6},${cy + hry * 0.78}
        C ${cx - hr * 0.9},${cy + hry * 0.82} ${cx - hr * 1.12},${cy + hry * 0.75} ${cx - hr * 1.08},${cy - hry * 0.1} Z" fill="${c}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`;
    },
    front(b, c) {
      const { cx, cy, hr, hry } = b;
      return hairCap(b, c, { drop: 0.16 }) +
        `<path d="M ${cx - hr},${cy - hry * 0.3} Q ${cx - hr * 0.55},${cy - hry * 0.05} ${cx - hr * 0.1},${cy - hry * 0.28} Q ${cx + hr * 0.35},${cy - hry * 0.04} ${cx + hr},${cy - hry * 0.3} L ${cx + hr},${cy - hry * 0.55} Q ${cx},${cy - hry * 1.0} ${cx - hr},${cy - hry * 0.55} Z" fill="${shade(c, 0.07)}"/>`;
    }
  },
  curly: {
    name: '蓬蓬短卷',
    back(b, c) {
      const { cx, cy, hr, hry } = b;
      let s = `<ellipse cx="${cx}" cy="${cy - hry * 0.3}" rx="${hr * 1.18}" ry="${hry * 0.95}" fill="${shade(c, -0.12)}"/>`;
      const pts = [[-1.05, -0.55], [-0.75, -0.95], [-0.3, -1.12], [0.25, -1.12], [0.72, -0.95], [1.05, -0.55], [-1.14, -0.1], [1.14, -0.1]];
      pts.forEach(([px, py], i) => {
        s += `<circle cx="${cx + px * hr}" cy="${cy + py * hry}" r="${(11 + (i % 3) * 2.5) * b.fs}" fill="${i % 2 ? c : shade(c, 0.1)}"/>`;
      });
      return s;
    },
    front(b, c) {
      const { cx, cy, hr, hry } = b;
      let s = hairCap(b, c, { drop: 0.05 });
      [[-0.8, -0.5], [-0.3, -0.72], [0.3, -0.7], [0.8, -0.48]].forEach(([px, py], i) => {
        s += `<circle cx="${cx + px * hr}" cy="${cy + py * hry}" r="${10 * b.fs}" fill="${c}"/>`;
      });
      return s;
    }
  },
  bun: {
    name: '优雅丸子头',
    back(b, c) {
      const { cx, cy, hr, hry } = b;
      const y0 = cy - hry * 1.08;
      return hairCap(b, c, { rx: 1.04, drop: 0.04 }) +
        `<circle cx="${cx}" cy="${y0 - 8}" r="${15 * b.fs}" fill="${c}"/>` +
        `<path d="M ${cx - 10 * b.fs},${y0 - 12} Q ${cx},${y0 - 20} ${cx + 10 * b.fs},${y0 - 12}" stroke="${shade(c, -0.2)}" stroke-width="2" fill="none" opacity=".6"/>` +
        `<circle cx="${cx}" cy="${cy - hry * 0.98}" r="5.5" fill="${shade(c, -0.3)}"/>`;
    },
    front(b, c) { return hairCap(b, c, { drop: 0.03, top: 1.12 }); }
  },
  buzz: {
    name: '利落寸头',
    back(b, c) { return ''; },
    front(b, c) { return hairCap(b, c, { drop: -0.1, top: 1.02, rx: 1.01 }); }
  },
  wavy: {
    name: '浪漫长卷发',
    back(b, c) {
      const { cx, cy, hr, hry, fs } = b, y1 = b.waistY + 36 * fs;
      let s = `<path d="M ${cx - hr * 1.1},${cy + hry * 0.15}
        C ${cx - hr * 1.22},${cy - hry * 1.08} ${cx + hr * 1.22},${cy - hry * 1.08} ${cx + hr * 1.1},${cy + hry * 0.15}
        C ${cx + hr * 1.2},${cy + 62 * fs} ${cx + hr * 1.12},${y1 - 42 * fs} ${cx + hr * 1.0},${y1}
        ${waveEdge(cx + hr * 1.0, cx - hr * 1.0, y1, 4, 7)}
        C ${cx - hr * 1.12},${y1 - 42 * fs} ${cx - hr * 1.2},${cy + 62 * fs} ${cx - hr * 1.1},${cy + hry * 0.15} Z" fill="${c}" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>`;
      [[-1.02, 0.35], [-0.98, 0.75], [1.02, 0.35], [0.98, 0.75]].forEach(([px, py], i) => {
        s += `<circle cx="${cx + px * hr}" cy="${cy + hry * py + 52 * fs}" r="${13 * b.fs}" fill="${i % 2 ? shade(c, 0.08) : c}"/>`;
      });
      return s;
    },
    front(b, c) { return hairCap(b, c) + sideLocks(b, c, 70 * b.fs); }
  },
  braid: {
    name: '麻花辫',
    back(b, c) {
      const { cx, cy, hr, hry } = b;
      let s = hairCap(b, c, { rx: 1.05 });
      [-1, 1].forEach(sd => {
        const x = cx + sd * (hr * 1.0 + 4);
        for (let i = 0; i < 5; i++) {
          const r = (8.5 - i * 0.9) * b.fs, y = cy + 8 + i * 13 * b.fs;
          s += `<circle cx="${x + (i % 2 ? 2 : -2) * sd}" cy="${y}" r="${r}" fill="${i % 2 ? c : shade(c, 0.09)}"/>`;
        }
        s += `<path d="M ${x},${cy + 8 + 5 * 13 * b.fs - 6} L ${x + 3 * sd},${cy + 8 + 5 * 13 * b.fs + 8}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>` +
          `<circle cx="${x}" cy="${cy + 2}" r="4" fill="${shade(c, -0.3)}"/>`;
      });
      return s;
    },
    front(b, c) {
      const { cx, cy, hr, hry } = b;
      return hairCap(b, c, { drop: 0.1 }) +
        `<path d="M ${cx - hr * 0.06},${cy - hry * 1.05} L ${cx - hr * 0.06},${cy - hry * 0.4}" stroke="${shade(c, -0.3)}" stroke-width="2" opacity=".7"/>`;
    }
  },
  singlebraid: {
    name: '单麻花辫',
    // 短发为底，一条麻花辫垂在头侧
    back(b, c) {
      const { cx, cy, hr, hry, fs } = b;
      let s = hairCap(b, c, { rx: 1.04 });
      const x = cx - (hr * 1.0 + 2);
      const n = 5, startY = cy + 4;
      for (let i = 0; i < n; i++) {
        const r = (9 - i * 1.1) * fs, y = startY + i * 11 * fs;
        s += `<circle cx="${x + (i % 2 ? 2.5 : -2.5) * fs}" cy="${y}" r="${r}" fill="${i % 2 ? shade(c, 0.1) : c}"/>`;
      }
      s += `<path d="M ${x},${startY + n * 11 * fs - 6} L ${x + 3 * fs},${startY + n * 11 * fs + 9}" stroke="${c}" stroke-width="3" stroke-linecap="round"/>` +
        `<circle cx="${x}" cy="${startY}" r="4" fill="${shade(c, -0.3)}"/>`;
      return s;
    },
    front(b, c) {
      const { cx, cy, hr, hry, fs } = b;
      return hairCap(b, c) + sideLocks(b, c, 26 * fs) +
        `<path d="M ${cx - hr * 0.55},${cy - hry * 0.42} Q ${cx - hr * 0.3},${cy - hry * 0.1} ${cx - hr * 0.05},${cy - hry * 0.4}" stroke="${shade(c, -0.2)}" stroke-width="1.6" fill="none" opacity=".5"/>`;
    }
  },
  wolfcut: {
    name: '狼尾',
    // 短发为前发，后发留长到肩（约与高马尾等长）
    back(b, c) {
      const { cx, cy, hr, hry, fs } = b;
      const y1 = b.shoulderY + 8 * fs;
      return `<path d="M ${cx - hr * 0.94},${cy + hry * 0.15}
        C ${cx - hr * 1.04},${cy - hry * 0.5} ${cx - hr * 0.86},${cy - hry * 1.0} ${cx},${cy - hry * 0.98}
        C ${cx + hr * 0.86},${cy - hry * 1.0} ${cx + hr * 1.04},${cy - hry * 0.5} ${cx + hr * 0.94},${cy + hry * 0.15}
        L ${cx + hr * 0.5},${y1} L ${cx - hr * 0.5},${y1} Z" fill="${c}" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>` +
        `<path d="M ${cx - hr * 0.6},${cy - hry * 0.1} L ${cx - hr * 0.32},${y1 + 2} L ${cx},${y1 + 8} L ${cx + hr * 0.32},${y1 + 2} L ${cx + hr * 0.6},${cy - hry * 0.1} Q ${cx},${cy + hry * 0.3} ${cx - hr * 0.6},${cy - hry * 0.1} Z" fill="${shade(c, -0.12)}" opacity=".85"/>`;
    },
    front(b, c) {
      const { cx, cy, hr, hry, fs } = b;
      let s = hairCap(b, c) + sideLocks(b, c, 34 * fs);
      s += `<path d="M ${cx - hr * 0.55},${cy - hry * 0.42} Q ${cx - hr * 0.3},${cy - hry * 0.1} ${cx - hr * 0.05},${cy - hry * 0.4}" stroke="${shade(c, -0.2)}" stroke-width="1.6" fill="none" opacity=".5"/>`;
      return s;
    }
  },
};

/* ---------- 物品定义 ---------- */
export const ITEMS = [];
function I(id, cat, name, tags, colors, draw) { ITEMS.push({ id, cat, name, tags, colors, draw }); }

/* 上衣 6 */
I('t1', 'top', '纯白T恤', ['casual', 'basic'], ['#f6f6f8'], b => topBase(b, { c: '#f6f6f8', sleeve: 'short', collar: 'round', hemLine: 1 }));
I('t2', 'top', '海洋蓝衬衫', ['casual', 'fresh'], ['#7fb2e8'], b => topBase(b, { c: '#7fb2e8', sleeve: 'long', collar: 'v', buttons: 1, hemLine: 1 }));
I('t3', 'top', '奶黄连帽卫衣', ['casual', 'cute'], ['#ffd76e'], b => topBase(b, { c: '#ffd76e', sleeve: 'long', collar: 'round', hood: 1, pocket: 1 }));
I('t4', 'top', '薄荷运动背心', ['sporty', 'cool'], ['#7de8c8'], b => topBase(b, { c: '#7de8c8', sleeve: 'none', collar: 'v', hemY: b.waistY + 4, hemLine: 1 }));
I('t5', 'top', '樱花粉吊带', ['sweet', 'cute'], ['#ff9dbf'], b => topBase(b, { c: '#ff9dbf', sleeve: 'strap', collar: 'round', hemY: b.waistY + 2, hemLine: 1 }));
I('t6', 'top', '海军风条纹衫', ['casual', 'sea'], ['#4a6fa8', '#f6f6f8'], b => topBase(b, { c: '#4a6fa8', sleeve: 'short', collar: 'round', stripes: '#f6f6f8' }));

/* 下装 6 */
I('p1', 'bottom', '经典牛仔裤', ['casual', 'basic'], ['#5b84c4'], b => pantsBase(b, { c: '#5b84c4', cuffs: 1 }));
I('p2', 'bottom', '卡其短裤', ['casual', 'sporty'], ['#d8b06e'], b => pantsBase(b, { c: '#d8b06e', len: 'short' }));
I('p3', 'bottom', '黑色运动裤', ['sporty', 'cool'], ['#3a3a44'], b => pantsBase(b, { c: '#3a3a44', slim: 1, belt: '#e86a6a' }));
I('p4', 'bottom', '工装多袋裤', ['cool', 'casual'], ['#8a9a6a'], b => pantsBase(b, { c: '#8a9a6a', cargoPockets: 1 }));
I('p5', 'bottom', '蜜桃运动裤', ['cute', 'sporty'], ['#f0a8c0'], b => pantsBase(b, { c: '#f0a8c0', cuffs: 1 }));
I('p6', 'bottom', '牛仔热裤', ['cool', 'sea'], ['#6f92cf'], b => pantsBase(b, { c: '#6f92cf', len: 'short', cuffs: 1 }));

/* 裙子 5 */
I('s1', 'skirt', '学院百褶裙', ['campus', 'sweet'], ['#a8c8f0'], b => skirtBase(b, { c: '#a8c8f0', len: 58, flare: 0.5, pleats: 1 }));
I('s2', 'skirt', '绯红A字裙', ['sweet', 'formal'], ['#e86a6a'], b => skirtBase(b, { c: '#e86a6a', len: 50, flare: 0.62 }));
I('s3', 'skirt', '莓果格纹裙', ['campus', 'cool'], ['#c46a8a'], b => skirtBase(b, { c: '#c46a8a', len: 60, flare: 0.55, plaid: 'rgba(255,240,244,.75)' }));
I('s4', 'skirt', '云朵蛋糕裙', ['cute', 'princess'], ['#ffd0e8'], b => skirtBase(b, { c: '#ffd0e8', len: 66, flare: 1.05, hem: 'wave', amp: 7, layers: 1 }));
I('s5', 'skirt', '丹宁牛仔裙', ['casual', 'cool'], ['#6f92cf'], b => skirtBase(b, { c: '#6f92cf', len: 46, flare: 0.4, pocket: 1 }));

/* 连衣裙 / 套装 7 */
I('d1', 'dress', '碎花沙滩裙', ['sweet', 'fresh'], ['#ffe8f0', '#ff8fb0'], b => dressBase(b, { bodiceC: '#fff0f5', skirtC: '#ffe8f0', dk: '#f3b8cc', len: 96, flare: 0.9, sleeve: 'strap', collar: 'v', flowers: '#ff8fb0', hem: 'wave', amp: 5 }));
I('d2', 'dress', '草莓公主裙', ['princess', 'sweet'], ['#f8b8d8', '#ff7eb6'], b => dressBase(b, { bodiceC: '#f8b8d8', skirtC: '#f8c8e0', len: 118, flare: 1.35, sleeve: 'puff', sash: '#ff7eb6', bowKnot: 1, hem: 'wave', amp: 8, waves: 7, layers: 1 }));
I('d3', 'dress', '星夜晚礼服', ['formal', 'elegant'], ['#4a3f78'], b => dressBase(b, { c: '#4a3f78', dk: '#372e5e', len: 128, flare: 1.1, sleeve: 'none', collar: 'v', seqDots: 1, slit: 1 }));
I('d4', 'dress', '云锦汉服', ['classic', 'elegant'], ['#f0e0d0', '#c85a6a'], b => dressBase(b, { bodiceC: '#f0e0d0', skirtC: '#c85a6a', len: 120, flare: 1.15, sleeve: 'wide', collar: 'v', wrap: '#a83a48', sash: '#e8d5b0' }));
I('d5', 'dress', '赫本小黑裙', ['formal', 'cool'], ['#2e2e38'], b => dressBase(b, { c: '#2e2e38', dk: '#211f28', len: 78, flare: 0.72, sleeve: 'none', collar: 'round', sash: '#2e2e38' }));
I('d6', 'dress', '鎏金亮片裙', ['party', 'stage'], ['#ffd76e', '#ff9d6e'], b => `<defs><linearGradient id="gseq" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd76e"/><stop offset=".55" stop-color="#ffab6e"/><stop offset="1" stop-color="#ff7eb6"/></linearGradient></defs>` + dressBase(b, { bodiceC: 'url(#gseq)', skirtC: 'url(#gseq)', dk: '#e88a4a', len: 92, flare: 0.95, sleeve: 'none', collar: 'round', seqDots: 1 }));
I('d7', 'dress', '星光小礼服套装', ['formal', 'cool'], ['#3d3d6e', '#e86a6a'], b => pantsBase(b, { c: '#3d3d6e', slim: 1 }) + topBase(b, { c: '#3d3d6e', dk: '#2c2c52', sleeve: 'long', collar: 'v', hemY: b.hipY + 6, buttons: 1 }) + `<path d="M ${b.cx - b.neckW - 6},${b.shoulderY + 1} L ${b.cx - 2},${b.shoulderY + 34} L ${b.cx - b.neckW - 10},${b.shoulderY + 30} Z" fill="#2c2c52"/>` + `<path d="M ${b.cx + b.neckW + 6},${b.shoulderY + 1} L ${b.cx + 2},${b.shoulderY + 34} L ${b.cx + b.neckW + 10},${b.shoulderY + 30} Z" fill="#2c2c52"/>` + bowSVG(b.cx, b.shoulderY + 7, 6.5, '#e86a6a'));

/* 鞋子 6 */
I('sh1', 'shoes', '元气小白鞋', ['sporty', 'casual'], ['#f6f6f8'], b => shoesBase(b, { type: 'sneaker', c: '#f6f6f8', accent: '#a78bfa' }));
I('sh2', 'shoes', '绅士小皮鞋', ['formal', 'basic'], ['#4a3b30'], b => shoesBase(b, { type: 'leather', c: '#4a3b30' }));
I('sh3', 'shoes', '帅气马丁靴', ['cool', 'casual'], ['#6a4a38'], b => shoesBase(b, { type: 'boot', c: '#6a4a38' }));
I('sh4', 'shoes', '夏日凉鞋', ['fresh', 'casual'], ['#c98a3d'], b => shoesBase(b, { type: 'sandal', c: '#c98a3d' }));
I('sh5', 'shoes', '樱桃高跟鞋', ['elegant', 'formal'], ['#d84a5a'], b => shoesBase(b, { type: 'heels', c: '#d84a5a' }));
I('sh6', 'shoes', '复古帆布鞋', ['campus', 'casual'], ['#e84a5a'], b => shoesBase(b, { type: 'canvas', c: '#e84a5a', accent: '#fff' }));

/* 帽子 6 */
I('h1', 'hat', '绯红棒球帽', ['sporty', 'casual'], ['#e86a6a'], b => {
  const { cx, cy, hr, hry } = b;
  return `<path d="M ${cx - hr * 1.04},${cy - hry * 0.3} A ${hr * 1.04} ${hry * 0.98} 0 0 1 ${cx + hr * 1.04},${cy - hry * 0.3} Z" fill="#e86a6a" stroke="${INK}" stroke-width="2.2"/>` +
    `<path d="M ${cx - hr * 1.12},${cy - hry * 0.3} Q ${cx},${cy - hry * 0.14} ${cx + hr * 1.12},${cy - hry * 0.3} L ${cx + hr * 1.12},${cy - hry * 0.4} Q ${cx},${cy - hry * 0.24} ${cx - hr * 1.12},${cy - hry * 0.4} Z" fill="#c85050" stroke="${INK}" stroke-width="2"/>` +
    `<circle cx="${cx}" cy="${cy - hry * 1.02}" r="4" fill="#c85050"/>` +
    `<path d="M ${cx},${cy - hry * 1.25} L ${cx},${cy - hry * 0.35}" stroke="#d85a5a" stroke-width="2" opacity=".5"/>`;
});
I('h2', 'hat', '薄荷毛线帽', ['cute', 'casual'], ['#7de8c8'], b => {
  const { cx, cy, hr, hry } = b;
  return `<path d="M ${cx - hr * 1.05},${cy - hry * 0.22} A ${hr * 1.05} ${hry * 1.02} 0 0 1 ${cx + hr * 1.05},${cy - hry * 0.22} Z" fill="#7de8c8" stroke="${INK}" stroke-width="2.2"/>` +
    `<path d="M ${cx - hr * 1.1},${cy - hry * 0.26} Q ${cx},${cy - hry * 0.08} ${cx + hr * 1.1},${cy - hry * 0.26} L ${cx + hr * 1.1},${cy - hry * 0.44} Q ${cx},${cy - hry * 0.26} ${cx - hr * 1.1},${cy - hry * 0.44} Z" fill="#5ec9a8" stroke="${INK}" stroke-width="2"/>` +
    `<circle cx="${cx}" cy="${cy - hry * 1.28}" r="${9 * b.fs}" fill="#a8f0dc" stroke="${INK}" stroke-width="2"/>`;
});
I('h3', 'hat', '魔术师礼帽', ['formal', 'cool'], ['#2a2a34'], b => {
  const { cx, cy, hr, hry } = b, y0 = cy - hry * 0.62;
  return `<ellipse cx="${cx}" cy="${y0}" rx="${hr * 1.4}" ry="${9 * b.fs}" fill="#1c1c24" stroke="${INK}" stroke-width="2"/>` +
    `<rect x="${cx - hr * 0.85}" y="${y0 - 50 * b.fs}" width="${hr * 1.7}" height="${50 * b.fs}" rx="${7 * b.fs}" fill="#2a2a34" stroke="${INK}" stroke-width="2"/>` +
    `<rect x="${cx - hr * 0.85}" y="${y0 - 16 * b.fs}" width="${hr * 1.7}" height="${9 * b.fs}" fill="#d84a5a"/>` +
    `<ellipse cx="${cx}" cy="${y0 - 50 * b.fs}" rx="${hr * 0.85}" ry="${5 * b.fs}" fill="#3a3a46"/>`;
});
I('h4', 'hat', '艺术家贝雷帽', ['elegant', 'cute'], ['#ff9dbf'], b => {
  const { cx, cy, hr, hry } = b, y0 = cy - hry * 0.88;
  return `<g transform="rotate(-9 ${cx} ${y0})">` +
    `<ellipse cx="${cx - hr * 0.08}" cy="${y0}" rx="${hr * 0.98}" ry="${17 * b.fs}" fill="#ff9dbf" stroke="${INK}" stroke-width="2.2"/>` +
    `<ellipse cx="${cx - hr * 0.08}" cy="${y0 - 4}" rx="${hr * 0.8}" ry="${11 * b.fs}" fill="#ffb3cd"/>` +
    `<circle cx="${cx - hr * 0.08}" cy="${y0 - 15 * b.fs}" r="4.5" fill="#e87a9f"/></g>` +
    `<path d="M ${cx - hr * 0.9},${cy - hry * 0.66} Q ${cx},${cy - hry * 0.5} ${cx + hr * 0.9},${cy - hry * 0.66}" stroke="#e87a9f" stroke-width="3" fill="none"/>`;
});
I('h5', 'hat', '黄色头巾帽', ['fresh', 'cute'], ['#ffd76e'], b => {
  const { cx, cy, hr, hry } = b;
  return `<path d="M ${cx - hr * 1.05},${cy - hry * 0.2} A ${hr * 1.05} ${hry * 1.0} 0 0 1 ${cx + hr * 1.05},${cy - hry * 0.2} Q ${cx},${cy - hry * 0.02} ${cx - hr * 1.05},${cy - hry * 0.2} Z" fill="#ffd76e" stroke="${INK}" stroke-width="2.2"/>` +
    `<path d="M ${cx - hr * 1.08},${cy - hry * 0.24} Q ${cx},${cy - hry * 0.05} ${cx + hr * 1.08},${cy - hry * 0.24}" stroke="#e8b84a" stroke-width="4" fill="none"/>` +
    `<circle cx="${cx + hr * 1.02}" cy="${cy - hry * 0.42}" r="${7 * b.fs}" fill="#ffd76e" stroke="${INK}" stroke-width="2"/>` +
    `<path d="M ${cx + hr * 1.02},${cy - hry * 0.42} q 12,2 16,12 M ${cx + hr * 1.02},${cy - hry * 0.42} q 14,8 12,18" stroke="#e8b84a" stroke-width="4" fill="none" stroke-linecap="round"/>`;
});
I('h6', 'hat', '海边草编帽', ['fresh', 'sea'], ['#e8c46a'], b => {
  const { cx, cy, hr, hry } = b, y0 = cy - hry * 0.55;
  return `<ellipse cx="${cx}" cy="${y0}" rx="${hr * 1.75}" ry="${13 * b.fs}" fill="#e8c46a" stroke="${INK}" stroke-width="2.2"/>` +
    `<ellipse cx="${cx}" cy="${y0 - 3}" rx="${hr * 1.75}" ry="${10 * b.fs}" fill="#f4d488"/>` +
    `<path d="M ${cx - hr * 0.9},${y0} A ${hr * 0.9} ${hry * 0.72} 0 0 1 ${cx + hr * 0.9},${y0} Z" fill="#eecf78" stroke="${INK}" stroke-width="2"/>` +
    `<path d="M ${cx - hr * 0.92},${y0 - 2} Q ${cx},${y0 - 12} ${cx + hr * 0.92},${y0 - 2}" stroke="#d84a5a" stroke-width="6" fill="none"/>`;
});

/* 头饰 5 */
I('hw1', 'headwear', '蝴蝶结发饰', ['cute', 'sweet'], ['#ff7eb6'], b => { const { cx, cy, hr, hry } = b; return bowSVG(cx + hr * 0.74, cy - hry * 0.6, 9 * b.fs, '#ff7eb6'); });
I('hw2', 'headwear', '花仙花环', ['fresh', 'princess'], ['#ff8fb0'], b => {
  const { cx, cy, hr, hry } = b;
  const cols = ['#ff8fb0', '#ffd76e', '#a78bfa', '#7dd8ff'];
  let s = '';
  for (let i = 0; i < 7; i++) {
    const a = Math.PI + (i / 6) * Math.PI;
    const x = cx + Math.cos(a) * hr * 1.02, y = cy + Math.sin(a) * hry * 0.95;
    s += `<ellipse cx="${(x + cx) / 2}" cy="${y - 7}" rx="3" ry="5" fill="#7dc9a0" transform="rotate(${(i - 3) * 26} ${(x + cx) / 2} ${y - 7})"/>` +
      `<circle cx="${x}" cy="${y}" r="${6.5 * b.fs}" fill="${cols[i % 4]}"/>` +
      `<circle cx="${x}" cy="${y}" r="${2.6 * b.fs}" fill="#fff" opacity=".85"/>`;
  }
  return s;
});
I('hw3', 'headwear', '圆框眼镜', ['cool', 'basic'], ['#3a3a44'], b => {
  const { cx, cy, hr, hry, fs } = b, ex = 14.5 * fs, ey = cy + 5 * fs;
  return `<circle cx="${cx - ex}" cy="${ey}" r="${10.5 * fs}" fill="rgba(190,225,255,.2)" stroke="#3a3a44" stroke-width="${2.4 * fs}"/>` +
    `<circle cx="${cx + ex}" cy="${ey}" r="${10.5 * fs}" fill="rgba(190,225,255,.2)" stroke="#3a3a44" stroke-width="${2.4 * fs}"/>` +
    `<path d="M ${cx - ex + 10.5 * fs},${ey} Q ${cx},${ey - 3 * fs} ${cx + ex - 10.5 * fs},${ey}" stroke="#3a3a44" stroke-width="${2.2 * fs}" fill="none"/>` +
    `<path d="M ${cx - ex - 10.5 * fs},${ey} L ${cx - hr * 0.98},${ey - 1} M ${cx + ex + 10.5 * fs},${ey} L ${cx + hr * 0.98},${ey - 1}" stroke="#3a3a44" stroke-width="${2.2 * fs}"/>`;
});
I('hw4', 'headwear', '喵喵猫耳', ['cute', 'cool'], ['#4a4a58'], b => {
  const { cx, cy, hr, hry } = b;
  return [-1, 1].map(sd => {
    const x = cx + sd * hr * 0.6, y = cy - hry * 0.82;
    return `<path d="M ${x - 9 * b.fs},${y + 8} L ${x + sd * 4},${y - 20 * b.fs} L ${x + 11 * b.fs},${y + 6} Z" fill="#4a4a58"/>` +
      `<path d="M ${x - 4 * b.fs},${y + 5} L ${x + sd * 3},${y - 12 * b.fs} L ${x + 7 * b.fs},${y + 3} Z" fill="#ff9dbf"/>`;
  }).join('');
});
I('hw5', 'headwear', '星空耳机', ['cool', 'sporty'], ['#2e2e3e'], b => {
  const { cx, cy, hr, hry, fs } = b;
  return `<path d="M ${cx - hr * 1.08},${cy + 4 * fs} A ${hr * 1.08} ${hry * 1.06} 0 0 1 ${cx + hr * 1.08},${cy + 4 * fs}" stroke="#2e2e3e" stroke-width="${6 * fs}" fill="none"/>` +
    [-1, 1].map(sd => `<rect x="${cx + sd * hr * 1.08 - 6 * fs}" y="${cy - 4 * fs}" width="${12 * fs}" height="${24 * fs}" rx="${6 * fs}" fill="#2e2e3e"/>` +
      `<rect x="${cx + sd * hr * 1.08 - 3.5 * fs}" y="${cy - 1 * fs}" width="${7 * fs}" height="${18 * fs}" rx="${3.5 * fs}" fill="#a78bfa"/>`).join('');
});

/* 耳饰 5 */
I('e1', 'earrings', '珍珠耳钉', ['elegant', 'basic'], ['#fdf6ee'], b => {
  const { cx, cy, hr, hry } = b;
  return [-1, 1].map(sd => `<circle cx="${cx + sd * hr * 1.04}" cy="${cy + hry * 0.42}" r="${3.6 * b.fs}" fill="#fdf6ee" stroke="#e3d5c5" stroke-width=".8"/><circle cx="${cx + sd * hr * 1.04 - 1}" cy="${cy + hry * 0.42 - 1.2}" r="1" fill="#fff"/>`).join('');
});
I('e2', 'earrings', '金圈耳环', ['cool', 'party'], ['#ffd76e'], b => {
  const { cx, cy, hr, hry } = b;
  return [-1, 1].map(sd => `<circle cx="${cx + sd * hr * 1.06}" cy="${cy + hry * 0.5}" r="${6.5 * b.fs}" fill="none" stroke="#ffd76e" stroke-width="${2.2 * b.fs}"/>`).join('');
});
I('e3', 'earrings', '流苏耳坠', ['elegant', 'party'], ['#ff8fb0'], b => {
  const { cx, cy, hr, hry } = b;
  return [-1, 1].map(sd => {
    const x = cx + sd * hr * 1.04, y = cy + hry * 0.42;
    return `<circle cx="${x}" cy="${y}" r="${2.6 * b.fs}" fill="#ffd76e"/>` +
      [0, 1, 2].map(i => `<line x1="${x - 3 + i * 3}" y1="${y + 3}" x2="${x - 3 + i * 3}" y2="${y + 12 * b.fs}" stroke="#ff8fb0" stroke-width="1.8" stroke-linecap="round"/>`).join('');
  }).join('');
});
I('e4', 'earrings', '星星耳钉', ['cute', 'stage'], ['#ffe28a'], b => {
  const { cx, cy, hr, hry } = b;
  return [-1, 1].map(sd => star5(cx + sd * hr * 1.04, cy + hry * 0.42, 4.5 * b.fs, '#ffe28a')).join('');
});
I('e5', 'earrings', '蜜桃心心坠', ['sweet', 'cute'], ['#ff7e9e'], b => {
  const { cx, cy, hr, hry } = b;
  return [-1, 1].map(sd => heart(cx + sd * hr * 1.05, cy + hry * 0.42, 3.6 * b.fs, '#ff7e9e')).join('');
});

/* 项链 5 */
I('n1', 'necklace', '珍珠项链', ['elegant', 'basic'], ['#fdf6ee'], b => {
  const { cx, shoulderY: sy, neckW } = b;
  let s = `<path d="M ${cx - neckW - 4},${sy + 1} Q ${cx},${sy + 17} ${cx + neckW + 4},${sy + 1}" stroke="#e3d5c5" stroke-width="1.6" fill="none"/>`;
  for (let i = 0; i <= 6; i++) {
    const t = i / 6, x = cx - neckW - 4 + t * (neckW + 4) * 2;
    const y = sy + 1 + Math.sin(t * Math.PI) * 15;
    s += `<circle cx="${x}" cy="${y}" r="2.4" fill="#fdf6ee" stroke="#e3d5c5" stroke-width=".6"/>`;
  }
  return s;
});
I('n2', 'necklace', '薄荷宝石链', ['fresh', 'sweet'], ['#5eead4'], b => {
  const { cx, shoulderY: sy, neckW } = b;
  return `<path d="M ${cx - neckW - 4},${sy} Q ${cx},${sy + 18} ${cx + neckW + 4},${sy}" stroke="#caa8e8" stroke-width="1.6" fill="none"/>` +
    `<path d="M ${cx - 5},${sy + 14} L ${cx},${sy + 8} L ${cx + 5},${sy + 14} L ${cx},${sy + 21} Z" fill="#5eead4" stroke="#3fc9ae" stroke-width="1"/>`;
});
I('n3', 'necklace', '黑色颈圈', ['cool', 'stage'], ['#2e2e38'], b => {
  const { cx, shoulderY: sy, neckW } = b;
  return `<rect x="${cx - neckW - 3}" y="${sy - 5}" width="${(neckW + 3) * 2}" height="7" rx="3.5" fill="#2e2e38"/>` +
    `<circle cx="${cx}" cy="${sy + 2}" r="3" fill="#a78bfa"/>`;
});
I('n4', 'necklace', '心心锁骨链', ['sweet', 'cute'], ['#ff7e9e'], b => {
  const { cx, shoulderY: sy, neckW } = b;
  return `<path d="M ${cx - neckW - 4},${sy} Q ${cx},${sy + 19} ${cx + neckW + 4},${sy}" stroke="#e8b4c4" stroke-width="1.5" fill="none"/>` +
    heart(cx, sy + 19, 5, '#ff7e9e') + `<circle cx="${cx}" cy="${sy + 19}" r="1.2" fill="#fff" opacity=".8"/>`;
});
I('n5', 'necklace', '蝴蝶结颈链', ['cute', 'princess'], ['#ff7eb6'], b => {
  const { cx, shoulderY: sy, neckW } = b;
  return `<path d="M ${cx - neckW - 3},${sy - 4} Q ${cx},${sy + 2} ${cx + neckW + 3},${sy - 4}" stroke="#ffb8d4" stroke-width="2.4" fill="none"/>` +
    bowSVG(cx, sy + 6, 7, '#ff7eb6');
});

export const ITEM_MAP = {};
ITEMS.forEach(it => ITEM_MAP[it.id] = it);

/* ---------- UI 分类定义 ---------- */
export const CATEGORIES = [
  { id: 'char', name: '角色', icon: '🧑', type: 'char' },
  { id: 'hair', name: '发型', icon: '💇', type: 'hair' },
  { id: 'hairColor', name: '发色', icon: '🎨', type: 'swatch', colors: HAIRCOLORS, key: 'hairColor' },
  { id: 'skin', name: '肤色', icon: '🫧', type: 'swatch', colors: SKINS, key: 'skin' },
  { id: 'eyeColor', name: '瞳色', icon: '👁️', type: 'swatch', colors: EYECOLORS, key: 'eyeColor' },
  { id: 'eyeShape', name: '眼型', icon: '✨', type: 'eyeShape' },
  { sep: '服饰 · 51 件' },
  { id: 'top', name: '上衣', icon: '👕', type: 'items' },
  { id: 'bottom', name: '裤装', icon: '👖', type: 'items' },
  { id: 'skirt', name: '裙装', icon: '🩱', type: 'items' },
  { id: 'dress', name: '连衣裙·套装', icon: '👗', type: 'items' },
  { id: 'shoes', name: '鞋子', icon: '👟', type: 'items' },
  { id: 'hat', name: '帽子', icon: '🧢', type: 'items' },
  { id: 'headwear', name: '头饰', icon: '👑', type: 'items' },
  { id: 'earrings', name: '耳饰', icon: '💎', type: 'items' },
  { id: 'necklace', name: '项链', icon: '📿', type: 'items' },
];
export const TAG_NAMES = {
  casual: '休闲', sweet: '甜美', campus: '学院', sporty: '活力', cool: '帅气', formal: '优雅',
  princess: '童话', cute: '可爱', fresh: '清新', party: '派对', classic: '古风', sea: '度假',
  elegant: '精致', basic: '百搭', stage: '舞台',
};

/* ===================== 体型模型 + 角色渲染（render.js） ===================== */
export function makeBody(charId) {
  const c = CHARACTERS[charId];
  const cx = 160;
  const hr = 35 * c.head, hry = 41 * c.head;
  const cy = 100;
  const fs = c.head;
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
  const wristX = armX + 7 * fs, wristY = shoulderY + 126 * h;
  const legGap = Math.max(9, hipHalf * 0.40);
  const legW = Math.max(12, Math.min(30, legGap * 1.6));
  const footX = legGap + 3;
  return { cx, cy, hr, hry, fs, neckW, neckTop, shoulderY, chestY, waistY, hipY, kneeY, ankleY, footY,
    shoulderHalf, chestHalf, waistHalf, hipHalf, armX, armW, elbowX, wristX, elbowY, wristY, legGap, legW, footX,
    skin: null, charId, char: c };
}

function eyeSVG(x, y, s, shape, eyeC, skin, big) {
  const dk = '#2f2438';
  const ry = { round: 6, almond: 4.8, narrow: 3.3, sparkle: 6, sleepy: 5.6 }[shape] || 6;
  let iris = `<ellipse cx="${x}" cy="${y}" rx="${5.1 * s}" ry="${ry * s}" fill="${eyeC}"/>` +
    `<ellipse cx="${x}" cy="${y + 0.4 * s}" rx="${2.2 * s}" ry="${ry * s * 0.55}" fill="#241a2e"/>` +
    `<circle cx="${x - 1.8 * s}" cy="${y - 2.1 * s}" r="${1.7 * s}" fill="#fff"/>` +
    `<circle cx="${x + 1.9 * s}" cy="${y + 2.1 * s}" r="${0.9 * s}" fill="#fff" opacity=".85"/>`;
  if (shape === 'sparkle') {
    iris += `<circle cx="${x + 2.2 * s}" cy="${y - 2.6 * s}" r="${1.3 * s}" fill="#fff"/>` +
      `<circle cx="${x - 2.6 * s}" cy="${y + 1.4 * s}" r="${0.8 * s}" fill="#fff" opacity=".9"/>`;
  }
  let lash = `<path d="M ${x - 6.3 * s},${y - ry * s * 0.75} Q ${x},${y - (ry + 2.6) * s} ${x + 6.3 * s},${y - ry * s * 0.75}" stroke="${dk}" stroke-width="${2.2 * s}" fill="none" stroke-linecap="round"/>`;
  if (shape === 'narrow')
    lash = `<path d="M ${x - 6.3 * s},${y - ry * s * 0.8} Q ${x},${y - (ry + 2.2) * s} ${x + 6.3 * s},${y - ry * s * 0.8} M ${x + 5.6 * s},${y - ry * s * 0.55} q ${2.6 * s},${-0.6 * s} ${4 * s},${-2.6 * s}" stroke="${dk}" stroke-width="${2.2 * s}" fill="none" stroke-linecap="round"/>`;
  if (shape === 'almond')
    lash += `<path d="M ${x + 5.6 * s},${y - 2.6 * s} q ${2.8 * s},${-1 * s} ${4.2 * s},${-3.2 * s}" stroke="${dk}" stroke-width="${1.8 * s}" fill="none" stroke-linecap="round"/>`;
  if (shape === 'sleepy') {
    iris += `<path d="M ${x - 6.6 * s},${y - 0.6 * s} Q ${x},${y - 7 * s} ${x + 6.6 * s},${y - 0.6 * s} L ${x + 6.6 * s},${y - 5.5 * s} Q ${x},${y - 11 * s} ${x - 6.6 * s},${y - 5.5 * s} Z" fill="${skin}"/>` +
      `<path d="M ${x - 6.6 * s},${y - 0.8 * s} Q ${x},${y - 7.2 * s} ${x + 6.6 * s},${y - 0.8 * s}" stroke="${dk}" stroke-width="${2 * s}" fill="none" stroke-linecap="round"/>`;
  }
  return iris + lash;
}
function mouthSVG(b, type, fs) {
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
function faceSVG(b, cfg, skin, hairC) {
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
function headSVG(b, cfg, skin, hairC) {
  const { cx, cy, hr, hry, fs, neckW, neckTop, shoulderY: sy } = b;
  const dk = shade(skin, -0.1);
  return `<g id="g-head">` +
    `<path d="M ${cx - neckW},${neckTop - 3} L ${cx - neckW},${sy + 6} Q ${cx},${sy + 14} ${cx + neckW},${sy + 6} L ${cx + neckW},${neckTop - 3} Z" fill="${dk}" stroke="${INK}" stroke-width="2.4"/>` +
    [-1, 1].map(sd => `<ellipse cx="${cx + sd * (hr + 1)}" cy="${cy + hry * 0.22}" rx="${5 * fs}" ry="${7.5 * fs}" fill="${skin}" stroke="${INK}" stroke-width="2.2"/>`).join('') +
    `<ellipse cx="${cx}" cy="${cy}" rx="${hr}" ry="${hry}" fill="${skin}" stroke="${INK}" stroke-width="3"/>` +
    `<g id="g-face" transform="translate(0,0)">${faceSVG(b, cfg, skin, hairC)}</g>` +
    `</g>`;
}
function bodySVG(b, skin) {
  return [-1, 1].map(sd => limbPath(legPts(b, sd), b.legW, skin)).join('') +
    [-1, 1].map(sd => `<ellipse cx="${footCX(b, sd)}" cy="${b.footY}" rx="${11.5 * b.fs}" ry="${6.5 * b.fs}" fill="${skin}" stroke="${INK}" stroke-width="2.4"/>`).join('') +
    `<path d="${torsoPath(b, 0)}" fill="${skin}" stroke="${INK}" stroke-width="3"/>` +
    [-1, 1].map(sd => limbPath(armPts(b, sd), b.armW, skin)).join('') +
    [-1, 1].map(sd => `<circle cx="${b.cx + sd * b.wristX}" cy="${b.wristY + 5}" r="${5.8 * b.fs}" fill="${skin}" stroke="${INK}" stroke-width="2.4"/>`).join('');
}

/* ---------- 主渲染：完整角色 ---------- */
export function avatarSVG(cfg, opts) {
  opts = opts || {};
  const b = makeBody(cfg.charId);
  const skin = cfg.skinColor || SKINS[cfg.skin];
  const hairC = HAIRCOLORS[cfg.hairColor];
  const it = cfg.items || {};
  const draw = id => ITEM_MAP[id] ? ITEM_MAP[id].draw(b) : '';
  const hair = HAIRSTYLES[cfg.hair];
  const hairBack = hair ? hair.back(b, hairC) : '';
  const hairFront = hair ? fringeSVG(b, hairC) + hair.front(b, hairC) : '';
  const layers = [
    ['hairback', hairBack],
    ['legs', bodySVG(b, skin)],
    ['bottom', it.bottom ? draw(it.bottom) : (it.skirt ? draw(it.skirt) : '')],
    ['dress', it.dress ? draw(it.dress) : ''],
    ['top', it.top ? draw(it.top) : ''],
    ['shoes', it.shoes ? draw(it.shoes) : ''],
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

const MANNEQUIN = { charId: 'yu', skin: 1, hair: null, hairColor: 5, eyeColor: 0, eyeShape: 'round', skinColor: '#ece7f2', items: {} };

/* ---------- 缩略图 ---------- */
export function itemThumbSVG(itemId) {
  const it = ITEM_MAP[itemId];
  if (!it) return '';
  const cfg = JSON.parse(JSON.stringify(MANNEQUIN));
  cfg.items[it.cat] = itemId;
  let vb = '70 50 180 480';
  if (it.cat === 'top' || it.cat === 'dress' || it.cat === 'skirt' || it.cat === 'bottom') vb = '85 140 150 330';
  if (it.cat === 'shoes') vb = '90 400 140 130';
  if (it.cat === 'hat' || it.cat === 'headwear') vb = '85 4 150 158';
  if (it.cat === 'earrings' || it.cat === 'necklace') vb = '100 70 120 150';
  const svg = avatarSVG(cfg, { attrs: '' });
  return svg.replace('viewBox="0 0 320 560"', `viewBox="${vb}"`);
}
export function headThumbSVG(cfg) {
  const b = makeBody(cfg.charId);
  const vb = `${b.cx - 66} ${b.cy - b.hry - 42} 132 152`;
  const full = avatarSVG(cfg, { attrs: '' });
  return full.replace('viewBox="0 0 320 560"', `viewBox="${vb}"`);
}
export function hairThumbSVG(hairId) {
  const cfg = JSON.parse(JSON.stringify(MANNEQUIN));
  cfg.hair = hairId; cfg.skinColor = '#f2d8c8'; cfg.hairColor = 5;
  return headThumbSVG(cfg);
}
export function eyeShapeThumbSVG(shapeId) {
  const s = 2.2, ex = 30, ey = 34;
  const eye = eyeSVG(-ex, ey, s, shapeId, '#5a4a8a', '#f2d8c8') + eyeSVG(ex, ey, s, shapeId, '#5a4a8a', '#f2d8c8');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-60 4 120 62">${eye}</svg>`;
}

/* ---------- SVG 字符串 → base64 data URI（供 <image> 使用） ---------- */
export function svgToDataUri(svg) {
  // SVG 实际为 ASCII/含少量转义，这里用 encodeURIComponent 以稳妥处理任意字符
  const b64 = _btoaUnicode(svg);
  return 'data:image/svg+xml;base64,' + b64;
}
function _btoaUnicode(str) {
  if (typeof btoa === 'function' && typeof unescape === 'function') {
    return btoa(unescape(encodeURIComponent(str))); // 稳妥处理任意字符
  }
  if (typeof btoa === 'function') return btoa(str); // SVG 均为 ASCII 时的快捷路径
  // 兜底（无 btoa 环境，如部分小程序运行时）
  let binary = '';
  for (let i = 0; i < str.length; i++) binary += String.fromCharCode(str.charCodeAt(i) & 0xff);
  return binary;
}
