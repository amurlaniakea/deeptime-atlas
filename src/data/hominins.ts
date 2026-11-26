// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
// Hominin fossil sites: a selection, ordered from oldest to youngest by the middle of the age range.
// Ages come from the cited papers. Coordinates marked 'approx' are approximate (about 0.1 degree).
import type { HomininSite } from './types';

export const HOMININ_SITES: HomininSite[] = [
  {
    id: 'toumai', taxa: 'Sahelanthropus tchadensis',
    place: { es: 'Toros-Menalla', en: 'Toros-Menalla', fr: 'Toros-Menalla' },
    country: { es: 'Chad', en: 'Chad', fr: 'Tchad' },
    lat: 16.25, lon: 17.48, coords: 'paper',
    age: { from: 7.2, to: 6.8 }, certainty: 'debated', link: 'messinian',
    names: { es: 'Toumaï', en: 'Toumaï', fr: 'Toumaï' },
    summary: {
      es: 'Restos de Sahelanthropus tchadensis de la zona fosilífera de Toros-Menalla, en Chad. La datación por nucleidos cosmogénicos (¹⁰Be/⁹Be) da una edad de 6,8 a 7,2 Ma. Su condición de homínino se discute.',
      en: 'Remains of Sahelanthropus tchadensis from the Toros-Menalla fossiliferous area of Chad. Cosmogenic-nuclide (¹⁰Be/⁹Be) dating gives an age of 6.8 to 7.2 Ma. Its status as a hominin is contested.',
      fr: 'Restes de Sahelanthropus tchadensis de la zone fossilifère de Toros-Menalla, au Tchad. La datation par nucléides cosmogéniques (¹⁰Be/⁹Be) donne un âge de 6,8 à 7,2 Ma. Son statut d’homininé est contesté.',
    },
    sources: ['lebatard2008', 'nature-edu-earliest-hominins'],
  },
  {
    id: 'ardi', taxa: 'Ardipithecus ramidus',
    place: { es: 'Aramis, Middle Awash', en: 'Aramis, Middle Awash', fr: 'Aramis, Middle Awash' },
    country: { es: 'Etiopía', en: 'Ethiopia', fr: 'Éthiopie' },
    lat: 10.5, lon: 40.5, coords: 'approx',
    age: { from: 4.4 }, certainty: 'consensus', link: 'zanclean',
    names: { es: 'Ardi', en: 'Ardi', fr: 'Ardi' },
    summary: {
      es: 'Ardipithecus ramidus, en Aramis (Middle Awash, Etiopía): un esqueleto parcial, «Ardi», reconstruido a partir de unos 125 fragmentos, hallado entre dos tobas volcánicas, ambas datadas en 4,4 Ma. Su paleobiología se describió en una serie de artículos de Science en 2009.',
      en: 'Ardipithecus ramidus at Aramis (Middle Awash, Ethiopia): a partial skeleton, “Ardi”, reconstructed from about 125 fragments and found between two volcanic tuffs, both dated to 4.4 Ma. Its paleobiology was described in a series of papers in Science in 2009.',
      fr: 'Ardipithecus ramidus à Aramis (Middle Awash, Éthiopie) : un squelette partiel, « Ardi », reconstitué à partir d’environ 125 fragments et trouvé entre deux tufs volcaniques, tous deux datés de 4,4 Ma. Sa paléobiologie a été décrite dans une série d’articles de Science en 2009.',
    },
    sources: ['white2009'],
  },
  {
    id: 'lucy', taxa: 'Australopithecus afarensis',
    place: { es: 'Hadar, Afar', en: 'Hadar, Afar', fr: 'Hadar, Afar' },
    country: { es: 'Etiopía', en: 'Ethiopia', fr: 'Éthiopie' },
    lat: 11.1, lon: 40.6, coords: 'approx',
    age: { from: 3.18, approx: true }, certainty: 'consensus', link: 'piacenzian',
    names: { es: 'Lucy (AL 288-1)', en: 'Lucy (AL 288-1)', fr: 'Lucy (AL 288-1)' },
    summary: {
      es: 'AL 288-1, «Lucy», Australopithecus afarensis, hallada en Hadar (Afar, Etiopía) en 1974. La datación 40Ar/39Ar de cristales individuales de las tobas de la Formación Hadar la sitúa en poco menos de 3,18 millones de años.',
      en: 'AL 288-1, “Lucy”, Australopithecus afarensis, found at Hadar (Afar, Ethiopia) in 1974. Single-crystal 40Ar/39Ar dating of the tuffs of the Hadar Formation places her at just under 3.18 million years.',
      fr: 'AL 288-1, « Lucy », Australopithecus afarensis, trouvée à Hadar (Afar, Éthiopie) en 1974. La datation 40Ar/39Ar sur cristaux individuels des tufs de la Formation de Hadar la situe à un peu moins de 3,18 millions d’années.',
    },
    sources: ['iho-lucy'],
  },
  {
    id: 'ledi-geraru', taxa: 'Homo sp. indet.',
    place: { es: 'Ledi-Geraru, Afar', en: 'Ledi-Geraru, Afar', fr: 'Ledi-Geraru, Afar' },
    country: { es: 'Etiopía', en: 'Ethiopia', fr: 'Éthiopie' },
    lat: 11.5, lon: 41.0, coords: 'approx',
    age: { from: 2.8, to: 2.75 }, certainty: 'debated', link: 'piacenzian',
    names: { es: 'Mandíbula de Ledi-Geraru (LD 350-1)', en: 'Ledi-Geraru mandible (LD 350-1)', fr: 'Mandibule de Ledi-Geraru (LD 350-1)' },
    summary: {
      es: 'LD 350-1, una hemimandíbula izquierda con dientes de la zona de Ledi-Geraru (Afar, Etiopía), cerca de Hadar. Datada entre 2,80 y 2,75 Ma, era en 2015 el fósil más antiguo conocido asignado al género Homo. Se clasifica como Homo sp. indet.: no se ha determinado la especie.',
      en: 'LD 350-1, a left half of a mandible with teeth from the Ledi-Geraru area (Afar, Ethiopia), near Hadar. Dated to 2.80–2.75 Ma, it was in 2015 the oldest known fossil assigned to the genus Homo. It is classified as Homo sp. indet.: the species is not determined.',
      fr: 'LD 350-1, une demi-mandibule gauche avec dents de la zone de Ledi-Geraru (Afar, Éthiopie), près de Hadar. Datée de 2,80 à 2,75 Ma, elle était en 2015 le plus ancien fossile connu attribué au genre Homo. Elle est classée Homo sp. indet. : l’espèce n’est pas déterminée.',
    },
    sources: ['villmoare2015'],
  },
  {
    id: 'dmanisi', taxa: 'Homo (early Homo; H. erectus sensu lato)',
    place: { es: 'Dmanisi', en: 'Dmanisi', fr: 'Dmanissi' },
    country: { es: 'Georgia', en: 'Georgia', fr: 'Géorgie' },
    lat: 41.33, lon: 44.34, coords: 'approx',
    age: { from: 1.85, to: 1.78 }, certainty: 'debated', link: 'pleistocene',
    names: { es: 'Dmanisi', en: 'Dmanisi', fr: 'Dmanissi' },
    summary: {
      es: 'Cinco cráneos de homíninos de un mismo yacimiento del Cáucaso, de hace unos 1,8 Ma; las ocupaciones más antiguas se datan entre 1,85 y 1,78 Ma. El cráneo 5, el primer cráneo adulto completo de esta antigüedad, muestra una gran variación dentro de una población, que los autores interpretan como indicio de que la diversidad del Homo temprano puede corresponder a un único linaje.',
      en: 'Five hominin skulls from one site in the Caucasus, about 1.8 Ma old; the earliest occupations are dated to 1.85–1.78 Ma. Skull 5, the first completely preserved adult skull of this age, shows large variation within one population, which the authors interpret as a sign that the diversity of early Homo may represent a single lineage.',
      fr: 'Cinq crânes d’hominines d’un même site du Caucase, vieux d’environ 1,8 Ma ; les plus anciennes occupations sont datées de 1,85 à 1,78 Ma. Le crâne 5, le premier crâne adulte complet de cet âge, montre une grande variation au sein d’une population, que les auteurs interprètent comme un indice que la diversité des premiers Homo pourrait correspondre à une seule lignée.',
    },
    sources: ['lordkipanidze2013', 'ferring2011'],
  },
  {
    id: 'sima-elefante', taxa: 'Homo sp.',
    place: { es: 'Sima del Elefante, Atapuerca', en: 'Sima del Elefante, Atapuerca', fr: 'Sima del Elefante, Atapuerca' },
    country: { es: 'España', en: 'Spain', fr: 'Espagne' },
    lat: 42.371, lon: -3.547, coords: 'unesco',
    age: { from: 1.2, to: 1.1, approx: true }, certainty: 'debated', link: 'calabrian',
    names: { es: 'Sima del Elefante (Atapuerca)', en: 'Sima del Elefante (Atapuerca)', fr: 'Sima del Elefante (Atapuerca)' },
    summary: {
      es: 'Nivel TE9 de la Sima del Elefante: un fragmento de mandíbula (ATE9-1) y herramientas líticas del Modo 1, de hace entre 1,2 y 1,1 Ma, la evidencia más antigua de homíninos en Europa occidental. Forma parte del Yacimiento Arqueológico de Atapuerca, Patrimonio Mundial de la UNESCO desde 2000.',
      en: 'Level TE9 of Sima del Elefante: a mandible fragment (ATE9-1) and Mode 1 stone tools, 1.2 to 1.1 Ma old, the earliest evidence of hominins in western Europe. It is part of the Archaeological Site of Atapuerca, a UNESCO World Heritage Site since 2000.',
      fr: 'Niveau TE9 de la Sima del Elefante : un fragment de mandibule (ATE9-1) et des outils lithiques du Mode 1, vieux de 1,2 à 1,1 Ma, la plus ancienne trace d’hominines en Europe occidentale. Il fait partie du site archéologique d’Atapuerca, patrimoine mondial de l’UNESCO depuis 2000.',
    },
    sources: ['carbonell2008', 'unesco-atapuerca'],
  },
  {
    id: 'gran-dolina', taxa: 'Homo antecessor',
    place: { es: 'Gran Dolina, Atapuerca', en: 'Gran Dolina, Atapuerca', fr: 'Gran Dolina, Atapuerca' },
    country: { es: 'España', en: 'Spain', fr: 'Espagne' },
    lat: 42.371, lon: -3.547, coords: 'unesco',
    age: { from: 0.86, to: 0.78 }, certainty: 'debated', link: 'calabrian',
    names: { es: 'Gran Dolina, nivel TD6 (Atapuerca)', en: 'Gran Dolina, level TD6 (Atapuerca)', fr: 'Gran Dolina, niveau TD6 (Atapuerca)' },
    summary: {
      es: 'Del nivel TD6 se han recuperado más de 170 fósiles humanos desde 1994; se describieron como Homo antecessor en 1997. El nivel se data entre 0,78 y 0,86 Ma por paleomagnetismo y ESR/series de uranio; un diente estudiado por paleoproteómica (ATD6-92) se dató entre 772 y 949 ka. Las proteínas indican un linaje hermano cercano de los homíninos posteriores del Pleistoceno medio y tardío, incluidos humanos modernos, neandertales y denisovanos.',
      en: 'More than 170 human fossils have been recovered from level TD6 since 1994; they were described as Homo antecessor in 1997. The level is dated to 0.78–0.86 Ma by palaeomagnetism and ESR/U-series; a tooth studied by palaeoproteomics (ATD6-92) was dated to 772–949 ka. The proteins indicate a close sister lineage to later Middle and Late Pleistocene hominins, including modern humans, Neanderthals and Denisovans.',
      fr: 'Plus de 170 fossiles humains ont été retirés du niveau TD6 depuis 1994 ; ils ont été décrits comme Homo antecessor en 1997. Le niveau est daté de 0,78 à 0,86 Ma par paléomagnétisme et ESR/séries de l’uranium ; une dent étudiée par paléoprotéomique (ATD6-92) a été datée de 772 à 949 ka. Les protéines indiquent une lignée sœur proche des hominines postérieurs du Pléistocène moyen et supérieur, dont les humains modernes, les Néandertaliens et les Dénisoviens.',
    },
    sources: ['welker2020', 'unesco-atapuerca'],
  },
  {
    id: 'sima-huesos', taxa: 'Neanderthal lineage (Homo sp.)',
    place: { es: 'Sima de los Huesos, Atapuerca', en: 'Sima de los Huesos, Atapuerca', fr: 'Sima de los Huesos, Atapuerca' },
    country: { es: 'España', en: 'Spain', fr: 'Espagne' },
    lat: 42.371, lon: -3.547, coords: 'unesco',
    age: { from: 0.43, approx: true }, certainty: 'consensus', link: 'chibanian',
    names: { es: 'Sima de los Huesos (Atapuerca)', en: 'Sima de los Huesos (Atapuerca)', fr: 'Sima de los Huesos (Atapuerca)' },
    summary: {
      es: 'En la Cueva Mayor, la Sima de los Huesos ha dado más de 1600 fósiles humanos, de hace unos 430 000 años. Los rasgos del cráneo los vinculan con el linaje neandertal, y sus secuencias de ADN nuclear muestran que están más emparentados con los neandertales que con los denisovanos.',
      en: 'In the Cueva Mayor, the Sima de los Huesos has yielded more than 1,600 human fossils, about 430,000 years old. Cranial features link them to the Neanderthal lineage, and their nuclear DNA sequences show they are more closely related to Neanderthals than to Denisovans.',
      fr: 'Dans la Cueva Mayor, la Sima de los Huesos a livré plus de 1600 fossiles humains, vieux d’environ 430 000 ans. Les caractères du crâne les rattachent à la lignée néandertalienne, et leurs séquences d’ADN nucléaire montrent qu’ils sont plus proches des Néandertaliens que des Dénisoviens.',
    },
    sources: ['arsuaga2014', 'meyer2016', 'unesco-atapuerca'],
  },
  {
    id: 'jebel-irhoud', taxa: 'Homo sapiens (early)',
    place: { es: 'Jebel Irhoud', en: 'Jebel Irhoud', fr: 'Jebel Irhoud' },
    country: { es: 'Marruecos', en: 'Morocco', fr: 'Maroc' },
    lat: 31.86, lon: -8.87, coords: 'approx',
    age: { from: 0.315, err: 0.034 }, certainty: 'debated', link: 'chibanian',
    names: { es: 'Jebel Irhoud', en: 'Jebel Irhoud', fr: 'Jebel Irhoud' },
    summary: {
      es: 'Fósiles atribuidos a los primeros Homo sapiens, junto con herramientas de la Edad de Piedra Media, datados por termoluminiscencia de sílex quemado en 315 ± 34 ka. Encontrados en el norte de África, apoyan un origen panafricano de nuestra especie.',
      en: 'Fossils attributed to early Homo sapiens, with Middle Stone Age tools, dated by thermoluminescence of burnt flint to 315 ± 34 ka. Found in North Africa, they support a pan-African origin of our species.',
      fr: 'Fossiles attribués aux premiers Homo sapiens, avec des outils de l’Âge de pierre moyen, datés par thermoluminescence de silex brûlés à 315 ± 34 ka. Trouvés en Afrique du Nord, ils soutiennent une origine panafricaine de notre espèce.',
    },
    sources: ['hublin2017', 'richter2017'],
  },
  {
    id: 'rising-star', taxa: 'Homo naledi',
    place: { es: 'Sistema de cuevas Rising Star', en: 'Rising Star cave system', fr: 'Réseau de grottes de Rising Star' },
    country: { es: 'Sudáfrica', en: 'South Africa', fr: 'Afrique du Sud' },
    lat: -26.02, lon: 27.74, coords: 'approx',
    age: { from: 0.335, to: 0.236 }, certainty: 'consensus', link: 'chibanian',
    names: { es: 'Homo naledi (Rising Star)', en: 'Homo naledi (Rising Star)', fr: 'Homo naledi (Rising Star)' },
    summary: {
      es: 'Homo naledi, un homínino de cerebro pequeño, vivió hace entre 236 000 y 335 000 años, en la misma época que los primeros Homo sapiens de África.',
      en: 'Homo naledi, a small-brained hominin, lived between 236,000 and 335,000 years ago, contemporaneous with early Homo sapiens in Africa.',
      fr: 'Homo naledi, un hominine au petit cerveau, a vécu il y a entre 236 000 et 335 000 ans, à la même époque que les premiers Homo sapiens d’Afrique.',
    },
    sources: ['berger2017'],
  },
  {
    id: 'omo-kibish', taxa: 'Homo sapiens (Omo I)',
    place: { es: 'Formación Omo Kibish', en: 'Omo Kibish Formation', fr: 'Formation d’Omo Kibish' },
    country: { es: 'Etiopía', en: 'Ethiopia', fr: 'Éthiopie' },
    lat: 5.4, lon: 35.9, coords: 'approx',
    age: { from: 0.233, err: 0.022, minimum: true }, certainty: 'debated', link: 'chibanian',
    names: { es: 'Omo I (Omo Kibish)', en: 'Omo I (Omo Kibish)', fr: 'Omo I (Omo Kibish)' },
    summary: {
      es: 'Los fósiles de Omo I tienen una edad mínima de 233 ± 22 ka, obtenida por datación 40Ar/39Ar de la ceniza volcánica que los recubre. Son más antiguos que las estimaciones anteriores y son el Homo sapiens más antiguo conocido del este de África.',
      en: 'The Omo I fossils have a minimum age of 233 ± 22 ka, obtained by 40Ar/39Ar dating of the volcanic ash that overlies them. They are older than earlier estimates and are the oldest known Homo sapiens from eastern Africa.',
      fr: 'Les fossiles d’Omo I ont un âge minimal de 233 ± 22 ka, obtenu par datation 40Ar/39Ar de la cendre volcanique qui les recouvre. Ils sont plus anciens que les estimations précédentes et sont les plus anciens Homo sapiens connus d’Afrique de l’Est.',
    },
    sources: ['vidal2022'],
  },
  {
    id: 'liang-bua', taxa: 'Homo floresiensis',
    place: { es: 'Cueva de Liang Bua, Flores', en: 'Liang Bua cave, Flores', fr: 'Grotte de Liang Bua, Florès' },
    country: { es: 'Indonesia', en: 'Indonesia', fr: 'Indonésie' },
    lat: -8.53, lon: 120.44, coords: 'approx',
    age: { from: 0.1, to: 0.06 }, certainty: 'consensus', link: 'late-pleistocene',
    names: { es: 'Liang Bua (Homo floresiensis)', en: 'Liang Bua (Homo floresiensis)', fr: 'Liang Bua (Homo floresiensis)' },
    summary: {
      es: 'Los restos esqueléticos de Homo floresiensis y los depósitos que los contienen se datan entre 100 000 y 60 000 años; las herramientas de piedra, entre 190 000 y 50 000 años. La nueva estratigrafía de 2016 revisó la cronología anterior de la cueva.',
      en: 'The skeletal remains of Homo floresiensis and the deposits containing them are dated to between 100,000 and 60,000 years ago; the stone artefacts to between 190,000 and 50,000 years ago. The new stratigraphy of 2016 revised the cave’s earlier chronology.',
      fr: 'Les restes squelettiques d’Homo floresiensis et les dépôts qui les contiennent sont datés de 100 000 à 60 000 ans ; les outils de pierre, de 190 000 à 50 000 ans. La nouvelle stratigraphie de 2016 a révisé la chronologie antérieure de la grotte.',
    },
    sources: ['sutikna2016'],
  },
];

/** Middle of the age range, in Ma. */
export const siteMidpoint = (s: HomininSite): number => (s.age.to === undefined ? s.age.from : (s.age.from + s.age.to) / 2);
