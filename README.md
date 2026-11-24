# Deep Time Atlas

[English](README.md) · [Español](README.es.md) · [Français](README.fr.md)

[![CI](https://github.com/amurlaniakea/deeptime-atlas/actions/workflows/ci.yml/badge.svg)](https://github.com/amurlaniakea/deeptime-atlas/actions/workflows/ci.yml)
[![License: AGPL-3.0-or-later](https://img.shields.io/badge/license-AGPL--3.0--or--later-blue.svg)](LICENSE)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.24430370.svg)](https://doi.org/10.5281/zenodo.24430370)

An interactive, sourced atlas of cosmic and Earth history, built for university classrooms.
Available in **Spanish, English and French**.

**Live demo:** https://amurlaniakea.github.io/deeptime-atlas/

## Three scales, one story

| Part | Content | Status |
|---|---|---|
| Cosmic history | From the Big Bang to the Solar System and the Earth | **available (v0.4)** |
| Geological time | Eons, eras, periods and epochs; mass extinctions; glaciations | **available**: column, Big Five extinctions, glaciations and the Cenozoic climate curve |
| Holocene and humankind | Close-up of the present epoch, its three ages, milestones of human history and the Anthropocene debate | **available (v0.5)**; the Pleistocene hominin record is planned for v0.6 |

## What it does (v0.5)

- A stratigraphic column **drawn to scale**: click a layer to zoom from eon to era, period, epoch and age.
- For every unit: begin and end ages with the published uncertainty, duration, share of Earth history
  and a "24-hour clock" (if Earth's history were one day, when does the unit start?).
- The whole Cenozoic down to stage level, with the **definition of the base** (GSSP marker, reference section,
  ratification) for nine key boundaries, including the Cretaceous-Paleogene boundary and the start of the Holocene.
- **Mass extinctions and glaciations** drawn on the column (diamonds and bars) and listed with their age, uncertainty,
  scientific status (broadly accepted or partly debated) and the papers they come from: the Big Five extinctions, the Younger Dryas,
  the Huronian, Sturtian and Marinoan glaciations and the Late Paleozoic Ice Age.
- **The Holocene and humankind**: its three ages (Greenlandian, Northgrippian, Meghalayan) with the climate events that define them,
  milestones such as Göbekli Tepe and the first writing, the Great Acceleration, and an explanation of why the Anthropocene is
  **not** a formal geological unit (IUGS/ICS statement of 20 March 2024) while the scientific debate continues.
- **Cosmic history** from the Big Bang to the Earth, on a logarithmic time scale and on the **cosmic calendar** (the age of the
  universe as one year): Planck time, nucleosynthesis, matter–radiation equality, the cosmic microwave background, the most distant
  confirmed galaxy, reionization, the Milky Way, the Solar System and the Moon, with links to the geological section.
- A **Cenozoic climate curve**: the benthic δ¹⁸O record of the last 66 million years (CENOGRID, Westerhold et al. 2020), with the
  four climate states (Hothouse, Warmhouse, Coolhouse, Icehouse), the key transitions and a hover read-out.
- A **compare** tool: two units on one scale, with the ratio of their durations.
- Shareable links to any unit (`#phanerozoic`) and to a language (`?lang=fr`).
- Keyboard-accessible layer list, colour-blind-safe text contrast, dark mode, reduced-motion support.
- No network requests at run time and a strict Content-Security-Policy.

## Data and verification

Ages come from the **ICS International Chronostratigraphic Chart v2024/12**
(https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf; Cohen et al. 2025,
[doi:10.18814/epiiugs/2025/025001](https://doi.org/10.18814/epiiugs/2025/025001)).
Each dataset entry lists its sources and automated tests enforce it. See
[`docs/DATA_POLICY.md`](docs/DATA_POLICY.md) for the policy and the verification log.

## Development

The climate series is generated from the public PANGAEA file (CC BY 4.0), which is not stored in the repository:

```bash
mkdir -p data-raw && curl -L -o data-raw/cenogrid_S34.tab "https://doi.pangaea.de/10.1594/PANGAEA.917717?format=textfile"
npm run build:data   # writes src/data/cenogrid.json
```

```bash
npm ci
npm run dev
npm run typecheck
npm test
npm run build
```

Stack: Vite, TypeScript (strict), Vitest. No runtime dependencies.

## Roadmap

| Version | Content |
|---|---|
| v0.1 | Skeleton, i18n, sourced data schema, CI, Live Demo, geological column |
| v0.2 | Cenozoic to stage level, GSSP boundary definitions, compare tool |
| v0.3 | Mass extinctions and glaciations with sources |
| v0.3.1 | Cenozoic climate curve (CENOGRID) and the Cenozoic icehouse |
| v0.4 | Cosmic history (logarithmic scale and cosmic calendar) with sourced events |
| v0.5 | Holocene and humankind: ages, climate events, human milestones, Anthropocene debate |
| v0.6 | Pleistocene hominin record: map of fossil sites (Atapuerca and others), human evolution timeline |
| v0.7 | Classroom mode: teaching guide and quizzes |
| v1.0 | Full source audit and Zenodo DOI |

## How to cite

See [`CITATION.cff`](CITATION.cff). Cite all versions with the Zenodo concept DOI [10.5281/zenodo.24430370](https://doi.org/10.5281/zenodo.24430370).

## License

AGPL-3.0-or-later. See [`LICENSE`](LICENSE).

© 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
