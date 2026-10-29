() => {
  const $ = s => document.querySelector(s);
  const ta = $('#typing');
  const type = v => { $('#restart').click(); ta.value = v; ta.dispatchEvent(new Event('input', { bubbles: true })); return { chars: $('#characters').textContent, accuracy: $('#accuracy').textContent, wrong: document.querySelectorAll('#sample .wrong').length }; };
  [...document.querySelectorAll('[data-text-lang]')].find(b => b.dataset.textLang === 'pl').click();
  const sample = $('#sample').textContent;
  const first = sample.slice(0, 50);
  const decomposed = first.normalize('NFD');
  return {
    textLang: [...document.querySelectorAll('[data-text-lang]')].filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.dataset.textLang).join(),
    sampleLang: $('#sample').lang,
    sampleStart: first,
    precomposed: type(first),
    decomposedLength: [first.length, decomposed.length],
    decomposed: type(decomposed),
    quotes: ['„', '”', '“', '«', '»', '"'].map(q => `${q}=${sameChar(q, '"')}`).join(' '),
    diacriticsVsBase: ['ą/a', 'ż/z', 'ł/l', 'ó/o'].map(p => { const [x, y] = p.split('/'); return `${p}=${sameChar(x, y)}`; }).join(' ')
  };
}
