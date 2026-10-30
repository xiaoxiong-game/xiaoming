(function () {
  'use strict';
  const esc = XM.esc;
  const R = XM.reverse;
  const main = document.getElementById('main');
  const side = document.getElementById('side');
  const TODAY = '2026-08-26';

  const NOTICES = [
    ['2026-08-24', '七月里请莫在河边、渡口喊别人的大名。屋里有事，到庙里来。'],
    ['2026-08-23', '今年网上放灯登记已截止，没登上的到庙里补登。'],
    ['2026-08-17', '管事陈守义已出院，在家休养几天。中元这几晚放灯，由理事会帮着办。'],
    ['2026-08-11', '管事陈守义8月12日至16日住院。这几天网上放灯的[[后台账号交给一位理事代管]]，老人家要登灯的照常来庙里。'],
    ['2026-08-01', '今年中元放灯可以网上登记了，放灯日期可选农历七月十一到十五。'],
    ['2026-07-28', '本站由临江大学许禾同学放暑假义务搭建，族谱电子版也在整理。谢谢禾禾。']
  ];
  const GONGDE = [['许氏宗亲会', 5000], ['王有福', 2000], ['李长根', 1200], ['陈**', 600], ['渡口小卖部', 300], ['周桂香', 200], ['佚名', 100]];
  const SHICHEN = [['子', '23:00–00:59'], ['丑', '01:00–02:59'], ['寅', '03:00–04:59'], ['卯', '05:00–06:59'], ['辰', '07:00–08:59'], ['巳', '09:00–10:59'], ['午', '11:00–12:59'], ['未', '13:00–14:59'], ['申', '15:00–16:59'], ['酉', '17:00–18:59'], ['戌', '19:00–20:59'], ['亥', '21:00–22:59']];
  const LAMPS = [
    ['2026-0711-01', '陈*', '甲戌年三月十二', '陈**', '2026-08-03'],
    ['2026-0711-02', '陈氏历代', '—', '陈**', '2026-08-03'],
    ['2026-0711-05', '周*', '壬午年腊月初八', '周**', '2026-08-04'],
    ['2026-0712-03', '王*', '戊子年正月廿二', '王**', '2026-08-05'],
    ['2026-0712-11', '许氏历代', '—', '庙里代登', '2026-08-06'],
    ['2026-0712-14', '李*', '辛未年九月初三', '李**', '2026-08-06'],
    ['2026-0713-01', '周*', '乙丑年五月十七', '庙里代登', '2026-08-07'],
    ['2026-0713-03', '许*', '庚寅年七月廿八', '李**', '2026-08-09'],
    ['2026-0713-07', '许*', '丙戌年六月初九', '庙里代登', '2026-08-22'],
    ['2026-0714-02', '黄*', '己亥年冬月初一', '黄**', '2026-08-10'],
    ['2026-0714-06', '胡*', '癸酉年八月十五', '胡**', '2026-08-11'],
    ['2026-0714-09', '董*', '丁卯年二月初二', '李**', '2026-08-12'],
    ['2026-0715-01', '李氏历代', '—', '李**', '2026-08-12'],
    ['2026-0715-04', '王*', '乙巳年四月初六', '李**', '2026-08-14'],
    ['2026-0715-08', '陈*', '庚子年六月十九', '庙里代登', '2026-08-18'],
    ['2026-0715-12', '许*', '甲申年十月初十', '庙里代登', '2026-08-19'],
    ['2026-0715-15', '方*', '丙子年三月廿四', '方**', '2026-08-20'],
    ['2026-0715-21', '金*', '甲子年腊月十六', '金**', '2026-08-21'],
    ['2026-0715-22', '周氏历代', '—', '周**', '2026-08-23']
  ];
  const ARTICLES = [
    { id: 'quming', title: '白鹭渡取名旧俗', date: '2026-07-26', sig: '整理：许禾　口述：周桂香、陈守义',
      body: ['白鹭渡人家添了伢子，先有小名，后有大名。大名按族谱字辈取，上谱，上户口。小名由外婆或奶奶取，只在屋里叫。',
        '[[小名多取旱地上长的东西，麦、粟、豆、薯都有]]。老人讲，渡口人家离水近，取个旱地的名字，水里认不得。',
        '[[小名不落笔]]。不上谱，不写在纸上，也不写在灯上。奶奶的说法是，写下来就叫得到了。',
        '伢子吓着了，或者落水救上来不醒，屋里人夜里到渡口喊魂，喊的是小名。[[一个人在前头喊，屋里人在后头跟一声]]。',
        '[[七月里在河边，有人叫你大名，莫应]]。'] },
    { id: 'fangdeng', title: '中元放灯', date: '2026-07-30', sig: '口述：陈守义',
      body: ['七月半放河灯是白鹭渡的老规矩。灯是给过世的亲人放的，灯上写他的大名和生辰，庙里统一点灯，从渡口放下去。',
        '以前各家自己扎灯，这些年多数到庙里登记，庙里统一做。今年起可以在网上登记。',
        '灯上只写过世的人。拿活人的名字写灯，老辈讲是给水里找替身，作孽的事，庙里不收。',
        '灯放下水，就撤不回来了。真要撤，老辈的办法是到渡口烧一张条子，写清是哪一盏、看灯人是哪个。'] },
    { id: 'taijie', title: '渡口的七级台阶', date: '2026-08-02', sig: '整理：许禾',
      body: ['渡口的石台阶[[一共七级]]，清朝修渡口时铺的。涨水时下面几级淹着，枯水时七级都露出来。',
        '[[第七级最低]]，长年泡在水里，石头松过好几回。老人讲[[那一级是水里的人上岸的地方]]，夜里不让伢子坐。',
        '2025年县里来人看过，说要重修，还没动工。'] },
    { id: 'hanhun', title: '喊魂（未完）', date: '2026-08-08', sig: '整理：许禾',
      body: ['这篇奶奶不让我写细，只记两句。', '[[喊魂要等子时]]。[[喊的人在前头，跟的人在后头]]，前头喊一声，后头跟一声。', '别的她说用不着记，用得着的时候她在。'] }
  ];

  function shell(water) { document.body.classList.toggle('water', !!water); }
  function navOn(key) {
    document.querySelectorAll('.mz-nav a').forEach(a => a.classList.toggle('on', a.dataset.k === key));
  }
  function sideHtml() {
    const l = XM.lunar(TODAY);
    side.innerHTML = '<section class="card alm"><h3>黄历</h3><div class="alm-day"><b>' + l.day + '</b><span>' + l.month + '</span></div>' +
      '<p style="margin:2px 0;font-size:14px">2026年8月26日　星期三<br>' + l.ganzhi + '年　' + l.month + l.day + '</p>' +
      '<p class="yi"><b>宜</b>祭祀　祈福　扫舍</p><p class="ji"><b>忌</b>出行　近水　嫁娶</p>' +
      '<div class="alm-q"><label>查日子<input type="date" id="qd" min="1999-02-16" max="2031-12-31" value="' + TODAY + '"></label><div id="qr"></div></div>' +
      '<details><summary>十二时辰</summary><table class="sc">' + SHICHEN.map(s => '<tr><td>' + (s[0] === '子' ? '<b>子时</b>' : s[0] + '时') + '</td><td>' + (s[0] === '子' ? '<b>' + s[1] + '</b>' : s[1]) + '</td></tr>').join('') + '</table><p class="note">一个时辰八刻，一刻十五分钟。</p></details></section>' +
      '<section class="card"><h3>功德榜</h3>' + GONGDE.map(g => '<div class="notice"><span style="width:90px">' + esc(g[0]) + '</span>' + g[1] + '元</div>').join('') + '</section>';
    const qd = document.getElementById('qd');
    const show = () => {
      const r = qd.value && XM.lunar(qd.value);
      document.getElementById('qr').textContent = r ? '农历 ' + r.text : '查不到这一天';
    };
    qd.addEventListener('change', show);
    show();
  }
  function page(key, html, title) {
    shell(false);
    navOn(key);
    main.innerHTML = html;
    sideHtml();
    document.title = (title ? title + ' - ' : '') + '白鹭渡水府庙';
  }

  function home() {
    page('home', '<div class="card"><h2>公告</h2>' + NOTICES.map(n => '<div class="notice"><span>' + n[0] + '</span><div>' + XM.rich(n[1]) + '</div></div>').join('') + '</div>' +
      '<div class="card"><h2>中元放灯</h2><p>今年农历七月十一到十五（公历8月23日到27日）每晚八点放灯。灯号、灯签号的规矩见<a href="#/fangdeng">放灯须知</a>，登记的灯在<a href="#/fangdeng/gongshi">公示</a>里查。</p></div>' +
      '<div class="card"><h2>水府庙</h2><p>水府庙在白鹭渡渡口上首，供水府老爷。庙是清乾隆年间修的，1998年发大水冲坏过一回，2002年村里集资重修。庙里管事的事务由理事会商量着办。</p></div>');
  }
  function xuzhi() {
    page('fangdeng', '<div class="card"><h2>放灯须知</h2><dl class="faq">' +
      '<dt>什么时候放？</dt><dd>农历七月十一到十五，每晚八点从渡口放。登记时自己选哪一晚。</dd>' +
      '<dt>灯上写谁？</dt><dd>过世的亲人。一盏灯写一位，写大名和生辰；也可以写“某氏历代”。小名不写。</dd>' +
      '<dt>灯号怎么编？</dt><dd>年份-放灯日期（农历月日）-当晚序号。比如七月十四那晚的第3盏，灯号是 2026-0714-03。</dd>' +
      '<dt>灯签号是什么？</dt><dd>灯签号在登记成功的短信里，也印在灯签上，灯签拴在灯底下。最后四位是登记时分（北京时间）。</dd>' +
      '<dt>登了能撤吗？</dt><dd>还没放的灯，找管事撤。已经放下水的，网上撤不了。</dd>' +
      '<dt>要多少钱？</dt><dd>随喜，最少20元，用在做灯和渡口的路灯上。</dd></dl></div>' +
      '<div class="card"><h2>网上登记</h2><p>今年网上登记已于8月23日截止。没登上的到庙里找管事补登。</p></div>', '放灯须知');
  }
  function gongshi() {
    page('gongshi', '<div class="card"><h2>2026年中元放灯公示</h2><p style="font-size:13px;color:#9a8a70">灯主、代放人姓名部分隐去。“庙里代登”是用庙里后台登的，多是老人家来庙里请人代登。有异议请联系管事。</p><table class="gs"><thead><tr><th>灯号</th><th>灯主</th><th>生辰</th><th>代放人</th><th>登记日期</th></tr></thead><tbody>' +
      LAMPS.map(r => '<tr>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') +
      '</tbody></table><div class="faint">' + XM.rich(R('[[水里也贴了一张。]]')) + '</div><div class="reflect" aria-hidden="true">' + esc(R('gongshi')) + '</div></div>', '放灯公示');
  }
  function minsu(q) {
    const kw = (q || '').trim();
    const k = XM.norm(kw);
    const list = k ? ARTICLES.filter(a => XM.norm(XM.plain(a.title + a.body.join(''))).includes(k)) : ARTICLES;
    page('minsu', '<div class="card"><h2>白鹭渡民俗</h2><form class="search" id="ms"><input id="mq" placeholder="搜索" value="' + esc(kw) + '" aria-label="搜索民俗"><button class="btn" type="submit">搜索</button></form>' +
      '<div class="art-list">' + (list.length ? list.map(a => '<a href="#/minsu/' + a.id + '">' + esc(a.title) + '<small>' + a.date + '</small></a>').join('') : '<p>没有找到。</p>') + '</div>' +
      '<p class="note">民俗栏目由许禾整理，老人家记得的事欢迎来庙里讲。</p></div>', '民俗');
    document.getElementById('ms').addEventListener('submit', e => { e.preventDefault(); location.hash = '#/minsu/s/' + encodeURIComponent(document.getElementById('mq').value.trim()); });
  }
  function article(id) {
    const a = ARTICLES.find(x => x.id === id);
    if (!a) return minsu();
    if (id === 'quming') XM.set('ruleArticleRead');
    page('minsu', '<div class="card article"><h2>' + esc(a.title) + '</h2>' + a.body.map(p => '<p>' + XM.rich(p) + '</p>').join('') + '<p class="sig">' + esc(a.sig) + '　' + a.date + '</p><p><a href="#/minsu">← 返回民俗</a></p></div>', a.title);
  }
  function about() {
    page('about', '<div class="card"><h2>理事会</h2><p>管事：陈守义</p><p>理事：许建国　王有福　李长根</p><p>庙里的事由理事会商量着办，大事请村里老人一起议。</p></div>' +
      '<div class="card"><h2>联系</h2><p>管事陈守义，有事到庙里找他。</p><p>地址：白鹭渡渡口上首，过小卖部往上走五十米。</p></div>' +
      '<div class="card"><h2>本站</h2><p>本站由临江大学许禾同学义务搭建，族谱电子版见<a href="zupu.html#/" target="_blank" rel="noopener">白鹭渡许氏宗谱</a>。</p></div>', '关于');
  }

  // ---------- 水底下：渡口七级台阶在水下的那一面，一次只看得见一级 ----------
  const NUM = '一二三四五六七';
  const LEVELS = ['innerOpened', 'xuheFound', 'dushangKnown', 'pingpingFound', 'pingpingHeard', 'contractRead', 'withdrawAllowed'];
  // Progress through this version of the stairs. Old saves and preview don't count: every puzzle has to be answered here.
  const depthDone = () => Number(XM.state.flags.waterDepth) || 0;
  const passed = i => depthDone() > i;
  const lines = arr => arr.map(t => '<p>' + XM.rich(R(t)) + '</p>').join('');
  const said = (prompt, ans) => '<p>' + esc(R(prompt)) + '</p><p><span class="said">' + esc(ans) + '</span></p>';
  function water(html, title) {
    shell(true);
    main.innerHTML = '<div class="wt">' + html + '</div>';
    side.innerHTML = '';
    document.title = R(title || '庙府水');
  }
  function ask(prompt, onAnswer) {
    return {
      html: '<p>' + esc(R(prompt)) + '</p><form id="wf" autocomplete="off"><input id="wi" aria-label="回答"><button type="submit">' + esc(R('应')) + '</button></form><div class="reply" id="wr"></div>',
      bind() {
        document.getElementById('wf').addEventListener('submit', e => {
          e.preventDefault();
          const out = onAnswer(XM.norm(document.getElementById('wi').value));
          if (out) document.getElementById('wr').innerHTML = lines(out);
        });
      }
    };
  }
  function advance(flag) {
    XM.set(flag);
    if (depthDone() <= depth) XM.set('waterDepth', depth + 1);
    drawLevel('solved');
  }
  function roll() {
    const keeper = XM.flag('lanternWithdrawn') ? '看灯人：许建国' : '[[看灯人：＊＊＊]]';
    const rows = [['2003', '李桂兰　已渡'], ['2004', '王氏　已渡（看灯人）'], ['2015', '（这一年水里没有名字）'], ['2025', '[[平平　已渡　想回岸]]'],
      ['2026', '许禾　渡上　' + keeper + (XM.flag('nameWritten') ? '　小名已录' : '')]];
    return '<div class="roll">' + rows.map(r => '<div class="yr">' + esc(R(r[0])) + '</div><div class="nm">' + XM.rich(R(r[1])) + '</div>').join('') + '</div>';
  }
  // How the contract came about; matches the GitHub history, the 公示 and the rescue log.
  const CONTRACT_STORY = ['这张契立过两回。头一回灯还没下水，她自己把灯撤了，留了一句：灯主还活着。', '隔了两天，灯又点上了。',
    '七月十三夜里八点，庙里放灯。那晚有两盏灯姓许，一盏写许平，一盏写许禾。', '写许平的那盏顺着水走了。写许禾的那盏漂到晒谷场对面，停在芦苇边上，水推不动。',
    '九点多，她一个人到了渡口。河那边有人喊她大名，她应了一声，手机掉在第七级上。', '十一点，岸上的人沿河喊她大名。河心又应了一声。',
    '契纸底下留着三个押，应一声按一个，已经按了两个。'];
  const ECHO_FWD = ['许禾——', '许禾——', '许禾——', '哎。', '（后面一句听不清，像是倒着说的）'];
  const ECHO_BACK = ['（倒过来以后）', '[[姐，你再应我一声，我就回得来了。]]'];
  const DOOR = ['水里也贴了一张。', '上一回，也有一盏灯卡在芦苇里，水推不走。'];
  // The 2003 lantern from the forum archive: 王家的 wrote 李桂兰 on it and it stuck in the reeds downstream.
  function doorAnswer(v) {
    if (v === '兰桂李') { advance('innerOpened'); return null; }
    if (v === '李桂兰') return ['水底下看人，是反的。'];
    if (/王/.test(v)) return ['那是看灯人。问的是灯上写的名字。'];
    if (/禾/.test(v)) return ['她那盏还卡着。问的是上一盏。'];
    if (/\d/.test(v)) return ['问的是灯上写的名字。'];
    return ['不是这盏。'];
  }
  const PINGPING_ASK = ['我想回家。', '水里待久了，好些事记不清了。', '晚上回去晚了，我跟妈有个记号，她一听就晓得是我。'];
  const PINGPING = ['对。妈听到就下来开门，灯都不开。', '[[我的小名写在灯上，屋里喊不回我了。]]', '岸上有人又给我点了一盏灯，拿姐换我。', '灯撤过一回，又点上了。', '[[契跟着现在亮着的这盏，七月初十凌晨立的。]]', '还差一声。姐已经应了两声。'];
  // His signal from the space: two whistles under the window, so his mother comes down without turning on the light.
  function signAnswer(v) {
    if (v.includes('哨口')) { advance('pingpingHeard'); return null; }
    if (v.includes('口哨')) return ['水底下看人，是反的。'];
    if (/门敲|敲门/.test(v)) return ['敲门要吵醒爸的。'];
    if (/妈喊|喊妈/.test(v)) return ['半夜喊，爸会醒。'];
    if (/灯开|开灯/.test(v)) return ['妈不开灯的。'];
    return ['不是这个。'];
  }
  const withdrawn = () => (XM.flag('lanternWithdrawn') ? lines(['灯已撤。契转看灯人。']) : '');
  const STEPS = [
    {
      name: '门',
      asked: () => lines(DOOR) + said('灯上写的是谁？', '兰桂李'),
      done: () => lines(['门已开。', '渡口七级台阶，水底下也有七级。']),
      open: () => {
        const q = ask('灯上写的是谁？', doorAnswer);
        return { html: lines(DOOR) + q.html, bind: q.bind };
      }
    },
    {
      name: '名册',
      asked: () => roll() + said('你找谁？', '禾许'),
      done: () => lines(['许禾，渡上。还没渡过去。', '[[渡上的人，要报生辰来认。]]']),
      open: () => {
        const q = ask('你找谁？', v => {
          if (v === '禾许') { advance('xuheFound'); return null; }
          if (v === '许禾') return ['水底下看人，是反的。'];
          if (['平平', '许平', '平许'].includes(v)) return ['他在更下面。'];
          return ['名册上没有这个名字。'];
        });
        return { html: roll() + q.html, bind: q.bind };
      }
    },
    {
      name: '渡上',
      asked: () => said('生辰报上来。', '九初月六年戌丙'),
      done: () => lines(['许禾，丙戌年六月初九辰时生。', '站在[[第七级台阶]]下面，已经应了两声。', '[[子时三刻]]以前，还喊得回来。', '[[河心有人在叫她。]]']),
      open: () => ask('生辰报上来。', v => {
        if (v === '九初月六年戌丙' || v === '时辰九初月六年戌丙') { advance('dushangKnown'); return null; }
        if (v === '丙戌年六月初九' || v === '丙戌年六月初九辰时') return ['水底下看人，是反的。'];
        return ['渡上没有这个生辰。'];
      })
    },
    {
      name: '回声',
      asked: () => lines(['8月25日 23:10　晒谷场正对的河心']) + lines(ECHO_BACK) + said('叫她“姐”的是谁？', '平平'),
      done: () => lines(['叫她“姐”的，是平平。']),
      open: () => ({
        html: lines(['8月25日 23:10　晒谷场正对的河心']) + '<button type="button" class="play" id="pf" aria-label="正着听">▶</button><button type="button" class="play" id="pr" aria-label="倒着听">◀</button><div class="sub" id="sub"></div><div id="echoq"></div>',
        bind() {
          const sub = document.getElementById('sub');
          document.getElementById('pf').addEventListener('click', () => { sub.innerHTML = lines(ECHO_FWD); });
          document.getElementById('pr').addEventListener('click', () => {
            sub.innerHTML = lines(ECHO_BACK);
            const box = document.getElementById('echoq');
            if (box.innerHTML) return;
            const q = ask('叫她“姐”的是谁？', v => {
              if (v === '平平') { advance('pingpingFound'); return null; }
              if (v === '许平' || v === '平许') return ['水里叫他平平。灯上写的就是这个名字。'];
              return ['不是他。'];
            });
            box.innerHTML = q.html;
            q.bind();
          });
        }
      })
    },
    {
      name: '平平',
      asked: () => lines(PINGPING_ASK) + said('是什么记号？', '哨口'),
      done: () => lines(PINGPING),
      open: () => {
        const q = ask('是什么记号？', signAnswer);
        return { html: lines(PINGPING_ASK) + q.html, bind: q.bind };
      }
    },
    {
      name: '灯契',
      auto: true,
      done: () => lines(['七月初十寅时，以许禾之名，替平平回岸。', XM.flag('lanternWithdrawn') ? '看灯人：许建国。' : '看灯人：＊＊＊。', '灯不灭，契不解。']) + withdrawn() +
        lines(CONTRACT_STORY.concat(XM.flag('lanternWithdrawn') ? [] : ['看灯人那一栏，水里不念，要岸上的人自己写。'], ['还有一级。']))
    },
    {
      name: '台阶底下',
      auto: true,
      done: () => lines(['她就在下面。', '水太凉，岸上说什么她都听不见，只认得屋里叫她的那个名字。', '[[子时，让屋里人在岸上喊。喊大名，她就应了水。]]',
        '灯放下水了，岸上撤不脱，要在渡口烧条子。条子上写清是哪一盏，看灯人是哪个。', '写准了，契落到他身上；写错了，契落空，当夜落回她身上。',
        '台阶底下，禾禾的声音传上来，很轻。她只够时间留下一句话：', '[[“溪，我给你留了话，锁在我的小站上。钥匙是我们第一次一起放灯那年，照奶奶那样讲。”]]']) + withdrawn()
    }
  ];
  let depth = 0, moving = false;
  const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Every visit starts at the door; levels already answered show what the water said and the way down.
  function stairs() {
    depth = 0;
    moving = false;
    water('<h2 class="wh">' + esc(R('水府')) + '</h2><div id="lv" class="lv"></div>' + scenery(), '水府');
    drawLevel('in');
  }
  function drawLevel(mode) {
    const box = document.getElementById('lv');
    if (!box) return;
    const i = depth, s = STEPS[i];
    if (s.auto && !passed(i)) { XM.set(LEVELS[i]); XM.set('waterDepth', i + 1); }
    const open = passed(i) ? null : s.open();
    const btn = (id, t) => '<button type="button" id="' + id + '">' + esc(R(t)) + '</button>';
    box.className = 'lv' + (mode ? ' ' + mode : '');
    box.dataset.level = i + 1;
    box.innerHTML = '<div class="sh">' + esc(R('第' + NUM[i] + '级　' + s.name)) + '</div>' + (open ? open.html : (s.asked ? s.asked() : '') + '<div class="got">' + s.done() + '</div>') +
      '<p class="wnav">' + (!open && i < STEPS.length - 1 ? btn('down', '往下走一级') : '') + (i ? btn('up', '回上一级') : '') + '<a id="shore" href="#/">' + esc(R('回岸上')) + '</a></p>';
    document.body.style.setProperty('--d', i);
    if (open) open.bind();
    const down = document.getElementById('down'), up = document.getElementById('up');
    if (down) down.addEventListener('click', () => goTo(i + 1));
    if (up) up.addEventListener('click', () => goTo(i - 1));
  }
  function goTo(i) {
    const box = document.getElementById('lv');
    if (moving || !box) return;
    moving = true;
    box.className = 'lv out';
    setTimeout(() => { moving = false; depth = i; drawLevel('in'); window.scrollTo(0, 0); }, still() ? 0 : 320);
  }
  // Wave rows repeat every 1600 units, so sliding them 1600 to the side loops without a seam.
  function wave(period, amp) {
    let d = 'M0 20Q' + period / 4 + ' ' + (20 - amp) + ' ' + period / 2 + ' 20';
    for (let x = period; x <= 3200; x += period / 2) d += 'T' + x + ' 20';
    return d;
  }
  function scenery() {
    const defs = '<svg class="defs" width="0" height="0"><filter id="xm-pencil" filterUnits="userSpaceOnUse" x="0" y="0" width="3200" height="40">' +
      '<feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G"/></filter>' +
      '<filter id="xm-graphite" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="3" result="wob"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="wob" scale="1.8" xChannelSelector="R" yChannelSelector="G" result="rough"/><feTurbulence type="fractalNoise" baseFrequency="2.2" seed="9"/>' +
      '<feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 4 0 0 0 -.8" result="grain"/><feComposite in="rough" in2="grain" operator="in"/></filter></svg>';
    const rows = [['e', 800, 10], ['a', 400, 9], ['b', 320, 11], ['c', 200, 6], ['d', 160, 8]];
    return '<div class="waves" aria-hidden="true">' + defs + rows.map(([k, p, a]) => '<svg class="wv wv-' + k + '" viewBox="0 0 3200 40" width="3200" height="40"><path pathLength="3200" filter="url(#xm-pencil)" d="' + wave(p, a) + '"/></svg>').join('') + '</div>' +
      (XM.flag('lanternWithdrawn') || XM.flag('slipWrong') ? '' : lamp());
  }
  // 岸上那盏纸灯，铅笔线稿；灯签拴在底板下面，和 K7 照片里一样。条子烧掉、灯灭了以后就不画了。
  function lamp() {
    const hatch = (n, f) => Array.from({ length: n }, (_, k) => f(k)).join('');
    const side = hatch(11, k => 'M' + (78 + k * 3.2) + ' 116L' + (100 + k * 3.2) + ' 50');
    const shade = hatch(15, k => 'M' + (39 + k * 3.3) + ' 112.4L' + (42 + k * 3.3) + ' 106') + hatch(23, k => 'M' + (32 + k * 2.6) + ' 119.6L' + (34 + k * 2.6) + ' 115.8');
    const ink = ' fill="none" stroke="#d3dfdb" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"';
    return '<div class="lamp" aria-hidden="true"><svg viewBox="4 44 132 140"><defs>' +
      '<radialGradient id="xm-glow"><stop offset="0" stop-color="#ffce82" stop-opacity=".55"/><stop offset=".4" stop-color="#ffbe6e" stop-opacity=".16"/><stop offset="1" stop-color="#ffbe6e" stop-opacity="0"/></radialGradient>' +
      '<clipPath id="xm-side"><path d="M87 61L101.5 54L102 106L88 113Z"/></clipPath>' +
      '<linearGradient id="xm-fadeg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>' +
      '<mask id="xm-fade"><rect x="0" y="121" width="140" height="69" fill="url(#xm-fadeg)"/></mask></defs>' +
      '<circle class="gl" cx="62.5" cy="84" r="46" fill="url(#xm-glow)"/><ellipse class="gl" cx="62.5" cy="138" rx="9" ry="18" fill="url(#xm-glow)"/>' +
      '<path d="M36.5 62.5L87 61L88 113L36.5 114Z" fill="#ffd696" fill-opacity=".07"/><path d="M87 61L101.5 54L102 106L88 113Z" fill="#ffd696" fill-opacity=".035"/>' +
      '<g class="fl"><path d="M62.5 79C65.8 84 66 88.6 62.5 91C59 88.6 59.2 84 62.5 79Z" fill="#ffd79a"/><path d="M62.5 84.5C63.8 86.6 63.8 88.6 62.5 89.6C61.2 88.6 61.2 86.6 62.5 84.5Z" fill="#fff4dc"/></g>' +
      '<g id="xm-lampbody" filter="url(#xm-graphite)"' + ink + '>' +
      '<path d="M35 63.5L89 61.5M87 59.5L88.5 115M34 113.8L90 112.8M37.5 60.5L36.5 115.5M86 61.5L102.5 53.5M101 52L102 107.5M87 113.5L103 105.5M49 55.3L103 53.6M37 62.5L52 54.6' +
      'M30 115.5L93 114.6M30.5 120L93.5 119.2M30.2 115.2L30.6 120.4M93 114.4L93.4 119.6M93 114.6L108 107.4M93.4 119.4L108.4 112M108 107.2L108.4 112.2M30 115.4L45 108.4"/>' +
      '<path stroke-width=".8" opacity=".55" d="M38 62.4L86 61M86.6 62L87.4 112M37 114.4L87 113.6M38.4 63L37.6 113M39 66L85 64.7M88.5 65.4L100.8 59.2M54 62.3L54.4 113.5M70.5 61.8L71 113M94.5 57.6L95.2 109.7' +
      'M58.5 95.5L58.6 111M66.5 95.5L66.4 111M58.5 95.5Q62.5 93.8 66.5 95.5M62.5 94.6L62.6 91.4"/>' +
      '<path stroke-width=".6" opacity=".4" clip-path="url(#xm-side)" d="' + side + '"/><path stroke-width=".6" opacity=".4" d="' + shade + '"/>' +
      '<path stroke-width=".8" opacity=".4" d="M44 73L50 72.6M47 70.5L47.3 80M44.6 77L50.4 76.4M45 81.5Q47.5 84 50.6 81M44.4 89L50.6 88.6M47.6 87L47.2 99M44.2 94Q47 92 50.8 95M45 98.6L50 97.8"/></g>' +
      '<g class="rf" mask="url(#xm-fade)"><g transform="translate(0 241) scale(1 -1)"><use href="#xm-lampbody"/></g></g>' +
      '<g filter="url(#xm-graphite)" opacity=".45"' + ink + '><path d="M8 122Q16 119.4 24 122T40 122M98 121Q106 118.6 114 121T130 121M20 128Q28 126 36 128T52 128M76 127.5Q84 125.5 92 127.5T108 127.5"/>' +
      '<g class="tg"><path d="M34 120.5C32.6 128 36.4 133.5 35 141M30 141L40 140.4L40.8 154L30.6 154.6ZM32.4 147.2L38.6 146.8M32.6 150.6L37.4 150.3"/></g></g></svg></div>';
  }

  XM.route([
    [/^\/$/, home],
    [/^\/fangdeng$/, xuzhi],
    [/^\/fangdeng\/gongshi$/, gongshi],
    // The online withdrawal page is gone: a lantern already on the water can't be withdrawn online.
    [/^\/fangdeng\/chedeng$/, () => { location.replace('#/fangdeng'); }],
    [/^\/minsu$/, () => minsu()],
    [/^\/minsu\/s\/(.*)$/, minsu],
    [/^\/minsu\/(\w+)$/, article],
    [/^\/about$/, about],
    [/^\/?fangdeng\/ihsgnog[\/#]*$/, stairs],
    [/^\/~/, () => { location.hash = '#/fangdeng/ihsgnog'; }]
  ], home);
})();
