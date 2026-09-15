<template>
  <view class="abpage">
    <view class="top">
      <text class="title">A / B 渲染校验</text>
      <text class="hint">左 = SVG(image) · 右 = Canvas2D（同一份 avatarSVG）</text>
    </view>

    <view class="modebar">
      <view class="mode" :class="{on: mode==='random'}" @tap="setMode('random')">随机形象</view>
      <view class="mode" :class="{on: mode==='item'}" @tap="setMode('item')">单件物品</view>
      <view class="mode" :class="{on: mode==='hair'}" @tap="setMode('hair')">发型</view>
      <view class="mode" :class="{on: mode==='char'}" @tap="setMode('char')">角色</view>
    </view>

    <view class="label">第 {{ index + 1 }} / {{ list.length }} · {{ label }}</view>

    <view class="panels">
      <view class="panel">
        <text class="ptag">SVG (image)</text>
        <view class="box svgbox"><image v-if="svgUri" class="figure" :src="svgUri" mode="aspectFit" /></view>
      </view>
      <view class="panel">
        <text class="ptag">Canvas (svg2canvas)</text>
        <view class="box"><canvas-avatar v-if="current" :cfg="current" :width="300" :height="560" /></view>
      </view>
    </view>

    <view class="btns">
      <view class="btn" @tap="prev">◀ 上一个</view>
      <view class="btn" @tap="next">下一个 ▶</view>
    </view>
  </view>
</template>

<script>
import { CHARACTERS, ITEMS, HAIRSTYLES, ITEM_MAP, avatarSVG, svgToDataUri } from '../../common/avatar.js'
import CanvasAvatar from '../../components/canvas-avatar.vue'

function clone(o) { return JSON.parse(JSON.stringify(o)) }
function charCfg(id) {
  const ch = CHARACTERS[id]
  return { charId: id, ...clone(ch.preset), items: ch.preset.items || {} }
}

export default {
  components: { CanvasAvatar },
  data() {
    return { mode: 'random', index: 0, list: [], label: '', svgUri: '', current: null }
  },
  onReady() { this.rebuildList() },
  methods: {
    setMode(m) { this.mode = m; this.rebuildList() },
    rebuildList() {
      let list = [], labels = []
      if (this.mode === 'random') {
        const seeds = []
        for (const id of Object.keys(CHARACTERS)) seeds.push(charCfg(id))
        const itemsIds = Object.keys(ITEM_MAP)
        for (let i = 0; i < 40; i++) {
          const c = clone(seeds[Math.floor(Math.random() * seeds.length)])
          c.items = {}
          const wearCount = 2 + Math.floor(Math.random() * 5)
          for (let k = 0; k < wearCount; k++) {
            const it = ITEM_MAP[itemsIds[Math.floor(Math.random() * itemsIds.length)]]
            c.items[it.cat] = it.id
          }
          c.hair = Object.keys(HAIRSTYLES)[Math.floor(Math.random() * Object.keys(HAIRSTYLES).length)]
          list.push(c); labels.push('随机 #' + (i + 1))
        }
      } else if (this.mode === 'item') {
        for (const it of ITEMS) {
          const c = charCfg('yu'); c.items = { [it.cat]: it.id, shoes: it.cat === 'shoes' ? it.id : 'sh1' }
          list.push(c); labels.push(it.name + ' (' + it.cat + ')')
        }
      } else if (this.mode === 'hair') {
        for (const id of Object.keys(HAIRSTYLES)) {
          const c = charCfg('yu'); c.hair = id; c.items = CHARACTERS.yu.preset.items || {}
          list.push(c); labels.push(HAIRSTYLES[id].name)
        }
      } else {
        for (const id of Object.keys(CHARACTERS)) { list.push(charCfg(id)); labels.push(CHARACTERS[id].name) }
      }
      this.list = list; this.labels = labels
      this.index = 0
      this.show()
    },
    next() { this.index = (this.index + 1) % this.list.length; this.show() },
    prev() { this.index = (this.index - 1 + this.list.length) % this.list.length; this.show() },
    show() {
      this.current = this.list[this.index]
      this.label = this.labels[this.index]
      this.svgUri = svgToDataUri(avatarSVG(this.current, {}))
    },
  },
}
</script>

<style scoped>
.abpage { min-height: 100vh; background: linear-gradient(160deg,#fff5f9,#f0ecff); padding: 16px 18px 40px; box-sizing: border-box; }
.top { margin-bottom: 10px; }
.title { font-size: 20px; font-weight: 900; color: #5a2e6d; }
.hint { font-size: 12px; color: #9a86b0; margin-left: 8px; }
.modebar { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
.mode { padding: 6px 14px; border-radius: 999px; background: #fff; color: #5a2e6d; border: 1.5px solid #ead9ff; font-size: 13px; cursor: pointer; }
.mode.on { background: linear-gradient(135deg,#ffb6d5,#caa6ff); color: #fff; border-color: transparent; }
.label { font-size: 13px; color: #8f7ba6; margin-bottom: 10px; }
.panels { display: flex; gap: 16px; flex-wrap: wrap; }
.panel { flex: 1; min-width: 320px; }
.ptag { display: block; font-size: 13px; font-weight: 800; color: #5a2e6d; margin-bottom: 6px; }
.box { height: 560px; background: rgba(255,255,255,.8); border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 18px rgba(150,110,190,.12); }
.svgbox { overflow: hidden; }
.figure { width: 300px; height: 560px; }
.cv { width: 300px; height: 560px; }
.btns { margin-top: 16px; display: flex; gap: 12px; justify-content: center; }
.btn { padding: 10px 22px; border-radius: 999px; background: linear-gradient(135deg,#ffb6d5,#caa6ff); color: #fff; font-weight: 800; cursor: pointer; }
</style>
