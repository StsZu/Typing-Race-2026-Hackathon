async () => {
  const cards = [...document.querySelectorAll('#catalog .trainer-card')];
  await Promise.all(cards.map(c => c.querySelector('img')).filter(Boolean).map(i => { i.loading = 'eager'; return i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }); }));
  const cyr = /[А-Яа-яЇїІіЄєҐґ]/;
  const leaks = [];
  const w = document.createTreeWalker(document.querySelector('#catalog'), NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) if (cyr.test(n.data) && !n.parentElement.closest('[lang="uk"]')) leaks.push(n.data.trim().slice(0, 50));
  for (const i of document.querySelectorAll('#catalog img')) if (cyr.test(i.alt)) leaks.push('@alt ' + i.alt.slice(0, 50));
  return {
    lang: document.documentElement.lang,
    count: cards.length,
    cards: cards.map(c => ({
      number: c.querySelector('.card-number')?.textContent,
      name: c.querySelector('h3').textContent + (c.querySelector('h3').lang ? `@${c.querySelector('h3').lang}` : ''),
      author: c.querySelector('.author').textContent + (c.querySelector('.author').lang ? `@${c.querySelector('.author').lang}` : ''),
      description: c.querySelector('.card-body > p:not(.author)')?.textContent,
      features: [...c.querySelectorAll('li')].map(li => li.textContent),
      alt: c.querySelector('img')?.alt,
      imageLoaded: (c.querySelector('img')?.naturalWidth || 0) > 0,
      links: [...c.querySelectorAll('a')].map(a => a.textContent)
    })),
    leaks
  };
}
