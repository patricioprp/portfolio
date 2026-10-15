# Decisiones de arquitectura (ADR)

Un ADR (_Architecture Decision Record_) registra **una** decisión técnica
con alternativas reales: el contexto, qué se eligió, qué se descartó y qué
consecuencias tiene. Sirve para que, meses después, nadie (ni Claude) vuelva
a discutir lo mismo sin conocer el motivo.

Los ADR no se editan para cambiar de opinión: se escribe uno nuevo que
**reemplaza** al anterior y se marca el viejo como `Reemplazado por NNNN`.

| ADR                                                | Decisión                                          | Estado   |
| -------------------------------------------------- | ------------------------------------------------- | -------- |
| [0001](0001-astro-con-islas-react.md)              | Astro estático con islas React                    | Aceptado |
| [0002](0002-menu-y-tema-sin-react.md)              | Menú móvil y tema con scripts de Astro, sin React | Aceptado |
| [0003](0003-highs-en-web-worker.md)                | HiGHS (WebAssembly) en un Web Worker              | Aceptado |
| [0004](0004-mapa-en-svg.md)                        | Mapa de beneficios dibujado en SVG                | Aceptado |
| [0005](0005-desarrollo-guiado-por-specs-con-ia.md) | Desarrollo guiado por specs con Claude Code       | Aceptado |

## Plantilla

```markdown
# NNNN · Título en forma de decisión

- **Estado:** Propuesto | Aceptado | Reemplazado por NNNN
- **Fecha:** AAAA-MM

## Contexto

Qué problema o restricción obliga a decidir.

## Decisión

Qué se elige, en una o dos oraciones.

## Alternativas consideradas

- Opción A: por qué no.

## Consecuencias

- Positivas y negativas; qué queda más fácil y qué más difícil.
```
