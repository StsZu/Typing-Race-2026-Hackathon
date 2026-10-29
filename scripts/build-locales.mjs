// Генерує мовні версії головної сторінки (en/index.html, pl/index.html) з index.html і locales/<lang>.json.
//   node scripts/build-locales.mjs              — зібрати всі мови з locales/
//   node scripts/build-locales.mjs --verify-uk  — зібрати українську з власних рядків і звірити з index.html
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
