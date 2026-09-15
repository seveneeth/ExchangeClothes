/* =====================================================
   梦幻衣橱 · 应用层
   状态管理 / 分类与网格 / 点击+拖拽换装 / 弹窗 / 引导
   ===================================================== */

/* ---------- 状态 ---------- */
const state = {
  cat: 'top',
  cfg: null,
};
const stage = document.getElementById('stage');
const stageWrap = document.getElementById('stageDrop');
const stageHint = document.getElementById('stageHint');
const itemGrid = document.getElementById('itemGrid');
const itemPanel = document.querySelector('.item-panel');
const itemTitle = document.getElementById('itemTitle');
const catList = document.getElementById('catList');
const charBadge = document.getElementById('charBadge');
const previewTip = document.getElementById('previewTip');

function deepClone(o){ return JSON.parse(JSON.stringify(o)); }
function defaultCfg(charId){
  const c = deepClone(CHARACTERS[charId].preset);
  return Object.assign({ charId, items: {} }, c, { items: c.items || {} });
}

/* ---------- 互斥规则（连衣裙 vs 上下装、裙 vs 裤） ---------- */
const EXCLUSIVE = {
  dress: ['top', 'bottom', 'skirt'],
  top: ['dress'],
  bottom: ['dress', 'skirt'],
  skirt: ['dress', 'bottom'],
};
const ITEMS_BY_CAT = {};
ITEMS.forEach(it => (ITEMS_BY_CAT[it.cat] = ITEMS_BY_CAT[it.cat] || []).push(it));

/* ---------- 换装核心 ---------- */
function applySlot(cat, id, silent){
  const prev = state.cfg.items[cat];
  if (prev === id) return;
  const changed = [];
  (EXCLUSIVE[cat] || []).forEach(c => {
    if (state.cfg.items[c]){ delete state.cfg.items[c]; changed.push(c); }
  });
  if (id){ state.cfg.items[cat] = id; changed.push(cat); }
  else delete state.cfg.items[cat];
  if (!silent){
    trackTry(cat, id);
    refreshStage(changed);
    renderGrid();
    checkAch();
  }
}
function trackTry(cat, id){
  achTrack('dressed', 'inc');
  if (id){
    achTrack('tried', 'set', id);
    if (cat === 'dress') achTrack('triedDress', 'set', id);
    achTrack('cats', 'set', cat);
  }
  const it = state.cfg.items;
  const full = (it.dress || (it.top && (it.bottom || it.skirt))) && it.shoes;
  if (full) achTrack('fullset', 'flag');
}
function checkAch(){
  const newly = achCheck();
  newly.forEach((a, i) => setTimeout(() => { toast(`🏆 解锁成就「${a.name}」！`, true); confetti(22); }, i * 500));
}
function refreshStage(changed, swap){
  renderStage(stage, state.cfg, { changed, swap });
  startBlink(stage);
  updateBadge();
}
function updateBadge(){
  const c = CHARACTERS[state.cfg.charId];
  charBadge.innerHTML = `<b>${c.name}</b><span>${c.desc}</span>`;
}

/* ---------- 左侧分类 ---------- */
function buildCats(){
  catList.innerHTML = '';
  CATEGORIES.forEach(c => {
    if (c.sep){
      const s = document.createElement('div');
      s.className = 'cat-sep-label'; s.textContent = c.sep;
      catList.appendChild(s);
      const line = document.createElement('div'); line.className = 'cat-sep';
      catList.appendChild(line);
      return;
    }
    const btn = document.createElement('button');
    btn.className = 'cat-item' + (state.cat === c.id ? ' active' : '');
    btn.dataset.cat = c.id;
    const count = c.type === 'items' ? ITEMS_BY_CAT[c.id].length
      : c.type === 'hair' ? Object.keys(HAIRSTYLES).length
      : c.type === 'swatch' ? c.colors.length
      : c.type === 'eyeShape' ? EYESHAPES.length
      : Object.keys(CHARACTERS).length;
    btn.innerHTML = `<span class="cat-ico">${c.icon}</span><span class="cat-n">${c.name}</span><span class="cat-count">${count}</span>`;
    btn.onclick = () => selectCat(c.id);
    catList.appendChild(btn);
  });
}
function selectCat(id){
  state.cat = id;
  catList.querySelectorAll('.cat-item').forEach(b => b.classList.toggle('active', b.dataset.cat === id));
  renderGrid();
  if (window.innerWidth <= 900) itemPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/* ---------- 右侧物品网格 ---------- */
const catDef = id => CATEGORIES.find(c => c.id === id);
function renderGrid(){
  const c = catDef(state.cat);
  if (!c) return;
  itemTitle.textContent = c.icon + ' ' + c.name;
  itemGrid.innerHTML = '';
  hidePreview();

  if (c.type === 'items'){
    addNoneCard(c.id);
    ITEMS_BY_CAT[c.id].forEach(it => addCard({
      id: it.id, cat: c.id, name: it.name,
      tags: it.tags.slice(0, 2).map(t => TAG_NAMES[t] || t),
      thumb: itemThumbSVG(it.id),
      equipped: state.cfg.items[c.id] === it.id,
    }));
  } else if (c.type === 'hair'){
    Object.entries(HAIRSTYLES).forEach(([id, h]) => addCard({
      id, cat: c.id, name: h.name, tags: [],
      thumb: hairThumbSVG(id),
      equipped: state.cfg.hair === id,
    }));
  } else if (c.type === 'swatch'){
    c.colors.forEach((col, i) => {
      const card = document.createElement('div');
      card.className = 'item-card swatch-card' + (state.cfg[c.key] === i ? ' equipped' : '');
      card.innerHTML = `<div class="swatch" style="background:${col}"></div>`;
      card.onclick = () => {
        state.cfg[c.key] = i;
        if (c.key === 'hairColor'){ achTrack('hairTried', 'set', i); refreshStage(['hairback', 'hairfront']); }
        else if (c.key === 'skin') refreshStage(['body', 'legs', 'head']);
        else refreshStage(['head']);
        renderGrid(); checkAch();
      };
      bindHover(card, () => null);
      itemGrid.appendChild(card);
    });
  } else if (c.type === 'eyeShape'){
    EYESHAPES.forEach(e => addCard({
      id: e.id, cat: c.id, name: e.name, tags: [],
      thumb: eyeShapeThumbSVG(e.id),
      equipped: state.cfg.eyeShape === e.id,
    }));
  } else if (c.type === 'char'){
    Object.entries(CHARACTERS).forEach(([id, ch]) => {
      const card = document.createElement('div');
      card.className = 'item-card' + (state.cfg.charId === id ? ' equipped' : '');
      card.innerHTML = `<div class="thumb">${headThumbSVG({ charId: id, skin: ch.preset.skin, hair: ch.preset.hair, hairColor: ch.preset.hairColor, eyeColor: ch.preset.eyeColor, eyeShape: ch.preset.eyeShape, items: {} })}</div>` +
        `<div class="iname">${ch.name}</div><div class="itags"><span class="itag">${ch.desc}</span></div>`;
      card.onclick = () => {
        if (state.cfg.charId === id) return;
        state.cfg = defaultCfg(id);
        refreshStage(null, true);
        renderGrid(); checkAch();
        toast(`已选择模特「${ch.name}」`);
      };
      bindHover(card, () => null);
      itemGrid.appendChild(card);
    });
  }
}
function addNoneCard(cat){
  const card = document.createElement('div');
  card.className = 'item-card none-card' + (!state.cfg.items[cat] ? ' equipped' : '');
  card.innerHTML = `<div class="thumb">✕</div><div class="iname">脱下</div>`;
  card.onclick = () => applySlot(cat, null);
  itemGrid.appendChild(card);
}
function addCard(o){
  const card = document.createElement('div');
  card.className = 'item-card' + (o.equipped ? ' equipped' : '');
  card.dataset.id = o.id; card.dataset.cat = o.cat;
  card.innerHTML = `<div class="thumb">${o.thumb}</div><div class="iname">${o.name}</div>` +
    (o.tags && o.tags.length ? `<div class="itags">${o.tags.map(t => `<span class="itag">${t}</span>`).join('')}</div>` : '');
  card.onclick = () => {
    if (o.cat === 'hair'){ if (state.cfg.hair !== o.id){ state.cfg.hair = o.id; refreshStage(['hairback', 'hairfront']); renderGrid(); } }
    else if (o.cat === 'eyeShape'){ if (state.cfg.eyeShape !== o.id){ state.cfg.eyeShape = o.id; refreshStage(['head']); renderGrid(); } }
    else applySlot(o.cat, o.id);
    hidePreview();
  };
  bindDrag(card);
  bindHover(card, () => {
    if (o.cat === 'hair' || o.cat === 'eyeShape') return null;
    const cfg = deepClone(state.cfg);
    (EXCLUSIVE[o.cat] || []).forEach(c2 => delete cfg.items[c2]);
    cfg.items[o.cat] = o.id;
    return { cfg, title: o.name, tag: o.tags && o.tags.length ? o.tags.join(' · ') : '' };
  });
  itemGrid.appendChild(card);
}

/* ---------- 悬停试穿预览 ---------- */
let previewTimer = null, previewData = null;
function bindHover(card, getData){
  card.addEventListener('pointerenter', e => {
    if (e.pointerType !== 'mouse' || dragActive) return;
    clearTimeout(previewTimer);
    previewTimer = setTimeout(() => {
      const data = getData();
      if (!data){ hidePreview(); return; }
      previewData = data;
      previewTip.innerHTML = avatarSVG(data.cfg, {}) +
        `<div class="pv-name">试穿预览 · ${data.title}</div>` +
        (data.tag ? `<div class="pv-tag">${data.tag}</div>` : '');
      previewTip.classList.remove('hidden');
      positionPreview(e);
    }, 110);
  });
  card.addEventListener('pointermove', e => { if (!previewTip.classList.contains('hidden')) positionPreview(e); });
  card.addEventListener('pointerleave', () => { clearTimeout(previewTimer); hidePreview(); });
}
function positionPreview(e){
  const w = 160, h = previewTip.offsetHeight || 300;
  let x = e.clientX + 18, y = e.clientY - h / 2;
  if (x + w > window.innerWidth - 8) x = e.clientX - w - 18;
  y = Math.max(8, Math.min(y, window.innerHeight - h - 8));
  previewTip.style.left = x + 'px'; previewTip.style.top = y + 'px';
}
function hidePreview(){ previewTip.classList.add('hidden'); previewData = null; }

/* ---------- 拖拽换装（Pointer 实现，支持触屏） ---------- */
let dragActive = false, dragGhost = null, dragStart = null, dragInfo = null;
function bindDrag(card){
  card.addEventListener('pointerdown', e => {
    if (!card.dataset.id) return;
    dragStart = { x: e.clientX, y: e.clientY, active: false };
    dragInfo = { id: card.dataset.id, cat: card.dataset.cat };
    const move = ev => {
      if (!dragStart) return;
      const dx = ev.clientX - dragStart.x, dy = ev.clientY - dragStart.y;
      if (!dragStart.active && Math.hypot(dx, dy) > 8){
        dragStart.active = true; dragActive = true;
        hidePreview();
        const src = card.querySelector('.thumb');
        dragGhost = document.createElement('div');
        dragGhost.className = 'drag-ghost';
        dragGhost.innerHTML = src ? src.innerHTML : '';
        document.body.appendChild(dragGhost);
        stageWrap.classList.add('drag-over');
        stageHint.classList.add('fade');
      }
      if (dragStart.active && dragGhost){
        dragGhost.style.left = (ev.clientX - 43) + 'px';
        dragGhost.style.top = (ev.clientY - 60) + 'px';
      }
    };
    const up = ev => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      if (dragStart && dragStart.active){
        const r = stageWrap.getBoundingClientRect();
        if (ev.clientX > r.left && ev.clientX < r.right && ev.clientY > r.top && ev.clientY < r.bottom){
          applyDragItem(dragInfo);
        }
        dragGhost && dragGhost.remove();
        stageWrap.classList.remove('drag-over');
        stageHint.classList.remove('fade');
      }
      dragStart = null; dragActive = false; dragGhost = null;
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  });
}
function applyDragItem(info){
  if (!info) return;
  if (info.cat === 'hair'){ state.cfg.hair = info.id; refreshStage(['hairback', 'hairfront']); renderGrid(); checkAch(); }
  else if (info.cat === 'eyeShape'){ state.cfg.eyeShape = info.id; refreshStage(['head']); renderGrid(); }
  else { applySlot(info.cat, info.id); toast(`已换上「${ITEM_MAP[info.id] ? ITEM_MAP[info.id].name : info.id}」`); }
}

/* ---------- 随机 / 重置 ---------- */
const rnd = a => a[Math.floor(Math.random() * a.length)];
document.getElementById('btnRandom').onclick = () => {
  const cfg = state.cfg;
  cfg.hair = rnd(Object.keys(HAIRSTYLES));
  cfg.hairColor = Math.floor(Math.random() * HAIRCOLORS.length);
  cfg.eyeColor = Math.floor(Math.random() * EYECOLORS.length);
  cfg.eyeShape = rnd(EYESHAPES).id;
  cfg.items = {};
  const dressIds = ITEMS_BY_CAT.dress.map(i => i.id);
  if (Math.random() < 0.45){
    cfg.items.dress = rnd(dressIds);
  } else {
    cfg.items.top = rnd(ITEMS_BY_CAT.top).id;
    cfg.items[Math.random() < 0.5 ? 'bottom' : 'skirt'] =
      rnd(Math.random() < 0.5 ? ITEMS_BY_CAT.bottom : ITEMS_BY_CAT.skirt).id;
  }
  cfg.items.shoes = rnd(ITEMS_BY_CAT.shoes).id;
  if (Math.random() < 0.6) cfg.items.hat = rnd(ITEMS_BY_CAT.hat).id;
  if (Math.random() < 0.5) cfg.items[rnd(['headwear', 'earrings', 'necklace'])] =
    rnd(ITEMS_BY_CAT.headwear.concat(ITEMS_BY_CAT.earrings, ITEMS_BY_CAT.necklace)).id;
  achTrack('randoms', 'inc');
  refreshStage(Object.keys(cfg.items), true);
  renderGrid(); checkAch();
  toast('🎲 随机搭配已生成！');
};
document.getElementById('btnReset').onclick = () => {
  const cur = state.cfg.charId;
  state.cfg = defaultCfg(cur);
  refreshStage(null, true);
  renderGrid();
  toast('已恢复初始搭配');
};

/* ---------- 弹窗基建 ---------- */
const backdrop = document.getElementById('modalBackdrop');
const modalRoot = document.getElementById('modalRoot');
function openModal(html, wide){
  modalRoot.innerHTML = `<div class="modal${wide ? ' wide' : ''}">${html}</div>`;
  backdrop.classList.remove('hidden');
  modalRoot.querySelector('.modal-close').onclick = closeModal;
  backdrop.onclick = closeModal;
  return modalRoot.querySelector('.modal');
}
function closeModal(){ modalRoot.innerHTML = ''; backdrop.classList.add('hidden'); }

/* 保存搭配 */
document.getElementById('btnSave').onclick = () => {
  const n = getOutfits().length;
  const m = openModal(`
    <div class="modal-head"><h3>💾 保存当前搭配</h3><button class="modal-close">✕</button></div>
    <div class="modal-body">
      <div class="save-row">
        <input id="outfitName" maxlength="12" placeholder="给这套搭配起个名字（如：春日野餐）" value="搭配 #${n + 1}">
      </div>
      <div id="slotList"></div>
    </div>
    <div class="modal-foot"><button class="ctrl-btn primary" id="doSave">保存（剩余 ${MAX_OUTFITS - n} 个位置）</button></div>`);
  renderSlotList(m.querySelector('#slotList'));
  m.querySelector('#doSave').onclick = () => {
    if (n >= MAX_OUTFITS){ toast('衣橱已满（8 套），请先删除一些'); return; }
    const name = m.querySelector('#outfitName').value.trim() || ('搭配 #' + (n + 1));
    const info = scoreOutfit(state.cfg);
    saveOutfit(name, deepClone(state.cfg), info.score);
    achTrack('saved', 'inc');
    checkAch();
    closeModal();
    confetti(14);
    toast(`已保存「${name}」${info.score >= 75 ? ' · ' + info.score + ' 分的好搭配！' : '！'}`);
  };
};
function renderSlotList(box){
  const list = getOutfits();
  if (!list.length){ box.innerHTML = `<div class="slot-empty">还没有保存的搭配，快去创造第一套吧 ✨</div>`; return; }
  box.innerHTML = list.map((o, i) => `
    <div class="slot-row">
      <div class="slot-thumb">${avatarSVG(o.cfg, {})}</div>
      <div class="slot-info"><b>${esc(o.name)}</b><small>${new Date(o.time).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}${o.score ? ' · ' + o.score + ' 分' : ''}</small></div>
      <button class="slot-btn apply" data-i="${i}">换上</button>
      <button class="slot-btn del" data-i="${i}">删除</button>
    </div>`).join('');
  box.querySelectorAll('.apply').forEach(b => b.onclick = () => {
    const o = getOutfits()[+b.dataset.i];
    if (!o) return;
    state.cfg = deepClone(o.cfg);
    refreshStage(null, true);
    renderGrid(); closeModal();
    toast(`已换上「${o.name}」`);
  });
  box.querySelectorAll('.del').forEach(b => b.onclick = () => {
    deleteOutfit(+b.dataset.i);
    renderSlotList(box);
    toast('已删除');
  });
}
function esc(s){ return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }

/* 我的衣橱（加载） */
document.getElementById('btnLoad').onclick = () => {
  const m = openModal(`
    <div class="modal-head"><h3>📂 我的衣橱</h3><button class="modal-close">✕</button></div>
    <div class="modal-body"><div id="slotList2" class="slot-list" style="margin:0"></div></div>`, true);
  renderSlotList(m.querySelector('#slotList2'));
};

/* 搭配评分 */
document.getElementById('btnRate').onclick = () => {
  const info = scoreOutfit(state.cfg);
  if (info.score >= 90){ achTrack('perfect', 'flag'); checkAch(); }
  const dims = { complete: '完整度', harmony: '色彩', style: '风格', bonus: '点睛' };
  const m = openModal(`
    <div class="modal-head"><h3>⭐ 搭配评分</h3><button class="modal-close">✕</button></div>
    <div class="modal-body" style="text-align:center">
      <div class="score-ring" style="--p:${info.score}"><div><b>${info.score}</b><br><small>SCORE</small></div></div>
      <div class="stars">${[1, 2, 3, 4, 5].map(i => `<span class="${i <= info.stars ? '' : 'off'}">★</span>`).join('')}</div>
      <div class="score-comment">${info.comment}</div>
      <div class="score-dims">${Object.entries(info.dims).map(([k, v]) => `<span class="dim-chip">${dims[k]} <b>${v}</b></span>`).join('')}</div>
      <div class="score-tips" style="text-align:left"><b>💡 搭配建议：</b><ul>${info.tips.map(t => `<li>${t}</li>`).join('')}</ul></div>
    </div>
    <div class="modal-foot"><button class="ctrl-btn primary" id="rateShare">📤 分享这套搭配</button></div>`);
  confetti(info.score >= 75 ? 20 : 8);
  m.querySelector('#rateShare').onclick = () => { closeModal(); document.getElementById('btnShare').click(); };
};

/* 分享 */
document.getElementById('btnShare').onclick = () => {
  const info = scoreOutfit(state.cfg);
  const m = openModal(`
    <div class="modal-head"><h3>📤 分享搭配</h3><button class="modal-close">✕</button></div>
    <div class="modal-body">
      <div class="share-canvas-wrap"><canvas id="shareCv" width="750" height="1000"></canvas></div>
      <div class="share-btns">
        <button class="share-btn" id="shDl">⬇️ 保存图片</button>
        <button class="share-btn wx" id="shWx">💬 微信分享</button>
        <button class="share-btn wb" id="shWb">🔥 微博分享</button>
      </div>
      <div class="share-tip">提示：保存图片后，可在微信中发送给好友或分享到朋友圈</div>
    </div>`, true);
  const cv = m.querySelector('#shareCv');
  const holder = makeShareCard(state.cfg, info);
  holder.then(c => { const ctx = cv.getContext('2d'); ctx.drawImage(c, 0, 0); });
  m.querySelector('#shDl').onclick = () => holder.then(c => { downloadCanvas(c, '我的梦幻衣橱穿搭.png'); toast('图片已保存 🎉'); });
  m.querySelector('#shWx').onclick = () => holder.then(c => { downloadCanvas(c, '我的梦幻衣橱穿搭.png'); toast('已保存图片，打开微信发送给好友即可分享 💬'); });
  m.querySelector('#shWb').onclick = () => {
    achTrack('shared', 'inc'); checkAch();
    const text = encodeURIComponent('我在「梦幻衣橱」搭配了 ' + CHARACTERS[state.cfg.charId].name + ' 的造型，得了 ' + info.score + ' 分！快来挑战我吧～');
    window.open('https://service.weibo.com/share/share.php?title=' + text, '_blank');
  };
  achTrack('shared', 'inc'); checkAch();
};

/* 成就墙 */
document.getElementById('btnAch').onclick = () => {
  const rows = ACHIEVEMENTS.map(a => {
    const { cur, done } = achProgress(a);
    const pct = Math.min(100, Math.round(cur / a.goal * 100));
    return `<div class="ach-card${done ? ' unlocked' : ''}">
      <div class="ach-ico">${a.icon}</div>
      <div class="ach-info"><b>${a.name} ${done ? '✓' : ''}</b><p>${a.desc}</p>
        <div class="ach-bar"><i style="width:${pct}%"></i></div>
        <div class="ach-state">${done ? '已解锁' : `${Math.min(cur, a.goal)} / ${a.goal}`}</div>
      </div></div>`;
  }).join('');
  openModal(`
    <div class="modal-head"><h3>🏆 成就墙（${achState.unlocked.length}/${ACHIEVEMENTS.length}）</h3><button class="modal-close">✕</button></div>
    <div class="modal-body"><div class="ach-grid">${rows}</div></div>`, true);
};

/* 玩法说明 */
function showHelp(){
  document.getElementById('introOverlay').classList.remove('hidden');
}
document.getElementById('btnHelp').onclick = showHelp;
document.getElementById('introStart').onclick = () => {
  document.getElementById('introOverlay').classList.add('hidden');
  store.set('seen', true);
};

/* ---------- 初始化 ---------- */
function init(){
  state.cfg = defaultCfg('yu');
  buildCats();
  selectCat('top');
  refreshStage(null, true);
  renderGrid();
  if (!store.get('seen', false)) showHelp();
}
init();
