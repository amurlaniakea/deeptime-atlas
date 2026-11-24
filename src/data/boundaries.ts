// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
// Boundary definitions (GSSP) as printed in the ICS "GSSP Table - All Periods".
// Only boundaries whose markers are stable are included; numerical ages come from the ICS chart.
import type { BoundaryDef } from './types';

const G = ['ics-gssp-table'];

export const BOUNDARIES: BoundaryDef[] = [
  {
    id: 'base-ediacaran',
    appliesTo: ['ediacaran'],
    marker: {
      es: 'Base de la caliza de cobertura (cap carbonate) marinoana: rápida desaparición de los casquetes de hielo marinoanos y aparición de carbonatos de cobertura en todo el mundo, junto con el inicio de un patrón característico de cambios en los isótopos de carbono.',
      en: 'Base of the Marinoan cap carbonate: rapid decay of the Marinoan ice sheets and onset of distinct cap carbonates throughout the world, together with the beginning of a distinctive pattern of secular changes in carbon isotopes.',
      fr: 'Base du carbonate de couverture (cap carbonate) marinoen : disparition rapide des calottes glaciaires marinoennes et apparition de carbonates de couverture dans le monde entier, avec le début d’un schéma distinctif de variations des isotopes du carbone.',
    },
    location: {
      es: 'Enorama Creek, Montes Flinders, Australia Meridional',
      en: 'Enorama Creek, Flinders Ranges, South Australia',
      fr: 'Enorama Creek, chaîne de Flinders, Australie-Méridionale',
    },
    reference: 'Lethaia 39, p. 13-30, 2006',
    sources: G,
  },
  {
    id: 'base-cambrian',
    appliesTo: ['phanerozoic', 'paleozoic', 'cambrian'],
    marker: {
      es: 'Primera aparición del icnofósil Treptichnus (Trichophycus) pedum, 2,4 m por encima de la base del Miembro 2 de la Formación Chapel Island.',
      en: 'First appearance of the trace fossil Treptichnus (Trichophycus) pedum, 2.4 m above the base of Member 2 of the Chapel Island Formation.',
      fr: 'Première apparition de l’ichnofossile Treptichnus (Trichophycus) pedum, à 2,4 m au-dessus de la base du Membre 2 de la Formation de Chapel Island.',
    },
    location: {
      es: 'Fortune Head, sureste de Terranova, Canadá',
      en: 'Fortune Head, southeastern Newfoundland, Canada',
      fr: 'Fortune Head, sud-est de Terre-Neuve, Canada',
    },
    ratified: 1992,
    reference: 'Episodes 17/1&2, p. 95-100, 1994',
    sources: G,
  },
  {
    id: 'base-triassic',
    appliesTo: ['mesozoic', 'triassic'],
    marker: {
      es: 'Primera aparición del conodonto Hindeodus parvus, en la base del estrato 27c de la sección Meishan D.',
      en: 'First appearance of the conodont Hindeodus parvus, at the base of Bed 27c in the Meishan D section.',
      fr: 'Première apparition du conodonte Hindeodus parvus, à la base du banc 27c de la coupe Meishan D.',
    },
    location: {
      es: 'Meishan, provincia de Zhejiang, China',
      en: 'Meishan, Zhejiang Province, China',
      fr: 'Meishan, province du Zhejiang, Chine',
    },
    ratified: 2001,
    reference: 'Episodes 24/2, p. 102-114, 2001',
    sources: G,
  },
  {
    id: 'base-paleogene',
    appliesTo: ['cenozoic', 'paleogene', 'paleocene', 'danian'],
    marker: {
      es: 'Capa rojiza en la base de la arcilla oscura de límite, de 50 cm de espesor: anomalía geoquímica de iridio asociada a un gran horizonte de extinción (dinosaurios, amonites, foraminíferos, etc.).',
      en: 'Reddish layer at the base of the 50 cm thick dark boundary clay: an iridium geochemical anomaly associated with a major extinction horizon (dinosaurs, ammonites, foraminifers, etc.).',
      fr: 'Couche rougeâtre à la base de l’argile sombre de limite, épaisse de 50 cm : anomalie géochimique en iridium associée à un grand horizon d’extinction (dinosaures, ammonites, foraminifères, etc.).',
    },
    location: {
      es: 'Oued Djerfane, al oeste de El Kef, Túnez',
      en: 'Oued Djerfane, west of El Kef, Tunisia',
      fr: 'Oued Djerfane, à l’ouest d’El Kef, Tunisie',
    },
    ratified: 1991,
    reference: 'Episodes 29/4, p. 263-278, 2006',
    sources: G,
  },
  {
    id: 'base-eocene',
    appliesTo: ['eocene', 'ypresian'],
    marker: {
      es: 'Base de la excursión isotópica del carbono que marca el inicio del Máximo Térmico del Paleoceno-Eoceno (PETM), en la base del estrato 1 de la subsección DBH.',
      en: 'Base of the carbon isotope excursion marking the initiation of the Paleocene-Eocene Thermal Maximum (PETM), at the base of Bed 1 in the DBH subsection.',
      fr: 'Base de l’excursion isotopique du carbone marquant le début du Maximum thermique du Paléocène-Éocène (PETM), à la base du banc 1 de la sous-coupe DBH.',
    },
    location: {
      es: 'Dababiya, cerca de Luxor, Egipto',
      en: 'Dababiya, near Luxor, Egypt',
      fr: 'Dababiya, près de Louxor, Égypte',
    },
    ratified: 2003,
    reference: 'Episodes 30/4, p. 271-286, 2007',
    sources: G,
  },
  {
    id: 'base-oligocene',
    appliesTo: ['oligocene', 'rupelian'],
    marker: {
      es: 'Base de un nivel margoso verdoso de 0,5 m de espesor; última aparición de los foraminíferos Hantkenina y Cribrohantkenina.',
      en: 'Base of a 0.5 m thick greenish-grey marl bed; last appearance of the foraminifers Hantkenina and Cribrohantkenina.',
      fr: 'Base d’un niveau de marne gris-vert de 0,5 m d’épaisseur ; dernière apparition des foraminifères Hantkenina et Cribrohantkenina.',
    },
    location: {
      es: 'Massignano, cerca de Ancona, Italia',
      en: 'Massignano, near Ancona, Italy',
      fr: 'Massignano, près d’Ancône, Italie',
    },
    ratified: 1992,
    reference: 'Episodes 16/3, p. 379-382, 2001',
    sources: G,
  },
  {
    id: 'base-quaternary',
    appliesTo: ['quaternary', 'pleistocene', 'gelasian'],
    marker: {
      es: 'Base del nivel margoso que cubre el sapropel MPRS 250. La inversión magnética Matuyama/Gauss queda 1 m por debajo; el nivel está dentro del estadio isotópico marino 103.',
      en: 'Base of the marly layer overlying sapropel MPRS 250. The Matuyama/Gauss magnetic reversal lies 1 m below; the level is within Marine Isotope Stage 103.',
      fr: 'Base du niveau marneux surmontant le sapropèle MPRS 250. L’inversion magnétique Matuyama/Gauss se trouve 1 m plus bas ; le niveau se situe dans le stade isotopique marin 103.',
    },
    location: {
      es: 'Monte San Nicola, Sicilia, Italia',
      en: 'Monte San Nicola, Sicily, Italy',
      fr: 'Monte San Nicola, Sicile, Italie',
    },
    ratified: 2009,
    reference: 'Episodes 33/3, p. 152-158, 2010',
    sources: G,
  },
  {
    id: 'base-calabrian',
    appliesTo: ['calabrian'],
    marker: {
      es: 'Base de la arcilla marina que cubre el nivel sapropélico «e» (MPRS 176); unos 15 mil años después del final del cron normal Olduvai.',
      en: 'Base of the marine claystone overlying sapropelic marker Bed ‘e’ (MPRS 176); about 15 kyr after the end of the Olduvai normal polarity chron.',
      fr: 'Base de l’argilite marine surmontant le niveau sapropélique « e » (MPRS 176) ; environ 15 000 ans après la fin du chron normal d’Olduvai.',
    },
    location: {
      es: 'Vrica, Italia',
      en: 'Vrica, Italy',
      fr: 'Vrica, Italie',
    },
    ratified: 2011,
    reference: 'Episodes 35/3, p. 388-397, 2012',
    sources: G,
  },
  {
    id: 'base-holocene',
    appliesTo: ['holocene', 'greenlandian'],
    marker: {
      es: 'Fin del enfriamiento del Dryas Reciente (Younger Dryas), reflejada en un cambio en los valores del exceso de deuterio, a 1492,45 m de profundidad en el sondeo NGRIP2.',
      en: 'End of the Younger Dryas cold spell, reflected in a shift in deuterium excess values, at 1492.45 m depth in borehole NGRIP2.',
      fr: 'Fin de l’épisode froid du Dryas récent (Younger Dryas), reflétée par un changement des valeurs de l’excès de deutérium, à 1492,45 m de profondeur dans le forage NGRIP2.',
    },
    location: {
      es: 'Testigo de hielo NorthGRIP, Groenlandia central',
      en: 'NorthGRIP ice core, central Greenland',
      fr: 'Carotte de glace NorthGRIP, centre du Groenland',
    },
    ratified: 2008,
    reference: 'Episodes 31/2, 2008; J. Quaternary Sci. 24, p. 3-17, 2009',
    sources: G,
  },
  {
    id: 'base-northgrippian',
    appliesTo: ['northgrippian'],
    marker: {
      es: 'Evento climático de hace unos 8,2 ka (el evento de 8,2 ka), registrado en el testigo de hielo NGRIP1; datado en 8236 años antes de 2000 (b2k).',
      en: 'Climatic event at about 8.2 ka (the 8.2 kiloyear event), recorded in the NGRIP1 ice core; dated to 8236 years before 2000 (b2k).',
      fr: 'Événement climatique d’il y a environ 8,2 ka (l’événement à 8,2 ka), enregistré dans la carotte de glace NGRIP1 ; daté de 8236 ans avant 2000 (b2k).',
    },
    location: {
      es: 'Testigo de hielo NGRIP1, Groenlandia',
      en: 'NGRIP1 ice core, Greenland',
      fr: 'Carotte de glace NGRIP1, Groenland',
    },
    ratified: 2018,
    reference: 'Episodes 41(4), p. 213-223, 2018',
    sources: ['walker2018'],
  },
  {
    id: 'base-meghalayan',
    appliesTo: ['meghalayan'],
    marker: {
      es: 'Evento climático de hace unos 4,2 ka (el evento de 4,2 ka), registrado en un espeleotema de la cueva de Mawmluh; datado en 4250 años antes de 2000 (b2k).',
      en: 'Climatic event at about 4.2 ka (the 4.2 kiloyear event), recorded in a speleothem from Mawmluh Cave; dated to 4250 years before 2000 (b2k).',
      fr: 'Événement climatique d’il y a environ 4,2 ka (l’événement à 4,2 ka), enregistré dans une spéléothème de la grotte de Mawmluh ; daté de 4250 ans avant 2000 (b2k).',
    },
    location: {
      es: 'Cueva de Mawmluh, Meghalaya, noreste de la India',
      en: 'Mawmluh Cave, Meghalaya, northeastern India',
      fr: 'Grotte de Mawmluh, Meghalaya, nord-est de l’Inde',
    },
    ratified: 2018,
    reference: 'Episodes 41(4), p. 213-223, 2018',
    sources: ['walker2018'],
  },
];
