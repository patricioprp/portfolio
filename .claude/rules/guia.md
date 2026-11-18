---
paths:
  - 'docs/guia-ia/**'
  - 'src/lib/guia/**'
  - 'src/data/guia.ts'
  - 'src/components/guia/**'
---

# Reglas para la guía "Hacé tu portfolio con IA"

La guía es pública: se lee en GitHub y en `/guia/`, que se genera desde
`docs/guia-ia/` (spec 006). Una sola fuente: el texto no se copia a otro lado.

- Un archivo por capítulo: `NN-slug.md`. El slug es la URL; si lo cambiás,
  actualizá los enlaces que apuntan a ese archivo.
- Un solo `#` por archivo, con el formato `N · Título`; el primer párrafo es el
  resumen (descripción de la página y de la tarjeta del índice).
- Debajo del resumen va la etiqueta de aplicación (spec 008):
  `> **Aplicación:** En este repo | En parte | Solo teórico — <aclaración>`. Dice si lo que explica el capítulo
  existe en el repo; si falta, el build falla. Si un capítulo aplicado tiene
  una sección que no está en el repo, esa sección empieza con una de estas
  citas (`MARCAS_TEORICAS` en `src/lib/guia/guia.ts`), que el sitio muestra
  como un recuadro:
  - `> **Para la certificación.** …` para un tema de la certificación;
  - `> **No se usa en este repo.** …` para una función que se explica pero
    no se usa.

  El build rechaza una marca mal escrita (por ejemplo, con el punto afuera de
  las negritas), y el e2e comprueba que cada una se vea como recuadro.

- Orden por tema: un capítulo nuevo va donde se aprende de forma natural, no al
  final. Renumerar no rompe URL (el slug no lleva el número); revisá también
  los números sueltos en diagramas y frases como "(9 y 10)".
- Cada diagrama en un bloque `mermaid` con `accTitle:` (texto alternativo).
  Después de crear o cambiar uno: `npm run diagramas` y versioná los SVG de
  `public/guia/diagramas/`. Si falta, el build falla.
- Enlaces relativos: a capítulos (`09-preparar-el-entorno.md`) o a archivos del
  repo (`../../CLAUDE.md`); el sitio los convierte en rutas o en GitHub.
- El párrafo final "Anterior: … · Siguiente: …" se mantiene para GitHub; el
  sitio lo oculta.
- Capítulo nuevo: ubicalo en su parte en `PARTES` (`src/data/guia.ts`) y en las
  tablas de `docs/guia-ia/README.md`; corré `npm run og`.
- Escrita para cualquier lector: "vos" es quien arma su portfolio. Este
  portfolio es el ejemplo ("este repo"), nunca la fuente de datos personales.
- Cada función de Claude Code que se nombra enlaza a su página en
  code.claude.com, y se confirma ahí antes de escribirla.
- Nada de `docs/privado/`, nombres de clientes ni datos de contacto ajenos.
