// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
// The Holocene and humankind. Years are calendar years (BCE negative). Ages "b2k" are years before 2000 CE.
import type { HoloEvent, Names } from './types';

/** Years before 2000 CE of the bases of the Holocene stages, as ratified (Walker et al. 2018). */
export const HOLOCENE_STAGES = [
  { id: 'greenlandian', baseB2k: 11700 },
  { id: 'northgrippian', baseB2k: 8236 },
  { id: 'meghalayan', baseB2k: 4250 },
] as const;

/** Calendar year of an age given in years before 2000 CE. */
export const yearFromB2k = (b2k: number): number => 2000 - b2k;

export const HOLO_EVENTS: HoloEvent[] = [
  {
    id: 'holocene-start',
    kind: 'climate',
    from: yearFromB2k(11700),
    approx: true,
    certainty: 'consensus',
    link: 'holocene',
    names: { es: 'Empieza el Holoceno', en: 'The Holocene begins', fr: 'Début de l’Holocène' },
    summary: {
      es: 'El Holoceno y su primera edad, el Groenlandiense, empiezan hace 11 700 años (antes de 2000), al final del enfriamiento del Younger Dryas, tal como se define en el testigo de hielo NGRIP2 de Groenlandia.',
      en: 'The Holocene and its first age, the Greenlandian, begin 11,700 years before 2000, at the end of the Younger Dryas cold spell, as defined in the NGRIP2 ice core from Greenland.',
      fr: 'L’Holocène et son premier âge, le Groenlandien, commencent il y a 11 700 ans (avant 2000), à la fin de l’épisode froid du Younger Dryas, tel que défini dans la carotte de glace NGRIP2 du Groenland.',
    },
    sources: ['walker2018', 'ics-gssp-table'],
  },
  {
    id: 'gobekli-tepe',
    kind: 'human',
    from: -9600,
    to: -8200,
    approx: true,
    certainty: 'consensus',
    names: { es: 'Göbekli Tepe', en: 'Göbekli Tepe', fr: 'Göbekli Tepe' },
    summary: {
      es: 'En el sureste de Anatolia (actual Turquía), grupos de cazadores-recolectores del Neolítico Precerámico levantaron entre 9600 y 8200 a. C. recintos megalíticos circulares y rectangulares con pilares monolíticos en forma de T. La UNESCO (Patrimonio Mundial desde 2018) los describe como una de las primeras manifestaciones de arquitectura monumental construida por el ser humano.',
      en: 'In south-eastern Anatolia (present-day Turkey), Pre-Pottery Neolithic hunter-gatherers raised round-oval and rectangular megalithic enclosures with monolithic T-shaped pillars between 9600 and 8200 BCE. UNESCO (World Heritage Site since 2018) describes them as one of the first manifestations of human-made monumental architecture.',
      fr: 'Dans le sud-est de l’Anatolie (Turquie actuelle), des chasseurs-cueilleurs du Néolithique précéramique ont édifié entre 9600 et 8200 av. J.-C. des enceintes mégalithiques circulaires et rectangulaires à piliers monolithiques en forme de T. L’UNESCO (patrimoine mondial depuis 2018) les décrit comme l’une des premières manifestations d’architecture monumentale construite par l’être humain.',
    },
    sources: ['unesco-gobekli'],
  },
  {
    id: 'northgrippian-start',
    kind: 'climate',
    from: yearFromB2k(8236),
    approx: true,
    certainty: 'consensus',
    link: 'northgrippian',
    names: { es: 'Evento de 8,2 ka: empieza el Norgripiense', en: 'The 8.2 ka event: the Northgrippian begins', fr: 'Événement à 8,2 ka : début du Norgrippien' },
    summary: {
      es: 'La base del Norgripiense, la segunda edad del Holoceno, se define por un evento climático de hace unos 8,2 ka registrado en el testigo de hielo NGRIP1 y datado en 8236 años antes de 2000. Fue ratificada en 2018.',
      en: 'The base of the Northgrippian, the second age of the Holocene, is defined by a climatic event about 8.2 ka ago recorded in the NGRIP1 ice core and dated to 8236 years before 2000. It was ratified in 2018.',
      fr: 'La base du Norgrippien, deuxième âge de l’Holocène, est définie par un événement climatique d’il y a environ 8,2 ka enregistré dans la carotte de glace NGRIP1 et daté de 8236 ans avant 2000. Elle a été ratifiée en 2018.',
    },
    sources: ['walker2018'],
  },
  {
    id: 'first-writing',
    kind: 'human',
    from: -3350,
    to: -3000,
    approx: true,
    certainty: 'consensus',
    names: { es: 'Primera escritura (protocuneiforme)', en: 'First writing (proto-cuneiform)', fr: 'Première écriture (proto-cunéiforme)' },
    summary: {
      es: 'El protocuneiforme, un complejo sistema contable con cientos de signos, aparece documentado en tablillas de arcilla de la ciudad de Uruk (sur de Irak) hacia 3350-3000 a. C. Estaba precedido por sellos, fichas y notaciones numéricas. Las fechas exactas se siguen afinando.',
      en: 'Proto-cuneiform, a complex accounting system with hundreds of signs, is first attested on clay tablets from the city of Uruk (southern Iraq) around 3350–3000 BCE. It was preceded by seals, tokens and numerical notations. The exact dates are still being refined.',
      fr: 'Le proto-cunéiforme, un système comptable complexe de centaines de signes, est attesté pour la première fois sur des tablettes d’argile de la ville d’Uruk (sud de l’Irak) vers 3350-3000 av. J.-C. Il était précédé de sceaux, de jetons et de notations numériques. Les dates exactes sont encore affinées.',
    },
    sources: ['antiquity-writing', 'met-writing'],
  },
  {
    id: 'meghalayan-start',
    kind: 'climate',
    from: yearFromB2k(4250),
    approx: true,
    certainty: 'consensus',
    link: 'meghalayan',
    names: { es: 'Evento de 4,2 ka: empieza el Megalayense', en: 'The 4.2 ka event: the Meghalayan begins', fr: 'Événement à 4,2 ka : début du Meghalayen' },
    summary: {
      es: 'La base del Megalayense, la tercera y actual edad del Holoceno, se define por un evento climático de hace unos 4,2 ka registrado en un espeleotema de la cueva de Mawmluh (Meghalaya, India) y datado en 4250 años antes de 2000. Fue ratificada en 2018.',
      en: 'The base of the Meghalayan, the third and present age of the Holocene, is defined by a climatic event about 4.2 ka ago recorded in a speleothem from Mawmluh Cave (Meghalaya, India) and dated to 4250 years before 2000. It was ratified in 2018.',
      fr: 'La base du Meghalayen, troisième et actuel âge de l’Holocène, est définie par un événement climatique d’il y a environ 4,2 ka enregistré dans une spéléothème de la grotte de Mawmluh (Meghalaya, Inde) et daté de 4250 ans avant 2000. Elle a été ratifiée en 2018.',
    },
    sources: ['walker2018'],
  },
  {
    id: 'ga-1750',
    kind: 'human',
    from: 1750,
    approx: true,
    certainty: 'consensus',
    names: { es: '1750: arranque de las curvas de la Gran Aceleración', en: '1750: start of the Great Acceleration graphs', fr: '1750 : début des courbes de la Grande Accélération' },
    summary: {
      es: 'Las 24 curvas de la «Gran Aceleración» (12 de actividad humana y 12 del sistema Tierra) arrancan en 1750, con el comienzo de la revolución industrial, y llegan hasta 2010 en su última actualización.',
      en: 'The 24 “Great Acceleration” graphs (12 for human activity and 12 for the Earth System) start in 1750, with the beginning of the industrial revolution, and run to 2010 in their latest update.',
      fr: 'Les 24 courbes de la « Grande Accélération » (12 pour l’activité humaine et 12 pour le système Terre) commencent en 1750, avec le début de la révolution industrielle, et vont jusqu’à 2010 dans leur dernière mise à jour.',
    },
    sources: ['steffen2015'],
  },
  {
    id: 'great-acceleration',
    kind: 'human',
    from: 1950,
    approx: true,
    certainty: 'consensus',
    names: { es: 'Hacia 1950: la Gran Aceleración', en: 'Around 1950: the Great Acceleration', fr: 'Vers 1950 : la Grande Accélération' },
    summary: {
      es: 'Casi todos los indicadores de actividad humana y de cambio en el sistema Tierra muestran sus mayores cambios desde 1950, dentro de una sola vida humana. Los autores concluyen que, de todas las fechas candidatas, el inicio de la Gran Aceleración es la más convincente para el Antropoceno desde la ciencia del sistema Tierra.',
      en: 'Almost all indicators of human activity and of change in the Earth System show their largest changes since 1950, within a single human lifetime. The authors conclude that, of all the candidate start dates, the beginning of the Great Acceleration is by far the most convincing for the Anthropocene from an Earth System science perspective.',
      fr: 'Presque tous les indicateurs de l’activité humaine et du changement du système Terre montrent leurs plus grands changements depuis 1950, à l’échelle d’une seule vie humaine. Les auteurs concluent que, parmi toutes les dates candidates, le début de la Grande Accélération est de loin la plus convaincante pour l’Anthropocène du point de vue de la science du système Terre.',
    },
    sources: ['steffen2015'],
  },
  {
    id: 'anthropocene-proposal',
    kind: 'anthropocene',
    from: 1950,
    approx: true,
    certainty: 'debated',
    names: { es: 'Propuesta del Antropoceno como época', en: 'The Anthropocene proposed as an epoch', fr: 'L’Anthropocène proposé comme époque' },
    summary: {
      es: 'El Grupo de Trabajo sobre el Antropoceno (creado en 2009 dentro de la Subcomisión de Estratigrafía del Cuaternario) propuso una época que empezaría a mediados del siglo XX, con la Edad Crawfordiense, y que pondría fin al Holoceno sin alterar sus subdivisiones salvo el Megalayense. Es una propuesta de estratigrafía formal, distinta del uso del término en otras disciplinas.',
      en: 'The Anthropocene Working Group (created in 2009 within the Subcommission on Quaternary Stratigraphy) proposed an epoch starting in the mid-twentieth century, with the Crawfordian Age, that would end the Holocene without affecting its subdivisions other than terminating the Meghalayan. It is a proposal in formal stratigraphy, distinct from how the term is used in other disciplines.',
      fr: 'Le Groupe de travail sur l’Anthropocène (créé en 2009 au sein de la Sous-commission de stratigraphie du Quaternaire) a proposé une époque débutant au milieu du XXe siècle, avec l’âge Crawfordien, qui mettrait fin à l’Holocène sans toucher à ses subdivisions autres que le Meghalayen. C’est une proposition de stratigraphie formelle, distincte de l’usage du terme dans d’autres disciplines.',
    },
    sources: ['awg', 'walker2018'],
  },
  {
    id: 'iugs-2024',
    kind: 'anthropocene',
    from: 2024,
    certainty: 'consensus',
    names: { es: '2024: la IUGS rechaza la época', en: '2024: the IUGS rejects the epoch', fr: '2024 : l’IUGS rejette l’époque' },
    summary: {
      es: 'En marzo de 2024 la Subcomisión de Estratigrafía del Cuaternario votó rechazar la propuesta, y el 20 de marzo la IUGS y la ICS aprobaron ese voto: el Antropoceno no es una unidad formal de la Escala de Tiempo Geológico. Seguimos formalmente en el Holoceno (edad Megalayense). El debate ha continuado: se han cuestionado y defendido los procedimientos del voto.',
      en: 'In March 2024 the Subcommission on Quaternary Stratigraphy voted to reject the proposal, and on 20 March the IUGS and the ICS approved that vote: the Anthropocene is not a formal unit of the Geologic Time Scale. We remain formally in the Holocene (Meghalayan age). The debate has continued: the voting procedures have been questioned and defended.',
      fr: 'En mars 2024, la Sous-commission de stratigraphie du Quaternaire a voté le rejet de la proposition et, le 20 mars, l’IUGS et l’ICS ont approuvé ce vote : l’Anthropocène n’est pas une unité formelle de l’échelle des temps géologiques. Nous sommes formellement dans l’Holocène (âge Meghalayen). Le débat s’est poursuivi : les procédures du vote ont été contestées et défendues.',
    },
    link: 'meghalayan',
    sources: ['iugs-ics-2024', 'eos2024', 'nree2026'],
  },
];

export const ANTHROPOCENE_PANEL: { title: Names; points: Names[] } = {
  title: { es: '¿Y el Antropoceno?', en: 'And the Anthropocene?', fr: 'Et l’Anthropocène ?' },
  points: [
    {
      es: 'No es una unidad oficial. La IUGS y la ICS aprobaron el 20 de marzo de 2024 el voto que rechazó la propuesta de época. Formalmente seguimos en el Holoceno, en su edad Megalayense.',
      en: 'It is not an official unit. On 20 March 2024 the IUGS and the ICS approved the vote that rejected the epoch proposal. Formally we remain in the Holocene, in its Meghalayan age.',
      fr: 'Ce n’est pas une unité officielle. Le 20 mars 2024, l’IUGS et l’ICS ont approuvé le vote qui a rejeté la proposition d’époque. Formellement, nous sommes toujours dans l’Holocène, dans son âge Meghalayen.',
    },
    {
      es: 'Eso no niega los cambios humanos en el planeta. La Gran Aceleración documenta, con 24 indicadores, un salto de la actividad humana y de sus efectos en el sistema Tierra desde 1950. Lo que se discutió fue si debe ser una unidad de la escala geológica y con qué fecha de inicio.',
      en: 'That does not deny human changes to the planet. The Great Acceleration documents, with 24 indicators, a jump in human activity and in its effects on the Earth System since 1950. What was debated is whether it should be a unit of the geological timescale and with what start date.',
      fr: 'Cela ne nie pas les changements humains sur la planète. La Grande Accélération documente, avec 24 indicateurs, un bond de l’activité humaine et de ses effets sur le système Terre depuis 1950. Ce qui a été débattu, c’est de savoir si elle doit être une unité de l’échelle géologique et avec quelle date de début.',
    },
    {
      es: 'El término sigue usándose en muchas disciplinas, y el debate científico continúa abierto: las críticas al procedimiento del voto y sus respuestas siguen publicándose.',
      en: 'The term is still used in many disciplines, and the scientific debate remains open: criticism of the voting procedure and the replies to it keep being published.',
      fr: 'Le terme reste utilisé dans de nombreuses disciplines et le débat scientifique reste ouvert : les critiques de la procédure de vote et les réponses continuent d’être publiées.',
    },
  ],
};
