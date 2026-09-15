/* =========================================================================
   跨端获取标准 2D canvas 上下文
   兼容：微信小程序（<canvas type="2d"> + createSelectorQuery node）
       与 H5（浏览器 <canvas>）。
   只负责“拿到已按 DPR 设置好宽高的 ctx”，绘制由调用方完成。
   ========================================================================= */
export function get2DNode(that, id) {
  // Promise<{ canvas, ctx, dpr, cssW, cssH } | null>
  return new Promise(resolve => {
    const finalize = (canvas, cssW, cssH) => {
      try {
        let dpr = 1
        if (typeof uni !== 'undefined' && uni.getSystemInfoSync) {
          const info = uni.getSystemInfoSync()
          dpr = (info && info.pixelRatio) || 1
        } else if (typeof window !== 'undefined' && window.devicePixelRatio) {
          dpr = window.devicePixelRatio || 1
        }
        const w = Math.max(1, Math.round((cssW || 320) * dpr))
        const h = Math.max(1, Math.round((cssH || 560) * dpr))
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        if (!ctx) return resolve(null)
        return resolve({ canvas, ctx, dpr, cssW: cssW || 320, cssH: cssH || 560 })
      } catch (e) { return resolve(null) }
    }

    if (typeof uni !== 'undefined' && uni.createSelectorQuery) {
      uni.createSelectorQuery().in(that).select('#' + id)
        .fields({ node: true, size: true })
        .exec(res => {
          const r = res && res[0]
          if (r && r.node) return finalize(r.node, r.width, r.height)
          if (typeof document !== 'undefined') { // 某些 H5 环境 node 字段不可用
            const n = document.getElementById(id)
            if (n) return finalize(n, n.clientWidth, n.clientHeight)
          }
          return resolve(null)
        })
    } else if (typeof document !== 'undefined') {
      const n = document.getElementById(id)
      if (!n) return resolve(null)
      return finalize(n, n.clientWidth, n.clientHeight)
    } else {
      return resolve(null)
    }
  })
}
