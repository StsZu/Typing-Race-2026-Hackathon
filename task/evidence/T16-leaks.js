() => {
  // Кирилиця в DOM англійської сторінки після сценарію T07 (запускати після нього), окрім елементів з lang="uk" і шаблонів пісень.
  const cyr = /[А-Яа-яЇїІіЄєҐґ]/;
  const path = e => { const p = []; for (let n = e; n && n !== document.body && p.length < 4; n = n.parentElement) p.unshift(n.tagName.toLowerCase() + (n.id ? '#' + n.id : n.classList[0] ? '.' + n.classList[0] : '')); return p.join(' > '); };
  const out = [];
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) {
    const el = n.parentElement;
    if (!cyr.test(n.data) || el.closest('template, [lang="uk"], script')) continue;
    out.push({ where: path(el), text: n.data.trim().slice(0, 60) });
  }
  for (const el of document.querySelectorAll('*')) for (const a of ['alt', 'aria-label', 'title', 'placeholder', 'content']) {
    const v = el.getAttribute(a);
    if (v && cyr.test(v) && !el.closest('[lang="uk"]')) out.push({ where: path(el) + ' @' + a, text: v.slice(0, 60) });
  }
  const typingValue = document.querySelector('#typing').value;
  return { count: out.length, typingValue, leaks: out };
}
