// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>

export type Rank = 'root' | 'eon' | 'era' | 'period' | 'epoch' | 'age';
export type Names = { es: string; en: string; fr: string };

/** One geochronologic unit as entered in the dataset (ages in Ma, older = larger). */
export interface RawUnit {
  id: string;
  rank: Exclude<Rank, 'root'>;
  parent: string | null;
  /** Age of the base (start) of the unit, in millions of years before present. */
  startMa: number;
  /** Reported 1-sigma-style uncertainty of startMa, in Ma, as printed by the source. */
  startErr?: number;
  /** The source prints the age with "~" (approximate). */
  approx?: boolean;
  /** The source marks the unit as informal. */
  informal?: boolean;
  /** Official colour (CCGM/ICS). Omit to derive a shade from the parent. */
  color?: string;
  names: Names;
  /** Ids from src/data/sources.ts. At least one is mandatory. */
  sources: string[];
}

export interface Source {
  id: string;
  citation: string;
  url: string;
  doi?: string;
  /** ISO date when the numbers were last read from the source. */
  accessed: string;
}

/** How the base of one or more units is defined (GSSP), as printed by the ICS GSSP table. */
export interface BoundaryDef {
  id: string;
  /** Units that share this base. A test checks that they all start at the same age. */
  appliesTo: string[];
  /** Primary marker / boundary level and correlation events, in the source's words (translated). */
  marker: Names;
  /** Reference section (place). */
  location: Names;
  /** Year of ratification, only when the source prints it unambiguously. */
  ratified?: number;
  /** Bibliographic reference printed by the source. */
  reference?: string;
  sources: string[];
}

export type EventKind = 'extinction' | 'glaciation' | 'cold-event';
/** 'consensus' = broadly accepted; 'debated' = a key point (cause, timing or extent) is still debated. */
export type Certainty = 'consensus' | 'debated' | 'hypothesis';

/** A dated event or interval (mass extinction, glaciation). Ages in Ma, as printed by the source. */
export interface TimeEvent {
  id: string;
  kind: EventKind;
  /** Older bound, or the single age of a point event. */
  startMa: number;
  startErr?: number;
  /** Younger bound. Omit for a point event. */
  endMa?: number;
  endErr?: number;
  /** The age is rounded or approximate in the source. */
  approx?: boolean;
  certainty: Certainty;
  /** One of the Big Five mass extinctions. */
  bigFive?: boolean;
  /** The event coincides with the base of this unit (cross-checked against the chart by a test). */
  boundaryUnit?: string;
  names: Names;
  summary: Names;
  sources: string[];
}

/** A climate state of the Cenozoic as classified by Westerhold et al. (2020) with recurrence analysis. */
export interface ClimateState {
  id: 'hothouse' | 'warmhouse' | 'coolhouse' | 'icehouse';
  /** Several phases may share one state (the Warmhouse has two). The id of the phase is `phaseId`. */
  phaseId: string;
  startMa: number;
  endMa: number;
  color: string;
  names: Names;
  summary: Names;
  sources: string[];
}

/** A labelled transition marked on the climate curve. */
export interface ClimateMark {
  id: string;
  ageMa: number;
  approx?: boolean;
  names: Names;
  summary: Names;
  sources: string[];
}

export interface CenogridFile {
  source: { citation: string; doi: string; seriesDoi: string; paperDoi: string; license: string; changes: string };
  input: { file: string; sha256: string; bytes: number; dataRows: number } | null;
  generated: string | null;
  columns: ['ageMa', 'd18oSmooth20kyr', 'd18oTrend1Myr'];
  unit: string;
  rows: Array<[number, number, number]>;
}

/** How the time of a cosmic event is given. Seconds are measured after the Big Bang. */
export type CosmicTime =
  | { kind: 'seconds'; value: number }
  | { kind: 'redshift'; z: number; err?: number }
  | { kind: 'afterBigBang'; years: number; err?: number }
  | { kind: 'lookback'; years: number; err?: number }
  | { kind: 'now' };

export interface CosmicEvent {
  id: string;
  time: CosmicTime;
  /** Time after the Big Bang stated by the source, in years, used only by a test to cross-check the computed value. */
  statedYears?: number;
  approx?: boolean;
  certainty: Certainty;
  names: Names;
  summary: Names;
  /** Unit of the geological timescale to open from this event. */
  link?: string;
  sources: string[];
}

/** An editorial grouping of cosmic time between two events (null = Big Bang / today). */
export interface CosmicBand {
  id: string;
  from: string | null;
  to: string | null;
  color: string;
  names: Names;
  summary: Names;
}

/** Calendar years: BCE is negative (-9700 = 9700 BCE), CE positive. */
export interface HoloEvent {
  id: string;
  kind: 'climate' | 'human' | 'anthropocene';
  from: number;
  to?: number;
  approx?: boolean;
  certainty: Certainty;
  names: Names;
  summary: Names;
  /** Unit of the geological timescale to open from this event. */
  link?: string;
  sources: string[];
}

/** A hominin fossil site. Ages in Ma (older bound in `from`). */
export interface HomininSite {
  id: string;
  /** Scientific name(s) as given by the source; not translated. */
  taxa: string;
  place: Names;
  country: Names;
  lat: number;
  lon: number;
  /** 'paper' and 'unesco' coordinates come from a cited source; 'approx' are approximate (about 0.1 degree). */
  coords: 'paper' | 'unesco' | 'approx';
  age: { from: number; to?: number; err?: number; minimum?: boolean; approx?: boolean };
  certainty: Certainty;
  names: Names;
  summary: Names;
  /** Unit of the geological timescale that contains the age. */
  link: string;
  sources: string[];
}
