() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
  const sample = () => $('#sample').textContent.slice(0, 48);
  const state = () => ({ textLang: $$('[data-text-lang]').filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.dataset.textLang).join(), sampleLang: $('#sample').lang, typingLang: $('#typing').lang, sample: sample(), status: $('#test-status').textContent, duration: $('#duration-label').textContent });
  const out = { page: document.documentElement.lang, groupLabel: $('[data-text-lang]').parentElement.getAttribute('aria-label'), buttons: $$('[data-text-lang]').map(b => `${b.textContent}@${b.lang}`), initial: state() };
  // Рівнозначність лапок і апострофів (C5).
  out.quotes = ['“', '”', '„', '«', '»', '"'].map(q => `${q}=${sameChar(q, '"')}`).join(' ') + ' | ' + ["’", "ʼ", "‘", "'"].map(q => `${q}=${sameChar(q, "'")}`).join(' ') + ' | a≠" ' + !sameChar('a', '"');
  const other = $$('[data-text-lang]').find(b => b.getAttribute('aria-pressed') !== 'true');
  const ta = $('#typing'); ta.value = $('#sample').textContent.slice(0, 5); fire(ta, 'input');
  out.afterTyping = { status: $('#test-status').textContent, correct: $('#characters').textContent };
  other.click();
  out.afterSwitch = { ...state(), typingCleared: $('#typing').value === '', characters: $('#characters').textContent };
  ta.value = $('#sample').textContent.slice(0, 7); fire(ta, 'input');
  out.typingOther = { characters: $('#characters').textContent, accuracy: $('#accuracy').textContent };
  $('[data-duration="60"]').click();
  out.after60 = state();
  const de = document.documentElement; out.scrollWidth = de.scrollWidth; out.viewport = de.clientWidth;
  return out;
}
