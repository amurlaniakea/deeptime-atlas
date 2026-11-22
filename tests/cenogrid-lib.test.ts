// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import { describe, expect, it } from 'vitest';
import { buildSeries, parsePangaea, targetAges } from '../scripts/cenogrid-lib.mjs';

// Synthetic fixture with the same layout as the PANGAEA export of S34 (values are invented for testing only).
const HEADER = [
  'Tuned time [Ma]',
  'Foram benth [#] (ISOBENbinned_d13Ccount)',
  'Foram benth δ13C [‰ PDB] (ISOBENbinned_d13C)',
  'Foram benth δ13C [‰ PDB] (ISOBENbinned_d13Cinterp)',
  'Foram benth [#] (ISOBENbinned_d18Ocount)',
  'Foram benth δ18O [‰ PDB] (ISOBENbinned_d18O)',
  'Foram benth δ18O [‰ PDB] (ISOBENbinned_d18Ointerp)',
  'Foram benth δ13C [‰ PDB] (ISOBENd13cLOESSsmooth)',
  'Foram benth δ18O [‰ PDB] (ISOBENd18oLOESSsmooth)',
  'Comment (error)',
  'Foram benth δ13C [‰ PDB] (ISOBENd13cLOESSsmoothLongTerm)',
  'Foram benth δ18O [‰ PDB] (ISOBENd18oLOESSsmoothLongTerm)',
  'Comment (ISOBENLOESSsmooth_pts)',
].join('\t');

function fixture(): string {
  const rows: string[] = [];
  for (let m = 0; m <= 34026; m += 2) rows.push(row(m / 1000));
  rows.push(row(34.03));
  for (let m = 34035; m <= 67100; m += 5) rows.push(row(m / 1000));
  return ['/* DATA DESCRIPTION:', 'Citation: test', '*/', HEADER, ...rows, ''].join('\n');
}
function row(age: number): string {
  const short = (1 + age / 20).toFixed(3);
  const long = (2 + age / 40).toFixed(3);
  return [age.toFixed(3), '1', '0.1', '0.1', '1', '3', '3', '0.2', short, '10pts smooth', '0.3', long, '500pts smooth'].join('\t');
}

describe('PANGAEA parsing', () => {
  it('splits metadata, header and data rows', () => {
    const { header, rows } = parsePangaea(fixture());
    expect(header.length).toBe(13);
    expect(rows[0]![0]).toBe('0.000');
    expect(rows.at(-1)![0]).toBe('67.100');
  });
  it('fails clearly when the terminator is missing', () => {
    expect(() => parsePangaea('no metadata here')).toThrow(/terminator/);
  });
});

describe('series selection', () => {
  const { header, rows } = parsePangaea(fixture());
  const { rows: series, stats } = buildSeries(header, rows);

  it('has the expected target ages, in ascending order, from 0 to 67.1 Ma', () => {
    const targets = targetAges();
    expect(series.length).toBe(targets.length);
    expect(series[0]![0]).toBe(0);
    expect(series.at(-1)![0]).toBe(67.1);
    for (let i = 1; i < series.length; i++) expect(series[i]![0]).toBeGreaterThan(series[i - 1]![0]);
    expect(stats.skipped).toBe(0);
  });
  it('copies the published values without altering them (only rounding)', () => {
    const at = (age: number) => series.find((r) => r[0] === age)!;
    expect(at(1)[1]).toBeCloseTo(1 + 1 / 20, 3);
    expect(at(1)[2]).toBeCloseTo(2 + 1 / 40, 3);
    expect(at(60)[1]).toBeCloseTo(1 + 60 / 20, 3);
  });
  it('rejects a file without the expected columns', () => {
    expect(() => buildSeries(['Tuned time [Ma]', 'x'], [['0', '1']])).toThrow(/Expected exactly one column/);
  });
  it('uses a bounded number of points', () => {
    expect(series.length).toBeGreaterThan(900);
    expect(series.length).toBeLessThan(1500);
  });
});
