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
| Histoire cosmique | Du Big Bang au Système solaire et à la Terre | prévue en v0.4 |
| Temps géologique | Éons, ères, périodes et époques ; extinctions de masse ; glaciations | **disponible (v0.2)** : colonne jusqu'à l'étage pour le Cénozoïque ; courbes et événements en v0.3 |
| Holocène et humanité | Zoom sur l'époque actuelle, les homininés du Pléistocène et les ères de la civilisation | prévue en v0.5 |

## Ce que fait l'atlas (v0.2)

- Une colonne stratigraphique **à l'échelle** : cliquez sur une couche pour passer de l'éon à l'ère, la période, l'époque et l'âge.
- Pour chaque unité : âges de début et de fin avec l'incertitude publiée, durée, part de l'histoire de la Terre
  et une « horloge de 24 heures » (si l'histoire de la Terre tenait en un jour, à quelle heure l'unité commencerait-elle ?).
- Tout le Cénozoïque jusqu'à l'étage, avec la **définition de la base** (marqueur GSSP, coupe de référence,
  ratification) de neuf limites clés, dont la limite Crétacé-Paléogène et le début de l'Holocène.
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
| v0.3 | Courbes climatiques, extinctions de masse, glaciations, jalons |
| v0.4 | Histoire cosmique (échelle logarithmique et calendrier cosmique) |
| v0.5 | Holocène et humanité (sites du Pléistocène, Atapuerca, Göbekli Tepe, civilisations) |
| v0.6 | Mode classe : guide pédagogique et quiz |
| v1.0 | Audit complet des sources et DOI Zenodo |

## Comment citer

Voir [`CITATION.cff`](CITATION.cff). Pour citer toutes les versions, utilisez le DOI de concept Zenodo [10.5281/zenodo.24430370](https://doi.org/10.5281/zenodo.24430370).

## Licence

AGPL-3.0-or-later. Voir [`LICENSE`](LICENSE).

© 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
