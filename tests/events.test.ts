// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import { describe, expect, it } from 'vitest';
import { EVENTS } from '../src/data/events';
import { SOURCES_BY_ID } from '../src/data/sources';
import { EARTH_AGE_MA, RAW_UNITS } from '../src/data/units';
import { buildTree, eventsIn, formatEventAge } from '../src/lib/timescale';

const tree = buildTree(RAW_UNITS);

describe('events dataset', () => {
  it('has unique ids and valid kinds and certainty values', () => {
    expect(new Set(EVENTS.map((e) => e.id)).size).toBe(EVENTS.length);
    for (const e of EVENTS) {
      expect(['extinction', 'glaciation', 'cold-event']).toContain(e.kind);
      expect(['consensus', 'debated']).toContain(e.certainty);
    }
  });

  it('every event cites existing sources and has text in es, en and fr', () => {
    for (const e of EVENTS) {
      expect(e.sources.length, e.id).toBeGreaterThan(0);
      for (const s of e.sources) expect(SOURCES_BY_ID.has(s), `${e.id} -> ${s}`).toBe(true);
      for (const l of ['es', 'en', 'fr'] as const) {
        expect(e.names[l].trim().length, `${e.id}.name.${l}`).toBeGreaterThan(3);
        expect(e.summary[l].trim().length, `${e.id}.summary.${l}`).toBeGreaterThan(60);
      }
    }
  });

  it('ages are ordered and inside Earth history', () => {
    for (const e of EVENTS) {
      expect(e.startMa, e.id).toBeGreaterThan(0);
      expect(e.startMa, e.id).toBeLessThanOrEqual(EARTH_AGE_MA);
      if (e.endMa !== undefined) expect(e.endMa, e.id).toBeLessThan(e.startMa);
      if (e.startErr !== undefined) expect(e.startErr, e.id).toBeGreaterThan(0);
    }
  });

  it('events anchored to a boundary agree with the chart within 0.5 Ma', () => {
    for (const e of EVENTS) {
      if (!e.boundaryUnit) continue;
      const u = tree.get(e.boundaryUnit);
      expect(u, `${e.id} -> ${e.boundaryUnit}`).toBeDefined();
      expect(Math.abs(e.startMa - u!.startMa), e.id).toBeLessThanOrEqual(0.5);
    }
  });

  it('has the Big Five, with the Late Devonian counted as one event in two pulses', () => {
    const big = EVENTS.filter((e) => e.bigFive).map((e) => e.id).sort();
    expect(big).toEqual(['end-cretaceous', 'end-permian', 'end-triassic', 'hangenberg', 'kellwasser', 'late-ordovician']);
  });

  it('the Kellwasser and Hangenberg events are about 13 Myr apart, as the source states', () => {
    const k = EVENTS.find((e) => e.id === 'kellwasser')!;
    const h = EVENTS.find((e) => e.id === 'hangenberg')!;
    expect(k.startMa - h.startMa).toBeGreaterThan(12.5);
    expect(k.startMa - h.startMa).toBeLessThan(13.5);
  });

  it('the Younger Dryas ends where the Holocene begins, within its stated uncertainty plus the 1950/2000 reference shift', () => {
    const yd = EVENTS.find((e) => e.id === 'younger-dryas')!;
    const holocene = tree.get('holocene')!;
    expect(Math.abs(yd.endMa! - holocene.startMa)).toBeLessThan(0.0001);
    expect((yd.startMa - yd.endMa!) * 1e6).toBeGreaterThan(1000);
    expect((yd.startMa - yd.endMa!) * 1e6).toBeLessThan(1400);
  });

  it('every extinction falls inside the Phanerozoic', () => {
    const ph = tree.get('phanerozoic')!;
    for (const e of EVENTS.filter((x) => x.kind === 'extinction')) {
      expect(e.startMa, e.id).toBeLessThanOrEqual(ph.startMa);
    }
  });
});

describe('events by unit', () => {
  it('finds the events that overlap a unit', () => {
    const ids = (u: string) => eventsIn(EVENTS, tree.get(u)!).map((e) => e.id);
    expect(ids('cretaceous')).toContain('end-cretaceous');
    expect(ids('cenozoic')).not.toContain('end-cretaceous');
    expect(ids('permian')).toContain('end-permian');
    expect(ids('cryogenian')).toEqual(['sturtian', 'marinoan']);
    expect(ids('hadean')).toEqual([]);
    expect(ids('late-pleistocene')).toContain('younger-dryas');
    expect(ids('holocene')).not.toContain('younger-dryas');
    expect(ids('greenlandian')).not.toContain('younger-dryas');
    expect(ids('silurian')).not.toContain('late-ordovician');
    expect(eventsIn(EVENTS, tree.get('earth')!).length).toBe(EVENTS.length);
  });
  it('formats point events and intervals', () => {
    const p = EVENTS.find((e) => e.id === 'end-cretaceous')!;
    const i = EVENTS.find((e) => e.id === 'end-permian')!;
    expect(formatEventAge(p, 'en', 'present')).toBe('66.043 ± 0.043 Ma');
    expect(formatEventAge(EVENTS.find((e) => e.id === 'younger-dryas')!, 'en', 'present')).toBe('12.87 ± 0.03 ka – 11.7 ± 0.04 ka');
    expect(formatEventAge(i, 'en', 'present')).toBe('251.941 ± 0.037 Ma – 251.88 ± 0.031 Ma');
  });
});
