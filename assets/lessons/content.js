(function (root) {
  'use strict';
  const normalize = value => String(value).trim().toLowerCase().replace(/\s+/g, ' ');
  const text = value => typeof value === 'string' && value.trim().length > 0;
  const modes = {'vocabulary-matching':[8,10], 'vocabulary-memory':[4,6,8], 'vocabulary-typing':[10]};
  const storageKey = 'edu-shared-lesson-v1';
  function validate(data) {
    const errors = [];
    if (!data || typeof data !== 'object' || Array.isArray(data)) return ['教材必須是 JSON 物件。'];
    if (data.schemaVersion !== 1) errors.push('僅支援 schemaVersion 1。');
    for (const key of ['lessonId','publisherId','editionId','lesson','title','sourceNote']) {
      if (!text(data[key])) errors.push(key + ' 必須填寫文字。');
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(data.lessonId || '')) errors.push('lessonId 僅能使用英數字、底線及連字號。');
    if (!Number.isInteger(data.revision) || data.revision < 1) errors.push('revision 必須為正整數。');
    if (![7,8,9].includes(data.grade)) errors.push('grade 必須為 7、8 或 9。');
    if (!Number.isInteger(data.book) || data.book < 1 || data.book > 6) errors.push('book 必須介於 1 至 6。');
    if (!Array.isArray(data.goals) || !data.goals.length || data.goals.some(g => !text(g))) errors.push('goals 至少需一個文字目標。');
    if (!Array.isArray(data.words)) return [...errors, 'words 必須是陣列。'];
    const ids = new Set();
    data.words.forEach((w, i) => {
      if (!w || typeof w !== 'object') { errors.push('第 ' + (i+1) + ' 筆詞條必須是物件。'); return; }
      if (!text(w.id) || !/^[a-zA-Z0-9_-]+$/.test(w.id)) errors.push('第 ' + (i+1) + ' 筆 id 格式錯誤。');
      if (Object.prototype.hasOwnProperty.call(Object.prototype, w.id)) errors.push('第 ' + (i+1) + ' 筆 id 為保留名稱，請更換。');
      if (ids.has(w.id)) errors.push('重複詞條 ID：' + w.id);
      ids.add(w.id);
      for (const key of ['en','zh']) if (!text(w[key])) errors.push('第 ' + (i+1) + ' 筆缺少 ' + key + '。');
      for (const key of ['example','exampleZh']) if (w[key] !== undefined && typeof w[key] !== 'string') errors.push('第 ' + (i+1) + ' 筆 ' + key + ' 必須是文字。');
    });
    return errors;
  }
  function check(data, game, count) {
    const errors = validate(data);
    if (!modes[game]?.includes(count)) errors.push('不支援此遊戲模式。');
    if (errors.length) return {ok:false, errors, count:0};
    const duplicates = new Set();
    for (const key of ['en','zh']) {
      const seen = new Map();
      for (const w of data.words) {
        const face = normalize(w[key]);
        if (seen.has(face)) { duplicates.add(w.id); duplicates.add(seen.get(face)); }
        seen.set(face, w.id);
      }
    }
    if (duplicates.size) errors.push('英文卡面或中文提示無法區辨：' + [...duplicates].join('、') + '。請補足詞義線索或移除重複。');
    const incomplete = data.words.filter(w => !text(w.example) || !text(w.exampleZh));
    if (incomplete.length) errors.push('缺少雙語例句：' + incomplete.map(w => w.id).join('、') + '。請補齊後啟動。');
    const valid = data.words.filter(w => !duplicates.has(w.id) && text(w.example) && text(w.exampleZh)).length;
    if (valid < count) errors.push('目前只有 ' + valid + ' 組有效單字，' + count + ' 題／組模式尚缺 ' + (count-valid) + ' 組。');
    return {ok:errors.length===0, errors, count:valid};
  }
  function adapt(data, fallback) {
    const ids = data.words.map(w => w.id);
    return {...fallback, words:data.words, pools:{matching:ids, memory:ids, typing:ids}, sourceNote:data.title + ' · 修訂 ' + data.revision + '｜' + data.sourceNote};
  }
  function save(data) {
    sessionStorage.setItem(storageKey, JSON.stringify(data));
  }
  function load() {
    const raw = location.hash.startsWith('#content=') ? decodeURIComponent(location.hash.slice(9)) : sessionStorage.getItem(storageKey);
    if (!raw) throw Error('教材暫存遺失，請返回教材頁重新匯入 JSON。');
    return JSON.parse(raw);
  }
  function link(game, data) {
    const url = new URL('../' + game + '/index.html', location.href);
    url.searchParams.set('lesson', data.lessonId);
    url.searchParams.set('revision', data.revision);
    if (location.protocol === 'file:') url.hash = 'content=' + encodeURIComponent(JSON.stringify(data));
    else save(data);
    return url.href;
  }
  const api = {validate,check,adapt,modes,save,load,link};
  root.LessonContent = api;
  if (typeof module !== 'undefined') module.exports = api;
})(typeof window === 'undefined' ? globalThis : window);
