// Перевіряє словники мовних версій головної сторінки.
//   node scripts/check-i18n.mjs                         — українська основа й усі locales/<lang>.json
//   node scripts/check-i18n.mjs --release               — застарілі переклади теж є помилкою
//   node scripts/check-i18n.mjs --dict <файл> --lang <xx> — перевірити окремий словник
// Небажані терміни й очікувані форми множини беруться з task/glossary.md (розділи 2 і 5).
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build, extractUk, format, getAttr, parse, sourceHash } from "./i18n-html.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opt = name => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
const release = args.includes("--release");
const CYR = /[А-Яа-яЇїІіЄєҐґ]/;

const source = fs.readFileSync(path.join(root, "index.html"), "utf8");
const uk = extractUk(source);
const ukDict = { ...uk.statics, ...uk.messages };
const errors = [], warnings = [];
const err = (lang, msg) => errors.push(`${lang}: ${msg}`);
const warn = (lang, msg) => warnings.push(`${lang}: ${msg}`);

// Глосарій.
const glossary = fs.readFileSync(path.join(root, "task/glossary.md"), "utf8");
const section = n => glossary.split(/^## /m).find(s => s.startsWith(`${n}.`)) || "";
const cells = line => line.split(/(?<!\\)\|/).slice(1, -1).map(c => c.trim().replace(/\\\|/g, "|"));
const forbidden = section(2).split("\n").filter(l => /^\|[^-]/.test(l)).map(cells).filter(c => /^`.+`$/.test(c[2] || "")).map(c => new RegExp(c[2].slice(1, -1), "iu"));
if (!forbidden.length) err("glossary", "не знайдено шаблонів небажаних термінів у розділі 2");
const pluralRows = Object.fromEntries(section(5).split("\n").filter(l => /^\| [^-|]+\(\w\w\) \|/.test(l)).map(cells).map(c => [c[0], c.slice(1, 5)]));
// Ключ із числом → слово з таблиці форм множини для кожної мови.
const PLURAL_SAMPLES = { "test.durationLabel": { uk: "секунда (uk)", en: "second (en)", pl: "sekunda (pl)" } };
const SAMPLE_NUMBERS = [1, 2, 5, 22];

const paramsOf = v => new Set((typeof v === "string" ? [v] : Object.values(v || {})).flatMap(s => [...String(s).matchAll(/\{(\$?\w+)\}/g)].map(m => m[1])));
const textsOf = v => typeof v === "string" ? [v] : Object.values(v || {});
const stripUkSpans = s => s.replace(/<span lang="uk">[\s\S]*?<\/span>/g, "");

function checkTerms(lang, dict) {
  for (const [key, v] of Object.entries(dict)) for (const t of textsOf(v)) for (const re of forbidden) if (re.test(stripUkSpans(String(t)))) err(lang, `небажаний термін /${re.source}/ у ${key}: «${t}»`);
}

function checkPlurals(lang, dict) {
  for (const [key, rows] of Object.entries(PLURAL_SAMPLES)) {
    if (!(key in dict) || !rows[lang]) continue;
    const expected = pluralRows[rows[lang]];
    if (!expected) { err(lang, `у глосарії немає рядка «${rows[lang]}» для ${key}`); continue; }
    const param = [...paramsOf(ukDict[key])][0];
    SAMPLE_NUMBERS.forEach((n, i) => { const got = format(dict[key], { [param]: n }, lang); if (got !== expected[i]) err(lang, `множина ${key} для ${n}: «${got}», очікується «${expected[i]}» (глосарій, розділ 5)`); });
  }
}

// Кирилиця на зібраній сторінці поза шаблонами, елементами з lang="uk" і значеннями параметрів-назв.
function checkLeaks(lang, html) {
  const walk = (n, skip) => {
    for (const c of n.children || []) {
      if (c.type === "raw") { if (!skip && CYR.test(c.raw)) err(lang, `кирилиця на сторінці: «${c.raw.trim().slice(0, 60)}»`); continue; }
      if (c.type !== "el") continue;
      const params = getAttr(c, "data-i18n-params");
      const paramValues = params ? Object.values(JSON.parse(params)).filter(v => typeof v === "string") : [];
      for (const a of ["alt", "aria-label", "content", "placeholder", "title"]) {
        let v = getAttr(c, a);
        if (!v || skip || getAttr(c, "lang") === "uk") continue;
        for (const p of paramValues) v = v.split(p).join("");
        if (CYR.test(v)) err(lang, `кирилиця в @${a}: «${getAttr(c, a).slice(0, 60)}»`);
      }
      if (c.tag === "script" && getAttr(c, "id") === "i18n-messages") {
        for (const [k, v] of Object.entries(JSON.parse(c.children.map(x => x.raw).join("")))) for (const t of textsOf(v)) if (CYR.test(stripUkSpans(String(t)))) err(lang, `кирилиця у словнику для app.js, ${k}: «${String(t).slice(0, 60)}»`);
        continue;
      }
      walk(c, skip || c.tag === "template" || getAttr(c, "lang") === "uk");
    }
  };
  walk(parse(html), false);
}

function checkLocale(lang, raw) {
  const dict = {};
  for (const [key, entry] of Object.entries(raw)) {
    if (!entry || typeof entry !== "object" || !("text" in entry)) { err(lang, `${key}: запис має бути {"text", "src"}`); continue; }
    dict[key] = entry.text;
    if (!(key in ukDict)) { warn(lang, `зайвий ключ ${key} (немає в українській основі)`); continue; }
    if (entry.src !== sourceHash(ukDict[key])) (release ? err : warn)(lang, `застарілий переклад ${key}: українське джерело змінилося (src ${entry.src}, зараз ${sourceHash(ukDict[key])})`);
  }
  const categories = new Intl.PluralRules(lang).resolvedOptions().pluralCategories;
  for (const [key, ukValue] of Object.entries(ukDict)) {
    if (!(key in dict)) { err(lang, `немає ключа ${key}`); continue; }
    const v = dict[key];
    if (textsOf(v).some(t => typeof t !== "string" || !t.trim())) err(lang, `порожній переклад ${key}`);
    if (typeof ukValue === "object") {
      if (typeof v !== "object") err(lang, `${key}: потрібні форми множини ${categories.join(", ")}`);
      else for (const c of categories) if (!(c in v)) err(lang, `${key}: немає форми множини «${c}»`);
    }
    const want = [...paramsOf(ukValue)].sort().join(","), got = [...paramsOf(v)].sort().join(",");
    if (want !== got) err(lang, `${key}: параметри {${got}} замість {${want}}`);
  }
  checkTerms(lang, dict);
  checkPlurals(lang, dict);
  const { html, missing } = build(source, { lang, dict, prefix: "../" });
  if (!missing.length) checkLeaks(lang, html);
}

// Українська основа: терміни, форми множини, статичний HTML = словник для спільних ключів.
checkTerms("uk", ukDict);
checkPlurals("uk", ukDict);
for (const u of uk.uses) if (u.key in uk.messages && format(uk.messages[u.key], u.params) !== u.text) err("uk", `${u.key}: текст у HTML «${u.text}» ≠ словник «${format(uk.messages[u.key], u.params)}»`);

const targets = opt("--dict") ? [[opt("--lang"), opt("--dict")]] : (fs.existsSync(path.join(root, "locales")) ? fs.readdirSync(path.join(root, "locales")).filter(f => /^[a-z]{2}\.json$/.test(f) && f !== "uk.json").map(f => [f.slice(0, 2), path.join(root, "locales", f)]) : []);
for (const [lang, file] of targets) {
  if (!lang) throw new Error("--dict потребує --lang");
  checkLocale(lang, JSON.parse(fs.readFileSync(file, "utf8")));
}

for (const w of warnings) console.log("попередження  " + w);
for (const e of errors) console.log("помилка       " + e);
console.log(`Перевірено: uk${targets.length ? ", " + targets.map(t => t[0]).join(", ") : ""}. Ключів в основі: ${Object.keys(ukDict).length}. Помилок: ${errors.length}, попереджень: ${warnings.length}.`);
process.exit(errors.length ? 1 : 0);
