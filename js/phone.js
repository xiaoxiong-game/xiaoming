(function () {
  'use strict';
  const D = window.XM_PHONE;
  const esc = XM.esc;
  const app = document.getElementById('app');
  const statusBar = document.getElementById('status');
  const TODAY = '2026-08-26';

  // ---------- state helpers ----------
  function ending() { return XM.state.ending; }
  // `when` terms are joined by &. A term is ending:a|b, !flag, or flag|flag. Preview tabs pass every flag term.
  function visible(m) {
    if (!m.when) return true;
    return m.when.split('&').every(term => {
      if (term.startsWith('ending:')) return term.slice(7).split('|').includes(ending());
      if (XM.preview) return true;
      if (term.startsWith('!')) return !XM.flag(term.slice(1));
      return term.split('|').some(f => XM.flag(f));
    });
  }
  function chenLog() { return XM.state.flags.chenLog || []; }
  function threadById(id) { return D.threads.find(t => t.id === id); }
  function messagesOf(thread) {
    let list = thread.messages.filter(visible);
    if (thread.id === 'chenbo') list = chenLog();
    return list.slice().sort((a, b) => (a.at < b.at ? -1 : a.at > b.at ? 1 : 0));
  }
  function threadVisible(t) { return !t.hidden || (t.id === 'chenbo' && (XM.flag('chenAdded') || XM.preview)); }
  function unread(t) {
    const seen = XM.state.flags['seen:' + t.id] || 0;
    return Math.max(0, messagesOf(t).filter(m => m.from !== 'me' && m.type !== 'recall').length - seen);
  }
  // Preview tabs see every message; writing their count would fight a normal tab over the shared storage.
  function markSeen(t) { if (!XM.preview) XM.set('seen:' + t.id, messagesOf(t).filter(m => m.from !== 'me' && m.type !== 'recall').length); }
  function totalUnread() { return D.threads.filter(threadVisible).reduce((n, t) => n + unread(t), 0); }
  function person(id) { return D.people[id] || { name: id, avatar: 'assets/img/u-li.jpg' }; }

  function fmtStamp(at) {
    const [d, t] = at.split(' ');
    if (d === TODAY) return t;
    if (d === '2026-08-25') return '昨天 ' + t;
    const [y, mo, da] = d.split('-').map(Number);
    if (y === 2026) return mo + '月' + da + '日 ' + t;
    return y + '年' + mo + '月' + da + '日 ' + t;
  }
  function fmtList(at) {
    const [d, t] = at.split(' ');
    if (d === TODAY) return t;
    if (d === '2026-08-25') return '昨天';
    const [y, mo, da] = d.split('-').map(Number);
    return (y === 2026 ? '' : String(y).slice(2) + '/') + mo + '/' + da;
  }
  function lastText(m) {
    if (!m) return '';
    if (m.type === 'img') return '[图片]';
    if (m.type === 'voice') return '[语音]';
    if (m.type === 'link') return '[链接] ' + m.title;
    if (m.type === 'recall') return person(m.from).name + '撤回了一条消息';
    return XM.plain(m.text);
  }

  // ---------- chrome ----------
  function setStatus(dark) {
    statusBar.className = 'status' + (dark ? ' dark' : '');
    statusBar.innerHTML = '<span>' + XM.clock() + '</span><span class="bat">5G <i></i> 23%</span>';
  }
  function bar(title, back, act) {
    return '<div class="bar">' + (back ? '<a class="back" href="' + back + '" aria-label="返回">‹</a>' : '') + esc(title) + (act || '') + '</div>';
  }
  function tabs(on) {
    const n = totalUnread();
    const item = (href, key, icon, label) => '<a href="' + href + '" class="' + (on === key ? 'on' : '') + '"><span class="ti">' + icon + '</span>' + label + (key === 'chats' && n ? '<span class="badge">' + n + '</span>' : '') + '</a>';
    return '<nav class="tabs">' + item('#/chats', 'chats', '💬', '微聊') + item('#/contacts', 'contacts', '👥', '通讯录') + item('#/discover', 'discover', '🧭', '发现') + item('#/me', 'me', '👤', '我') + '</nav>';
  }
  function view(html, dark) {
    setStatus(dark);
    app.innerHTML = XM.previewBanner('显示全部进度消息') + html;
    ring();
  }

  // ---------- home ----------
  function home() {
    const n = totalUnread();
    const callReady = (XM.flag('contractRead') || XM.preview) && !ending();
    const missed = XM.flag('callRinging') && !XM.flag('callStarted');
    const notice = callReady
      ? '<a class="notice" href="#/call"><img src="assets/img/av-waipo.jpg" alt=""><div><b>外婆</b><span>' + (missed ? '视频通话邀请，未接。点这里回拨' : '十一点视频，莫睡。点这里接') + '</span></div></a>'
      : (n ? '<a class="notice" href="#/chats"><img src="assets/img/av-family.jpg" alt=""><div><b>微聊</b><span>' + n + ' 条新消息</span></div></a>' : '');
    view('<div class="screen home"><div class="wall-date">8月26日 星期三　七月十四</div><div class="wall-time">' + XM.clock() + '</div>' + notice +
      '<div class="apps">' +
      '<a class="app" href="#/chats"><div class="ico" style="background:#07c160">💬</div>微聊' + (n ? '<span class="badge">' + n + '</span>' : '') + '</a>' +
      '<a class="app" href="#/album"><div class="ico" style="background:linear-gradient(135deg,#ffcf5c,#ff7a59)">🖼️</div>相册</a>' +
      '<a class="app" href="' + (callReady ? '#/call' : '#/nocall') + '"><div class="ico" style="background:#34c759">📞</div>电话</a>' +
      '<a class="app" href="#/reset"><div class="ico" style="background:#8e8e93">↺</div>重新开始</a>' +
      '</div><div class="dock">' +
      '<a class="app" href="#/chats"><div class="ico" style="background:#07c160">💬</div></a>' +
      '<a class="app" href="#/album"><div class="ico" style="background:linear-gradient(135deg,#ffcf5c,#ff7a59)">🖼️</div></a>' +
      '<a class="app" href="#/me"><div class="ico" style="background:#8e8e93">⚙️</div></a>' +
      '</div></div>', true);
  }

  // ---------- chats ----------
  function chats() {
    const rows = D.threads.filter(threadVisible).map(t => {
      const list = messagesOf(t);
      const last = list[list.length - 1];
      const u = unread(t);
      const av = t.group ? 'assets/img/av-family.jpg' : person(t.people.find(p => p !== 'me')).avatar;
      return { t, last, html: '<a class="row" href="#/chat/' + t.id + '"><img class="av" src="' + av + '" alt="">' + (u ? '<span class="dot">' + u + '</span>' : '') +
        '<div class="mid"><div class="name">' + esc(t.title) + '</div><div class="last">' + esc((t.group && last && last.from !== 'me' && last.type !== 'recall' ? person(last.from).name + '：' : '') + lastText(last)) + '</div></div>' +
        '<div class="time">' + (last ? fmtList(last.at) : '') + '</div></a>' };
    }).sort((a, b) => ((b.last || {}).at || '').localeCompare((a.last || {}).at || ''));
    view(bar('微聊', '#/', '<a class="act" href="#/add" aria-label="添加朋友">＋</a>') + '<div class="scroll"><div class="list">' + rows.map(r => r.html).join('') + '</div></div>' + tabs('chats'));
  }

  function bubbleHtml(m) {
    if (m.type === 'img') return '<div class="bubble img"><img src="' + m.src + '" alt="' + esc(m.caption || '图片') + '" data-zoom></div>';
    if (m.type === 'link') return '<a class="bubble link" href="' + m.href + '" target="_blank" rel="noopener"><b>' + esc(m.title) + '</b><span>' + esc(m.desc) + '</span><small>' + esc(m.site || '网页') + '</small></a>';
    if (m.type === 'voice') {
      const said = ending() === 'te' && m.teText ? m.teText : m.text;
      return '<div class="bubble voice" style="min-width:' + (110 + m.seconds * 8) + 'px"><span>🔊</span><span class="sec">' + m.seconds + '″</span></div>' +
        '<div class="voice-text">' + XM.rich(said) + (m.dialect ? '<small>方言 · 识别可能不准，听不出的字按读音显示</small>' : '') + '</div>';
    }
    return '<div class="bubble">' + XM.rich(m.text).replace(/\n/g, '<br>') + '</div>';
  }

  function thread(id) {
    const t = threadById(id);
    if (!t || !threadVisible(t)) return chats();
    const list = messagesOf(t);
    let prev = null;
    const body = list.map(m => {
      let out = '';
      if (!prev || m.at.slice(0, 15) !== prev.at.slice(0, 15) && (Date.parse(m.at.replace(' ', 'T')) - Date.parse(prev.at.replace(' ', 'T')) > 300000)) out += '<div class="stamp">' + fmtStamp(m.at) + '</div>';
      prev = m;
      if (m.type === 'recall') return out + '<div class="sys">“' + esc(person(m.from).name) + '”撤回了一条消息</div>';
      if (m.type === 'sys') return out + '<div class="sys">' + esc(m.text) + '</div>';
      const p = person(m.from);
      return out + '<div class="msg' + (m.from === 'me' ? ' me' : '') + '"><img class="av" src="' + p.avatar + '" alt=""><div class="body">' + (t.group ? '<div class="who">' + esc(p.name) + '</div>' : '') + bubbleHtml(m) + '</div></div>';
    }).join('');
    const act = t.group ? '<a class="act" href="#/info/' + t.id + '" aria-label="群信息">···</a>' : '';
    let bottom = '<div class="composer"><input placeholder="' + (id === 'xuhe' ? '' : '') + '" aria-label="输入消息"><button type="button">发送</button></div>';
    if (id === 'chenbo') bottom = chenChips();
    view(bar(t.title, '#/chats', act) + '<div class="scroll" id="scroller"><div class="thread">' + body + '</div></div>' + bottom);
    markSeen(t);
    const sc = document.getElementById('scroller');
    const stick = () => { sc.scrollTop = sc.scrollHeight; };
    stick();
    // Photos load after render and push the newest messages out of view.
    sc.querySelectorAll('img').forEach(img => { if (!img.complete) img.addEventListener('load', stick, { once: true }); });
    if (id !== 'chenbo') wireComposer(t);
  }

  function wireComposer(t) {
    const input = app.querySelector('.composer input');
    const btn = app.querySelector('.composer button');
    if (!input) return;
    const send = () => {
      const text = input.value.trim();
      if (!text) return;
      input.value = '';
      if (t.id === 'xuhe') XM.toast('消息已发出，但对方一直没有回复');
      else if (t.id === 'uncle') XM.toast('大舅没有回');
      else XM.toast('已发送');
      if (/阿\s*[麦默莫墨脉陌]|麦/.test(text)) XM.set('nameWritten');
    };
    btn.addEventListener('click', send);
    input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.isComposing) send(); });
  }

  // ---------- 陈伯 dialogue ----------
  // Each step lists [what you send, next step, his replies]. Step 2 locks the temple account.
  const CHEN = [
    [
      ['陈伯，庙里放灯的后台，有人拿去给禾禾登了一盏灯', 1, ['给禾禾登灯？活人的名字写灯，庙里不收的。', '这些天我在屋里养病，放灯的事都是理事会帮着办，我冇过手。', '你讲，什么时候登的？']],
      ['陈伯，禾禾她会不会已经……', 0, ['莫讲这种话。有事说事。']],
      ['没事，陈伯早点休息', 0, ['嗯。']]
    ],
    [
      ['七月初一凌晨两点十七，七月初十凌晨三点零五，两次都是“庙里代登”', 2, ['……', '七月初一那几天，我在县医院躺着，后台的号是交给建国的。', '出院以后在屋里养病，号一直冇收回来。',
        '活人的名字写灯，我要是早晓得……', '号我现在改了，网上放灯也关了，他登不回去了。', '灯放下水了，网上撤不了。要撤，只有在渡口烧条子，你外婆晓得。', '你外婆在等你的视频，快去回她。']],
      ['七月十三晚上八点，跟别的灯一起放下去的', 1, ['那是放灯的时候。我问的是登的时候。']],
      ['八月二十号晚上九点四十六', 1, ['那是撤灯的时候，禾禾自己撤的吧？我问的是登的时候。']]
    ]
  ];
  function chenStep() { return XM.flag('accountLocked') ? 2 : Math.min(XM.state.flags.chenStep || 0, 1); }
  function chenChips() {
    const step = chenStep();
    if (step >= 2) return '<div class="chips"><span class="hint">陈伯：快去回你外婆的视频。</span></div>';
    const opts = CHEN[step].map((c, i) => '<button type="button" data-chen="' + i + '">' + esc(c[0]) + '</button>').join('');
    return '<div class="chips"><span class="hint">选一句发给陈伯</span>' + opts + '</div>';
  }
  function chenSay(i) {
    const step = chenStep();
    if (step >= 2) return;
    const [line, next, replies] = CHEN[step][i];
    const now = '2026-08-26 ' + XM.clock();
    XM.set('chenLog', chenLog().concat([{ at: now, from: 'me', text: line }], replies.map(text => ({ at: now, from: 'chenbo', text }))));
    XM.set('chenStep', next);
    if (next === 2) XM.set('accountLocked');
    thread('chenbo');
  }

  // ---------- contacts / add ----------
  function contacts() {
    const ids = ['waipo', 'mom', 'xiaoyi', 'uncle', 'erjiu', 'jiumu', 'xuhe'];
    if (XM.flag('chenAdded') || XM.preview) ids.push('chenbo');
    const label = { waipo: '外婆', mom: '妈', xiaoyi: '小姨', uncle: '大舅', erjiu: '二舅', jiumu: '舅妈', xuhe: '禾禾', chenbo: '陈伯' };
    const rows = ids.map(id => '<a class="row" href="' + (D.threads.find(t => t.id === id) ? '#/chat/' + id : '#/profile/' + id) + '"><img class="av" src="' + person(id).avatar + '" alt=""><div class="mid"><div class="name">' + label[id] + '</div></div></a>').join('');
    view(bar('通讯录', '#/', '<a class="act" href="#/add" aria-label="添加朋友">＋</a>') + '<div class="scroll"><div class="list"><a class="row" href="#/add"><div class="ico" style="width:46px;height:46px;border-radius:6px;background:#fa9d3b;display:flex;align-items:center;justify-content:center;color:#fff;font-size:22px">＋</div><div class="mid"><div class="name">添加朋友</div></div></a>' + rows + '</div></div>' + tabs('contacts'));
  }
  function profile(id) {
    const p = person(id);
    view(bar('详细资料', '#/contacts') + '<div class="scroll"><div class="card"><img src="' + p.avatar + '" alt=""><div><b>' + esc(p.name) + '</b><div class="sub">' + (id === 'waipo' ? '这个号是禾禾帮外婆弄的，外婆不会打字，只会发语音' : '') + '</div></div></div></div>');
  }
  function addFriend() {
    view(bar('添加朋友', '#/contacts') + '<div class="scroll"><div class="form-page"><input id="wid" placeholder="微聊号 / 手机号" autocomplete="off"><button type="button" id="find">搜索</button><div id="res"></div></div></div>');
    const res = document.getElementById('res');
    const find = () => {
      const v = XM.norm(document.getElementById('wid').value);
      if (!v) return;
      if (v !== 'shuifuchen') { res.innerHTML = '<div class="note">该用户不存在</div>'; return; }
      const p = D.chenbo.profile;
      if (XM.flag('chenAdded')) { location.hash = '#/chat/chenbo'; return; }
      const rejected = XM.flag('chenRejected');
      res.innerHTML = '<div class="card" style="margin-top:12px"><img src="assets/img/av-chenbo.jpg" alt=""><div><b>' + esc(p.name) + '</b><div class="sub">地区：' + esc(p.region) + '</div><div class="sub">个性签名：' + esc(p.sign) + '</div></div></div>' +
        (rejected ? '<div class="warn">陈守义没有通过你的申请，留言：你是哪家的？</div>' : '') +
        '<div class="note">发送添加朋友申请</div><textarea id="verify" rows="3">我是程溪</textarea><button type="button" id="apply">发送</button>';
      document.getElementById('apply').addEventListener('click', () => {
        const text = XM.norm(document.getElementById('verify').value);
        // 认得的家门：她妈秀英，或者外公许德昌、外婆周桂香。
        const via = text.includes('秀英') ? '' : text.includes('德昌') ? '德昌哥的外孙女？那' : text.includes('桂香') ? '桂香嫂子的外孙女？那' : null;
        if (via !== null) {
          XM.set('chenAdded');
          XM.set('chenLog', [{ at: '2026-08-26 ' + XM.clock(), from: 'chenbo', text: (via ? via + '你是秀英家的溪伢子。' : '你是秀英家的溪伢子？') + '禾禾的事我晓得。你找我做啥子' }]);
          XM.toast('陈守义通过了你的朋友验证请求');
          location.hash = '#/chat/chenbo';
          setTimeout(ringIfReady, 1500);
        } else {
          XM.set('chenRejected');
          find();
        }
      });
    };
    document.getElementById('find').addEventListener('click', find);
    document.getElementById('wid').addEventListener('keydown', e => { if (e.key === 'Enter') find(); });
  }
  function groupInfo(id) {
    const t = threadById(id);
    const people = { '外婆': 'waipo', '许建国': 'uncle', '李秋云': 'jiumu', '许建军': 'erjiu', '许秀英': 'mom', '许秀芝': 'xiaoyi', '程溪': 'me', '禾禾': 'xuhe' };
    const cells = t.members.map(n => n === '许平'
      ? '<div><img class="gone" src="assets/img/av-pingping.jpg" alt="">许平</div>'
      : '<div><img src="' + person(people[n]).avatar + '" alt="">' + esc(n) + '</div>').join('');
    view(bar('聊天信息(' + t.members.length + ')', '#/chat/' + id) + '<div class="scroll"><div class="group-members">' + cells + '</div><div class="note" style="padding:10px 14px">群公告：都是一家人，有事群里说。</div></div>');
  }

  // ---------- discover / moments / album / me ----------
  function discover() {
    view(bar('发现', '#/') + '<div class="scroll"><div class="list"><a class="row" href="#/moments"><span style="font-size:22px">🌐</span><div class="mid"><div class="name">朋友圈</div></div></a></div></div>' + tabs('discover'));
  }
  function moments() {
    const items = D.moments.filter(visible).map(m => {
      const p = person(m.who);
      const likes = m.likes || m.comments ? '<div class="likes">' + (m.likes ? '♡ ' + m.likes.map(esc).join('，') : '') + (m.comments ? m.comments.map(c => '<p><b>' + esc(c[0]) + '</b>：' + esc(c[1]) + '</p>').join('') : '') + '</div>' : '';
      return '<div class="moment"><img class="av" src="' + p.avatar + '" alt=""><div style="flex:1"><div class="name">' + esc(p.name) + '</div><div class="text">' + XM.rich(m.text) + '</div>' +
        (m.img ? '<img class="pic" src="' + m.img + '" alt="' + esc(p.name) + '的照片" data-zoom>' : '') + '<div class="meta">' + fmtStamp(m.at) + '</div>' + likes + '</div></div>';
    }).join('');
    view(bar('朋友圈', '#/discover') + '<div class="scroll"><div class="moments-cover"><div class="me">程溪<img src="assets/img/av-chengxi.jpg" alt=""></div></div><div style="height:40px;background:#fff"></div>' + items + '</div>');
  }
  function album() {
    const cells = D.album.map((p, i) => '<a href="#/album/' + i + '" style="background-image:url(' + p.src + ')" aria-label="照片 ' + (i + 1) + '"></a>').join('');
    view(bar('相册', '#/') + '<div class="scroll"><div class="album-grid">' + cells + '</div><div class="note" style="padding:10px 14px">共 ' + D.album.length + ' 张照片</div></div>');
  }
  function photo(i) {
    const p = D.album[Number(i)];
    if (!p) return album();
    view(bar('', '#/album') + '<div class="photo-view"><img src="' + p.src + '" alt="照片" data-zoom><div class="photo-info"><b>' + esc(p.at.replace(' ', '　')) + '</b><br>' + esc(p.place) + (p.note ? '<br>' + XM.rich(p.note) : '') + '</div></div>', true);
  }
  function me() {
    view(bar('我', '#/') + '<div class="scroll"><div class="card"><img src="assets/img/av-chengxi.jpg" alt=""><div><b>程溪</b><div class="sub">微聊号：' + D.me.wid + '</div></div></div>' +
      '<div class="list"><a class="row" href="#/album"><span style="font-size:22px">🖼️</span><div class="mid"><div class="name">相册</div></div></a>' +
      '<a class="row" href="#/reset"><span style="font-size:22px">⚙️</span><div class="mid"><div class="name">设置</div><div class="last">清除这台手机上的游戏进度</div></div></a></div></div>' + tabs('me'));
  }
  function resetPage() {
    view(bar('设置', '#/me') + '<div class="scroll"><div class="form-page"><div class="note">清除后，所有网站上解开的内容和结局都会重置，可以从头玩。</div><button type="button" id="doreset" style="background:#e5484d">清除游戏进度</button></div></div>');
    document.getElementById('doreset').addEventListener('click', () => { XM.reset(); XM.toast('已清除'); location.hash = '#/'; });
  }

  // ---------- video call ----------
  const SYLLABLES = ['a1', 'mo1', 'mo2', 'mo3', 'mo5', 'ma1', 'ma3', 'zuan3', 'lai2', 'o6', 'wo2', 'sui3', 'den1', 'min2', 'hy3'];
  const INITIALS = ['∅', 'm', 'z', 'l', 'w', 's', 'd', 'h'];
  const FINALS = ['a', 'o', 'uan', 'ai', 'y', 'ui', 'en', 'in'];
  const TONES = { 1: [5, 5], 2: [3, 5], 3: [2, 1, 4], 5: [5, 1], 6: [2, 2] };
  function toneSvg(t) {
    const pts = TONES[t];
    const step = 28 / (pts.length - 1);
    const path = pts.map((v, i) => (i ? 'L' : 'M') + (1 + i * step) + ' ' + (17 - (v - 1) * 4)).join(' ');
    return '<svg viewBox="0 0 30 18" aria-label="第' + t + '调"><line x1="29" y1="1" x2="29" y2="17" stroke="#888" stroke-width="1"/><path d="' + path + '" stroke="#e8e8e8" stroke-width="2" fill="none"/></svg>';
  }
  const call = { step: 'hello', log: [], wrongName: 0, round: 0, tag: null, writer: null, pad: { i: null, f: null, t: null, seq: [] } };
  function say(cls, text) { call.log.push([cls, text]); }
  function finish(kind, cause) {
    if (cause) XM.set('beCause', cause);
    XM.setEnding(kind);
    setTimeout(() => { location.href = 'ending.html'; }, 1600);
  }
  function callPage() {
    if (!(XM.flag('contractRead') || XM.preview)) {
      view(bar('电话', '#/') + '<div class="scroll"><div class="form-page"><div class="note">没有来电。</div></div></div>');
      return;
    }
    if (ending()) { location.replace('ending.html'); return; }
    XM.set('callStarted');
    if (!call.log.length) {
      // A fresh call is a fresh night: a slip burned in a call that was cut off no longer counts.
      XM.set('lanternWithdrawn', false);
      XM.set('slipWrong', false);
      say('ev', '外婆 邀请你视频通话 · 已接通 · 23:00');
      say('ev', '画面很暗，只看得见渡口的台阶，台阶上放着一支手电');
      say('yi', '小姨：溪，外婆在台阶上了。她讲话你听不懂就问我');
      say('gp', '外婆：溪伢子，你在冇？');
    }
    renderCall();
  }
  function renderCall() {
    const log = call.log.map(([c, t]) => '<p class="' + c + '">' + esc(t) + '</p>').join('');
    view('<div class="call"><div class="call-view"><span class="label">外婆 · 白鹭渡渡口</span><div class="steps"></div><div class="lamp"></div><div class="self"></div></div><div class="call-log" id="calllog">' + log + '</div><div class="call-ctl" id="ctl">' + controls() + '</div></div>', true);
    const cl = document.getElementById('calllog');
    cl.scrollTop = cl.scrollHeight;
    wireCall();
  }
  function opt(label, act) { return '<button type="button" data-act="' + act + '">' + esc(label) + '</button>'; }
  // The withdrawal slip 小姨 writes on while you tell her what goes on it.
  function slipHtml() {
    const blank = '＿＿＿＿＿＿';
    return '<div class="slip"><b>撤灯条</b><span>灯签号　' + (call.tag ? 'SFM' + esc(call.tag) : blank) + '</span><span>看灯人　' + (call.writer ? esc(call.writer.name) : blank) + '</span></div>';
  }
  function controls() {
    switch (call.step) {
      case 'hello': return '<button type="button" class="primary" data-act="hello">在，外婆</button>';
      case 'zishi': return opt('到了，现在十一点', 'zishi-ok') + opt('还冇，子时要等到半夜十二点', 'zishi-no') + opt('子时已经过了', 'zishi-past');
      case 'tag': return slipHtml() + '<div class="row2"><input id="tagNo" autocomplete="off" placeholder="灯签号" aria-label="灯签号"><button type="button" class="primary" data-act="tag">讲给小姨</button></div>';
      case 'writer': return slipHtml() + opt('写名字', 'writer-name') + opt('我不晓得', 'writer-none');
      case 'writerName': return slipHtml() + '<div class="row2"><input id="writerName" autocomplete="off" placeholder="看灯人" aria-label="看灯人"><button type="button" class="primary" data-act="writer">讲给小姨</button></div>';
      case 'stair': return '<div class="row2"><input id="stairNo" inputmode="numeric" placeholder="第几级" aria-label="第几级台阶"><button type="button" class="primary" data-act="stair">告诉外婆</button></div>';
      case 'name': return '<button type="button" class="primary" data-act="openpad">开口念</button>';
      case 'pad': return padHtml();
      case 'card': return '<div class="cards3">' + cardBtn('wheat', '地里长的') + cardBtn('ink', '写字用的') + cardBtn('pulse', '号脉用的') + '</div>';
      case 'proto': return opt('外婆喊完，我跟一声', 'proto-ok') + opt('我们一起喊', 'proto-bad') + opt('我先喊，外婆跟', 'proto-bad');
      case 'calls': return '<button type="button" class="primary" data-act="follow">跟一声（' + (call.round + 1) + '/3）</button>';
      case 'water': return opt('喊“许禾！”', 'water-big') + opt('跟着外婆喊她小名', 'water-small') + opt('屏住，不出声', 'water-silent');
      default: return '';
    }
  }
  function cardBtn(kind, label) {
    const art = {
      wheat: '<svg viewBox="0 0 64 64"><path d="M32 60 L32 18" stroke="#c9a14a" stroke-width="3"/>' + [0, 1, 2, 3, 4].map(k => '<ellipse cx="' + (26) + '" cy="' + (22 + k * 7) + '" rx="6" ry="3" fill="#d9b25a" transform="rotate(-30 26 ' + (22 + k * 7) + ')"/><ellipse cx="38" cy="' + (22 + k * 7) + '" rx="6" ry="3" fill="#d9b25a" transform="rotate(30 38 ' + (22 + k * 7) + ')"/>').join('') + '<path d="M32 18 L32 4" stroke="#b08a3a" stroke-width="1.5"/></svg>',
      ink: '<svg viewBox="0 0 64 64"><rect x="20" y="10" width="24" height="46" rx="3" fill="#1d1d1f" stroke="#666"/><rect x="25" y="20" width="14" height="22" fill="none" stroke="#c9a14a"/><text x="32" y="35" fill="#c9a14a" font-size="9" text-anchor="middle">墨</text></svg>',
      pulse: '<svg viewBox="0 0 64 64"><rect x="8" y="24" width="48" height="22" rx="11" fill="#7a3b2e"/><path d="M12 35 h10 l4 -8 l6 16 l4 -8 h16" stroke="#f0d9a8" stroke-width="2" fill="none"/></svg>'
    }[kind];
    return '<button type="button" data-act="card-' + kind + '">' + art + '<span>' + esc(label) + '</span></button>';
  }
  function padHtml() {
    const p = call.pad;
    const keys = (list, kind) => list.map(k => '<button type="button" class="' + (p[kind] === k ? 'on' : '') + '" data-pad="' + kind + ':' + k + '">' + (kind === 't' ? toneSvg(k) : esc(k)) + '</button>').join('');
    const current = (p.i ? (p.i === '∅' ? '' : p.i) : '?') + (p.f || '?') + (p.t || '?');
    return '<div class="pad"><div class="lbl">声母</div><div class="keys">' + keys(INITIALS, 'i') + '</div><div class="lbl">韵母</div><div class="keys">' + keys(FINALS, 'f') + '</div><div class="lbl">声调（调形）</div><div class="keys">' + keys(['1', '2', '3', '5', '6'], 't') + '</div>' +
      '<div class="seq">当前：<span>' + esc(current) + '</span>　已拼：' + (p.seq.length ? p.seq.map(s => '<span>' + esc(s) + '</span>').join('') : '<em style="color:#777">还没有</em>') + '</div>' +
      '<div class="row2"><button type="button" data-act="pad-add">加上这个音</button><button type="button" data-act="pad-clear">清空</button></div>' +
      '<button type="button" class="primary" data-act="pad-send">念给外婆听</button></div>';
  }
  // ---------- the withdrawal slip ----------
  const TAG_LIT = '20260713070305';
  const TAG_OLD = '20260713070217';
  const SMALL_NAME = /阿\s*[麦默莫墨脉陌]|麦/;
  const TITLES = ['大舅', '舅舅', '二舅', '大伯', '伯父', '伯伯', '舅妈', '伯母', '外婆', '奶奶', '小姨', '理事', '管事', '陈伯', '有福叔', '秋云嫂子', '我', '他', '她', '不知道', '不晓得'];
  const WRITERS = { '许建国': 'jianguo', '建国': 'jianguo', '李秋云': 'qiuyun', '秋云': 'qiuyun', '王有福': 'youfu', '有福': 'youfu', '陈守义': 'shouyi', '守义': 'shouyi', '许禾': 'xuhe', '禾禾': 'xuhe' };
  const WRITER_LINES = {
    jianguo: [['yi', '小姨：……建国哥？溪，你莫乱讲。'], ['ev', '外婆半天没出声。'], ['gp', '外婆：写。']],
    qiuyun: [['yi', '小姨：秋云嫂子？'], ['gp', '外婆：写。']],
    youfu: [['yi', '小姨：有福叔？'], ['gp', '外婆：写。']],
    shouyi: [['yi', '小姨：陈伯？他那几天在医院啊。'], ['gp', '外婆：你讲写就写。']],
    xuhe: [['yi', '小姨：禾禾自己？'], ['gp', '外婆：写。']],
    other: [['yi', '小姨：写上了。']]
  };
  function askStair() { say('gp', '外婆：她站在第几级？我往下走'); call.step = 'stair'; }
  // The number is checked as soon as you say it, so it is only ever asked once.
  function tagStep() {
    const raw = ((document.getElementById('tagNo') || {}).value || '').trim();
    const v = XM.norm(raw).replace(/^sfm/, '');
    if (!v) return;
    say('me', raw);
    const head = TAG_LIT.slice(0, 10);
    if (v === TAG_LIT) {
      call.tag = v;
      say('yi', '小姨：SFM' + v + '，写上了。');
      say('gp', '外婆：看灯人是哪个？就是在灯上写禾禾名字的那个。名字写上，契才有人接；写错了，契冇人接，就落回禾禾身上。');
      call.step = 'writer';
    } else if (v === head) say('yi', '小姨：后头还有四个数，泡糊了的那几个，你晓得是几？');
    else if (v === TAG_OLD) say('gp', '外婆：这是撤掉的那盏。水里认的是现在亮着那盏。');
    else if (/^\d{14}$/.test(v) && v.startsWith(head)) say('gp', '外婆：这个号，水里冇这盏灯。后头四个是登记的钟点，你再对一对。');
    else if (/^\d{14}$/.test(v)) say('yi', '小姨：前头对不上。灯签上看得清的是 SFM2026071307。');
    else say('yi', '小姨：就是灯签上那一串，字母带数字的。');
  }
  function writerStep(a) {
    if (a === 'writer-name') { call.step = 'writerName'; return; }
    say('me', '我不晓得');
    say('gp', '外婆：不晓得就莫乱写。条子不烧了，先喊人。');
    askStair();
  }
  function writerNameStep() {
    const raw = ((document.getElementById('writerName') || {}).value || '').trim();
    const v = XM.norm(raw);
    if (!v) return;
    say('me', raw);
    if (SMALL_NAME.test(raw)) {
      XM.set('nameWritten');
      say('gp', '外婆：你写下来了？');
      say('ev', '河面上起了一阵风。台阶上的手电灭了');
      call.step = 'over';
      finish('be', 'slip');
      return;
    }
    if (TITLES.includes(v) || !/^[\u4e00-\u9fff]{2,4}$/.test(v)) { say('yi', '小姨：条子上要写大名。'); return; }
    const who = WRITERS[v] || 'other';
    call.writer = { who, name: raw };
    WRITER_LINES[who].forEach(([c, t]) => say(c, t));
    burn();
  }
  function burn() {
    const right = call.writer.who === 'jianguo';
    say('ev', '外婆在渡口把条子点着了。');
    say('ev', right ? '火苗直直往上走，条子烧得干干净净。' : '火苗往水那边歪了一下，条子烧完了。');
    say('ev', '过了一会儿，小姨的手机响了，是救援队：K7那盏灯灭了，顺水漂走了。');
    if (right) {
      say('yi', '小姨：建国哥在上面几级坐着，一句话冇讲。');
      XM.set('lanternWithdrawn');
    } else XM.set('slipWrong', call.writer.name);
    askStair();
  }

  function act(a) {
    const s = call.step;
    if (s === 'hello') { say('me', '在，外婆'); say('gp', '外婆：子时到了冇？'); call.step = 'zishi'; }
    else if (s === 'zishi') {
      if (a === 'zishi-ok') {
        say('me', '到了，现在十一点');
        say('gp', '外婆：水上那盏灯放下去了，网上撤不脱。老规矩，烧条子撤。');
        say('gp', '外婆：灯签上那个号，你讲给秀芝。');
        say('yi', '小姨：就是灯签号。救援队拍的那张灯签上有，后头四个泡糊了。');
        call.step = 'tag';
      } else { say('me', a === 'zishi-no' ? '还冇，要等到十二点' : '子时已经过了'); say('yi', '小姨：黄历上写着子时是夜里十一点到一点，现在就是'); say('gp', '外婆：子时到了冇？'); }
    } else if (s === 'tag') tagStep();
    else if (s === 'writer') writerStep(a);
    else if (s === 'writerName') writerNameStep();
    else if (s === 'stair') {
      const v = XM.norm((document.getElementById('stairNo') || {}).value);
      if (!v) return;
      say('me', '第' + v + '级');
      if (v === '7' || v === '七') {
        say('ev', '外婆扶着栏杆往下走，一级、两级……停在第七级');
        if (XM.flag('lanternWithdrawn') && !XM.flag('accountLocked')) say('yi', '小姨：建国哥站起来了，一直低着头弄手机。');
        say('gp', '外婆：她屋里叫的那个，你听过的。讲给我听');
        call.step = 'name';
      } else say('gp', '外婆：那级我看过了，没有');
    } else if (s === 'name') {
      if (a === 'openpad') call.step = 'pad';
    } else if (s === 'pad') {
      const p = call.pad;
      if (a === 'pad-add') {
        if (!p.i || !p.f || !p.t) { XM.toast('声母、韵母、声调都要选'); return; }
        const syl = (p.i === '∅' ? '' : p.i) + p.f + p.t;
        if (!SYLLABLES.includes(syl)) { XM.toast('白鹭渡话里没有这个音'); return; }
        p.seq.push(syl); p.i = p.f = p.t = null;
      } else if (a === 'pad-clear') { p.seq = []; }
      else if (a === 'pad-send') {
        if (!p.seq.length) return;
        say('me', '（说）' + p.seq.join(' '));
        const core = p.seq.filter(x => !['zuan3', 'lai2', 'o6'].includes(x)).join(' ');
        if (core === 'a1 mo5' || core === 'mo5') {
          if (XM.flag('nameWritten')) {
            say('gp', '外婆：这个名……你写下来过');
            say('ev', '外婆没有再出声。河上有人笑了一下');
            call.step = 'over';
            finish('be', 'written');
          } else {
            say('gp', '外婆：mo……是地里长的那个，还是写字那个，还是号脉那个？');
            call.step = 'card';
          }
        } else {
          call.wrongName += 1;
          say('gp', call.wrongName >= 4 ? '外婆：子时三刻要到了……' : '外婆：不是这个音');
          if (call.wrongName >= 5) { call.step = 'over'; say('ev', '子时三刻过了'); finish('be', 'late'); }
          p.seq = [];
        }
      }
    } else if (s === 'card') {
      if (a === 'card-wheat') { say('me', '地里长的那个'); say('gp', '外婆：对，就是她。我喊一声，你跟一声'); call.step = 'proto'; }
      else say('gp', '外婆：不是。你再想想，那伢子的名是保命的');
    } else if (s === 'proto') {
      if (a === 'proto-ok') { say('me', '外婆喊完，我跟一声'); call.step = 'calls'; call.round = 0; say('ev', '外婆清了清嗓子'); }
      else say('gp', '外婆：老规矩，屋里人跟在后头');
    } else if (s === 'calls') {
      say('gp', '外婆：阿mo——转来哦——');
      say('me', '（跟）阿mo——');
      call.round += 1;
      if (call.round === 2) {
        say('water', '河心有人在喊：“许禾——”。声音很年轻，是个男伢子');
        if (XM.flag('slipWrong')) {
          // The slip named the wrong keeper, so the contract fell back on her.
          say('ev', '你还没来得及开口，台阶底下先应了一声：“哎——”是禾禾');
          call.step = 'over';
          finish('kong');
        } else {
          say('yi', '小姨：溪！河里在喊她大名！');
          call.step = 'water';
        }
      } else if (call.round >= 3) {
        say('ev', '第三声落下，台阶底下有人应了。拖着尾音，是屋里那种应法');
        call.step = 'over';
        finish(XM.flag('lanternWithdrawn') && XM.flag('accountLocked') ? 'te' : 'ne');
      }
    } else if (s === 'water') {
      if (a === 'water-small') { say('me', '（跟着外婆）阿mo——转来哦——'); say('ev', '河心那个声音停了一下'); call.step = 'calls'; }
      else {
        say('me', a === 'water-big' ? '许禾！' : '……');
        say('water', '河心：“哎——”');
        say('ev', '是禾禾的声音。她应了第三声');
        call.step = 'over';
        finish('be', a === 'water-big' ? 'bigname' : 'silent');
      }
    }
    renderCall();
  }
  function wireCall() {
    const ctl = document.getElementById('ctl');
    if (!ctl) return;
    ctl.querySelectorAll('[data-act]').forEach(b => b.addEventListener('click', () => act(b.dataset.act)));
    ctl.querySelectorAll('[data-pad]').forEach(b => b.addEventListener('click', () => {
      const [kind, val] = b.dataset.pad.split(':');
      call.pad[kind] = val;
      renderCall();
    }));
    [['stairNo', 'stair'], ['tagNo', 'tag'], ['writerName', 'writer']].forEach(([id, a]) => {
      const input = document.getElementById(id);
      if (input) { input.focus(); input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.isComposing) act(a); }); }
    });
  }

  // ---------- incoming call ----------
  // 外婆 rings once 陈伯 has added you and the water has shown the contract. Declining hides it until you next go home.
  let snoozed = false;
  function ringIfReady() {
    if (XM.flag('contractRead') && XM.flag('chenAdded') && !XM.flag('callRinging') && !XM.flag('callStarted') && !ending()) XM.set('callRinging');
  }
  function ring() {
    const old = document.getElementById('incoming');
    const want = XM.flag('callRinging') && !XM.flag('callStarted') && !ending() && !snoozed && !/^#\/call/.test(location.hash);
    if (!want) { if (old) old.remove(); return; }
    if (old) return;
    const chenFirst = XM.flag('chenAdded') && !XM.flag('accountLocked');
    const box = document.createElement('div');
    box.id = 'incoming';
    box.className = 'incoming';
    box.innerHTML = '<img src="assets/img/av-waipo.jpg" alt=""><b>外婆</b><span>邀请你视频通话</span><small>22:59</small>' +
      '<div class="ans"><button type="button" class="no" id="decline">' + (chenFirst ? '先跟陈伯说' : '拒绝') + '</button><button type="button" class="yes" id="accept">接听</button></div>';
    app.parentNode.appendChild(box);
    box.querySelector('#accept').addEventListener('click', () => { box.remove(); location.hash = '#/call'; });
    box.querySelector('#decline').addEventListener('click', () => {
      snoozed = true;
      box.remove();
      if (chenFirst && location.hash !== '#/chat/chenbo') location.hash = '#/chat/chenbo';
    });
  }

  // ---------- global wiring ----------
  app.addEventListener('click', e => {
    if (e.target.closest('.bubble.voice')) { XM.toast('语音已过期，只保留了转文字'); return; }
    const chip = e.target.closest('[data-chen]');
    if (chip) chenSay(Number(chip.dataset.chen));
  });

  ringIfReady();
  const router = XM.route([
    [/^\/$/, home],
    [/^\/chats$/, chats],
    [/^\/chat\/(\w+)$/, thread],
    [/^\/info\/(\w+)$/, groupInfo],
    [/^\/contacts$/, contacts],
    [/^\/profile\/(\w+)$/, profile],
    [/^\/add$/, addFriend],
    [/^\/discover$/, discover],
    [/^\/moments$/, moments],
    [/^\/album$/, album],
    [/^\/album\/(\d+)$/, photo],
    [/^\/me$/, me],
    [/^\/reset$/, resetPage],
    [/^\/call$/, callPage],
    [/^\/nocall$/, () => { view(bar('电话', '#/') + '<div class="scroll"><div class="form-page"><div class="note">最近没有来电。</div></div></div>'); }],
    // Endings have their own page; old links into the phone are sent there.
    [/^\/ending\/([\w-]+)$/, kind => { location.replace('ending.html' + (XM.preview ? '#' + kind : '')); }]
  ], home);
  // Read counters change on every chat render (and arrive from other tabs); only real progress re-renders.
  const progress = () => { const s = XM.state; return JSON.stringify([s.ending, Object.keys(s.flags).filter(k => !k.startsWith('seen:')).sort().map(k => [k, s.flags[k]])]); };
  let shown = progress();
  let hadContract = XM.flag('contractRead');
  XM.onChange(() => {
    // Added 陈伯 first, then read the contract in another tab: 外婆 calls as soon as the phone hears about it.
    const contract = XM.flag('contractRead');
    if (contract && !hadContract) ringIfReady();
    hadContract = contract;
    const now = progress();
    if (now === shown) { ring(); return; }
    shown = now;
    const h = location.hash;
    if (/^#\/(call|chat\/chenbo|add)/.test(h)) { setStatus(/call/.test(h)); ring(); return; }
    router();
  });
  window.addEventListener('hashchange', () => { if (/^#?\/?$/.test(location.hash)) { snoozed = false; ring(); } });
  setInterval(() => setStatus(/call|^#\/$|^$/.test(location.hash) || location.hash === ''), 30000);
})();
