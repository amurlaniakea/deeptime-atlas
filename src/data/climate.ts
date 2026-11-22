// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
// Climate states and key transitions of the Cenozoic, as described by Westerhold et al. (2020).
import type { ClimateMark, ClimateState } from './types';

const W = ['westerhold2020', 'westerhold2020-manuscript'];

export const CLIMATE_STATES: ClimateState[] = [
  {
    id: 'warmhouse', phaseId: 'warmhouse-1', startMa: 66, endMa: 56, color: '#e8a33d',
    names: { es: 'Warmhouse (cálido)', en: 'Warmhouse', fr: 'Warmhouse (chaud)' },
    summary: {
      es: 'Primera fase cálida, el Paleoceno (de 66 a 56 Ma). Las temperaturas globales eran más de 5 °C superiores a las actuales y no había grandes casquetes polares.',
      en: 'First warm phase, the Paleocene (66 to 56 Ma). Global temperatures were more than 5 °C warmer than today and there were no large polar ice sheets.',
      fr: 'Première phase chaude, le Paléocène (de 66 à 56 Ma). Les températures globales dépassaient de plus de 5 °C celles d’aujourd’hui et il n’y avait pas de grandes calottes polaires.',
    },
    sources: W,
  },
  {
    id: 'hothouse', phaseId: 'hothouse', startMa: 56, endMa: 47, color: '#d6453d',
    names: { es: 'Hothouse (invernadero extremo)', en: 'Hothouse', fr: 'Hothouse (serre extrême)' },
    summary: {
      es: 'Del Máximo Térmico del Paleoceno-Eoceno (56 Ma) al final del Óptimo Climático del Eoceno Temprano (47 Ma). Temperaturas más de 10 °C superiores a las actuales, mayor variabilidad y frecuentes episodios de calentamiento transitorio (hipertermales).',
      en: 'From the Paleocene–Eocene Thermal Maximum (56 Ma) to the end of the Early Eocene Climatic Optimum (47 Ma). Temperatures more than 10 °C warmer than today, larger variability and frequent transient warming events (hyperthermals).',
      fr: 'Du Maximum thermique du Paléocène-Éocène (56 Ma) à la fin de l’Optimum climatique de l’Éocène précoce (47 Ma). Températures supérieures de plus de 10 °C à celles d’aujourd’hui, variabilité plus grande et épisodes fréquents de réchauffement transitoire (hyperthermiques).',
    },
    sources: W,
  },
  {
    id: 'warmhouse', phaseId: 'warmhouse-2', startMa: 47, endMa: 34, color: '#e8a33d',
    names: { es: 'Warmhouse (cálido)', en: 'Warmhouse', fr: 'Warmhouse (chaud)' },
    summary: {
      es: 'Segunda fase cálida, del Eoceno medio y tardío (de 47 a 34 Ma), con un rango de temperaturas parecido al del Paleoceno pero con valores de fondo de δ¹³C y niveles de CO₂ atmosférico distintos.',
      en: 'Second warm phase, the middle and late Eocene (47 to 34 Ma), with a temperature range similar to the Paleocene but different background δ¹³C values and atmospheric CO₂ levels.',
      fr: 'Seconde phase chaude, l’Éocène moyen et supérieur (de 47 à 34 Ma), avec une plage de températures proche de celle du Paléocène mais des valeurs de fond de δ¹³C et des niveaux de CO₂ atmosphérique différents.',
    },
    sources: W,
  },
  {
    id: 'coolhouse', phaseId: 'coolhouse', startMa: 34, endMa: 3.3, color: '#5ba7c9',
    names: { es: 'Coolhouse (fresco)', en: 'Coolhouse', fr: 'Coolhouse (frais)' },
    summary: {
      es: 'De la transición Eoceno-Oligoceno (34 Ma) a hace 3,3 Ma. Empieza con un descenso escalonado de la temperatura y la aparición de grandes casquetes en la Antártida. Un cambio en el δ¹⁸O hace 13,9 Ma la divide en dos fases: una más cálida, que culmina en el Óptimo Climático del Mioceno (hace unos 17-14 Ma), y otra de enfriamiento.',
      en: 'From the Eocene–Oligocene Transition (34 Ma) to 3.3 Ma. It begins with a stepwise drop in temperature and the appearance of large ice sheets on Antarctica. A shift in δ¹⁸O at 13.9 Ma divides it into two phases: a warmer one culminating in the Miocene Climatic Optimum (about 17–14 Ma) and a cooling one.',
      fr: 'De la transition Éocène-Oligocène (34 Ma) à 3,3 Ma. Elle commence par une baisse de température par paliers et l’apparition de grandes calottes sur l’Antarctique. Un changement du δ¹⁸O à 13,9 Ma la divise en deux phases : l’une plus chaude, qui culmine à l’Optimum climatique du Miocène (environ 17-14 Ma), l’autre de refroidissement.',
    },
    sources: W,
  },
  {
    id: 'icehouse', phaseId: 'icehouse', startMa: 3.3, endMa: 0, color: '#7b86d6',
    names: { es: 'Icehouse (glacial)', en: 'Icehouse', fr: 'Icehouse (glaciaire)' },
    summary: {
      es: 'Desde hace 3,3 Ma hasta hoy, con casquetes crecientes y menguantes en el hemisferio norte; quedó plenamente establecido hacia la transición Plioceno-Pleistoceno. Según los autores, la dinámica clima-criosfera de esta etapa no tiene comparación con lo visto en los 60 millones de años anteriores.',
      en: 'From 3.3 Ma to today, with waxing and waning ice sheets in the Northern Hemisphere; it was fully established by the Pliocene–Pleistocene transition. According to the authors, the climate–cryosphere dynamics of this state are not comparable to anything seen in the preceding 60 or more million years.',
      fr: 'De 3,3 Ma à aujourd’hui, avec des calottes qui croissent et décroissent dans l’hémisphère nord ; il était pleinement établi à la transition Pliocène-Pléistocène. Selon les auteurs, la dynamique climat-cryosphère de cet état n’est comparable à rien de ce qu’on a vu dans les 60 millions d’années précédentes.',
    },
    sources: W,
  },
];

export const CLIMATE_MARKS: ClimateMark[] = [
  {
    id: 'petm', ageMa: 56, approx: true,
    names: { es: 'Máximo Térmico del Paleoceno-Eoceno (PETM)', en: 'Paleocene–Eocene Thermal Maximum (PETM)', fr: 'Maximum thermique du Paléocène-Éocène (PETM)' },
    summary: {
      es: 'El mayor evento de calentamiento transitorio, sin precedentes en los últimos 100 millones de años: un calentamiento global de 5 a 8 °C.',
      en: 'The largest transient warming event, unprecedented in the last 100 million years: a global warming of 5 to 8 °C.',
      fr: 'Le plus grand épisode de réchauffement transitoire, sans précédent depuis 100 millions d’années : un réchauffement global de 5 à 8 °C.',
    },
    sources: W,
  },
  {
    id: 'eeco-end', ageMa: 47,
    names: { es: 'Final del Óptimo Climático del Eoceno Temprano', en: 'End of the Early Eocene Climatic Optimum', fr: 'Fin de l’Optimum climatique de l’Éocène précoce' },
    summary: {
      es: 'Termina el estado Hothouse; el clima entra en la segunda fase Warmhouse.',
      en: 'The Hothouse state ends; the climate enters the second Warmhouse phase.',
      fr: 'L’état Hothouse prend fin ; le climat entre dans la seconde phase Warmhouse.',
    },
    sources: W,
  },
  {
    id: 'eot', ageMa: 34.025,
    names: { es: 'Transición Eoceno-Oligoceno (EOT)', en: 'Eocene–Oligocene Transition (EOT)', fr: 'Transition Éocène-Oligocène (EOT)' },
    summary: {
      es: 'Aparición de grandes casquetes en la Antártida (34,025 Ma en el modelo de edades de la serie). El análisis de recurrencia la señala como la transición más destacada de todo el Cenozoico: del Warmhouse al Coolhouse.',
      en: 'Onset of large ice sheets on Antarctica (34.025 Ma in the record’s age model). Recurrence analysis marks it as the most prominent transition of the whole Cenozoic: from Warmhouse to Coolhouse.',
      fr: 'Apparition de grandes calottes sur l’Antarctique (34,025 Ma dans le modèle d’âge de la série). L’analyse de récurrence la désigne comme la transition la plus marquante de tout le Cénozoïque : du Warmhouse au Coolhouse.',
    },
    sources: W,
  },
  {
    id: 'mmct', ageMa: 13.9,
    names: { es: 'Transición climática del Mioceno medio', en: 'Middle Miocene Climate Transition', fr: 'Transition climatique du Miocène moyen' },
    summary: {
      es: 'Aumento marcado del δ¹⁸O ligado a la expansión de los casquetes antárticos; divide el Coolhouse en dos fases.',
      en: 'A marked increase in δ¹⁸O related to the expansion of the Antarctic ice sheets; it divides the Coolhouse into two phases.',
      fr: 'Forte hausse du δ¹⁸O liée à l’expansion des calottes antarctiques ; elle divise le Coolhouse en deux phases.',
    },
    sources: W,
  },
  {
    id: 'm2', ageMa: 3.3,
    names: { es: 'Glaciación M2 (Plioceno medio)', en: 'M2 glacial (mid-Pliocene)', fr: 'Glaciation M2 (Pliocène moyen)' },
    summary: {
      es: 'El primer gran evento glacial del hemisferio norte; los autores lo sitúan como posible precursor del Icehouse y fijan en 3,3 Ma el inicio de ese estado.',
      en: 'The first major glacial event of the Northern Hemisphere; the authors regard it as a possible harbinger of the Icehouse and place the start of that state at 3.3 Ma.',
      fr: 'Le premier grand événement glaciaire de l’hémisphère nord ; les auteurs y voient un possible signe avant-coureur de l’Icehouse et placent à 3,3 Ma le début de cet état.',
    },
    sources: W,
  },
  {
    id: 'nhg', ageMa: 2.7, approx: true,
    names: { es: 'Intensificación de la glaciación del hemisferio norte', en: 'Intensification of Northern Hemisphere glaciation', fr: 'Intensification de la glaciation de l’hémisphère nord' },
    summary: {
      es: 'Hace unos 2,7 Ma crecen los casquetes del hemisferio norte y el δ¹⁸O pasa a reflejar mucho más volumen de hielo.',
      en: 'About 2.7 Ma, Northern Hemisphere ice sheets grow and δ¹⁸O increasingly reflects ice volume.',
      fr: 'Vers 2,7 Ma, les calottes de l’hémisphère nord se développent et le δ¹⁸O reflète de plus en plus le volume de glace.',
    },
    sources: W,
  },
];
