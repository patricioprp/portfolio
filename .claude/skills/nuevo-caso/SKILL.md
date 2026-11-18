---
name: nuevo-caso
description: Crea o migra un caso de estudio del portfolio (ES y EN) a partir de un documento en docs/casos/ o de la descripción del usuario. Usar cuando se pida agregar, migrar o reescribir un caso de estudio.
argument-hint: '<slug o ruta en docs/casos/>'
---

# Nuevo caso de estudio

Entrada: `$ARGUMENTS` (slug de `docs/casos/` o descripción libre).

## 1. Fuente

- Si existe `docs/casos/<slug>.md`, es la fuente de verdad. No agregues datos que no estén ahí.
- Si el usuario describe un caso nuevo, primero creá `docs/casos/<slug>.md` con la
  estructura de abajo y pedile que confirme los datos marcados con `TODO(contenido)`.
- Nunca uses material de `docs/privado/`.

## 2. Estructura obligatoria

Frontmatter (validado por el esquema zod de la colección `casos`):

```yaml
titulo: string
resumen: string # una oración, ≤ 160 caracteres (se usa como meta description)
cliente: string # genérico salvo autorización ("empresa de premoldeados")
rol: string
periodo: string
stack: string[]
problema: string
solucion: string
impacto: string
metricas:
  - valor: string # "3 días → 0"
    etiqueta: string
    tipo: real | ilustrativa
demo: string | null # slug en /demos
orden: number
```

Cuerpo MDX: Contexto → El reto técnico → Qué hice → Diagrama → Resultados → Stack.

## 3. Reglas de redacción

- Primera persona, verbos de acción, sin adjetivos vacíos. Ver "Tono" en `docs/PRODUCTO.md`.
- Distinguí lo que hizo Patricio de lo que hizo el equipo ("participé", "desarrollé").
- Métricas `ilustrativa` no van en la tarjeta del home ni en la franja de impacto.
- Diagramas: SVG inline accesible (`role="img"`, `<title>`, `<desc>`), colores de los tokens del tema, legibles en modo claro y oscuro.
- Bloques de código: solo si aportan; ≤ 25 líneas.

## 4. Archivos

- `src/content/casos/es/<slug>.mdx` y `src/content/casos/en/<slug>.mdx`
- Diagramas en `src/components/diagramas/<Slug>*.astro`
- Imagen OG si la Fase 6 ya está implementada

## 5. Orden de trabajo (orquestación en cadena)

1. Escribí vos `src/content/casos/es/<slug>.mdx` y los diagramas (solo los
   textos en español: los componentes de `src/components/diagramas/` tienen
   ES y EN en el mismo archivo). Mostrale a
   Patricio el resumen, las métricas (con su tipo) y lo que atribuís a él y
   al equipo, y esperá su confirmación.
2. Delegá en el agente `traductor` la versión
   `src/content/casos/en/<slug>.mdx` y los textos en inglés de los diagramas
   (`src/components/diagramas/<Slug>*.astro`, solo la parte EN), con un
   encargo autocontenido: archivos ES de origen, archivos EN de destino, un caso EN existente como modelo de
   estructura y tono, qué no se traduce (slug, `tipo`, `demo`, imports) y
   que responda con los archivos tocados y sus dudas.
3. Revisá sus dudas. Las de contenido se las consultás a Patricio.

## 6. Cierre

Ejecutá `/verificar` y pedí una revisión del texto al agente
`revisor-contenido` (ES y EN). Es el verificador de la cadena: controla
exactitud, privacidad y paridad entre las dos versiones. Antes de corregir un
hallazgo, comprobalo en el archivo.
