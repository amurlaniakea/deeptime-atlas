// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import { HOMININ_SITES, siteMidpoint } from '../data/hominins';
import { SOURCES_BY_ID } from '../data/sources';
import { LAND_PATH, MAP } from '../data/worldmap';
import type { Dict, Lang } from '../i18n';
import { AGE_BANDS, REGIONS, project, relax, siteBounds, siteColor, viewBoxOf, formatSiteAge, type Region } from '../lib/hominins';
import type { Tree } from '../lib/timescale';

const SVG_NS = 'http://www.w3.org/2000/svg';
type Scale = 'linear' | 'log';

function h<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text !== undefined) n.textContent = text;
  return n;
}
function s<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}, text?: string): SVGElementTagNameMap[K] {
  const n = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  if (text !== undefined) n.textContent = text;
  return n;
}
const reduced = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function mountHominins(host: HTMLElement, _tree: Tree, lang: Lang, dict: Dict, openUnit: (id: string) => void): void {
  void _tree;
  let region: Region = 'all';
  let scale: Scale = 'linear';
  let selected: string | null = null;
  let view = viewBoxOf('all');
  let anim = 0;

  const sites = HOMININ_SITES;
  const index = new Map(sites.map((x, i) => [x.id, i] as const));

  // ---------- region buttons ----------
  const regionBox = h('div', 'cosmos-modes');
  regionBox.setAttribute('role', 'group');
  regionBox.setAttribute('aria-label', dict['hom.region.label']);
  const regionBtns = new Map<Region, HTMLButtonElement>();
  for (const r of ['all', 'africa', 'europe', 'asia'] as const) {
    const b = h('button', 'lang-btn', dict[`hom.region.${r}` as keyof Dict]);
    b.type = 'button';
    b.addEventListener('click', () => setRegion(r));
    regionBtns.set(r, b);
    regionBox.append(b);
  }

  // ---------- map ----------
  const mapBox = h('div', 'hom-map');
  const svg = s('svg', { class: 'hom-svg', role: 'img', 'aria-label': dict['hom.mapLabel'], preserveAspectRatio: 'xMidYMid meet' });
  svg.append(s('rect', { x: -2000, y: -2000, width: 6000, height: 6000, class: 'hm-ocean' }));
  const grid = s('g', { class: 'hm-grid' });
  for (let lon = Math.ceil(MAP.lon0 / 10) * 10; lon <= MAP.lon1; lon += 10) {
    const a = project(lon, MAP.lat1); const b = project(lon, MAP.lat0);
    grid.append(s('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, 'vector-effect': 'non-scaling-stroke' }));
  }
  for (let lat = Math.ceil(MAP.lat0 / 10) * 10; lat <= MAP.lat1; lat += 10) {
    const a = project(MAP.lon0, lat); const b = project(MAP.lon1, lat);
    grid.append(s('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, 'vector-effect': 'non-scaling-stroke' }));
  }
  svg.append(grid, s('path', { d: LAND_PATH, class: 'hm-land' }));
  const pinLayer = s('g');
  svg.append(pinLayer);
  mapBox.append(svg);

  const legend = h('p', 'climate-keys');
  legend.append(h('span', 'ev-key', dict['hom.legend.title']));
  const bandLabels = ['> 4 Ma', '2–4 Ma', '0.7–2 Ma', '0.2–0.7 Ma', '< 0.2 Ma'];
  AGE_BANDS.forEach((b, i) => {
    const k = h('span', 'ev-key');
    const sw = h('span', 'swatch'); sw.style.background = b.color;
    k.append(sw, bandLabels[i]!);
    legend.append(k);
  });

  function drawPins(): void {
    const box = svg.getBoundingClientRect();
    const w = box.width || 800;
    const hh = box.height || 460;
    const sc = Math.min(w / view[2], hh / view[3]);
    svg.setAttribute('viewBox', view.join(' '));
    const toScreen = (p: { x: number; y: number }) => ({ x: (p.x - view[0]) * sc, y: (p.y - view[1]) * sc });
    const fromScreen = (p: { x: number; y: number }) => ({ x: p.x / sc + view[0], y: p.y / sc + view[1] });
    const trueMap = sites.map((st) => project(st.lon, st.lat));
    const moved = relax(trueMap.map(toScreen), 24).map(fromScreen);
    const nodes: SVGElement[] = [];
    sites.forEach((st, i) => {
      const t = trueMap[i]!;
      const m = moved[i]!;
      const sel = st.id === selected;
      const g = s('g', { class: `hm-pin${sel ? ' is-selected' : ''}`, tabindex: 0, role: 'button', 'aria-label': `${i + 1}. ${st.names[lang]}` });
      g.append(
        s('line', { x1: t.x, y1: t.y, x2: m.x, y2: m.y, class: 'hm-leader', 'vector-effect': 'non-scaling-stroke' }),
        s('circle', { cx: t.x, cy: t.y, r: 3 / sc, class: 'hm-true' }),
        s('circle', { cx: m.x, cy: m.y, r: (sel ? 13 : 11) / sc, fill: siteColor(st), class: 'hm-dot', 'stroke-width': (sel ? 3 : 1.5) / sc }),
        s('text', { x: m.x, y: m.y + 4 / sc, class: 'hm-num', 'font-size': 11 / sc, 'text-anchor': 'middle' }, String(i + 1)),
      );
      g.addEventListener('click', () => select(st.id, true));
      g.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); select(st.id, true); } });
      nodes.push(g);
    });
    pinLayer.replaceChildren(...nodes);
  }

  function setRegion(next: Region): void {
    region = next;
    for (const [r, b] of regionBtns) b.setAttribute('aria-pressed', String(r === region));
    const from = [...view] as [number, number, number, number];
    const to = viewBoxOf(region);
    window.cancelAnimationFrame(anim);
    if (reduced()) { view = to; drawPins(); return; }
    const t0 = performance.now();
    const step = (now: number): void => {
      const t = Math.min(1, (now - t0) / 450);
      const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      view = from.map((v, i) => v + (to[i]! - v) * e) as [number, number, number, number];
      drawPins();
      if (t < 1) anim = window.requestAnimationFrame(step);
    };
    anim = window.requestAnimationFrame(step);
  }

  // ---------- gantt ----------
  const scaleBox = h('div', 'cosmos-modes');
  scaleBox.setAttribute('role', 'group');
  scaleBox.setAttribute('aria-label', dict['hom.scale.label']);
  const bLin = h('button', 'lang-btn', dict['hom.scale.linear']);
  const bLog = h('button', 'lang-btn', dict['hom.scale.log']);
  for (const b of [bLin, bLog]) b.type = 'button';
  scaleBox.append(bLin, bLog);
  const gantt = h('div', 'cosmos-chart');

  function drawGantt(): void {
    const W = Math.max(300, gantt.clientWidth || 900);
    const narrow = W < 560;
    const rowH = 26;
    const m = { l: narrow ? 30 : 250, r: narrow ? 70 : 120, t: 10, b: 44 };
    const H = m.t + rowH * sites.length + m.b;
    const pw = W - m.l - m.r;
    const xOf = (ma: number): number => {
      if (scale === 'linear') return m.l + (Math.max(ma, 0) / 7.6) * pw;
      const lo = Math.log10(0.04); const hi = Math.log10(8);
      return m.l + ((Math.log10(Math.max(ma, 0.04)) - lo) / (hi - lo)) * pw;
    };
    const g = s('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'cosmos-svg', role: 'img', 'aria-label': dict['hom.ganttLabel'] });
    g.append(s('rect', { x: 0, y: 0, width: W, height: H, rx: 6, class: 'cs-bg' }));
    const ticks: Array<[number, string]> = scale === 'linear'
      ? [0, 1, 2, 3, 4, 5, 6, 7].map((v) => [v, v === 0 ? '0' : `${v} Ma`] as [number, string])
      : [[0.05, '50 ka'], [0.1, '100 ka'], [0.5, '500 ka'], [1, '1 Ma'], [2, '2 Ma'], [5, '5 Ma']];
    for (const [v, label] of ticks) {
      const tx = xOf(v);
      g.append(s('line', { x1: tx, x2: tx, y1: m.t, y2: m.t + rowH * sites.length, class: 'cs-month' }));
      g.append(s('text', { x: tx, y: m.t + rowH * sites.length + 16, class: 'cs-tick', 'text-anchor': 'middle' }, label));
    }
    g.append(s('text', { x: m.l + pw / 2, y: H - 6, class: 'cs-label', 'text-anchor': 'middle' }, narrow ? '' : dict['hom.axis']));
    sites.forEach((st, i) => {
      const y = m.t + i * rowH;
      const [older, younger] = siteBounds(st);
      const x0 = xOf(older);
      const x1 = Math.max(x0 + 5, xOf(younger));
      const row = s('g', { class: `hm-row${st.id === selected ? ' is-selected' : ''}`, tabindex: 0, role: 'button', 'aria-label': `${i + 1}. ${st.names[lang]}` });
      row.append(s('rect', { x: 0, y, width: W, height: rowH, fill: 'transparent' }));
      row.append(s('text', { x: 8, y: y + 17, class: 'cs-tick hm-rowlabel' }, narrow ? String(i + 1) : `${i + 1}. ${st.names[lang]}`));
      row.append(s('rect', { x: x0, y: y + 6, width: x1 - x0, height: rowH - 12, rx: 2, fill: siteColor(st), class: st.age.minimum ? 'hm-bar hm-bar-min' : 'hm-bar' }));
      row.append(s('text', { x: x1 + 6, y: y + 17, class: 'cs-tick' }, formatSiteAge(st, lang)));
      row.addEventListener('click', () => select(st.id, true));
      row.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); select(st.id, true); } });
      g.append(row);
    });
    gantt.replaceChildren(g);
  }
  function setScale(next: Scale): void {
    scale = next;
    bLin.setAttribute('aria-pressed', String(scale === 'linear'));
    bLog.setAttribute('aria-pressed', String(scale === 'log'));
    drawGantt();
  }
  bLin.addEventListener('click', () => setScale('linear'));
  bLog.addEventListener('click', () => setScale('log'));

  // ---------- list ----------
  const list = h('div', 'cosmos-events');
  const details = new Map<string, HTMLDetailsElement>();
  sites.forEach((st, i) => {
    const d = h('details', 'event');
    const sum = h('summary');
    const num = h('span', 'cs-num', String(i + 1));
    num.style.background = siteColor(st);
    sum.append(num, h('span', 'event-name', st.names[lang]), h('span', 'event-age', formatSiteAge(st, lang)));
    d.append(sum);
    const badges = h('p', 'badges');
    badges.append(h('span', `badge badge-${st.certainty}`, `${dict['events.status.label']}: ${dict[`events.status.${st.certainty}` as keyof Dict]}`));
    if (st.age.minimum) badges.append(h('span', 'badge', dict['hom.minimum']));
    badges.append(h('span', 'badge', dict[`hom.coords.${st.coords}` as keyof Dict]));
    d.append(badges);
    const dl = h('dl', 'facts');
    const fact = (k: string, v: string, italic = false): void => {
      const w = h('div'); const dd = h('dd', italic ? 'taxon' : undefined, v);
      w.append(h('dt', undefined, k), dd); dl.append(w);
    };
    fact(dict['hom.where'], `${st.place[lang]} · ${st.country[lang]} (${st.lat.toFixed(2)}°, ${st.lon.toFixed(2)}°)`);
    fact(dict['hom.age'], formatSiteAge(st, lang));
    fact(dict['hom.taxon'], st.taxa, true);
    d.append(dl, h('p', 'event-summary', st.summary[lang]));
    const btn = h('button', 'btn-zoom-out', dict['cosmos.open']);
    btn.type = 'button';
    btn.addEventListener('click', () => openUnit(st.link));
    d.append(btn);
    const srcs = h('ul', 'sources');
    for (const sid of st.sources) {
      const so = SOURCES_BY_ID.get(sid);
      if (!so) continue;
      const li = h('li'); const a = h('a', undefined, so.citation);
      a.href = so.url; a.rel = 'noopener noreferrer'; a.target = '_blank';
      li.append(a); srcs.append(li);
    }
    d.append(srcs);
    details.set(st.id, d);
    list.append(d);
  });

  function select(id: string, scroll: boolean): void {
    selected = id;
    for (const [sid, d] of details) d.open = sid === id;
    drawPins();
    drawGantt();
    if (scroll) details.get(id)?.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'nearest' });
  }

  host.replaceChildren(
    regionBox, mapBox, legend, h('p', 'climate-axis-note', dict['hom.credit']),
    h('h3', 'sources-title', dict['hom.gantt.title']), scaleBox, gantt,
    h('p', 'age-note', dict['hom.caveat']), h('h3', 'sources-title', dict['hom.sites']), list,
  );
  setRegion('all');
  setScale('linear');
  let timer = 0;
  let lastW = mapBox.clientWidth;
  new ResizeObserver(() => {
    if (mapBox.clientWidth === lastW && gantt.clientWidth === lastW) return;
    lastW = mapBox.clientWidth;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => { drawPins(); drawGantt(); }, 80);
  }).observe(mapBox);
  void siteMidpoint; void REGIONS; void index;
}
