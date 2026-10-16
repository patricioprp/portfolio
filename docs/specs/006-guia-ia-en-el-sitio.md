# 006 · Guía "Hacé tu portfolio con IA — Claude Code" en el sitio

- **Estado:** Implementada
- **Roadmap:** Fase 9
- **Relacionado:** `docs/guia-ia/`, [ADR 0005](../adr/0005-desarrollo-guiado-por-specs-con-ia.md),
  [ADR 0006](../adr/0006-diagramas-mermaid-pre-renderizados.md)

## Problema

La forma de trabajar con IA del proyecto es un diferencial, pero solo se ve
entrando al repositorio. Además, a quien le guste el portfolio no tiene un
camino para armar el suyo.

## Objetivo

Que cualquier visitante pueda, desde el portfolio, seguir una guía que le
explique **desde cero** cómo construir un portfolio como este con Claude
Code: el marco teórico (para entender) y el paso a paso (para hacerlo).

## Decisiones

- **Nombre:** "Hacé tu portfolio con IA — Claude Code". Ruta `/guia/`.
- **Idioma:** solo español. En el sitio en inglés el acceso existe y aclara
  que la guía está en español.
- **Acceso:** ítem "Guía IA" en el menú (escritorio y móvil, ES y EN) y un
  bloque en la home, después de las demos.
- **Fuente única:** las páginas se generan desde `docs/guia-ia/*.md`; el texto
  no se copia a ningún otro lado. La guía se escribe para cualquier lector y
  usa este portfolio como ejemplo.

## Alcance

- Reorganizar `docs/guia-ia/` en tres partes:
  - **Fundamentos** (teoría): del chat al agente, primeros pasos, contexto
    persistente, permisos y hooks, skills y subagentes, specs y fuente de verdad.
  - **Paso a paso** (tutorial): entorno, producto y contenido, proyecto base y
    calidad, Claude Code en el repo, el sitio con specs, casos y demos,
    publicar y mantener.
  - **Referencia:** flujos del día a día, buenas prácticas, glosario.
- Colección `guia` y páginas `/guia/` (índice por partes) y `/guia/<slug>/`
  (capítulo con navegación anterior/siguiente).
- Diagramas Mermaid como SVG pre-renderizados en versión clara y oscura
  (`npm run diagramas`), con texto alternativo obligatorio (`accTitle`).
- Enlaces entre capítulos reescritos a rutas del sitio; enlaces a archivos del
  repo, a GitHub.
- Imágenes OG del índice y de cada capítulo.

### Fuera de alcance

- Traducción al inglés.
- Buscador, comentarios o progreso de lectura.
- Licencia del código del repositorio (decisión de Patricio, aparte).

## Diseño

- **Lógica (`src/lib/guia/guia.ts`, TS puro con tests):** número y slug a
  partir del nombre de archivo, título (primer `#`), resumen (primer párrafo,
  en texto plano), reescritura de enlaces, hash y título accesible de cada
  diagrama.
- **Markdown (`src/lib/guia/remark-guia.ts`):** plugin de remark que, solo en
  archivos de `docs/guia-ia/`, reemplaza cada bloque `mermaid` por una figura
  con los dos SVG y reescribe enlaces. Si falta el SVG de un diagrama, el
  build falla con el mensaje "corré npm run diagramas".
- **Datos (`src/data/guia.ts`):** capítulos ordenados, partes y rutas.
- **UI:** `src/components/guia/` (índice y capítulo) sobre `BaseLayout`;
  bloque `src/components/home/GuiaIA.astro`; ítem nuevo en `Header.astro`.
- **i18n:** textos de la UI en `es.ts` y `en.ts`. Las páginas de la guía no
  tienen versión en inglés: no declaran `hreflang` en inglés y el selector de
  idioma lleva a la home en inglés.
- **Rendimiento:** sin JavaScript nuevo; los SVG se cargan con `loading="lazy"`
  y con `width`/`height` para no mover el layout.

## Criterios de aceptación

| #   | Criterio                                                                                                | Test                                |
| --- | ------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| 1   | Número, slug, título y resumen se derivan del archivo del capítulo                                      | `src/lib/guia/guia.test.ts`         |
| 2   | Los enlaces a otro capítulo van a `/guia/<slug>/`, al README a `/guia/`, y a archivos del repo a GitHub | `src/lib/guia/guia.test.ts`         |
| 3   | Un diagrama sin `accTitle` o sin SVG generado hace fallar el build                                      | `src/lib/guia/guia.test.ts` + build |
| 4   | El menú (ES y EN, escritorio y móvil) y el bloque de la home llevan a `/guia/`                          | `e2e/guia.spec.ts`                  |
| 5   | El índice muestra las tres partes y todos los capítulos en orden                                        | `e2e/guia.spec.ts`                  |
| 6   | Un capítulo muestra sus diagramas con texto alternativo y navega al siguiente                           | `e2e/guia.spec.ts`                  |
| 7   | Índice y capítulo pasan axe (WCAG 2.2 AA) en tema claro y oscuro                                        | `e2e/accesibilidad.spec.ts`         |
| 8   | La home no suma JavaScript                                                                              | build                               |
| 9   | Ningún término de `docs/privado/terminos-sensibles.txt` aparece en la guía                              | hook + `/verificar`                 |
