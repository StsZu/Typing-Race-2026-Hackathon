import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dictionaries = path.join(root, "dictionaries");

function writeJson(file, value) {
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + "\n");
}

function exportAcademy(language, sourceName) {
  const directory = path.join(dictionaries, language, "academy", "typing-race-2026");
  const source = fs.readFileSync(path.join(directory, sourceName), "utf8");
  const assignment = source.indexOf("= {");
  if (assignment === -1) throw new Error(`Не знайдено дані Академії у ${sourceName}`);

  const expression = source.slice(assignment + 1).trim().replace(/;\s*$/, "");
  const course = vm.runInNewContext(`(${expression})`, Object.create(null), { timeout: 1000 });
  writeJson(path.join(directory, "course.json"), course);
}

function walkMarkdown(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkMarkdown(fullPath));
    else if (entry.name.endsWith(".md") && entry.name !== "INDEX.md") files.push(fullPath);
  }
  return files.sort((a, b) => a.localeCompare(b, "uk"));
}

function matchRequired(text, expression, label, file) {
  const match = text.match(expression);
  if (!match) throw new Error(`Не знайдено ${label}: ${path.relative(root, file)}`);
  return match;
}

function parseExercise(file) {
  const text = fs.readFileSync(file, "utf8");
  const title = matchRequired(text, /^# (.+)$/m, "назву вправи", file)[1];
  const course = matchRequired(text, /^\*\*(?:Course|Курс):\*\* (.+)$/m, "курс", file)[1];
  const lesson = matchRequired(text, /^\*\*(?:Lesson|Урок) (\d+):\*\* (.+)$/m, "урок", file);
  const exercise = matchRequired(text, /^\*\*(?:Exercise|Вправа) (\d+)\*\* \(ID: (\d+)\)$/m, "номер вправи", file);
  const body = matchRequired(text, /## (?:Text to type|Текст для набору)\s+```[^\n]*\n([\s\S]*?)\n```/m, "текст вправи", file)[1];

  return {
    id: Number(exercise[2]),
    title,
    course,
    lesson: { number: Number(lesson[1]), title: lesson[2] },
    exercise: Number(exercise[1]),
    text: body,
    source_file: path.relative(path.dirname(path.dirname(file)), file)
  };
}

function exportTutor(language, languageCode) {
  const directory = path.join(dictionaries, language, "tutor", "tt-exercises");
  const exercises = walkMarkdown(directory).map(parseExercise);
  writeJson(path.join(directory, "all-exercises.json"), {
    language: languageCode,
    source: "TT",
    license: "NOT_DECLARED",
    exercise_count: exercises.length,
    exercises
  });
}

exportAcademy("english", "eng.ts");
exportAcademy("ukrainian", "ukr.ts");
exportTutor("english", "en");
exportTutor("ukrainian", "uk");

console.log("OK: створено JSON для Академії та зведені JSON набори вправ.");
