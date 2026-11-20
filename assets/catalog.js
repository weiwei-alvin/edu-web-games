/*
 * 遊戲目錄 —— 新增科目或遊戲時，只需要改這個檔案。
 *
 * subjects：科目專區。id 會變成網址的 #id（例如 .../#english 直接打開英語專區）。
 * games：每個遊戲一筆。
 *   subject  對應上面 subjects 的 id
 *   path     遊戲資料夾（相對於首頁），結尾保留斜線
 *   added    上架日期 YYYY-MM-DD，30 天內會顯示 NEW 標籤
 *   tags     小標籤，也會被搜尋框搜尋到
 */
window.CATALOG = {
  subjects: [
    { id: "chinese", name: "國文", en: "Chinese",        icon: "📖", color: "#e03e3e", desc: "字音字形、成語、閱讀理解" },
    { id: "english", name: "英語", en: "English",        icon: "🔤", color: "#3b5bdb", desc: "單字、句型、聽力與口說" },
    { id: "math",    name: "數學", en: "Math",           icon: "📐", color: "#e67700", desc: "數與量、代數、幾何圖形" },
    { id: "science", name: "自然", en: "Science",        icon: "🔬", color: "#2f9e44", desc: "生物、理化、地球科學" },
    { id: "social",  name: "社會", en: "Social Studies", icon: "🌏", color: "#7048e8", desc: "歷史、地理、公民" }
  ],

  games: [
    {
      id: "speaking-cards",
      subject: "english",
      title: "動作說話卡",
      en: "Action Cards",
      icon: "💬",
      path: "./speaking-cards/",
      grade: "國中",
      desc: "翻開 29 種動作圖卡，練習現在進行式。支援 he、she、they、you 問答，老師可揭曉答案與標記完成。",
      tags: ["現在進行式", "口說", "看圖", "翻牌"],
      added: "2026-10-30"
    },
    {
      id: "telling-time",
      subject: "english",
      title: "英文報時練習",
      en: "Telling the Time",
      icon: "⏰",
      path: "./telling-time/",
      grade: "國中",
      desc: "past / to / a quarter / half 一次練熟。60 題題庫，每回合隨機 10 題，可選限時挑戰或不限時學習。",
      tags: ["時間表達", "挑戰模式", "學習模式", "連勝加分"],
      added: "2026-10-17"
    },
    {
      id: "body-parts",
      subject: "english",
      title: "身體部位單字",
      en: "Body Parts",
      icon: "🦵",
      path: "./body-parts/",
      grade: "國中",
      desc: "head、shoulder、knee、toe 等 8 個單字。看圖選字、聽音選圖等 4 種題型，共 10 題。",
      tags: ["單字", "聽力", "看圖"],
      added: "2026-10-02"
    },
    {
      id: "vocabulary-matching",
      subject: "english",
      title: "單字配對大挑戰",
      en: "Vocabulary Matching Challenge",
      icon: "🧩",
      path: "./vocabulary-matching/",
      grade: "國一",
      desc: "8–10組英中配對，支援點選與拖曳，配對後補充雙語例句。",
      tags: ["單字","配對","首次答對率"],
      added: "2026-11-20"
    },
    {
      id: "vocabulary-memory",
      subject: "english",
      title: "翻牌記憶王",
      en: "Vocabulary Memory Game",
      icon: "🃏",
      path: "./vocabulary-memory/",
      grade: "國一",
      desc: "4、6、8組翻牌配對，練習回憶字義，記錄翻牌、時間與錯題。",
      tags: ["單字","記憶","翻牌"],
      added: "2026-11-20"
    },
    {
      id: "vocabulary-typing",
      subject: "english",
      title: "英文打字生存戰",
      en: "Vocabulary Typing Challenge",
      icon: "⌨️",
      path: "./vocabulary-typing/",
      grade: "國一",
      desc: "中文提示拼字10題，普通與限時挑戰，逐步提示與錯題複習。",
      tags: ["拼字","打字","複習"],
      added: "2026-11-20"
    },
    {
      id: "vocabulary-sorting",
      subject: "english",
      title: "單字分類工廠",
      en: "Vocabulary Sorting Factory",
      icon: "🏭",
      path: "./vocabulary-sorting/",
      grade: "國一",
      desc: "15個單字分入5類，用點選或拖曳練習語意與詞性分類。",
      tags: ["單字","分類","詞性"],
      added: "2026-11-20"
    },
    {
      id: "house-detective",
      subject: "english",
      title: "房屋偵探",
      en: "House Detective",
      icon: "🔎",
      path: "./house-detective/",
      grade: "國一",
      desc: "閱讀10個英文任務，在房屋俯視場景中找出房間、物品與位置。",
      tags: ["閱讀","房間","位置詞"],
      added: "2026-11-20"
    },
    {
      id: "room-designer",
      subject: "english",
      title: "房間設計師",
      en: "Room Designer",
      icon: "🛋️",
      path: "./room-designer/",
      grade: "國一",
      desc: "依英文指令拖放物品，兩關7個任務練習固定格線中的位置關係。",
      tags: ["位置詞","拖曳","閱讀"],
      added: "2026-11-20"
    },
    {
      id: "sentence-builder",
      subject: "english",
      title: "句子建築師",
      en: "Sentence Builder",
      icon: "🧱",
      path: "./sentence-builder/",
      grade: "國一",
      desc: "8–10題句子排序，可點選或拖曳詞卡，練習語序與句型。",
      tags: ["句型","語序","排序"],
      added: "2026-11-20"
    },
    {
      id: "escape-the-house",
      subject: "english",
      title: "密室逃脫",
      en: "Escape the House",
      icon: "🗝️",
      path: "./escape-the-house/",
      grade: "國一",
      desc: "依序解開單字鎖、位置密碼及句子出口。已提供字彙的自編複習，尚未核對完整課本。",
      tags: ["綜合複習","解謎","教材待核對"],
      added: "2026-11-20"
    }
  ]
};
