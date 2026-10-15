# 005 · Experiencia laboral

- **Estado:** Implementada (el alta de experiencias se hace con `/nueva-experiencia`)
- **Roadmap:** Fases 2 y 6
- **Relacionado:** `docs/contenido/experiencia.md`,
  `docs/contenido/_plantilla-experiencia.md`, skill `.claude/skills/nueva-experiencia/`

## Problema

La experiencia aparece en tres lugares (línea de tiempo de la home en ES y EN
y CV en PDF) y alimenta el stack. Si cada alta se hace a mano, alguno queda
desactualizado.

## Objetivo

Agregar o actualizar una experiencia cambiando **un dato en un solo lugar**
(`src/content/experiencia.json`, derivado de `docs/contenido/experiencia.md`),
y que la home, la versión en inglés y el CV salgan de ahí.

## Contrato de datos

Una entrada de `src/content/experiencia.json` (validada por zod en
`src/content.config.ts`; si no cumple, `npm run build` falla):

| Campo       | Tipo                             | Regla                                                  |
| ----------- | -------------------------------- | ------------------------------------------------------ |
| `id`        | string                           | kebab-case, único (nombre de la empresa)               |
| `empresa`   | `{ es, en }`                     | nombre publicable; clientes de consultoras, anónimos   |
| `ubicacion` | `{ es, en }` opcional            | "Ciudad · Remoto"                                      |
| `rol`       | `{ es, en }`                     | como figura en el contrato o LinkedIn                  |
| `desde`     | `AAAA` o `AAAA-MM`               |                                                        |
| `hasta`     | `AAAA`, `AAAA-MM` o `null`       | `null` = actualidad; como máximo una entrada en `null` |
| `nota`      | `{ es, en }` opcional            | aclaraciones de período o modalidad                    |
| `logros`    | `{ es: string[], en: string[] }` | misma cantidad y orden en ambos idiomas                |
| `stack`     | string[]                         | tecnologías usadas en ese trabajo                      |
| `caso`      | string opcional                  | slug existente en `src/content/casos/`                 |

El orden en pantalla no depende del archivo: lo calcula
`compararPorFechaDesc` (`src/lib/periodo.ts`), vigentes primero.

## Criterios de aceptación

| #   | Criterio                                                                      | Test                              |
| --- | ----------------------------------------------------------------------------- | --------------------------------- |
| 1   | Los períodos se muestran con mes y año, solo año, o "actualidad"              | `src/lib/periodo.test.ts`         |
| 2   | Las experiencias se ordenan con la vigente primero y luego por fecha de fin   | `src/lib/periodo.test.ts`         |
| 3   | La home muestra el puesto actual primero                                      | `e2e/home.spec.ts`                |
| 4   | Una entrada con fechas mal formadas rompe el build                            | esquema zod (`npm run build`)     |
| 5   | El CV en PDF se descarga en cada idioma con la misma experiencia que el sitio | `e2e/home.spec.ts` + `npm run cv` |
| 6   | Una experiencia con `caso` enlaza a la página del caso                        | `e2e/home.spec.ts`                |

## Cómo agregar una experiencia

1. `/nueva-experiencia` (entrevista) o completar
   `docs/contenido/_plantilla-experiencia.md` y pasarle la ruta.
2. Claude actualiza `docs/contenido/experiencia.md`, `src/content/experiencia.json`,
   el stack y los textos del rol si cambió el puesto actual.
3. `npm run cv`, `/verificar`, revisión de `revisor-contenido` y `/commit`.
