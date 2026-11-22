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
