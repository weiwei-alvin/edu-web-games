/* ============ Edu Web Games — 遊戲大廳 ============
 * 資料來自 assets/catalog.js（window.CATALOG）。
 * 網址 #科目id 會直接打開該科目專區，例如 index.html#english。
 */
(function () {
  "use strict";

  var catalog = window.CATALOG || { subjects: [], games: [] };
  var subjects = catalog.subjects || [];
  var games = catalog.games || [];
  var NEW_DAYS = 30;

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

  function isNew(game) {
    if (!game.added) return false;
    var t = Date.parse(game.added + "T00:00:00");
    return !isNaN(t) && (Date.now() - t) / 864e5 < NEW_DAYS;
  }

  function colorStyle(subject, extra) {
    var parts = [];
    if (subject && subject.color) parts.push("--c:" + subject.color);
    if (extra) parts.push(extra);
    return parts.length ? ' style="' + esc(parts.join(";")) + '"' : "";
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
  function cardHTML(game, index, showSubject) {
    var s = subjectById(game.subject) || {};
    var flags = "";
    if (showSubject && s.name) flags += '<span class="flag">' + s.icon + " " + esc(s.name) + "</span>";
    if (game.grade) flags += '<span class="flag">' + esc(game.grade) + "</span>";
    if (isNew(game)) flags += '<span class="flag flag--new">NEW</span>';

    var tags = (game.tags || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("");

    return (
      '<a class="card reveal" href="' + esc(game.path) + '"' + colorStyle(s, "--i:" + index) + ">" +
        '<div class="card__cover">' +
          '<div class="card__flags">' + flags + "</div>" +
          '<span class="card__emoji" aria-hidden="true">' + esc(game.icon || s.icon || "🎮") + "</span>" +
        "</div>" +
        '<div class="card__body">' +
          '<h3 class="card__title">' + esc(game.title) +
            (game.en ? '<span class="card__en">' + esc(game.en) + "</span>" : "") +
          "</h3>" +
          '<p class="card__desc">' + esc(game.desc) + "</p>" +
          (tags ? '<ul class="tags" aria-label="標籤">' + tags + "</ul>" : "") +
          '<div class="card__go"><span>開始遊戲</span><span class="arrow" aria-hidden="true">→</span></div>' +
        "</div>" +
      "</a>"
    );
  }

  function soonHTML(subject) {
    return (
      '<div class="soon reveal"' + colorStyle(subject) + ">" +
        '<span class="soon__icon" aria-hidden="true">🚧</span>' +
        "<div><strong>" + esc(subject.name) + "遊戲準備中</strong>" +
        "<span>新遊戲上架後會出現在這裡，敬請期待！</span></div>" +
      "</div>"
    );
  }

  function bannerHTML(subject, count) {
    return (
      '<section class="banner reveal"' + colorStyle(subject) + ' aria-labelledby="bannerTitle">' +
        '<span class="banner__icon" aria-hidden="true">' + subject.icon + "</span>" +
        "<div>" +
          '<h2 id="bannerTitle">' + esc(subject.name) + "專區<small>" + esc(subject.en) + "</small></h2>" +
          "<p>" + esc(subject.desc) + " · " + (count ? "共 " + count + " 個遊戲" : "即將推出") + "</p>" +
        "</div>" +
        '<span class="banner__ghost" aria-hidden="true">' + subject.icon + "</span>" +
      "</section>"
    );
  }

  /* ---------- 畫面 ---------- */
  function renderNav() {
    var items = [{ id: "all", name: "全部", icon: "✨", count: games.length }].concat(
      subjects.map(function (s) {
        return { id: s.id, name: s.name, icon: s.icon, color: s.color, count: gamesOf(s.id).length };
      })
    );

    nav.innerHTML = items.map(function (it) {
      var current = state.subject === it.id ? ' aria-current="page"' : "";
      var cls = "subj" + (it.id === "all" ? " subj--all" : "");
      return (
        '<a class="' + cls + '" href="#' + it.id + '"' + colorStyle(it) + current + ">" +
          '<span class="subj__icon" aria-hidden="true">' + it.icon + "</span>" +
          '<span class="subj__text">' +
            '<span class="subj__name">' + esc(it.name) + "</span>" +
            '<span class="subj__count">' + (it.count ? it.count + " 個遊戲" : "即將推出") + "</span>" +
          "</span>" +
        "</a>"
      );
    }).join("");
  }

  function renderAll() {
    var live = subjects.filter(function (s) { return gamesOf(s.id).length; });
    var soon = subjects.filter(function (s) { return !gamesOf(s.id).length; });

    var html = live.map(function (s) {
      var list = newestFirst(gamesOf(s.id));
      return (
        '<section class="zone"' + colorStyle(s) + ' aria-labelledby="z-' + s.id + '">' +
          '<div class="zone__head">' +
            '<h2 class="zone__title" id="z-' + s.id + '">' +
              '<span class="zone__badge" aria-hidden="true">' + s.icon + "</span>" +
              "<span>" + esc(s.name) + "<small>" + esc(s.en) + " · " + esc(s.desc) + "</small></span>" +
            "</h2>" +
            '<a class="zone__more" href="#' + s.id + '">進入專區 →</a>' +
          "</div>" +
          '<div class="grid">' + list.map(function (g, i) { return cardHTML(g, i, false); }).join("") + "</div>" +
        "</section>"
      );
    }).join("");

    if (soon.length) {
      html +=
        '<section class="zone" aria-labelledby="z-soon">' +
          '<div class="zone__head"><h2 class="zone__title" id="z-soon">' +
            '<span class="zone__badge" aria-hidden="true">🚧</span>' +
            "<span>更多科目準備中<small>點進去看看各專區的規劃</small></span>" +
          "</h2></div>" +
          '<div class="grid">' + soon.map(soonLinkHTML).join("") + "</div>" +
        "</section>";
    }
    return html;
  }

  function soonLinkHTML(subject, index) {
    return (
      '<a class="soon reveal" href="#' + subject.id + '"' + colorStyle(subject, "--i:" + index) + ">" +
        '<span class="soon__icon" aria-hidden="true">' + subject.icon + "</span>" +
        "<div><strong>" + esc(subject.name) + "專區</strong>" +
        "<span>" + esc(subject.desc) + " · 即將推出</span></div>" +
      "</a>"
    );
  }

  function renderSubject(subject) {
    var list = newestFirst(gamesOf(subject.id));
    return (
      bannerHTML(subject, list.length) +
      '<div class="zone"' + colorStyle(subject) + '><div class="grid">' +
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
          '<div class="empty__icon" aria-hidden="true">🔎</div>' +
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
    document.title = (subject ? subject.name + "專區｜" : "") + "Edu Web Games｜課堂遊戲大廳";
  }

  function renderStats() {
    var latest = newestFirst(games)[0];
    heroStats.innerHTML =
      "<b>" + subjects.length + "</b> 個科目專區 · <b>" + games.length + "</b> 個遊戲" +
      (latest ? '<span class="hero__latest">最新上架：' + esc(latest.title) + "</span>" : "");
    footerStats.textContent = "目前共 " + games.length + " 個遊戲，持續增加中";
  }

  /* ---------- 互動 ---------- */
  function scrollActiveTileIntoView() {
    var active = nav.querySelector('[aria-current="page"]');
    if (active && nav.scrollWidth > nav.clientWidth) {
      nav.scrollTo({ left: active.offsetLeft - 16, behavior: "smooth" });
    }
  }

  window.addEventListener("hashchange", function () {
    state.subject = readHash();
    render();
    scrollActiveTileIntoView();
    if (nav.getBoundingClientRect().top < 0) nav.scrollIntoView({ block: "start", behavior: "smooth" });
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
    randomBtn.innerHTML = '<span aria-hidden="true">🎲</span> ' + esc(pick.title) + "！";
    setTimeout(function () { location.href = pick.path; }, 450);
  });

  // 從遊戲頁按「上一頁」回來時，恢復按鈕狀態
  window.addEventListener("pageshow", function () {
    randomBtn.disabled = false;
    randomBtn.innerHTML = '<span aria-hidden="true">🎲</span> 隨機挑一個';
  });

  renderStats();
  render();
  scrollActiveTileIntoView();
})();
