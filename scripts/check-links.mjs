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
    else if (entry.name.endsWith(".md") || entry.name.endsWith(".html")) files.push(fullPath);
  }
}

walk(root);

const failures = [];
const external = /^(?:[a-z]+:|\/\/)/i;

function checkTarget(sourceFile, rawTarget) {
  const target = rawTarget.trim().replace(/^<|>$/g, "").split(/\s+["']/)[0];
  if (!target || target.startsWith("#") || external.test(target)) return;
  const cleanTarget = decodeURIComponent(target.split("#")[0].split("?")[0]);
  const resolved = path.resolve(path.dirname(sourceFile), cleanTarget);
  if (!fs.existsSync(resolved)) {
    failures.push(path.relative(root, sourceFile) + " -> " + target);
  }
}

for (const file of files) {
  const content = fs.readFileSync(file, "utf8");
  if (file.endsWith(".html")) {
    for (const match of content.matchAll(/\bhref\s*=\s*["']([^"']+)["']/gi)) {
      checkTarget(file, match[1]);
    }
  } else {
    for (const match of content.matchAll(/!?\[[^\]]*]\(([^)]+)\)/g)) {
      checkTarget(file, match[1]);
    }
  }
}

if (failures.length) {
  console.error("Не знайдено локальні посилання:\n" + failures.join("\n"));
  process.exit(1);
}

console.log("OK: перевірено локальні посилання у " + files.length + " файлах.");
