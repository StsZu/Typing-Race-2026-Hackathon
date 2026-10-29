() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
  const de = document.documentElement;
  const name = e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + (e.classList.length ? '.' + [...e.classList].join('.') : '');
  const visible = e => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; };
  const skipLeak = e => e.closest('template, [lang="uk"], #sample, #typing, #hero-keyboard, #keyboard, script, #catalog');
  const measure = state => {
    const vw = de.clientWidth;
    const clipped = [], beyond = [], leaks = [];
    for (const e of $$('body *')) {
      if (!visible(e) || e.closest('#sample, #lyrics, .lyrics-text, .tracks, #hero-keyboard, .sr-only')) continue;
      const s = getComputedStyle(e);
      const hidesX = /hidden|clip|auto|scroll/.test(s.overflowX) || s.textOverflow === 'ellipsis';
      if (hidesX && e.scrollWidth > e.clientWidth + 1 && e.textContent.trim()) clipped.push(`${name(e)} ${e.scrollWidth}>${e.clientWidth}: ${e.textContent.trim().slice(0, 40)}`);
      const r = e.getBoundingClientRect();
      if (r.right > vw + 0.5 && e.textContent.trim()) beyond.push(`${name(e)} right=${Math.round(r.right)}: ${e.textContent.trim().slice(0, 40)}`);
    }
    // Тексти кнопок і посилань, ширші за саму кнопку (переповнення без обрізання).
    for (const e of $$('button, a.button, .tabs button, label, .outline')) {
      if (!visible(e) || e.closest('.sr-only')) continue;
      const rg = document.createRange(); rg.selectNodeContents(e);
      const t = rg.getBoundingClientRect(), b = e.getBoundingClientRect();
      if (t.width > b.width + 1) clipped.push(`${name(e)} текст ${Math.round(t.width)} > кнопка ${Math.round(b.width)}: ${e.textContent.trim().slice(0, 40)}`);
    }
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
    while ((n = w.nextNode())) if (/[А-Яа-яЇїІіЄєҐґ]/.test(n.data) && !skipLeak(n.parentElement)) leaks.push(`${name(n.parentElement)}: ${n.data.trim().slice(0, 40)}`);
    for (const e of $$('[alt],[aria-label],[placeholder],[title]')) for (const a of ['alt', 'aria-label', 'placeholder', 'title']) { const v = e.getAttribute(a); if (v && /[А-Яа-яЇїІіЄєҐґ]/.test(v) && !skipLeak(e) && !/Не гальмуй/.test(v)) leaks.push(`${name(e)} @${a}: ${v.slice(0, 40)}`); }
    return { state, viewport: vw, scrollWidth: de.scrollWidth, dark: document.body.classList.contains('dark'), clipped, beyond: beyond.slice(0, 10), beyondCount: beyond.length, leaks };
  };
  const out = [measure('initial')];
  $('[data-layout="pl"]').click(); $('#altgr').click(); $$('#keyboard .key').find(k => k.dataset.char === 'ą').click();
  out.push(measure('pl + AltGr + ą'));
  const spm = $('[name="calc-unit"][value="spm"]'); spm.checked = true; fire(spm, 'change'); $('#current').value = ''; fire($('#current'), 'input');
  out.push(measure('calc spm + invalid'));
  $('[data-duration="60"]').click(); const ta = $('#typing'); ta.value = 'abc'; fire(ta, 'input'); finish();
  out.push(measure('test finished'));
  return out;
}
