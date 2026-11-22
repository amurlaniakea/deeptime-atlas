// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
// Pure helpers to turn the PANGAEA export of CENOGRID dataset S34 into the compact series used by the atlas.
// No value is computed or altered: rows of the published LOESS-smoothed columns are only selected (sub-sampled).

/**
 * Split a PANGAEA ".tab" text into its column names and data rows.
 * The metadata block ends with a line that is exactly "*\/"; the next line holds the column names.
 */
export function parsePangaea(text) {
  const lines = text.split(/\r?\n/);
  const end = lines.findIndex((l) => l.trim() === '*/');
  if (end < 0) throw new Error('PANGAEA metadata terminator "*/" not found');
  const header = (lines[end + 1] ?? '').split('\t');
  const rows = lines.slice(end + 2).filter((l) => l.trim() !== '').map((l) => l.split('\t'));
  return { header, rows };
}

function columnIndex(header, pattern, label) {
  const hits = header.map((h, i) => [h, i]).filter(([h]) => pattern.test(h));
  if (hits.length !== 1) throw new Error(`Expected exactly one column for ${label}, found ${hits.length}`);
  return hits[0][1];
}

/** Target ages in thousandths of Ma: 20 kyr steps to 5 Ma, 50 kyr to 34.05 Ma, 100 kyr to 67.1 Ma. */
export function targetAges() {
  const out = [];
  for (let t = 0; t < 5000; t += 20) out.push(t);
  for (let t = 5000; t <= 34050; t += 50) out.push(t);
  for (let t = 34100; t <= 67100; t += 100) out.push(t);
  return out;
}

const round3 = (v) => Math.round(v * 1000) / 1000;

/**
 * Select rows of the published series at the target ages.
 * Columns used: tuned time, ISOBENd18oLOESSsmooth (20 kyr smooth) and ISOBENd18oLOESSsmoothLongTerm (1 Myr trend).
 */
export function buildSeries(header, rows) {
  const iAge = columnIndex(header, /^Tuned time/, 'tuned time');
  const iShort = columnIndex(header, /\(ISOBENd18oLOESSsmooth\)\s*$/, 'delta18O 20-kyr LOESS');
  const iLong = columnIndex(header, /\(ISOBENd18oLOESSsmoothLongTerm\)\s*$/, 'delta18O 1-Myr LOESS');

  const byMilli = new Map();
  for (const r of rows) {
    const age = Number.parseFloat(r[iAge]);
    if (Number.isFinite(age)) byMilli.set(Math.round(age * 1000), r);
  }
  const keys = [...byMilli.keys()].sort((a, b) => a - b);

  const out = [];
  let skipped = 0;
  for (const target of targetAges()) {
    let key = target;
    if (!byMilli.has(key)) {
      // nearest published row, only if it is within 2.5 kyr (half of the coarsest native step)
      key = keys.reduce((best, k) => (Math.abs(k - target) < Math.abs(best - target) ? k : best), keys[0]);
      if (Math.abs(key - target) > 3) { skipped += 1; continue; }
    }
    const r = byMilli.get(key);
    const short = Number.parseFloat(r[iShort]);
    const long = Number.parseFloat(r[iLong]);
    if (!Number.isFinite(short) || !Number.isFinite(long)) { skipped += 1; continue; }
    out.push([round3(key / 1000), round3(short), round3(long)]);
  }
  const d = out.flatMap((r) => [r[1], r[2]]);
  return {
    rows: out,
    stats: {
      dataRows: rows.length,
      selected: out.length,
      skipped,
      ageMin: out[0]?.[0],
      ageMax: out[out.length - 1]?.[0],
      d18oMin: Math.min(...d),
      d18oMax: Math.max(...d),
    },
  };
}
