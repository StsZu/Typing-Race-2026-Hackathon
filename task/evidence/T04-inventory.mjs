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

// Оригінальний контент: позначається lang="uk" у розмітці (T06); до T06 — за місцем.
function isOriginal(n, isAttr) {
  if (isAttr) return "";
  if (n.tag !== "html" && n.attrs?.lang === "uk") return "оригінал (lang=\"uk\")";
  if (n.attrs?.id === "player-title" || ancestors(n).some(a => a.attrs?.id === "tracks")) return "назва пісні";
  if (n.parent?.attrs?.class === "podium") return "назва тренажера й ім’я автора";
  return "";
}

// Ключі, задані явно (T06): повідомлення з параметрами, які app.js формує так само.
// Українське джерело таких ключів — locales/uk.json (T07), а не текст HTML.
function override(n, attr) {
  const id = n.attrs?.id, d = n.attrs?.["data-duration"];
  if (!attr) {
    if (n.tag === "button" && d) return { key: "test.durationLabel", params: { seconds: +d } };
    if (id === "test-time" || id === "duration-label") return { key: "test.durationLabel", params: { seconds: 30 } };
    if (id === "saved-week") return { key: "calculator.minutes", params: { minutes: 100 } };
    if (id === "saved-month") return { key: "calculator.hoursMinutes", params: { hours: 6, minutes: 40 } };
    if (id === "progress-label") return { key: "plan.progress", params: { done: 0 } };
    if (id === "current-label") return { key: "calculator.currentLabelWpm" };
    if (id === "target-label") return { key: "calculator.targetLabelWpm" };
    if (id === "volume-label") return { key: "calculator.volumeLabelWords" };
    if (id === "calc-note") return { key: "calculator.result" };
  } else {
    if (id === "player-audio" && attr === "aria-label") return { key: "music.audioLabel", params: { title: "Не гальмуй / Just Type" } };
    if (id === "player-cover" && attr === "alt") return { key: "music.coverAlt", params: { title: "Не гальмуй / Just Type" } };
  }
  return null;
}

// Ключі, уже записані в розмітку, мають пріоритет над обчисленими.
function markedKey(n, attr) {
  if (!attr) return n.attrs?.["data-i18n"] ? { key: n.attrs["data-i18n"], params: n.attrs["data-i18n-params"] ? JSON.parse(n.attrs["data-i18n-params"]) : undefined } : null;
  const map = Object.fromEntries((n.attrs?.["data-i18n-attr"] || "").split(";").filter(Boolean).map(p => p.split(":")));
  return map[attr] ? { key: map[attr], params: n.attrs["data-i18n-params"] ? JSON.parse(n.attrs["data-i18n-params"]) : undefined } : null;
}

// Елементи з id і поля <input> усередині одиниці не перекладаються: у тексті перекладу це {$1}, {$2}…
const isProtected = c => c.tag !== "#text" && (c.tag === "input" || c.attrs.id);

const html = fs.readFileSync("index.html", "utf8");
const tree = parse(html);
const counters = {};
const nextKey = (section, kind) => { const k = `${section}.${kind}`; counters[k] = (counters[k] || 0) + 1; return `${k}${counters[k]}`; };
const rows = [];
const loc = (n, attr) => `index.html <${n.tag}${n.attrs.id ? "#" + n.attrs.id : ""}${!attr && n.attrs.class ? "." + n.attrs.class.split(/\s+/)[0] : ""}>${attr ? " @" + attr : ""}`;

function attrRows(n) {
  for (const attr of ATTRS) {
    const v = n.attrs[attr];
    if (!v || !CYR.test(v)) continue;
    const section = sectionOf(n);
    const fixed = markedKey(n, attr) || override(n, attr);
    let key = fixed?.key;
    if (!key && n.tag === "meta") key = { description: "meta.description", "og:title": "meta.ogTitle", "og:description": "meta.ogDescription" }[n.attrs.name || n.attrs.property];
    if (!key) key = nextKey(section, camel(attr));
    rows.push({ section, key, params: fixed?.params, where: loc(n, attr), type: "атрибут", text: v, note: isOriginal(n, true), node: n, attr });
  }
}

function walk(n) {
  if (n.tag === "#text" || n.tag === "template" || n.tag === "script" || n.tag === "style") return;
  attrRows(n);
  const direct = n.children.some(c => c.tag === "#text" && c.text.trim());
  if (direct && CYR.test(textOf(n))) {
    const section = n.tag === "title" ? "meta" : sectionOf(n);
    const fixed = markedKey(n) || override(n);
    const key = fixed?.key || (n.tag === "title" ? "meta.title" : n.attrs.id ? `${section}.${camel(n.attrs.id)}` : nextKey(section, kindOf(n.tag)));
    let i = 0;
    const text = n.children.map(c => isProtected(c) ? `{$${++i}}` : serialize(c)).join("").trim();
    rows.push({ section, key, params: fixed?.params, where: loc(n), type: "статичний", text, note: isOriginal(n), node: n, protectedCount: i });
    for (const c of n.children) {
      if (isProtected(c)) walk(c);
      else { markCovered(c); if (c.tag !== "#text") walkAttrsOnly(c); }
    }
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
  attrRows(n);
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
  [/^Поточна швидкість/, "calculator.currentLabelWpm", "і `calculator.currentLabelSpm`: T07 розбиває тернарний вираз на два повних речення"],
  [/^Бажана швидкість/, "calculator.targetLabelWpm", "і `calculator.targetLabelSpm`: T07 розбиває тернарний вираз на два повних речення"],
  [/^Обсяг тексту за день/, "calculator.volumeLabelWords", "і `calculator.volumeLabelChars`: T07 розбиває тернарний вираз на два повних речення"],
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

for (const r of rows) if (/^(назва пісні|оригінал|назва тренажера)/.test(r.note) && r.type !== "атрибут") { r.type = "оригінал"; r.key = "— (оригінал)"; }

// Повідомлення з параметрами: у HTML — конкретне значення, шаблон — у locales/uk.json (T07).
for (const r of rows) if (r.params) r.note = `параметри ${JSON.stringify(r.params)}; українське джерело — шаблон у \`locales/uk.json\` (T07)`;

// Позначки для T06: що в одиниці не можна перекладати як звичайний текст.
const addNote = (r, s) => { r.note = r.note ? `${r.note}; ${s}` : s; };
for (const r of rows) {
  if (r.type === "оригінал" || r.type === "дані" || r.type === "вправа") continue;
  if (r.protectedCount) addNote(r, `${r.protectedCount} заповнювач(і) {$n}: вкладені елементи з \`id\` або \`<input>\` не перекладаються`);
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
out.push("Згенеровано скриптом `task/evidence/T04-inventory.mjs` з `index.html`, `app.js`, `catalog.json` за поточним станом файлів. Не редагувати вручну — перегенерувати.");
out.push("");
out.push("Ключі за контрактом плану (`розділ.елемент`). Якщо ключ уже записано в розмітку (`data-i18n`, `data-i18n-attr`, T06), інвентар бере його звідти. Для вкладеної розмітки (`<br>`, `<em>`, `<b>`) одиницею перекладу є весь блок разом з тегами.");
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
out.push("## Розбіжності, які треба вирішити до T07");
out.push("");
out.push("| Що | Факт | Рекомендація |");
out.push("|---|---|---|");
for (const f of FINDINGS) out.push(`| ${f[0]} | ${esc(f[1])} | ${esc(f[2])} |`);
out.push("");
out.push("Інші особливості:");
out.push("");
out.push("- **T07:** `keyboard.keyTip`, `calculator.*Label` і `trainers.tag` містять у шаблоні вкладені тернарні вирази — перед перекладом їх треба розкласти на окремі ключі з параметрами (див. примітки в таблиці `app.js`).");
out.push(`- **Заповнювачі:** ${rows.filter(r => r.protectedCount).length} одиниць містять вкладені елементи з \`id\` або \`<input>\`. У тексті перекладу вони записані як \`{$1}\`, \`{$2}\`…; генератор (T08) підставляє на їхнє місце оригінальну розмітку. Тексти самих вкладених елементів — окремі ключі.`);
out.push(`- **SC-02:** кириличні власні назви на сторінці позначено \`lang="uk"\` (T06); у перекладах назви «Соло», «Гами» тощо треба брати в \`<span lang="uk">\`.`);
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
if (import.meta.url === `file://${process.argv[1]}`) process.stdout.write(out.join("\n"));
export { rows, html, ATTRS };
