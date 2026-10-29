// Генерує мовні версії головної сторінки (en/index.html, pl/index.html) з index.html і locales/<lang>.json.
//   node scripts/build-locales.mjs              — зібрати всі мови з locales/
//   node scripts/build-locales.mjs --verify-uk  — зібрати українську з власних рядків і звірити з index.html
//   node scripts/build-locales.mjs --pseudo     — псевдолокаль qps/index.html для перевірки верстки (не публікується, у .gitignore)
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build, extractUk } from "./i18n-html.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = fs.readFileSync(path.join(root, "index.html"), "utf8");

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
  const dict = Object.fromEntries(Object.entries({ ...statics, ...messages }).map(([k, v]) => [k, pseudo(v)]));
  const { html, missing } = build(source, { lang: "en-XA", dict, prefix: "../" });
  if (missing.length) throw new Error("Немає ключів: " + missing.join(", "));
  fs.mkdirSync(path.join(root, "qps"), { recursive: true });
  fs.writeFileSync(path.join(root, "qps", "index.html"), html);
  console.log(`qps: qps/index.html (${Object.keys(dict).length} ключів; лише для розробки, не публікувати)`);
  process.exit(0);
}

const dir = path.join(root, "locales");
const langs = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => /^[a-z]{2}\.json$/.test(f)).map(f => f.slice(0, 2)).filter(l => l !== "uk") : [];
if (!langs.length) { console.log("У locales/ немає словників en/pl — нічого збирати."); process.exit(0); }

let failed = false;
for (const lang of langs) {
  const raw = JSON.parse(fs.readFileSync(path.join(dir, `${lang}.json`), "utf8"));
  const dict = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, v && typeof v === "object" && "text" in v ? v.text : v]));
  const { html, missing } = build(source, { lang, dict, prefix: "../" });
  if (missing.length) { console.error(`${lang}: немає перекладу для ${missing.length} ключів: ${missing.join(", ")}`); failed = true; continue; }
  fs.mkdirSync(path.join(root, lang), { recursive: true });
  fs.writeFileSync(path.join(root, lang, "index.html"), html);
  console.log(`${lang}: ${lang}/index.html`);
}
process.exit(failed ? 1 : 0);
