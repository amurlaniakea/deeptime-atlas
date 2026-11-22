// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import { BOUNDARIES } from '../data/boundaries';
import { EVENTS } from '../data/events';
import { SOURCES_BY_ID } from '../data/sources';
import { EARTH_AGE_MA } from '../data/units';
import type { Dict, Lang } from '../i18n';
import {
  ROOT_ID, clockLabel, coreParentId, eventsIn, formatAge, formatEventAge, formatAgeErr, formatShare, formatSpan,
  isAncestor, lerpWindow, pathTo, textColorFor, type Tree, type Unit, type Win,
} from '../lib/timescale';

export interface ExplorerOptions {
  tree: Tree;
  lang: Lang;
  dict: Dict;
  initialId: string;
  onChange: (id: string) => void;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const EVENT_CLASS = { extinction: 'ev-extinction', glaciation: 'ev-glaciation', 'cold-event': 'ev-cold' } as const;
const reduced = (): boolean => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const winOf = (u: Unit): Win => ({ a: u.endMa, b: u.startMa });
const ease = (t: number): number => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K, className?: string, text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

export function mountExplorer(host: HTMLElement, opts: ExplorerOptions): { setCurrent: (id: string) => void } {
  const { tree, lang, dict } = opts;
  const name = (u: Unit): string => u.names[lang];
  const range = (u: Unit): string =>
    `${formatAge(u.startMa, lang, dict['present'])} – ${formatAge(u.endMa, lang, dict['present'])}`;

  // ----- skeleton -----
  const coreCol = el('div', 'core-col');
  const zoomOut = el('button', 'btn-zoom-out', dict['explorer.zoomOut']);
  zoomOut.type = 'button';
  const core = el('div', 'core');
  core.setAttribute('role', 'img');
  core.setAttribute('aria-label', dict['explorer.coreLabel']);
  const layersTitle = el('h3', 'layers-title', dict['explorer.layers']);
  const layers = el('ul', 'layers');
  const legend = el('p', 'ev-legend');
  const lx = el('span', 'ev-key');
  lx.append(el('span', 'ev-sample ev-extinction'), dict['events.legend.extinction']);
  const lg = el('span', 'ev-key');
  lg.append(el('span', 'ev-sample ev-glaciation'), dict['events.legend.glaciation']);
  const lc = el('span', 'ev-key');
  lc.append(el('span', 'ev-sample ev-cold'), dict['events.legend.cold']);
  legend.append(lx, lg, lc);
  coreCol.append(zoomOut, core, legend, layersTitle, layers);
  const detail = el('div', 'detail');
  host.replaceChildren(coreCol, detail);

  // ----- state -----
  let current = tree.has(opts.initialId) ? opts.initialId : ROOT_ID;
  let drawnParent = coreParentId(tree, current);
  let cancelAnim: (() => void) | null = null;

  // ----- core drawing -----
  function drawCore(parentId: string, win: Win, highlightId: string | null): void {
    const parent = tree.get(parentId)!;
    const span = win.b - win.a;
    const height = core.clientHeight || 520;
    const nodes: HTMLElement[] = [];
    for (const cid of parent.children) {
      const u = tree.get(cid)!;
      const top = (u.endMa - win.a) / span;
      const h = (u.startMa - u.endMa) / span;
      if (top >= 1 || top + h <= 0) continue;
      const s = el('div', 'stratum');
      if (cid === highlightId) s.classList.add('is-current');
      s.style.top = `${top * 100}%`;
      s.style.height = `${h * 100}%`;
      s.style.background = u.color;
      s.style.color = textColorFor(u.color);
      s.title = `${name(u)} (${range(u)})`;
      const px = h * height;
      const tight = px < 34;
      if (tight) {
        s.classList.add('is-tight');
        s.style.fontSize = `${Math.max(10, Math.min(15, px * 0.62))}px`;
      }
      if (px >= 14) s.append(el('span', 'stratum-name', name(u)));
      if (px >= 44) s.append(el('span', 'stratum-range', range(u)));
      s.addEventListener('click', () => setCurrent(cid, true));
      nodes.push(s);
    }
    const gutter = el('div', 'core-gutter');
    for (const ev of EVENTS) {
      const end = ev.endMa ?? ev.startMa;
      if (ev.startMa < win.a || end > win.b) continue;
      const m = el('div', `ev ${EVENT_CLASS[ev.kind]}`);
      const topFrac = (end - win.a) / span;
      const hFrac = (ev.startMa - end) / span;
      if (ev.kind === 'extinction') {
        m.style.top = `${((ev.startMa - win.a) / span) * 100}%`;
      } else {
        m.style.top = `${topFrac * 100}%`;
        m.style.height = `max(4px, ${hFrac * 100}%)`;
      }
      m.title = `${ev.names[lang]} (${formatEventAge(ev, lang, dict['present'])})`;
      gutter.append(m);
    }
    core.replaceChildren(...nodes, gutter);
  }

  function animate(from: Win, to: Win, parentId: string, done: () => void): void {
    cancelAnim?.();
    const duration = 650;
    const t0 = performance.now();
    let raf = 0;
    const frame = (now: number): void => {
      const t = Math.min(1, (now - t0) / duration);
      drawCore(parentId, lerpWindow(from, to, ease(t)), null);
      if (t < 1) raf = requestAnimationFrame(frame);
      else { cancelAnim = null; done(); }
    };
    raf = requestAnimationFrame(frame);
    cancelAnim = () => { cancelAnimationFrame(raf); cancelAnim = null; };
  }

  // ----- layer chips (keyboard-accessible navigation) -----
  function drawLayers(parentId: string): void {
    const parent = tree.get(parentId)!;
    const items = [...parent.children].reverse().map((cid) => {
      const u = tree.get(cid)!;
      const li = el('li');
      const b = el('button', 'layer');
      b.type = 'button';
      if (cid === current) b.setAttribute('aria-current', 'true');
      const sw = el('span', 'swatch');
      sw.style.background = u.color;
      b.append(sw, el('span', 'layer-name', name(u)), el('span', 'layer-range', range(u)));
      b.addEventListener('click', () => setCurrent(cid, true));
      li.append(b);
      return li;
    });
    layers.replaceChildren(...items);
  }

  // ----- 24 h clock ring -----
  function clockSvg(u: Unit): SVGSVGElement {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 140 140');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', 'clock-ring');
    const cx = 70, cy = 70;
    const theta = (ma: number): number => (1 - ma / EARTH_AGE_MA) * 360;
    const pt = (r: number, deg: number): [number, number] => {
      const rad = (deg * Math.PI) / 180;
      return [cx + r * Math.sin(rad), cy - r * Math.cos(rad)];
    };
    const arc = (r: number, a0: number, a1: number, color: string, w: number): SVGElement => {
      if (a1 - a0 >= 359.99) {
        const c = document.createElementNS(SVG_NS, 'circle');
        c.setAttribute('cx', String(cx)); c.setAttribute('cy', String(cy)); c.setAttribute('r', String(r));
        c.setAttribute('fill', 'none'); c.setAttribute('stroke', color); c.setAttribute('stroke-width', String(w));
        return c;
      }
      const [x0, y0] = pt(r, a0);
      const [x1, y1] = pt(r, a1);
      const p = document.createElementNS(SVG_NS, 'path');
      p.setAttribute('d', `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`);
      p.setAttribute('fill', 'none'); p.setAttribute('stroke', color); p.setAttribute('stroke-width', String(w));
      return p;
    };
    for (const id of tree.get(ROOT_ID)!.children) {
      const e = tree.get(id)!;
      svg.append(arc(44, theta(e.startMa), theta(e.endMa), e.color, 10));
    }
    svg.append(arc(58, theta(u.startMa), theta(u.endMa), u.id === ROOT_ID ? 'currentColor' : u.color, 8));
    const [ix, iy] = pt(36, theta(u.startMa));
    const [ox, oy] = pt(66, theta(u.startMa));
    const tick = document.createElementNS(SVG_NS, 'line');
    tick.setAttribute('x1', ix.toFixed(2)); tick.setAttribute('y1', iy.toFixed(2));
    tick.setAttribute('x2', ox.toFixed(2)); tick.setAttribute('y2', oy.toFixed(2));
    tick.setAttribute('stroke', 'currentColor'); tick.setAttribute('stroke-width', '1.5');
    svg.append(tick);
    return svg;
  }

  // ----- detail panel -----
  function drawDetail(): void {
    const u = tree.get(current)!;
    // breadcrumb
    const nav = el('nav', 'crumbs');
    nav.setAttribute('aria-label', dict['explorer.path']);
    const ol = el('ol');
    pathTo(tree, current).forEach((p, i, arr) => {
      const li = el('li');
      if (i === arr.length - 1) {
        const span = el('span', undefined, name(p));
        span.setAttribute('aria-current', 'page');
        li.append(span);
      } else {
        const b = el('button', 'crumb', name(p));
        b.type = 'button';
        b.addEventListener('click', () => setCurrent(p.id, true));
        li.append(b);
      }
      ol.append(li);
    });
    nav.append(ol);

    const rank = el('p', 'unit-rank', dict[`rank.${u.rank}` as keyof Dict]);
    const title = el('h2', 'unit-name', name(u));
    title.style.setProperty('--unit-color', u.color);
    const badges = el('p', 'badges');
    if (u.approx) badges.append(el('span', 'badge', dict['badge.approx']));
    if (u.informal) badges.append(el('span', 'badge', dict['badge.informal']));

    const dl = el('dl', 'facts');
    const fact = (k: string, v: string): void => {
      const wrap = el('div');
      wrap.append(el('dt', undefined, k), el('dd', undefined, v));
      dl.append(wrap);
    };
    fact(dict['detail.base'], (u.approx ? '~ ' : '') + formatAgeErr(u.startMa, u.startErr, lang, dict['present']));
    fact(dict['detail.top'], formatAge(u.endMa, lang, dict['present']));
    fact(dict['detail.duration'], formatSpan(u.startMa - u.endMa, lang));
    fact(dict['detail.share'], formatShare((u.startMa - u.endMa) / EARTH_AGE_MA, lang));

    const clock = el('div', 'clock');
    const clockText = el('p');
    clockText.append(dict['detail.clock'] + ' ', el('strong', 'clock-time', clockLabel(u.startMa)));
    clock.append(clockSvg(u), clockText);

    const boundary = BOUNDARIES.find((b) => b.appliesTo.includes(u.id));
    const boundaryBlock = el('section', 'boundary');
    if (boundary) {
      boundaryBlock.append(el('h3', 'sources-title', dict['boundary.title']));
      const bl = el('dl', 'boundary-facts');
      const row = (k: string, v: string): void => {
        const wrap = el('div');
        wrap.append(el('dt', undefined, k), el('dd', undefined, v));
        bl.append(wrap);
      };
      row(dict['boundary.marker'], boundary.marker[lang]);
      row(dict['boundary.location'], boundary.location[lang]);
      if (boundary.ratified !== undefined) row(dict['boundary.ratified'], String(boundary.ratified));
      if (boundary.reference) row(dict['boundary.reference'], boundary.reference);
      boundaryBlock.append(bl);
    }

    const evs = eventsIn(EVENTS, u);
    const eventsBlock = el('section', 'events');
    if (evs.length > 0) {
      eventsBlock.append(el('h3', 'sources-title', dict['events.title']));
      for (const ev of evs) {
        const d = el('details', 'event');
        const sum = el('summary');
        sum.append(
          el('span', `ev-sample ${EVENT_CLASS[ev.kind]}`),
          el('span', 'event-name', ev.names[lang]),
          el('span', 'event-age', formatEventAge(ev, lang, dict['present'])),
        );
        d.append(sum);
        const badges2 = el('p', 'badges');
        if (ev.bigFive) badges2.append(el('span', 'badge', dict['events.bigFive']));
        badges2.append(el('span', `badge badge-${ev.certainty}`, `${dict['events.status.label']}: ${dict[`events.status.${ev.certainty}` as keyof Dict]}`));
        d.append(badges2, el('p', 'event-summary', ev.summary[lang]));
        const evSrc = el('ul', 'sources');
        for (const sid of ev.sources) {
          const so = SOURCES_BY_ID.get(sid);
          if (!so) continue;
          const li = el('li');
          const a = el('a', undefined, so.citation);
          a.href = so.url; a.rel = 'noopener noreferrer'; a.target = '_blank';
          li.append(a);
          evSrc.append(li);
        }
        d.append(evSrc);
        eventsBlock.append(d);
      }
    }

    const srcTitle = el('h3', 'sources-title', dict['detail.sources']);
    const srcList = el('ul', 'sources');
    for (const sid of [...u.sources, ...(boundary ? boundary.sources : [])]) {
      const s = SOURCES_BY_ID.get(sid);
      if (!s) continue;
      const li = el('li');
      const a = el('a', undefined, s.citation);
      a.href = s.url; a.rel = 'noopener noreferrer'; a.target = '_blank';
      li.append(a, el('span', 'accessed', ` (${dict['detail.accessed']} ${s.accessed})`));
      srcList.append(li);
    }
    const note = el('p', 'age-note', dict['explorer.ageNote']);

    detail.replaceChildren(nav, rank, title, badges, dl, clock, boundaryBlock, eventsBlock, srcTitle, srcList, note);
  }

  // ----- transitions -----
  function setCurrent(id: string, animateIt: boolean): void {
    if (!tree.has(id)) id = ROOT_ID;
    const prevParent = drawnParent;
    current = id;
    const nextParent = coreParentId(tree, id);
    drawnParent = nextParent;
    zoomOut.disabled = id === ROOT_ID;
    drawLayers(nextParent);
    drawDetail();
    opts.onChange(id);

    const finish = (): void => drawCore(nextParent, winOf(tree.get(nextParent)!), id);
    if (animateIt && !reduced() && prevParent !== nextParent) {
      if (isAncestor(tree, prevParent, nextParent)) {
        animate(winOf(tree.get(prevParent)!), winOf(tree.get(nextParent)!), prevParent, finish);
        return;
      }
      if (isAncestor(tree, nextParent, prevParent)) {
        animate(winOf(tree.get(prevParent)!), winOf(tree.get(nextParent)!), nextParent, finish);
        return;
      }
    }
    cancelAnim?.();
    finish();
  }

  zoomOut.addEventListener('click', () => {
    const parent = tree.get(current)!.parent;
    if (parent) setCurrent(parent, true);
  });

  setCurrent(current, false);
  window.addEventListener('resize', () => {
    if (!cancelAnim) drawCore(drawnParent, winOf(tree.get(drawnParent)!), current);
  });

  return { setCurrent: (id: string) => setCurrent(id, true) };
}
