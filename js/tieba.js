(function () {
  'use strict';
  const D = window.XM_TIEBA;
  const esc = XM.esc;
  const main = document.getElementById('main');
  const side = document.getElementById('side');

  function user(id) { return D.users[id] || D.users.anon; }
  function lastReply(p) { return p.replies.length ? p.replies[p.replies.length - 1].at : p.at; }
  function shortTime(at) {
    const [d, t] = at.split(' ');
    if (d === '2026-08-26') return t;
    if (d.startsWith('2026')) return d.slice(5);
    return d;
  }
  function textOf(p) { return XM.plain(p.body.map(b => (typeof b === 'string' ? b : b.text || '')).join(' ')); }
  function highlight(text, kw) {
    const safe = esc(text);
    if (!kw) return safe;
    return safe.split(esc(kw)).join('<span class="hl">' + esc(kw) + '</span>');
  }
  function bodyHtml(body) {
    return body.map(b => {
      if (typeof b === 'string') return '<p>' + XM.rich(b) + '</p>';
      if (b.img) return '<img src="' + b.img + '" alt="' + esc(b.alt || '图片') + '" data-zoom>';
      if (b.link) return '<p><a href="' + b.link + '" target="_blank" rel="noopener">' + esc(b.text) + '</a></p>';
      return '';
    }).join('');
  }
  function sideHtml() {
    side.innerHTML = '<div class="tb-card"><h3>本吧信息</h3><p>白鹭渡人自己的吧。渡口、水府庙、买卖、寻人寻物都可以发。</p><p>吧主：鹭吧小编</p><p>关注 3,214　帖子 41,882</p></div>' +
      '<div class="tb-card"><h3>吧务</h3><p><a href="#/archive">历史存档（2012年以前）</a></p><p><a href="#/p/1990">七月半发帖须知</a></p></div>' +
      '<div class="tb-card"><h3>友情链接</h3><p><a href="miao.html#/" target="_blank" rel="noopener">白鹭渡水府庙</a></p><p><a href="news.html#/" target="_blank" rel="noopener">宁川融媒</a></p><p><a href="rescue.html#/" target="_blank" rel="noopener">宁川县民间应急救援队</a></p></div>';
  }
  function row(p, kw) {
    const tag = p.top ? '<span class="tag top">置顶</span>' : p.good ? '<span class="tag good">精</span>' : '<span class="tag">' + esc(p.tag) + '</span>';
    return '<div class="thread-row"><div class="num">' + p.replies.length + '</div><div class="t">' + tag + '<a class="title" href="#/p/' + p.id + '">' + highlight(p.title, kw) + '</a><div class="ex">' + highlight(textOf(p).slice(0, 60), kw) + '</div></div>' +
      '<div class="by"><span>' + esc(user(p.by).name) + '</span><span>' + shortTime(lastReply(p)) + '</span></div></div>';
  }

  function home() {
    const list = D.posts.slice().sort((a, b) => (b.top ? 1 : 0) - (a.top ? 1 : 0) || lastReply(b).localeCompare(lastReply(a)));
    main.innerHTML = '<div class="tb-card"><div class="tb-tabs"><a class="on" href="#/">看帖</a><a href="#/good">精品</a><a href="#/archive">历史存档</a></div>' + list.slice(0, 14).map(p => row(p)).join('') + '<p style="text-align:center;color:#999;font-size:13px">更早的帖子请用搜索</p></div>';
    sideHtml();
    document.title = '白鹭渡吧';
  }
  function good() {
    const list = D.posts.filter(p => p.good || p.top);
    main.innerHTML = '<div class="tb-card"><div class="tb-tabs"><a href="#/">看帖</a><a class="on" href="#/good">精品</a><a href="#/archive">历史存档</a></div>' + list.map(p => row(p)).join('') + '</div>';
    sideHtml();
  }
  function search(query) {
    const params = new URLSearchParams(query);
    const kw = (params.get('q') || '').trim();
    const year = params.get('y') || '';
    document.getElementById('q').value = kw;
    document.getElementById('y').value = year;
    const k = XM.norm(kw);
    const hits = !k ? [] : D.posts.filter(p => (XM.norm(p.title).includes(k) || XM.norm(textOf(p)).includes(k)) && (!year || p.at.startsWith(year)));
    hits.sort((a, b) => b.at.localeCompare(a.at));
    main.innerHTML = '<div class="tb-card"><div class="tb-tabs"><a href="#/">看帖</a><a class="on">搜索结果</a></div><p style="font-size:13px;color:#888">吧内搜索“' + esc(kw) + '”' + (year ? '，' + esc(year) + '年' : '') + '，找到 ' + hits.length + ' 个帖子</p>' +
      (hits.length ? hits.map(p => row(p, kw)).join('') : '<p style="color:#999">没有找到相关帖子。2012年以前的帖子在历史存档里。</p>') + '</div>';
    sideHtml();
    document.title = kw + ' - 白鹭渡吧搜索';
  }
  function floorHtml(uid, at, inner, n) {
    const u = user(uid);
    return '<div class="floor"><div class="who"><img src="' + u.avatar + '" alt=""><div><a href="#/u/' + uid + '">' + esc(u.name) + '</a><br><span class="lv">' + u.level + '级</span></div></div><div class="con">' + inner + '<div class="foot">' + n + '楼　' + esc(at) + '</div></div></div>';
  }
  function post(id) {
    const p = D.posts.find(x => x.id === id);
    if (!p) { main.innerHTML = '<div class="tb-card">该帖已被删除</div>'; sideHtml(); return; }
    const floors = [floorHtml(p.by, p.at, bodyHtml(p.body), 1)].concat(p.replies.map((r, i) => floorHtml(r.by, r.at, '<p>' + XM.rich(r.text) + '</p>', i + 2))).join('');
    main.innerHTML = '<div class="post-title">' + esc(p.title) + '</div>' + floors + '<div class="reply-box"><textarea placeholder="发表回复" aria-label="回复"></textarea><button type="button" id="reply">发表</button></div>';
    sideHtml();
    document.title = p.title + '_白鹭渡吧';
    document.getElementById('reply').addEventListener('click', () => XM.toast('游客发帖需要登录'));
  }
  function userPage(uid) {
    const u = D.users[uid];
    if (!u) return home();
    const posts = D.posts.filter(p => p.by === uid).sort((a, b) => b.at.localeCompare(a.at));
    main.innerHTML = '<div class="tb-card"><div class="user-head"><img src="' + u.avatar + '" alt="' + esc(u.name) + '的头像" data-zoom><div><h2>' + esc(u.name) + '</h2><div class="sign">' + XM.rich(u.sign || '这个人很懒，什么都没写') + '</div><div class="sign">吧龄：' + (u.since ? (2026 - Number(u.since)) + '年' : '—') + '　等级：' + u.level + '级</div></div></div></div>' +
      '<div class="tb-card"><h3>' + esc(u.name) + '的帖子</h3>' + (posts.length ? posts.map(p => row(p)).join('') : '<p>还没有发过帖</p>') + '</div>';
    sideHtml();
    document.title = u.name + '的主页_白鹭渡吧';
  }
  function archive() {
    main.innerHTML = '<div class="tb-card"><div class="tb-tabs"><a href="#/">看帖</a><a href="#/good">精品</a><a class="on" href="#/archive">历史存档</a></div>' +
      '<p>2012年以前的帖子是从老水府庙论坛（BBS）迁过来的。老论坛按干支纪年分版，迁过来以后还是按干支年份存档，输入年份查阅，比如“甲申”。</p>' +
      '<div class="archive-form"><input id="gz" placeholder="干支年份" aria-label="干支年份"><button type="button" id="go">查阅</button></div><div id="alist"></div></div>';
    sideHtml();
    const go = () => {
      const v = XM.norm(document.getElementById('gz').value).replace(/年$/, '');
      const list = D.archive[v];
      const box = document.getElementById('alist');
      if (!list) { box.innerHTML = '<p style="color:#999">这一年没有存档。存档只有 2002–2011 年。</p>'; return; }
      XM.set('archive:' + v);
      box.innerHTML = '<p style="font-size:13px;color:#888">' + esc(v) + '年，共 ' + list.length + ' 帖</p>' + list.map(a => '<div class="thread-row"><div class="num">旧</div><div class="t"><a class="title" href="#/old/' + a.id + '">' + esc(a.title) + '</a><div class="ex">' + esc(user(a.by).name) + '　' + esc(a.at) + '</div></div></div>').join('');
    };
    document.getElementById('go').addEventListener('click', go);
    document.getElementById('gz').addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
  }
  function oldPost(id) {
    const p = D.archivePosts[id];
    const year = Object.keys(D.archive).find(y => D.archive[y].some(a => a.id === id));
    if (!p || !(XM.preview || XM.flag('archive:' + year))) { location.hash = '#/archive'; return; }
    const rows = [[p.by, p.at, p.body.map(XM.rich).join('<br>')]].concat(p.replies.map(r => [r.by, r.at, XM.rich(r.text)]));
    main.innerHTML = XM.previewBanner() + '<div class="tb-card oldbbs"><div class="bar">老水府庙论坛 · 存档 · ' + esc(year) + '年　　' + esc(p.title) + '</div><table>' +
      rows.map(([u, at, html]) => '<tr><td class="u">' + esc(user(u).name) + '<br><small>' + esc(at) + '</small></td><td>' + html + '</td></tr>').join('') + '</table></div>' +
      '<p style="font-size:12px;color:#999">迁移说明：存档帖只读，回复时间保留原论坛记录。</p>';
    sideHtml();
    document.title = p.title + ' - 存档';
  }

  document.getElementById('sform').addEventListener('submit', e => {
    e.preventDefault();
    const q = document.getElementById('q').value.trim();
    const y = document.getElementById('y').value;
    location.hash = '#/search?q=' + encodeURIComponent(q) + (y ? '&y=' + y : '');
  });
  XM.route([
    [/^\/$/, home],
    [/^\/good$/, good],
    [/^\/search\?(.*)$/, search],
    [/^\/p\/(\w+)$/, post],
    [/^\/u\/(\w+)$/, userPage],
    [/^\/archive$/, archive],
    [/^\/old\/(\w+)$/, oldPost]
  ], home);
})();
