// T09: самоперевірка scripts/check-i18n.mjs — правильний пробний словник проходить,
// кожна навмисна помилка дає ненульовий код виходу й очікуване повідомлення.
// Запуск з кореня репозиторію: node task/evidence/T09-selftest.mjs <тимчасова-тека>
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { extractUk, sourceHash } from "../../scripts/i18n-html.mjs";

const dir = process.argv[2];
if (!dir) throw new Error("Вкажи тимчасову теку");
fs.mkdirSync(dir, { recursive: true });

const MAP = { а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie", ж: "zh", з: "z", и: "y", і: "i", ї: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "", ю: "iu", я: "ia" };
const translit = s => s.replace(/[А-Яа-яЇїІіЄєҐґ]/g, c => { const l = MAP[c.toLowerCase()] ?? ""; return c === c.toLowerCase() ? l : l.toUpperCase(); });

const { statics, messages } = extractUk(fs.readFileSync("index.html", "utf8"));
const uk = { ...statics, ...messages };
const valid = {};
for (const [k, v] of Object.entries(uk)) valid[k] = { text: typeof v === "string" ? translit(v) : null, src: sourceHash(v) };
valid["test.durationLabel"].text = { one: "{seconds} second", other: "{seconds} seconds" };
valid["test.statusReady"].text = { one: "Type for {seconds} second. The timer starts with the first character.", other: "Type for {seconds} seconds. The timer starts with the first character." };

const clone = () => JSON.parse(JSON.stringify(valid));
const withKey = re => Object.keys(valid).find(k => re.test(typeof valid[k].text === "string" ? valid[k].text : ""));
const cases = [
  ["правильний словник", d => d, 0, /Помилок: 0/],
  ["кирилична назва в <span lang=\"uk\">", d => { d["trainers.text1"].text = 'Results: <span lang="uk">Соло</span>'; return d; }, 0, /Помилок: 0/],
  ["застарілий переклад без --release", d => { d["hero.text3"].src = "00000000"; return d; }, 0, /попередження .*застарілий переклад hero\.text3/],
  ["застарілий переклад з --release", d => { d["hero.text3"].src = "00000000"; return d; }, 1, /помилка .*застарілий переклад hero\.text3/, ["--release"]],
  ["немає ключа", d => { delete d["nav.link2"]; return d; }, 1, /немає ключа nav\.link2/],
  ["порожній переклад", d => { d["nav.link3"].text = " "; return d; }, 1, /порожній переклад nav\.link3/],
  ["запис не у форматі {text, src}", d => { d["nav.link4"] = "Trainers"; return d; }, 1, /nav\.link4: запис має бути/],
  ["втрачено параметр {title}", d => { d["music.audioLabel"].text = "Song"; return d; }, 1, /music\.audioLabel: параметри \{\} замість \{title\}/],
  ["втрачено заповнювач {$1}", d => { const k = withKey(/\{\$1\}/); d[k].text = d[k].text.replace("{$1}", ""); return d; }, 1, /параметри .* замість \{\$1\}/],
  ["небажаний термін", d => { d["hero.text3"].text = "Learn blind typing today."; return d; }, 1, /небажаний термін .*hero\.text3/],
  ["кирилиця в статичному тексті", d => { d["nav.link5"].text = "План навчання"; return d; }, 1, /кирилиця на сторінці: «План навчання»/],
  ["кирилиця в атрибуті", d => { d["test.placeholder1"].text = "Натисни тут"; return d; }, 1, /кирилиця в @placeholder/],
  ["кирилиця у словнику для app.js", d => { d["keyboard.space"].text = "пробіл"; return d; }, 1, /кирилиця у словнику для app\.js, keyboard\.space/],
  ["немає форми множини one", d => { delete d["test.durationLabel"].text.one; return d; }, 1, /test\.durationLabel: немає форми множини «one»/],
  ["неправильна форма множини", d => { d["test.durationLabel"].text.other = "{seconds} secs"; return d; }, 1, /множина test\.durationLabel для 2: «2 secs», очікується «2 seconds»/]
];

const results = [];
cases.forEach(([name, mutate, wantExit, wantMsg, extra = []], i) => {
  const file = path.join(dir, `case-${i}.json`);
  fs.writeFileSync(file, JSON.stringify(mutate(clone()), null, 1));
  const r = spawnSync(process.execPath, ["scripts/check-i18n.mjs", "--dict", file, "--lang", "en", ...extra], { encoding: "utf8" });
  const ok = r.status === wantExit && wantMsg.test(r.stdout);
  results.push(`${ok ? "OK  " : "FAIL"} ${name}: код ${r.status} (очікується ${wantExit})${ok ? "" : "\n     " + r.stdout.trim().split("\n").slice(-4).join("\n     ")}`);
});
console.log(results.join("\n"));
const failed = results.filter(r => r.startsWith("FAIL")).length;
console.log(`\n${cases.length - failed}/${cases.length} випадків пройшли`);
process.exit(failed ? 1 : 0);
