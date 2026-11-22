// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import { CLIMATE_MARKS, CLIMATE_STATES } from '../data/climate';
import { SOURCES_BY_ID } from '../data/sources';
import type { CenogridFile } from '../data/types';
import type { Dict, Lang } from '../i18n';
import { nearestRow, ticks, valueRange, type Row } from '../lib/climate';
import { formatSpan, textColorFor, type Tree } from '../lib/timescale';

const SVG_NS = 'http://www.w3.org/2000/svg';
const EPOCHS = ['paleocene', 'eocene', 'oligocene', 'miocene', 'pliocene', 'pleistocene', 'holocene'];

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

export function mountClimate(host: HTMLElement, tree: Tree, lang: Lang, dict: Dict, data: CenogridFile): void {
  const rows = data.rows as Row[];
  if (rows.length === 0) {
    host.replaceChildren(h('p', 'climate-nodata', dict['climate.nodata']));
    return;
  }
  const nf = (d: number) => new Intl.NumberFormat(lang, { maximumFractionDigits: d, minimumFractionDigits: d });
  const maxAge = rows[rows.length - 1]![0];
  const { min: yMin, max: yMax } = valueRange(rows);

  const chart = h('div', 'climate-chart');
  const readout = h('p', 'climate-readout', '\u00a0');
  const credit = h('p', 'climate-credit', dict['climate.credit']);

  function draw(): void {
    const W = Math.max(300, chart.clientWidth || 800);
    const H = W < 520 ? 330 : 420;
    const m = { l: W < 520 ? 44 : 56, r: 12, t: 50, b: 62 };
    const pw = W - m.l - m.r;
    const ph = H - m.t - m.b;
    const x = (age: number): number => m.l + ((maxAge - age) / maxAge) * pw;
    // inverted axis: lowest d18O (warm) at the top
    const y = (v: number): number => m.t + ((v - yMin) / (yMax - yMin)) * ph;

    const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'climate-svg', role: 'img', 'aria-label': dict['climate.chartLabel'] });

    // climate-state bands
    for (const st of CLIMATE_STATES) {
      const x0 = x(st.startMa);
      const x1 = x(st.endMa);
      svg.append(s('rect', { x: x0, y: m.t, width: x1 - x0, height: ph, fill: st.color, opacity: 0.22 }));
      if (x1 - x0 >= 62) {
        svg.append(s('text', { x: (x0 + x1) / 2, y: m.t + 14, class: 'cl-band-label', 'text-anchor': 'middle' }, st.names.en.split(' (')[0]!));
      }
    }
    // grid + y axis
    for (let v = yMin; v <= yMax; v += 1) {
      svg.append(s('line', { x1: m.l, x2: m.l + pw, y1: y(v), y2: y(v), class: 'cl-grid' }));
      svg.append(s('text', { x: m.l - 6, y: y(v) + 4, class: 'cl-tick', 'text-anchor': 'end' }, String(v)));
    }
    // x axis ticks
    for (const t of ticks(0, maxAge, 10)) {
      svg.append(s('line', { x1: x(t), x2: x(t), y1: m.t + ph, y2: m.t + ph + 4, class: 'cl-axis' }));
      svg.append(s('text', { x: x(t), y: m.t + ph + 16, class: 'cl-tick', 'text-anchor': 'middle' }, String(t)));
    }
    svg.append(s('text', { x: m.l + pw / 2, y: H - 6, class: 'cl-label', 'text-anchor': 'middle' }, dict['climate.axisX']));
    const yl = s('text', { x: 12, y: m.t + ph / 2, class: 'cl-label', 'text-anchor': 'middle', transform: `rotate(-90 12 ${m.t + ph / 2})` }, 'δ¹⁸O (‰ VPDB)');
    svg.append(yl);

    // epoch strip
    const stripY = m.t + ph + 22;
    for (const id of EPOCHS) {
      const u = tree.get(id);
      if (!u) continue;
      const x0 = x(Math.min(u.startMa, maxAge));
      const x1 = x(u.endMa);
      svg.append(s('rect', { x: x0, y: stripY, width: Math.max(1, x1 - x0), height: 16, fill: u.color, stroke: 'rgba(0,0,0,0.35)', 'stroke-width': 0.5 }));
      if (x1 - x0 >= 52) {
        svg.append(s('text', { x: (x0 + x1) / 2, y: stripY + 12, class: 'cl-epoch', fill: textColorFor(u.color), 'text-anchor': 'middle' }, u.names[lang]));
      }
    }

    // curves
    const path = (col: 1 | 2): string => rows.map((r, i) => `${i === 0 ? 'M' : 'L'}${x(r[0]).toFixed(1)} ${y(r[col]).toFixed(1)}`).join('');
    svg.append(s('path', { d: path(1), class: 'cl-short', fill: 'none' }));
    svg.append(s('path', { d: path(2), class: 'cl-long', fill: 'none' }));

    // numbered marks
    CLIMATE_MARKS.forEach((mk, i) => {
      const mx = x(mk.ageMa);
      const cy = 14 + (i % 2) * 18;
      svg.append(s('line', { x1: mx, x2: mx, y1: cy + 8, y2: m.t + ph, class: 'cl-mark-line' }));
      svg.append(s('circle', { cx: mx, cy, r: 8, class: 'cl-mark-dot' }));
      svg.append(s('text', { x: mx, y: cy + 4, class: 'cl-mark-num', 'text-anchor': 'middle' }, String(i + 1)));
    });

    // hover guide
    const guide = s('line', { y1: m.t, y2: m.t + ph, class: 'cl-guide', visibility: 'hidden' });
    const dotS = s('circle', { r: 3.5, class: 'cl-dot-short', visibility: 'hidden' });
    const dotL = s('circle', { r: 4.5, class: 'cl-dot-long', visibility: 'hidden' });
    svg.append(guide, dotS, dotL);
    const overlay = s('rect', { x: m.l, y: m.t, width: pw, height: ph, fill: 'transparent' });
    overlay.addEventListener('pointermove', (ev: PointerEvent) => {
      const box = svg.getBoundingClientRect();
      const px = ((ev.clientX - box.left) / box.width) * W;
      const age = Math.max(0, Math.min(maxAge, maxAge - ((px - m.l) / pw) * maxAge));
      const r = nearestRow(rows, age);
      if (!r) return;
      guide.setAttribute('x1', String(x(r[0])));
      guide.setAttribute('x2', String(x(r[0])));
      dotS.setAttribute('cx', String(x(r[0]))); dotS.setAttribute('cy', String(y(r[1])));
      dotL.setAttribute('cx', String(x(r[0]))); dotL.setAttribute('cy', String(y(r[2])));
      for (const el of [guide, dotS, dotL]) el.setAttribute('visibility', 'visible');
      readout.textContent = dict['climate.readout']
        .replace('{age}', nf(r[0] < 5 ? 2 : 1).format(r[0]))
        .replace('{short}', nf(2).format(r[1]))
        .replace('{long}', nf(2).format(r[2]));
    });
    overlay.addEventListener('pointerleave', () => {
      for (const el of [guide, dotS, dotL]) el.setAttribute('visibility', 'hidden');
      readout.textContent = '\u00a0';
    });
    svg.append(overlay);
    chart.replaceChildren(svg);
  }

  // legend of the two curves
  const keys = h('p', 'climate-keys');
  const k1 = h('span', 'ev-key'); k1.append(h('span', 'cl-key-short'), dict['climate.short']);
  const k2 = h('span', 'ev-key'); k2.append(h('span', 'cl-key-long'), dict['climate.long']);
  keys.append(k1, k2);
  const axisNote = h('p', 'climate-axis-note', dict['climate.axisY']);

  // states list
  const statesTitle = h('h3', 'sources-title', dict['climate.states']);
  const statesList = h('ul', 'climate-list');
  for (const st of CLIMATE_STATES) {
    const li = h('li');
    const sw = h('span', 'swatch'); sw.style.background = st.color;
    const body = h('div');
    body.append(
      h('strong', undefined, `${st.names[lang]}`),
      h('span', 'layer-range', `  ${formatSpan(st.startMa, lang)} – ${st.endMa === 0 ? '0' : formatSpan(st.endMa, lang)}`),
      h('p', undefined, st.summary[lang]),
    );
    li.append(sw, body);
    statesList.append(li);
  }

  // marks list
  const marksTitle = h('h3', 'sources-title', dict['climate.marks']);
  const marksList = h('ol', 'climate-list climate-marks');
  for (const mk of CLIMATE_MARKS) {
    const li = h('li');
    const body = h('div');
    body.append(
      h('strong', undefined, mk.names[lang]),
      h('span', 'layer-range', `  ${mk.approx ? '~ ' : ''}${nf(mk.ageMa < 10 ? 3 : mk.ageMa % 1 === 0 ? 0 : 3).format(mk.ageMa)} Ma`),
      h('p', undefined, mk.summary[lang]),
    );
    li.append(body);
    marksList.append(li);
  }

  const srcs = h('ul', 'sources');
  for (const id of ['westerhold2020', 'cenogrid-s34', 'westerhold2020-manuscript']) {
    const so = SOURCES_BY_ID.get(id);
    if (!so) continue;
    const li = h('li');
    const a = h('a', undefined, so.citation);
    a.href = so.url; a.rel = 'noopener noreferrer'; a.target = '_blank';
    li.append(a);
    srcs.append(li);
  }

  host.replaceChildren(chart, keys, axisNote, readout, h('p', 'age-note', dict['climate.caveat']), statesTitle, statesList, marksTitle, marksList, h('h3', 'sources-title', dict['detail.sources']), srcs, credit);
  draw();
  let timer = 0;
  let lastWidth = chart.clientWidth;
  new ResizeObserver(() => {
    // redraw only when the width changes (the chart's own height changes must not retrigger it)
    if (chart.clientWidth === lastWidth) return;
    lastWidth = chart.clientWidth;
    window.clearTimeout(timer);
    timer = window.setTimeout(draw, 80);
  }).observe(chart);
}
