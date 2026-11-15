// 新作预告页：小红书号一键复制。
(function () {
  'use strict';
  const btn = document.getElementById('copy');
  let timer = 0;
  btn.addEventListener('click', async () => {
    const id = document.getElementById('xhsId').textContent.trim();
    let ok = false;
    try {
      await navigator.clipboard.writeText(id);
      ok = true;
    } catch (e) {
      // 局域网 http 和一些 App 内置浏览器没有 clipboard API
      const t = document.createElement('textarea');
      t.value = id;
      t.setAttribute('readonly', '');
      t.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(t);
      t.select();
      try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
      t.remove();
    }
    btn.textContent = ok ? '已复制' : '长按号码复制';
    clearTimeout(timer);
    timer = setTimeout(() => { btn.textContent = '复制'; }, 2400);
  });
})();
