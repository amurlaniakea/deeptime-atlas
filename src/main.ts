// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import './style.css';
import { RAW_UNITS } from './data/units';
import { DICTS, LANGS, LANG_NAMES, detectLang, type Dict, type Lang } from './i18n';
import { ROOT_ID, buildTree } from './lib/timescale';
import { mountExplorer } from './ui/explorer';

const tree = buildTree(RAW_UNITS);
const REPO_URL = 'https://github.com/amurlaniakea/deeptime-atlas';
const COPYRIGHT = '© 2026 Pedro Sordo Martínez';

function safeGet(key: string): string | null {
  try { return window.localStorage.getItem(key); } catch { return null; }
}
function safeSet(key: string, value: string): void {
  try { window.localStorage.setItem(key, value); } catch { /* storage may be unavailable */ }
}
function h<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}

let currentId = decodeURIComponent(window.location.hash.replace(/^#/, '')) || ROOT_ID;
let lang: Lang = detectLang(window.location.search, safeGet('deeptime.lang'), navigator.languages ?? []);

function setUrl(id: string, l: Lang): void {
  const url = new URL(window.location.href);
  url.searchParams.set('lang', l);
  url.hash = id === ROOT_ID ? '' : id;
  window.history.replaceState(null, '', url);
}

function part(dict: Dict, key: 'cosmos' | 'earth' | 'holocene', status: string, color: string): HTMLElement {
  const card = h('article', 'part');
  card.style.setProperty('--part-color', color);
  card.append(
    h('h3', undefined, dict[`parts.${key}.title` as keyof Dict]),
    h('p', undefined, dict[`parts.${key}.desc` as keyof Dict]),
    h('p', 'part-status', status),
  );
  return card;
}

function render(): void {
  const dict = DICTS[lang];
  document.documentElement.lang = lang;
  document.title = `${dict['app.title']}`;
  const app = document.getElementById('app')!;

  const skip = h('a', 'skip', dict['skip']);
  skip.href = '#explorer';

  const header = h('header', 'site-header');
  const heading = h('div', 'heading');
  heading.append(h('h1', undefined, dict['app.title']), h('p', 'tagline', dict['app.tagline']));
  const langNav = h('nav', 'lang');
  langNav.setAttribute('aria-label', dict['lang.label']);
  for (const l of LANGS) {
    const b = h('button', 'lang-btn', LANG_NAMES[l]);
    b.type = 'button';
    b.lang = l;
    b.setAttribute('aria-pressed', String(l === lang));
    b.addEventListener('click', () => {
      lang = l;
      safeSet('deeptime.lang', l);
      setUrl(currentId, l);
      render();
    });
    langNav.append(b);
  }
  header.append(heading, langNav);

  const main = h('main');
  const explorerSection = h('section', 'explorer-section');
  explorerSection.id = 'explorer';
  explorerSection.append(h('h2', 'section-title', dict['explorer.title']), h('p', 'hint', dict['explorer.hint']));
  const explorerHost = h('div', 'explorer');
  explorerSection.append(explorerHost);

  const parts = h('section', 'parts');
  parts.append(
    h('h2', 'section-title', dict['parts.title']),
  );
  const grid = h('div', 'parts-grid');
  grid.append(
    part(dict, 'cosmos', dict['status.planned'].replace('{v}', 'v0.4'), '#4B3A9E'),
    part(dict, 'earth', dict['status.available'], '#34B2C9'),
    part(dict, 'holocene', dict['status.planned'].replace('{v}', 'v0.5'), '#F2B84B'),
  );
  parts.append(grid);
  main.append(explorerSection, parts);

  const footer = h('footer', 'site-footer');
  const links = h('p');
  const a = h('a', undefined, dict['footer.code']);
  a.href = REPO_URL; a.rel = 'noopener noreferrer';
  links.append(a);
  footer.append(h('p', undefined, dict['footer.data']), h('p', undefined, dict['footer.license']), links, h('p', undefined, COPYRIGHT));

  app.replaceChildren(skip, header, main, footer);

  mountExplorer(explorerHost, {
    tree, lang, dict, initialId: currentId,
    onChange: (id) => { currentId = id; setUrl(id, lang); },
  });
}

window.addEventListener('hashchange', () => {
  const id = decodeURIComponent(window.location.hash.replace(/^#/, '')) || ROOT_ID;
  if (id !== currentId && tree.has(id)) { currentId = id; render(); }
});

render();
