# Atlas del Tiempo Profundo

[English](README.md) · [Español](README.es.md) · [Français](README.fr.md)

[![CI](https://github.com/amurlaniakea/deeptime-atlas/actions/workflows/ci.yml/badge.svg)](https://github.com/amurlaniakea/deeptime-atlas/actions/workflows/ci.yml)
[![Licencia: AGPL-3.0-or-later](https://img.shields.io/badge/licencia-AGPL--3.0--or--later-blue.svg)](LICENSE)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.24430370.svg)](https://doi.org/10.5281/zenodo.24430370)

Atlas interactivo y documentado de la historia del cosmos y de la Tierra, pensado para el aula universitaria.
Disponible en **español, inglés y francés**.

**Demo en vivo:** https://amurlaniakea.github.io/deeptime-atlas/

## Tres escalas, una sola historia

| Parte | Contenido | Estado |
|---|---|---|
| Historia cósmica | Del Big Bang al Sistema Solar y la Tierra | **disponible (v0.4)** |
| Tiempo geológico | Eones, eras, periodos y épocas; extinciones masivas; glaciaciones | **disponible**: columna, cinco grandes extinciones, glaciaciones y la curva climática del Cenozoico |
| Holoceno y humanidad | Zoom a la época actual, el registro de homínidos del Pleistoceno y las eras de la civilización | prevista en la v0.5 |

## Qué hace (v0.4)

- Una columna estratigráfica **a escala**: pulsa una capa para pasar de eón a era, periodo, época y edad.
- Para cada unidad: edades de inicio y fin con la incertidumbre publicada, duración, parte de la historia
  de la Tierra y un «reloj de 24 horas» (si la historia de la Tierra fuera un día, ¿a qué hora empieza la unidad?).
- Todo el Cenozoico hasta el nivel de piso, con la **definición de la base** (marcador GSSP, sección de referencia,
  ratificación) de nueve límites clave, incluido el límite Cretácico-Paleógeno y el inicio del Holoceno.
- **Extinciones masivas y glaciaciones** dibujadas sobre la columna (rombos y barras) y listadas con su edad, incertidumbre,
  estado científico (ampliamente aceptado o en parte debatido) y los artículos de los que proceden: las cinco grandes
  extinciones, el Dryas Reciente, las glaciaciones huroniana, Sturtiense y Marinoense y la glaciación del Paleozoico tardío.
- **Historia cósmica** del Big Bang a la Tierra, en escala de tiempo logarítmica y en el **calendario cósmico** (la edad del
  universo como un año): tiempo de Planck, nucleosíntesis, igualdad materia-radiación, fondo cósmico de microondas, la galaxia
  confirmada más lejana, reionización, la Vía Láctea, el Sistema Solar y la Luna, con enlaces a la sección geológica.
- Una **curva climática del Cenozoico**: el registro de δ¹⁸O bentónico de los últimos 66 millones de años (CENOGRID, Westerhold et al. 2020),
  con los cuatro estados climáticos (Hothouse, Warmhouse, Coolhouse, Icehouse), las transiciones clave y lectura al pasar el cursor.
- Una herramienta para **comparar** dos unidades a la misma escala, con la proporción entre sus duraciones.
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

La serie climática se genera a partir del archivo público de PANGAEA (CC BY 4.0), que no se guarda en el repositorio:

```bash
mkdir -p data-raw && curl -L -o data-raw/cenogrid_S34.tab "https://doi.pangaea.de/10.1594/PANGAEA.917717?format=textfile"
npm run build:data   # escribe src/data/cenogrid.json
```

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
| v0.2 | Cenozoico hasta piso, definiciones GSSP de límites, herramienta de comparación |
| v0.3 | Extinciones masivas y glaciaciones con fuentes |
| v0.3.1 | Curva climática del Cenozoico (CENOGRID) y las glaciaciones del Cenozoico |
| v0.4 | Historia cósmica (escala logarítmica y calendario cósmico) con eventos documentados |
| v0.5 | Holoceno y humanidad (yacimientos del Pleistoceno, Atapuerca, Göbekli Tepe, civilizaciones) |
| v0.6 | Modo aula: guía docente y cuestionarios |
| v1.0 | Auditoría completa de fuentes y DOI de Zenodo |

## Cómo citar

Consulta [`CITATION.cff`](CITATION.cff). Para citar todas las versiones, usa el DOI de concepto de Zenodo [10.5281/zenodo.24430370](https://doi.org/10.5281/zenodo.24430370).

## Licencia

AGPL-3.0-or-later. Consulta [`LICENSE`](LICENSE).

© 2026 Pedro Sordo Martínez <amurlaniakea@gmail.com>
