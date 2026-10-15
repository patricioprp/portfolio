# 0005 · Desarrollo guiado por specs con Claude Code

- **Estado:** Aceptado

## Contexto

El portfolio se desarrolla con Claude Code como asistente de programación.
Sin estructura, un agente de IA tiende a inventar datos, a mezclar tareas, a
olvidar convenciones entre sesiones y a dar por terminado algo que no compila.
En un portfolio, además, un dato inventado o privado publicado es un error
grave.

## Decisión

Trabajar con un flujo explícito y versionado en el repositorio:

1. **Contexto persistente:** `CLAUDE.md` (reglas globales) y `.claude/rules/`
   (reglas por carpeta).
2. **Fuente de verdad:** todo texto sale de `docs/contenido/` y `docs/casos/`.
3. **Spec antes que código:** `/spec` → aprobación → `/implementar`.
4. **Decisiones registradas:** ADR en `docs/adr/`.
5. **Guardas determinísticas:** hooks en `.claude/settings.json` (formato,
   archivos protegidos, términos privados) y CI en GitHub Actions.
6. **Revisión separada:** subagentes `revisor-codigo` y `revisor-contenido`
   con herramientas de solo lectura.

## Alternativas consideradas

- **Prompts sueltos sin documentación:** rápido al principio, pero el
  conocimiento queda en conversaciones que se pierden.
- **Solo `CLAUDE.md`:** un único archivo grande consume contexto en cada
  sesión aunque la tarea no lo necesite.

## Consecuencias

- Cualquier sesión nueva (o una persona nueva) entiende el proyecto leyendo
  el repositorio.
- Más archivos que mantener: cuando cambia una convención hay que actualizar
  la regla o el skill correspondiente.
- La guía completa está en `docs/guia-ia/`.
