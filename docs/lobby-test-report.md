# 大廳改版驗收（2026-11-20）

範圍：以main 6f8b487為基準，只調整首頁、大廳呈現與樣式；不修改catalog資料或任何遊戲程式、教材。

## 改版

- 暖灰紙色、深綠文字、少量磚紅編號；移除漸層、陰影卡片、浮動Emoji及外部字型。
- 桌面兩欄的編號索引、手機單欄；11款各有原生SVG玩法示意。編號在搜尋結果中保持一致。
- 保留全部/英語導覽，無遊戲的科目收進「其他科目」，不在頁尾重複展示。
- 保留全部遊戲路徑、catalog格式、搜尋、hash導覽、隨機選遊戲與返回功能。

## 已實際驗證

`node tests/lobby.cjs`：Microsoft Edge 157與Google Chrome 157均通過，頁面JavaScript錯誤0。

- 全部11個原始遊戲路徑HTTP回應200，遊戲入口數量正確，11種玩法圖形不同。
- 中文名稱與舊遊戲標籤搜尋、空結果與清除搜尋、輸入內容逸出處理。
- `/`聚焦搜尋、Escape清除搜尋、搜尋前後編號一致。
- 全部、英語及空科目的hash切換；其他科目用鍵盤開啟與選取後保留焦點。
- 從遊戲返回、隨機進入遊戲、上一頁後恢復按鈕。
- 390、768、1440寬度均無頁面或卡片水平溢出。
- 深色模式；減少動態時CSS轉場為0秒，實際觸發導覽捲動且未呼叫smooth。
- 實際檢視桌面、手機及深色截圖，文字、圖形與留白正常。

`npm test`：既有8項核心/資料測試全部通過。
`git diff --exit-code -- assets/catalog.js assets/grade7 body-parts speaking-cards telling-time vocabulary-matching vocabulary-memory vocabulary-typing vocabulary-sorting house-detective room-designer sentence-builder escape-the-house`：遊戲與教材零差異。

獨立唯讀審查未發現阻擋問題。審查指出的導覽焦點與減少動態測試不足，皆新增測試先重現失敗，再修正通過。

## 未驗證

沒有重新逐款通關所有遊戲，因本次未改遊戲程式。未做真實觸控、螢幕閱讀器完整流程或教室投影現場驗收；不將自動測試當成這些環境的證明。美術偏好由使用者決定，截圖可供審閱。

## 重跑

```sh
npm ci
npm test
node tests/lobby.cjs
```

預設使用本機Edge，設定環境變數BROWSER_CHANNEL=chrome可改用Chrome。測試用本機靜態HTTP伺服器，不需要部署或修改後端。截圖在test-results（不提交）。
