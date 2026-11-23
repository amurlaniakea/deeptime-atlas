// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import { describe, expect, it } from 'vitest';
import {
  T0_GYR, T0_S, YEAR_S, ageAtRedshift, calendarFraction, calendarLabel, formatCosmicTime, formatYears,
  lookbackYears, resolveTime, superscript,
} from '../src/lib/cosmology';

describe('cosmic time model', () => {
  it('reproduces the published age of the universe from the published parameters', () => {
    // Planck 2018 VI Table 2 (+BAO): 13.787 ± 0.020 Gyr. A self-consistency check of the integrator and constants.
    expect(Math.abs(ageAtRedshift(0) - T0_GYR)).toBeLessThan(0.01);
  });
  it('puts recombination (z = 1089.80) about 372 thousand years after the Big Bang', () => {
    const years = ageAtRedshift(1089.8) * 1e9;
    expect(years).toBeGreaterThan(365e3);
    expect(years).toBeLessThan(380e3);
  });
  it('puts matter-radiation equality (z = 3387) at about 51 thousand years', () => {
    const years = ageAtRedshift(3387) * 1e9;
    expect(years).toBeGreaterThan(48e3);
    expect(years).toBeLessThan(54e3);
  });
  it('agrees with the 280 Myr stated by the source for a galaxy at z = 14.44', () => {
    const years = ageAtRedshift(14.44) * 1e9;
    expect(Math.abs(years - 280e6)).toBeLessThan(5e6);
  });
  it('resolves lookback times against the age of the universe', () => {
    const r = resolveTime({ kind: 'lookback', years: 4567.3e6, err: 0.16e6 });
    expect(r.seconds / YEAR_S / 1e9).toBeCloseTo(T0_GYR - 4.5673, 6);
    expect(r.hi).toBeGreaterThan(r.lo);
    expect(lookbackYears(r.seconds)).toBeCloseTo(4567.3e6, -3);
  });
  it('propagates the redshift uncertainty to a time interval', () => {
    const r = resolveTime({ kind: 'redshift', z: 7.82, err: 0.71 });
    expect(r.lo).toBeLessThan(r.seconds);
    expect(r.hi).toBeGreaterThan(r.seconds);
  });
});

describe('formatting', () => {
  it('formats times across the whole scale', () => {
    expect(formatCosmicTime(5.391247e-44, 'en')).toBe('5.39 × 10⁻⁴⁴ s');
    expect(formatCosmicTime(180, 'en')).toBe('3 min');
    expect(formatCosmicTime(372e3 * YEAR_S, 'en')).toBe('372 kyr');
    expect(formatCosmicTime(283e6 * YEAR_S, 'en')).toBe('283 Myr');
    expect(formatCosmicTime(9.22e9 * YEAR_S, 'en')).toBe('9.22 Gyr');
    expect(formatYears(11.7e3, 'es')).toBe('11,7 kyr');
    expect(superscript(-44)).toBe('⁻⁴⁴');
  });
});

describe('cosmic calendar', () => {
  it('starts on 1 January and ends on 31 December', () => {
    expect(calendarLabel(1e-20, 'en')).toContain('January 1, 00:00:00');
    expect(calendarLabel(T0_S, 'en')).toBe('December 31, 24:00:00');
  });
  it('places the Solar System on 2 September (CAIs 4567.30 Ma)', () => {
    const s = resolveTime({ kind: 'lookback', years: 4567.3e6 }).seconds;
    expect(calendarLabel(s, 'en')).toMatch(/^September 2,/);
    expect(calendarFraction(s)).toBeGreaterThan(0.66);
    expect(calendarFraction(s)).toBeLessThan(0.67);
  });
  it('places the start of the Holocene in the last minute of the year', () => {
    const s = resolveTime({ kind: 'lookback', years: 11700 }).seconds;
    expect(calendarLabel(s, 'en')).toMatch(/^December 31, 23:59:/);
  });
});
