// Генерує мовні версії головної сторінки (en/index.html, pl/index.html) з index.html і locales/<lang>.json.
//   node scripts/build-locales.mjs              — зібрати всі мови з locales/
//   node scripts/build-locales.mjs --verify-uk  — зібрати українську з власних рядків і звірити з index.html
//   node scripts/build-locales.mjs --check      — не записувати, а перевірити, що <lang>/index.html збігаються зі збіркою
//   node scripts/build-locales.mjs --pseudo     — псевдолокаль qps/index.html для перевірки верстки (не публікується, у .gitignore)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build, catalogUk, extractUk, getAttr, parse, render, setAttr } from "./i18n-html.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "index.html"), "utf8");
const catalog = catalogUk(JSON.parse(fs.readFileSync(path.join(root, "catalog.json"), "utf8")));
const extraMessages = Object.keys(catalog);

if (process.argv.includes("--verify-uk")) {
  const { statics, messages } = extractUk(source);
  const { html, missing } = build(source, { lang: "uk", dict: { ...statics, ...messages } });
  if (missing.length) throw new Error("Немає ключів: " + missing.join(", "));
  if (html !== source) {
    const i = [...html].findIndex((c, k) => c !== source[k]);
    console.error("Українська збірка відрізняється від index.html з позиції " + i + ":\n" + source.slice(i - 80, i + 80) + "\n---\n" + html.slice(i - 80, i + 80));
    process.exit(1);
  }
  console.log(`uk: збірка збігається з index.html (${Object.keys(statics).length} статичних ключів, ${Object.keys(messages).length} ключів словника)`);
  process.exit(0);
}

if (process.argv.includes("--pseudo")) {
  // Кожен рядок: латиниця з діакритикою замість кирилиці, рамка [ … ] і подовження ≈40 % групами «~~~~» через пробіл
  // (суцільна смуга тильд була б нерозривним «словом», якого в справжніх перекладах немає).
  // Теги, {параметри} і {$n} лишаються недоторканими.
  const LAT = { а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ye", ж: "zh", з: "z", и: "y", і: "i", ї: "yi", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "yu", я: "ya" };
  const ACC = { a: "á", e: "é", i: "î", o: "ö", u: "ü", y: "ý", c: "ç", n: "ñ", s: "š", z: "ž", A: "Á", E: "É", I: "Î", O: "Ö", U: "Ü", Y: "Ý", C: "Ç", N: "Ñ", S: "Š", Z: "Ž" };
  const word = s => s.replace(/[А-Яа-яЇїІіЄєҐґ]/g, c => { const l = LAT[c.toLowerCase()] ?? ""; return c === c.toLowerCase() ? l : l.charAt(0).toUpperCase() + l.slice(1); }).replace(/[a-zA-Z]/g, c => ACC[c] ?? c);
  const pseudo = v => {
    if (typeof v !== "string") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, pseudo(x)]));
    const parts = v.split(/(<[^>]*>|\{\$?\w+\})/);
    const visible = parts.filter((p, i) => i % 2 === 0).join("").length;
    const pad = "~".repeat(Math.max(1, Math.ceil(visible * 0.4))).replace(/(.{4})(?=.)/g, "$1 ");
    return "[" + parts.map((p, i) => i % 2 ? p : word(p)).join("") + " " + pad + "]";
  };
  const { statics, messages } = extractUk(source);
  const dict = Object.fromEntries(Object.entries({ ...statics, ...messages, ...catalog }).map(([k, v]) => [k, pseudo(v)]));
  const { html, missing } = build(source, { lang: "en-XA", dict, prefix: "../", extraMessages });
  if (missing.length) throw new Error("Немає ключів: " + missing.join(", "));
  fs.mkdirSync(path.join(root, "qps"), { recursive: true });
  fs.writeFileSync(path.join(root, "qps", "index.html"), html);
  console.log(`qps: qps/index.html (${Object.keys(dict).length} ключів; лише для розробки, не публікувати)`);
  process.exit(0);
}

// Метадані мовних версій (T11). Базова адреса — <link rel="canonical"> в index.html.
const OG_LOCALE = { uk: "uk_UA", en: "en_US", pl: "pl_PL" };
const base = (source.match(/<link rel="canonical" href="([^"]+)">/) || [])[1];
const pageUrl = lang => base + (lang === "uk" ? "" : lang + "/");
const walk = (n, fn) => (n.children || []).forEach(c => { if (c.type === "el") { fn(c); walk(c, fn); } });
function localizeHead(html, lang) {
  const tree = parse(html);
  walk(tree, el => {
    const rel = getAttr(el, "rel"), prop = getAttr(el, "property");
    if (el.tag === "link" && rel === "canonical") setAttr(el, "href", pageUrl(lang));
    if (el.tag === "meta" && prop === "og:url") setAttr(el, "content", pageUrl(lang));
    if (el.tag === "meta" && prop === "og:locale") setAttr(el, "content", OG_LOCALE[lang]);
    if (el.tag === "meta" && prop === "og:locale:alternate" && getAttr(el, "content") === OG_LOCALE[lang]) setAttr(el, "content", OG_LOCALE.uk);
  });
  return render(tree);
}
// index.html має містити взаємні hreflang і og:locale:alternate саме для зібраних мов — не більше й не менше.
function headTags(langs) {
  return [...["uk", ...langs].map(l => `<link rel="alternate" hreflang="${l}" href="${pageUrl(l)}">`), `<link rel="alternate" hreflang="x-default" href="${pageUrl("uk")}">`, ...langs.map(l => `<meta property="og:locale:alternate" content="${OG_LOCALE[l]}">`)];
}
const presentTags = () => [...source.matchAll(/<link rel="alternate" hreflang="[^"]*" href="[^"]*">|<meta property="og:locale:alternate" content="[^"]*">/g)].map(m => m[0]);

const dir = path.join(root, "locales");
const dictLangs = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => /^[a-z]{2}\.json$/.test(f)).map(f => f.slice(0, 2)).filter(l => l !== "uk") : [];
if (!base) { console.error("index.html: немає <link rel=\"canonical\" href=\"…\">"); process.exit(1); }
// Опубліковані мови — ті, що оголошені в hreflang в index.html. Словник без оголошення — чернетка: не збирається.
const published = [...source.matchAll(/<link rel="alternate" hreflang="([a-z]{2})"/g)].map(m => m[1]).filter(l => l !== "uk");
const present = presentTags();
const expected = published.length ? headTags(published) : [];
if (expected.join("\n") !== present.join("\n")) {
  console.error("index.html: блок hreflang / og:locale:alternate неповний або в іншому порядку для мов: " + (published.join(", ") || "лише uk") + ". Очікується після <link rel=\"canonical\">:\n" + expected.join(""));
  process.exit(1);
}
const noDict = published.filter(l => !dictLangs.includes(l));
if (noDict.length) { console.error("index.html оголошує мови без словника в locales/: " + noDict.join(", ")); process.exit(1); }
for (const l of dictLangs.filter(l => !published.includes(l))) console.log(`${l}: словник є, але мову не опубліковано (немає hreflang) — сторінку не збирано. Щоб опублікувати, вставте після <link rel="canonical">, замінивши наявні:\n${headTags([...published, l]).join("")}`);
const langs = published;
if (!langs.length) { console.log("Опублікованих мов, крім uk, немає — нічого збирати."); process.exit(0); }

let failed = false;
for (const lang of langs) {
  const raw = JSON.parse(fs.readFileSync(path.join(dir, `${lang}.json`), "utf8"));
  const dict = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, v && typeof v === "object" && "text" in v ? v.text : v]));
  const built = build(source, { lang, dict, prefix: "../", extraMessages });
  const { missing } = built;
  const html = localizeHead(built.html, lang);
  if (missing.length) { console.error(`${lang}: немає перекладу для ${missing.length} ключів: ${missing.join(", ")}`); failed = true; continue; }
  const target = path.join(root, lang, "index.html");
  if (process.argv.includes("--check")) {
    const current = fs.existsSync(target) ? fs.readFileSync(target, "utf8") : null;
    if (current !== html) { console.error(`${lang}: ${lang}/index.html ${current === null ? "відсутній" : "застарів"} — запустіть node scripts/build-locales.mjs`); failed = true; }
    else console.log(`${lang}: ${lang}/index.html актуальний`);
    continue;
  }
  fs.mkdirSync(path.join(root, lang), { recursive: true });
  fs.writeFileSync(target, html);
  console.log(`${lang}: ${lang}/index.html`);
}
process.exit(failed ? 1 : 0);
