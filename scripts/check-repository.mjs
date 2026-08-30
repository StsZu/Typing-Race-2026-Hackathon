import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ignored = new Set([".git", "_local"]);
const files = [];

function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(fullPath);
    else files.push(fullPath);
  }
}

walk(root);

const legacyLabel = ["rata", "type"].join("");
const legacyFiles = [];
let jsonCount = 0;

for (const file of files) {
  if (path.basename(file) === ".DS_Store") {
    throw new Error("Службовий файл у публічній структурі: " + path.relative(root, file));
  }
  const buffer = fs.readFileSync(file);
  const text = buffer.toString("utf8");
  if (text.toLowerCase().includes(legacyLabel)) legacyFiles.push(path.relative(root, file));
  if (file.endsWith(".json")) {
    JSON.parse(text);
    jsonCount += 1;
  }
}

if (legacyFiles.length) {
  throw new Error("Знайдено застаріле позначення у:\n" + legacyFiles.join("\n"));
}

const manifest = fs.readFileSync(path.join(root, "dictionaries", "manifest.yml"), "utf8");
if (manifest.includes("/Users/") || !manifest.includes("schema_version: 2")) {
  throw new Error("Маніфест містить локальний шлях або неправильну версію схеми.");
}

const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
if (/tt-exercises|dictionaries\//i.test(gitignore)) {
  throw new Error("Словники TT або весь каталог dictionaries не можна додавати до gitignore.");
}

const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
for (const tag of ["header", "nav", "main", "section", "footer"]) {
  if (!new RegExp("<" + tag + "\\b", "i").test(html)) throw new Error("В index.html немає <" + tag + ">.");
}

const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(match => match[1]);
const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
if (duplicates.length) throw new Error("Повторювані id: " + [...new Set(duplicates)].join(", "));

console.log("OK: " + files.length + " файлів, " + jsonCount + " JSON, структура HTML і правила Git.");
