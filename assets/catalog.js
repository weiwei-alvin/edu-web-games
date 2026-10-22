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
    }
  ]
};
