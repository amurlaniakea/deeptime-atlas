// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import './style.css';
import { RAW_UNITS } from './data/units';
import { DICTS, LANGS, LANG_NAMES, detectLang, type Dict, type Lang } from './i18n';
import { ROOT_ID, buildTree } from './lib/timescale';
import cenogrid from './data/cenogrid.json';
import type { CenogridFile } from './data/types';
import { mountClimate } from './ui/climate';
import { mountCosmos } from './ui/cosmos';
import { mountHolocene } from './ui/holocene';
import { mountHominins } from './ui/hominins';
import { mountCompare } from './ui/compare';
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

  const nav = h('nav', 'sections-nav');
  nav.setAttribute('aria-label', dict['parts.title']);
  for (const [href, key] of [['#cosmos', 'nav.cosmos'], ['#explorer', 'nav.earth']] as const) {
    const a = h('a', undefined, dict[key]);
    a.href = href;
    nav.append(a);
  }
  const homLink = h('a', undefined, dict['nav.hominins']);
  homLink.href = '#hominins';
  nav.append(homLink);
  const holoLink = h('a', undefined, dict['nav.holocene']);
  holoLink.href = '#holocene';
  nav.append(holoLink);
  header.append(nav);

  const main = h('main');
  const cosmosSection = h('section', 'cosmos-section');
  cosmosSection.id = 'cosmos';
  cosmosSection.append(h('h2', 'section-title', dict['cosmos.title']), h('p', 'hint', dict['cosmos.hint']));
  const cosmosHost = h('div', 'cosmos-box');
  cosmosSection.append(cosmosHost);

  const explorerSection = h('section', 'explorer-section');
  explorerSection.id = 'explorer';
  explorerSection.append(h('h2', 'section-title', dict['explorer.title']), h('p', 'hint', dict['explorer.hint']));
  const explorerHost = h('div', 'explorer');
  explorerSection.append(explorerHost);

  const compareSection = h('section', 'compare');
  compareSection.append(h('h2', 'section-title', dict['compare.title']), h('p', 'hint', dict['compare.hint']));
  const compareHost = h('div', 'compare-box');
  compareSection.append(compareHost);

  const climateSection = h('section', 'climate');
  climateSection.append(h('h2', 'section-title', dict['climate.title']), h('p', 'hint', dict['climate.hint']));
  const climateHost = h('div', 'climate-box');
  climateSection.append(climateHost);

  const homSection = h('section', 'hom-section');
  homSection.id = 'hominins';
  homSection.append(h('h2', 'section-title', dict['hom.title']), h('p', 'hint', dict['hom.hint']));
  const homHost = h('div', 'cosmos-box');
  homSection.append(homHost);

  const holoSection = h('section', 'holo-section');
  holoSection.id = 'holocene';
  holoSection.append(h('h2', 'section-title', dict['holo.title']), h('p', 'hint', dict['holo.hint']));
  const holoHost = h('div', 'cosmos-box');
  holoSection.append(holoHost);

  const parts = h('section', 'parts');
  parts.append(
    h('h2', 'section-title', dict['parts.title']),
  );
  const grid = h('div', 'parts-grid');
  grid.append(
    part(dict, 'cosmos', dict['status.available'], '#4B3A9E'),
    part(dict, 'earth', dict['status.available'], '#34B2C9'),
    part(dict, 'holocene', dict['status.available'], '#F2B84B'),
  );
  parts.append(grid);
  main.append(cosmosSection, explorerSection, compareSection, climateSection, homSection, holoSection, parts);

  const footer = h('footer', 'site-footer');
  const links = h('p');
  const a = h('a', undefined, dict['footer.code']);
  a.href = REPO_URL; a.rel = 'noopener noreferrer';
  links.append(a);
  footer.append(h('p', undefined, dict['footer.data']), h('p', undefined, dict['footer.license']), links, h('p', undefined, COPYRIGHT));

  app.replaceChildren(skip, header, main, footer);

  mountCosmos(cosmosHost, lang, dict, (unitId) => {
    window.location.hash = unitId;
    window.setTimeout(() => document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' }), 60);
  });
  const openUnit = (unitId: string): void => {
    window.location.hash = unitId;
    window.setTimeout(() => document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' }), 60);
  };
  mountHominins(homHost, tree, lang, dict, openUnit);
  mountHolocene(holoHost, tree, lang, dict, openUnit);
  mountCompare(compareHost, tree, lang, dict, ['cenozoic', 'mesozoic']);
  mountClimate(climateHost, tree, lang, dict, cenogrid as unknown as CenogridFile);
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
