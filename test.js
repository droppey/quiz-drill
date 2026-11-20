// 規則測試：node test.js（不需安裝任何套件）
// 用假的瀏覽器跑 index.html 裡的所有 script，再檢查計分規則。
const fs = require("fs"), vm = require("vm"), assert = require("assert");

const els = {}, store = {}, errors = [];
const el = () => ({ textContent: "", innerHTML: "", style: {}, classList: { toggle() {} }, scrollIntoView() {} });
const ctx = vm.createContext({
  localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); } },
  document: { title: "", getElementById: id => els[id] || (els[id] = el()), querySelectorAll: () => [] },
  window: { scrollTo() {} },
  setInterval() {},
  console: { ...console, error: (...a) => errors.push(a.join(" ")) },
});
const run = code => vm.runInContext(code, ctx);
const val = code => JSON.parse(JSON.stringify(run(code) ?? null));  // 轉成這邊的普通陣列才能比較

for (const [, src, body] of fs.readFileSync(__dirname + "/index.html", "utf8").matchAll(/<script(?: src="([^"]+)")?>([\s\S]*?)<\/script>/g))
  run(src ? fs.readFileSync(__dirname + "/" + src, "utf8") : body);

// 每個題庫的資料格式都正確、id 不重複
assert.deepStrictEqual(errors, [], "題庫資料有錯：\n" + errors.join("\n"));
assert.ok(run("BANKS.length") > 0, "沒有載入任何題庫");

// 題目只能加在最後：跟線上版（origin/main，大家的紀錄對應的版本）比，舊題庫都還在（id／storageKey 沒改）、舊題目的位置沒變（不能插入、刪除、重排）
const git = c => require("child_process").execSync("git " + c, { cwd: __dirname, encoding: "utf8", maxBuffer: 1 << 26 });
const oldBanks = [], octx = vm.createContext({ registerBank: b => oldBanks.push(b) });
for (const f of git("ls-tree -r --name-only origin/main banks").split("\n").filter(f => f.endsWith(".js")))
  vm.runInContext(git(`show "origin/main:${f}"`), octx);
for (const o of oldBanks) {
  const k = o.storageKey || "quiz-" + o.id, b = run("BANKS").find(b => run("bankKey")(b) === k);
  assert.ok(b, `題庫 ${o.id} 不見了或改了 id／storageKey（舊紀錄會讀不到）`);
  const i = o.questions.findIndex((q, i) => !b.questions[i] || b.questions[i].q !== q.q);
  assert.ok(i < 0, `${o.id} 第 ${i + 1} 題跟線上版不同：題目只能加在最後（若只是故意修錯字，確認 git diff 只有這處後 push 即可）`);
}

// 大題庫：每個題庫都有歸屬；第一次進站先選大題庫；選過之後再進站直接進上次的大題庫，清單只列該大題庫的題庫
assert.ok(run("GROUPS.length") > 1 && run("BANKS.every(b => GROUPS.includes(b.group))"), "有題庫沒有大題庫");
assert.strictEqual(run("GROUP"), null, "第一次進站應先選大題庫");
run("selectGroup(GROUPS[0])");
assert.strictEqual(store["group-v1"], run("GROUPS[0]"), "沒記住選的大題庫");
assert.deepStrictEqual([...els.main.innerHTML.matchAll(/selectBank\((\d+)\)/g)].map(m => +m[1]), val("BANKS.map((b, i) => b.group === GROUPS[0] ? i : -1).filter(i => i >= 0)"), "清單應剛好列出這個大題庫的題庫");
run("renderGroups(); home()");
assert.strictEqual(run("GROUP"), run("GROUPS[0]"), "再進站沒回到上次的大題庫");
run("selectMix()");
assert.ok(run("BANK.mix.every(i => BANKS[i].group === GROUPS[0])"), "混合隨機混到別的大題庫");
run("selectGroup(GROUPS[GROUPS.length-1])");  // 下面的測試題庫會歸到最後一個大題庫

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

// 計時：格式正確；全部答對後停止；重新開始後歸零
assert.deepStrictEqual(val("[fmtTime(65000), fmtTime(3725000)]"), ["1:05", "1:02:05"]);
run("restart(); S.scope='all'; startQuiz(); S.startedAt -= 5000; [0,1,2].forEach(i => pick(i, 1)); submitQuiz()");
assert.strictEqual(val("S.phase"), "done");
const t1 = run("elapsed()");
assert.ok(t1 >= 5000 && t1 === run("elapsed()"), "全部答對後計時沒停");
run("restart()");
assert.strictEqual(run("S.startedAt"), undefined, "重新開始後計時沒歸零");

// 隨機挑 N 題：N 題不重複、都在題庫內；N 大於題數時就是全部
run("restart(); S.scope='rand'; S.randN=2; startQuiz()");
const rp = val("S.pool");
assert.ok(rp.length === 2 && new Set(rp).size === 2 && rp.every(i => i >= 0 && i < 3), "隨機挑題錯誤：" + rp);
run("restart(); S.scope='rand'; S.randN=99; startQuiz()");
assert.deepStrictEqual(val("[...S.pool].sort()"), [0, 1, 2]);

// 備份：匯出再匯入要還原紀錄；壞檔案要整個拒絕
const backup = run("exportRecords()");
const saved = { ...store };
delete saved["group-v1"];  // 上次選的大題庫是這台裝置的偏好，不算紀錄、不進備份
for (const k in store) delete store[k];
run(`parseRecords(${JSON.stringify(backup)}).forEach(([k, v]) => localStorage.setItem(k, v))`);
assert.deepStrictEqual({ ...store }, saved, "匯出再匯入後紀錄不一致");
for (const bad of [JSON.stringify({data:{"x-quiz-v1":JSON.stringify({randN:'"><img src=x onerror=alert(1)>'})}}), JSON.stringify({data:{"x-quiz-v1":'{"round":"<b>"}'}}), "not json", '{"data":{}}', '{"data":{"x-quiz-v1":"{broken"}}', '{"data":{"evil":"1"}}'])
  assert.throws(() => run(`parseRecords(${JSON.stringify(bad)})`), "壞檔案沒被拒絕：" + bad);

// 合併匯入：星等取較高、收藏聯集、本機沒有的題目照收；進度留開始時間較晚的
store["mg-marks-v1"] = JSON.stringify({0:{s:4,f:0}, 1:{s:1,f:1}});
assert.deepStrictEqual(JSON.parse(run(`mergeRecord("mg-marks-v1", ${JSON.stringify(JSON.stringify({0:{s:2,f:1}, 1:{s:3,f:0}, 2:{s:5,f:0}}))})`)),
  {0:{s:4,f:1}, 1:{s:3,f:1}, 2:{s:5,f:0}}, "星等／收藏合併錯誤");
store["mg-quiz-v1"] = JSON.stringify({startedAt: 200});
assert.strictEqual(run(`mergeRecord("mg-quiz-v1", '{"startedAt":100}')`), null, "較舊的進度蓋掉了本機較新的進度");
assert.strictEqual(run(`mergeRecord("mg-quiz-v1", '{"startedAt":300}')`), '{"startedAt":300}', "較新的進度沒匯入");
delete store["mg-marks-v1"]; delete store["mg-quiz-v1"];

// 混合隨機：從選到的題庫抽題，星等／收藏寫回各自的題庫；沒選到的題庫不動
run(`registerBank({id:"m1", title:"M1", questions:[0,1].map(i => ({q:"x"+i, o:["a","b"], a:1, e:"e"}))})`);
run(`registerBank({id:"m2", title:"M2", questions:[0,1].map(i => ({q:"y"+i, o:["a","b"], a:2, e:"e"}))})`);
const before = store["quiz-t-marks-v1"];
run("selectMix(); BANK.mix.slice().forEach(toggleMix); toggleMix(BANKS.length-2); toggleMix(BANKS.length-1)");
run("S.scope='rand'; S.randN=99; startQuiz(); pick(S.pool[0], 1)");
run("backToBanks(); selectMix()");  // 離開再回來要接著作答
assert.deepStrictEqual([run("S.phase"), run("S.pool.length"), run("Object.keys(S.answers).length")], ["quiz", 4, 1], "混合模式沒接續進度");
run("S.pool.forEach(i => pick(i, 1)); submitQuiz()");
run("restart(); S.scope='rand'; startQuiz(); backToBanks(); selectMix()");  // 重來後離開再回來，題庫選擇與進度都要在
assert.deepStrictEqual([run("S.phase"), run("BANK.mix.length")], ["quiz", 2], "混合模式重來後遺失進度");
assert.deepStrictEqual(JSON.parse(store["quiz-m1-marks-v1"]), {0:{s:1,f:0}, 1:{s:1,f:0}});
assert.deepStrictEqual(JSON.parse(store["quiz-m2-marks-v1"]), {0:{s:0,f:1}, 1:{s:0,f:1}});
assert.strictEqual(store["quiz-t-marks-v1"], before, "混合模式動到沒選的題庫");
assert.ok(store["mix-quiz-v1"], "混合模式沒存進度");
run("backToBanks()");

// 題庫檔防呆：id 重複不載入、選項打錯字只報錯不崩潰、空題庫不顯示 NaN
const n = run("BANKS.length");
run(`registerBank({id:"t", title:"複製忘了改 id", questions:[]})`);
run(`registerBank({id:"typo", title:"打錯字", questions:[{q:"x", O:["a","b"], a:1, e:"y"}]})`);
run(`registerBank({id:"empty", title:"空題庫", questions:[]}); renderBanks()`);
assert.strictEqual(run("BANKS.length"), n + 2, "重複 id 的題庫不該載入");
assert.deepStrictEqual(errors, ["duplicate bank id t", "bad question typo 1"]);
assert.ok(!els.main.innerHTML.includes("NaN"), "空題庫顯示 NaN");

// 混合隨機：換到別的大題庫，即使總題數剛好一樣，也不能接續別的大題庫的進度
run(`group("G1"); registerBank({id:"g1", title:"G1", questions:[0,1].map(i => ({q:"g"+i, o:["a","b"], a:1, e:"e"}))})`);
run(`group("G2"); registerBank({id:"g2", title:"G2", questions:[0,1].map(i => ({q:"h"+i, o:["a","b"], a:1, e:"e"}))})`);
run("selectGroup('G1'); selectMix(); S.scope='all'; startQuiz(); pick(0, 1); backToBanks(); selectGroup('G2'); selectMix()");
assert.deepStrictEqual([run("S.phase"), Object.keys(val("S.answers")).length], ["setup", 0], "混合隨機接續了別的大題庫的進度");

console.log("OK：所有規則測試通過");
