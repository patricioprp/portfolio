# Specs

Una spec describe **qué** se construye y **cómo se sabe que está terminado**,
antes de escribir código. Es el contrato entre Patricio (que decide) y Claude
Code (que implementa).

## Flujo

```text
/spec <idea>  →  Borrador  →  (Patricio revisa)  →  Aprobada
/implementar docs/specs/NNN-slug.md  →  TDD + /verificar + revisores  →  Implementada
```

- Numeración correlativa (`001`, `002`, …) y slug en kebab-case.
- Plantilla: [`_plantilla.md`](_plantilla.md).
- Cada criterio de aceptación se vuelve un test (unitario en `src/lib/` o e2e
  en `e2e/`). La columna "Test" de la tabla lo enlaza.
- Una spec `Implementada` se actualiza si cambia el comportamiento; no se
  borra. Las decisiones con alternativas van en [`../adr/`](../adr/).

## Índice

| Spec                                                          | Estado       | Qué cubre                                                     |
| ------------------------------------------------------------- | ------------ | ------------------------------------------------------------- |
| [001 · Optimizador de viguetas](001-demo-optimizador.md)      | Implementada | Demo de corte de acero con programación lineal entera         |
| [002 · Formulario dinámico](002-demo-formulario.md)           | Implementada | Planilla en JSON con visibilidad condicional y puntaje        |
| [003 · Simulador de contingencias](003-demo-contingencias.md) | Implementada | Portal ficticio con mantenimiento, trámites apagados y avisos |
| [004 · Mapa de beneficios](004-demo-mapa.md)                  | Implementada | Mapa SVG con clusters, carrusel, listado y canje              |
| [005 · Experiencia laboral](005-experiencia.md)               | Implementada | Modelo de datos de la línea de tiempo y alta de experiencias  |
| [006 · Guía de IA en el sitio](006-guia-ia-en-el-sitio.md)    | Implementada | La guía "Hacé tu portfolio con IA" en /guia/                  |

Las specs 001 a 004 documentan demos que se planificaron en
`docs/ARQUITECTURA.md` y `docs/ROADMAP.md`; acá quedan con el formato común
para que el comportamiento esperado esté en un solo lugar.
