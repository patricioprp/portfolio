# 0007 · Orquestador + subagentes para repartir el trabajo

- **Estado:** Aceptado
- **Fecha:** 2026-11

## Contexto

Hasta la Fase 9, cada tarea la hacía una sola sesión de Claude Code de punta
a punta. La única delegación era la revisión final (`revisor-codigo` y
`revisor-contenido` en paralelo). Eso tiene tres costos:

- La sesión principal llena su contexto leyendo archivos que solo
  necesitaba para orientarse.
- Las tareas que no dependen entre sí (por ejemplo, la versión en inglés de
  un texto ya confirmado) se hacen una tras otra.
- La sesión que escribe es la misma que controla, con el sesgo de autor que
  eso implica.

Claude Code permite lanzar subagentes con contexto y herramientas propios,
en paralelo, en segundo plano o en un worktree aislado
([documentación](https://code.claude.com/docs/en/sub-agents)).

## Decisión

La sesión principal **orquesta**: decide, planifica, integra y verifica.
Delega en subagentes tres tipos de trabajo:

1. **Exploración** (agente integrado `Explore`, de solo lectura): hasta 3 en
   paralelo, uno por área. Devuelven resúmenes, no archivos completos.
2. **Producción acotada** (por ejemplo, `traductor`): una tarea con entrada
   confirmada, archivos definidos y criterio de "listo".
3. **Revisión** (`revisor-codigo`, `revisor-contenido`): en paralelo y de
   solo lectura. La sesión principal consolida los hallazgos.

El patrón es el mismo en todos los skills: explorar en paralelo → planificar
→ ejecutar (delegando solo lo independiente) → verificar → revisar en
paralelo → consolidar.

## Alternativas consideradas

- **Sesión única (como hasta ahora):** es simple, pero gasta contexto, no
  paraleliza y no separa a quien escribe de quien controla.
- **Agent teams** (varias sesiones coordinadas que se mandan mensajes): es
  experimental, está apagado por defecto y tiene limitaciones conocidas
  ([documentación](https://code.claude.com/docs/en/agent-teams)). Para un
  repo de una persona, la coordinación extra no compensa.
- **Scripts headless (`claude -p`) en paralelo:** sirven para tareas en lote
  o en CI, pero pierden la conversación con quien decide. Ninguna tarea de
  este repo lo necesita.

## Consecuencias

- Las decisiones, la integración y `/verificar` nunca se delegan. Un informe
  de un subagente se toma como dato y se comprueba antes de actuar.
- Solo se paraleliza lo que es independiente. Dos agentes que editan a la vez
  trabajan sobre archivos distintos o en worktrees separados.
- Cada subagente que escribe tiene el mínimo de herramientas: `traductor`
  edita pero no ejecuta comandos, y los revisores solo leen.
- Delegar cuesta tokens: cada subagente arranca sin contexto. Por eso las
  tareas chicas o muy acopladas las sigue haciendo la sesión principal.
- La guía explica el patrón en el capítulo 6 (`docs/guia-ia/`).
