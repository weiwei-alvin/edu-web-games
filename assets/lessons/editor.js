(function () {
  'use strict';
  const L = window.LessonContent;
  const $ = id => document.getElementById(id);
  // Teachers mostly edit the basic fields; identifiers live under 進階設定 with defaults.
  const basic = {grade:'年級', book:'冊次', lesson:'課次', title:'教材名稱'};
  const advanced = {lessonId:'教材 ID', revision:'修訂版本', publisherId:'出版社代碼', editionId:'版本代碼', sourceNote:'來源說明'};
  const fields = {...basic, ...advanced};
  const numeric = ['revision','grade','book'];
  const choices = {grade:[[7,'國一（7 年級）'],[8,'國二（8 年級）'],[9,'國三（9 年級）']], book:[1,2,3,4,5,6].map(n => [n,'第 ' + n + ' 冊'])};
  const advancedKeys = [...Object.keys(advanced), 'goals'];
  let data = {schemaVersion:1,lessonId:'custom-' + Date.now(),revision:1,publisherId:'custom',editionId:'self',grade:7,book:1,lesson:'01',title:'自編教材',sourceNote:'教師自編',goals:['meaning-recognition','spelling'],words:[]};
  let sequence = 0;
  function readMetadata() {
    for (const key of Object.keys(fields)) data[key] = numeric.includes(key) ? Number($(key).value) : $(key).value;
    data.goals = $('goals').value.split(',').map(g => g.trim()).filter(Boolean);
  }
  function status() {
    readMetadata();
    if (location.protocol === 'file:') {
      // Keep the portable snapshot current when returning from an offline game.
      history.replaceState(null, '', '#content=' + encodeURIComponent(JSON.stringify(data)));
    }
    $('launch').replaceChildren();
    const names = {'vocabulary-matching':'配對','vocabulary-memory':'翻牌','vocabulary-typing':'打字'};
    for (const [game, counts] of Object.entries(L.modes)) for (const count of counts) {
      const result = L.check(data, game, count);
      const row = document.createElement('div');
      const button = document.createElement('button');
      button.textContent = names[game] + ' ' + count + ' 題／組';
      button.disabled = !result.ok;
      button.onclick = () => {
        try {
          const url = new URL(L.link(game, data));
          url.searchParams.set('count', count);
          location.href = url.href;
        } catch (error) { $('errors').textContent = '無法保存分頁暫存：' + error.message + '。請匯出 JSON 保存，或直接開啟本機教材頁使用離線模式。'; }
      };
      row.append(button, document.createTextNode(result.ok ? '可開始' : result.errors.join(' ')));
      $('launch').append(row);
    }
    try { L.save(data); } catch { /* Launch reports storage failures; export remains available. */ }
    // Never hide a problem inside the collapsed section.
    if (L.validate(data).some(e => advancedKeys.some(k => e.startsWith(k + ' ')))) $('advanced').open = true;
  }
  function field(key, label) {
    const el = document.createElement('label'), span = document.createElement('span');
    let input;
    if (choices[key]) {
      input = document.createElement('select');
      const options = choices[key].some(([v]) => v === data[key]) ? choices[key] : [...choices[key], [data[key], String(data[key])]];
      for (const [value,text] of options) input.append(new Option(text, value));
    } else {
      input = document.createElement('input');
      input.type = numeric.includes(key) ? 'number' : 'text';
    }
    span.textContent = label; input.id = key; input.value = data[key] ?? ''; input.oninput = status;
    el.className = 'field field-' + key; el.append(span, input);
    return el;
  }
  function render() {
    $('metadata').replaceChildren(...Object.entries(basic).map(([k,l]) => field(k,l)));
    $('metadataAdvanced').replaceChildren(...Object.entries(advanced).map(([k,l]) => field(k,l)));
    $('goals').value = data.goals.join(',');
    $('words').replaceChildren();
    data.words.forEach((word,i) => {
      const row = document.createElement('tr');
      for (const key of ['id','en','zh','example','exampleZh']) {
        const cell = document.createElement('td'), input = document.createElement('input');
        input.value = word[key] || ''; input.setAttribute('aria-label', '第 ' + (i+1) + ' 筆 ' + key);
        input.oninput = () => { word[key] = input.value; status(); };
        cell.append(input); row.append(cell);
      }
      const cell = document.createElement('td'), remove = document.createElement('button');
      remove.textContent = '刪除'; remove.onclick = () => { data.words.splice(i,1); render(); };
      cell.append(remove); row.append(cell); $('words').append(row);
    });
    status();
  }
  $('goals').oninput = status;
  $('preview').onclick = () => {
    const rows = $('paste').value.trim().split(/\r?\n/).map(line => line.split('\t'));
    if (rows.some(row => row.length !== 2 || row.some(v => !v.trim()))) { $('errors').textContent = '每列必須有英文與中文兩欄，以一個 Tab 分隔。原預覽資料已保留。'; return; }
    const existing = new Map(data.words.map(w => [w.en.trim(),w]));
    const ids = new Set(data.words.map(w => w.id));
    data.words = rows.map(([en,zh]) => {
      en=en.trim(); zh=zh.trim();
      if (existing.has(en)) return {...existing.get(en),zh};
      let id;
      do { id='word-' + (++sequence); } while (ids.has(id));
      ids.add(id); return {id,en,zh,example:'',exampleZh:''};
    });
    $('errors').textContent = '已預覽，請補雙語例句。相同英文的既有 ID 與例句會沿用。'; render();
  };
  $('import').onchange = async () => {
    const file = $('import').files[0]; if (!file) return;
    try {
      const next = JSON.parse(await file.text());
      const errors = L.validate(next);
      if (errors.length) throw Error(errors.join('\n'));
      data = next; $('errors').textContent = 'JSON 已匯入，請確認下方模式檢查。'; render();
    } catch (error) { $('errors').textContent = '匯入失敗，原教材已保留：' + error.message; }
    $('import').value = '';
  };
  $('export').onclick = () => {
    readMetadata();
    const errors = L.validate(data);
    if (errors.length) { $('errors').textContent=errors.join('\n'); return; }
    const url = URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));
    const a = document.createElement('a'); a.href=url; a.download=data.lessonId + '-r' + data.revision + '.json'; a.click();
    setTimeout(() => URL.revokeObjectURL(url),1000);
  };
  try {
    // Restore unfinished drafts too: the editor saves on every keystroke, so a
    // reload mid-edit must not discard the lesson. Games still validate before starting.
    const saved = L.load();
    if (saved && typeof saved === 'object' && !Array.isArray(saved) && Array.isArray(saved.words)) {
      data = {...data, ...saved, goals:Array.isArray(saved.goals) ? saved.goals : data.goals};
      data.words = saved.words.filter(w => w && typeof w === 'object');
    }
  } catch { /* An empty editor is valid on first visit. */ }
  render();
})();
