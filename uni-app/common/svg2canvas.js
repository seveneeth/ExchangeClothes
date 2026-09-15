/* =========================================================================
   轻量 SVG → Canvas2D 解释器
   ---------------------------------------------------------------
   用途：微信小程序端 <image> 不支持 SVG。为让换装角色能在 mp-weixin 显示，
   这里把 avatar.js 已生成的 SVG 字符串解析并在一个标准 Canvas2D ctx 上重绘。
   只支持本作实际用到的 SVG 子集（已在数据上逐一核对）：

     元素：svg / g / defs / linearGradient / stop / path / circle /
           ellipse / rect / line
     路径命令：M L C Q A Z（绝对）与 q（相对二次贝塞尔）
     属性：fill / stroke / stroke-width / stroke-linecap / stroke-linejoin /
           opacity / cx cy r rx ry / x y width height rx（圆角矩形）/
           x1 y1 x2 y2 / d / transform="rotate(a cx cy)" / id
     渐变：linearGradient 默认 objectBoundingBox（近似用整幅 320x560 对角），
           供 d6 鎏金亮片裙等使用。

   设计目标：与浏览器 <image> 显示同一段 SVG，几何逐点一致，仅颜色/渐变近似。
   ctx 为标准 2D 接口（浏览器 / 微信 canvas 2d 均支持）：
     save restore beginPath moveTo lineTo bezierCurveTo quadraticCurveTo
     closePath fill stroke lineWidth lineCap lineJoin globalAlpha
     createLinearGradient addColorStop translate rotate
   ========================================================================= */

// ---------- SVG 文本解析成极简元素树 ----------
function parseSVG(text) {
  const root = { tag: 'svg', attrs: {}, children: [] }
  const stack = [root]
  let i = 0
  const reTag = /<\s*(\/?)\s*([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)\/?\s*>/g
  // 更稳妥：逐字符扫描
  while (i < text.length) {
    const lt = text.indexOf('<', i)
    if (lt < 0) break
    const gt = text.indexOf('>', lt)
    if (gt < 0) break
    let inner = text.slice(lt + 1, gt).trim()
    i = gt + 1
    if (!inner) continue
    if (inner[0] === '/') { // 闭合标签
      const name = inner.slice(1).trim()
      const top = stack[stack.length - 1]
      if (top && top.tag === name) stack.pop()
      continue
    }
    const selfClose = inner.endsWith('/')
    if (selfClose) inner = inner.slice(0, -1).trim()
    const sp = inner.search(/[\s/]/)
    let name, rest = ''
    if (sp < 0) { name = inner } else { name = inner.slice(0, sp); rest = inner.slice(sp + 1) }
    // 解析属性
    const attrs = {}
    const attrRe = /([\w:-]+)\s*=\s*("([^"]*)"|'([^']*)')/g
    let m
    while ((m = attrRe.exec(rest))) attrs[m[1]] = m[3] !== undefined ? m[3] : m[4]
    const el = { tag: name, attrs, children: [] }
    const top = stack[stack.length - 1]
    if (top) top.children.push(el)
    if (!selfClose && (name === 'svg' || name === 'g' || name === 'defs')) {
      stack.push(el)
    }
  }
  return root
}

function num(v, d = 0) {
  if (v === undefined || v === '' || v === null) return d
  const n = parseFloat(v)
  return isNaN(n) ? d : n
}

// ---------- 颜色 / 透明度解析 ----------
function isNone(v) { return !v || v === 'none' || v === 'transparent' }

// ---------- 路径命令解析（M L C Q A Z + q）----------
function tokenizePath(d) {
  d = (d || '').replace(/,/g, ' ').trim()
  const out = []
  const re = /([AaCcHhLlMmQqSsTtVvZz])|(-?\d*\.?\d+(?:[eE][-+]?\d+)?)/g
  let m
  while ((m = re.exec(d))) {
    if (m[1]) out.push({ c: m[1] })
    else out.push({ n: parseFloat(m[2]) })
  }
  return out
}

function drawPath(ctx, d, P) {
  // P = { sx: 全局 x 缩放, sy: 全局 y 缩放, tx, ty }
  if (!d) return
  const toks = tokenizePath(d)
  let p = 0
  let curX = 0, curY = 0
  let startX = 0, startY = 0
  let isFirst = true

  while (p < toks.length) {
    let c = toks[p].c
    if (!c) { p++; continue }
    const rel = c >= 'a' && c <= 'z'
    const up = c.toUpperCase()
    if (c === 'Z' || c === 'z') {
      ctx.closePath()
      curX = startX; curY = startY
      p++
      continue
    }
    // 读取参数序列直到遇到下一个命令
    const params = []
    let pp = p + 1
    while (pp < toks.length && toks[pp].n !== undefined) { params.push(toks[pp].n); pp++ }
    p = pp
    const take = (n) => { const a = params.slice(0, n); params.splice(0, n); return a }
    const X = (v) => (rel ? curX + v : v)
    const Y = (v) => (rel ? curY + v : v)

    if (up === 'M') {
      while (params.length >= 2) {
        const [x0, y0] = take(2)
        const nx = X(x0), ny = Y(y0)
        if (isFirst) { ctx.moveTo(nx, ny); isFirst = false }
        else ctx.lineTo(nx, ny)
        curX = nx; curY = ny
        if (rel && params.length) { /* 相对 M 后后续为相对 */ }
      }
      startX = curX; startY = curY
    } else if (up === 'L') {
      while (params.length >= 2) {
        const [x0, y0] = take(2)
        const nx = X(x0), ny = Y(y0)
        ctx.lineTo(nx, ny); curX = nx; curY = ny
      }
    } else if (up === 'C') {
      while (params.length >= 6) {
        const [a1, b1, a2, b2, ex, ey] = take(6)
        ctx.bezierCurveTo(X(a1), Y(b1), X(a2), Y(b2), X(ex), Y(ey))
        curX = X(ex); curY = Y(ey)
      }
    } else if (up === 'Q') {
      while (params.length >= 4) {
        const [cx0, cy0, ex, ey] = take(4)
        ctx.quadraticCurveTo(X(cx0), Y(cy0), X(ex), Y(ey))
        curX = X(ex); curY = Y(ey)
      }
    } else if (up === 'A') {
      // rx ry xrot large sweep x y
      while (params.length >= 7) {
        const rx = take(1)[0], ry = take(1)[0], rot = take(1)[0]
        const large = take(1)[0] !== 0, sweep = take(1)[0] !== 0
        const ex = X(take(1)[0]), ey = Y(take(1)[0])
        addEllipticalArc(ctx, curX, curY, Math.abs(rx), Math.abs(ry), rot, large, sweep, ex, ey)
        curX = ex; curY = ey
      }
    } else {
      // 遇到未用到的命令（H/V/S/T）做保守近似：跳到下一组
      const arity = up === 'H' || up === 'V' ? 1 : up === 'T' ? 2 : 4
      params.splice(0, params.length - (params.length % arity))
    }
  }
}

/* 端点参数化的椭圆弧 → 采样为折线段（画布无需原生椭圆弧/缩放变换，稳定） */
function addEllipticalArc(ctx, x1, y1, rx, ry, phiDeg, large, sweep, x2, y2) {
  if (rx === 0 || ry === 0 || (x1 === x2 && y1 === y2)) { ctx.lineTo(x2, y2); return }
  const phi = phiDeg * Math.PI / 180
  const cosP = Math.cos(phi), sinP = Math.sin(phi)
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2
  const x1p = cosP * dx + sinP * dy
  const y1p = -sinP * dx + cosP * dy
  let lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry)
  if (lambda > 1) { const s = Math.sqrt(lambda); rx *= s; ry *= s }
  const sgn = (large === sweep) ? -1 : 1
  const numA = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p
  const coef = sgn * Math.sqrt(Math.max(0, numA / Math.max(den, 1e-9)))
  const cxp = coef * (rx * y1p / ry)
  const cyp = coef * (-ry * x1p / rx)
  const cx = cosP * cxp - sinP * cyp + (x1 + x2) / 2
  const cy = sinP * cxp + cosP * cyp + (y1 + y2) / 2
  const ux = (x1p - cxp) / rx, uy = (y1p - cyp) / ry
  const vx = (-x1p - cxp) / rx, vy = (-y1p - cyp) / ry
  let start = Math.atan2(uy, ux)
  let delta = angleBetween(ux, uy, vx, vy)
  if (!sweep && delta > 0) delta -= 2 * Math.PI
  if (sweep && delta < 0) delta += 2 * Math.PI
  const N = Math.max(4, Math.ceil(Math.abs(delta) / (Math.PI / 10)))
  for (let i = 1; i <= N; i++) {
    const a = start + delta * i / N
    const ox = rx * Math.cos(a), oy = ry * Math.sin(a)
    const finalX = cx + cosP * ox - sinP * oy
    const finalY = cy + sinP * ox + cosP * oy
    ctx.lineTo(finalX, finalY)
  }
}
function angleBetween(ux, uy, vx, vy) {
  return Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy)
}

// ---------- 解析 transform="rotate(a cx cy)" ----------
function applyTransform(ctx, attr) {
  if (!attr) return false
  const m = /rotate\(\s*([-0-9.]+)\s*([-0-9.]+)?\s*([-0-9.]+)?\s*\)/.exec(attr)
  if (m) {
    const a = parseFloat(m[1]) * Math.PI / 180
    const cx = m[2] !== undefined ? parseFloat(m[2]) : 0
    const cy = m[3] !== undefined ? parseFloat(m[3]) : 0
    ctx.save()
    if (cx || cy) ctx.translate(cx, cy)
    ctx.rotate(a)
    if (cx || cy) ctx.translate(-cx, -cy)
    return true
  }
  const t = /translate\(\s*([-0-9.]+)\s*,?\s*([-0-9.]+)?\s*\)/.exec(attr)
  if (t) {
    const tx = parseFloat(t[1] || 0)
    const ty = t[2] !== undefined ? parseFloat(t[2]) : 0
    ctx.save(); ctx.translate(tx, ty); return true
  }
  return false
}

// ---------- 元素绘制 ----------
function drawElement(ctx, el, gradById) {
  const a = el.attrs
  const tag = el.tag
  if (tag === 'defs') { for (const c of el.children) if (c.tag === 'linearGradient') gradById[c.attrs.id] = c; return }
  if (tag === 'g') {
    const saved = applyTransform(ctx, a.transform)
    for (const c of el.children) drawElement(ctx, c, gradById)
    if (saved) ctx.restore()
    return
  }
  if (tag === 'svg') { for (const c of el.children) drawElement(ctx, c, gradById); return }
  if (tag !== 'path' && tag !== 'circle' && tag !== 'ellipse' && tag !== 'rect' && tag !== 'line') return
  if (typeof ctx.onShapeStart === 'function') ctx.onShapeStart(tag, a)

  const opacity = a.opacity === undefined ? 1 : num(a.opacity, 1)
  const hadAlpha = opacity < 1
  if (hadAlpha) { ctx.save(); ctx.globalAlpha *= opacity }

  ctx.beginPath()
  if (tag === 'path') {
    drawPath(ctx, a.d, {})
  } else if (tag === 'circle') {
    const cx = num(a.cx), cy = num(a.cy), r = num(a.r)
    ctx.arc(cx, cy, r, 0, Math.PI * 2)
  } else if (tag === 'ellipse') {
    ellipse(ctx, num(a.cx), num(a.cy), num(a.rx), num(a.ry))
  } else if (tag === 'rect') {
    const x = num(a.x), y = num(a.y), w = num(a.width), h = num(a.height), r = num(a.rx)
    roundRectPath(ctx, x, y, w, h, r)
  } else if (tag === 'line') {
    ctx.moveTo(num(a.x1), num(a.y1)); ctx.lineTo(num(a.x2), num(a.y2))
  }

  // 填充
  const fill = a.fill
  if (fill !== undefined && !isNone(fill)) {
    ctx.fillStyle = resolveColor(ctx, fill, gradById)
    ctx.fill()
  }
  // 描边
  if (a.stroke !== undefined && !isNone(a.stroke)) {
    ctx.strokeStyle = resolveColor(ctx, a.stroke, gradById)
    ctx.lineWidth = num(a['stroke-width'], 1)
    if (a['stroke-linecap']) ctx.lineCap = a['stroke-linecap']
    if (a['stroke-linejoin']) ctx.lineJoin = a['stroke-linejoin']
    ctx.stroke()
  }
  if (hadAlpha) ctx.restore()
}

function ellipse(ctx, cx, cy, rx, ry) {
  // 用参数采样画椭圆，避免中途缩放变换导致后续 fill 坐标错乱
  if (rx <= 0 || ry <= 0) return
  if (rx === ry) { ctx.arc(cx, cy, rx, 0, Math.PI * 2); return }
  const N = 64
  for (let i = 0; i <= N; i++) {
    const a = i / N * Math.PI * 2
    const px = cx + rx * Math.cos(a), py = cy + ry * Math.sin(a)
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
}

function roundRectPath(ctx, x, y, w, h, r) {
  if (!r || r <= 0) { ctx.rect(x, y, w, h); return }
  const rr = Math.min(r, w / 2, h / 2)
  ctx.moveTo(x + rr, y)
  ctx.lineTo(x + w - rr, y)
  ctx.arcTo(x + w, y, x + w, y + rr, rr)
  ctx.lineTo(x + w, y + h - rr)
  ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr)
  ctx.lineTo(x + rr, y + h)
  ctx.arcTo(x, y + h, x, y + h - rr, rr)
  ctx.lineTo(x, y + rr)
  ctx.arcTo(x, y, x + rr, y, rr)
  ctx.closePath()
}

function resolveColor(ctx, color, gradById) {
  const m = /url\(\s*#([\w-]+)\s*\)/.exec(color || '')
  if (m) {
    const g = gradById[m[1]]
    if (g) return makeGradient(ctx, g)
  }
  return color
}
function makeGradient(ctx, g) {
  // linearGradient（objectBoundingBox 默认）→ 近似用整幅 320x560 的对角坐标
  const x1 = num(g.attrs.x1, 0), y1 = num(g.attrs.y1, 0)
  const x2 = num(g.attrs.x2, 1), y2 = num(g.attrs.y2, 1)
  const W = 320, H = 560
  const grad = ctx.createLinearGradient(x1 * W, y1 * H, x2 * W, y2 * H)
  for (const stop of g.children) {
    if (stop.tag !== 'stop') continue
    const off = Math.max(0, Math.min(1, num(stop.attrs.offset, 0)))
    grad.addColorStop(off, stop.attrs['stop-color'] || '#000')
  }
  return grad
}

/* ---------- 主入口 ---------- */
export function svgToCanvas(ctx, svgText) {
  const root = parseSVG(svgText)
  const gradById = {}
  drawElement(ctx, root, gradById)
}

// 供调试/测试使用
export { parseSVG, drawElement, tokenizePath, drawPath }

/* 便捷：把一个形象 cfg 直接画到 ctx（不缩放，按 320x560 源坐标） */
import { avatarSVG } from './avatar.js'

export function drawAvatar(ctx, cfg, size) {
  const svg = avatarSVG(cfg, {})
  const target = size || { w: 320, h: 560 }
  const sx = target.w / 320, sy = target.h / 560
  ctx.save()
  ctx.scale(sx, sy)
  svgToCanvas(ctx, svg)
  ctx.restore()
}
