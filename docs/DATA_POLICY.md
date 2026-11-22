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
| 2026-11-22 | Mass extinctions and glaciations (`src/data/events.ts`, v0.3): ages, uncertainties and statements | 13 papers and chapters listed in `src/data/sources.ts` (Burgess 2014, Renne 2013, Schulte 2010, Oliveira 2023, Bond & Grasby 2017 and 2020, Bond et al. 2023 abstract, Hoffman 2017, Gumsley 2017, Bekker 2021, Rosa & Isbell 2020, Montañez & Poulsen 2013, Cheng et al. 2020) | Read from the sources' abstracts and open full texts; summaries paraphrased and translated. Independent re-check pending |

## Known points to keep in mind

- Event ages for the Late Ordovician (Hirnantian stage), the Kellwasser event (Frasnian-Famennian boundary) and the
  Hangenberg event (Devonian-Carboniferous boundary) are the ICS chart ages of the stage or boundary where the
  extinction is placed, not dated pulses. Their text says so.
- The "certainty" field means "broadly accepted" or "partly debated" for the key claim of the entry (cause, timing or
  extent). It is an editorial judgement based on how the cited sources word the claim.
- The Late Paleozoic Ice Age bounds (362-256 Ma) follow one synthesis (Rosa & Isbell 2020); other studies give
  different bounds, which the entry states.
- The Bond et al. (2023) source is a conference abstract, labelled as such; it is used only for the statement that the
  Late Devonian extinction is poorly understood and that its pulses are about 13 Myr apart.
- The Younger Dryas entry follows Cheng et al. (2020, PNAS): onset 12,870 ± 30 and termination 11,700 ± 40 years before
  present (present = 1950 CE) in the North Atlantic. Wikipedia was used only to locate the primary literature; it is not
  cited. The ICS Holocene base is expressed in years before 2000, a 50-year reference difference noted in the entry.
- Deliberately not included yet: the Cenozoic/Quaternary icehouse (its ages were not verified in the sources read so far).
  It is planned with its own sources in v0.3.1.

- The GSSP table used for boundary definitions predates chart v2024/12. For example, it lists the Ediacaran
  ratification year inconsistently, so no ratification year is shown for that boundary.

- In chart v2024/12 the base of the Archean is 4031 ± 3 Ma and the Hadean is an informal unit.
- Ages of the Cryogenian (~720 Ma) and the Ediacaran (~635 Ma) are approximate in the chart.
- In the Phanerozoic and the Ediacaran, units are defined by GSSPs, not by numerical ages.
- The Anthropocene is not a formal unit of the chart. It will be presented as a scientific
  proposal and debate (planned for v0.5), with its status verified against current IUGS/ICS sources.
