<template>
  <view class="page">
    <!-- 背景图（static/ 会打进微信小程序包；/static/ 路径 H5 与 mp-weixin 均可用） -->
    <image class="bg" src="/static/background.png" mode="aspectFill" />

    <!-- ============ 顶部栏 ============ -->
    <view class="topbar">
      <view class="brand">
        <text class="brand-emoji">🎀</text>
        <text class="brand-name">梦幻衣橱</text>
        <text class="brand-sub">换个形象 · 换种心情</text>
      </view>
      <view class="top-actions">
        <view class="chip" @tap="openRate">⭐ 评分</view>
        <view class="chip" @tap="openAch">🏆 成就</view>
        <view class="chip" @tap="share">📤 分享</view>
        <view class="chip" @tap="openHelp">❓ 玩法</view>
        <view class="chip" @tap="goAb">🎨 A/B</view>
      </view>
      <view class="cloud-status" :class="cloudOk?'on':'off'">{{ cloudText }}</view>
    </view>

    <!-- ============ 主体：左侧分类 + 右侧内容 ============ -->
    <view class="main">
      <!-- 分类栏 -->
      <!-- #ifndef MP-WEIXIN -->
      <scroll-view scroll-y class="rail">
        <view v-for="c in railList" :key="c._k" class="rail-item"
              :class="{ active: c.id && cat === c.id, sep: !!c.sep }"
              @tap="c.id && selectCat(c.id)">
          <block v-if="c.id">
            <text class="rail-ico">{{ c.icon }}</text>
            <text class="rail-name">{{ c.name }}</text>
            <text class="rail-count">{{ c.count }}</text>
          </block>
          <text v-else class="rail-sep">{{ c.sep }}</text>
        </view>
      </scroll-view>
      <!-- #endif -->
      <!-- #ifdef MP-WEIXIN -->
      <!-- 手机端：分类改为顶部横向滑动 -->
      <scroll-view scroll-x class="rail mp-rail">
        <view v-for="c in railList" :key="c._k" class="rail-item"
              :class="{ active: c.id && cat === c.id, sep: !!c.sep }"
              @tap="c.id && selectCat(c.id)">
          <block v-if="c.id">
            <text class="rail-ico">{{ c.icon }}</text>
            <text class="rail-name">{{ c.name }}</text>
            <text class="rail-count">{{ c.count }}</text>
          </block>
          <text v-else class="rail-sep">{{ c.sep }}</text>
        </view>
      </scroll-view>
      <!-- #endif -->

      <!-- 内容区 -->
      <view class="content">
        <!-- 舞台区 -->
        <view class="stage-panel">
          <view class="stage-wrap">
            <!-- #ifndef MP-WEIXIN -->
            <image v-if="avatarUri" class="avatar" :src="avatarUri" mode="widthFix" />
            <!-- #endif -->
            <!-- #ifdef MP-WEIXIN -->
            <canvas-avatar v-if="cfg" class="avatar" :cfg="cfg" :width="300" :height="525" />
            <!-- #endif -->
            <view class="floor"></view>
          </view>
          <view class="stage-side">
            <view class="badge">
              <text class="badge-name">{{ charName }}</text>
              <text class="badge-desc">{{ charDesc }}</text>
            </view>
            <view class="ctl-grid">
              <view class="ctl" @tap="saveNow">💾 保存</view>
              <view class="ctl" @tap="openLoad">📂 衣橱</view>
              <view class="ctl" @tap="randomize">🎲 随机</view>
              <view class="ctl" @tap="resetNow">🔄 重置</view>
            </view>
            <view class="ctl-cloud" @tap="cloudPush" v-if="cfg">☁️ 上传云端存档</view>
          </view>
        </view>

        <!-- 选项面板 -->
        <view class="opt-panel">
          <view class="opt-head">
            <text class="opt-title">{{ gridTitle }}</text>
            <text class="opt-hint">点击即可穿戴 / 试穿</text>
          </view>
          <view class="opt-grid">
            <view v-for="o in gridOptions" :key="o._k" class="opt"
                  :class="{ eq: o.equipped, remove: o.remove, char: o.kind==='char' }"
                  @tap="optionClick(o)">
              <view class="opt-media">
                <!-- #ifndef MP-WEIXIN -->
                <image v-if="o.thumb" class="opt-img" :src="o.thumb" mode="aspectFit" />
                <!-- #endif -->
                <!-- #ifdef MP-WEIXIN -->
                <thumb-canvas v-if="o.thumbSvg" class="opt-img" :src="o.thumbSvg" :width="84" :height="84" />
                <!-- #endif -->
                <view v-else-if="o.color" class="dot" :style="{ background: o.color }"></view>
                <text v-else-if="o.remove" class="rm-mark">✕</text>
              </view>
              <text class="opt-name">{{ o.label }}</text>
              <text v-if="o.desc" class="opt-desc">{{ o.desc }}</text>
              <text v-if="o.equipped" class="eq-tag">穿戴中</text>
            </view>
            <view v-if="!gridOptions.length" class="empty">暂无此分类内容</view>
          </view>
        </view>
      </view>
    </view>

    <!-- ============ 弹层 ============ -->
    <view class="mask" v-if="modal" @tap="closeModal"></view>
    <view class="modal" v-if="modal">
      <view class="modal-card">
        <!-- 成就 -->
        <block v-if="modal === 'ach'">
          <view class="m-head"><text class="m-title">🏆 成就墙（{{ ach.unlocked.length }}/{{ achievements.length }}）</text></view>
          <scroll-view scroll-y class="m-body ach">
            <view v-for="a in achievements" :key="a.id" class="ach-card" :class="{ unlocked: isUnlocked(a) }">
              <view class="ach-ico">{{ a.icon }}</view>
              <view class="ach-info">
                <text class="ach-name">{{ a.name }}<text v-if="isUnlocked(a)"> ✓</text></text>
                <text class="ach-desc">{{ a.desc }}</text>
                <view class="bar"><view class="bar-in" :style="{ width: pctOf(a) + '%' }"></view></view>
                <text class="ach-state">{{ achProgressText(a) }}</text>
              </view>
            </view>
          </scroll-view>
          <view class="m-foot"><view class="btn primary" @tap="closeModal">知道了</view></view>
        </block>

        <!-- 评分 -->
        <block v-if="modal === 'rate'">
          <view class="m-head"><text class="m-title">⭐ 搭配评分</text></view>
          <view class="m-body center">
            <view class="score-ring"><text class="score-num">{{ rateInfo.score }}</text><text class="score-unit">SCORE</text></view>
            <text class="stars">{{ '★'.repeat(rateInfo.stars) }}<text class="dim">{{ '★'.repeat(5 - rateInfo.stars) }}</text></text>
            <text class="score-comment">{{ rateInfo.comment }}</text>
            <view class="dims">
              <view class="dim-chip" v-for="(v, k) in rateInfo.dims" :key="k">
                <text class="dim-k">{{ dimNames[k] }}</text><text class="dim-v">{{ v }}</text>
              </view>
            </view>
            <view class="tips">
              <text class="tips-title">💡 搭配建议</text>
              <text v-for="(t, i) in rateInfo.tips" :key="i" class="tip">· {{ t }}</text>
            </view>
          </view>
          <view class="m-foot">
            <view class="btn primary" @tap="shareFromRate">📤 分享这套搭配</view>
          </view>
        </block>

        <!-- 保存 -->
        <block v-if="modal === 'save'">
          <view class="m-head"><text class="m-title">💾 保存当前搭配</text></view>
          <view class="m-body">
            <input class="name-input" v-model="saveName" maxlength="12" placeholder="给搭配起个名字（如：春日野餐）" />
            <text class="slot-empty" v-if="!outfits.length">还没有保存的搭配，快去创造第一套吧 ✨</text>
            <scroll-view scroll-y class="slot-list" v-else>
              <view class="slot" v-for="(o, i) in outfits" :key="i">
                <!-- #ifndef MP-WEIXIN -->
                <image v-if="o.thumb" class="slot-img" :src="o.thumb" mode="aspectFit" />
                <!-- #endif -->
                <!-- #ifdef MP-WEIXIN -->
                <thumb-canvas v-if="o.cfg" class="slot-img" :cfg="o.cfg" :width="46" :height="70" />
                <!-- #endif -->
                <view class="slot-mid">
                  <text class="slot-name">{{ o.name }}</text>
                  <text class="slot-time">{{ o.score ? '· ' + o.score + ' 分' : '' }}</text>
                </view>
                <view class="slot-btn ok" @tap.stop="applyOutfit(i)">换上</view>
                <view class="slot-btn del" @tap.stop="delOutfit(i)">删除</view>
              </view>
            </scroll-view>
          </view>
          <view class="m-foot">
            <view class="btn primary" @tap="doSave">保存（剩余 {{ maxOutfits - outfits.length }} 位）</view>
          </view>
        </block>

        <!-- 衣橱（加载） -->
        <block v-if="modal === 'load'">
          <view class="m-head">
            <text class="m-title">📂 我的衣橱</text>
            <text class="m-sub">点选一套，再点「确定」换上；或「取消」返回</text>
          </view>
          <view class="m-body">
            <text class="slot-empty" v-if="!outfits.length">衣橱空空如也，先去「保存」几套吧</text>
            <scroll-view scroll-y class="slot-list" v-else>
              <view class="slot" :class="{ sel: selIdx === i }" v-for="(o, i) in outfits" :key="i" @tap="selIdx = i">
                <!-- #ifndef MP-WEIXIN -->
                <image v-if="o.thumb" class="slot-img" :src="o.thumb" mode="aspectFit" />
                <!-- #endif -->
                <!-- #ifdef MP-WEIXIN -->
                <thumb-canvas v-if="o.cfg" class="slot-img" :cfg="o.cfg" :width="46" :height="70" />
                <!-- #endif -->
                <view class="slot-mid">
                  <text class="slot-name">{{ o.name }}</text>
                  <text class="slot-time">{{ o.score ? '· ' + o.score + ' 分' : '' }}</text>
                </view>
                <view class="slot-btn ok" @tap.stop="applyOutfit(i)">换上</view>
                <view class="slot-btn del" @tap.stop="delOutfit(i)">删除</view>
              </view>
            </scroll-view>
          </view>
          <view class="m-foot wardrobe-foot">
            <view class="btn" @tap="closeModal">取消</view>
            <view class="btn primary" @tap="applySelected">确定</view>
          </view>
        </block>

        <!-- 分享 -->
        <block v-if="modal === 'share'">
          <view class="m-head"><text class="m-title">📤 分享我的搭配</text></view>
          <view class="m-body center">
            <!-- #ifndef MP-WEIXIN -->
            <image v-if="avatarUri" class="share-avatar" :src="avatarUri" mode="widthFix" />
            <!-- #endif -->
            <!-- #ifdef MP-WEIXIN -->
            <thumb-canvas v-if="cfg" class="share-avatar" :cfg="cfg" :width="180" :height="315" />
            <!-- #endif -->
            <text class="share-line">{{ charName }} 的今日穿搭 · {{ rateInfo.score }} 分</text>
            <text class="share-tip">点击「确定」分享给好友；或「返回」继续搭配</text>
          </view>
          <view class="m-foot share-foot">
            <view class="btn" @tap="closeModal">返回</view>
            <!-- #ifndef MP-WEIXIN -->
            <view class="btn primary" @tap="confirmShare">确定</view>
            <!-- #endif -->
            <!-- #ifdef MP-WEIXIN -->
            <button class="btn primary share-btn" open-type="share">确定</button>
            <!-- #endif -->
          </view>
        </block>
      </view>
    </view>

    <!-- ============ 引导层 ============ -->
    <view class="intro" v-if="showIntro">
      <view class="intro-card">
        <text class="intro-title">🎀 欢迎来到 梦幻衣橱</text>
        <text class="intro-line">1️⃣ 左侧选择分类（角色 / 发型 / 发色 / 肤色 / 服饰…）</text>
        <text class="intro-line">2️⃣ 在下方点击任意单品即可穿戴，自动规避互斥搭配</text>
        <text class="intro-line">3️⃣ 🎲 随机 / 🎨 换装，达成成就、保存到云端</text>
        <view class="btn primary big" @tap="startGame">开始换装 ✨</view>
      </view>
    </view>

    <!-- Toast -->
    <view class="toasts">
      <view v-for="(t, i) in toasts" :key="i" class="toast" :class="{ gold: t.gold }">{{ t.text }}</view>
    </view>

    <!-- 撒花 -->
    <view class="confetti" v-if="confettis.length">
      <text v-for="(c, i) in confettis" :key="i" class="confetti-p"
            :style="{ left: c.left + '%', top: c.top + '%', fontSize: c.size + 'px', animationDuration: c.dur + 's', animationDelay: c.delay + 's' }">{{ c.e }}</text>
    </view>
  </view>
</template>

<script>
import {
  CHARACTERS, CATEGORIES, HAIRSTYLES, EYESHAPES, HAIRCOLORS, EYECOLORS, TAG_NAMES,
  avatarSVG, headThumbSVG, itemThumbSVG, hairThumbSVG, eyeShapeThumbSVG, svgToDataUri,
} from '../../common/avatar.js'
import {
  MAX_OUTFITS, EXCLUSIVE, ITEMS_BY_CAT, deepClone, defaultCfg,
  scoreOutfit, ACHIEVEMENTS, CAT_KEYS,
  achProgress, achTrack, achCheck, trackTry,
  getItemsByCat, catCountOfItems, countHair, countEyes, countChars, itemName,
} from '../../common/gamecore.js'
import { getJSON, setJSON } from '../../common/storage.js'
import { saveToCloud, loadFromCloud, mergeStats, reportEvent, isOnline } from '../../common/api.js'

// 微信小程序端 <image> 显示 SVG 不可靠：角色/缩略图改由 Canvas2D 渲染
// #ifdef MP-WEIXIN
import CanvasAvatar from '../../components/canvas-avatar.vue'
import ThumbCanvas from '../../components/thumb-canvas.vue'
// #endif

const CONFETTI_EMOJI = ['✨', '🎉', '💖', '⭐', '🌸', '🎀', '💫']
const thumbCache = {} // svg→dataUri 缓存

// 缩略图字段按平台分流：H5/App 用 SVG data-URI（<image>）；MP-WEIXIN 用 SVG 原文（thumb-canvas 画布）
function thumbOpt(svg) {
  // #ifdef MP-WEIXIN
  return { thumbSvg: svg }
  // #endif
  // #ifndef MP-WEIXIN
  return { thumb: th(svg) }
  // #endif
}

function th(svg) {
  if (!svg) return ''
  if (thumbCache[svg]) return thumbCache[svg]
  const uri = svgToDataUri(svg)
  thumbCache[svg] = uri
  if (Object.keys(thumbCache).length > 400) { // 简单防内存膨胀
    for (const k in thumbCache) delete thumbCache[k]
  }
  return uri
}

export default {
  components: {
    // #ifdef MP-WEIXIN
    CanvasAvatar,
    ThumbCanvas,
    // #endif
  },
  data() {
    return {
      cat: 'top',
      cfg: null,
      ach: { progress: {}, unlocked: [] },
      outfits: [],
      avatarUri: '',
      charName: '', charDesc: '',
      railList: [],
      gridTitle: '',
      gridOptions: [],
      modal: null,
      selIdx: -1,
      saveName: '',
      rateInfo: { score: 0, stars: 0, dims: {}, comment: '', tips: [] },
      showIntro: false,
      toasts: [],
      confettis: [],
      cloudOk: isOnline(),
      cloudText: isOnline() ? '云端' : '离线',
    }
  },
  computed: {
    maxOutfits() { return MAX_OUTFITS },
    achievements() { return ACHIEVEMENTS },
    dimNames() { return { complete: '完整度', harmony: '色彩', style: '风格', bonus: '点睛' } },
    allCats() { return CAT_KEYS },
  },
  onLoad() {
    this.init()
  },
  // 微信小程序端「确定」按钮（button open-type="share"）回调
  onShareAppMessage() {
    const c = CHARACTERS[this.cfg.charId]
    const title = '我在「梦幻衣橱」搭配了' + (c ? c.name : '') + '的造型，得了 ' + this.rateInfo.score + ' 分！快来挑战吧～'
    return { title, path: '/pages/index/index', imageUrl: '/static/background.png' }
  },
  methods: {
    /* ---------- 初始化 ---------- */
    init() {
      const saved = getJSON('game', null)
      let load = null
      if (saved && saved.cfg) load = saved
      this.cfg = load ? deepClone(load.cfg) : defaultCfg('yu')
      this.ach = load && load.ach ? deepClone(load.ach) : { progress: {}, unlocked: [] }
      this.outfits = (load && load.outfits) ? deepClone(load.outfits) : []
      // 兼容旧 outfits 字段（无缩略图时补算）；MP-WEIXIN 端缩略图由 canvas 实时绘制，无需 data-URI
      // #ifndef MP-WEIXIN
      this.outfits.forEach(o => { if (!o.thumb) o.thumb = th(avatarSVG(o.cfg, {})) })
      // #endif
      this.buildRail()
      this.selectCat('top')
      this.refreshStageInfo()
      // 首次引导；老玩家自动从云端恢复
      const seen = getJSON('seen', false)
      if (!seen) {
        this.showIntro = true
      } else {
        this.cloudPull()
      }
      this.persist()
    },
    buildRail() {
      this.railList = CATEGORIES.map((c, i) => {
        if (c.sep) return { sep: c.sep, _k: 'sep-' + i }
        let count = 0
        if (c.type === 'items') count = catCountOfItems(c.id)
        else if (c.type === 'hair') count = countHair()
        else if (c.type === 'swatch') count = c.colors.length
        else if (c.type === 'eyeShape') count = countEyes()
        else if (c.type === 'char') count = countChars()
        return { id: c.id, name: c.name, icon: c.icon, type: c.type, count, sep: null, _k: c.id }
      })
    },

    /* ---------- 持久化 / 云端 ---------- */
    persist() {
      const doc = { cfg: this.cfg, ach: this.ach, outfits: this.outfits, ts: Date.now() }
      setJSON('game', doc)
      // #ifndef MP-WEIXIN
      this.outfits.forEach(o => { if (!o.thumb) o.thumb = th(avatarSVG(o.cfg, {})) })
      // #endif
    },
    async cloudPush() {
      this.cloudOk = false; this.cloudText = '同步中…'
      const doc = { cfg: this.cfg, ach: this.ach, outfits: this.outfits, ts: Date.now() }
      const ok = await saveToCloud(doc)
      this.cloudOk = ok; this.cloudText = ok ? '云端已保存' : '云端不可用(离线)'
      if (ok) {
        const counters = this.collectCounters()
        mergeStats(counters, this.ach.unlocked)
      }
      this.toastMsg(ok ? '☁️ 已上传云端存档' : '云端不可用，请先启动 backend 服务', ok)
    },
    async cloudPull() {
      if (!isOnline()) return
      const payload = await loadFromCloud()
      if (payload && payload.cfg) {
        this.cfg = deepClone(payload.cfg)
        this.ach = (payload.ach && deepClone(payload.ach)) || this.ach
        this.outfits = deepClone(payload.outfits || this.outfits)
        // #ifndef MP-WEIXIN
        this.outfits.forEach(o => { if (!o.thumb) o.thumb = th(avatarSVG(o.cfg, {})) })
        // #endif
        this.refreshStageInfo()
        this.selectCat(this.cat)
        this.persist()
        this.cloudOk = true; this.cloudText = '已读取云端'
        this.toastMsg('☁️ 已从云端恢复存档')
      }
    },
    collectCounters() {
      const p = this.ach.progress || {}
      const out = {}
      ;['dressed', 'saved', 'randoms', 'shared'].forEach(k => { if (p[k] && p[k].n) out[k] = p[k].n })
      return out
    },

    /* ---------- 舞台刷新 ---------- */
    refreshStageInfo() {
      const c = CHARACTERS[this.cfg.charId]
      this.charName = c ? c.name : ''
      this.charDesc = c ? c.desc : ''
      // #ifndef MP-WEIXIN
      this.avatarUri = th(avatarSVG(this.cfg, {}))
      // #endif
    },
    refreshAvatar() {
      // #ifndef MP-WEIXIN
      this.avatarUri = th(avatarSVG(this.cfg, {}))
      // #endif
    },

    /* ---------- 分类 / 选项网格 ---------- */
    selectCat(id) {
      this.cat = id
      this.renderGrid()
    },
    renderGrid() {
      const c = CATEGORIES.find(x => x.id === this.cat)
      if (!c) return
      this.gridTitle = (c.icon || '') + ' ' + c.name
      const out = []
      if (c.type === 'items') {
        out.push(this.makeOpt({ kind: 'removeItem', slot: c.id, remove: true, label: '脱下' }))
        getItemsByCat(c.id).forEach(it => {
          out.push(this.makeOpt({
            kind: 'item', slot: c.id, id: it.id, label: it.name,
            desc: it.tags.slice(0, 2).map(t => this.tagName(t)).join(' · '),
            ...thumbOpt(itemThumbSVG(it.id)),
            equipped: this.equippedItem(c.id) === it.id,
          }))
        })
      } else if (c.type === 'hair') {
        Object.entries(HAIRSTYLES).forEach(([id, h]) => {
          out.push(this.makeOpt({ kind: 'hair', id, label: h.name, ...thumbOpt(hairThumbSVG(id)), equipped: this.cfg.hair === id }))
        })
      } else if (c.type === 'swatch') {
        c.colors.forEach((col, i) => {
          out.push(this.makeOpt({ kind: 'swatch', key: c.key, index: i, color: col, label: '', equipped: this.cfg[c.key] === i }))
        })
      } else if (c.type === 'eyeShape') {
        EYESHAPES.forEach(e => {
          out.push(this.makeOpt({ kind: 'eyeShape', id: e.id, label: e.name, ...thumbOpt(eyeShapeThumbSVG(e.id)), equipped: this.cfg.eyeShape === e.id }))
        })
      } else if (c.type === 'char') {
        Object.entries(CHARACTERS).forEach(([id, ch]) => {
          const svg = headThumbSVG({ charId: id, skin: ch.preset.skin, hair: ch.preset.hair, hairColor: ch.preset.hairColor, eyeColor: ch.preset.eyeColor, eyeShape: ch.preset.eyeShape, items: {} })
          out.push(this.makeOpt({ kind: 'char', id, label: ch.name, desc: ch.desc, ...thumbOpt(svg), equipped: this.cfg.charId === id }))
        })
      }
      this.gridOptions = out
    },
    makeOpt(o) {
      o.remove = !!o.remove
      // 唯一 key：小程序端 :key 不支持表达式，预生成简单字符串
      let uid
      if (o.id != null) uid = o.id
      else if (o.kind === 'removeItem') uid = 'rm-' + o.slot
      else if (o.index != null) uid = o.index
      else uid = o.label || ''
      o._k = o.kind + '-' + uid
      return o
    },
    tagName(t) { return (TAG_NAMES && TAG_NAMES[t]) ? TAG_NAMES[t] : t },
    equippedItem(cat) { return (this.cfg.items || {})[cat] || null },

    /* ---------- 穿戴动作 ---------- */
    optionClick(o) {
      if (o.kind === 'char') this.changeChar(o.id)
      else if (o.kind === 'hair') this.setHair(o.id)
      else if (o.kind === 'eyeShape') this.setEye(o.id)
      else if (o.kind === 'swatch') this.setSwatch(o.key, o.index)
      else if (o.kind === 'removeItem') this.removeSlot(o.slot)
      else if (o.kind === 'item') this.setItem(o.slot, o.id)
    },
    changeChar(id) {
      if (this.cfg.charId === id) return
      this.cfg = defaultCfg(id)
      this.achTrack_('dressed', 'inc')
      this.toastMsg('已选择模特「' + CHARACTERS[id].name + '」')
      this.afterChange(true)
      this.persist()
    },
    setHair(id) {
      if (this.cfg.hair === id) return
      const n = deepClone(this.cfg); n.hair = id; this.cfg = n
      this.achTrack_('dressed', 'inc')
      this.afterChange()
      this.persist()
    },
    setEye(id) {
      if (this.cfg.eyeShape === id) return
      const n = deepClone(this.cfg); n.eyeShape = id; this.cfg = n
      this.afterChange()
      this.persist()
    },
    setSwatch(key, index) {
      const n = deepClone(this.cfg); n[key] = index; this.cfg = n
      if (key === 'hairColor') { this.achTrack_('hairTried', 'set', index); this.achTrack_('dressed', 'inc') }
      this.afterChange()
      this.persist()
    },
    setItem(cat, id) {
      const n = deepClone(this.cfg)
      ;(EXCLUSIVE[cat] || []).forEach(c2 => { if (n.items[c2]) delete n.items[c2] })
      n.items[cat] = id
      this.cfg = n
      trackTry(this.ach, cat, id)
      this.checkFullset()
      this.toastMsg('已换上「' + itemName(id) + '」')
      this.afterChange()
      this.persist()
      reportEvent('worn')
    },
    removeSlot(cat) {
      if (!this.cfg.items[cat]) return
      const n = deepClone(this.cfg); delete n.items[cat]; this.cfg = n
      this.achTrack_('dressed', 'inc')
      this.toastMsg('已脱下')
      this.afterChange()
      this.persist()
    },
    checkFullset() {
      const it = this.cfg.items
      const full = (it.dress || (it.top && (it.bottom || it.skirt))) && it.shoes
      if (full) this.achTrack_('fullset', 'flag')
    },

    afterChange(swap) {
      this.refreshAvatar()
      this.selectCat(this.cat)
      this.checkNewAch()
    },
    achTrack_(k, act, v) { achTrack(this.ach, k, act, v) },
    isUnlocked(a) { return this.ach.unlocked.indexOf(a.id) >= 0 },
    pctOf(a) { return Math.min(100, Math.round(achProgress(this.ach, a).cur / a.goal * 100)) },
    achProgressText(a) {
      const { cur, done } = achProgress(this.ach, a)
      return done ? '已解锁' : (Math.min(cur, a.goal) + ' / ' + a.goal)
    },
    checkNewAch() {
      const newly = achCheck(this.ach)
      this.persist()
      if (newly.length) {
        newly.forEach((a, i) => setTimeout(() => {
          this.toastMsg('🏆 解锁成就「' + a.name + '」！', true)
          this.confetti(22)
          reportEvent('achievement_unlocked')
        }, i * 500))
      }
    },

    /* ---------- 随机 / 重置 ---------- */
    rnd(a) { return a[Math.floor(Math.random() * a.length)] },
    randomize() {
      const n = deepClone(this.cfg)
      n.hair = this.rnd(Object.keys(HAIRSTYLES))
      n.hairColor = Math.floor(Math.random() * HAIRCOLORS.length)
      n.eyeColor = Math.floor(Math.random() * EYECOLORS.length)
      n.eyeShape = this.rnd(EYESHAPES).id
      n.items = {}
      if (Math.random() < 0.45) {
        n.items.dress = this.rnd(getItemsByCat('dress')).id
      } else {
        n.items.top = this.rnd(getItemsByCat('top')).id
        const pick = Math.random() < 0.5 ? 'bottom' : 'skirt'
        n.items[pick] = this.rnd(getItemsByCat(pick)).id
      }
      n.items.shoes = this.rnd(getItemsByCat('shoes')).id
      if (Math.random() < 0.6) n.items.hat = this.rnd(getItemsByCat('hat')).id
      if (Math.random() < 0.5) {
        const acc = ITEMS_BY_CAT.headwear.concat(ITEMS_BY_CAT.earrings, ITEMS_BY_CAT.necklace)
        n.items[this.rnd(['headwear', 'earrings', 'necklace'])] = this.rnd(acc).id
      }
      this.cfg = n
      this.achTrack_('randoms', 'inc')
      this.toastMsg('🎲 随机搭配已生成！')
      this.afterChange(true)
      this.persist()
      reportEvent('random')
    },
    resetNow() {
      this.cfg = defaultCfg(this.cfg.charId)
      this.toastMsg('已恢复初始搭配')
      this.afterChange(true)
      this.persist()
    },

    /* ---------- 衣橱 / 保存 ---------- */
    saveNow() {
      this.saveName = '搭配 #' + (this.outfits.length + 1)
      this.modal = 'save'
    },
    openLoad() { this.selIdx = -1; this.modal = 'load' },
    doSave() {
      if (this.outfits.length >= MAX_OUTFITS) { this.toastMsg('衣橱已满（8 套），请先删除一些'); return }
      const name = (this.saveName || '').trim() || ('搭配 #' + (this.outfits.length + 1))
      const info = scoreOutfit(this.cfg)
      const rec = { name, cfg: deepClone(this.cfg), score: info.score, time: Date.now() }
      // #ifndef MP-WEIXIN
      rec.thumb = th(avatarSVG(this.cfg, {}))
      // #endif
      this.outfits.unshift(rec)
      this.achTrack_('saved', 'inc')
      this.checkNewAch()
      this.persist()
      this.closeModal()
      this.confetti(info.score >= 75 ? 14 : 6)
      this.toastMsg('已保存「' + name + '」' + (info.score >= 75 ? ' · ' + info.score + ' 分的好搭配！' : '！'))
      reportEvent('save')
    },
    applyOutfit(i) {
      const o = this.outfits[i]
      if (!o) return
      this.cfg = deepClone(o.cfg)
      this.achTrack_('dressed', 'inc')
      this.toastMsg('已换上「' + o.name + '」')
      this.closeModal()
      this.afterChange(true)
      this.persist()
    },
    delOutfit(i) {
      this.outfits.splice(i, 1)
      if (this.selIdx === i) this.selIdx = -1
      this.persist()
      this.toastMsg('已删除')
    },
    // 衣橱底部「确定」：应用当前点选的一套
    applySelected() {
      if (this.selIdx < 0 || !this.outfits[this.selIdx]) {
        this.toastMsg('请先在衣橱里点选一套')
        return
      }
      this.applyOutfit(this.selIdx)
    },

    /* ---------- 评分 / 分享 ---------- */
    openRate() {
      this.rateInfo = scoreOutfit(this.cfg)
      if (this.rateInfo.score >= 90) { this.achTrack_('perfect', 'flag'); this.checkNewAch() }
      this.modal = 'rate'
      this.confetti(this.rateInfo.score >= 75 ? 12 : 4)
    },
    shareFromRate() { this.closeModal(); this.share() },
    share() {
      this.rateInfo = scoreOutfit(this.cfg)
      this.modal = 'share'
      this.achTrack_('shared', 'inc')
      this.checkNewAch()
      this.persist()
      reportEvent('share')
    },
    copyShareText() {
      const c = CHARACTERS[this.cfg.charId]
      const text = '我在「梦幻衣橱」搭配了 ' + c.name + ' 的造型，得了 ' + this.rateInfo.score + ' 分！快来挑战我吧～'
      const self = this
      if (typeof uni !== 'undefined' && uni.setClipboardData) {
        uni.setClipboardData({ data: text, success() { self.toastMsg('已复制分享文案 ✨') } })
      } else {
        // H5 兜底
        try { document.execCommand && this.fallbackCopy(text); self.toastMsg('已复制分享文案 ✨') } catch (e) { self.toastMsg('请手动复制这段文字分享') }
      }
    },
    // 非小程序端「确定」：复制分享文案并关闭分享弹层
    confirmShare() {
      this.copyShareText()
      this.closeModal()
    },
    fallbackCopy(text) {
      const ta = document.createElement('textarea'); ta.value = text
      document.body.appendChild(ta); ta.select()
      try { document.execCommand('copy') } finally { document.body.removeChild(ta) }
    },

    /* ---------- 成就 / 玩法 ---------- */
    openAch() { this.modal = 'ach' },
    openHelp() { this.showIntro = true },
    goAb() {
      if (typeof uni !== 'undefined' && uni.navigateTo) uni.navigateTo({ url: '/pages/ab/ab' })
      else location.href = '#/pages/ab/ab'
    },
    startGame() {
      this.showIntro = false
      setJSON('seen', true)
      this.cloudPull()
    },

    /* ---------- 弹层 ---------- */
    closeModal() { this.modal = null },

    /* ---------- 特效 ---------- */
    toastMsg(text, gold) {
      const t = { text, gold: !!gold, id: Date.now() + Math.random() }
      this.toasts.push(t)
      setTimeout(() => {
        const i = this.toasts.indexOf(t); if (i >= 0) this.toasts.splice(i, 1)
      }, 2400)
      if (this.toasts.length > 4) this.toasts.splice(0, this.toasts.length - 4)
    },
    confetti(n) {
      const list = []
      for (let i = 0; i < (n || 16); i++) {
        const id = Date.now() + '_' + i + '_' + Math.random()
        list.push({ e: CONFETTI_EMOJI[Math.floor(Math.random() * CONFETTI_EMOJI.length)], left: Math.random() * 100, top: -4, size: 12 + Math.random() * 14, dur: 1.6 + Math.random() * 1.6, delay: Math.random() * 0.5, id })
        const self = this
        setTimeout(() => {
          const idx = self.confettis.findIndex(x => x.id === id); if (idx >= 0) self.confettis.splice(idx, 1)
        }, 3600)
      }
      this.confettis = this.confettis.concat(list)
    },
  },
}
</script>

<style scoped>
.page { position: relative; height: 100vh; display: flex; flex-direction: column; background: #fff5f9; overflow: hidden; }
.bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }

/* 顶栏 */
.topbar { position: relative; z-index: 1; display: flex; align-items: center; padding: 14px 18px; background: rgba(255,255,255,.72); backdrop-filter: blur(6px); box-shadow: 0 2px 12px rgba(120,80,150,.08); gap: 14px; flex-wrap: wrap; }
.brand { display: flex; align-items: baseline; gap: 6px; }
.brand-emoji { font-size: 22px; }
.brand-name { font-size: 20px; font-weight: 800; color: #5a2e6d; }
.brand-sub { font-size: 12px; color: #9a86b0; }
.top-actions { display: flex; gap: 8px; margin-left: auto; flex-wrap: wrap; }
.chip { padding: 7px 14px; border-radius: 999px; background: linear-gradient(135deg,#ffb6d5,#caa6ff); color: #fff; font-weight: 700; font-size: 13px; cursor: pointer; box-shadow: 0 3px 8px rgba(180,120,220,.25); }
.chip:active { transform: scale(.96); }
.cloud-status { font-size: 11px; padding: 4px 8px; border-radius: 999px; background: #eee; color: #888; }
.cloud-status.on { background: #e3ffe9; color: #2f9e5f; }
.cloud-status.off { background: #ffe9e3; color: #d06a4a; }

/* 主体 */
.main { position: relative; z-index: 1; flex: 1; display: flex; min-height: 0; }
.rail { width: 208px; background: rgba(255,255,255,.5); border-right: 1px solid rgba(180,150,200,.2); padding: 8px 6px; box-sizing: border-box; flex-shrink: 0; }
.rail-item { display: flex; align-items: center; gap: 8px; padding: 9px 12px; border-radius: 12px; margin-bottom: 2px; cursor: pointer; }
.rail-item.active { background: linear-gradient(135deg,#ffd6e8,#d9c8ff); box-shadow: 0 2px 6px rgba(200,160,240,.2); }
.rail-ico { font-size: 16px; width: 22px; text-align: center; }
.rail-name { flex: 1; font-size: 14px; color: #4a3056; }
.rail-count { font-size: 11px; color: #b09bc4; background: #f1e9ff; border-radius: 999px; padding: 1px 7px; }
.rail-item.sep { padding: 6px 12px; }
.rail-sep { font-size: 12px; color: #c2b3d6; font-weight: 700; }

/* 内容 */
.content { flex: 1; display: flex; flex-direction: column; padding: 12px 16px; min-width: 0; overflow-y: auto; }

.stage-panel { display: flex; align-items: center; justify-content: center; gap: 28px; padding: 8px 0 6px; flex-wrap: wrap; }
.stage-wrap { position: relative; width: 300px; }
.avatar { width: 300px; }
.floor { position: absolute; left: 50%; bottom: 6px; width: 240px; height: 16px; transform: translateX(-50%); background: radial-gradient(closest-side, rgba(60,30,90,.28), transparent 75%); z-index: 0; }
.stage-side { display: flex; flex-direction: column; gap: 12px; min-width: 200px; }
.badge { display: flex; flex-direction: column; }
.badge-name { font-size: 22px; font-weight: 800; color: #5a2e6d; }
.badge-desc { font-size: 13px; color: #9a86b0; }
.ctl-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.ctl { padding: 9px 16px; border-radius: 12px; background: #fff; color: #5a2e6d; font-weight: 700; border: 1.5px solid #ead9ff; cursor: pointer; box-shadow: 0 2px 6px rgba(160,120,200,.12); }
.ctl:active { transform: scale(.96); }
.ctl-cloud { font-size: 12px; color: #7a63a8; text-decoration: underline; cursor: pointer; }

/* 选项面板 */
.opt-panel { margin-top: 6px; background: rgba(255,255,255,.78); border-radius: 18px; padding: 12px 14px; box-shadow: 0 4px 18px rgba(150,110,190,.1); }
.opt-head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 10px; }
.opt-title { font-size: 17px; font-weight: 800; color: #5a2e6d; }
.opt-hint { font-size: 12px; color: #b09bc4; }
.opt-grid { display: flex; flex-wrap: wrap; gap: 10px; }
.opt { position: relative; width: 118px; border: 2px solid transparent; border-radius: 14px; padding: 6px; background: #fff; display: flex; flex-direction: column; align-items: center; cursor: pointer; box-shadow: 0 1px 5px rgba(150,110,190,.08); transition: .12s; }
.opt.eq { border-color: #e86ab0; background: #fff4fb; }
.opt:active { transform: scale(.96); }
.opt.char { width: 132px; }
.opt-media { width: 96px; height: 96px; display: flex; align-items: center; justify-content: center; }
.opt-img { width: 96px; height: 96px; }
.dot { width: 54px; height: 54px; border-radius: 50%; border: 2px solid rgba(0,0,0,.08); box-shadow: inset 0 0 0 2px #fff; }
.rm-mark { font-size: 26px; color: #c98fae; }
.opt-name { font-size: 13px; font-weight: 700; color: #4a3056; margin-top: 2px; text-align: center; line-height: 1.2; }
.opt-desc { font-size: 11px; color: #b09bc4; text-align: center; }
.eq-tag { position: absolute; top: 4px; right: 4px; font-size: 9px; background: #e86ab0; color: #fff; padding: 1px 6px; border-radius: 999px; }
.empty { width: 100%; text-align: center; color: #b09bc4; padding: 30px 0; }

/* 弹层 */
.mask { position: fixed; inset: 0; background: rgba(40,20,60,.45); z-index: 30; }
.modal { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; z-index: 31; padding: 20px; }
.modal-card { width: 520px; max-width: 94vw; max-height: 84vh; background: #fff; border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 12px 40px rgba(80,40,120,.3); }
.m-head { padding: 16px 20px 6px; }
.m-title { font-size: 18px; font-weight: 800; color: #5a2e6d; }
.m-body { padding: 8px 20px 16px; overflow-y: auto; flex: 1; }
.m-body.center { text-align: center; }
.m-foot { padding: 12px 20px 18px; display: flex; justify-content: center; gap: 10px; }
.btn { padding: 11px 22px; border-radius: 999px; background: #f1e9ff; color: #5a2e6d; font-weight: 800; cursor: pointer; }
.btn.primary { background: linear-gradient(135deg,#ffb6d5,#caa6ff); color: #fff; box-shadow: 0 4px 12px rgba(180,120,220,.3); }
.btn.big { width: 220px; text-align: center; }
.btn:active { transform: scale(.97); }

/* 成就 */
.m-body.ach { display: flex; flex-direction: column; gap: 8px; }
.ach-card { display: flex; gap: 12px; background: #f8f3ff; border-radius: 12px; padding: 10px; align-items: center; opacity: .72; }
.ach-card.unlocked { background: linear-gradient(135deg,#fff1f6,#eef6ff); opacity: 1; box-shadow: 0 2px 6px rgba(200,150,220,.18); }
.ach-ico { font-size: 26px; }
.ach-info { flex: 1; display: flex; flex-direction: column; }
.ach-name { font-size: 14px; font-weight: 800; color: #4a3056; }
.ach-desc { font-size: 12px; color: #8f7ba6; margin: 2px 0 4px; }
.bar { height: 6px; background: #ead9ff; border-radius: 999px; overflow: hidden; }
.bar-in { height: 100%; background: linear-gradient(90deg,#ff9ecb,#b98aff); border-radius: 999px; }
.ach-state { font-size: 11px; color: #b09bc4; margin-top: 3px; }

/* 评分 */
.score-ring { width: 130px; height: 130px; border-radius: 50%; margin: 6px auto 4px; background: conic-gradient(#ff9ecb 0%, #b98aff 75%, #f0e6ff 75%); display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(180,120,220,.25); }
.score-num { font-size: 44px; font-weight: 900; color: #5a2e6d; line-height: 1; }
.score-unit { font-size: 12px; color: #9a86b0; }
.stars { font-size: 24px; color: #ffb52e; }
.stars .dim { color: #e6dcf0; }
.score-comment { margin: 8px 0 10px; font-size: 14px; color: #4a3056; line-height: 1.5; }
.dims { display: flex; justify-content: center; gap: 8px; flex-wrap: wrap; margin: 6px 0; }
.dim-chip { background: #f1e9ff; border-radius: 999px; padding: 4px 10px; font-size: 12px; color: #5a2e6d; }
.dim-k { color: #9a86b0; }
.dim-v { font-weight: 800; }
.tips { background: #fff6f0; border-radius: 12px; padding: 10px 14px; text-align: left; margin-top: 8px; }
.tips-title { font-size: 13px; font-weight: 800; color: #b06a3a; display: block; margin-bottom: 4px; }
.tip { display: block; font-size: 12px; color: #8a6a52; line-height: 1.5; }

/* 保存 / 衣橱 */
.name-input { border: 1.5px solid #ead9ff; border-radius: 10px; padding: 10px 12px; width: 100%; box-sizing: border-box; margin-bottom: 10px; }
.slot-empty { display: block; text-align: center; color: #b09bc4; padding: 16px 0; }
.slot-list { max-height: 260px; }
.slot { display: flex; align-items: center; gap: 10px; background: #faf7ff; border-radius: 12px; padding: 6px 10px; margin-bottom: 6px; }
.slot-img { width: 46px; height: 70px; flex-shrink: 0; }
.slot-mid { flex: 1; display: flex; flex-direction: column; }
.slot-name { font-size: 13px; font-weight: 700; color: #4a3056; }
.slot-time { font-size: 11px; color: #b09bc4; }
.slot-btn { padding: 6px 12px; border-radius: 8px; font-size: 12px; cursor: pointer; }
.slot-btn.ok { background: #e3ffe9; color: #2f9e5f; }
.slot-btn.del { background: #ffe9e3; color: #d06a4a; margin-left: 4px; }

/* 分享 */
.share-avatar { width: 220px; margin: 6px auto; }
.share-line { font-size: 15px; font-weight: 700; color: #5a2e6d; display: block; }
.share-tip { font-size: 12px; color: #9a86b0; display: block; margin-top: 6px; }

/* 引导 */
.intro { position: fixed; inset: 0; background: rgba(60,30,90,.55); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 20px; }
.intro-card { width: 460px; max-width: 92vw; background: #fff; border-radius: 22px; padding: 26px 28px; text-align: center; box-shadow: 0 14px 50px rgba(60,20,90,.4); }
.intro-title { font-size: 22px; font-weight: 900; color: #5a2e6d; display: block; margin-bottom: 16px; }
.intro-line { display: block; text-align: left; font-size: 14px; color: #4a3056; line-height: 1.7; }

/* Toast */
.toasts { position: fixed; top: 70px; left: 50%; transform: translateX(-50%); z-index: 60; display: flex; flex-direction: column; align-items: center; gap: 6px; pointer-events: none; }
.toast { background: rgba(60,30,90,.88); color: #fff; padding: 9px 16px; border-radius: 999px; font-size: 13px; box-shadow: 0 4px 14px rgba(0,0,0,.2); animation: fadein .2s; }
.toast.gold { background: linear-gradient(135deg,#ff9ecb,#b98aff); }

/* 撒花 */
.confetti { position: fixed; inset: 0; pointer-events: none; z-index: 55; }
.confetti-p { position: absolute; animation-name: fall; animation-timing-function: linear; animation-iteration-count: 1; }

@keyframes fadein { from { opacity: 0; transform: translateY(-6px); } }
@keyframes fall {
  0% { opacity: 0; transform: translateY(-6vh) rotate(0); }
  8% { opacity: 1; }
  100% { opacity: 0; transform: translateY(106vh) rotate(360deg); }
}

/* 窄屏适配（H5 浏览器小窗 / 平板竖屏） */
@media (max-width: 860px) {
  .main { flex-direction: column; }
  .rail { width: auto; height: auto; max-height: 120px; display: flex; flex-direction: row; flex-wrap: wrap; border-right: none; border-bottom: 1px solid rgba(180,150,200,.2); }
  .rail-item { flex: 0 0 auto; }
  .stage-panel { flex-direction: column; }
}

/* ===== 分享弹层脚部按钮 ===== */
.share-foot { padding-top: 2px; }
.share-foot .btn { min-width: 116px; text-align: center; box-sizing: border-box; }
/* 清除微信 <button> 原生样式/边框 */
.btn::after { border: none; }
.share-btn { margin: 0; line-height: 1.4; }

/* ===== 微信小程序端：按手机尺寸适配（覆盖桌面数值，不依赖 @media） ===== */
// #ifdef MP-WEIXIN
.topbar { padding: 6px 10px; gap: 6px 10px; flex-wrap: wrap; }
.brand-sub { display: none; }
.brand-name { font-size: 17px; }
.top-actions { margin-left: auto; gap: 6px; }
.chip { padding: 5px 11px; font-size: 12px; }
.cloud-status { font-size: 10px; padding: 3px 8px; }
.main { flex-direction: column; }
/* 分类：顶部横向滚动 */
.mp-rail { width: 100%; height: auto; max-height: none; border-right: none; border-bottom: 1px solid rgba(180,150,200,.25); padding: 5px 6px; white-space: nowrap; }
.mp-rail .rail-item { display: inline-flex; align-items: center; padding: 6px 11px; gap: 5px; }
.mp-rail .rail-name { font-size: 13px; white-space: nowrap; }
.rail-count { display: none; }
.content { padding: 10px 10px 16px; }
.stage-panel { flex-direction: column; gap: 6px; padding: 6px 0 0; }
.stage-wrap { width: 300px; }
.stage-side { flex-direction: row; flex-wrap: wrap; justify-content: center; align-items: center; gap: 4px 10px; min-width: 0; }
.badge { flex: 1 1 100%; text-align: center; }
.badge-name { font-size: 18px; }
.badge-desc { font-size: 12px; }
.ctl-grid { justify-content: center; }
.ctl { padding: 8px 14px; font-size: 13px; }
.ctl-cloud { font-size: 12px; }
.opt-panel { margin-top: 6px; padding: 10px; }
.opt-hint { display: none; }
.opt-grid { gap: 8px; }
.opt { width: calc((100% - 16px) / 3); min-width: 86px; padding: 4px; }
.opt.char { width: calc((100% - 16px) / 3); }
.opt-media { width: 84px; height: 84px; }
.opt-name { font-size: 12px; }
.mask, .modal, .intro, .confetti { top: 0; left: 0; right: 0; bottom: 0; }
.modal { padding: 12px; }
.modal-card { width: 94vw; max-height: 86vh; }
.m-head { padding: 14px 16px 4px; }
.m-title { font-size: 17px; }
.m-body { padding: 6px 16px 12px; }
.m-foot { padding: 6px 16px 14px; gap: 8px; }
.btn { padding: 10px 18px; font-size: 14px; }
.intro-card { width: 90vw; padding: 22px 16px; }
.toasts { top: 80px; }
// #endif

/* ===== 衣橱（我的衣橱弹层）：点选态 + 底部确定/取消 ===== */
.slot { border: 2px solid transparent; }
.slot.sel { border-color: #e86ab0; background: #fff4fb; }
.m-sub { display: block; font-size: 12px; color: #9a86b0; margin-top: 2px; }
.wardrobe-foot .btn { min-width: 116px; text-align: center; box-sizing: border-box; }

/* 防压缩：舞台/形象与缩略图容器在小屏 flex 布局里不允许被挤压 */
.stage-wrap, .avatar { flex-shrink: 0; }
.opt-media { flex-shrink: 0; }

/* 主界面禁止横向滑动/溢出 */
.page, .main, .content { overflow-x: hidden; }
/* 衣橱行按钮提到最上层，避免被画布/缩略图覆盖点不到 */
.slot-btn { position: relative; z-index: 2; }
</style>
