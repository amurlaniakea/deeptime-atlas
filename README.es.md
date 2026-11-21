# Atlas del Tiempo Profundo

[English](README.md) · [Español](README.es.md) · [Français](README.fr.md)

[![CI](https://github.com/amurlaniakea/deeptime-atlas/actions/workflows/ci.yml/badge.svg)](https://github.com/amurlaniakea/deeptime-atlas/actions/workflows/ci.yml)
[![Licencia: AGPL-3.0-or-later](https://img.shields.io/badge/licencia-AGPL--3.0--or--later-blue.svg)](LICENSE)

Atlas interactivo y documentado de la historia del cosmos y de la Tierra, pensado para el aula universitaria.
Disponible en **español, inglés y francés**.

**Demo en vivo:** https://amurlaniakea.github.io/deeptime-atlas/

## Tres escalas, una sola historia

| Parte | Contenido | Estado |
|---|---|---|
| Historia cósmica | Del Big Bang al Sistema Solar y la Tierra | prevista en la v0.4 |
| Tiempo geológico | Eones, eras, periodos y épocas; extinciones masivas; glaciaciones | **v0.1 disponible (estructura)**, curvas y eventos en la v0.3 |
| Holoceno y humanidad | Zoom a la época actual, el registro de homínidos del Pleistoceno y las eras de la civilización | prevista en la v0.5 |

## Qué hace la v0.1

- Una columna estratigráfica **a escala**: pulsa una capa para pasar de eón a era, periodo, época y edad.
- Para cada unidad: edades de inicio y fin con la incertidumbre publicada, duración, parte de la historia
  de la Tierra y un «reloj de 24 horas» (si la historia de la Tierra fuera un día, ¿a qué hora empieza la unidad?).
- Enlaces compartibles a cualquier unidad (`#phanerozoic`) y a un idioma (`?lang=es`).
- Lista de capas accesible con teclado, contraste de texto adecuado, modo oscuro y respeto a «reducir movimiento».
- Sin peticiones de red en ejecución y con una Content-Security-Policy estricta.

## Datos y verificación

Las edades proceden de la **Carta Cronoestratigráfica Internacional de la ICS, v2024/12**
(https://stratigraphy.org/ICSchart/ChronostratChart2024-12.pdf; Cohen et al. 2025,
[doi:10.18814/epiiugs/2025/025001](https://doi.org/10.18814/epiiugs/2025/025001)).
Cada entrada del conjunto de datos lista sus fuentes y unos tests automáticos lo exigen. La política y el
registro de verificación están en [`docs/DATA_POLICY.md`](docs/DATA_POLICY.md).

## Desarrollo

```bash
npm ci
npm run dev
npm run typecheck
npm test
npm run build
```

Pila: Vite, TypeScript (estricto), Vitest. Sin dependencias en tiempo de ejecución.

## Hoja de ruta

| Versión | Contenido |
|---|---|
| v0.1 | Esqueleto, i18n, esquema de datos con fuentes, CI, Live Demo, columna geológica |
| v0.2 | Refinamiento de la línea de tiempo geológica y más edades |
| v0.3 | Curvas climáticas, extinciones masivas, glaciaciones, hitos |
| v0.4 | Historia cósmica (escala logarítmica y calendario cósmico) |
| v0.5 | Holoceno y humanidad (yacimientos del Pleistoceno, Atapuerca, Göbekli Tepe, civilizaciones) |
| v0.6 | Modo aula: guía docente y cuestionarios |
| v1.0 | Auditoría completa de fuentes y DOI de Zenodo |

## Cómo citar

Consulta [`CITATION.cff`](CITATION.cff). El DOI de Zenodo se añadirá con la primera versión archivada.

## Licencia

AGPL-3.0-or-later. Consulta [`LICENSE`](LICENSE).

© 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
