// Спільні функції для мовних версій головної сторінки: розбір HTML без втрат,
// витяг українських рядків, застосування словника. Використовують build-locales.mjs і check-i18n.mjs.
import crypto from "node:crypto";

const VOID = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);
const RAW_TEXT = new Set(["script", "style"]);
const URL_ATTRS = ["src", "href", "data-src", "data-cover", "poster"];
const TOKEN = /<!--[\s\S]*?-->|<!doctype[^>]*>|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)((?:\s+[^\s=>\/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?)>|[^<]+|</gi;

export function parse(html) {
  const root = { type: "root", children: [] };
  const stack = [root];
  let m;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(html))) {
    const top = stack[stack.length - 1];
    if (m[1]) {
      const tag = m[1].toLowerCase();
      const i = stack.findLastIndex(n => n.tag === tag);
      if (i > 0) { for (let k = stack.length - 1; k > i; k--) stack[k].close = ""; stack[i].close = m[0]; stack.length = i; }
      else top.children.push({ type: "raw", raw: m[0] });
    } else if (m[2]) {
      const tag = m[2].toLowerCase();
      const el = { type: "el", tag, open: m[0], children: [], close: "", parent: top };
      top.children.push(el);
      if (RAW_TEXT.has(tag)) {
        const end = html.toLowerCase().indexOf(`</${tag}`, TOKEN.lastIndex);
        el.children.push({ type: "raw", raw: html.slice(TOKEN.lastIndex, end) });
        const close = html.slice(end).match(/^<\/[a-zA-Z]+\s*>/)[0];
        el.close = close;
        TOKEN.lastIndex = end + close.length;
      } else if (!VOID.has(tag) && !m[4]) stack.push(el);
    } else top.children.push({ type: "raw", raw: m[0] });
  }
  return root;
}

export const render = n => n.type === "raw" ? n.raw : n.type === "root" ? n.children.map(render).join("") : n.open + n.children.map(render).join("") + n.close;
const renderChildren = n => n.children.map(render).join("");

export function getAttr(el, name) {
  const m = el.open.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? m[2] ?? m[3] ?? m[4] : undefined;
}

export function setAttr(el, name, value) {
  if (getAttr(el, name) === value) return;
  const quoted = `"${String(value).replace(/"/g, "&quot;")}"`;
  const re = new RegExp(`(\\s${name}\\s*=\\s*)("[^"]*"|'[^']*'|[^\\s>]+)`, "i");
  el.open = re.test(el.open) ? el.open.replace(re, (_, a) => a + quoted) : el.open.replace(/\s*\/?>$/, s => ` ${name}=${quoted}${s}`);
}

function* elements(n, inTemplate = false) {
  for (const c of n.children || []) {
    if (c.type !== "el") continue;
    yield { el: c, inTemplate };
    yield* elements(c, inTemplate || c.tag === "template");
  }
}

const isProtected = c => c.type === "el" && (c.tag === "input" || getAttr(c, "id") !== undefined);
const paramsOf = el => { const p = getAttr(el, "data-i18n-params"); return p ? JSON.parse(p) : undefined; };
const attrKeys = el => (getAttr(el, "data-i18n-attr") || "").split(";").filter(Boolean).map(p => p.split(":"));
const messagesEl = tree => [...elements(tree)].map(x => x.el).find(el => el.tag === "script" && getAttr(el, "id") === "i18n-messages");

export const sourceHash = value => crypto.createHash("sha1").update(typeof value === "string" ? value : JSON.stringify(value)).digest("hex").slice(0, 8);

// Українські рядки сторінки: статичні з розмітки, динамічні та шаблони з параметрами — зі словника #i18n-messages.
export function extractUk(html) {
  const tree = parse(html);
  const statics = {}, uses = [];
  const msgEl = messagesEl(tree);
  const messages = msgEl ? JSON.parse(renderChildren(msgEl)) : {};
  for (const { el, inTemplate } of elements(tree)) {
    if (inTemplate) continue;
    const params = paramsOf(el);
    const key = getAttr(el, "data-i18n");
    if (key) {
      let i = 0;
      const text = el.children.map(c => isProtected(c) ? `{$${++i}}` : render(c)).join("").trim();
      uses.push({ key, kind: "text", params, text, protectedCount: i, tag: el.tag });
      if (!params) statics[key] = text;
    }
    for (const [attr, k] of attrKeys(el)) {
      const text = getAttr(el, attr);
      uses.push({ key: k, kind: "attr", attr, params, text, tag: el.tag });
      if (!params) statics[k] = text;
    }
  }
  return { statics, messages, uses, lang: getAttr([...elements(tree)][0].el, "lang") };
}

export function format(template, params = {}, lang = "uk") {
  let m = template;
  if (m && typeof m === "object") {
    const n = Object.values(params).find(v => typeof v === "number");
    m = m[new Intl.PluralRules(lang).select(n ?? 0)] ?? m.other;
  }
  if (typeof m !== "string") return undefined;
  return m.replace(/\{(\w+)\}/g, (s, p) => p in params ? String(params[p]) : s);
}

const isRelative = v => v && !/^(#|\/|[a-z][a-z0-9+.-]*:)/i.test(v);

// dict: { key: "текст" | {one, few, many, other} } — повний словник мови (статичні й динамічні ключі).
export function build(html, { lang, dict, prefix = "" }) {
  const tree = parse(html);
  const missing = new Set();
  const lookup = (key, params) => {
    if (!(key in dict)) { missing.add(key); return undefined; }
    const v = format(dict[key], params, lang);
    if (v === undefined) missing.add(key);
    return v;
  };
  const apply = el => {
    const params = paramsOf(el);
    for (const [attr, k] of attrKeys(el)) { const v = lookup(k, params); if (v !== undefined) setAttr(el, attr, v); }
    const key = getAttr(el, "data-i18n");
    if (!key) { el.children.forEach(c => c.type === "el" && c.tag !== "template" && apply(c)); return; }
    const prot = el.children.filter(isProtected);
    prot.forEach(apply);
    const value = lookup(key, params);
    if (value === undefined) return;
    const inner = renderChildren(el);
    const lead = inner.match(/^\s*/)[0], trail = inner.slice(lead.length).match(/\s*$/)[0];
    const parts = (lead + value + trail).split(/\{\$(\d+)\}/);
    el.children = parts.map((p, i) => i % 2 ? prot[Number(p) - 1] : { type: "raw", raw: p });
  };
  tree.children.forEach(c => c.type === "el" && apply(c));

  const msgEl = messagesEl(tree);
  if (msgEl) {
    const ukMessages = JSON.parse(renderChildren(msgEl));
    const out = {};
    for (const k of Object.keys(ukMessages)) { if (k in dict) out[k] = dict[k]; else missing.add(k); }
    msgEl.children = [{ type: "raw", raw: JSON.stringify(out) }];
  }
  for (const { el } of elements(tree)) {
    if (el.tag === "html") setAttr(el, "lang", lang);
    if (prefix) for (const a of URL_ATTRS) { const v = getAttr(el, a); if (isRelative(v)) setAttr(el, a, prefix + v); }
  }
  return { html: render(tree), missing: [...missing] };
}
