() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const txt = s => $(s)?.textContent ?? null;
  const fire = (el, type) => el.dispatchEvent(new Event(type, { bubbles: true }));
  const out = [];
  const snap = (step, extra = {}) => out.push({ step, keyTip: txt('#key-tip'), layoutNote: txt('#layout-note'), ...extra });
  const keyLabels = () => $$('#keyboard .key').slice(0, 3).concat($$('#keyboard .key.space')).map(k => k.textContent + ' | ' + (k.getAttribute('aria-label') || ''));
  const keyByChar = c => $$('#keyboard .key').find(k => k.dataset.char === c);

  snap('initial', { keyLabels: keyLabels() });
  if (!keyByChar('ф')) $('[data-layout="uk"]').click(); // en/pl-сторінки починають з QWERTY (T13); на uk нічого не змінює
  keyByChar('ф').click(); snap('click ф');
  $('#keyboard .key.space').click(); snap('click space');
  $('[data-layout="en"]').click(); snap('layout en', { keyLabels: keyLabels() });
  keyByChar('j').click(); snap('click j');
  $('[data-layout="pl"]').click(); snap('layout pl');
  $('#altgr').click(); snap('altgr on', { keyLabels: $$('#keyboard .key.alt').map(k => k.getAttribute('aria-label')) });
  keyByChar('ą').click(); snap('click ą');
  $('#altgr').click(); snap('altgr off');
  $('[data-layout="uk"]').click(); snap('layout uk again', { keyLabels: keyLabels() });

  const calc = () => ({ labels: ['#current-label', '#target-label', '#volume-label'].map(txt), day: txt('#saved-day'), week: txt('#saved-week'), month: txt('#saved-month'), note: txt('#calc-note') });
  const setCalc = (a, b, v) => { [['#current', a], ['#target', b], ['#volume', v]].forEach(([s, x]) => { $(s).value = x; fire($(s), 'input'); }); };
  snap('calc initial', calc());
  setCalc(40, 60, 1000); snap('calc 40/60/1000', calc());
  setCalc(60, 40, 1000); snap('calc target lower', calc());
  setCalc('', 40, 1000); snap('calc invalid', calc());
  setCalc(40, 60, 1000);
  const spm = $('[name="calc-unit"][value="spm"]'); spm.checked = true; fire(spm, 'change'); snap('calc spm', calc());
  const wpm = $('[name="calc-unit"][value="wpm"]'); wpm.checked = true; fire(wpm, 'change'); snap('calc wpm', calc());

  const test = () => ({ duration: txt('#duration-label'), status: txt('#test-status'), finishTitle: txt('#finish-title'), summary: (txt('#finish-summary') || '').replace(/\d+/g, '#'), resultHidden: $('#test-result').hidden });
  snap('test initial', test());
  $('[data-duration="60"]').click(); snap('test 60s', test());
  const ta = $('#typing'); ta.value = 'Кожна'; fire(ta, 'input'); snap('test typing', test());
  finish(); snap('test finish', test());
  $('#restart').click(); snap('test restart', test());
  $('[data-duration="30"]').click(); snap('test 30s', test());

  snap('plan initial', { progress: txt('#progress-label'), day1: $('#days button').getAttribute('aria-label'), storageNote: txt('#storage-note') });
  $('#days button').click(); snap('plan day 1', { progress: txt('#progress-label'), day1: $('#days button').textContent });
  $('#days button').click();

  const player = () => ({ title: txt('#player-title'), titleLang: $('#player-title').lang, audio: $('#player-audio').getAttribute('aria-label'), cover: $('#player-cover').alt, parts: $$('#lyrics h4').map(h => h.textContent + '@' + h.lang).join(', ') });
  snap('song 0', player());
  showSong(1, false); snap('song 1', player());
  showSong(2, false); snap('song 2', player());
  showSong(0, false);

  snap('catalog', { cards: $$('#catalog .trainer-card').map(c => [c.querySelector('.card-number')?.textContent, c.querySelector('img')?.alt, c.querySelector('.app-placeholder')?.textContent, ...[...c.querySelectorAll('a')].map(a => a.textContent)].join(' | ')) });
  return out;
}
