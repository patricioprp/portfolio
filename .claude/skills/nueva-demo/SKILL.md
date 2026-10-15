---
name: nueva-demo
description: Arma el esqueleto completo de una demo ejecutable nueva (lógica en src/lib, isla React, páginas ES/EN, registro, e2e y OG) siguiendo el patrón de las demos existentes. Usar cuando una spec aprobada pida una demo nueva.
argument-hint: '<slug-de-la-demo>'
---

# Nueva demo

Slug: `$ARGUMENTS` (kebab-case, igual en ES y EN).

Requiere una spec aprobada en `docs/specs/`. Si no existe, corré `/spec` primero.

## Archivos (copiá el patrón de la demo más parecida)

| Pieza               | Ruta                                                                  | Referencia                       |
| ------------------- | --------------------------------------------------------------------- | -------------------------------- |
| Lógica pura + tests | `src/lib/<modulo>/*.ts`, `*.test.ts`, `README.md`                     | `src/lib/contingencias/`         |
| Isla React          | `src/islands/<modulo>/`                                               | `src/islands/contingencias/`     |
| Página compartida   | `src/components/demo/Demo<Nombre>Page.astro` sobre `DemoLayout.astro` | `DemoContingenciasPage.astro`    |
| Rutas ES / EN       | `src/pages/demos/<slug>.astro`, `src/pages/en/demos/<slug>.astro`     | `contingencias.astro`            |
| Registro            | agregar el slug a `DISPONIBLES` en `src/data/demos.ts`                |                                  |
| Textos              | `src/i18n/es.ts` y `src/i18n/en.ts`                                   |                                  |
| Tarjeta en la home  | `src/components/home/Demos.astro`                                     |                                  |
| e2e                 | `e2e/demo-<slug>.spec.ts` + ruta en `e2e/accesibilidad.spec.ts`       | `e2e/demo-contingencias.spec.ts` |
| Imagen OG           | `npm run og`                                                          |                                  |

## Reglas

- La lógica no conoce la UI: se prueba en Node.
- Datos de ejemplo ficticios y anónimos; si una cifra aparece en un caso, es
  `ilustrativa` y solo se muestra junto a la demo.
- CSP: si la demo necesita algo nuevo (WASM, workers, otro origen), actualizá
  `netlify.toml` y documentalo en un ADR.
- Presupuesto: el JS pesado se carga solo en la página de la demo.

Al terminar, seguí con los pasos 3 y 4 de `/implementar`.
