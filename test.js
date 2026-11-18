// 規則測試：node test.js（不需安裝任何套件）
// 用假的瀏覽器跑 index.html 裡的所有 script，再檢查計分規則。
const fs = require("fs"), vm = require("vm"), assert = require("assert");

const els = {}, store = {}, errors = [];
const el = () => ({ textContent: "", innerHTML: "", style: {}, classList: { toggle() {} }, scrollIntoView() {} });
const ctx = vm.createContext({
  localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); } },
  document: { title: "", getElementById: id => els[id] || (els[id] = el()), querySelectorAll: () => [] },
  window: { scrollTo() {} },
  console: { ...console, error: (...a) => errors.push(a.join(" ")) },
});
const run = code => vm.runInContext(code, ctx);
const val = code => JSON.parse(JSON.stringify(run(code) ?? null));  // 轉成這邊的普通陣列才能比較

for (const [, src, body] of fs.readFileSync(__dirname + "/index.html", "utf8").matchAll(/<script(?: src="([^"]+)")?>([\s\S]*?)<\/script>/g))
  run(src ? fs.readFileSync(__dirname + "/" + src, "utf8") : body);

// 每個題庫的資料格式都正確、id 不重複
assert.deepStrictEqual(errors, [], "題庫資料有錯：\n" + errors.join("\n"));
assert.ok(run("BANKS.length") > 0, "沒有載入任何題庫");

// 用一個 3 題的測試題庫檢查規則
run(`registerBank({id:"t", title:"測試", questions:[0,1,2].map(i => ({q:"q"+i, o:["a","b"], a:1, e:"e"}))}); selectBank(BANKS.length-1)`);
run("setStar(0, 2)");

// ≤N 星：0 星只選到沒星的題目（minStar=0 不能被當成 3）
run("S.scope='star'; S.minStar=0; startQuiz()");
assert.deepStrictEqual(val("S.pool"), [1, 2]);

// 有題目沒作答 → 第一次交卷只警告；換範圍後重新開始也要再警告
run("submitQuiz(); restart(); S.scope='star'; S.minStar=0; startQuiz(); submitQuiz()");
assert.strictEqual(val("S.phase"), "quiz", "換範圍後交卷沒有警告未作答");

// 答對 +1 星、不加愛心；未作答 = 答錯 → 星等不低於 0、自動加愛心
run("pick(1, 1); submitQuiz()");  // 上面已警告過一次，這次按交卷就送出
assert.deepStrictEqual(val("[star(1), fav(1), star(2), fav(2), star(0)]"), [1, 0, 0, 1, 2]);
assert.deepStrictEqual(val("S.lastWrong"), [2]);

// 題庫檔防呆：id 重複不載入、選項打錯字只報錯不崩潰、空題庫不顯示 NaN
const n = run("BANKS.length");
run(`registerBank({id:"t", title:"複製忘了改 id", questions:[]})`);
run(`registerBank({id:"typo", title:"打錯字", questions:[{q:"x", O:["a","b"], a:1, e:"y"}]})`);
run(`registerBank({id:"empty", title:"空題庫", questions:[]}); renderBanks()`);
assert.strictEqual(run("BANKS.length"), n + 2, "重複 id 的題庫不該載入");
assert.deepStrictEqual(errors, ["duplicate bank id t", "bad question typo 1"]);
assert.ok(!els.main.innerHTML.includes("NaN"), "空題庫顯示 NaN");

console.log("OK：所有規則測試通過");
