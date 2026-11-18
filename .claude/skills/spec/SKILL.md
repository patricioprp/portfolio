---
name: spec
description: Escribe la especificación de una funcionalidad nueva o de un cambio grande en docs/specs/ antes de tocar código. Usar cuando se pida una demo, página, sección o comportamiento nuevo, o cuando un pedido sea ambiguo y convenga acordar el alcance primero.
argument-hint: '<descripción breve de la funcionalidad>'
---

# Escribir una spec

Pedido: `$ARGUMENTS`

En este paso **no se escribe código**. El resultado es un documento que
Patricio aprueba antes de implementar.

## 1. Entender

- Leé `docs/PRODUCTO.md` (para quién es y qué objetivo cumple) y
  `docs/ARQUITECTURA.md`.
- Si el pedido toca más de un área, explorá **en paralelo**: lanzá en un
  mismo mensaje hasta 3 agentes `Explore` (solo lectura) y pedile a cada uno
  un resumen, no los archivos completos. Por ejemplo: (a) specs de
  `docs/specs/` y ADR de `docs/adr/` relacionados, con las decisiones que no
  hay que contradecir; (b) código que ya existe y se puede reutilizar
  (layouts, helpers de `src/data/`, `DemoLayout`, `Figura`); (c) tests y
  e2e que habría que tocar. Si el pedido es chico, leé vos los archivos. El
  patrón está en `docs/adr/0007-orquestacion-de-agentes.md`.
- Si falta información que solo Patricio sabe (datos, prioridades, alcance),
  hacé **todas las preguntas juntas** al principio, con una opción recomendada.

## 2. Escribir

Copiá `docs/specs/_plantilla.md` a `docs/specs/NNN-<slug>.md` (siguiente número
libre) y completá todas las secciones. Reglas:

- Criterios de aceptación **verificables**: cada uno se convierte en un test
  unitario o e2e. Escribilos como "Dado / Cuando / Entonces" o como reglas
  concretas con números.
- "Fuera de alcance" es obligatorio: evita que la implementación crezca sola.
- Si aparece una decisión técnica con alternativas reales, proponé un ADR en
  `docs/adr/` (plantilla en `docs/adr/README.md`).
- Datos y textos: solo de `docs/contenido/` y `docs/casos/`; lo que falte va
  como `TODO(contenido)`.

## 3. Cerrar

- Estado de la spec: `Borrador`.
- Agregá la fase o tarea en `docs/ROADMAP.md` con un enlace a la spec.
- Resumí en 5 líneas qué se va a construir y qué queda afuera, y pedí
  aprobación. Cuando Patricio apruebe, cambiá el estado a `Aprobada`; la
  implementación se hace con `/implementar <ruta de la spec>`.
