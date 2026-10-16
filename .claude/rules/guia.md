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
- Cada diagrama en un bloque `mermaid` con `accTitle:` (texto alternativo).
  Después de crear o cambiar uno: `npm run diagramas` y versioná los SVG de
  `public/guia/diagramas/`. Si falta, el build falla.
- Enlaces relativos: a capítulos (`07-preparar-el-entorno.md`) o a archivos del
  repo (`../../CLAUDE.md`); el sitio los convierte en rutas o en GitHub.
- El párrafo final "Anterior: … · Siguiente: …" se mantiene para GitHub; el
  sitio lo oculta.
- Capítulo nuevo: ubicalo en su parte en `PARTES` (`src/data/guia.ts`) y en las
  tablas de `docs/guia-ia/README.md`; corré `npm run og`.
- Escrita para cualquier lector: "vos" es quien arma su portfolio. Este
  portfolio es el ejemplo ("este repo"), nunca la fuente de datos personales.
- Nada de `docs/privado/`, nombres de clientes ni datos de contacto ajenos.
