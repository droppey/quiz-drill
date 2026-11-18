# 刷題網站

純 HTML/JS，沒有 build。題庫在 `banks/*.js`，由 `index.html` 最下面的 `<script src>` 載入。新增題庫或補題用 `/add-bank`。

- 題目只能加在題庫最後面，不可插入、刪除或重排；不可改題庫 `id`／`storageKey`（星等、收藏、進度都靠位置和 id 存在 localStorage）
- 改完一律跑 `node test.js`，要印出「OK：所有規則測試通過」
