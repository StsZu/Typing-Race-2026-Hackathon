() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const de = document.documentElement, header = $('header'), langs = $('#langs');
  const rect = e => { const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)].join(','); };
  return {
    lang: de.lang,
    viewport: de.clientWidth,
    scrollWidth: de.scrollWidth,
    headerHeight: Math.round(header.getBoundingClientRect().height),
    headerRows: new Set([...header.querySelectorAll('.brand, nav a, #theme')].filter(e => e.getBoundingClientRect().width > 0).map(e => Math.round(e.getBoundingClientRect().top / 8))).size,
    switcherVisible: !$('#langs-bar').hidden && langs.getBoundingClientRect().width > 0,
    barHeight: Math.round($('#langs-bar').getBoundingClientRect().height),
    headerSticky: getComputedStyle(header).position,
    switcherRect: rect(langs),
    switcherLabel: langs.getAttribute('aria-label'),
    links: $$('#langs a').map(a => ({ text: a.innerText.trim(), label: a.getAttribute('aria-label'), lang: a.lang, href: a.getAttribute('href').replace(location.origin, ''), current: a.getAttribute('aria-current') })),
    themeRect: rect($('#theme')),
    brandRect: rect($('.brand')),
    layoutPressed: $$('[data-layout]').filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.dataset.layout),
    heroFirstKeys: $$('#hero-keyboard .key').slice(0, 4).map(k => k.textContent).join(''),
    schemeFirstKeys: $$('#keyboard .key').slice(0, 4).map(k => k.textContent.replace(/\d+$/, '')).join(''),
    keyTip: $('#key-tip').textContent,
    layoutNote: $('#layout-note').textContent.slice(0, 60),
    altgrVisible: !$('#altgr').hidden
  };
}
