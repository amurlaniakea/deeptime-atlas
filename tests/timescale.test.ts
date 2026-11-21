// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import { describe, expect, it } from 'vitest';
import { RAW_UNITS } from '../src/data/units';
import {
  ROOT_ID, buildTree, clockLabel, coreParentId, formatAge, formatAgeErr, formatShare, isAncestor,
  lerpWindow, luminance, pathTo, textColorFor,
} from '../src/lib/timescale';

const tree = buildTree(RAW_UNITS);

describe('formatting', () => {
  it('formats Ma and ka by locale', () => {
    expect(formatAge(538.8, 'en', 'present')).toBe('538.8 Ma');
    expect(formatAge(538.8, 'es', 'actualidad')).toBe('538,8 Ma');
    expect(formatAge(0.0117, 'en', 'present')).toBe('11.7 ka');
    expect(formatAge(0.774, 'en', 'present')).toBe('774 ka');
    expect(formatAge(0, 'fr', "aujourd'hui")).toBe("aujourd'hui");
  });
  it('formats uncertainties in the same unit as the age', () => {
    expect(formatAgeErr(538.8, 0.6, 'en', 'present')).toBe('538.8 ± 0.6 Ma');
    expect(formatAgeErr(251.902, 0.024, 'en', 'present')).toBe('251.902 ± 0.024 Ma');
    expect(formatAgeErr(66, undefined, 'en', 'present')).toBe('66 Ma');
  });
  it('formats shares of Earth history', () => {
    expect(formatShare(538.8 / 4567, 'en')).toBe('12%');
  });
});

describe('24 h clock', () => {
  it('maps Earth history to a day', () => {
    expect(clockLabel(4567)).toBe('00:00:00');
    expect(clockLabel(4567 / 2)).toBe('12:00:00');
    expect(clockLabel(538.8)).toBe('21:10:07');
    expect(clockLabel(0.0117)).toBe('23:59:59.8');
  });
});

describe('tree helpers', () => {
  it('resolves paths and ancestry', () => {
    expect(pathTo(tree, 'meghalayan').map((u) => u.id)).toEqual([
      ROOT_ID, 'phanerozoic', 'cenozoic', 'quaternary', 'holocene', 'meghalayan',
    ]);
    expect(isAncestor(tree, 'cenozoic', 'holocene')).toBe(true);
    expect(isAncestor(tree, 'holocene', 'holocene')).toBe(false);
  });
  it('shows a leaf together with its siblings', () => {
    expect(coreParentId(tree, 'meghalayan')).toBe('holocene');
    expect(coreParentId(tree, 'holocene')).toBe('holocene');
    expect(coreParentId(tree, 'hadean')).toBe(ROOT_ID);
  });
  it('derives computed boundaries from the data', () => {
    expect(tree.get('phanerozoic')!.endMa).toBe(0);
    expect(tree.get('proterozoic')!.endMa).toBe(538.8);
    expect(tree.get('hadean')!.endMa).toBe(4031);
    expect(tree.get('holocene')!.children).toEqual(['greenlandian', 'northgrippian', 'meghalayan']);
  });
});

describe('view helpers', () => {
  it('interpolates the zoom window between its endpoints', () => {
    const from = { a: 0, b: 4567 };
    const to = { a: 0, b: 538.8 };
    expect(lerpWindow(from, to, 0)).toEqual(from);
    const end = lerpWindow(from, to, 1);
    expect(end.a).toBeCloseTo(0, 9);
    expect(end.b).toBeCloseTo(538.8, 9);
    const mid = lerpWindow(from, to, 0.5);
    expect(mid.b - mid.a).toBeGreaterThan(538.8);
    expect(mid.b - mid.a).toBeLessThan(4567);
  });
  it('picks readable text colours', () => {
    expect(textColorFor('#812B92')).toBe('#FFFFFF');
    expect(textColorFor('#FFFF00')).toBe('#16202A');
    expect(luminance('#FFFFFF')).toBeCloseTo(1, 5);
  });
});
