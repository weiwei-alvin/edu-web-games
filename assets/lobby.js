/* ============ Edu Web Games — 遊戲大廳 ============
 * 資料來自 assets/catalog.js（window.CATALOG）。
 * 網址 #科目id 會直接打開該科目專區，例如 index.html#english。
 */
(function () {
  "use strict";

  var catalog = window.CATALOG || { subjects: [], games: [] };
  var subjects = catalog.subjects || [];
  var games = catalog.games || [];

  var nav = document.getElementById("subjectNav");
  var content = document.getElementById("content");
  var search = document.getElementById("searchInput");
  var heroStats = document.getElementById("heroStats");
  var footerStats = document.getElementById("footerStats");
  var randomBtn = document.getElementById("randomBtn");

  var state = { subject: readHash(), query: "" };

  /* ---------- 小工具 ---------- */
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function subjectById(id) {
    return subjects.find(function (s) { return s.id === id; });
  }

  function gamesOf(id) {
    return games.filter(function (g) { return g.subject === id; });
  }

  function newestFirst(list) {
    return list.slice().sort(function (a, b) { return (b.added || "").localeCompare(a.added || ""); });
  }





  function haystack(game) {
    var s = subjectById(game.subject) || {};
    return [game.title, game.en, game.desc, game.grade, (game.tags || []).join(" "), s.name, s.en]
      .join(" ").toLowerCase();
  }

  function readHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    return subjectById(id) ? id : "all";
  }

  /* ---------- 片段 ---------- */
  // Small diagrams describe the mechanic instead of using decorative covers.
  function gameDiagram(id) {
    var drawings = {
      'vocabulary-matching': '<rect x="7" y="18" width="30" height="48" rx="3"/><rect x="51" y="18" width="30" height="48" rx="3"/><text x="22" y="48">A</text><text x="66" y="48">字</text><path d="M37 42h14m-5-5 5 5-5 5"/>',
      'vocabulary-memory': '<rect x="10" y="11" width="28" height="30" rx="3"/><rect x="50" y="11" width="28" height="30" rx="3"/><rect x="10" y="49" width="28" height="30" rx="3"/><rect x="50" y="49" width="28" height="30" rx="3"/><text x="24" y="33">A</text><text x="64" y="33">?</text><text x="24" y="71">?</text><text x="64" y="71">字</text>',
      'vocabulary-typing': '<rect x="7" y="17" width="74" height="52" rx="3"/><text x="39" y="48" class="diagram-word">abc</text><path d="M63 31v22M17 59h37"/>',
      'vocabulary-sorting': '<rect x="8" y="9" width="21" height="20" rx="2"/><rect x="35" y="9" width="21" height="20" rx="2"/><path d="M44 36v14m-5-5 5 5 5-5M9 59v18h29V59m12 0v18h29V59"/><path d="M17 67h12m30 0h12"/>',
      'house-detective': '<path d="M9 14h54v52H9zM9 39h26V14m0 25v27m0-19h28"/><circle cx="61" cy="58" r="15"/><path d="m72 70 10 11M56 58h10m-5-5v10"/>',
      'room-designer': '<path class="diagram-grid" d="M10 10h68v68H10zM10 32h68M10 55h68M32 10v68M55 10v68"/><rect x="16" y="37" width="32" height="13" rx="2"/><path d="M22 41v5m-6 4v6m32-6v6M65 17v19m-5-5 5 5 5-5"/>',
      'sentence-builder': '<rect x="8" y="16" width="24" height="24" rx="2"/><rect x="41" y="16" width="37" height="24" rx="2"/><text x="20" y="33" class="diagram-word">I</text><text x="59" y="33" class="diagram-word">see</text><rect x="8" y="49" width="70" height="22" rx="2"/><path d="M18 60h10m8 0h31"/>',
      'escape-the-house': '<path d="M47 77V13h31v64M56 13v64m12-32h3M10 77h72"/><circle cx="21" cy="37" r="10"/><path d="M21 47v22h9m-9-9h8"/>',
      'speaking-cards': '<path d="M8 14h49v34H33L20 59V48H8zM49 38h29v29H65L54 78V67H41V55"/><path d="M19 27h27M19 35h18"/>',
      'telling-time': '<circle cx="44" cy="44" r="32"/><path d="M44 17v5m27 22h-5M44 71v-5M17 44h5M44 27v17l15 9"/><circle cx="44" cy="44" r="2"/>',
      'body-parts': '<circle cx="44" cy="17" r="9"/><path d="M44 26v30M20 37h48M44 56 28 78m16-22 16 22"/><path class="diagram-guide" d="M11 12h16M62 34h15M11 73h12"/>'
    };
    return '<svg viewBox="0 0 88 88" aria-hidden="true" focusable="false">' +
      (drawings[id] || '<path d="M14 14h60v60H14zM28 32h32M28 44h32M28 56h20"/>') + '</svg>';
  }

  function cardHTML(game, index, showSubject) {
    var s = subjectById(game.subject) || {};
    var number = newestFirst(games).findIndex(function (g) { return g.id === game.id; }) + 1;
    var meta = [game.grade, (game.tags || []).slice(0, 2).join(' / ')].filter(Boolean);
    if (showSubject && s.name) meta.unshift(s.name);
    return '<a class="card" href="' + esc(game.path) + '">' +
      '<div class="card__diagram" aria-hidden="true">' + gameDiagram(game.id) + '</div>' +
      '<div class="card__body">' +
        '<div class="card__meta"><span class="card__number">' + String(number).padStart(2, '0') + '</span>' + esc(meta.join(' · ')) + '</div>' +
        '<h3 class="card__title">' + esc(game.title) + '</h3>' +
        (game.en ? '<p class="card__en" lang="en">' + esc(game.en) + '</p>' : '') +
        '<p class="card__desc">' + esc(game.desc) + '</p>' +
      '</div><span class="card__go" aria-hidden="true">↗</span></a>';
  }

  function soonHTML(subject) {
    return '<div class="empty-subject"><p class="empty-subject__label">準備中</p><h3>' + esc(subject.name) + '遊戲還在整理</h3><p>目前可以先到英語專區，或瀏覽全部遊戲。</p><a href="#all">查看全部遊戲 →</a></div>';
  }

  function bannerHTML(subject, count) {
    return '<section class="banner" aria-labelledby="bannerTitle"><h2 id="bannerTitle">' + esc(subject.name) + '<small lang="en">' + esc(subject.en) + '</small></h2><p>' + esc(subject.desc) + ' <span class="section-count">' + count + ' 款遊戲</span></p></section>';
  }

  /* ---------- 畫面 ---------- */

  function renderNav() {
    var live = subjects.filter(function (s) { return gamesOf(s.id).length; });
    var other = subjects.filter(function (s) { return !gamesOf(s.id).length; });
    var items = [{ id: 'all', name: '全部', count: games.length }].concat(live.map(function (s) { return { id: s.id, name: s.name, count: gamesOf(s.id).length }; }));
    function link(it) {
      return '<a class="subj" href="#' + it.id + '"' + (state.subject === it.id ? ' aria-current="page"' : '') + '><span>' + esc(it.name) + '</span><small>' + (it.count || '準備中') + '</small></a>';
    }
    var selectedOther = other.find(function (s) { return s.id === state.subject; });
    nav.innerHTML = items.map(link).join('') + (other.length ? '<details class="more-subjects"><summary>' + (selectedOther ? esc(selectedOther.name) + ' · 準備中' : '其他科目') + '</summary><div class="subject-menu">' + other.map(function (s) { return link({id:s.id,name:s.name,count:0}); }).join('') + '</div></details>' : '');
  }

  function renderAll() {
    return subjects.filter(function (s) { return gamesOf(s.id).length; }).map(function (s) {
      var list = newestFirst(gamesOf(s.id));
      return '<section class="zone" aria-labelledby="z-' + s.id + '"><div class="zone__head"><h2 id="z-' + s.id + '">' + esc(s.name) + '<small lang="en">' + esc(s.en) + '</small></h2><a class="zone__more" href="#' + s.id + '">' + list.length + ' 款遊戲 <span aria-hidden="true">→</span></a></div><div class="grid">' + list.map(function (g, i) { return cardHTML(g, i, false); }).join('') + '</div></section>';
    }).join('');
  }



  function renderSubject(subject) {
    var list = newestFirst(gamesOf(subject.id));
    return (
      bannerHTML(subject, list.length) +
      '<div class="zone"><div class="grid">' +
        (list.length ? list.map(function (g, i) { return cardHTML(g, i, false); }).join("") : soonHTML(subject)) +
      "</div></div>"
    );
  }

  function renderSearch(query) {
    var subject = subjectById(state.subject);
    var scope = subject ? gamesOf(subject.id) : games;
    var q = query.toLowerCase();
    var hits = newestFirst(scope.filter(function (g) { return haystack(g).indexOf(q) !== -1; }));
    var where = subject ? subject.name + "專區" : "全部科目";
    var head = subject ? bannerHTML(subject, scope.length) : "";

    if (!hits.length) {
      return head +
        '<div class="empty">' +
          '<p class="empty__label">沒有搜尋結果</p>' +
          "<p>在" + where + "找不到「" + esc(query) + "」相關的遊戲。</p>" +
          '<button type="button" data-action="clear-search">清除搜尋</button>' +
        "</div>";
    }
    return head +
      '<p class="results-head">在' + where + "找到 <b>" + hits.length + "</b> 個「" + esc(query) + "」相關遊戲</p>" +
      '<div class="grid">' + hits.map(function (g, i) { return cardHTML(g, i, !subject); }).join("") + "</div>";
  }

  function render(options) {
    var subject = subjectById(state.subject);
    renderNav();
    content.classList.toggle("calm", !!(options && options.calm));
    if (state.query) content.innerHTML = renderSearch(state.query);
    else content.innerHTML = subject ? renderSubject(subject) : renderAll();
    document.title = (subject ? subject.name + "專區｜" : "") + "Edu Web Games｜課堂遊戲目錄";
  }

  function renderStats() {
    heroStats.innerHTML = '<b>' + games.length + '</b> 款課堂遊戲，選好就能開始。';
    footerStats.textContent = games.length + ' 款遊戲 · 不需註冊';
  }

  /* ---------- 互動 ---------- */

  function scrollBehavior() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }

  function scrollActiveTileIntoView() {
    var active = nav.querySelector('[aria-current="page"]');
    if (active && nav.scrollWidth > nav.clientWidth) {
      nav.scrollTo({ left: active.offsetLeft - 16, behavior: scrollBehavior() });
    }
  }

  window.addEventListener("hashchange", function () {
    var restoreNavFocus = nav.contains(document.activeElement);
    state.subject = readHash();
    render();
    if (restoreNavFocus) {
      var activeLink = nav.querySelector('[aria-current="page"]');
      var closedMenu = activeLink && activeLink.closest('details:not([open])');
      var focusTarget = closedMenu ? closedMenu.querySelector('summary') : activeLink;
      if (focusTarget) focusTarget.focus({ preventScroll: true });
    }
    scrollActiveTileIntoView();
    if (nav.getBoundingClientRect().top < 0) nav.scrollIntoView({ block: "start", behavior: scrollBehavior() });
  });

  search.addEventListener("input", function () {
    state.query = search.value.trim();
    render({ calm: true });
  });

  content.addEventListener("click", function (e) {
    if (e.target.closest('[data-action="clear-search"]')) {
      search.value = "";
      state.query = "";
      render();
      search.focus();
    }
  });

  document.addEventListener("keydown", function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (e.key === "/" && !typing) {
      e.preventDefault();
      search.focus();
    } else if (e.key === "Escape" && document.activeElement === search && search.value) {
      search.value = "";
      state.query = "";
      render({ calm: true });
    }
  });

  randomBtn.addEventListener("click", function () {
    var subject = subjectById(state.subject);
    var pool = subject && gamesOf(subject.id).length ? gamesOf(subject.id) : games;
    if (!pool.length) return;
    var pick = pool[Math.floor(Math.random() * pool.length)];
    randomBtn.disabled = true;
    randomBtn.textContent = '正在開啟：' + pick.title;
    setTimeout(function () { location.href = pick.path; }, 450);
  });

  // 從遊戲頁按「上一頁」回來時，恢復按鈕狀態
  window.addEventListener("pageshow", function () {
    randomBtn.disabled = false;
    randomBtn.innerHTML = '隨機選一個 <span aria-hidden="true">↗</span>';
  });

  renderStats();
  render();
  scrollActiveTileIntoView();
})();
