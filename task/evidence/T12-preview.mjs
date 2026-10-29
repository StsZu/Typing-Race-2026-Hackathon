// T12: зібрати en з locales/en.json у копію сайту для перегляду (без публікації й без hreflang).
// Запуск з кореня репозиторію: node task/evidence/T12-preview.mjs <тимчасова-тека>
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { build } from "../../scripts/i18n-html.mjs";

const out = process.argv[2];
if (!out) throw new Error("Вкажи теку для копії сайту");
const raw = JSON.parse(fs.readFileSync("locales/en.json", "utf8"));
const dict = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, v.text]));
const { html, missing } = build(fs.readFileSync("index.html", "utf8"), { lang: "en", dict, prefix: "../" });
if (missing.length) throw new Error("Немає ключів: " + missing.join(", "));
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, "en"), { recursive: true });
execFileSync("sh", ["-c", `git archive HEAD style.css catalog.js images | tar -x -C "${out}"`]);
for (const f of ["index.html", "app.js", "style.css"]) fs.copyFileSync(f, path.join(out, f));
fs.writeFileSync(path.join(out, "en", "index.html"), html);
console.log(`en: ${path.join(out, "en", "index.html")}`);
