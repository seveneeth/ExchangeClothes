<template>
  <canvas type="2d" :id="cid" :canvas-id="cid" class="cav" :style="boxStyle"></canvas>
</template>

<script>
import { avatarSVG } from '../common/avatar.js'
import { svgToCanvas } from '../common/svg2canvas.js'
import { get2DNode } from '../common/canvasctx.js'

// 复用现有 avatarSVG 生成 SVG，再用 svg2canvas 解释器画到一个标准 2d canvas。
// H5 与微信小程序(<canvas type="2d">) 都能跑。
export default {
  name: 'CanvasAvatar',
  props: {
    cfg: { type: Object, default: null },   // 形象配置
    width: { type: Number, default: 300 },  // css 宽
    height: { type: Number, default: 525 }, // css 高（源 320x560 等比）
    svg: { type: String, default: '' },     // 可选：直接给 SVG 字符串（覆盖 cfg）
  },
  data() {
    return { cid: '' }
  },
  computed: {
    boxStyle() { return { width: this.width + 'px', height: this.height + 'px' } },
  },
  created() {
    this.cid = 'cav' + Math.random().toString(36).slice(2, 8)
  },
  mounted() {
    this.$nextTick(() => this.draw())
  },
  watch: {
    cfg() { this.draw() },
    svg() { this.draw() },
    width() { this.$nextTick(() => this.draw()) },
    height() { this.$nextTick(() => this.draw()) },
  },
  methods: {
    draw() {
      const src = this.svg || (this.cfg ? avatarSVG(this.cfg, {}) : '')
      if (!src) return
      get2DNode(this, this.cid).then(r => {
        if (!r) return
        const { canvas, ctx, dpr, cssW, cssH } = r
        ctx.setTransform(1, 0, 0, 1, 0, 0)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.scale(dpr * (cssW / 320), dpr * (cssH / 560))
        try {
          svgToCanvas(ctx, src)
        } catch (e) {
          console.warn('svg2canvas draw error', e)
        }
        ctx.setTransform(1, 0, 0, 1, 0, 0)
      })
    },
  },
}
</script>

<style scoped>
.cav { display: block; }
</style>
