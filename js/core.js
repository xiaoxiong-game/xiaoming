(function () {
  'use strict';
  const KEY = 'xiaoming.state.v1';
  const GAN = '甲乙丙丁戊己庚辛壬癸';
  const ZHI = '子丑寅卯辰巳午未申酉戌亥';
  const MONTH_NAMES = ['', '正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];
  const DAY_NAMES = ['', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

  const params = new URLSearchParams(location.search);
  if (params.get('preview') === '1') sessionStorage.setItem('xm-preview', '1');
  const preview = sessionStorage.getItem('xm-preview') === '1';

  function load() {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || '{}');
      return { flags: raw.flags || {}, ending: raw.ending || null, read: raw.read || {} };
    } catch (e) {
      return { flags: {}, ending: null, read: {} };
    }
  }
  function save(state) {
    localStorage.setItem(KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('xm-change'));
  }

  const listeners = [];
  window.addEventListener('storage', e => { if (e.key === KEY) listeners.forEach(fn => fn()); });
  window.addEventListener('xm-change', () => listeners.forEach(fn => fn()));

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  // Clue text in content data is wrapped in [[...]] and shown bold.
  function rich(value) { return esc(value).replace(/\[\[([\s\S]+?)\]\]/g, '<b>$1</b>'); }
  function plain(value) { return String(value == null ? '' : value).replace(/\[\[|\]\]/g, ''); }

  // Full-width digits/letters, spaces and common traditional forms are folded before comparing answers.
  const TRAD = { '禾': '禾', '麥': '麦', '癸': '癸', '國': '国', '許': '许', '建': '建', '甲': '甲', '戌': '戌', '陳': '陈', '鬥': '斗' };
  function norm(value) {
    return String(value || '')
      .replace(/[\uFF01-\uFF5E]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
      .replace(/[\s\u3000·•.,，。、:：\-—_/]+/g, '')
      .replace(/./g, ch => TRAD[ch] || ch)
      .toLowerCase();
  }

  function ymd(date) {
    return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + String(date.getDate()).padStart(2, '0');
  }
  function lunar(iso) {
    const table = window.XM_LUNAR || [];
    let start = null;
    for (const row of table) { if (row[0] <= iso) start = row; else break; }
    if (!start) return null;
    const day = Math.round((Date.parse(iso + 'T00:00:00Z') - Date.parse(start[0] + 'T00:00:00Z')) / 86400000) + 1;
    const gy = Number(iso.slice(0, 4)) - (start[1] >= 11 && Number(iso.slice(5, 7)) <= 2 ? 1 : 0);
    const ganzhi = GAN[(gy - 4) % 10] + ZHI[(gy - 4) % 12];
    const month = (start[2] ? '闰' : '') + MONTH_NAMES[start[1]];
    return { ganzhi, month, day: DAY_NAMES[day], text: ganzhi + '年' + month + DAY_NAMES[day], monthNo: start[1], leap: start[2], dayNo: day };
  }
  function ganzhiOf(year) { return GAN[(year - 4) % 10] + ZHI[(year - 4) % 12]; }

  // In-game clock: the latest milestone reached decides what the phone shows.
  const CLOCK = [
    ['endingSeen', '23:44'], ['lanternWithdrawn', '23:06'], ['callStarted', '23:00'], ['callRinging', '22:59'],
    ['accountLocked', '22:35'], ['letterRead', '21:50'], ['contractRead', '21:30'], ['pingpingFound', '15:20'],
    ['ruleArticleRead', '13:05'], ['spaceOpened', '11:40'], ['rescueLogOpened', '08:30']
  ];

  const XM = {
    preview,
    esc,
    rich,
    plain,
    norm,
    lunar,
    ganzhiOf,
    ymd,
    get state() { return load(); },
    flag(name) { return !!load().flags[name]; },
    set(name, value) {
      const state = load();
      const next = value === undefined ? true : value;
      if (state.flags[name] === next) return;
      state.flags[name] = next;
      save(state);
    },
    markRead(id) {
      const state = load();
      if (state.read[id]) return;
      state.read[id] = true;
      save(state);
    },
    isRead(id) { return !!load().read[id]; },
    setEnding(kind) {
      const state = load();
      state.ending = kind;
      state.flags.endingSeen = true;
      save(state);
    },
    reset() { localStorage.removeItem(KEY); window.dispatchEvent(new CustomEvent('xm-change')); },
    // Replaying the final call keeps the investigation but forgets the ending and anything said, written or burned on that night.
    clearEnding() {
      const state = load();
      state.ending = null;
      ['endingSeen', 'beCause', 'nameWritten', 'lanternWithdrawn', 'slipWrong', 'callStarted', 'callRinging'].forEach(k => { delete state.flags[k]; });
      save(state);
    },
    onChange(fn) { listeners.push(fn); },
    clock() {
      const flags = load().flags;
      for (const [name, time] of CLOCK) if (flags[name]) return time;
      return '07:12';
    },
    route(handlers, fallback) {
      function run() {
        const hash = decodeURIComponent(location.hash.replace(/^#/, '')) || '/';
        for (const [pattern, handler] of handlers) {
          const m = hash.match(pattern);
          if (m) { handler(...m.slice(1)); window.scrollTo(0, 0); return; }
        }
        (fallback || (() => {}))(hash);
        window.scrollTo(0, 0);
      }
      window.addEventListener('hashchange', run);
      run();
      return run;
    },
    previewBanner(text) {
      if (!preview) return '';
      return '<div class="xm-preview-banner">作者预览：' + esc(text || '本页门槛已跳过') + '</div>';
    },
    toast(message) {
      let box = document.querySelector('.xm-toast');
      if (!box) { box = document.createElement('div'); box.className = 'xm-toast'; document.body.appendChild(box); }
      box.textContent = message;
      box.classList.add('show');
      clearTimeout(box._t);
      box._t = setTimeout(() => box.classList.remove('show'), 2600);
    },
    reverse(text) {
      const swap = { '（': '）', '）': '（', '(': ')', ')': '(', '[': ']', ']': '[', '《': '》', '》': '《', '“': '”', '”': '“' };
      return Array.from(String(text)).reverse().map(ch => swap[ch] || ch).join('');
    },
    lightbox(src, caption) {
      const box = document.createElement('div');
      box.className = 'xm-lightbox';
      box.innerHTML = '<button type="button" aria-label="关闭">×</button><img alt="' + esc(caption || '图片') + '" src="' + esc(src) + '"><div class="cap">' + esc(caption || '') + '　点图片放大</div>';
      const img = box.querySelector('img');
      img.addEventListener('click', e => { e.stopPropagation(); img.classList.toggle('zoomed'); });
      box.addEventListener('click', () => box.remove());
      document.addEventListener('keydown', function onKey(e) { if (e.key === 'Escape') { box.remove(); document.removeEventListener('keydown', onKey); } });
      document.body.appendChild(box);
    }
  };
  document.addEventListener('click', e => {
    const img = e.target.closest && e.target.closest('img[data-zoom]');
    if (img) { e.preventDefault(); XM.lightbox(img.getAttribute('data-zoom') || img.src, img.alt); }
  });
  window.XM = XM;
})();
