// T15 / FR-08: метрики текстів швидкісного тесту з app.js (passages).
// Запуск з кореня репозиторію: node task/evidence/T15-metrics.mjs > task/evidence/T15-metrics.md
import fs from "node:fs";

const js = fs.readFileSync("app.js", "utf8");
const literal = js.match(/const passages=(\{[\s\S]*?\});/)[1];
const passages = Function(`return ${literal}`)();
// Символи, що на розкладці мови потребують Shift (крім великих літер). Апостроф ЙЦУКЕН залежить від варіанта розкладки ОС — рахується окремо.
const SHIFT = { uk: /[,!?:;"«»“”„]/u, en: /[!?:"“”„«»]/u, pl: /[!?:"“”„«»]/u };
// Літери, що на розкладці мови набираються з AltGr (Windows) або Option (macOS «Polish Pro»).
const ALTGR = { uk: /$^/, en: /$^/, pl: /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/u };
const LAYOUT_DEPENDENT = { uk: /['’ʼ]/u, en: /$^/, pl: /$^/ };
const pct = (a, b) => (100 * a / b).toFixed(1) + " %";

const rows = Object.entries(passages).map(([lang, raw]) => {
  const text = raw.trimEnd();
  const chars = [...text];
  const nonSpace = chars.filter(c => !/\s/.test(c));
  const words = text.split(/\s+/).filter(Boolean);
  const letters = words.map(w => [...w].filter(c => /\p{L}/u.test(c)).length);
  const upper = chars.filter(c => /\p{Lu}/u.test(c)).length;
  const punct = chars.filter(c => /\p{P}/u.test(c)).length;
  const shift = chars.filter(c => SHIFT[lang].test(c)).length;
  const altgr = chars.filter(c => ALTGR[lang].test(c)).length;
  const dependent = chars.filter(c => LAYOUT_DEPENDENT[lang].test(c)).length;
  return { lang, chars: chars.length, words: words.length, sentences: (text.match(/[.!?](\s|$)/g) || []).length, avgWord: (letters.reduce((a, b) => a + b, 0) / words.length).toFixed(2), upper: pct(upper, nonSpace.length), punct: pct(punct, nonSpace.length), modifier: pct(upper + shift, nonSpace.length), altgr: pct(altgr, nonSpace.length), dependent };
});

const out = [
  "# Метрики текстів швидкісного тесту (FR-08)",
  "",
  "Згенеровано `task/evidence/T15-metrics.mjs` з `passages` в `app.js`. Тест повторює текст 12 разів; метрики — для одного повтору.",
  "",
  "| Мова | Символів | Слів | Речень | Середня довжина слова, літер | Великі літери | Розділові знаки | Символи з Shift | Символи з AltGr | Залежать від розкладки ОС |",
  "|---|---|---|---|---|---|---|---|---|---|",
  ...rows.map(r => `| ${r.lang} | ${r.chars} | ${r.words} | ${r.sentences} | ${r.avgWord} | ${r.upper} | ${r.punct} | ${r.modifier} | ${r.altgr} | ${r.dependent} |`),
  "",
  "Частки — від символів без пробілів. «Символи з Shift» — великі літери та розділові знаки, що на розкладці мови набираються з Shift (на ЙЦУКЕН це, зокрема, кома). «Символи з AltGr» — польські літери з діакритикою (ą ć ę ł ń ó ś ź ż), що на розкладці програміста потребують AltGr (у macOS «Polish Pro» — Option). Апостроф на ЙЦУКЕН залежить від варіанта розкладки ОС і рахується окремо. Тексти приблизно зіставні, але швидкість на різних текстах не є ідеально порівнянною (пропозиція, розділ 6)."
];
process.stdout.write(out.join("\n") + "\n");
