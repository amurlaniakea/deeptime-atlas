// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
import type { Source } from './types';

export const SOURCES: Source[] = [
  {
    id: 'ics-chart-2024-12',
    citation:
      'International Commission on Stratigraphy. International Chronostratigraphic Chart, v2024/12 (Cohen, Finney, Gibbard & Fan, 2013; updated).',
    url: 'https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf',
    accessed: '2026-11-21',
  },
  {
    id: 'cohen2025-episodes',
    citation:
      'Cohen, K.M., Harper, D.A.T., Gibbard, P.L. & Car, N. (2025). The ICS international chronostratigraphic chart this decade. Episodes 48(1): 105-115.',
    url: 'https://doi.org/10.18814/epiiugs/2025/025001',
    doi: '10.18814/epiiugs/2025/025001',
    accessed: '2026-11-21',
  },
];

export const SOURCES_BY_ID: ReadonlyMap<string, Source> = new Map(SOURCES.map((s) => [s.id, s]));
