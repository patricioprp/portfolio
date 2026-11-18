# 17 · Glosario

Los términos de esta guía en orden alfabético, con una definición corta y
dónde aparecen en el repositorio.

| Término                       | Significado                                                                                                       | En este repo                     |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| **ADR**                       | _Architecture Decision Record_: documento con una decisión técnica, sus alternativas y consecuencias              | `docs/adr/`                      |
| **Agente**                    | Modelo de IA con herramientas para actuar (leer, editar, ejecutar), que trabaja en ciclos                         | Claude Code                      |
| **Agente en segundo plano**   | Subagente que trabaja mientras la sesión sigue; el resultado llega cuando termina                                 | Capítulo 6                       |
| **Astro**                     | Framework web que genera HTML estático y agrega JavaScript solo donde hace falta                                  | `astro.config.mjs`               |
| **CI**                        | Integración continua: verificaciones automáticas en cada push o PR                                                | `.github/workflows/ci.yml`       |
| **CLAUDE.md**                 | Instrucciones del proyecto que se cargan en cada sesión                                                           | `CLAUDE.md`                      |
| **Claude Code**               | Programa que corre Claude como agente dentro de tu proyecto, en la terminal o el editor                           | —                                |
| **Contexto**                  | Todo lo que el modelo tiene a la vista en una sesión; se vacía al empezar otra                                    | `/context` lo muestra            |
| **Criterio de aceptación**    | Condición verificable que define cuándo algo está terminado; se vuelve un test                                    | Tablas de `docs/specs/`          |
| **Deploy**                    | Publicar una versión del sitio en internet                                                                        | Netlify, en cada push a `main`   |
| **Diff**                      | Las diferencias entre la versión anterior y la nueva de un archivo                                                | `git diff`                       |
| **Encargo**                   | Instrucción autocontenida para un subagente: objetivo, contexto, límites, criterio de "listo" y respuesta         | `/implementar`                   |
| **Explore**                   | Subagente integrado de Claude Code, de solo lectura, para buscar en el código                                     | `/spec`, `/implementar`          |
| **Frontmatter**               | Bloque YAML entre `---` al principio de un Markdown, con metadatos                                                | Skills, agentes, reglas          |
| **Fuente de verdad**          | El único lugar donde un dato es correcto por definición; el resto deriva de ahí                                   | `docs/contenido/`, `docs/casos/` |
| **Herramienta (tool)**        | Acción que el agente puede pedir: `Read`, `Edit`, `Bash`…                                                         | —                                |
| **Hook**                      | Comando que Claude Code ejecuta en un evento; puede bloquear (código 2)                                           | `.claude/hooks/`                 |
| **Isla**                      | Componente interactivo (React) dentro de una página estática de Astro                                             | `src/islands/`                   |
| **MCP**                       | _Model Context Protocol_: forma estándar de conectar herramientas externas (navegador, bases de datos)            | No se usa todavía                |
| **Mermaid**                   | Lenguaje para dibujar diagramas con texto; GitHub los muestra como gráficos                                       | Diagramas de esta guía           |
| **Modo plan**                 | Modo en el que Claude investiga y propone sin editar                                                              | Shift+Tab                        |
| **Netlify**                   | Servicio que construye y publica el sitio desde GitHub                                                            | `netlify.toml`                   |
| **Orquestación**              | Repartir una tarea entre varios agentes (en paralelo o en cadena) y juntar, comprobar e integrar lo que devuelven | ADR 0007                         |
| **Orquestador**               | La sesión principal: decide, delega, integra y verifica                                                           | Tu sesión de Claude Code         |
| **Paralelo**                  | Varios subagentes lanzados en un mismo mensaje que trabajan a la vez                                              | Exploración y revisores          |
| **Permiso**                   | Regla de qué puede ejecutar Claude sin preguntar (`allow`), preguntando (`ask`) o nunca (`deny`)                  | `.claude/settings.json`          |
| **Pull request (PR)**         | Pedido para unir una rama a `main`, con revisión y CI antes del merge                                             | GitHub                           |
| **Rama**                      | Línea de trabajo paralela en git; permite probar cambios sin tocar `main`                                         | `git switch -c <nombre>`         |
| **Regla (rule)**              | Instrucciones que se cargan solo al tocar ciertas rutas                                                           | `.claude/rules/`                 |
| **Repositorio de referencia** | El repo de este portfolio, clonado aparte para copiar estructura en el tutorial                                   | `portfolio-referencia`           |
| **Sesión**                    | Una conversación con Claude Code en una carpeta                                                                   | `claude`, `claude -c`            |
| **Skill**                     | Procedimiento reutilizable que se invoca con `/nombre`                                                            | `.claude/skills/`                |
| **Spec**                      | Documento con problema, alcance, fuera de alcance y criterios de aceptación, previo al código                     | `docs/specs/`                    |
| **Subagente**                 | Asistente con contexto propio y herramientas limitadas, al que se le delega una tarea                             | `.claude/agents/`                |
| **TDD**                       | Escribir el test que falla antes del código que lo hace pasar                                                     | `/implementar`                   |
| **Token**                     | Unidad en la que el modelo mide el texto (aprox. ¾ de palabra); el contexto tiene un máximo de tokens             | —                                |
| **Worktree**                  | Copia de trabajo de git en otra carpeta, con su rama, para que dos agentes no se pisen                            | `isolation: worktree`            |
| **zod**                       | Librería que valida la forma de los datos; si no cumplen, el build falla                                          | `src/content.config.ts`          |

Anterior: [16 · Buenas prácticas](16-buenas-practicas.md) ·
Volver al [índice](README.md)
