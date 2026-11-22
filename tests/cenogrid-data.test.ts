// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import { describe, expect, it } from 'vitest';
import raw from '../src/data/cenogrid.json';
import type { CenogridFile } from '../src/data/types';

const cenogrid = raw as unknown as CenogridFile;

// Fails until the real series has been generated with `npm run build:data` (see CONTRIBUTING.md).
describe('CENOGRID series (src/data/cenogrid.json)', () => {
  it('has been generated from the PANGAEA file', () => {
    expect(cenogrid.rows.length, 'run: npm run build:data').toBeGreaterThan(900);
    expect(cenogrid.input?.sha256).toMatch(/^[0-9a-f]{64}$/);
    expect(cenogrid.generated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it('carries the citation, DOIs and the CC BY 4.0 licence', () => {
    expect(cenogrid.source.doi).toBe('10.1594/PANGAEA.917717');
    expect(cenogrid.source.seriesDoi).toBe('10.1594/PANGAEA.917503');
    expect(cenogrid.source.paperDoi).toBe('10.1126/science.aba6853');
    expect(cenogrid.source.license).toBe('CC-BY-4.0');
  });
  it('covers 0 to 67.1 Ma in ascending order with finite values in a plausible range', () => {
    const rows = cenogrid.rows;
    expect(rows[0]![0]).toBe(0);
    expect(rows.at(-1)![0]).toBe(67.1);
    for (let i = 0; i < rows.length; i++) {
      const [age, a, b] = rows[i]!;
      if (i > 0) expect(age).toBeGreaterThan(rows[i - 1]![0]);
      expect(Number.isFinite(a) && Number.isFinite(b)).toBe(true);
      expect(a).toBeGreaterThan(-3);
      expect(a).toBeLessThan(8);
      expect(b).toBeGreaterThan(-3);
      expect(b).toBeLessThan(8);
    }
  });
});
