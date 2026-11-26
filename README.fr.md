# Atlas du Temps profond

[English](README.md) · [Español](README.es.md) · [Français](README.fr.md)

[![CI](https://github.com/amurlaniakea/deeptime-atlas/actions/workflows/ci.yml/badge.svg)](https://github.com/amurlaniakea/deeptime-atlas/actions/workflows/ci.yml)
[![Licence : AGPL-3.0-or-later](https://img.shields.io/badge/licence-AGPL--3.0--or--later-blue.svg)](LICENSE)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.24430370.svg)](https://doi.org/10.5281/zenodo.24430370)

Atlas interactif et documenté de l'histoire du cosmos et de la Terre, conçu pour les cours universitaires.
Disponible en **espagnol, anglais et français**.

**Démo en ligne :** https://amurlaniakea.github.io/deeptime-atlas/

## Trois échelles, une seule histoire

| Partie | Contenu | État |
|---|---|---|
| Histoire cosmique | Du Big Bang au Système solaire et à la Terre | **disponible (v0.4)** |
| Temps géologique | Éons, ères, périodes et époques ; extinctions de masse ; glaciations | **disponible** : colonne, cinq grandes extinctions, glaciations et courbe climatique du Cénozoïque |
| Holocène et humanité | Zoom sur l'époque actuelle, ses trois âges, des jalons de l'histoire humaine et le débat sur l'Anthropocène | **disponible (v0.5)** ; origines humaines (sites d'hominines) **disponible (v0.6)** |

## Ce que fait l'atlas (v0.6)

- Une colonne stratigraphique **à l'échelle** : cliquez sur une couche pour passer de l'éon à l'ère, la période, l'époque et l'âge.
- Pour chaque unité : âges de début et de fin avec l'incertitude publiée, durée, part de l'histoire de la Terre
  et une « horloge de 24 heures » (si l'histoire de la Terre tenait en un jour, à quelle heure l'unité commencerait-elle ?).
- Tout le Cénozoïque jusqu'à l'étage, avec la **définition de la base** (marqueur GSSP, coupe de référence,
  ratification) de neuf limites clés, dont la limite Crétacé-Paléogène et le début de l'Holocène.
- **Extinctions de masse et glaciations** dessinées sur la colonne (losanges et barres) et listées avec leur âge, leur incertitude,
  leur statut scientifique (largement admis ou en partie débattu) et les articles dont elles proviennent : les cinq grandes
  extinctions, le Dryas récent, les glaciations huronienne, sturtienne et marinoenne et la glaciation du Paléozoïque supérieur.
- **Origines humaines** : une carte interactive de 12 sites clés d'hominines (Toumaï, Ardi, Lucy, Ledi-Geraru, Dmanissi, trois sites d'
  **Atapuerca**, Jebel Irhoud, Homo naledi, Omo Kibish et Liang Bua) avec l'âge de chaque découverte, l'espèce donnée par la source et les
  articles qui l'étayent, ainsi qu'un graphique des âges (linéaire ou logarithmique).
- **L'Holocène et l'humanité** : ses trois âges (Groenlandien, Norgrippien, Meghalayen) avec les événements climatiques qui les définissent,
  des jalons comme Göbekli Tepe et la première écriture, la Grande Accélération, et une explication de pourquoi l'Anthropocène
  **n'est pas** une unité géologique formelle (communiqué de l'IUGS et de l'ICS du 20 mars 2024) alors que le débat scientifique se poursuit.
- **Histoire cosmique** du Big Bang à la Terre, sur une échelle de temps logarithmique et sur le **calendrier cosmique** (l'âge de
  l'Univers en une année) : temps de Planck, nucléosynthèse, égalité matière-rayonnement, fond diffus cosmologique, la galaxie
  confirmée la plus lointaine, réionisation, la Voie lactée, le Système solaire et la Lune, avec des liens vers la section géologique.
- Une **courbe climatique du Cénozoïque** : l'enregistrement du δ¹⁸O benthique des 66 derniers millions d'années (CENOGRID, Westerhold et al. 2020),
  avec les quatre états climatiques (Hothouse, Warmhouse, Coolhouse, Icehouse), les transitions clés et une lecture au survol.
- Un outil de **comparaison** : deux unités à la même échelle, avec le rapport de leurs durées.
- Liens partageables vers n'importe quelle unité (`#phanerozoic`) et vers une langue (`?lang=fr`).
- Liste des couches accessible au clavier, contraste de texte adapté, mode sombre et respect de « réduire les animations ».
- Aucune requête réseau à l'exécution et une Content-Security-Policy stricte.

## Données et vérification

Les âges proviennent de la **charte chronostratigraphique internationale de l'ICS, v2024/12**
(https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf ; Cohen et al. 2025,
[doi:10.18814/epiiugs/2025/025001](https://doi.org/10.18814/epiiugs/2025/025001)).
Chaque entrée du jeu de données liste ses sources et des tests automatiques l'exigent. La politique et le
journal de vérification se trouvent dans [`docs/DATA_POLICY.md`](docs/DATA_POLICY.md).

## Développement

La série climatique est générée à partir du fichier public de PANGAEA (CC BY 4.0), qui n'est pas stocké dans le dépôt :

```bash
mkdir -p data-raw && curl -L -o data-raw/cenogrid_S34.tab "https://doi.pangaea.de/10.1594/PANGAEA.917717?format=textfile"
npm run build:data   # écrit src/data/cenogrid.json
```

```bash
npm ci
npm run dev
npm run typecheck
npm test
npm run build
```

Pile : Vite, TypeScript (strict), Vitest. Aucune dépendance à l'exécution.

## Feuille de route

| Version | Contenu |
|---|---|
| v0.1 | Squelette, i18n, schéma de données sourcées, CI, démo en ligne, colonne géologique |
| v0.2 | Cénozoïque jusqu'à l'étage, définitions GSSP des limites, outil de comparaison |
| v0.3 | Extinctions de masse et glaciations avec sources |
| v0.3.1 | Courbe climatique du Cénozoïque (CENOGRID) et glaciations du Cénozoïque |
| v0.4 | Histoire cosmique (échelle logarithmique et calendrier cosmique) avec événements sourcés |
| v0.5 | Holocène et humanité : âges, événements climatiques, jalons humains, débat sur l'Anthropocène |
| v0.6 | Origines humaines : carte des sites d'hominines (Atapuerca et autres) avec âges sourcés |
| v0.7 | Mode classe : guide pédagogique et quiz |
| v1.0 | Audit complet des sources et DOI Zenodo |

## Crédits des données

- Échelle des temps géologiques : charte chronostratigraphique internationale de l'ICS, v2024/12.
- Série de δ¹⁸O benthique : CENOGRID, Westerhold et al. (2020), PANGAEA, CC BY 4.0 (valeurs sélectionnées, non modifiées).
- Contour des terres de la carte des hominines : Natural Earth (domaine public), simplifié.
- Tous les autres chiffres sont cités à côté de chaque entrée de l'atlas et dans `src/data/sources.ts`.

## Comment citer

Voir [`CITATION.cff`](CITATION.cff). Pour citer toutes les versions, utilisez le DOI de concept Zenodo [10.5281/zenodo.24430370](https://doi.org/10.5281/zenodo.24430370).

## Licence

AGPL-3.0-or-later. Voir [`LICENSE`](LICENSE).

© 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
