---
name: implementar
description: Implementa una spec aprobada de docs/specs/ (o una fase de docs/ROADMAP.md) con TDD, verificación y revisión. Usar cuando se pida implementar, construir o ejecutar una spec o una fase.
argument-hint: '<docs/specs/NNN-slug.md | "Fase N">'
---

# Implementar una spec

Entrada: `$ARGUMENTS`

## 0. Precondiciones

- La spec existe y su estado es `Aprobada`. Si está en `Borrador` o no existe,
  frená y sugerí `/spec`.
- `git status` limpio o con cambios que el usuario conoce. No mezcles trabajo
  ajeno en la misma tarea.

## 1. Plan

Antes de editar, armá una lista de tareas (TodoWrite) que siga este orden:

1. Tipos y lógica pura en `src/lib/<modulo>/` (ver `.claude/rules/logica-pura.md`).
2. Tests unitarios de cada criterio de aceptación de lógica.
3. Isla o componente Astro (ver `.claude/rules/islas-react.md`).
4. Textos en `src/i18n/es.ts` y `src/i18n/en.ts`; páginas ES y EN.
5. Tests e2e y axe (ver `.claude/rules/tests-e2e.md`).
6. Documentación: README del módulo, `docs/ARQUITECTURA.md` si cambia la
   estructura, imágenes OG (`npm run og`) y CV (`npm run cv`) si cambió texto
   que aparece ahí.

## 2. Ciclo por criterio de aceptación

Para cada criterio de la spec:

1. Escribí el test y comprobá que **falla** (`npx vitest run <ruta>`).
2. Implementá lo mínimo para que pase.
3. Refactorizá con el test en verde.

No avances con tests rojos. Si un criterio resulta imposible o ambiguo,
frená y preguntá; no cambies la spec por tu cuenta.

## 3. Verificación y revisión

1. Ejecutá `/verificar` (incluye e2e porque toca páginas).
2. Pedí revisión en paralelo a los agentes `revisor-codigo` (sobre el diff) y,
   si hubo texto visible, `revisor-contenido`. Corregí lo bloqueante.
3. Marcá en la spec cada criterio cumplido y cambiá el estado a
   `Implementada`. Marcá los checkboxes de `docs/ROADMAP.md`.

## 4. Cierre

Informá: qué se hizo, resultado de `/verificar`, desvíos respecto de la spec
y pendientes. Proponé el commit con `/commit` (no commitees sin que lo pidan).
