// Content for 程溪's phone. `when` names a progress flag; messages without it are there from the start.
window.XM_PHONE = {
  me: { name: '程溪', avatar: 'assets/img/av-chengxi.jpg', wid: 'cx_1994' },
  people: {
    me: { name: '程溪', avatar: 'assets/img/av-chengxi.jpg' },
    xuhe: { name: '禾禾', avatar: 'assets/img/av-xuhe.jpg' },
    uncle: { name: '许建国', avatar: 'assets/img/av-uncle.jpg' },
    mom: { name: '许秀英', avatar: 'assets/img/av-mom.jpg' },
    xiaoyi: { name: '许秀芝', avatar: 'assets/img/av-xiaoyi.jpg' },
    waipo: { name: '外婆', avatar: 'assets/img/av-waipo.jpg' },
    erjiu: { name: '许建军', avatar: 'assets/img/av-erjiu.jpg' },
    jiumu: { name: '李秋云', avatar: 'assets/img/u-laoxu.jpg' },
    chenbo: { name: '陈守义', avatar: 'assets/img/av-chenbo.jpg' }
  },
  threads: [
    {
      id: 'xuhe', title: '禾禾', people: ['me', 'xuhe'],
      messages: [
        { at: '2026-07-19 21:02', from: 'xuhe', text: '溪，你暑假回不回白鹭渡' },
        { at: '2026-07-19 21:05', from: 'me', text: '回不了，项目拖到九月了' },
        { at: '2026-07-19 21:05', from: 'xuhe', text: '好吧' },
        { at: '2026-07-19 21:06', from: 'xuhe', text: '我在奶奶家，帮宗亲会把族谱敲进电脑' },
        { at: '2026-07-19 21:07', from: 'xuhe', text: '陈伯说弄好了挂到庙里网站上，以后七月半放灯也能网上登记' },
        { at: '2026-07-19 21:09', from: 'me', text: '厉害，给钱吗' },
        { at: '2026-07-19 21:09', from: 'xuhe', text: '管饭' },
        { at: '2026-07-19 21:09', from: 'xuhe', text: '奶奶做的饭，不亏' },
        { at: '2026-08-01 23:20', from: 'xuhe', type: 'link', href: 'blog.html#/p/shangwang', title: '把族谱搬上网', desc: '暑假在奶奶家，帮宗亲会把卷三录成了网页', site: '禾的小站' },
        { at: '2026-08-01 23:20', from: 'xuhe', text: '写了篇东西，捧个场' },
        { at: '2026-08-03 22:40', from: 'xuhe', type: 'img', src: 'assets/img/zupu-scan.jpg', caption: '族谱卷三' },
        { at: '2026-08-03 22:41', from: 'xuhe', text: '你看，爷爷这一支，你妈也在上面' },
        { at: '2026-08-03 22:41', from: 'xuhe', text: '我那一栏乳名是空的，奶奶死活不让写' },
        { at: '2026-08-03 22:43', from: 'me', text: '为啥' },
        { at: '2026-08-03 22:44', from: 'xuhe', text: '她说[[写下来就喊不回来了]]' },
        { at: '2026-08-03 22:44', from: 'xuhe', text: '老规矩，懒得跟她犟' },
        { at: '2026-08-21 00:13', from: 'xuhe', text: '问你个事' },
        { at: '2026-08-21 00:14', from: 'xuhe', text: '要是有人背着你，[[拿你名字去办事]]，你会怎么办' },
        { at: '2026-08-21 00:20', from: 'me', text: '谁？办啥事？' },
        { at: '2026-08-21 00:31', from: 'xuhe', text: '没事，我自己弄好了' },
        { at: '2026-08-21 00:31', from: 'xuhe', text: '睡了' },
        { at: '2026-08-24 18:42', from: 'xuhe', type: 'img', src: 'assets/img/shaigu.jpg', caption: '晒谷场' },
        { at: '2026-08-24 18:43', from: 'xuhe', text: '奶奶又在[[喊我小名]]，二十岁了😂' },
        { at: '2026-08-24 18:43', from: 'xuhe', type: 'voice', seconds: 7, dialect: true, text: '[[ā mò，ā mò]]，转来哦', teText: 'ā ▢，ā ▢，转来哦' },
        { at: '2026-08-24 23:58', from: 'xuhe', text: '溪，这几天[[别喊我名字]]' },
        { at: '2026-08-24 23:58', from: 'xuhe', text: '[[打字也别打]]' },
        { at: '2026-08-25 08:10', from: 'me', text: '？' },
        { at: '2026-08-25 08:11', from: 'me', text: '你咋了' },
        { at: '2026-08-26 06:58', from: 'me', text: '小姨说你一晚上没回家' },
        { at: '2026-08-26 06:58', from: 'me', text: '你在哪，看到回我' },
        { at: '2026-08-27 08:20', from: 'xuhe', text: '字名我喊别天几这，溪', when: 'ending:be|kong' },
        { at: '2026-08-30 19:02', from: 'xuhe', text: '奶奶给我取了个新的小名', when: 'ending:te' },
        { at: '2026-08-30 19:02', from: 'xuhe', text: '这次我们不写在这里', when: 'ending:te' },
        { at: '2026-08-28 21:40', from: 'xuhe', text: '夜里还是有人在河那边喊我', when: 'ending:ne' },
        { at: '2026-08-28 21:41', from: 'xuhe', text: '奶奶说明年七月我不能回来了', when: 'ending:ne' }
      ]
    },
    {
      id: 'family', title: '许家一家亲(8)', group: true, people: ['waipo', 'uncle', 'jiumu', 'erjiu', 'mom', 'xiaoyi', 'me', 'xuhe'],
      members: ['外婆', '许建国', '李秋云', '许建军', '许秀英', '许秀芝', '程溪', '禾禾', '许平'],
      messages: [
        { at: '2026-08-25 22:41', from: 'xiaoyi', text: '禾禾九点多出门到现在没回来，电话打不通，谁看到了说一声' },
        { at: '2026-08-25 22:50', from: 'uncle', text: '我带人去河边找' },
        { at: '2026-08-25 23:39', from: 'xiaoyi', text: '手机在渡口台阶上捡到了' },
        { at: '2026-08-25 23:40', from: 'mom', text: '人呢？？' },
        { at: '2026-08-25 23:52', from: 'uncle', type: 'img', src: 'assets/img/xunren.jpg', caption: '寻人启事' },
        { at: '2026-08-25 23:52', from: 'uncle', text: '大家帮忙转发，知道的人越多越好' },
        { at: '2026-08-26 00:30', from: 'waipo', type: 'voice', seconds: 7, dialect: true, text: '金夜里都莫出门喏，水大得很，听到某' },
        { at: '2026-08-26 00:32', from: 'xiaoyi', text: '妈说今晚上都莫出门，水大' },
        { at: '2026-08-26 01:05', from: 'erjiu', text: '我买了明天最早的车票，下午到' },
        { at: '2026-08-26 06:31', from: 'mom', text: '有消息没有' },
        { at: '2026-08-26 06:40', from: 'uncle', text: '救援队五点又下去了' },
        { type: 'recall', at: '2026-08-26 06:44', from: 'uncle' },
        { at: '2026-08-26 06:45', from: 'uncle', text: '我在吧里也发了帖，吧里人多' },
        { at: '2026-08-26 06:46', from: 'xiaoyi', type: 'link', href: 'tieba.html#/', title: '白鹭渡吧', desc: '白鹭渡人自己的吧，渡口的事都在这', site: '鹭吧' },
        { at: '2026-08-26 07:02', from: 'waipo', type: 'voice', seconds: 7, dialect: true, text: '水底下看人都是反个，你们莫往河里找' },
        { at: '2026-08-26 07:03', from: 'xiaoyi', text: '妈说[[水底下看人是反的]]，叫你们莫往河里照' },
        { at: '2026-08-26 07:03', from: 'xiaoyi', text: '老人家吓坏了，一直在念' },
        { at: '2026-08-26 07:05', from: 'waipo', type: 'voice', seconds: 5, dialect: true, text: '莫喊她大名，汉屋里叫个那个' },
        { at: '2026-08-26 07:08', from: 'xiaoyi', text: '这条前半句是[[莫喊她大名]]，后面我没听清' },
        { at: '2026-08-26 07:10', from: 'jiumu', text: '七月莫往渡口跑，去年我就讲过' },
        { at: '2026-08-26 08:31', from: 'xiaoyi', text: '救援队说昨晚十一点多河中间有人应了一声，女的，后来就没声了', when: 'rescueLogOpened' },
        { at: '2026-08-26 08:33', from: 'mom', text: '应了就是还在！', when: 'rescueLogOpened' },
        { at: '2026-08-26 11:50', from: 'uncle', text: '今天谁都不要去渡口烧纸，莫添乱', when: 'spaceOpened' },
        { at: '2026-08-26 15:22', from: 'xiaoyi', text: '建军哥到了，在河边', when: 'pingpingFound' },
        { at: '2026-08-26 21:31', from: 'xiaoyi', text: '妈说[[夜里十一点]]她去渡口喊，叫溪在电话里[[跟着喊]]', when: 'contractRead' },
        { at: '2026-08-26 21:32', from: 'xiaoyi', text: '溪你莫睡，到时候外婆打视频给你', when: 'contractRead' },
        { at: '2026-08-26 23:07', from: 'xiaoyi', text: '救援队讲，K7那盏灯灭了，顺水漂走了', when: 'lanternWithdrawn|slipWrong' },
        { at: '2026-08-27 05:40', from: 'xiaoyi', text: '禾禾回来了！！在下游浅滩上坐着，冻得发抖，人是清醒的', when: 'ending:te|ne' },
        { at: '2026-08-27 05:41', from: 'mom', text: '谢天谢地', when: 'ending:te|ne' },
        { at: '2026-08-27 07:12', from: 'xiaoyi', text: '建国哥一夜没回来。渡口第七级台阶上只有他的鞋', when: 'ending:te' },
        { at: '2026-08-27 07:20', from: 'jiumu', text: '他昨晚说去接平平', when: 'ending:te' },
        { at: '2026-08-27 07:30', from: 'xiaoyi', text: 'K7那盏灯还在，救援队讲水那么急，它就是不走', when: 'ending:ne&!lanternWithdrawn' },
        { at: '2026-08-27 20:20', from: 'xiaoyi', text: '今晚庙里放灯，又有一盏停在K7不走了', when: 'ending:ne&lanternWithdrawn' },
        { at: '2026-08-27 06:02', from: 'uncle', text: '平平回来了', when: 'ending:be|kong' },
        { at: '2026-08-27 06:05', from: 'xiaoyi', text: '建国哥你莫吓人', when: 'ending:be|kong' },
        { at: '2026-08-27 06:30', from: 'xiaoyi', text: '禾禾还是没找到', when: 'ending:be|kong' }
      ]
    },
    {
      id: 'uncle', title: '大舅', people: ['me', 'uncle'],
      messages: [
        { at: '2026-02-17 08:01', from: 'uncle', text: '新年快乐，在外面注意身体' },
        { at: '2026-02-17 08:30', from: 'me', text: '大舅新年快乐！' },
        { at: '2026-08-26 06:52', from: 'uncle', text: '溪，你在外地就莫回来了，回来也帮不上' },
        { at: '2026-08-26 06:53', from: 'uncle', text: '网上那些乱七八糟的人多，你莫到处问' },
        { at: '2026-08-26 23:08', from: 'uncle', text: '条子是你叫写的？', when: 'lanternWithdrawn' },
        { at: '2026-08-26 23:09', from: 'uncle', text: '你懂个什么。那是平平的事', when: 'lanternWithdrawn' },
        { at: '2026-08-26 23:21', from: 'uncle', text: '行，陈守义也向着她。你们都向着她', when: 'accountLocked&lanternWithdrawn' },
        { at: '2026-08-26 22:58', from: 'uncle', text: '我去渡口接平平', when: 'callStarted' }
      ]
    },
    {
      id: 'mom', title: '妈', people: ['me', 'mom'],
      messages: [
        { at: '2026-08-25 23:45', from: 'mom', text: '禾禾不见了，你外婆急得不行' },
        { at: '2026-08-25 23:46', from: 'mom', text: '你别着急往回赶，我明早先回去看看' },
        { at: '2026-08-26 06:20', from: 'me', text: '有消息马上告诉我' },
        { at: '2026-08-26 06:33', from: 'mom', text: '嗯。你外婆说要你夜里守着手机' }
      ]
    },
    {
      id: 'chenbo', title: '陈伯', people: ['me', 'chenbo'], hidden: true,
      messages: []
    }
  ],
  moments: [
    { who: 'jiumu', at: '2026-08-27 03:02', text: '他回来了。我没开灯。', when: 'ending:te' },
    { who: 'uncle', at: '2026-08-22 03:31', text: '又梦见了。' },
    { who: 'jiumu', at: '2026-08-22 02:58', text: '又是快三点。睡不着，起来给他叠灯。' },
    { who: 'uncle', at: '2026-08-13 02:44', text: '睡不着' },
    { who: 'jiumu', at: '2026-08-13 02:50', text: '七月初一。给平平点了盏灯，亮到天光。' },
    { who: 'xuhe', at: '2026-08-03 23:10', text: '卷三敲完，手腕要断了。爷爷那支一百多口人，全在这几页纸上', img: 'assets/img/zupu-scan.jpg' },
    { who: 'xiaoyi', at: '2026-08-02 18:20', text: '妈今天又去水府庙了，八十多了腿脚还这么利索' },
    { who: 'jiumu', at: '2025-09-13 22:40', text: '那天要是没人带他去渡口，就好了。', comments: [['禾禾', '伯母，对不起。']] },
    { who: 'uncle', at: '2025-09-06 20:11', text: '儿子十五岁生日快乐', img: 'assets/img/pingping-lantern.jpg', likes: ['李秋云', '许秀芝', '禾禾'] },
    { who: 'uncle', at: '2025-08-30 21:05', text: '平平说十五岁了[[不准再叫他平平]]，那叫啥，叫许平同学？', likes: ['许秀英', '程溪'], comments: [['李秋云', '你就晓得逗他'], ['禾禾', '许平同学哈哈哈']] },
    { who: 'xuhe', at: '2025-07-02 12:40', text: '期末考完，回奶奶家躺平' }
  ],
  album: [
    { src: 'assets/img/lantern-2014.jpg', at: '2014-08-10 21:16', place: '白鹭渡', note: '那年中元放灯，灯上不让写名字，就[[画了麦穗和小鱼]]' },
    { src: 'assets/img/shaigu.jpg', at: '2026-08-24 18:42', place: '来自微聊：禾禾' },
    { src: 'assets/img/zupu-scan.jpg', at: '2026-08-03 22:40', place: '来自微聊：禾禾' },
    { src: 'assets/img/xunren.jpg', at: '2026-08-25 23:52', place: '来自微聊：许家一家亲' }
  ],
  chenbo: {
    wid: 'shuifu-chen',
    profile: { name: '陈守义', region: '白鹭渡', sign: '认人不认号。加我请报家门。' }
  }
};
