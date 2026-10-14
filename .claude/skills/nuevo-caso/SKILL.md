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

## 5. Cierre

Ejecutá `/verificar` y pedí una revisión del texto al agente `revisor-contenido`.
