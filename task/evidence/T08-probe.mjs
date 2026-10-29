// T08: проба генератора на транслітерованому словнику (lang=en) у копії сайту.
// Запуск з кореня репозиторію: node task/evidence/T08-probe.mjs <тимчасова-тека>
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { build, extractUk, parse, getAttr } from "../../scripts/i18n-html.mjs";

const out = process.argv[2];
if (!out) throw new Error("Вкажи теку для копії сайту");
const MAP = { а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie", ж: "zh", з: "z", и: "y", і: "i", ї: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "iu", я: "ia" };
const translit = s => s.replace(/[А-Яа-яЇїІіЄєҐґ]/g, c => { const l = MAP[c.toLowerCase()] ?? ""; return c === c.toLowerCase() ? l : l.toUpperCase(); });
// Тексти поза тегами транслітеруються; тег із lang="uk" і його вміст лишаються (так перекладач позначає кириличні назви).
const tr = v => typeof v === "string" ? "⟦" + v.split(/(<[^>]*>)/).map((p, i) => i % 2 ? p : translit(p)).join("") + "⟧" : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, tr(x)]));

const source = fs.readFileSync("index.html", "utf8");
const { statics, messages } = extractUk(source);
const dict = Object.fromEntries(Object.entries({ ...statics, ...messages }).map(([k, v]) => [k, tr(v)]));
const { html, missing } = build(source, { lang: "en", dict, prefix: "../" });

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, "en"), { recursive: true });
execFileSync("sh", ["-c", `git archive HEAD index.html style.css catalog.js images media | tar -x -C "${out}"`]);
fs.copyFileSync("app.js", path.join(out, "app.js"));
fs.copyFileSync("index.html", path.join(out, "index.html"));
fs.writeFileSync(path.join(out, "en", "index.html"), html);

// Статичні перевірки згенерованої сторінки.
const tree = parse(html);
const leaks = [], unprefixed = [];
const walk = (n, skip) => {
  for (const c of n.children || []) {
    if (c.type === "raw") { if (!skip && /[А-Яа-яЇїІіЄєҐґ]/.test(c.raw)) leaks.push(c.raw.trim().slice(0, 60)); continue; }
    if (c.type !== "el") continue;
    for (const a of ["src", "href", "data-src", "data-cover"]) { const v = getAttr(c, a); if (v && !/^(#|\/|\.\.\/|[a-z][a-z0-9+.-]*:)/i.test(v)) unprefixed.push(`${a}=${v}`); }
    for (const a of ["alt", "aria-label", "content", "placeholder", "title"]) { const v = getAttr(c, a); if (v && !skip && getAttr(c, "lang") !== "uk" && /[А-Яа-яЇїІіЄєҐґ]/.test(v)) leaks.push(`@${a}=${v.slice(0, 50)}`); }
    walk(c, skip || c.tag === "template" || getAttr(c, "lang") === "uk");
  }
};
walk(tree, false);
const result = {
  missing: missing.length,
  textUnitsTranslated: (html.match(/data-i18n="[^"]*"[^>]*>⟦/g) || []).length,
  textUnitsTotal: (html.match(/data-i18n="/g) || []).length,
  paramsRendered: ["⟦30 sekund⟧", "⟦60 sekund⟧", "⟦100 khv⟧", "⟦6 hod 40 khv⟧", "⟦0 / 30 dniv⟧"].map(s => s + ": " + html.includes(s)),
  protectedKept: ["id=\"saved-week\"", "id=\"timer\"", "id=\"duration-label\"", "name=\"calc-unit\" value=\"spm\""].map(s => s + ": " + html.includes(s)),
  htmlLang: (html.match(/<html[^>]*>/) || [])[0],
  messagesTranslated: JSON.parse(html.match(/id="i18n-messages">([\s\S]*?)<\/script>/)[1])["keyboard.space"],
  cyrillicLeaks: leaks,
  unprefixedUrls: unprefixed
};
console.log(JSON.stringify(result, null, 1));
