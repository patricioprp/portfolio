---
paths:
  - 'src/content/**'
  - 'src/i18n/**'
  - 'src/data/**'
  - 'docs/contenido/**'
  - 'docs/casos/**'
---

# Reglas para el texto del sitio

- La fuente de verdad es `docs/contenido/` y `docs/casos/`. Si un dato no está
  ahí, no se inventa: se marca `TODO(contenido)` y se le pregunta a Patricio.
- Toda clave nueva va en `src/i18n/es.ts` **y** en `src/i18n/en.ts` (el tipo
  `Diccionario` hace fallar `npm run check` si falta una).
- Un caso nuevo o modificado existe en `src/content/casos/es/` y `.../en/`
  con las mismas cifras y secciones.
- Métricas: `real` o `ilustrativa`. Las ilustrativas solo junto a su demo.
- Clientes siempre anónimos. Nada de `docs/privado/`.
- Tono: primera persona, concreto, sin adjetivos vacíos ("apasionado",
  "proactivo"). Distinguir lo individual de lo del equipo.
- Al terminar, pedí la revisión del agente `revisor-contenido`.
