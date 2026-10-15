# 10 · Glosario

Los términos de esta guía en orden alfabético, con una definición corta y
dónde aparecen en el repositorio.

| Término                    | Significado                                                                                            | En este repo                     |
| -------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------- |
| **ADR**                    | _Architecture Decision Record_: documento con una decisión técnica, sus alternativas y consecuencias   | `docs/adr/`                      |
| **Agente**                 | Modelo de IA con herramientas para actuar (leer, editar, ejecutar), que trabaja en ciclos              | Claude Code                      |
| **CI**                     | Integración continua: verificaciones automáticas en cada push o PR                                     | `.github/workflows/ci.yml`       |
| **Claude Code**            | Programa que corre Claude como agente dentro de tu proyecto, en la terminal o el editor                | —                                |
| **CLAUDE.md**              | Instrucciones del proyecto que se cargan en cada sesión                                                | `CLAUDE.md`                      |
| **Contexto**               | Todo lo que el modelo tiene a la vista en una sesión; se vacía al empezar otra                         | `/context` lo muestra            |
| **Criterio de aceptación** | Condición verificable que define cuándo algo está terminado; se vuelve un test                         | Tablas de `docs/specs/`          |
| **Diff**                   | Las diferencias entre la versión anterior y la nueva de un archivo                                     | `git diff`                       |
| **Frontmatter**            | Bloque YAML entre `---` al principio de un Markdown, con metadatos                                     | Skills, agentes, reglas          |
| **Fuente de verdad**       | El único lugar donde un dato es correcto por definición; el resto deriva de ahí                        | `docs/contenido/`, `docs/casos/` |
| **Herramienta (tool)**     | Acción que el agente puede pedir: `Read`, `Edit`, `Bash`…                                              | —                                |
| **Hook**                   | Comando que Claude Code ejecuta en un evento; puede bloquear (código 2)                                | `.claude/hooks/`                 |
| **MCP**                    | _Model Context Protocol_: forma estándar de conectar herramientas externas (navegador, bases de datos) | No se usa todavía                |
| **Mermaid**                | Lenguaje para dibujar diagramas con texto; GitHub los muestra como gráficos                            | Diagramas de esta guía           |
| **Modo plan**              | Modo en el que Claude investiga y propone sin editar                                                   | Shift+Tab                        |
| **Permiso**                | Regla de qué puede ejecutar Claude sin preguntar (`allow`), preguntando (`ask`) o nunca (`deny`)       | `.claude/settings.json`          |
| **Regla (rule)**           | Instrucciones que se cargan solo al tocar ciertas rutas                                                | `.claude/rules/`                 |
| **Sesión**                 | Una conversación con Claude Code en una carpeta                                                        | `claude`, `claude -c`            |
| **Skill**                  | Procedimiento reutilizable que se invoca con `/nombre`                                                 | `.claude/skills/`                |
| **Spec**                   | Documento con problema, alcance, fuera de alcance y criterios de aceptación, previo al código          | `docs/specs/`                    |
| **Subagente**              | Asistente con contexto propio y herramientas limitadas, al que se le delega una tarea                  | `.claude/agents/`                |
| **TDD**                    | Escribir el test que falla antes del código que lo hace pasar                                          | `/implementar`                   |
| **Token**                  | Unidad en la que el modelo mide el texto (aprox. ¾ de palabra); el contexto tiene un máximo de tokens  | —                                |
| **zod**                    | Librería que valida la forma de los datos; si no cumplen, el build falla                               | `src/content.config.ts`          |

Anterior: [9 · Buenas prácticas](09-buenas-practicas.md) ·
Volver al [índice](README.md)
