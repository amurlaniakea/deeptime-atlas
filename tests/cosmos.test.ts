// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import { describe, expect, it } from 'vitest';
import { COSMIC_BANDS, COSMIC_EVENTS } from '../src/data/cosmos';
import { SOURCES_BY_ID } from '../src/data/sources';
import { RAW_UNITS } from '../src/data/units';
import { T0_S, YEAR_S, resolveTime } from '../src/lib/cosmology';
import { buildTree } from '../src/lib/timescale';

const tree = buildTree(RAW_UNITS);
const resolved = COSMIC_EVENTS.map((e) => ({ e, r: resolveTime(e.time) }));

describe('cosmic events', () => {
  it('have unique ids, existing sources and text in es, en and fr', () => {
    expect(new Set(COSMIC_EVENTS.map((e) => e.id)).size).toBe(COSMIC_EVENTS.length);
    for (const e of COSMIC_EVENTS) {
      expect(['consensus', 'debated', 'hypothesis']).toContain(e.certainty);
      expect(e.sources.length, e.id).toBeGreaterThan(0);
      for (const s of e.sources) expect(SOURCES_BY_ID.has(s), `${e.id} -> ${s}`).toBe(true);
      for (const l of ['es', 'en', 'fr'] as const) {
        expect(e.names[l].length, `${e.id}.name.${l}`).toBeGreaterThanOrEqual(3);
        expect(e.summary[l].length, `${e.id}.summary.${l}`).toBeGreaterThan(60);
      }
    }
  });
  it('are listed in strictly increasing time and end today', () => {
    resolved.forEach(({ e, r }, i) => {
      if (i > 0) expect(r.seconds, e.id).toBeGreaterThan(resolved[i - 1]!.r.seconds);
      expect(r.seconds, e.id).toBeGreaterThan(0);
      expect(r.seconds, e.id).toBeLessThanOrEqual(T0_S);
    });
    expect(resolved.at(-1)!.e.id).toBe('now');
  });
  it('cross-check computed times with the times stated by their sources', () => {
    for (const { e, r } of resolved) {
      if (e.statedYears === undefined) continue;
      expect(Math.abs(r.seconds / YEAR_S - e.statedYears) / e.statedYears, e.id).toBeLessThan(0.03);
    }
  });
  it('only the Planck time is a pure hypothesis', () => {
    expect(COSMIC_EVENTS.filter((e) => e.certainty === 'hypothesis').map((e) => e.id)).toEqual(['planck-time']);
  });
  it('geological links point to existing units whose base matches the event', () => {
    for (const { e, r } of resolved) {
      if (!e.link) continue;
      const u = tree.get(e.link);
      expect(u, `${e.id} -> ${e.link}`).toBeDefined();
      const eventMa = (T0_S - r.seconds) / YEAR_S / 1e6;
      // ICS ages of the base of the unit and the event age must agree within 0.5% or 0.05 Ma
      expect(Math.abs(eventMa - u!.startMa), e.id).toBeLessThan(Math.max(0.05, u!.startMa * 0.005));
    }
  });
  it('the order of events follows the cosmic story', () => {
    const ids = COSMIC_EVENTS.map((e) => e.id);
    const before = (a: string, b: string) => expect(ids.indexOf(a)).toBeLessThan(ids.indexOf(b));
    before('bbn', 'recombination');
    before('recombination', 'earliest-galaxy');
    before('milky-way-disc', 'solar-system');
    before('solar-system', 'moon');
    before('moon', 'phanerozoic');
  });
});

describe('cosmic bands', () => {
  it('chain from the Big Bang to today through existing events', () => {
    expect(COSMIC_BANDS[0]!.from).toBeNull();
    expect(COSMIC_BANDS.at(-1)!.to).toBeNull();
    COSMIC_BANDS.forEach((b, i) => {
      if (i > 0) expect(b.from, b.id).toBe(COSMIC_BANDS[i - 1]!.to);
      for (const id of [b.from, b.to]) if (id) expect(COSMIC_EVENTS.some((e) => e.id === id), b.id).toBe(true);
      expect(b.color).toMatch(/^#[0-9a-f]{6}$/i);
      for (const l of ['es', 'en', 'fr'] as const) expect(b.summary[l].length).toBeGreaterThan(30);
    });
  });
});
