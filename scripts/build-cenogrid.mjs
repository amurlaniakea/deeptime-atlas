#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
// Usage: node scripts/build-cenogrid.mjs [path/to/cenogrid_S34.tab]
// Reads the PANGAEA export of CENOGRID S34 and writes src/data/cenogrid.json.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSeries, parsePangaea } from './cenogrid-lib.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const input = resolve(process.argv[2] ?? resolve(root, 'data-raw/cenogrid_S34.tab'));
const buf = readFileSync(input);
const text = buf.toString('utf-8');
const { header, rows } = parsePangaea(text);
const { rows: series, stats } = buildSeries(header, rows);

const out = {
  source: {
    citation:
      'Westerhold, T. (2020). S34. Binned and LOESS smoothed Cenozoic deep-sea benthic foraminifer stable carbon and oxygen isotope reference splice. PANGAEA. In: Westerhold, T. (2020): Cenozoic global reference benthic carbon and oxygen isotope dataset (CENOGRID).',
    doi: '10.1594/PANGAEA.917717',
    seriesDoi: '10.1594/PANGAEA.917503',
    paperDoi: '10.1126/science.aba6853',
    license: 'CC-BY-4.0',
    changes:
      'Rows of columns ISOBENd18oLOESSsmooth (20 kyr) and ISOBENd18oLOESSsmoothLongTerm (1 Myr) were selected at 20 kyr (0-5 Ma), 50 kyr (5-34.05 Ma) and 100 kyr (34.1-67.1 Ma) intervals and rounded to 3 decimals. No other processing.',
  },
  input: {
    file: input.split(/[\\/]/).pop(),
    sha256: createHash('sha256').update(buf).digest('hex'),
    bytes: buf.length,
    dataRows: rows.length,
  },
  generated: new Date().toISOString().slice(0, 10),
  columns: ['ageMa', 'd18oSmooth20kyr', 'd18oTrend1Myr'],
  unit: '‰ VPDB',
  rows: series,
};
const target = resolve(root, 'src/data/cenogrid.json');
writeFileSync(target, JSON.stringify(out) + '\n', 'utf-8');

console.log('input      :', input);
console.log('sha256     :', out.input.sha256);
console.log('data rows  :', stats.dataRows, '| selected:', stats.selected, '| skipped:', stats.skipped);
console.log('age range  :', stats.ageMin, '-', stats.ageMax, 'Ma');
console.log('d18O range :', stats.d18oMin, '-', stats.d18oMax);
console.log('first rows :', JSON.stringify(series.slice(0, 3)));
console.log('last rows  :', JSON.stringify(series.slice(-3)));
console.log('written    :', target, `(${(JSON.stringify(out).length / 1024).toFixed(1)} KiB)`);
