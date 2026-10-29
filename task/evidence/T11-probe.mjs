// T11: проба метаданих мовних версій у копії репозиторію з пробними словниками.
// Запуск з кореня репозиторію: node task/evidence/T11-probe.mjs <тимчасова-тека>
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { extractUk, sourceHash } from "../../scripts/i18n-html.mjs";

const dir = process.argv[2];
if (!dir) throw new Error("Вкажи тимчасову теку");
const MAP = { а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie", ж: "zh", з: "z", и: "y", і: "i", ї: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "iu", я: "ia" };
const translit = s => s.replace(/[А-Яа-яЇїІіЄєҐґ]/g, c => { const l = MAP[c.toLowerCase()] ?? ""; return c === c.toLowerCase() ? l : l.toUpperCase(); });
const tr = v => typeof v === "string" ? translit(v) : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, translit(x)]));

const source = fs.readFileSync("index.html", "utf8");
const { statics, messages } = extractUk(source);
const dict = Object.fromEntries(Object.entries({ ...statics, ...messages }).map(([k, v]) => [k, { text: tr(v), src: sourceHash(v) }]));
const B = source.match(/<link rel="canonical" href="([^"]+)">/)[1];

const setup = (langs, head) => {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(path.join(dir, "scripts"), { recursive: true });
  fs.mkdirSync(path.join(dir, "locales"));
  for (const f of ["build-locales.mjs", "i18n-html.mjs"]) fs.copyFileSync(path.join("scripts", f), path.join(dir, "scripts", f));
  fs.writeFileSync(path.join(dir, "index.html"), source.replace(/(<link rel="canonical" href="[^"]+">)/, "$1" + head));
  for (const l of langs) fs.writeFileSync(path.join(dir, "locales", `${l}.json`), JSON.stringify(dict));
  return spawnSync(process.execPath, [path.join(dir, "scripts/build-locales.mjs")], { encoding: "utf8" });
};
const headOf = file => {
  const h = fs.readFileSync(file, "utf8");
  const pick = re => [...h.matchAll(re)].map(m => m[1]);
  return {
    lang: pick(/<html lang="([^"]+)"/g)[0],
    canonical: pick(/<link rel="canonical" href="([^"]+)">/g),
    ogUrl: pick(/<meta property="og:url" content="([^"]+)">/g),
    ogLocale: pick(/<meta property="og:locale" content="([^"]+)">/g),
    ogLocaleAlternate: pick(/<meta property="og:locale:alternate" content="([^"]+)">/g),
    hreflang: pick(/<link rel="alternate" (hreflang="[^"]+" href="[^"]+")>/g)
  };
};
const tags = langs => [...["uk", ...langs].map(l => `<link rel="alternate" hreflang="${l}" href="${B}${l === "uk" ? "" : l + "/"}">`), `<link rel="alternate" hreflang="x-default" href="${B}">`, ...langs.map(l => `<meta property="og:locale:alternate" content="${{ en: "en_US", pl: "pl_PL" }[l]}">`)].join("");

const out = [];
let r = setup(["en"], "");
out.push(`A. en без hreflang в index.html: код ${r.status}; підказка містить потрібні теги: ${r.stderr.includes(tags(["en"]))}`);
r = setup(["en"], tags(["en"]));
out.push(`B. en з правильними тегами: код ${r.status}; ${r.stdout.trim()}`);
out.push("   en/index.html: " + JSON.stringify(headOf(path.join(dir, "en/index.html"))));
r = setup(["en"], tags(["en", "pl"]));
out.push(`C. зайвий тег pl, коли зібрано лише en: код ${r.status}`);
r = setup(["en", "pl"], tags(["en", "pl"]));
out.push(`D. en і pl: код ${r.status}`);
out.push("   index.html (uk, без змін): " + JSON.stringify(headOf(path.join(dir, "index.html"))));
out.push("   en/index.html: " + JSON.stringify(headOf(path.join(dir, "en/index.html"))));
out.push("   pl/index.html: " + JSON.stringify(headOf(path.join(dir, "pl/index.html"))));
console.log(out.join("\n"));
