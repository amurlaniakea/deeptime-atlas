// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import { MAP } from '../data/worldmap';
import type { HomininSite } from '../data/types';
import { siteMidpoint } from '../data/hominins';

/** Map pixel position of a longitude/latitude (equirectangular projection of src/data/worldmap.ts). */
export function project(lon: number, lat: number): { x: number; y: number } {
  return { x: (lon - MAP.lon0) * MAP.k, y: (MAP.lat1 - lat) * MAP.k };
}
export const inMap = (lon: number, lat: number): boolean =>
  lon >= MAP.lon0 && lon <= MAP.lon1 && lat >= MAP.lat0 && lat <= MAP.lat1;

export type Region = 'all' | 'africa' | 'europe' | 'asia';
/** [lon0, lon1, lat0, lat1] of each view. */
export const REGIONS: Record<Region, [number, number, number, number]> = {
  all: [-25, 150, -40, 62],
  africa: [-20, 55, -37, 40],
  europe: [-14, 62, 24, 58],
  asia: [60, 150, -16, 40],
};
export function viewBoxOf(r: Region): [number, number, number, number] {
  const [lon0, lon1, lat0, lat1] = REGIONS[r];
  const a = project(lon0, lat1);
  const b = project(lon1, lat0);
  return [a.x, a.y, b.x - a.x, b.y - a.y];
}

/** Colour bands by the middle of the age range (Ma). */
export const AGE_BANDS = [
  { id: 'b1', min: 4, color: '#9b7bd9' },
  { id: 'b2', min: 2, color: '#5aa9e6' },
  { id: 'b3', min: 0.7, color: '#2fb59a' },
  { id: 'b4', min: 0.2, color: '#f2a541' },
  { id: 'b5', min: 0, color: '#e5645b' },
] as const;
export function bandOf(ma: number): (typeof AGE_BANDS)[number] {
  return AGE_BANDS.find((b) => ma >= b.min) ?? AGE_BANDS[AGE_BANDS.length - 1]!;
}
export const siteColor = (s: HomininSite): string => bandOf(siteMidpoint(s)).color;

/** "7.2–6.8 Ma", "315 ± 34 ka", "≥ 233 ± 22 ka", "~ 3.18 Ma". */
export function formatSiteAge(s: HomininSite, lang: string): string {
  const { from, to, err, minimum, approx } = s.age;
  const unit = from >= 1 ? 'Ma' : 'ka';
  const f = from >= 1 ? 1 : 1000;
  const n = (v: number) => new Intl.NumberFormat(lang, { maximumFractionDigits: 3 }).format(Math.round(v * f * 1e6) / 1e6);
  const prefix = `${minimum ? '≥ ' : ''}${approx ? '~ ' : ''}`;
  if (to !== undefined) return `${prefix}${n(from)}–${n(to)} ${unit}`;
  if (err !== undefined) return `${prefix}${n(from)} ± ${n(err)} ${unit}`;
  return `${prefix}${n(from)} ${unit}`;
}

/** Older and younger bounds of the bar drawn for a site. */
export function siteBounds(s: HomininSite): [number, number] {
  const { from, to, err } = s.age;
  if (to !== undefined) return [from, to];
  if (err !== undefined) return [from + err, from - err];
  return [from, from];
}

/**
 * Moves points apart until none is closer than `min` to another (positions in screen pixels).
 * Used so that pins of nearby sites can be told apart; leader lines join each pin to its true position.
 */
export function relax(points: ReadonlyArray<{ x: number; y: number }>, min: number, iterations = 80): Array<{ x: number; y: number }> {
  const p = points.map((q, i) => ({ x: q.x + ((i % 3) - 1) * 0.01, y: q.y + (i % 2) * 0.01 }));
  for (let it = 0; it < iterations; it++) {
    for (let i = 0; i < p.length; i++) {
      for (let j = i + 1; j < p.length; j++) {
        const dx = p[j]!.x - p[i]!.x;
        const dy = p[j]!.y - p[i]!.y;
        const d = Math.hypot(dx, dy);
        if (d >= min) continue;
        const push = (min - d) / 2;
        const ux = d === 0 ? 1 : dx / d;
        const uy = d === 0 ? 0 : dy / d;
        p[i]!.x -= ux * push; p[i]!.y -= uy * push;
        p[j]!.x += ux * push; p[j]!.y += uy * push;
      }
    }
  }
  return p;
}
