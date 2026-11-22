# Data policy and verification log

## Principles

- Primary or authoritative sources first (ICS chart, peer-reviewed papers, official data releases).
- Numbers are stored as printed by the source, with their uncertainty and approximation marks.
- Every dataset entry lists its sources; automated tests enforce this.
- Colours are presentation, not data: units marked with an official colour use the CCGM/ICS
  scheme; the remaining units use shades derived from their parent. Colours must never be read as
  scientific information.

## Verification log

| Date | Scope | Source | Status |
|---|---|---|---|
| 2026-11-21 | Eons, eras, periods, Cenozoic epochs, Pleistocene and Holocene ages (v0.1) | ICS International Chronostratigraphic Chart v2024/12 (PDF text) | Read from the official PDF; independent re-check pending |
| 2026-11-22 | 17 Cenozoic stages (v0.2): base ages | ICS chart v2024/12 | Read from the official PDF; independent re-check pending |
| 2026-11-22 | GSSP marker, reference section, ratification year and reference for 9 boundaries (`src/data/boundaries.ts`) | ICS "GSSP Table - All Periods" (IUGS) | Transcribed and translated; the table is an older edition, so only markers considered stable were used and its numerical ages were ignored. Independent re-check against the current ICS GSSP pages pending |

## Known points to keep in mind

- The GSSP table used for boundary definitions predates chart v2024/12. For example, it lists the Ediacaran
  ratification year inconsistently, so no ratification year is shown for that boundary.

- In chart v2024/12 the base of the Archean is 4031 ± 3 Ma and the Hadean is an informal unit.
- Ages of the Cryogenian (~720 Ma) and the Ediacaran (~635 Ma) are approximate in the chart.
- In the Phanerozoic and the Ediacaran, units are defined by GSSPs, not by numerical ages.
- The Anthropocene is not a formal unit of the chart. It will be presented as a scientific
  proposal and debate (planned for v0.5), with its status verified against current IUGS/ICS sources.
