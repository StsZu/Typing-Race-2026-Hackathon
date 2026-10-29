() => {
  const $ = s => document.querySelector(s);
  const de = document.documentElement;
  const round = r => [r.left, r.top + scrollY, r.width, r.height].map(Math.round).join(',');
  const overlap = () => {
    let count = 0, worst = 0;
    for (const k of document.querySelectorAll('#keyboard .key:not(.space)')) {
      const t = k.querySelector('span[lang]') || [...k.childNodes].find(n => n.nodeType === 3), s = k.querySelector('small');
      const rg = document.createRange(); rg.selectNodeContents(t);
      const a = rg.getBoundingClientRect(), b = s.getBoundingClientRect();
      const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left), oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ox > 0 && oy > 0) { count++; worst = Math.max(worst, ox); }
    }
    return { count, worstPx: +worst.toFixed(1) };
  };
  const measure = () => {
    const keys = [...document.querySelectorAll('#keyboard .key:not(.space)')].map(k => k.getBoundingClientRect());
    const panel = $('.keyboard-panel').getBoundingClientRect();
    return {
      clientWidth: de.clientWidth,
      scrollWidth: de.scrollWidth,
      panelRight: Math.round(panel.right),
      keyW: [Math.min(...keys.map(k => k.width)), Math.max(...keys.map(k => k.width))].map(x => +x.toFixed(1)),
      keyH: [Math.min(...keys.map(k => k.height)), Math.max(...keys.map(k => k.height))].map(x => +x.toFixed(1)),
      gridCols: getComputedStyle($('.learning-grid')).gridTemplateColumns,
      digitOverLetter: overlap(),
      panelRect: round(panel),
      keyRects: keys.slice(0, 3).map(round).join(' | ')
    };
  };
  const out = {};
  for (const l of ['uk', 'en', 'pl']) { $(`[data-layout="${l}"]`).click(); out[l] = measure(); }
  $('#altgr').click(); out['pl+altgr'] = measure(); $('#altgr').click();
  $('[data-layout="uk"]').click();
  const offenders = [...document.querySelectorAll('body *')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.right > de.clientWidth + 0.5; });
  out.overflowLeaves = offenders.filter(e => ![...e.children].some(c => offenders.includes(c))).slice(0, 6).map(e => (e.id ? '#' + e.id : e.tagName.toLowerCase()) + '.' + [...e.classList].join('.') + ' right=' + Math.round(e.getBoundingClientRect().right));
  return out;
}
