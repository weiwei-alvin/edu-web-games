> **已搬家：** 遊戲現在放在 https://weiweialvin.tech/games/classroom/ ，原始碼在 [weiwei-alvin/weiwei-alvin.github.io](https://github.com/weiwei-alvin/weiwei-alvin.github.io/tree/main/games/classroom)。這個 repo 只保留舊網址的轉址頁，之後請到新位置修改。

# 國一英文單字遊戲

八款入口皆整合在原有 `index.html#english` 大廳，原有三款遊戲保留。

| 遊戲 | 獨立入口 | 內容 |
|---|---|---|
| 單字配對大挑戰 | vocabulary-matching/index.html | 8/10組、點選與拖曳、雙語例句 |
| 翻牌記憶王 | vocabulary-memory/index.html | 4/6/8組、翻牌操作鎖、時間與翻牌次數 |
| 英文打字生存戰 | vocabulary-typing/index.html | 10題、15/20/30秒可選、首字母與答案提示、錯題再練 |
| 單字分類工廠 | vocabulary-sorting/index.html | 15詞、5類、點選與拖曳、多個可接受分類 |
| 房屋偵探 | house-detective/index.html | 10題、房屋俯視場景、唯一目標與關鍵字提示 |
| 房間設計師 | room-designer/index.html | 兩關4+3題、7種位置關係、固定格線與參照物提示 |
| 句子建築師 | sentence-builder/index.html | 基礎8題／進階10題、詞卡點選/拖曳/插入/移回 |
| 密室逃脫 | escape-the-house/index.html | 隨機4組單字鎖、位置尋物與密碼、句子出口 |

每款都有開始、遊戲、結束畫面；提供重新開始、音效與靜音、當局紀錄與錯題表。新增遊戲不使用外部網路、API、帳號或資料儲存。可直接開啟個別 index.html 離線練習；大廳的資料夾網址導覽請使用 GitHub Pages 或任意靜態網站伺服器。

## 教材來源與限制

- 原始依據保存在 [規格](docs/game-spec.md) 及 [分配表](docs/vocabulary-allocation.md)。
- 集中教材位於 `assets/grade7/data.js`，含40個已提供字彙/片語（包括 around、world、ice）、中文、分類、雙語例句、場景、位置指令、句型答案。
- 沒有取得課本第108頁完整原文。中文、例句、場景與句型題是自編補充，不聲稱逐字對照課本或完整覆蓋課本。每款開始頁均明示此限制。
- 分類依自編例句決定用法（如 type＝輸入、hard＝堅硬的）；詞條 `cats` 可設定多個可接受分類。
- 場景輔助詞 sofa、bed、chair、table、bathtub、box 已在操作說明提供中文，不冒充指定課本字彙。
- 密室逃脫從40個已提供詞條隨機抽4組，其餘關卡抽自已確認的自編題目。這是可玩複習版，不是完整課本題庫驗收。

## 計分定義

首次率以原始題目總數作為分母。每題第一次提交正確且沒有使用提示才記首次答對；重試成功不覆寫。結束時必須完成所有題目。記憶遊戲每個詞第一次參與配對時建立首次紀錄，同一錯誤配對涉及兩個詞會各記一次錯誤；翻牌次數另行統計。打字逾時記一次錯誤後停止本題倒數，允許繼續輸入；原始題後的複習不增加首次分子或分母。

密室逃脫每局7個評量單位：4個配對詞、1題位置尋物、1題密碼、1題句子。位置密碼來自教材，不靠計時或亂數猜碼。普通模式只在結束顯示完成時間；計時模式同時顯示經過時間。

位置遊戲使用明確的教學格線約定，非精細像素比對。位置判定與參照物由 `data.js` / `core.js` 統一管理，格子可同時保留先前物品，不遮擋點擊。

## 維護與測試

`assets/grade7/core.js` 管理純函式；`app.js` 管理畫面與當局狀態；`game.css` 管理樣式。各入口共用教材以確保更新一致。

```sh
npm ci
npm test
npm run test:browser
node tests/regressions.cjs
node tests/hotspot.cjs
node tests/matching-stability.cjs
```

瀏覽器測試預設使用本機 Microsoft Edge。設定環境變數 `BROWSER_CHANNEL=chrome` 可改用已安裝的 Chrome。`SCENES_ONLY=1` 僅供開發排查後半段場景、句子、逃脫與大廳測試；正式全套驗收不設定此變數。

測試截圖輸出 `test-results/`（不提交）。測試工具只在開發時需要，學生執行遊戲不需要 Node 或 npm。

詳細驗收紀錄見 `docs/test-report.md`。
