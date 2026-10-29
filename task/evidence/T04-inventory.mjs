// T04: інвентар українських рядків головної сторінки.
// Запуск з кореня репозиторію: node task/evidence/T04-inventory.mjs > task/evidence/i18n-inventory.md
import fs from "node:fs";

const CYR = /[А-Яа-яЇїІіЄєҐґ]/;
const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const INLINE = new Set(["a", "b", "br", "em", "i", "small", "span", "strong", "code", "abbr", "sup", "sub"]);
const ATTRS = ["alt", "aria-label", "title", "placeholder", "content"];
const SECTIONS = { header: "nav", footer: "footer", ribbon: "ribbon", hero: "hero", learn: "learn", benefits: "benefits", calculator: "calculator", test: "test", trainers: "trainers", plan: "plan", music: "music", about: "about", "final-cta": "finalCta" };

function parse(html) {
  const root = { tag: "#root", attrs: {}, children: [], parent: null };
  let cur = root;
  const re = /<!--[\s\S]*?-->|<!doctype[^>]*>|<\/([a-zA-Z0-9]+)\s*>|<([a-zA-Z0-9]+)((?:\s+[^\s=>\/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>|([^<]+)/gi;
  let m;
  while ((m = re.exec(html))) {
    if (m[1]) {
      let n = cur;
      while (n && n.tag !== m[1].toLowerCase()) n = n.parent;
      if (n) cur = n.parent;
    } else if (m[2]) {
      const tag = m[2].toLowerCase();
      const attrs = {};
      for (const a of m[3].matchAll(/([^\s=>\/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) attrs[a[1].toLowerCase()] = a[2] ?? a[3] ?? a[4] ?? "";
      const el = { tag, attrs, children: [], parent: cur, start: m.index, open: m[0] };
      cur.children.push(el);
      if (tag === "script" || tag === "style") {
        const end = html.indexOf(`</${tag}>`, re.lastIndex);
        el.raw = html.slice(re.lastIndex, end);
        re.lastIndex = end + tag.length + 3;
      } else if (!VOID.has(tag) && !m[4]) cur = el;
    } else if (m[5] !== undefined && !/^<!/.test(m[0])) {
      cur.children.push({ tag: "#text", text: m[5], parent: cur });
    }
  }
  return root;
}

const serialize = n => n.tag === "#text" ? n.text : VOID.has(n.tag) ? n.open : n.open + n.children.map(serialize).join("") + `</${n.tag}>`;
const inner = n => n.children.map(serialize).join("");
const textOf = n => n.tag === "#text" ? n.text : (n.children || []).map(textOf).join("");
const camel = s => s.replace(/-(\w)/g, (_, c) => c.toUpperCase());
const ancestors = n => { const out = []; for (let p = n.parent; p; p = p.parent) out.push(p); return out; };

function sectionOf(n) {
  for (const a of [n, ...ancestors(n)]) {
    if (a.tag === "head") return "meta";
    if (a.attrs?.id && SECTIONS[a.attrs.id]) return SECTIONS[a.attrs.id];
    if (a.tag === "header" || a.tag === "footer") return SECTIONS[a.tag];
    const cls = (a.attrs?.class || "").split(/\s+/);
    for (const c of cls) if (SECTIONS[c]) return SECTIONS[c];
  }
  return "page";
}

function kindOf(tag) {
  if (/^h[1-6]$/.test(tag)) return "heading";
  return { p: "text", a: "link", button: "button", li: "item", span: "label", label: "label", small: "note", legend: "legend", option: "option", figcaption: "caption", b: "label", strong: "label", em: "label", title: "title" }[tag] || tag;
}

function isOriginal(n, isAttr) {
  if (isAttr) return "";
  if (n.attrs?.id === "player-title" || ancestors(n).some(a => a.attrs?.id === "tracks")) return "назва пісні";
  return "";
}

const html = fs.readFileSync("index.html", "utf8");
const tree = parse(html);
const counters = {};
const nextKey = (section, kind) => { const k = `${section}.${kind}`; counters[k] = (counters[k] || 0) + 1; return `${k}${counters[k]}`; };
const rows = [];

function walk(n) {
  if (n.tag === "#text" || n.tag === "template" || n.tag === "script" || n.tag === "style") return;
  for (const attr of ATTRS) {
    const v = n.attrs[attr];
    if (v && CYR.test(v)) {
      const section = sectionOf(n);
      let key;
      if (n.tag === "meta") key = { description: "meta.description", "og:title": "meta.ogTitle", "og:description": "meta.ogDescription" }[n.attrs.name || n.attrs.property] || nextKey("meta", "content");
      else key = nextKey(section, attr.replace(/-(\w)/g, (_, c) => c.toUpperCase()));
      rows.push({ section, key, where: `index.html <${n.tag}${n.attrs.id ? "#" + n.attrs.id : ""}> @${attr}`, type: "атрибут", text: v, note: isOriginal(n, true) });
    }
  }
  const direct = n.children.some(c => c.tag === "#text" && c.text.trim());
  if (direct && CYR.test(textOf(n))) {
    const section = n.tag === "title" ? "meta" : sectionOf(n);
    const key = n.tag === "title" ? "meta.title" : n.attrs.id ? `${section}.${camel(n.attrs.id)}` : nextKey(section, kindOf(n.tag));
    rows.push({ section, key, where: `index.html <${n.tag}${n.attrs.id ? "#" + n.attrs.id : ""}${n.attrs.class ? "." + n.attrs.class.split(/\s+/)[0] : ""}>`, type: "статичний", text: inner(n).trim(), note: isOriginal(n) });
    markCovered(n);
    for (const c of n.children) if (c.tag !== "#text") walkAttrsOnly(c);
    return;
  }
  n.children.forEach(walk);
}
const covered = new Set();
function markCovered(n) { if (n.tag === "#text") covered.add(n); else n.children.forEach(markCovered); }
function cyrTextNodes(n, out = []) {
  if (n.tag === "#text") { if (CYR.test(n.text)) out.push(n); return out; }
  if (n.tag === "template" || n.tag === "script" || n.tag === "style") return out;
  n.children.forEach(c => cyrTextNodes(c, out));
  return out;
}
function walkAttrsOnly(n) {
  if (n.tag === "#text") return;
  for (const attr of ATTRS) {
    const v = n.attrs[attr];
    if (v && CYR.test(v)) rows.push({ section: sectionOf(n), key: nextKey(sectionOf(n), attr.replace(/-(\w)/g, (_, c) => c.toUpperCase())), where: `index.html <${n.tag}> @${attr}`, type: "атрибут", text: v, note: isOriginal(n, true) });
  }
  n.children.forEach(walkAttrsOnly);
}
walk(tree);

// Шаблони пісень: лише лічильник, це оригінальний контент.
const templates = [...html.matchAll(/<template\b[\s\S]*?<\/template>/g)].length;

// app.js: рядкові та шаблонні літерали з кирилицею.
const js = fs.readFileSync("app.js", "utf8");
const lits = [];
for (let i = 0; i < js.length; i++) {
  const ch = js[i];
  if (ch === "/" && js[i + 1] === "/") { i = js.indexOf("\n", i); if (i < 0) break; continue; }
  if (ch === "/" && js[i + 1] === "*") { i = js.indexOf("*/", i) + 1; continue; }
  if (ch === "'" || ch === '"' || ch === "`") {
    let j = i + 1, depth = 0;
    while (j < js.length) {
      if (js[j] === "\\") { j += 2; continue; }
      if (ch === "`" && js[j] === "$" && js[j + 1] === "{") { depth++; j += 2; continue; }
      if (ch === "`" && depth && js[j] === "}") { depth--; j++; continue; }
      if (!depth && js[j] === ch) break;
      j++;
    }
    const body = js.slice(i + 1, j);
    if (CYR.test(body)) lits.push({ start: i, body, quote: ch });
    i = j;
  }
}
const lineOf = pos => js.slice(0, pos).split("\n").length;
function jsContext(pos) {
  const direct = js.slice(Math.max(0, pos - 120), pos).match(/\$\('#([\w-]+)'\)\.(?:textContent|innerHTML)=[^;]*$/);
  const decl = [...js.slice(0, pos).matchAll(/(?:function\s+(\w+)|const\s+(\w+)\s*=)/g)].pop();
  return { id: direct ? direct[1] : "", decl: decl ? decl[1] || decl[2] : "" };
}
// Ключі для app.js задано явно: контекст коду не дає осмислених назв.
const JS_KEYS = [
  [/^лівий мізинець$/, "keyboard.finger.leftPinky"], [/^лівий безіменний$/, "keyboard.finger.leftRing"],
  [/^лівий середній$/, "keyboard.finger.leftMiddle"], [/^лівий вказівний$/, "keyboard.finger.leftIndex"],
  [/^правий вказівний$/, "keyboard.finger.rightIndex"], [/^правий середній$/, "keyboard.finger.rightMiddle"],
  [/^правий безіменний$/, "keyboard.finger.rightRing"], [/^правий мізинець$/, "keyboard.finger.rightPinky"],
  [/Після натискання поверни палець/, "keyboard.keyTip", "розбити на `keyboard.keyTip` і `keyboard.keyTipAltGr` з параметрами {key}, {base}, {finger}"],
  [/^пробіл$/, "keyboard.space"], [/^Пробіл — великий палець/, "keyboard.spaceTip"],
  [/^Домашня позиція: Ф/, "keyboard.homeUk"], [/^Домашня позиція: A/, "keyboard.homeLatin", "той самий рядок двічі — один ключ"],
  [/^Польська програміста/, "keyboard.notePl"], [/^Українська ЙЦУКЕН/, "keyboard.noteUk"], [/^Англійська QWERTY/, "keyboard.noteEn"],
  [/^Шар AltGr/, "keyboard.altgrTip"],
  [/^\{Math\.round\(d\*5\)\} хв$/, "calculator.minutes", "параметр {minutes}"], [/год .* хв$/, "calculator.hoursMinutes", "параметри {hours}, {minutes}"],
  [/^Введи коректні/, "calculator.errorInvalid"], [/^Щоб заощадити час/, "calculator.errorTarget"], [/^Більше часу на те/, "calculator.result"],
  [/^Поточна швидкість/, "calculator.currentLabel", "вкладені одиниці SPM/WPM — окремі ключі `calculator.unit.*`"],
  [/^Бажана швидкість/, "calculator.targetLabel", "вкладені одиниці SPM/WPM — окремі ключі `calculator.unit.*`"],
  [/^Обсяг тексту за день/, "calculator.volumeLabel", "вкладені одиниці — окремі ключі `calculator.unit.*`"],
  [/^Час вийшов/, "test.timeUp"], [/^Текст завершено/, "test.textDone"],
  [/SPM · .* WPM · точність/, "test.summary", "параметри {spm}, {wpm}, {accuracy}, {characters}"],
  [/^Результат зафіксовано/, "test.statusDone"], [/^\{duration\} секунд$/, "test.durationLabel", "множина: {seconds}"],
  [/^Друкуй протягом/, "test.statusReady", "множина: {seconds}"], [/^Тест триває/, "test.statusRunning"],
  [/\/ 30 днів$/, "plan.progress", "множина: {done}"], [/^День \{i\}/, "plan.dayLabel", "параметр {day}"],
  [/^Браузер не дозволяє збереження/, "plan.storageError"],
  [/^Піктограма/, "trainers.iconAlt", "параметр {name}"], [/ілюстрація можливостей тренажера$/, "trainers.imageAltFallback", "параметр {name}"],
  [/^ф і в а$/, "trainers.placeholderKeys", "домашні клавіші мови сторінки: «a s d f» для en і pl"],
  [/НАВЧАННЯ ЧЕРЕЗ ГРУ/, "trainers.tag", "5 міток у тернарному виразі за індексом тренажера; перенести в `catalog.json` (T14)"],
  [/^Відкрити тренажер/, "trainers.linkOpen"], [/^GitHub · приватний/, "trainers.linkGithubPrivate"],
  [/^Альтернативна версія/, "trainers.linkAlternative"], [/^Інструкція/, "trainers.linkGuide"],
  [/^Не вдалося завантажити каталог/, "trainers.loadError"],
  [/^Вступ$/, "song.part.intro"], [/^Куплет 1$/, "song.part.verse1"], [/^Куплет 2$/, "song.part.verse2"],
  [/^Передприспів$/, "song.part.preChorus"], [/^Приспів$/, "song.part.chorus"], [/^Бридж$/, "song.part.bridge"],
  [/^Фінальний приспів$/, "song.part.finalChorus"], [/^Кінцівка$/, "song.part.outro"],
  [/^Пісня \{d\.title\}$/, "music.audioLabel", "параметр {title}"], [/^Обкладинка пісні/, "music.coverAlt", "параметр {title}"]
];
const unmapped = [];
for (const l of lits) {
  const ctx = jsContext(l.start);
  const text = l.body.replace(/\$\{([^}]*)\}/g, (_, e) => `{${e.trim()}}`);
  let type = "динамічний", note = "", key;
  if (ctx.decl === "layouts") { type = "дані"; key = "— (layouts)"; note = "символи розкладки, не перекладаються"; }
  else if (ctx.decl === "passage") { type = "вправа"; key = "— (passage)"; note = "текст тесту; окремий текст для кожної мови (FR-08)"; }
  else {
    const hit = JS_KEYS.find(([re]) => re.test(text));
    if (hit) { key = hit[1]; note = hit[2] || ""; } else { key = nextKey("app", "string"); unmapped.push(text); }
  }
  rows.push({ section: "app.js", key, where: `app.js:${lineOf(l.start)}${ctx.id ? " → #" + ctx.id : ""}`, type, text, note });
}
if (unmapped.length) process.stderr.write("Без ключа: " + unmapped.join(" | ") + "\n");

// catalog.json: текстові поля тренажерів.
const catalog = JSON.parse(fs.readFileSync("catalog.json", "utf8"));
catalog.forEach((t, i) => {
  const id = `trainer${i + 1}`;
  rows.push({ section: "catalog.json", key: `— (${id}.name)`, where: `catalog.json[${i}].name`, type: "оригінал", text: t.name, note: "власна назва" });
  rows.push({ section: "catalog.json", key: `— (${id}.author)`, where: `catalog.json[${i}].author`, type: "оригінал", text: t.author, note: "ім’я автора" });
  rows.push({ section: "catalog.json", key: `catalog.${id}.description`, where: `catalog.json[${i}].description`, type: "каталог", text: t.description, note: "" });
  (t.features || []).forEach((f, j) => rows.push({ section: "catalog.json", key: `catalog.${id}.feature${j + 1}`, where: `catalog.json[${i}].features[${j}]`, type: "каталог", text: f, note: "" }));
  if (t.imageAlt) rows.push({ section: "catalog.json", key: `catalog.${id}.imageAlt`, where: `catalog.json[${i}].imageAlt`, type: "каталог", text: t.imageAlt, note: "" });
});

for (const r of rows) if (r.note === "назва пісні") { r.type = "оригінал"; r.key = `— (${r.key})`; }

// Початкові тексти в HTML, які app.js потім замінює тим самим повідомленням: один ключ.
const MERGE = [
  ["<p#calc-note", "calculator.result", "початкове значення = `calculator.result`"],
  ["<span#progress-label", "plan.progress", "початкове значення = `plan.progress` з {done}=0"],
  ["<audio#player-audio> @aria-label", "music.audioLabel", "початкове значення = `music.audioLabel` з {title} першої пісні"],
  ["<img#player-cover> @alt", "music.coverAlt", "початкове значення = `music.coverAlt` з {title} першої пісні"],
  ["#current-label", "calculator.currentLabel", "початкове значення = шаблон з одиницею WPM"],
  ["#target-label", "calculator.targetLabel", "початкове значення = шаблон з одиницею WPM"],
  ["#volume-label", "calculator.volumeLabel", "початкове значення = шаблон з одиницею «умовних слів»"]
];
for (const r of rows) {
  const m = r.where.startsWith("index.html") && MERGE.find(([w]) => r.where.includes(w));
  if (m) { r.key = m[1]; r.note = m[2]; }
}

// Позначки для T06: що в одиниці не можна перекладати як звичайний текст.
const addNote = (r, s) => { r.note = r.note ? `${r.note}; ${s}` : s; };
for (const r of rows) {
  if (r.type === "оригінал" || r.type === "дані" || r.type === "вправа") continue;
  if (/\sid="|<input/.test(r.text)) addNote(r, "вкладений елемент з `id` або `<input>`: перекладати лише текст, розмітку зберегти");
  if (/Ф І В А|О Л Д Ж|ф і в а/.test(r.text)) addNote(r, "клавіші домашнього ряду UK: для en/pl — A S D F · J K L ;");
  if (/Гайдук Анна|Артем \(artyd\)/.test(r.text)) addNote(r, "містить ім’я автора кирилицею: на en/pl позначити `lang=\"uk\"`");
  if (/«Спробувати ще раз»/.test(r.text)) addNote(r, "цитує `test.restart` — переклад має збігатися з підписом кнопки");
}

// Розбіжності між початковим текстом у HTML і текстом, який app.js показує для того самого стану.
const FINDINGS = [
  ["`learn.layoutNote` ≠ `keyboard.noteUk`", "Примітка до схеми UK при першому відкритті: «…Домашній ряд: Ф І В А · О Л Д Ж. Ґ може потребувати окремої клавіші або комбінації залежно від ОС.»; після повернення на UK — «…Ґ та апостроф залежать від варіанта розкладки ОС. Схема показує літерні зони.»", "Вибрати один текст до T07; тоді `learn.layoutNote` зливається з `keyboard.noteUk`"],
  ["`learn.keyTip` ≠ `keyboard.homeUk`", "Підказка при першому відкритті — «А та О: вказівні пальці. Знайди виступи на клавішах F і J.»; після повернення на UK — «Домашня позиція: Ф І В А · О Л Д Ж.»", "Прийнятно як два різні повідомлення; лишити обидва ключі"],
  ["`test.testStatus` ≠ `test.statusReady`", "До першого тесту — «Таймер почнеться з першого символу.»; після скидання — «Друкуй протягом {seconds} секунд. Таймер почнеться з першого символу.»", "Прийнятно; лишити обидва ключі"]
];

// Звірка з лічильниками з idea.md (той самий спосіб підрахунку).
const noTpl = html.replace(/<template[\s\S]*?<\/template>/g, "").replace(/<script[\s\S]*?<\/script>/g, "");
const rawNodes = (noTpl.match(/>[^<]*[А-Яа-яЇїІіЄєҐґ][^<]*</g) || []).length;
const rawAttrs = (noTpl.match(/(alt|aria-label|placeholder|title|content)="[^"]*[А-Яа-яЇїІіЄєҐґ][^"]*"/g) || []).length;
const allCyrNodes = cyrTextNodes(tree);
const uncovered = allCyrNodes.filter(n => !covered.has(n));

const esc = s => s.replace(/\|/g, "\\|").replace(/\n/g, " ");
const by = t => rows.filter(r => r.type === t).length;
const out = [];
out.push("# Інвентар рядків для перекладу (T04)");
out.push("");
out.push("Згенеровано скриптом `task/evidence/T04-inventory.mjs` з `index.html`, `app.js`, `catalog.json` станом на коміт після T21. Не редагувати вручну — перегенерувати.");
out.push("");
out.push("Ключі — пропозиція за контрактом плану (`розділ.елемент`). Вони стають сталими, коли T06/T07 запише їх у розмітку й словник; до того їх можна перейменувати. Для вкладеної розмітки (`<br>`, `<em>`, `<b>`) одиницею перекладу є весь блок разом з тегами.");
out.push("");
out.push("## Підсумок");
out.push("");
out.push("| Тип | Що це | Кількість | Перекладається |");
out.push("|---|---|---|---|");
out.push(`| статичний | текст у HTML | ${by("статичний")} | так |`);
out.push(`| атрибут | \`alt\`, \`aria-label\`, \`content\` у HTML | ${by("атрибут")} | так |`);
out.push(`| динамічний | рядки в \`app.js\` | ${by("динамічний")} | так |`);
out.push(`| каталог | описи, переваги, \`imageAlt\` у \`catalog.json\` | ${by("каталог")} | так (T14) |`);
out.push(`| вправа | текст швидкісного тесту | ${by("вправа")} | ні — окремий текст для кожної мови (T15, T18) |`);
out.push(`| дані | символи розкладки \`uk\` | ${by("дані")} | ні |`);
out.push(`| оригінал | назви пісень, назви тренажерів, імена авторів | ${by("оригінал")} | ні |`);
out.push(`| **Разом** | | **${rows.length}** | **${by("статичний") + by("атрибут") + by("динамічний") + by("каталог")}** |`);
out.push("");
out.push(`Шаблони пісень (\`<template class="song-data">\`, ${templates} шт.) — оригінальний контент, до інвентаря не входять; їхні підписи частин — у \`app.js\` (\`songParts\`).`);
out.push("");
out.push("### Звірка з умовою Done");
out.push("");
out.push("| Підрахунок | Грубий (регулярний вираз, як в `idea.md`) | Точний (розбір дерева) | Покрито інвентарем |");
out.push("|---|---|---|---|");
out.push(`| Текстові вузли з кирилицею в HTML (без шаблонів) | ${rawNodes} | ${allCyrNodes.length} | ${allCyrNodes.length - uncovered.length} у ${rows.filter(r => r.where.startsWith("index.html") && !r.where.includes("@")).length} одиницях; непокритих: ${uncovered.length} |`);
out.push(`| Атрибути з кирилицею в HTML | ${rawAttrs} | ${rawAttrs} | ${rows.filter(r => r.where.startsWith("index.html") && r.where.includes("@")).length} |`);
out.push(`| Літерали з кирилицею в \`app.js\` | — | ${lits.length} | ${rows.filter(r => r.where.startsWith("app.js")).length} |`);
if (uncovered.length) { out.push(""); out.push("Непокриті вузли: " + uncovered.map(n => "`" + n.text.trim().slice(0, 40) + "`").join(", ")); }
out.push("");
out.push("Грубий підрахунок (як в `idea.md`) рахує фрагменти між `>` і `<`; для Done використано точний розбір дерева.");
const dupKeys = Object.entries(rows.filter(r => !r.key.startsWith("—")).reduce((m, r) => (m[r.key] = (m[r.key] || 0) + 1, m), {})).filter(([, n]) => n > 1);
const uniqueKeys = new Set(rows.filter(r => !r.key.startsWith("—")).map(r => r.key)).size;
out.push("");
out.push(`Унікальних ключів для перекладу: ${uniqueKeys}. Спільні ключі (той самий рядок у кількох місцях — очікувано): ${dupKeys.length ? dupKeys.map(([k, n]) => "`" + k + "` ×" + n).join(", ") : "немає"}. Літералів \`app.js\` без ключа: ${unmapped.length}.`);
out.push("");
out.push("## Розбіжності, які треба вирішити до T06/T07");
out.push("");
out.push("| Що | Факт | Рекомендація |");
out.push("|---|---|---|");
for (const f of FINDINGS) out.push(`| ${f[0]} | ${esc(f[1])} | ${esc(f[2])} |`);
out.push("");
out.push("Інші особливості:");
out.push("");
out.push("- **T07:** `keyboard.keyTip`, `calculator.*Label` і `trainers.tag` містять у шаблоні вкладені тернарні вирази — перед перекладом їх треба розкласти на окремі ключі з параметрами (див. примітки в таблиці `app.js`).");
out.push(`- **T06:** ${rows.filter(r => /вкладений елемент/.test(r.note)).length} одиниць містять вкладені елементи з \`id\` або \`<input>\`; перекладний текст у них варто винести в окремий \`<span data-i18n>\`, щоб переклад не міг зачепити розмітку.`);
out.push(`- **T06, SC-02:** кириличні власні назви (імена авторів, назви пісень, назви тренажерів) на en/pl мають бути в елементах з \`lang="uk"\`, інакше перевірка витоків кирилиці їх зачепить.`);
out.push(`- **Переклад:** ${rows.filter(r => /домашнього ряду UK/.test(r.note)).length} одиниць згадують клавіші Ф І В А · О Л Д Ж — для en/pl їх треба замінити на A S D F · J K L ;, а не перекладати дослівно.`);
out.push("");
const sections = [...new Set(rows.map(r => r.section))];
for (const s of sections) {
  out.push(`## ${s}`);
  out.push("");
  out.push("| Ключ | Текст | Де | Тип | Примітка |");
  out.push("|---|---|---|---|---|");
  const code = s => s.includes("`") ? "`` " + esc(s) + " ``" : "`" + esc(s) + "`";
  for (const r of rows.filter(r => r.section === s)) out.push(`| \`${r.key}\` | ${code(r.text)} | ${code(r.where)} | ${r.type} | ${esc(r.note)} |`);
  out.push("");
}
process.stdout.write(out.join("\n"));
