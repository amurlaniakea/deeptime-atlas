// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
export type Row = readonly [number, number, number];

/** Row whose age is closest to `age` (rows sorted by ascending age). */
export function nearestRow(rows: readonly Row[], age: number): Row | undefined {
  if (rows.length === 0) return undefined;
  let lo = 0;
  let hi = rows.length - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (rows[mid]![0] < age) lo = mid;
    else hi = mid;
  }
  const a = rows[lo]!;
  const b = rows[hi]!;
  return Math.abs(a[0] - age) <= Math.abs(b[0] - age) ? a : b;
}

/** Value range of both series, padded to whole permil. */
export function valueRange(rows: readonly Row[]): { min: number; max: number } {
  let min = Infinity;
  let max = -Infinity;
  for (const r of rows) {
    min = Math.min(min, r[1], r[2]);
    max = Math.max(max, r[1], r[2]);
  }
  return { min: Math.floor(min), max: Math.ceil(max) };
}

/** Evenly spaced "nice" ticks between two ages, every `step`. */
export function ticks(from: number, to: number, step: number): number[] {
  const out: number[] = [];
  for (let v = Math.ceil(from / step) * step; v <= to + 1e-9; v += step) out.push(Math.round(v * 1000) / 1000);
  return out;
}
