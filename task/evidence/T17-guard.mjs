// T17: запобіжник генератора — збираються лише мови, оголошені в hreflang.
// Запуск з кореня репозиторію: node task/evidence/T17-guard.mjs <тимчасова-тека>
// Наприкінці лишає в теці копію сайту з опублікованою pl для перегляду.
import fs from "node:fs";
import path from "node:path";
import { spawnSync, execFileSync } from "node:child_process";

const dir = process.argv[2];
if (!dir) throw new Error("Вкажи тимчасову теку");
const source = fs.readFileSync("index.html", "utf8");
const block = s => (s.match(/<link rel="alternate" hreflang[\s\S]*?(?=<link rel="stylesheet"|<script|<meta name)/) || [""])[0];
const setup = (html, locales) => {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(path.join(dir, "scripts"), { recursive: true });
  fs.mkdirSync(path.join(dir, "locales"));
  execFileSync("sh", ["-c", `git archive HEAD images | tar -x -C "${dir}"`]);
  for (const f of ["app.js", "style.css", "catalog.js", "catalog.json", "scripts/build-locales.mjs", "scripts/i18n-html.mjs"]) fs.copyFileSync(f, path.join(dir, f));
  for (const l of locales) fs.copyFileSync(`locales/${l}.json`, path.join(dir, "locales", `${l}.json`));
  fs.writeFileSync(path.join(dir, "index.html"), html);
  const r = spawnSync(process.execPath, [path.join(dir, "scripts/build-locales.mjs")], { encoding: "utf8" });
  return { code: r.status, out: (r.stdout + r.stderr).trim().split("\n").map(l => l.slice(0, 110)), built: ["en", "pl"].filter(l => fs.existsSync(path.join(dir, l, "index.html"))) };
};
const withPl = source.replace(/(<link rel="alternate" hreflang="en" href="[^"]+">)/, '$1<link rel="alternate" hreflang="pl" href="https://stszu.github.io/Typing-Race-2026-Hackathon/pl/">').replace(/(<meta property="og:locale:alternate" content="en_US">)/, '$1<meta property="og:locale:alternate" content="pl_PL">');
const results = {
  "1. en опубліковано, pl — чернетка (стан репозиторію)": setup(source, ["en", "pl"]),
  "2. pl оголошено, словника pl немає": setup(withPl, ["en"]),
  "3. блок hreflang неповний (без x-default)": setup(source.replace(/<link rel="alternate" hreflang="x-default" href="[^"]+">/, ""), ["en", "pl"]),
  "4. pl оголошено й словник є (попередній перегляд)": setup(withPl, ["en", "pl"])
};
console.log(JSON.stringify(results, null, 1));
