# Contributing

Thank you for helping make deep time accurate and teachable.

## Golden rule for data

Every number, date, name or claim shown in the atlas must be traceable to a source:

1. Add the source to `src/data/sources.ts` (full citation, HTTPS URL, DOI when it exists, access date).
2. Reference it from the unit through `sources`. A test fails if a unit has no valid source.
3. Copy numbers as printed by the source, including uncertainties and `~` marks. Do not round.
4. Mark debated or informal concepts as such (`informal`, `approx`) and say so in the text.
5. Provide names in Spanish, English and French. A test fails if a translation is missing.

Please open an issue before large changes. See `docs/DATA_POLICY.md`.

## Development

The Cenozoic climate series is generated from the public PANGAEA file and is not committed as raw data:

```bash
mkdir -p data-raw && curl -L -o data-raw/cenogrid_S34.tab "https://doi.pangaea.de/10.1594/PANGAEA.917717?format=textfile"
npm run build:data
```

The file `src/data/cenogrid.json` records the SHA-256 of the input. A test fails if the series has not been generated.

```bash
npm ci
npm run dev        # local server
npm run typecheck
npm test
npm run build
```

Every source file starts with the SPDX header and the copyright line used in this repository.
By contributing you agree that your contribution is licensed under AGPL-3.0-or-later.
