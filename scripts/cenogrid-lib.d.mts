// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
export function parsePangaea(text: string): { header: string[]; rows: string[][] };
export function targetAges(): number[];
export function buildSeries(
  header: string[],
  rows: string[][],
): {
  rows: Array<[number, number, number]>;
  stats: { dataRows: number; selected: number; skipped: number; ageMin: number; ageMax: number; d18oMin: number; d18oMax: number };
};
