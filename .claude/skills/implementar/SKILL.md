---
name: implementar
description: Implementa una spec aprobada de docs/specs/ (o una fase de docs/ROADMAP.md) con TDD, verificación y revisión, orquestando subagentes para explorar, delegar tareas independientes y revisar. Usar cuando se pida implementar, construir o ejecutar una spec o una fase.
argument-hint: '<docs/specs/NNN-slug.md | "Fase N">'
---

# Implementar una spec

Entrada: `$ARGUMENTS`

Vos sos el **orquestador**: decidís, planificás, integrás y verificás. Los
subagentes exploran, producen tareas acotadas y revisan. El patrón y sus
motivos están en `docs/adr/0007-orquestacion-de-agentes.md`.

```text
explorar (paralelo) → planificar → ejecutar (delegando lo independiente)
→ /verificar → revisar (paralelo) → consolidar
```

## 0. Precondiciones

- La spec existe y su estado es `Aprobada`. Si está en `Borrador` o no existe,
  frená y sugerí `/spec`.
- `git status` limpio o con cambios que el usuario conoce. No mezcles trabajo
  ajeno en la misma tarea.

## 1. Explorar en paralelo

Lanzá **en un mismo mensaje** hasta 3 agentes `Explore` (solo lectura), uno
por área que toque la spec. Por ejemplo:

- `src/lib/` y sus tests: módulos, tipos y helpers reutilizables.
- Islas, componentes y páginas (`src/islands/`, `src/components/`,
  `src/pages/`) y textos de `src/i18n/`.
- `e2e/` y configuración (Playwright, axe, scripts de `package.json`).

A cada uno pedile un **resumen** (rutas, funciones a reutilizar, patrones a
copiar), no el contenido de los archivos. Si la spec toca una sola área o
ya conocés los archivos, no lances ninguno: leelos vos.

## 2. Plan

Armá una lista de tareas (TodoWrite) que siga este orden:

1. Tipos y lógica pura en `src/lib/<modulo>/` (ver `.claude/rules/logica-pura.md`).
2. Tests unitarios de cada criterio de aceptación de lógica.
3. Isla o componente Astro (ver `.claude/rules/islas-react.md`).
4. Textos en `src/i18n/es.ts` y `src/i18n/en.ts`; páginas ES y EN.
5. Tests e2e y axe (ver `.claude/rules/tests-e2e.md`).
6. Documentación: README del módulo, `docs/ARQUITECTURA.md` si cambia la
   estructura, imágenes OG (`npm run og`) y CV (`npm run cv`) si cambió texto
   que aparece ahí.

Marcá en cada tarea si es **independiente** (no lee ni escribe lo que produce
otra tarea pendiente) o **acoplada**.

## 3. Ejecutar

### Ciclo por criterio de aceptación

Para cada criterio de la spec:

1. Escribí el test y comprobá que **falla** (`npx vitest run <ruta>`).
2. Implementá lo mínimo para que pase.
3. Refactorizá con el test en verde.

No avances con tests rojos. Si un criterio resulta imposible o ambiguo,
frená y preguntá; no cambies la spec por tu cuenta.

### Cuándo delegar

Delegá una tarea en un subagente solo si se cumplen las tres condiciones:

- es **independiente** y su entrada ya está decidida (por ejemplo, el texto
  en español confirmado → `traductor` escribe el inglés);
- toca **archivos distintos** de los que estás editando vos;
- explicarla en un encargo cuesta menos que hacerla.

Si dos subagentes editan a la vez, cada uno trabaja sobre un conjunto de
archivos distinto. Si eso no se puede garantizar, lanzalos con aislamiento en
worktree. Ojo: un worktree arranca desde la rama base, no desde tus cambios
sin commitear, así que solo sirve si lo que necesita el subagente ya está
commiteado. En la duda, no paralelices: hacelo en secuencia.

Las decisiones, la integración y `/verificar` **no se delegan**.

### El encargo

Cada subagente arranca sin tu contexto. El encargo tiene que ser
autocontenido:

```text
Objetivo: <qué tiene que quedar hecho, en una oración>
Contexto: spec <ruta> (criterios N y M); archivos a leer: <rutas>
Límites: tocá solo <rutas>; no cambies <…>; no ejecutes <…>
Listo cuando: <condición verificable>
Respuesta: archivos tocados + dudas con archivo:línea (sin repetir el código)
```

### Si algo sale mal

- Un subagente falla o devuelve algo incompleto: no lo relances a ciegas.
  Leé su informe y corregí el encargo, o hacé la tarea vos.
- Dos informes se contradicen: comprobalo en el código y decidí vos. Un
  informe es un dato, no una orden.

## 4. Verificar y revisar

1. Ejecutá `/verificar` (incluye e2e porque toca páginas).
2. Lanzá **en paralelo** `revisor-codigo` (sobre el diff) y, si hubo texto
   visible, `revisor-contenido`.
3. **Consolidá:** uní los hallazgos, sacá los duplicados, ordenalos por
   gravedad y comprobá cada uno contra el código antes de corregirlo.
   Corregí lo bloqueante. Si lo corregido era bloqueante, volvé a correr
   `/verificar` y pedí una segunda revisión solo de esos archivos.
4. Marcá en la spec cada criterio cumplido y cambiá el estado a
   `Implementada`. Marcá los checkboxes de `docs/ROADMAP.md`.

## 5. Cierre

Informá: qué se hizo, qué se delegó y en qué agente, resultado de
`/verificar`, hallazgos de los revisores (corregidos o pendientes), desvíos
respecto de la spec y pendientes. Proponé el commit con `/commit` (no
commitees sin que lo pidan).
