async () => {
  const de = document.documentElement;
  de.style.scrollBehavior = 'auto';
  for (let y = 0; y < de.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); }
  window.scrollTo(0, 0);
  const imgs = [...document.images];
  imgs.forEach(i => { i.loading = 'eager'; });
  await Promise.all(imgs.map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
  const res = performance.getEntriesByType('resource').map(e => ({ name: e.name.replace(location.origin, ''), status: e.responseStatus }));
  const meta = p => document.querySelector(`meta[property="${p}"]`)?.content;
  return {
    url: location.pathname,
    lang: de.lang,
    title: document.title,
    canonical: document.querySelector('link[rel="canonical"]')?.href,
    ogUrl: meta('og:url'), ogLocale: meta('og:locale'),
    ogAlt: [...document.querySelectorAll('meta[property="og:locale:alternate"]')].map(m => m.content),
    hreflang: [...document.querySelectorAll('link[rel="alternate"]')].map(l => `${l.hreflang}=${l.href}`),
    switcher: [...document.querySelectorAll('#langs a')].map(a => `${a.textContent}${a.getAttribute('aria-current') ? '*' : ''}→${a.getAttribute('href').replace(location.origin, '')}`),
    images: imgs.length, brokenImages: imgs.filter(i => i.naturalWidth === 0).map(i => i.getAttribute('src')),
    resources: res.length, failed: res.filter(r => r.status && r.status >= 400).map(r => `${r.status} ${r.name}`),
    stylesApplied: getComputedStyle(document.querySelector('header')).position === 'sticky',
    catalogCards: document.querySelectorAll('#catalog .trainer-card').length
  };
}
