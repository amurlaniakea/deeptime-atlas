// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
// Cosmic history. Times of events dated by redshift are computed in src/lib/cosmology.ts from the Planck 2018 parameters.
import type { CosmicBand, CosmicEvent } from './types';

const P = 'planck2018-vi';

export const COSMIC_EVENTS: CosmicEvent[] = [
  {
    id: 'planck-time',
    time: { kind: 'seconds', value: 5.391247e-44 },
    certainty: 'hypothesis',
    names: { es: 'Tiempo de Planck', en: 'Planck time', fr: 'Temps de Planck' },
    summary: {
      es: 'Una escala de tiempo construida con constantes fundamentales: √(ħG/c⁵) = 5,391247(60) × 10⁻⁴⁴ s (CODATA 2022). Suele tomarse como el límite de validez de la física conocida. Ninguna teoría establecida describe el universo antes de ese instante, así que todo lo anterior es hipótesis.',
      en: 'A time scale built from fundamental constants: √(ħG/c⁵) = 5.391247(60) × 10⁻⁴⁴ s (CODATA 2022). It is usually taken as the limit of validity of known physics. No established theory describes the universe before it, so everything earlier is hypothesis.',
      fr: 'Une échelle de temps construite à partir de constantes fondamentales : √(ħG/c⁵) = 5,391247(60) × 10⁻⁴⁴ s (CODATA 2022). On la prend généralement comme la limite de validité de la physique connue. Aucune théorie établie ne décrit l’Univers avant cet instant : tout ce qui précède est hypothèse.',
    },
    sources: ['codata2022'],
  },
  {
    id: 'bbn',
    time: { kind: 'seconds', value: 180 },
    approx: true,
    certainty: 'consensus',
    names: { es: 'Nucleosíntesis primordial', en: 'Big Bang nucleosynthesis', fr: 'Nucléosynthèse primordiale' },
    summary: {
      es: 'En los primeros minutos el universo era lo bastante caliente y denso para la fusión nuclear. Las abundancias de deuterio, helio-3, helio-4 y litio-7 quedan esencialmente fijadas hacia los 180 segundos. Las predicciones, basadas en física del Modelo Estándar bien comprendida, concuerdan en conjunto con las abundancias primordiales inferidas de las observaciones, que abarcan nueve órdenes de magnitud.',
      en: 'In the first minutes the universe was hot and dense enough for nuclear fusion. The abundances of deuterium, helium-3, helium-4 and lithium-7 are essentially fixed by about 180 seconds. The predictions, based on well-understood Standard Model physics, agree overall with the primordial abundances inferred from observations, which span nine orders of magnitude.',
      fr: 'Pendant les premières minutes, l’Univers était assez chaud et dense pour la fusion nucléaire. Les abondances de deutérium, d’hélium-3, d’hélium-4 et de lithium-7 sont essentiellement fixées vers 180 secondes. Les prédictions, fondées sur une physique du Modèle standard bien comprise, s’accordent globalement avec les abondances primordiales déduites des observations, qui couvrent neuf ordres de grandeur.',
    },
    sources: ['pdg-bbn-2025', 'pdg-bbn-2026'],
  },
  {
    id: 'equality',
    time: { kind: 'redshift', z: 3387, err: 21 },
    certainty: 'consensus',
    names: { es: 'Igualdad entre materia y radiación', en: 'Matter–radiation equality', fr: 'Égalité matière–rayonnement' },
    summary: {
      es: 'El momento en que la contribución de la materia a la densidad de energía del universo superó a la de la radiación (fotones y neutrinos). Planck 2018 da un corrimiento al rojo de 3387 ± 21; el tiempo se calcula aquí con los mismos parámetros cosmológicos.',
      en: 'The moment when the contribution of matter to the universe’s energy density overtook that of radiation (photons and neutrinos). Planck 2018 gives a redshift of 3387 ± 21; the time is computed here from the same cosmological parameters.',
      fr: 'Le moment où la contribution de la matière à la densité d’énergie de l’Univers a dépassé celle du rayonnement (photons et neutrinos). Planck 2018 donne un décalage vers le rouge de 3387 ± 21 ; le temps est calculé ici avec les mêmes paramètres cosmologiques.',
    },
    sources: [P],
  },
  {
    id: 'recombination',
    time: { kind: 'redshift', z: 1089.8, err: 0.21 },
    certainty: 'consensus',
    names: {
      es: 'Recombinación y fondo cósmico de microondas',
      en: 'Recombination and the cosmic microwave background',
      fr: 'Recombinaison et fond diffus cosmologique',
    },
    summary: {
      es: 'Los fotones se desacoplaron de la materia y el universo se volvió transparente; el fondo cósmico de microondas que observamos hoy se liberó entonces. Planck 2018 lo sitúa en un corrimiento al rojo de 1089,80 ± 0,21. El tiempo tras el Big Bang se calcula aquí con los mismos parámetros.',
      en: 'Photons decoupled from matter and the universe became transparent; the cosmic microwave background we observe today was released then. Planck 2018 places this at redshift 1089.80 ± 0.21. The time after the Big Bang is computed here from the same parameters.',
      fr: 'Les photons se sont découplés de la matière et l’Univers est devenu transparent ; le fond diffus cosmologique que nous observons aujourd’hui a été libéré alors. Planck 2018 le place à un décalage vers le rouge de 1089,80 ± 0,21. Le temps après le Big Bang est calculé ici avec les mêmes paramètres.',
    },
    sources: [P],
  },
  {
    id: 'earliest-galaxy',
    time: { kind: 'redshift', z: 14.44, err: 0.02 },
    statedYears: 280e6,
    certainty: 'consensus',
    names: {
      es: 'La galaxia confirmada más lejana (MoM-z14)',
      en: 'The most distant confirmed galaxy (MoM-z14)',
      fr: 'La galaxie confirmée la plus lointaine (MoM-z14)',
    },
    summary: {
      es: 'En las fuentes consultadas (noviembre de 2026), MoM-z14 es la galaxia más lejana confirmada por espectroscopía: corrimiento al rojo 14,44 ± 0,02, unos 280 millones de años tras el Big Bang. El JWST encuentra más galaxias brillantes tempranas de lo esperado, lo que pone a prueba los modelos de la infancia del universo. Es un récord que puede superarse en cualquier momento.',
      en: 'In the sources consulted (November 2026), MoM-z14 is the most distant spectroscopically confirmed galaxy: redshift 14.44 ± 0.02, about 280 million years after the Big Bang. JWST finds more bright early galaxies than expected, which challenges models of the universe’s infancy. It is a record that can be broken at any time.',
      fr: 'Dans les sources consultées (novembre 2026), MoM-z14 est la galaxie la plus lointaine confirmée par spectroscopie : décalage vers le rouge 14,44 ± 0,02, environ 280 millions d’années après le Big Bang. Le JWST trouve plus de galaxies brillantes précoces que prévu, ce qui met à l’épreuve les modèles de l’enfance de l’Univers. C’est un record qui peut être battu à tout moment.',
    },
    sources: ['naidu2026'],
  },
  {
    id: 'reionization',
    time: { kind: 'redshift', z: 7.82, err: 0.71 },
    approx: true,
    certainty: 'debated',
    names: { es: 'Reionización (punto medio)', en: 'Reionization (mid-point)', fr: 'Réionisation (point médian)' },
    summary: {
      es: 'El hidrógeno entre las galaxias volvió a ionizarse, un proceso que se atribuye a la radiación de las primeras estrellas y galaxias. Planck 2018 da un corrimiento al rojo medio de 7,82 ± 0,71 (y una profundidad óptica de 0,0561 ± 0,0071) suponiendo un modelo simple de cómo avanza la reionización. El tiempo se calcula aquí a partir de ese corrimiento.',
      en: 'The hydrogen between galaxies was ionised again, a process attributed to the radiation of the first stars and galaxies. Planck 2018 gives a mid-point redshift of 7.82 ± 0.71 (and an optical depth of 0.0561 ± 0.0071), assuming a simple model of how reionization proceeds. The time is computed here from that redshift.',
      fr: 'L’hydrogène entre les galaxies a été à nouveau ionisé, un processus attribué au rayonnement des premières étoiles et galaxies. Planck 2018 donne un décalage vers le rouge médian de 7,82 ± 0,71 (et une profondeur optique de 0,0561 ± 0,0071) en supposant un modèle simple du déroulement de la réionisation. Le temps est calculé ici à partir de ce décalage.',
    },
    sources: [P],
  },
  {
    id: 'milky-way-disc',
    time: { kind: 'afterBigBang', years: 0.8e9 },
    approx: true,
    certainty: 'debated',
    names: { es: 'Empieza a formarse el disco antiguo de la Vía Láctea', en: 'The Milky Way’s old disc starts to form', fr: 'Le vieux disque de la Voie lactée commence à se former' },
    summary: {
      es: 'Un gran estudio de unas 250 000 estrellas subgigantes data el inicio de la formación del disco antiguo (grueso) de la Vía Láctea hace unos 13 000 millones de años, solo 0,8 miles de millones de años después del Big Bang; esa formación se prolongó 5-6 miles de millones de años. Es el resultado de un solo estudio.',
      en: 'A large study of about 250,000 subgiant stars dates the start of the formation of the Milky Way’s old (thick) disc to about 13 billion years ago, only 0.8 billion years after the Big Bang; its formation extended over 5–6 billion years. It is the result of a single study.',
      fr: 'Une grande étude d’environ 250 000 étoiles sous-géantes date le début de la formation du vieux disque (épais) de la Voie lactée à environ 13 milliards d’années, seulement 0,8 milliard d’années après le Big Bang ; sa formation s’est étalée sur 5 à 6 milliards d’années. C’est le résultat d’une seule étude.',
    },
    sources: ['xiang2022'],
  },
  {
    id: 'gaia-enceladus',
    time: { kind: 'lookback', years: 11e9 },
    approx: true,
    certainty: 'debated',
    names: { es: 'Fusión con Gaia-Sausage-Enceladus', en: 'Merger with Gaia-Sausage-Enceladus', fr: 'Fusion avec Gaia-Sausage-Enceladus' },
    summary: {
      es: 'Hace unos 11 000 millones de años la Vía Láctea se fusionó con la galaxia satélite Gaia-Sausage-Enceladus; la tasa de formación estelar del disco antiguo tuvo su máximo hace unos 11 200 millones de años, coincidiendo con el final de esa fusión. Esa galaxia aportó la mayoría de las estrellas del halo de la Vía Láctea.',
      en: 'About 11 billion years ago the Milky Way merged with the satellite galaxy Gaia-Sausage-Enceladus; the star formation rate of the old disc peaked about 11.2 billion years ago, coinciding with the end of that merger. That galaxy contributed most of the Milky Way’s halo stars.',
      fr: 'Il y a environ 11 milliards d’années, la Voie lactée a fusionné avec la galaxie satellite Gaia-Sausage-Enceladus ; le taux de formation d’étoiles du vieux disque a culminé il y a environ 11,2 milliards d’années, au moment de la fin de cette fusion. Cette galaxie a apporté la majorité des étoiles du halo de la Voie lactée.',
    },
    sources: ['xiang2022'],
  },
  {
    id: 'solar-system',
    time: { kind: 'lookback', years: 4567.3e6, err: 0.16e6 },
    certainty: 'consensus',
    link: 'hadean',
    names: { es: 'Nace el Sistema Solar', en: 'The Solar System forms', fr: 'Naissance du Système solaire' },
    summary: {
      es: 'Los sólidos más antiguos datados del Sistema Solar, las inclusiones ricas en calcio y aluminio de los meteoritos, se formaron hace 4567,30 ± 0,16 millones de años (datación Pb-Pb con corrección de uranio); los cóndrulos empezaron a formarse a la vez y siguieron unos 3 millones de años. La carta de la ICS sitúa la base del Hadeico, el inicio de la historia de la Tierra, en 4567 Ma. La incertidumbre en el tiempo cósmico la domina la edad del universo.',
      en: 'The oldest dated solids of the Solar System, calcium–aluminium-rich inclusions in meteorites, formed 4567.30 ± 0.16 million years ago (U-corrected Pb–Pb dating); chondrules began forming at the same time and continued for about 3 million years. The ICS chart places the base of the Hadean, the start of Earth’s history, at 4567 Ma. The uncertainty in cosmic time is dominated by the age of the universe.',
      fr: 'Les plus anciens solides datés du Système solaire, les inclusions riches en calcium et aluminium des météorites, se sont formés il y a 4567,30 ± 0,16 millions d’années (datation Pb-Pb corrigée de l’uranium) ; les chondres ont commencé à se former en même temps et ont continué pendant environ 3 millions d’années. La charte de l’ICS place la base de l’Hadéen, le début de l’histoire de la Terre, à 4567 Ma. L’incertitude sur le temps cosmique est dominée par l’âge de l’Univers.',
    },
    sources: ['connelly2012', 'ics-chart-2024-12'],
  },
  {
    id: 'moon',
    time: { kind: 'lookback', years: 4.51e9 },
    approx: true,
    certainty: 'debated',
    names: { es: 'Se forma la Luna', en: 'The Moon forms', fr: 'Formation de la Lune' },
    summary: {
      es: 'La datación U-Pb y Lu-Hf de circones de la misión Apolo 14 indica que la corteza lunar ya se había diferenciado hace 4510 millones de años, de modo que la Luna se formó en unos 60 millones de años tras el Sistema Solar. El origen por impacto gigante se acepta ampliamente, pero la fecha se debate: las estimaciones van de unos 4,35-4,42 Ga a unos 4,45-4,47 Ga. La edad mostrada es un mínimo.',
      en: 'Uranium–lead and lutetium–hafnium dating of Apollo 14 zircons shows the lunar crust had differentiated by 4.51 billion years ago, so the Moon formed within about 60 million years of the Solar System. The giant-impact origin is widely accepted, but the timing is debated: estimates range from about 4.35–4.42 Ga to about 4.45–4.47 Ga. The age shown is a minimum.',
      fr: 'La datation U-Pb et Lu-Hf de zircons d’Apollo 14 indique que la croûte lunaire s’était déjà différenciée il y a 4,51 milliards d’années : la Lune s’est donc formée en environ 60 millions d’années après le Système solaire. L’origine par impact géant est largement admise, mais la date est débattue : les estimations vont d’environ 4,35-4,42 Ga à environ 4,45-4,47 Ga. L’âge indiqué est un minimum.',
    },
    sources: ['barboni2017'],
  },
  {
    id: 'phanerozoic',
    time: { kind: 'lookback', years: 538.8e6, err: 0.6e6 },
    certainty: 'consensus',
    link: 'phanerozoic',
    names: { es: 'Empieza el Fanerozoico', en: 'The Phanerozoic begins', fr: 'Début du Phanérozoïque' },
    summary: {
      es: 'El Eón Fanerozoico empieza con el Cámbrico, hace 538,8 ± 0,6 millones de años en la carta de la ICS. A partir de aquí la escala geológica da el detalle: abre la sección de tiempo geológico.',
      en: 'The Phanerozoic Eon begins with the Cambrian, 538.8 ± 0.6 million years ago in the ICS chart. From here the geological timescale gives the detail: open the geological time section.',
      fr: 'L’éon Phanérozoïque commence avec le Cambrien, il y a 538,8 ± 0,6 millions d’années dans la charte de l’ICS. À partir d’ici, l’échelle géologique donne le détail : ouvrez la section du temps géologique.',
    },
    sources: ['ics-chart-2024-12'],
  },
  {
    id: 'k-pg',
    time: { kind: 'lookback', years: 66.0e6 },
    certainty: 'consensus',
    link: 'paleogene',
    names: { es: 'Fin de los dinosaurios no avianos', en: 'End of the non-avian dinosaurs', fr: 'Fin des dinosaures non aviens' },
    summary: {
      es: 'El límite Cretácico-Paleógeno, a 66,0 Ma en la carta de la ICS (66,043 ± 0,043 Ma por datación 40Ar/39Ar), marca la extinción de los dinosaurios no avianos tras el impacto de Chicxulub.',
      en: 'The Cretaceous–Paleogene boundary, 66.0 Ma in the ICS chart (66.043 ± 0.043 Ma by 40Ar/39Ar dating), marks the extinction of the non-avian dinosaurs after the Chicxulub impact.',
      fr: 'La limite Crétacé-Paléogène, à 66,0 Ma dans la charte de l’ICS (66,043 ± 0,043 Ma par datation 40Ar/39Ar), marque l’extinction des dinosaures non aviens après l’impact de Chicxulub.',
    },
    sources: ['ics-chart-2024-12', 'renne2013'],
  },
  {
    id: 'holocene',
    time: { kind: 'lookback', years: 11700 },
    approx: true,
    certainty: 'consensus',
    link: 'holocene',
    names: { es: 'Empieza el Holoceno', en: 'The Holocene begins', fr: 'Début de l’Holocène' },
    summary: {
      es: 'El Holoceno empieza hace unos 11 700 años, al final del Younger Dryas. Toda la historia de la civilización cabe en esta última fracción del calendario cósmico.',
      en: 'The Holocene begins about 11,700 years ago, at the end of the Younger Dryas. All of civilisation fits in this last fraction of the cosmic calendar.',
      fr: 'L’Holocène commence il y a environ 11 700 ans, à la fin du Younger Dryas. Toute l’histoire de la civilisation tient dans cette toute dernière fraction du calendrier cosmique.',
    },
    sources: ['ics-chart-2024-12', 'ics-gssp-table'],
  },
  {
    id: 'now',
    time: { kind: 'now' },
    certainty: 'consensus',
    names: { es: 'Hoy', en: 'Today', fr: 'Aujourd’hui' },
    summary: {
      es: 'El presente. Edad del universo: 13,787 ± 0,020 miles de millones de años (Planck 2018 + BAO, ΛCDM plano).',
      en: 'The present. Age of the universe: 13.787 ± 0.020 billion years (Planck 2018 + BAO, flat ΛCDM).',
      fr: 'Le présent. Âge de l’Univers : 13,787 ± 0,020 milliards d’années (Planck 2018 + BAO, ΛCDM plat).',
    },
    sources: [P],
  },
];

export const COSMIC_BANDS: CosmicBand[] = [
  {
    id: 'plasma',
    from: null,
    to: 'recombination',
    color: '#4a2f8f',
    names: { es: 'Plasma caliente y opaco', en: 'Hot, opaque plasma', fr: 'Plasma chaud et opaque' },
    summary: {
      es: 'Desde el Big Bang hasta la recombinación, el universo era un plasma opaco de partículas y radiación.',
      en: 'From the Big Bang to recombination the universe was an opaque plasma of particles and radiation.',
      fr: 'Du Big Bang à la recombinaison, l’Univers était un plasma opaque de particules et de rayonnement.',
    },
  },
  {
    id: 'dark-ages',
    from: 'recombination',
    to: 'earliest-galaxy',
    color: '#243b7a',
    names: { es: 'Edades oscuras y amanecer cósmico', en: 'Dark ages and cosmic dawn', fr: 'Âges sombres et aube cosmique' },
    summary: {
      es: 'De la recombinación a la galaxia confirmada más antigua. En este intervalo se formaron las primeras estrellas y galaxias; la mayor parte no se ha observado directamente.',
      en: 'From recombination to the earliest confirmed galaxy. The first stars and galaxies formed in this interval; most of it has not been observed directly.',
      fr: 'De la recombinaison à la plus ancienne galaxie confirmée. Les premières étoiles et galaxies se sont formées dans cet intervalle ; l’essentiel n’a pas été observé directement.',
    },
  },
  {
    id: 'galaxies',
    from: 'earliest-galaxy',
    to: null,
    color: '#1f6f8b',
    names: { es: 'Universo de galaxias observadas', en: 'Universe of observed galaxies', fr: 'Univers des galaxies observées' },
    summary: {
      es: 'Desde la galaxia confirmada más antigua hasta hoy: galaxias, la Vía Láctea, el Sistema Solar y la Tierra.',
      en: 'From the earliest confirmed galaxy to today: galaxies, the Milky Way, the Solar System and Earth.',
      fr: 'De la plus ancienne galaxie confirmée à aujourd’hui : galaxies, Voie lactée, Système solaire et Terre.',
    },
  },
];
