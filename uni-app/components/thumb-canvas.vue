<template>
  <!--
    通用 SVG → Canvas2D 缩略图组件（兼容 H5 与微信小程序 <canvas type="2d">）。
    - 传 src：直接给 SVG 字符串；或传 cfg：内部用 avatarSVG(cfg) 生成整身形象 SVG。
    - 自动读取 SVG 根节点的 viewBox（无则默认 0 0 320 560），把该区域画满画布，
      行为等价于 <image mode="aspectFit">（contain，等比留白居中）或 mode="scaleToFill"（fill）。
    在“微信小程序端 <image> 显示 SVG 不可靠”的场景下用它替代 <image>。
  -->
  <canvas type="2d" :id="cid" :canvas-id="cid" class="tcv" :style="boxStyle"></canvas>
</template>

<script>
import { avatarSVG } from '../common/avatar.js'
import { svgToCanvas } from '../common/svg2canvas.js'
import { get2DNode } from '../common/canvasctx.js'

const DEFAULT_VB = { minX: 0, minY: 0, w: 320, h: 560 }

function parseViewBox(svg) {
  const m = /viewBox\s*=\s*"([^"]+)"/.exec(svg || '')
  if (m) {
    const p = m[1].trim().split(/[\s,]+/).map(Number)
    if (p.length >= 4 && p.every(v => !isNaN(v))) {
      return { minX: p[0], minY: p[1], w: p[2], h: p[3] }
    }
  }
  return DEFAULT_VB
}

export default {
  name: 'ThumbCanvas',
  props: {
    src: { type: String, default: '' },            // 可选：SVG 字符串（优先于 cfg）
    cfg: { type: Object, default: null },          // 可选：形象配置，自动 avatarSVG(cfg)
    width: { type: Number, default: 96 },          // css 宽
    height: { type: Number, default: 96 },         // css 高
    fit: { type: String, default: 'contain' },     // contain=等比留白居中；fill=拉伸铺满
  },
  data() {
    return { cid: '', drawToken: 0 }
  },
  computed: {
    // 字符串内联样式：保证宽高一定生效（对象样式在个别小程序端可能丢失 → canvas 退回默认 300 宽）
    boxStyle() { return 'width:' + this.width + 'px;height:' + this.height + 'px;display:block;' },
  },
  created() {
    this.cid = 'tc' + Math.random().toString(36).slice(2, 8)
  },
  mounted() {
    this.$nextTick(() => this.draw())
  },
  watch: {
    src() { this.draw() },
    cfg() { this.draw() },
    width() { this.$nextTick(() => this.draw()) },
    height() { this.$nextTick(() => this.draw()) },
  },
  methods: {
    draw() {
      const src = this.src || (this.cfg ? avatarSVG(this.cfg, {}) : '')
      if (!src) return
      const token = ++this.drawToken
      get2DNode(this, this.cid).then(r => {
        if (!r || token !== this.drawToken) return
        const { canvas, ctx, dpr, cssW, cssH } = r
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // 先在设备像素空间放大 dpr，其后统一在 css 像素坐标里绘制
        ctx.scale(dpr, dpr)

        const vb = parseViewBox(src)
        const sx = cssW / vb.w
        const sy = cssH / vb.h
        let kx = sx, ky = sy, ox = 0, oy = 0
        if (this.fit === 'contain') {
          // 等比缩放并居中（等价 <image mode="aspectFit">）
          const s = Math.min(sx, sy)
          kx = ky = s
          ox = (cssW - vb.w * s) / 2
          oy = (cssH - vb.h * s) / 2
        }
        // 把 viewBox 窗口映射到画布：p_css = k*(p_svg - min) + offset
        ctx.translate(ox, oy)
        ctx.scale(kx, ky)
        ctx.translate(-vb.minX, -vb.minY)
        try {
          svgToCanvas(ctx, src)
        } catch (e) {
          console.warn('thumb-canvas draw error', e)
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0)
      })
    },
  },
}
</script>

<style scoped>
.tcv { display: block; margin: 0 auto; flex-shrink: 0; }
</style>
