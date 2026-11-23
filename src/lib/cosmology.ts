// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
// Cosmic time helpers. Times after the Big Bang of events dated by redshift are computed here in a flat LambdaCDM
// model with the Planck 2018 parameters (TT,TE,EE+lowE+lensing+BAO column of Table 2 of Planck 2018 VI).
import type { CosmicTime } from '../data/types';

export const COSMO = {
  /** km/s/Mpc, Planck 2018 VI Table 2 (+BAO). */
  H0: 67.66,
  /** Matter density parameter, same table. */
  Om: 0.3111,
  /** CMB temperature today in K (Fixsen 2009), used only for the small radiation term. */
  TcmbK: 2.7255,
  /** Effective number of neutrino species (standard value). */
  Neff: 3.046,
} as const;

/** Age of the universe in Gyr: Planck 2018 VI Table 2 (+BAO). */
export const T0_GYR = 13.787;
export const T0_ERR_GYR = 0.02;

export const YEAR_S = 3.15576e7;
const GYR_S = YEAR_S * 1e9;
const MPC_KM = 3.0856775814913673e19;
export const T0_S = T0_GYR * GYR_S;
/** The cosmic calendar maps the age of the universe onto a 365-day year. */
export const CAL_YEAR_S = 365 * 86400;

const h = COSMO.H0 / 100;
const omegaGammaH2 = 2.4728e-5 * (COSMO.TcmbK / 2.7255) ** 4;
const omegaR = (omegaGammaH2 * (1 + (7 / 8) * (4 / 11) ** (4 / 3) * COSMO.Neff)) / (h * h);
const omegaL = 1 - COSMO.Om - omegaR;
const H0perSecond = COSMO.H0 / MPC_KM;

const ageCache = new Map<number, number>();

/** Cosmic time at redshift z, in Gyr (Simpson integration of dt = dln a / H over a flat LambdaCDM model). */
export function ageAtRedshift(z: number): number {
  const hit = ageCache.get(z);
  if (hit !== undefined) return hit;
  const a1 = 1 / (1 + z);
  const n = 20000;
  const x0 = Math.log(1e-12);
  const x1 = Math.log(a1);
  const dx = (x1 - x0) / n;
  const f = (x: number): number => {
    const a = Math.exp(x);
    return 1 / Math.sqrt(omegaR / a ** 4 + COSMO.Om / a ** 3 + omegaL);
  };
  let sum = f(x0) + f(x1);
  for (let i = 1; i < n; i++) sum += f(x0 + i * dx) * (i % 2 === 1 ? 4 : 2);
  const gyr = ((sum * dx) / 3 / H0perSecond) / GYR_S;
  ageCache.set(z, gyr);
  return gyr;
}

export interface ResolvedTime {
  /** Seconds after the Big Bang. */
  seconds: number;
  lo: number;
  hi: number;
}

const gyrToS = (g: number): number => g * GYR_S;

export function resolveTime(t: CosmicTime): ResolvedTime {
  switch (t.kind) {
    case 'seconds':
      return { seconds: t.value, lo: t.value, hi: t.value };
    case 'now':
      return { seconds: T0_S, lo: gyrToS(T0_GYR - T0_ERR_GYR), hi: gyrToS(T0_GYR + T0_ERR_GYR) };
    case 'redshift': {
      const mid = gyrToS(ageAtRedshift(t.z));
      if (!t.err) return { seconds: mid, lo: mid, hi: mid };
      return { seconds: mid, lo: gyrToS(ageAtRedshift(t.z + t.err)), hi: gyrToS(ageAtRedshift(Math.max(0, t.z - t.err))) };
    }
    case 'afterBigBang': {
      const s = t.years * YEAR_S;
      const e = (t.err ?? 0) * YEAR_S;
      return { seconds: s, lo: s - e, hi: s + e };
    }
    case 'lookback': {
      const s = T0_S - t.years * YEAR_S;
      const e = Math.hypot((t.err ?? 0) * YEAR_S, T0_ERR_GYR * GYR_S);
      return { seconds: s, lo: s - e, hi: s + e };
    }
  }
}

/** Years before today (using the Planck age of the universe). */
export const lookbackYears = (seconds: number): number => (T0_S - seconds) / YEAR_S;

/** Position on the cosmic calendar as a fraction of the year, 0 to 1. */
export const calendarFraction = (seconds: number): number => seconds / T0_S;

const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
export const superscript = (n: number): string => String(n).replace(/[-0-9]/g, (c) => SUP[c] ?? c);

/** "5.39 × 10⁻⁴⁴ s", "3 min", "372 kyr", "283 Myr", "9.22 Gyr". */
export function formatCosmicTime(seconds: number, lang: string): string {
  const num = (v: number, digits = 3) => new Intl.NumberFormat(lang, { maximumSignificantDigits: digits }).format(v);
  if (seconds < 1) {
    const exp = Math.floor(Math.log10(seconds));
    const mant = seconds / 10 ** exp;
    return `${new Intl.NumberFormat(lang, { maximumSignificantDigits: 3 }).format(mant)} × 10${superscript(exp)} s`;
  }
  if (seconds < 60) return `${num(seconds)} s`;
  if (seconds < 3600) return `${num(seconds / 60)} min`;
  const years = seconds / YEAR_S;
  if (years < 1) return `${num(seconds / 3600)} h`;
  if (years < 1e3) return `${num(years)} yr`;
  if (years < 1e6) return `${num(years / 1e3)} kyr`;
  if (years < 1e9) return `${num(years / 1e6)} Myr`;
  return `${num(years / 1e9)} Gyr`;
}

/** Years as "11.7 kyr", "66 Myr", "4.57 Gyr" (for "time ago"). */
export function formatYears(years: number, lang: string): string {
  const num = (v: number) => new Intl.NumberFormat(lang, { maximumSignificantDigits: 3 }).format(v);
  if (years < 1e3) return `${num(years)} yr`;
  if (years < 1e6) return `${num(years / 1e3)} kyr`;
  if (years < 1e9) return `${num(years / 1e6)} Myr`;
  return `${num(years / 1e9)} Gyr`;
}

/** Date and time on the cosmic calendar, e.g. "2 September, 13:21:05" (non-leap reference year). */
export function calendarLabel(seconds: number, lang: string): string {
  const inYear = Math.min(CAL_YEAR_S, calendarFraction(seconds) * CAL_YEAR_S);
  if (inYear < 1) {
    const date = new Intl.DateTimeFormat(lang, { month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(2001, 0, 1)));
    return `${date}, 00:00:00 + ${formatCosmicTime(Math.max(inYear, 1e-300), lang)}`;
  }
  const whole = Math.floor(inYear);
  const d = new Date(Date.UTC(2001, 0, 1) + whole * 1000);
  if (inYear >= CAL_YEAR_S) {
    const last = new Intl.DateTimeFormat(lang, { month: 'long', day: 'numeric', timeZone: 'UTC' }).format(new Date(Date.UTC(2001, 11, 31)));
    return `${last}, 24:00:00`;
  }
  const date = new Intl.DateTimeFormat(lang, { month: 'long', day: 'numeric', timeZone: 'UTC' }).format(d);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date}, ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`;
}
