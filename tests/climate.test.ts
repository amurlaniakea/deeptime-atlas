// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import { describe, expect, it } from 'vitest';
import { CLIMATE_MARKS, CLIMATE_STATES } from '../src/data/climate';
import { SOURCES_BY_ID } from '../src/data/sources';
import { nearestRow, ticks, valueRange, type Row } from '../src/lib/climate';

describe('climate states', () => {
  it('tile 66 Ma to today without gaps or overlaps, oldest first', () => {
    expect(CLIMATE_STATES[0]!.startMa).toBe(66);
    expect(CLIMATE_STATES.at(-1)!.endMa).toBe(0);
    CLIMATE_STATES.forEach((st, i) => {
      expect(st.startMa, st.phaseId).toBeGreaterThan(st.endMa);
      if (i > 0) expect(st.startMa, st.phaseId).toBe(CLIMATE_STATES[i - 1]!.endMa);
    });
  });
  it('are the four states, the Warmhouse having two phases', () => {
    const ids = CLIMATE_STATES.map((s) => s.id);
    expect(new Set(ids)).toEqual(new Set(['hothouse', 'warmhouse', 'coolhouse', 'icehouse']));
    expect(ids.filter((i) => i === 'warmhouse').length).toBe(2);
    expect(new Set(CLIMATE_STATES.map((s) => s.phaseId)).size).toBe(CLIMATE_STATES.length);
  });
  it('cite existing sources and have text in es, en and fr', () => {
    for (const st of CLIMATE_STATES) {
      for (const src of st.sources) expect(SOURCES_BY_ID.has(src), st.phaseId).toBe(true);
      for (const l of ['es', 'en', 'fr'] as const) {
        expect(st.names[l].length).toBeGreaterThan(3);
        expect(st.summary[l].length).toBeGreaterThan(40);
      }
      expect(st.color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });
});

describe('climate marks', () => {
  it('are ordered from oldest to youngest and cite existing sources', () => {
    CLIMATE_MARKS.forEach((m, i) => {
      if (i > 0) expect(m.ageMa, m.id).toBeLessThan(CLIMATE_MARKS[i - 1]!.ageMa);
      for (const src of m.sources) expect(SOURCES_BY_ID.has(src), m.id).toBe(true);
      for (const l of ['es', 'en', 'fr'] as const) expect(m.names[l].length).toBeGreaterThan(5);
    });
  });
  it('agree with the boundaries of the climate states', () => {
    const age = (id: string) => CLIMATE_MARKS.find((m) => m.id === id)!.ageMa;
    expect(age('petm')).toBe(CLIMATE_STATES.find((s) => s.id === 'hothouse')!.startMa);
    expect(age('eeco-end')).toBe(CLIMATE_STATES.find((s) => s.id === 'hothouse')!.endMa);
    expect(Math.abs(age('eot') - CLIMATE_STATES.find((s) => s.id === 'coolhouse')!.startMa)).toBeLessThan(0.1);
    expect(age('m2')).toBe(CLIMATE_STATES.find((s) => s.id === 'icehouse')!.startMa);
  });
});

describe('chart helpers', () => {
  const rows: Row[] = [[0, 3, 3.1], [1, 2.5, 2.6], [2, 2, 2.1], [10, 1, 1.1]];
  it('finds the nearest row', () => {
    expect(nearestRow(rows, 0.4)![0]).toBe(0);
    expect(nearestRow(rows, 1.6)![0]).toBe(2);
    expect(nearestRow(rows, 7)![0]).toBe(10);
    expect(nearestRow(rows, -5)![0]).toBe(0);
    expect(nearestRow([], 1)).toBeUndefined();
  });
  it('pads the value range to whole permil', () => {
    expect(valueRange(rows)).toEqual({ min: 1, max: 4 });
  });
  it('builds ticks', () => {
    expect(ticks(0, 67.1, 10)).toEqual([0, 10, 20, 30, 40, 50, 60]);
  });
});
