// T13: копія сайту з hreflang для uk, en, pl і зібраними en/, pl/ для перевірки перемикача й шапки.
// pl — заглушка лише для ширини шапки: англійський словник з польськими підписами навігації й бренду.
// Запуск з кореня репозиторію: node task/evidence/T13-site.mjs <тимчасова-тека>
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const out = process.argv[2];
if (!out) throw new Error("Вкажи теку для копії сайту");
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, "scripts"), { recursive: true });
fs.mkdirSync(path.join(out, "locales"));
execFileSync("sh", ["-c", `git archive HEAD images | tar -x -C "${out}"`]);
for (const f of ["app.js", "style.css", "catalog.js", "catalog.json", "scripts/build-locales.mjs", "scripts/i18n-html.mjs", "locales/en.json"]) fs.copyFileSync(f, path.join(out, f));

const source = fs.readFileSync("index.html", "utf8");
const B = source.match(/<link rel="canonical" href="([^"]+)">/)[1];
const tags = ["uk", "en", "pl"].map(l => `<link rel="alternate" hreflang="${l}" href="${B}${l === "uk" ? "" : l + "/"}">`).join("") + `<link rel="alternate" hreflang="x-default" href="${B}"><meta property="og:locale:alternate" content="en_US"><meta property="og:locale:alternate" content="pl_PL">`;
fs.writeFileSync(path.join(out, "index.html"), source.replace(/(<link rel="canonical" href="[^"]+">)/, "$1" + tags));

const pl = JSON.parse(fs.readFileSync("locales/en.json", "utf8"));
Object.assign(pl, Object.fromEntries(Object.entries({
  "nav.link1": "<span class=\"logo\">t<span>_</span></span>pisanie bezwzrokowe<span class=\"edition\">/ 2026</span>",
  "nav.link2": "Jak to działa", "nav.link3": "Szybki test", "nav.link4": "Aplikacje", "nav.link5": "Plan nauki", "nav.link6": "Muzyka"
}).map(([k, v]) => [k, { ...pl[k], text: v }])));
fs.writeFileSync(path.join(out, "locales/pl.json"), JSON.stringify(pl));
console.log(execFileSync(process.execPath, [path.join(out, "scripts/build-locales.mjs")], { encoding: "utf8" }).trim());
