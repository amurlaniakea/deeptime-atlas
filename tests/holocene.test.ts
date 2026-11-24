// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import { describe, expect, it } from 'vitest';
import { ANTHROPOCENE_PANEL, HOLOCENE_STAGES, HOLO_EVENTS, yearFromB2k } from '../src/data/holocene';
import { SOURCES_BY_ID } from '../src/data/sources';
import { RAW_UNITS } from '../src/data/units';
import { DICTS } from '../src/i18n';
import { buildTree } from '../src/lib/timescale';
import { ageAtYear, formatYear } from '../src/ui/holocene';

const tree = buildTree(RAW_UNITS);

describe('Holocene ages', () => {
  it('match the ratified GSSP ages and the ICS chart units', () => {
    expect(HOLOCENE_STAGES.map((s) => s.id)).toEqual(tree.get('holocene')!.children);
    for (const st of HOLOCENE_STAGES) {
      const chartYears = tree.get(st.id)!.startMa * 1e6;
      // the chart rounds to 8.2 and 4.2 ka; the GSSPs are 8236 and 4250 years before 2000
      expect(Math.abs(chartYears - st.baseB2k), st.id).toBeLessThan(100);
    }
  });
  it('are converted to calendar years', () => {
    expect(yearFromB2k(11700)).toBe(-9700);
    expect(ageAtYear(-9000)).toBe('greenlandian');
    expect(ageAtYear(-5000)).toBe('northgrippian');
    expect(ageAtYear(1750)).toBe('meghalayan');
    expect(ageAtYear(-12000)).toBeUndefined();
  });
});

describe('Holocene events', () => {
  it('have unique ids, existing sources and text in es, en and fr', () => {
    expect(new Set(HOLO_EVENTS.map((e) => e.id)).size).toBe(HOLO_EVENTS.length);
    for (const e of HOLO_EVENTS) {
      expect(['climate', 'human', 'anthropocene']).toContain(e.kind);
      expect(['consensus', 'debated', 'hypothesis']).toContain(e.certainty);
      expect(e.sources.length, e.id).toBeGreaterThan(0);
      for (const s of e.sources) expect(SOURCES_BY_ID.has(s), `${e.id} -> ${s}`).toBe(true);
      for (const l of ['es', 'en', 'fr'] as const) {
        expect(e.names[l].length, `${e.id}.name.${l}`).toBeGreaterThan(3);
        expect(e.summary[l].length, `${e.id}.summary.${l}`).toBeGreaterThan(60);
      }
      if (e.to !== undefined) expect(e.to, e.id).toBeGreaterThan(e.from);
    }
  });
  it('are listed in chronological order and start with the Holocene', () => {
    HOLO_EVENTS.forEach((e, i) => { if (i > 0) expect(e.from, e.id).toBeGreaterThanOrEqual(HOLO_EVENTS[i - 1]!.from); });
    expect(HOLO_EVENTS[0]!.id).toBe('holocene-start');
  });
  it('age-defining events sit exactly at the base of their unit', () => {
    const pairs: Array<[string, string]> = [['holocene-start', 'greenlandian'], ['northgrippian-start', 'northgrippian'], ['meghalayan-start', 'meghalayan']];
    for (const [eid, uid] of pairs) {
      const e = HOLO_EVENTS.find((x) => x.id === eid)!;
      const st = HOLOCENE_STAGES.find((x) => x.id === uid)!;
      expect(e.from, eid).toBe(yearFromB2k(st.baseB2k));
      expect(e.link, eid).toBeDefined();
      expect(tree.has(e.link!), eid).toBe(true);
    }
  });
  it('the Göbekli Tepe range is inside the Greenlandian and the Northgrippian, as UNESCO dates it', () => {
    const g = HOLO_EVENTS.find((e) => e.id === 'gobekli-tepe')!;
    expect(g.from).toBe(-9600);
    expect(g.to).toBe(-8200);
    expect(g.from).toBeGreaterThan(yearFromB2k(11700));
  });
  it('Anthropocene entries are marked as debated or as a settled decision, never as a formal unit', () => {
    const a = HOLO_EVENTS.find((e) => e.id === 'anthropocene-proposal')!;
    expect(a.certainty).toBe('debated');
    for (const l of ['es', 'en', 'fr'] as const) expect(ANTHROPOCENE_PANEL.points[0]![l].length).toBeGreaterThan(60);
  });
});

describe('year formatting', () => {
  it('uses BCE/CE labels per language', () => {
    expect(formatYear(-9700, 'en', DICTS.en)).toBe('9700 BCE');
    expect(formatYear(-9700, 'es', DICTS.es)).toBe('9700 a. C.');
    expect(formatYear(-9700, 'fr', DICTS.fr)).toBe('9700 av. J.-C.');
    expect(formatYear(500, 'en', DICTS.en)).toBe('500 CE');
    expect(formatYear(1750, 'en', DICTS.en)).toBe('1750');
  });
});
