// T06: записати ключі перекладу в index.html як атрибути data-i18n, data-i18n-attr, data-i18n-params
// і позначити кириличний оригінальний контент lang="uk". Лише вставляє атрибути в початкові теги.
// Запуск з кореня репозиторію: node task/evidence/T06-mark.mjs [--write]
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { rows, html } from "./T04-inventory.mjs";

const keysOf = list => list.filter(r => r.node).map(r => `${r.where} => ${r.key}${r.params ? " " + JSON.stringify(r.params) : ""}`).sort();
const before = keysOf(rows);

const perNode = new Map();
const slot = n => perNode.get(n) || (perNode.set(n, { node: n, text: null, attrs: [], params: null, lang: false }), perNode.get(n));
for (const r of rows) {
  if (!r.node) continue;
  const s = slot(r.node);
  if (r.type === "оригінал") { if (r.node.attrs.lang !== "uk") s.lang = true; continue; }
  if (r.type === "атрибут") { if (!(r.node.attrs["data-i18n-attr"] || "").includes(`${r.attr}:`)) s.attrs.push(`${r.attr}:${r.key}`); }
  else if (!r.node.attrs["data-i18n"]) s.text = r.key;
  if (r.params && !r.node.attrs["data-i18n-params"]) s.params = { ...(s.params || {}), ...r.params };
}

const inserts = [];
for (const s of perNode.values()) {
  let add = "";
  if (s.text) add += ` data-i18n="${s.text}"`;
  if (s.attrs.length) add += ` data-i18n-attr="${s.attrs.join(";")}"`;
  if (s.params) add += ` data-i18n-params='${JSON.stringify(s.params)}'`;
  if (s.lang) add += ` lang="uk"`;
  if (!add) continue;
  const n = s.node;
  if (/["']/.test(JSON.stringify(s.params || {}).replace(/"/g, "")) ) throw new Error("лапки в параметрах " + n.open);
  const at = n.start + n.open.length - (n.open.endsWith("/>") ? 2 : 1);
  inserts.push({ at, add });
}
inserts.sort((a, b) => b.at - a.at);
let out = html;
for (const i of inserts) out = out.slice(0, i.at) + i.add + out.slice(i.at);

// Перевірка 1: прибрати вставки (у зворотному порядку від початку файлу) — має вийти оригінал байт-у-байт.
let restored = out;
let shift = 0;
for (const i of [...inserts].reverse()) { restored = restored.slice(0, i.at + shift) + restored.slice(i.at + shift + i.add.length); }
const identical = restored === html;

const report = { inserts: inserts.length, textKeys: [...perNode.values()].filter(s => s.text).length, attrKeys: [...perNode.values()].reduce((n, s) => n + s.attrs.length, 0), withParams: [...perNode.values()].filter(s => s.params).length, langUk: [...perNode.values()].filter(s => s.lang).length, restoredIdentical: identical };

if (process.argv.includes("--write")) {
  if (!identical) throw new Error("відновлений файл не збігається з оригіналом");
  fs.writeFileSync("index.html", out);
  // Перевірка 2: інвентар, побудований з нової розмітки, дає ті самі ключі на тих самих місцях.
  const after = JSON.parse(execFileSync(process.execPath, ["--input-type=module", "-e", `import { rows } from "./task/evidence/T04-inventory.mjs"; console.log(JSON.stringify(rows.filter(r => r.node).map(r => r.where.replace(/ (data-i18n|lang)[^>]*/g, "") + " => " + r.key + (r.params ? " " + JSON.stringify(r.params) : "")).sort()))`], { encoding: "utf8" }));
  report.keysStable = JSON.stringify(after) === JSON.stringify(before);
  if (!report.keysStable) report.keyDiff = { onlyBefore: before.filter(x => !after.includes(x)), onlyAfter: after.filter(x => !before.includes(x)) };
  fs.writeFileSync("task/evidence/T06-keys.txt", before.join("\n") + "\n");
}
console.log(JSON.stringify(report, null, 1));
