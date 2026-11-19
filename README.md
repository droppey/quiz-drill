# 刷題網站

一進站先選大題庫（衍生性金融商品／期貨商業務員／證券商高級業務員，之後會直接進上次選的），再選題目庫，再選範圍（全部／只刷收藏／只刷 ≤N 星，含 0 星／隨機挑 N 題）作答。

- 先完整作答一輪 → 交卷 → 顯示答對/答錯與錯題檢視（含解析）
- 只重做錯題，重複到全部答對
- 每題可標 ★ 星等（0–5）與 ♥ 收藏；交卷時答對 +1 星、答錯 −1 星，答錯（含未答）自動收藏
- 題庫清單每列顯示 ♥ 收藏數與 ★ 進度（總星數 ÷ 題數×5，無條件捨去）
- 🎲 混合隨機：勾選同一個大題庫裡的多個題庫一起抽題，星等與收藏寫回原題庫；混合模式的作答進度不在備份裡，勾選的題庫補題後會重來
- 進度與標記依題庫分開存在瀏覽器（localStorage）；題庫清單頁可「匯出／匯入紀錄」備份
- 手機：用 Safari 開 https://droppey.github.io/quiz-drill/ → 分享 → 加入主畫面，像 app 一樣開啟，資料不會因久沒開被清掉

## 本機執行

純 HTML/JS，不用安裝或 build：直接用瀏覽器開 `index.html` 即可。

```
node test.js   # 檢查題庫格式與計分規則，應印出「OK：所有規則測試通過」
```

## 題庫

<details><summary><b>衍生性金融商品</b>（8 個題庫・750 題）</summary>

| 檔案 | 題庫 | 題數 |
|---|---|---|
| `banks/derivatives/derivatives-intro.js` | 第一篇 衍生性商品概論 | 239 |
| `banks/derivatives/ifrs-derivatives.js` | 第二篇 衍生性商品之會計處理 | 42 |
| `banks/derivatives/derivatives-law.js` | 第三篇 衍生性商品相關法規 | 169 |
| `banks/derivatives/tabf-derivatives-16.js` | 衍生性金融商品銷售人員資格測驗　第 16 期 | 60 |
| `banks/derivatives/tabf-derivatives-17.js` | 衍生性金融商品銷售人員資格測驗　第 17 期 | 60 |
| `banks/derivatives/tabf-derivatives-18.js` | 衍生性金融商品銷售人員資格測驗　第 18 期 | 60 |
| `banks/derivatives/tabf-derivatives-19.js` | 衍生性金融商品銷售人員資格測驗　第 19 期 | 60 |
| `banks/derivatives/tabf-derivatives-20.js` | 衍生性金融商品銷售人員資格測驗　第 20 期 | 60 |

</details>

<details><summary><b>期貨商業務員</b>（10 個題庫・500 題）</summary>

| 檔案 | 題庫 | 題數 |
|---|---|---|
| `banks/futures/futures-law-114-1.js` | 期貨商業務員　114 年第 1 次　期貨交易法規 | 50 |
| `banks/futures/futures-practice-114-1.js` | 期貨商業務員　114 年第 1 次　期貨交易理論與實務 | 50 |
| `banks/futures/futures-law-114-2.js` | 期貨商業務員　114 年第 2 次　期貨交易法規 | 50 |
| `banks/futures/futures-practice-114-2.js` | 期貨商業務員　114 年第 2 次　期貨交易理論與實務 | 50 |
| `banks/futures/futures-law-114-3.js` | 期貨商業務員　114 年第 3 次　期貨交易法規 | 50 |
| `banks/futures/futures-practice-114-3.js` | 期貨商業務員　114 年第 3 次　期貨交易理論與實務 | 50 |
| `banks/futures/futures-law-115-1.js` | 期貨商業務員　115 年第 1 次　期貨交易法規 | 50 |
| `banks/futures/futures-practice-115-1.js` | 期貨商業務員　115 年第 1 次　期貨交易理論與實務 | 50 |
| `banks/futures/futures-law-115-2.js` | 期貨商業務員　115 年第 2 次　期貨交易法規 | 50 |
| `banks/futures/futures-practice-115-2.js` | 期貨商業務員　115 年第 2 次　期貨交易理論與實務 | 50 |

</details>

<details><summary><b>證券商高級業務員</b>（42 個題庫・2095 題）</summary>

| 檔案 | 題庫 | 題數 |
|---|---|---|
| `banks/senior/senior-invest-111-1.js` | 證券商高級業務員　111 年第 1 次　投資學 | 50 |
| `banks/senior/senior-finance-111-1.js` | 證券商高級業務員　111 年第 1 次　財務分析 | 50 |
| `banks/senior/senior-law-111-1.js` | 證券商高級業務員　111 年第 1 次　證券交易相關法規與實務 | 50 |
| `banks/senior/senior-invest-111-2.js` | 證券商高級業務員　111 年第 2 次　投資學 | 50 |
| `banks/senior/senior-finance-111-2.js` | 證券商高級業務員　111 年第 2 次　財務分析 | 50 |
| `banks/senior/senior-law-111-2.js` | 證券商高級業務員　111 年第 2 次　證券交易相關法規與實務 | 50 |
| `banks/senior/senior-invest-111-3.js` | 證券商高級業務員　111 年第 3 次　投資學 | 50 |
| `banks/senior/senior-finance-111-3.js` | 證券商高級業務員　111 年第 3 次　財務分析 | 50 |
| `banks/senior/senior-law-111-3.js` | 證券商高級業務員　111 年第 3 次　證券交易相關法規與實務 | 50 |
| `banks/senior/senior-invest-112-1.js` | 證券商高級業務員　112 年第 1 次　投資學 | 49 |
| `banks/senior/senior-finance-112-1.js` | 證券商高級業務員　112 年第 1 次　財務分析 | 49 |
| `banks/senior/senior-law-112-1.js` | 證券商高級業務員　112 年第 1 次　證券交易相關法規與實務 | 50 |
| `banks/senior/senior-invest-112-2.js` | 證券商高級業務員　112 年第 2 次　投資學 | 50 |
| `banks/senior/senior-finance-112-2.js` | 證券商高級業務員　112 年第 2 次　財務分析 | 49 |
| `banks/senior/senior-law-112-2.js` | 證券商高級業務員　112 年第 2 次　證券交易相關法規與實務 | 50 |
| `banks/senior/senior-invest-112-3.js` | 證券商高級業務員　112 年第 3 次　投資學 | 50 |
| `banks/senior/senior-finance-112-3.js` | 證券商高級業務員　112 年第 3 次　財務分析 | 50 |
| `banks/senior/senior-law-112-3.js` | 證券商高級業務員　112 年第 3 次　證券交易相關法規與實務 | 50 |
| `banks/senior/senior-invest-113-1.js` | 證券商高級業務員　113 年第 1 次　投資學 | 50 |
| `banks/senior/senior-finance-113-1.js` | 證券商高級業務員　113 年第 1 次　財務分析 | 50 |
| `banks/senior/senior-law-113-1.js` | 證券商高級業務員　113 年第 1 次　證券交易相關法規與實務 | 50 |
| `banks/senior/senior-invest-113-2.js` | 證券商高級業務員　113 年第 2 次　投資學 | 49 |
| `banks/senior/senior-finance-113-2.js` | 證券商高級業務員　113 年第 2 次　財務分析 | 50 |
| `banks/senior/senior-law-113-2.js` | 證券商高級業務員　113 年第 2 次　證券交易相關法規與實務 | 50 |
| `banks/senior/senior-invest-113-3.js` | 證券商高級業務員　113 年第 3 次　投資學 | 50 |
| `banks/senior/senior-finance-113-3.js` | 證券商高級業務員　113 年第 3 次　財務分析 | 50 |
| `banks/senior/senior-law-113-3.js` | 證券商高級業務員　113 年第 3 次　證券交易相關法規與實務 | 50 |
| `banks/senior/senior-invest-114-1.js` | 證券商高級業務員　114 年第 1 次　投資學 | 49 |
| `banks/senior/senior-finance-114-1.js` | 證券商高級業務員　114 年第 1 次　財務分析 | 50 |
| `banks/senior/senior-law-114-1.js` | 證券商高級業務員　114 年第 1 次　證券交易相關法規與實務 | 50 |
| `banks/senior/senior-invest-114-2.js` | 證券商高級業務員　114 年第 2 次　投資學 | 50 |
| `banks/senior/senior-finance-114-2.js` | 證券商高級業務員　114 年第 2 次　財務分析 | 50 |
| `banks/senior/senior-law-114-2.js` | 證券商高級業務員　114 年第 2 次　證券交易相關法規與實務 | 50 |
| `banks/senior/senior-invest-114-3.js` | 證券商高級業務員　114 年第 3 次　投資學 | 50 |
| `banks/senior/senior-finance-114-3.js` | 證券商高級業務員　114 年第 3 次　財務分析 | 50 |
| `banks/senior/senior-law-114-3.js` | 證券商高級業務員　114 年第 3 次　證券交易相關法規與實務 | 50 |
| `banks/senior/senior-invest-115-1.js` | 證券商高級業務員　115 年第 1 次　投資學 | 50 |
| `banks/senior/senior-finance-115-1.js` | 證券商高級業務員　115 年第 1 次　財務分析 | 50 |
| `banks/senior/senior-law-115-1.js` | 證券商高級業務員　115 年第 1 次　證券交易相關法規與實務 | 50 |
| `banks/senior/senior-invest-115-2.js` | 證券商高級業務員　115 年第 2 次　投資學 | 50 |
| `banks/senior/senior-finance-115-2.js` | 證券商高級業務員　115 年第 2 次　財務分析 | 50 |
| `banks/senior/senior-law-115-2.js` | 證券商高級業務員　115 年第 2 次　證券交易相關法規與實務 | 50 |

</details>


### 新增題庫

1. 在所屬大題庫的資料夾新增一個檔案（`banks/derivatives/`、`banks/futures/`、`banks/senior/`；新大題庫就開新資料夾），例如 `banks/futures/xxx.js`：

```js
registerBank({
  id: "xxx",               // 唯一代號（也用於儲存紀錄，之後不要改）
  title: "題庫名稱",
  desc: "簡短說明",
  questions: [
    {q: "題幹", o: ["選項1", "選項2", "選項3", "選項4"], a: 2, e: "解析"},
  ]
});
```

| 欄位 | 說明 |
|---|---|
| `q` | 題幹（必填） |
| `o` | 選項陣列，至少 2 個 |
| `a` | 正解是第幾個選項，**從 1 起算**（上例 `a: 2` 是「選項2」） |
| `e` | 解析（必填） |

已上線的題庫若要換 `id`，可另設 `storageKey` 指向舊紀錄（預設是 `quiz-<id>`），否則舊的星等、收藏會讀不到。

2. 在 `index.html` 最下面的題庫清單加一行 `<script src="banks/futures/xxx.js"></script>`，放在它所屬大題庫的 `<script>group("…")</script>` 那段裡（最後一個題庫後面）。要新開大題庫就在清單最後加一行 `<script>group("名稱")</script>`，再把題庫接在下面。

`id`（或 `storageKey`）重複的題庫不會載入，console 會顯示 `duplicate bank id`。改完跑 `node test.js` 檢查。

**新增題目只能加在題庫最後面，不要在中間插入或刪除**——星等與收藏是用題目順序（位置）記的，插入會讓後面的標記全部錯位。格式錯誤的題目會在瀏覽器 console 顯示 `bad question <id> <題號>`。
