(function () {
  'use strict';
  const params = new URLSearchParams(location.search);
  if (!params.has('lesson') && !location.hash.startsWith('#content=')) return;
  const L = window.LessonContent;
  const kind = document.body.dataset.game;
  const button = document.getElementById('begin');
  let data;
  const message = document.createElement('p');
  message.setAttribute('role', 'status');
  document.getElementById('settings').after(message);
  const back = new URL('../lesson-editor/index.html', location.href);
  if (location.protocol === 'file:') back.hash = location.hash;
  document.querySelectorAll('a[href="../index.html#english"]').forEach(a => {
    a.href = back.href;
    a.textContent = '返回教材頁';
  });
  function refresh() {
    const count = Number(document.getElementById('count')?.value || 10);
    const result = L.check(data, kind, count);
    button.disabled = !result.ok;
    message.textContent = result.ok ? '教材已載入：' + data.title + ' · 修訂 ' + data.revision : result.errors.join('\n');
    if (result.ok) {
      window.G7Data = L.adapt(data, window.G7Data);
      document.getElementById('source').textContent = window.G7Data.sourceNote;
    }
    return result.ok;
  }
  try {
    data = L.load();
    if (data.lessonId !== params.get('lesson') || String(data.revision) !== params.get('revision')) throw Error('教材識別或修訂不符，請返回教材頁重新選擇。');
    const select = document.getElementById('count');
    if (select && [...select.options].some(o => o.value === params.get('count'))) select.value = params.get('count');
    refresh();
    document.getElementById('count')?.addEventListener('change', refresh);
    button.addEventListener('click', e => { if (!refresh()) e.stopImmediatePropagation(); }, true);
  } catch (error) {
    button.disabled = true;
    message.textContent = '無法載入指定教材：' + error.message;
  }
})();
