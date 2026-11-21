// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import type { Names, RawUnit, Rank } from '../data/types';
import { EARTH_AGE_MA } from '../data/units';

export const ROOT_ID = 'earth';

export interface Unit {
  id: string;
  rank: Rank;
  parent: string | null;
  startMa: number;
  endMa: number;
  startErr?: number;
  approx: boolean;
  informal: boolean;
  officialColor: boolean;
  color: string;
  names: Names;
  sources: string[];
  /** Child ids, oldest first. */
  children: string[];
}

export type Tree = ReadonlyMap<string, Unit>;

const ROOT_NAMES: Names = {
  es: 'Historia de la Tierra',
  en: 'Earth history',
  fr: 'Histoire de la Terre',
};

// ---------- colour helpers ----------
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function rgbToHex(r: number, g: number, b: number): string {
  const c = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`.toUpperCase();
}
export function mix(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}
export function luminance(hex: string): number {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
const INK = '#16202A';
const WHITE = '#FFFFFF';
function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
/** Readable text colour (ink or white) for a given background. */
export function textColorFor(bg: string): string {
  return contrast(bg, INK) >= contrast(bg, WHITE) ? INK : WHITE;
}
/** Derived shade for siblings without an official colour: index 0 = oldest. */
function derivedShade(parent: string, index: number, count: number): string {
  const t = count > 1 ? index / (count - 1) : 0;
  return luminance(parent) > 0.6 ? mix(parent, '#000000', 0.05 + 0.2 * t) : mix(parent, WHITE, 0.1 + 0.45 * t);
}

// ---------- tree ----------
export function buildTree(raw: readonly RawUnit[]): Tree {
  const map = new Map<string, Unit>();
  map.set(ROOT_ID, {
    id: ROOT_ID, rank: 'root', parent: null, startMa: EARTH_AGE_MA, endMa: 0,
    approx: false, informal: false, officialColor: true, color: '#8C9A91',
    names: ROOT_NAMES, sources: ['ics-chart-2024-12'], children: [],
  });
  for (const r of raw) {
    map.set(r.id, {
      id: r.id, rank: r.rank, parent: r.parent ?? ROOT_ID, startMa: r.startMa, endMa: 0,
      ...(r.startErr !== undefined ? { startErr: r.startErr } : {}),
      approx: r.approx ?? false, informal: r.informal ?? false,
      officialColor: r.color !== undefined, color: r.color ?? '',
      names: r.names, sources: r.sources, children: [],
    });
  }
  for (const u of map.values()) {
    if (u.parent === null) continue;
    const p = map.get(u.parent);
    if (!p) throw new Error(`Unknown parent "${u.parent}" for "${u.id}"`);
    p.children.push(u.id);
  }
  const resolve = (id: string): void => {
    const p = map.get(id)!;
    p.children.sort((a, b) => map.get(b)!.startMa - map.get(a)!.startMa);
    const n = p.children.length;
    p.children.forEach((cid, i) => {
      const c = map.get(cid)!;
      const next = i + 1 < n ? map.get(p.children[i + 1]!)!.startMa : p.endMa;
      c.endMa = next;
      if (!c.officialColor) c.color = derivedShade(p.color, i, n);
      resolve(cid);
    });
  };
  resolve(ROOT_ID);
  return map;
}

export function pathTo(tree: Tree, id: string): Unit[] {
  const out: Unit[] = [];
  let cur: Unit | undefined = tree.get(id);
  while (cur) {
    out.unshift(cur);
    cur = cur.parent ? tree.get(cur.parent) : undefined;
  }
  return out;
}
export function isAncestor(tree: Tree, ancestorId: string, id: string): boolean {
  return pathTo(tree, id).some((u) => u.id === ancestorId && u.id !== id);
}
/** The unit whose children fill the core when `id` is the current selection. */
export function coreParentId(tree: Tree, id: string): string {
  const u = tree.get(id)!;
  return u.children.length > 0 ? u.id : (u.parent ?? u.id);
}

// ---------- formatting ----------
export interface Win { a: number; b: number }
/** Interpolates the viewed age window so that both edges zoom smoothly (span in log space). */
export function lerpWindow(from: Win, to: Win, t: number): Win {
  const s0 = from.b - from.a;
  const s1 = to.b - to.a;
  if (s0 === s1) return { a: from.a + (to.a - from.a) * t, b: from.b + (to.b - from.b) * t };
  const span = s0 * Math.pow(s1 / s0, t);
  const w = (span - s0) / (s1 - s0);
  const a = from.a + (to.a - from.a) * w;
  return { a, b: a + span };
}

/** Time on a 24 h clock if all of Earth history (earthAge Ma) lasted one day. */
export function clockLabel(ma: number, earthAge: number = EARTH_AGE_MA): string {
  const total = (1 - ma / earthAge) * 86400;
  const precise = 86400 - total < 60;
  const t = precise ? Math.round(total * 10) / 10 : Math.round(total);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t - h * 3600) / 60);
  const s = t - h * 3600 - m * 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${precise ? s.toFixed(1).padStart(4, '0') : pad(s)}`;
}

export function formatSpan(ma: number, lang: string): string {
  if (ma < 1) {
    return `${new Intl.NumberFormat(lang, { maximumFractionDigits: 1 }).format(ma * 1000)} ka`;
  }
  return `${new Intl.NumberFormat(lang, { maximumFractionDigits: 3 }).format(ma)} Ma`;
}
export function formatAge(ma: number, lang: string, presentLabel: string): string {
  return ma === 0 ? presentLabel : formatSpan(ma, lang);
}
/** "538.8 ± 0.6 Ma" (the uncertainty is expressed in the same unit as the age). */
export function formatAgeErr(ma: number, errMa: number | undefined, lang: string, presentLabel: string): string {
  if (ma === 0) return presentLabel;
  if (errMa === undefined) return formatSpan(ma, lang);
  const f = (v: number, d: number) => new Intl.NumberFormat(lang, { maximumFractionDigits: d }).format(v);
  return ma < 1 ? `${f(ma * 1000, 1)} ± ${f(errMa * 1000, 1)} ka` : `${f(ma, 3)} ± ${f(errMa, 3)} Ma`;
}
export function formatShare(fraction: number, lang: string): string {
  return new Intl.NumberFormat(lang, { style: 'percent', maximumSignificantDigits: 2 }).format(fraction);
}
