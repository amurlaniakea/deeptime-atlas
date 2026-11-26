// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import { describe, expect, it } from 'vitest';
import { HOMININ_SITES, siteMidpoint } from '../src/data/hominins';
import { SOURCES_BY_ID } from '../src/data/sources';
import { RAW_UNITS } from '../src/data/units';
import { LAND_PATH, MAP } from '../src/data/worldmap';
import { AGE_BANDS, bandOf, formatSiteAge, inMap, project, relax, siteBounds, viewBoxOf } from '../src/lib/hominins';
import { buildTree } from '../src/lib/timescale';

const tree = buildTree(RAW_UNITS);
const site = (id: string) => HOMININ_SITES.find((s) => s.id === id)!;

describe('hominin sites data', () => {
  it('have unique ids, existing sources and text in es, en and fr', () => {
    expect(new Set(HOMININ_SITES.map((s) => s.id)).size).toBe(HOMININ_SITES.length);
    for (const s of HOMININ_SITES) {
      expect(s.sources.length, s.id).toBeGreaterThan(0);
      for (const src of s.sources) expect(SOURCES_BY_ID.has(src), `${s.id} -> ${src}`).toBe(true);
      expect(s.taxa.length, s.id).toBeGreaterThan(5);
      for (const l of ['es', 'en', 'fr'] as const) {
        expect(s.names[l].length, `${s.id}.name.${l}`).toBeGreaterThan(3);
        expect(s.place[l].length, `${s.id}.place.${l}`).toBeGreaterThan(3);
        expect(s.country[l].length, `${s.id}.country.${l}`).toBeGreaterThan(3);
        expect(s.summary[l].length, `${s.id}.summary.${l}`).toBeGreaterThan(60);
      }
    }
  });
  it('are ordered from the oldest to the youngest by the middle of their age range', () => {
    HOMININ_SITES.forEach((s, i) => { if (i > 0) expect(siteMidpoint(s), s.id).toBeLessThan(siteMidpoint(HOMININ_SITES[i - 1]!)); });
  });
  it('have ordered age ranges and are linked to a geological unit that contains their age', () => {
    for (const s of HOMININ_SITES) {
      if (s.age.to !== undefined) expect(s.age.to, s.id).toBeLessThan(s.age.from);
      const u = tree.get(s.link);
      expect(u, `${s.id} -> ${s.link}`).toBeDefined();
      const mid = siteMidpoint(s);
      expect(mid, s.id).toBeLessThanOrEqual(u!.startMa);
      expect(mid, s.id).toBeGreaterThanOrEqual(u!.endMa);
    }
  });
  it('have coordinates inside the map and in the right part of the world', () => {
    const box: Record<string, [number, number, number, number]> = {
      toumai: [14, 18, 15, 19], ardi: [9, 12, 39, 42], lucy: [9, 12, 39, 42], 'ledi-geraru': [9, 13, 39, 43],
      dmanisi: [40, 42, 43, 46], 'sima-elefante': [42, 43, -4, -3], 'gran-dolina': [42, 43, -4, -3], 'sima-huesos': [42, 43, -4, -3],
      'jebel-irhoud': [31, 33, -10, -8], 'rising-star': [-27, -25, 27, 29], 'omo-kibish': [4, 7, 35, 37], 'liang-bua': [-9, -8, 120, 121],
    };
    for (const s of HOMININ_SITES) {
      expect(inMap(s.lon, s.lat), s.id).toBe(true);
      const [la0, la1, lo0, lo1] = box[s.id]!;
      expect(s.lat, s.id).toBeGreaterThanOrEqual(la0);
      expect(s.lat, s.id).toBeLessThanOrEqual(la1);
      expect(s.lon, s.id).toBeGreaterThanOrEqual(lo0);
      expect(s.lon, s.id).toBeLessThanOrEqual(lo1);
    }
  });
  it('the three Atapuerca sites share the UNESCO coordinates and the Toumaï ones come from the paper', () => {
    for (const id of ['sima-elefante', 'gran-dolina', 'sima-huesos']) {
      expect(site(id).coords).toBe('unesco');
      expect(site(id).lat).toBeCloseTo(42.371, 3);
      expect(site(id).lon).toBeCloseTo(-3.547, 3);
      expect(site(id).sources).toContain('unesco-atapuerca');
    }
    expect(site('toumai').coords).toBe('paper');
  });
  it('marks the debated cases as such', () => {
    for (const id of ['toumai', 'ledi-geraru', 'dmanisi']) expect(site(id).certainty, id).toBe('debated');
  });
});

describe('hominin map helpers', () => {
  it('projects longitude and latitude into the cropped map', () => {
    expect(project(MAP.lon0, MAP.lat1)).toEqual({ x: 0, y: 0 });
    const br = project(MAP.lon1, MAP.lat0);
    expect(br.x).toBe(MAP.width);
    expect(br.y).toBe(MAP.height);
    expect(inMap(0, 0)).toBe(true);
    expect(inMap(-100, 0)).toBe(false);
  });
  it('has views with a positive size inside the map', () => {
    for (const r of ['all', 'africa', 'europe', 'asia'] as const) {
      const [x, y, w, h] = viewBoxOf(r);
      expect(w, r).toBeGreaterThan(0);
      expect(h, r).toBeGreaterThan(0);
      expect(x, r).toBeGreaterThanOrEqual(0);
      expect(y, r).toBeGreaterThanOrEqual(0);
      expect(x + w, r).toBeLessThanOrEqual(MAP.width + 1e-6);
      expect(y + h, r).toBeLessThanOrEqual(MAP.height + 1e-6);
    }
    expect(LAND_PATH.startsWith('M')).toBe(true);
    expect(LAND_PATH.length).toBeGreaterThan(10000);
  });
  it('colours by age band', () => {
    expect(AGE_BANDS.length).toBe(5);
    expect(bandOf(7).id).toBe('b1');
    expect(bandOf(3).id).toBe('b2');
    expect(bandOf(1).id).toBe('b3');
    expect(bandOf(0.4).id).toBe('b4');
    expect(bandOf(0.08).id).toBe('b5');
  });
  it('formats ages as printed by the sources', () => {
    expect(formatSiteAge(site('toumai'), 'en')).toBe('7.2–6.8 Ma');
    expect(formatSiteAge(site('dmanisi'), 'en')).toBe('1.85–1.78 Ma');
    expect(formatSiteAge(site('jebel-irhoud'), 'en')).toBe('315 ± 34 ka');
    expect(formatSiteAge(site('omo-kibish'), 'en')).toBe('≥ 233 ± 22 ka');
    expect(formatSiteAge(site('lucy'), 'en')).toBe('~ 3.18 Ma');
    expect(formatSiteAge(site('gran-dolina'), 'es')).toBe('860–780 ka');
    expect(siteBounds(site('jebel-irhoud'))[0]).toBeCloseTo(0.349, 6);
  });
  it('moves overlapping pins apart', () => {
    const pts = [{ x: 100, y: 100 }, { x: 100, y: 100 }, { x: 100, y: 100 }, { x: 300, y: 50 }];
    const out = relax(pts, 22);
    for (let i = 0; i < out.length; i++) for (let j = i + 1; j < out.length; j++) {
      expect(Math.hypot(out[i]!.x - out[j]!.x, out[i]!.y - out[j]!.y)).toBeGreaterThan(20);
    }
    expect(Math.hypot(out[3]!.x - 300, out[3]!.y - 50)).toBeLessThan(1);
  });
});
