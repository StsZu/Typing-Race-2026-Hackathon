() => {
  const de = document.documentElement;
  // Анімація героя змінює підсвічену клавішу з часом — виключаємо її з порівняння.
  const animated = e => e.closest('#hero-keyboard, .hero-art');
  const attrs = [...document.querySelectorAll('*')].filter(e => !animated(e)).map(e => {
    const a = [...e.attributes].filter(x => !/^data-i18n/.test(x.name) && !(x.name === 'lang' && e.hasAttribute('data-i18n-lang-added'))).map(x => x.name + '=' + x.value).join(' ');
    return e.tagName.toLowerCase() + (a ? ' ' + a : '');
  });
  const langUk = [...document.querySelectorAll('body [lang="uk"]')].map(e => e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + ':' + e.textContent.trim().slice(0, 30));
  const styles = [...document.querySelectorAll('body *')].filter(e => !animated(e)).map(e => { const s = getComputedStyle(e); return [s.display, s.fontSize, s.fontWeight, s.color, s.width].join(','); });
  return {
    marks: document.querySelectorAll('[data-i18n], [data-i18n-attr]').length,
    title: document.title,
    text: document.body.innerText,
    attrsWithoutI18n: attrs.join('\n').replace(/ lang=uk(?=( |$))/gm, ''),
    styleHash: styles.join('|').length + ':' + [...styles.join('|')].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7),
    scrollHeight: de.scrollHeight,
    storageKeys: Object.keys(localStorage).sort(),
    langUk
  };
}
