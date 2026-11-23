// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import { COSMIC_BANDS, COSMIC_EVENTS } from '../data/cosmos';
import { SOURCES_BY_ID } from '../data/sources';
import type { Dict, Lang } from '../i18n';
import {
  CAL_YEAR_S, T0_S, YEAR_S, calendarFraction, calendarLabel, formatCosmicTime, formatYears, lookbackYears,
  resolveTime, superscript, type ResolvedTime,
} from '../lib/cosmology';

const SVG_NS = 'http://www.w3.org/2000/svg';
type Mode = 'log' | 'calendar';

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

const LOG_MIN = -44.5;
const LOG_MAX = Math.log10(T0_S) + 0.05;
const MONTH_DAYS = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];

export function mountCosmos(host: HTMLElement, lang: Lang, dict: Dict, openUnit: (id: string) => void): void {
  let mode: Mode = 'log';
  const resolved = COSMIC_EVENTS.map((e) => ({ e, r: resolveTime(e.time) }));
  const byId = new Map(resolved.map((x) => [x.e.id, x.r] as const));
  const timeOf = (id: string | null, fallback: number): number => (id ? byId.get(id)!.seconds : fallback);

  // ---------- controls ----------
  const modes = h('div', 'cosmos-modes');
  modes.setAttribute('role', 'group');
  modes.setAttribute('aria-label', dict['cosmos.mode.label']);
  const btnLog = h('button', 'lang-btn', dict['cosmos.mode.log']);
  const btnCal = h('button', 'lang-btn', dict['cosmos.mode.calendar']);
  for (const b of [btnLog, btnCal]) b.type = 'button';
  modes.append(btnLog, btnCal);

  const chart = h('div', 'cosmos-chart');
  const bandKeys = h('p', 'climate-keys');
  for (const b of COSMIC_BANDS) {
    const k = h('span', 'ev-key');
    const sw = h('span', 'swatch'); sw.style.background = b.color;
    k.append(sw, b.names[lang]);
    bandKeys.append(k);
  }
  const readout = h('p', 'climate-readout', '\u00a0');
  const axisNote = h('p', 'climate-axis-note');

  const dateFmt = (sec: number): string => calendarLabel(sec, lang);
  const readoutFor = (sec: number): string => {
    const ago = lookbackYears(sec);
    const base = ago > 1e6
      ? dict['cosmos.readoutAgo'].replace('{ago}', formatYears(ago, lang))
      : dict['cosmos.readout'];
    return base.replace('{t}', formatCosmicTime(sec, lang)).replace('{date}', dateFmt(sec));
  };

  function draw(): void {
    const W = Math.max(300, chart.clientWidth || 900);
    const narrow = W < 560;
    const H = narrow ? 270 : 300;
    const m = { l: 14, r: 14, t: 12, b: 52 };
    const pw = W - m.l - m.r;
    const plotTop = m.t + 34;
    const ph = H - plotTop - m.b;
    const x = (sec: number): number => {
      if (mode === 'log') return m.l + ((Math.log10(Math.max(sec, 1e-60)) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * pw;
      return m.l + calendarFraction(sec) * pw;
    };
    const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, class: 'cosmos-svg', role: 'img', 'aria-label': dict['cosmos.chartLabel'] });
    svg.append(s('rect', { x: 0, y: 0, width: W, height: H, rx: 6, class: 'cs-bg' }));

    // bands
    for (const b of COSMIC_BANDS) {
      const a = b.from === null ? (mode === 'log' ? 1e-60 : 0) : timeOf(b.from, 0);
      const z = b.to === null ? T0_S : timeOf(b.to, T0_S);
      const x0 = b.from === null ? m.l : x(a);
      const x1 = b.to === null ? m.l + pw : x(z);
      svg.append(s('rect', { x: x0, y: plotTop, width: Math.max(1, x1 - x0), height: ph, fill: b.color, opacity: 0.95 }));
      if (x1 - x0 > (narrow ? 70 : 110)) {
        svg.append(s('text', { x: (x0 + x1) / 2, y: plotTop + ph / 2 + 4, class: 'cs-band-label', 'text-anchor': 'middle' }, b.names[lang]));
      }
    }
    // axis
    const axisY = plotTop + ph;
    svg.append(s('line', { x1: m.l, x2: m.l + pw, y1: axisY, y2: axisY, class: 'cs-axis' }));
    if (mode === 'log') {
      const ticks: Array<[number, string, boolean]> = [
        [1e-40, `10${superscript(-40)} s`, true], [1e-30, `10${superscript(-30)}`, false], [1e-20, `10${superscript(-20)}`, true],
        [1e-10, `10${superscript(-10)}`, false], [1, '1 s', true], [3600, '1 h', false],
        [YEAR_S, '1 yr', true], [1e3 * YEAR_S, '1 kyr', false], [1e6 * YEAR_S, '1 Myr', false], [1e9 * YEAR_S, '1 Gyr', true],
      ];
      for (const [sec, label, always] of ticks) {
        if (narrow && !always) continue;
        svg.append(s('line', { x1: x(sec), x2: x(sec), y1: axisY, y2: axisY + 5, class: 'cs-axis' }));
        svg.append(s('text', { x: x(sec), y: axisY + 18, class: 'cs-tick', 'text-anchor': 'middle' }, label));
      }
    } else {
      const fmt = new Intl.DateTimeFormat(lang, { month: narrow ? 'narrow' : 'short', timeZone: 'UTC' });
      MONTH_DAYS.forEach((d, i) => {
        const px = m.l + (d / 365) * pw;
        svg.append(s('line', { x1: px, x2: px, y1: plotTop, y2: axisY + 5, class: 'cs-month' }));
        if (i < 12) {
          svg.append(s('text', { x: m.l + ((d + (MONTH_DAYS[i + 1]! - d) / 2) / 365) * pw, y: axisY + 18, class: 'cs-tick', 'text-anchor': 'middle' }, fmt.format(new Date(Date.UTC(2001, i, 15)))));
        }
      });
    }
    svg.append(s('text', { x: m.l + pw / 2, y: H - 8, class: 'cs-label', 'text-anchor': 'middle' }, narrow ? '' : (mode === 'log' ? dict['cosmos.axisLog'] : dict['cosmos.axisCal'])));

    // numbered markers in one row; dots are spread apart when crowded and joined to their true time by a leader line
    const GAP = 18;
    const trueX = resolved.map(({ r }) => x(r.seconds));
    const pos = [...trueX];
    for (let i = 0; i < pos.length; i++) pos[i] = Math.max(i === 0 ? m.l + 9 : pos[i - 1]! + GAP, trueX[i]!);
    pos[pos.length - 1] = Math.min(pos[pos.length - 1]!, m.l + pw - 9);
    for (let i = pos.length - 2; i >= 0; i--) pos[i] = Math.min(pos[i]!, pos[i + 1]! - GAP);
    const cy = m.t + 10;
    resolved.forEach(({ e }, i) => {
      svg.append(s('line', { x1: pos[i]!, x2: trueX[i]!, y1: cy + 9, y2: axisY, class: 'cs-mark-line' }));
      svg.append(s('circle', { cx: pos[i]!, cy, r: 9, class: e.certainty === 'hypothesis' ? 'cs-dot cs-dot-hyp' : 'cs-dot' }));
      svg.append(s('text', { x: pos[i]!, y: cy + 4, class: 'cs-mark-num', 'text-anchor': 'middle' }, String(i + 1)));
    });

    // hover
    const guide = s('line', { y1: plotTop, y2: axisY, class: 'cs-guide', visibility: 'hidden' });
    svg.append(guide);
    const overlay = s('rect', { x: m.l, y: plotTop, width: pw, height: ph, fill: 'transparent' });
    overlay.addEventListener('pointermove', (ev: PointerEvent) => {
      const box = svg.getBoundingClientRect();
      const px = ((ev.clientX - box.left) / box.width) * W;
      const frac = Math.max(0, Math.min(1, (px - m.l) / pw));
      const sec = mode === 'log' ? 10 ** (LOG_MIN + frac * (LOG_MAX - LOG_MIN)) : frac * T0_S;
      guide.setAttribute('x1', String(px)); guide.setAttribute('x2', String(px));
      guide.setAttribute('visibility', 'visible');
      readout.textContent = readoutFor(Math.min(sec, T0_S));
    });
    overlay.addEventListener('pointerleave', () => { guide.setAttribute('visibility', 'hidden'); readout.textContent = '\u00a0'; });
    svg.append(overlay);
    chart.replaceChildren(svg);
    axisNote.textContent = narrow ? (mode === 'log' ? dict['cosmos.axisLog'] : dict['cosmos.axisCal']) : '';
  }

  function setMode(next: Mode): void {
    mode = next;
    btnLog.setAttribute('aria-pressed', String(mode === 'log'));
    btnCal.setAttribute('aria-pressed', String(mode === 'calendar'));
    draw();
  }
  btnLog.addEventListener('click', () => setMode('log'));
  btnCal.addEventListener('click', () => setMode('calendar'));

  // ---------- eras and events lists ----------
  const eraTitle = h('h3', 'sources-title', dict['cosmos.eras']);
  const eraList = h('ul', 'climate-list');
  for (const b of COSMIC_BANDS) {
    const li = h('li');
    const sw = h('span', 'swatch'); sw.style.background = b.color;
    const body = h('div');
    body.append(h('strong', undefined, b.names[lang]), h('p', undefined, b.summary[lang]));
    li.append(sw, body);
    eraList.append(li);
  }

  const evTitle = h('h3', 'sources-title', dict['cosmos.events']);
  const evList = h('div', 'cosmos-events');
  resolved.forEach(({ e, r }, i) => {
    const d = h('details', 'event');
    const sum = h('summary');
    const num = h('span', 'cs-num', String(i + 1));
    const when = e.id === 'now' ? dict['cosmos.now'] : `${e.approx ? '~ ' : ''}${formatCosmicTime(r.seconds, lang)}`;
    sum.append(num, h('span', 'event-name', e.names[lang]), h('span', 'event-age', when));
    d.append(sum);

    const badges = h('p', 'badges');
    badges.append(h('span', `badge badge-${e.certainty === 'hypothesis' ? 'debated' : e.certainty}`, `${dict['events.status.label']}: ${dict[`events.status.${e.certainty}` as keyof Dict]}`));
    if (e.time.kind === 'redshift') badges.append(h('span', 'badge', dict['cosmos.computed']));
    d.append(badges);

    const dl = h('dl', 'facts');
    const fact = (k: string, v: string): void => {
      const w = h('div'); w.append(h('dt', undefined, k), h('dd', undefined, v)); dl.append(w);
    };
    const spread = (rr: ResolvedTime): string => {
      const e1 = Math.max(rr.seconds - rr.lo, rr.hi - rr.seconds);
      return e1 > 0 && rr.seconds > 1e3 ? ` ± ${formatCosmicTime(e1, lang)}` : '';
    };
    fact(dict['cosmos.when'], `${e.approx ? '~ ' : ''}${formatCosmicTime(r.seconds, lang)}${spread(r)}`);
    if (lookbackYears(r.seconds) > 1e3 && e.id !== 'now') fact(dict['cosmos.ago'], formatYears(lookbackYears(r.seconds), lang));
    fact(dict['cosmos.calendarDate'], dateFmt(r.seconds));
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

  host.replaceChildren(modes, chart, bandKeys, axisNote, readout, h('p', 'age-note', dict['cosmos.caveat']), eraTitle, eraList, evTitle, evList);
  setMode('log');
  let timer = 0;
  let lastWidth = chart.clientWidth;
  new ResizeObserver(() => {
    if (chart.clientWidth === lastWidth) return;
    lastWidth = chart.clientWidth;
    window.clearTimeout(timer);
    timer = window.setTimeout(draw, 80);
  }).observe(chart);
  void CAL_YEAR_S;
}
