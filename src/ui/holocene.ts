// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import { ANTHROPOCENE_PANEL, HOLOCENE_STAGES, HOLO_EVENTS, yearFromB2k } from '../data/holocene';
import { SOURCES_BY_ID } from '../data/sources';
import type { Dict, Lang } from '../i18n';
import { formatYears } from '../lib/cosmology';
import { textColorFor, type Tree } from '../lib/timescale';

const SVG_NS = 'http://www.w3.org/2000/svg';
export const THIS_YEAR = 2026;
type Mode = 'holocene' | 'modern';
const RANGES: Record<Mode, [number, number]> = { holocene: [-9900, 2040], modern: [1700, 2035] };
const KIND_CLASS = { climate: 'ho-climate', human: 'ho-human', anthropocene: 'ho-anthro' } as const;

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

/** "9700 BCE", "500 CE", "1750". */
export function formatYear(y: number, lang: string, dict: Dict): string {
  const nf = new Intl.NumberFormat(lang, { useGrouping: false });
  if (y < 0) return `${nf.format(-y)} ${dict['era.bce']}`;
  if (y < 1000) return `${nf.format(y)} ${dict['era.ce']}`;
  return nf.format(y);
}

/** Id of the Holocene age that contains a calendar year (undefined outside the Holocene). */
export function ageAtYear(year: number): string | undefined {
  let found: string | undefined;
  for (const st of HOLOCENE_STAGES) if (year >= yearFromB2k(st.baseB2k)) found = st.id;
  return found;
}

export function mountHolocene(host: HTMLElement, tree: Tree, lang: Lang, dict: Dict, openUnit: (id: string) => void): void {
  let mode: Mode = 'holocene';

  const modes = h('div', 'cosmos-modes');
  modes.setAttribute('role', 'group');
  modes.setAttribute('aria-label', dict['holo.mode.label']);
  const btnH = h('button', 'lang-btn', dict['holo.mode.holocene']);
  const btnM = h('button', 'lang-btn', dict['holo.mode.modern']);
  for (const b of [btnH, btnM]) b.type = 'button';
  modes.append(btnH, btnM);

  const chart = h('div', 'cosmos-chart');
  const keys = h('p', 'climate-keys');
  for (const k of ['climate', 'human', 'anthropocene'] as const) {
    const key = h('span', 'ev-key');
    key.append(h('span', `ho-key ${KIND_CLASS[k]}`), dict[`holo.kind.${k}` as keyof Dict]);
    keys.append(key);
  }
  const readout = h('p', 'climate-readout', '\u00a0');
  const axisNote = h('p', 'climate-axis-note');

  function draw(): void {
    const [y0, y1] = RANGES[mode];
    const W = Math.max(300, chart.clientWidth || 900);
    const narrow = W < 560;
    const H = narrow ? 250 : 280;
    const m = { l: 14, r: 14, t: 12, b: 50 };
    const pw = W - m.l - m.r;
    const plotTop = m.t + 34;
    const ph = H - plotTop - m.b;
    const x = (y: number): number => m.l + ((Math.min(Math.max(y, y0), y1) - y0) / (y1 - y0)) * pw;
    const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'cosmos-svg', role: 'img', 'aria-label': dict['holo.chartLabel'] });
    svg.append(s('rect', { x: 0, y: 0, width: W, height: H, rx: 6, class: 'cs-bg' }));

    // Holocene ages as bands
    HOLOCENE_STAGES.forEach((st, i) => {
      const u = tree.get(st.id)!;
      const from = yearFromB2k(st.baseB2k);
      const to = i + 1 < HOLOCENE_STAGES.length ? yearFromB2k(HOLOCENE_STAGES[i + 1]!.baseB2k) : y1;
      if (to <= y0 || from >= y1) return;
      const x0 = x(from);
      const x1 = x(to);
      svg.append(s('rect', { x: x0, y: plotTop, width: Math.max(1, x1 - x0), height: ph, fill: u.color, opacity: 0.9 }));
      if (x1 - x0 > (narrow ? 70 : 100)) {
        svg.append(s('text', { x: (x0 + x1) / 2, y: plotTop + 20, class: 'ho-band-label', fill: textColorFor(u.color), 'text-anchor': 'middle' }, u.names[lang]));
      }
    });
    // proposed Anthropocene (hatched, informal)
    const aStart = 1950;
    if (aStart < y1) {
      const ax = x(aStart);
      svg.append(s('rect', { x: ax, y: plotTop + ph * 0.45, width: Math.max(1, x(y1) - ax), height: ph * 0.55, class: 'ho-hatch' }));
      const room = x(y1) - ax;
      if (room > 100) svg.append(s('text', { x: ax + 6, y: plotTop + ph * 0.45 + 16, class: 'ho-hatch-label' }, room > 340 ? dict['holo.anthro'] : dict['holo.anthroShort']));
    }
    // axis
    const axisY = plotTop + ph;
    svg.append(s('line', { x1: m.l, x2: m.l + pw, y1: axisY, y2: axisY, class: 'cs-axis' }));
    const step = mode === 'holocene' ? (narrow ? 4000 : 2000) : 50;
    for (let y = Math.ceil(y0 / step) * step; y <= y1; y += step) {
      if (mode === 'holocene' && y === 0) { /* keep 0 as a tick: it is the BCE/CE boundary */ }
      svg.append(s('line', { x1: x(y), x2: x(y), y1: axisY, y2: axisY + 5, class: 'cs-axis' }));
      svg.append(s('text', { x: x(y), y: axisY + 18, class: 'cs-tick', 'text-anchor': 'middle' }, formatYear(y === 0 ? 1 : y, lang, dict)));
    }
    svg.append(s('text', { x: m.l + pw / 2, y: H - 8, class: 'cs-label', 'text-anchor': 'middle' }, narrow ? '' : dict['holo.axis']));

    // events: ranges as thick bars, dots spread when crowded
    const visible = HOLO_EVENTS.map((e, i) => ({ e, i })).filter(({ e }) => e.from >= y0 && e.from <= y1);
    const GAP = 18;
    const trueX = visible.map(({ e }) => x(e.from));
    const pos = [...trueX];
    for (let k = 0; k < pos.length; k++) pos[k] = Math.max(k === 0 ? m.l + 9 : pos[k - 1]! + GAP, trueX[k]!);
    if (pos.length) pos[pos.length - 1] = Math.min(pos[pos.length - 1]!, m.l + pw - 9);
    for (let k = pos.length - 2; k >= 0; k--) pos[k] = Math.min(pos[k]!, pos[k + 1]! - GAP);
    const cy = m.t + 10;
    visible.forEach(({ e, i }, k) => {
      svg.append(s('line', { x1: pos[k]!, x2: trueX[k]!, y1: cy + 9, y2: axisY, class: 'cs-mark-line' }));
      if (e.to !== undefined) {
        svg.append(s('rect', { x: trueX[k]!, y: axisY - 6, width: Math.max(2, x(e.to) - trueX[k]!), height: 6, class: `ho-range ${KIND_CLASS[e.kind]}` }));
      }
      svg.append(s('circle', { cx: pos[k]!, cy, r: 9, class: `ho-dot ${KIND_CLASS[e.kind]}${e.certainty === 'debated' ? ' ho-dot-debated' : ''}` }));
      svg.append(s('text', { x: pos[k]!, y: cy + 4, class: 'cs-mark-num', 'text-anchor': 'middle' }, String(i + 1)));
    });

    // hover
    const guide = s('line', { y1: plotTop, y2: axisY, class: 'cs-guide', visibility: 'hidden' });
    svg.append(guide);
    const overlay = s('rect', { x: m.l, y: plotTop, width: pw, height: ph, fill: 'transparent' });
    overlay.addEventListener('pointermove', (ev: PointerEvent) => {
      const box = svg.getBoundingClientRect();
      const px = ((ev.clientX - box.left) / box.width) * W;
      const frac = Math.max(0, Math.min(1, (px - m.l) / pw));
      const year = Math.round(y0 + frac * (y1 - y0));
      guide.setAttribute('x1', String(px)); guide.setAttribute('x2', String(px));
      guide.setAttribute('visibility', 'visible');
      const age = ageAtYear(year);
      readout.textContent = dict['holo.readout']
        .replace('{year}', formatYear(year, lang, dict))
        .replace('{ago}', formatYears(Math.max(0, THIS_YEAR - year), lang))
        .replace('{age}', age ? tree.get(age)!.names[lang] : '');
    });
    overlay.addEventListener('pointerleave', () => { guide.setAttribute('visibility', 'hidden'); readout.textContent = '\u00a0'; });
    svg.append(overlay);
    chart.replaceChildren(svg);
    axisNote.textContent = narrow ? dict['holo.axis'] : '';
  }

  function setMode(next: Mode): void {
    mode = next;
    btnH.setAttribute('aria-pressed', String(mode === 'holocene'));
    btnM.setAttribute('aria-pressed', String(mode === 'modern'));
    draw();
  }
  btnH.addEventListener('click', () => setMode('holocene'));
  btnM.addEventListener('click', () => setMode('modern'));

  // ages of the Holocene
  const agesTitle = h('h3', 'sources-title', dict['holo.ages']);
  const agesList = h('ul', 'climate-list');
  for (const st of HOLOCENE_STAGES) {
    const u = tree.get(st.id)!;
    const li = h('li');
    const sw = h('span', 'swatch'); sw.style.background = u.color;
    const body = h('div');
    body.append(
      h('strong', undefined, u.names[lang]),
      h('span', 'layer-range', `  ${formatYear(yearFromB2k(st.baseB2k), lang, dict)} →`),
    );
    li.append(sw, body);
    agesList.append(li);
  }

  // Anthropocene panel
  const panel = h('section', 'anthro-panel');
  panel.append(h('h3', undefined, ANTHROPOCENE_PANEL.title[lang]));
  for (const p of ANTHROPOCENE_PANEL.points) panel.append(h('p', undefined, p[lang]));

  // events
  const evTitle = h('h3', 'sources-title', dict['holo.events']);
  const evList = h('div', 'cosmos-events');
  HOLO_EVENTS.forEach((e, i) => {
    const d = h('details', 'event');
    const sum = h('summary');
    const when = `${e.approx ? '~ ' : ''}${formatYear(e.from, lang, dict)}${e.to !== undefined ? ` – ${formatYear(e.to, lang, dict)}` : ''}`;
    const num = h('span', `cs-num ${KIND_CLASS[e.kind]}`, String(i + 1));
    sum.append(num, h('span', 'event-name', e.names[lang]), h('span', 'event-age', when));
    d.append(sum);
    const badges = h('p', 'badges');
    badges.append(h('span', 'badge', dict[`holo.kind.${e.kind}` as keyof Dict]));
    badges.append(h('span', `badge badge-${e.certainty}`, `${dict['events.status.label']}: ${dict[`events.status.${e.certainty}` as keyof Dict]}`));
    d.append(badges);
    const dl = h('dl', 'facts');
    const fact = (k: string, v: string): void => { const w = h('div'); w.append(h('dt', undefined, k), h('dd', undefined, v)); dl.append(w); };
    fact(dict['holo.date'], when);
    fact(dict['holo.ago'], e.from >= THIS_YEAR - 2 ? dict['holo.now'] : formatYears(THIS_YEAR - e.from, lang));
    d.append(dl, h('p', 'event-summary', e.summary[lang]));
    if (e.link) {
      const btn = h('button', 'btn-zoom-out', dict['cosmos.open']);
      btn.type = 'button';
      const link = e.link;
      btn.addEventListener('click', () => openUnit(link));
      d.append(btn);
    }
    const srcs = h('ul', 'sources');
    for (const sid of e.sources) {
      const so = SOURCES_BY_ID.get(sid);
      if (!so) continue;
      const li = h('li'); const a = h('a', undefined, so.citation);
      a.href = so.url; a.rel = 'noopener noreferrer'; a.target = '_blank';
      li.append(a); srcs.append(li);
    }
    d.append(srcs);
    evList.append(d);
  });

  host.replaceChildren(modes, chart, keys, axisNote, readout, h('p', 'age-note', dict['holo.caveat']), agesTitle, agesList, panel, evTitle, evList);
  setMode('holocene');
  let timer = 0;
  let lastWidth = chart.clientWidth;
  new ResizeObserver(() => {
    if (chart.clientWidth === lastWidth) return;
    lastWidth = chart.clientWidth;
    window.clearTimeout(timer);
    timer = window.setTimeout(draw, 80);
  }).observe(chart);
}
