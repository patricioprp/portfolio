# 008 · Claude Code completo: MCP, Claude en CI, orden por tema y etiquetas de aplicación

- **Estado:** Implementada (criterios 7 y 9: pruebas manuales pendientes de Patricio)
- **Roadmap:** Fase 11 de `docs/ROADMAP.md`
- **Relacionado:** [spec 006](006-guia-ia-en-el-sitio.md),
  [spec 007](007-orquestacion-de-agentes.md),
  [ADR 0007](../adr/0007-orquestacion-de-agentes.md), ADR
  [0008](../adr/0008-mcp-y-claude-en-ci.md)

## Problema

La guía cubre el flujo con specs, skills, subagentes y orquestación, pero
deja afuera funciones de Claude Code que un desarrollador usa a diario. El
repo tampoco las usa:

- **MCP:** en el glosario figura como "no se usa".
- **Claude en CI.**
- **Modos de permiso:** solo se explica el modo plan.
- **Jerarquía e imports de `CLAUDE.md`** y **jerarquía completa de
  settings**.
- **Sesiones y checkpoints.**
- **Modelos, effort y costo.**
- **`allowed-tools` en skills.**
- **Sandboxing.**

Además, la guía va a sumar temas que pide la certificación Claude Certified
Architect: Foundations y que **no** se aplican en el portfolio (specs 009 y
010). Si no se marca cada capítulo, el lector puede buscar en el repo algo
que la guía solo explica en teoría.

## Objetivo

- Que el repo **use** un servidor MCP y a Claude en GitHub Actions, con el
  costo bajo control.
- Que la guía explique cada función de Claude Code que falta, con el ejemplo
  de este repo y un enlace a la documentación oficial.
- Que los temas sigan un **orden lógico de aprendizaje**: cada tema va donde
  se aprende de forma natural, no al final por haberse agregado después ni
  por estar o no en el portfolio.
- Que **cada capítulo diga si se aplica en este repo**: "En este repo",
  "En parte" o "Solo teórico".

## Estructura final de la guía (al cerrar las specs 008 a 010)

| Parte                            | Capítulos                                                                                                                                                   | Spec que los agrega |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| 1 · Fundamentos                  | 1 Chat → agente · 2 Primeros pasos · 3 Contexto · 4 Permisos y hooks · 5 Skills y subagentes · **6 MCP** · 7 Orquestación · 8 Specs, ADR y fuente de verdad | 6: esta             |
| 2 · Paso a paso                  | 9 Entorno · 10 Producto · 11 Proyecto base · 12 Claude Code en tu repo · 13 Sitio · 14 Casos y demos · 15 Publicar · **16 Claude en CI** · **17 Plugin**    | 16: esta; 17: 009   |
| 3 · Construir agentes con la API | **18 Bucle agéntico · 19 Prompts y salida estructurada · 20 Contexto y confiabilidad**                                                                      | 010                 |
| 4 · Referencia                   | 21 Flujos · 22 Buenas prácticas · 23 Glosario · **24 Mapa de la certificación**                                                                             | 24: 010             |

Por qué este orden:

- **MCP** amplía las herramientas del agente, igual que las skills y los
  subagentes. Por eso va en Fundamentos, antes de la orquestación.
- **CI** es un paso del circuito de publicación: va después de "Publicar y
  mantener".
- **El plugin** cierra el tutorial: compartir lo que armaste.
- **La API** es pasar de usar un agente a construir uno: forma su propio
  bloque.
- **El mapa de la certificación** es material de consulta.

Al terminar esta spec, la guía tiene 19 capítulos: 1–8, 9–16 y 17–19 (la
referencia, todavía sin el mapa).

## Alcance

### Repo

- **`.mcp.json`** (alcance de proyecto, versionado) con el servidor MCP de
  Playwright. Se instala con `npx` y no usa claves. Sirve para revisar
  páginas en un navegador real.
  - Las herramientas `mcp__playwright__*` se permiten en
    `.claude/settings.json`, salvo las que ejecutan código arbitrario si
    existen. Eso se confirma al implementar.
- **`/verificar`:** paso opcional "revisión visual con el MCP" cuando la
  tarea cambia el aspecto de una página.
- **`.github/workflows/claude.yml`** con la acción oficial de Claude Code
  para GitHub. Corre solo **a pedido**:
  - un comentario con `@claude` en un issue o una PR, hecho por el dueño del
    repo;
  - revisión automática de una PR solo cuando tiene la etiqueta
    `revision-claude`.
  - Usa el secreto `ANTHROPIC_API_KEY`, que carga Patricio.
  - Toma el contexto del `CLAUDE.md` del repo.
  - Límite de turnos y permisos mínimos: puede comentar, pero no hace push
    a `main`.
- **`allowed-tools`** en las skills que corren siempre los mismos comandos:
  `/verificar` (scripts de `npm`, `git grep` y las herramientas de mirar de
  Playwright) y `/commit` (`git status`, `diff`, `log` y `add`).
  - **Desvío registrado al implementar:** la documentación oficial aclara
    que `allowed-tools` **pre-aprueba** herramientas mientras el skill está
    activo, pero **no restringe** las demás (las reglas `deny` siguen
    valiendo). Se usa para que el skill sea autosuficiente y portable, no
    para reducir permisos. La guía (cap. 5) lo explica así.
- **ADR 0008:** MCP de Playwright frente a usar solo Playwright en tests, y
  Claude en CI a pedido frente a revisar todas las PR. Con el costo de cada
  opción.
- **`.claude/rules/guia.md`:**
  - cada capítulo lleva su etiqueta de aplicación;
  - las secciones que son solo para la certificación se marcan con
    `> **Para la certificación.** …`.

### Etiqueta de aplicación (todos los capítulos)

- **Formato en el Markdown:** debajo del primer párrafo (el resumen) de cada
  capítulo va una línea
  `> **Aplicación:** En este repo | En parte | Solo teórico — <aclaración>`.
  - Se lee igual en GitHub y en el sitio.
  - Una sola fuente: el texto no se repite en `src/data/`.
- **Lógica (`src/lib/guia/guia.ts`):** `extraerAplicacion(markdown)`
  devuelve `{ tipo: 'repo' | 'parcial' | 'teorico', detalle }` o `null`.
  `problemasDeNumeracion` (o una función hermana) informa los capítulos que
  no la tienen, y el loader corta el build.
- **UI:**
  - el índice (`GuiaIndice.astro`) muestra la etiqueta en cada tarjeta;
  - la página del capítulo la muestra junto al título;
  - el blockquote del cuerpo se oculta en el sitio, como la navegación, para
    que no aparezca dos veces;
  - textos en `GUIA` (`src/data/guia.ts`). La guía es solo en español, así
    que no lleva claves i18n.
- **Valores iniciales:** todos los capítulos actuales son "En este repo". La
  excepción es el 1, que es conceptual: "En parte — el bucle del agente se ve
  en cada sesión". El 6 (MCP) es "En parte": usa Playwright y explica el
  diseño de herramientas solo en teoría.

### Guía: capítulos nuevos y renumeración

- **`06-mcp.md` · "6 · MCP: conectar herramientas"** (Fundamentos):
  - qué es y los alcances (local, proyecto, usuario);
  - `claude mcp add` y `.mcp.json`;
  - el Playwright de este repo;
  - seguridad (servidores de confianza, permisos por herramienta);
  - sección marcada _Para la certificación_: cómo se escribe una buena
    descripción de herramienta y un error útil.
- **`16-claude-code-en-ci.md` · "16 · Tutorial: Claude Code en CI"**
  (Paso a paso, después de "Publicar y mantener"):
  - la acción de GitHub de este repo y cómo cargar el secreto;
  - `claude -p`, `--output-format json` y `--allowedTools`;
  - aislamiento de sesión;
  - costo;
  - cómo bajar los falsos positivos de una revisión automática.
- **Renumeración**, con el mismo método de la spec 007:
  - los capítulos 6–14 pasan a 7–15 y los 15–17 pasan a 17–19;
  - se actualizan títulos, secciones `N.x`, enlaces, "Anterior/Siguiente",
    menciones "capítulo N" (incluidas las que están dentro de diagramas y
    las del tipo "(9 y 10)"), `PARTES` (1–8, 9–16, 17–19) y las tablas y el
    diagrama del README de la guía;
  - las URL no cambian.

### Guía: secciones nuevas en capítulos existentes

| Cap. (número nuevo)       | Se agrega                                                                                                                                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2 Primeros pasos          | Modos de permiso (default, plan, aceptar ediciones, auto, bypass) y cuándo usar cada uno; sesiones (`claude -c`, `/resume`); checkpoints (`Esc Esc`, `/rewind`); modelos, effort, extended thinking y costo |
| 3 Contexto                | Jerarquía de `CLAUDE.md` (usuario, proyecto, subcarpetas); imports con `@ruta`; memoria automática y `/memory`                                                                                              |
| 4 Permisos y hooks        | Jerarquía completa de settings (managed, usuario, proyecto, local); sandboxing; prompt injection ampliado; eventos de hooks que faltan                                                                      |
| 5 Skills                  | `allowed-tools` y `context: fork` en skills, con el ejemplo de `/verificar`                                                                                                                                 |
| 12 Claude Code en tu repo | Copiar `.mcp.json` y comprobar que el servidor conecta                                                                                                                                                      |
| 18 Buenas prácticas       | Tabla de referencia con enlaces: output styles, statusline, Claude Code en la web, en el escritorio y en Chrome, y tareas programadas                                                                       |
| 19 Glosario               | Términos nuevos; la fila de MCP pasa a "`.mcp.json`"                                                                                                                                                        |

### Fuera de alcance

- Plugin y capítulo 17 (spec 009).
- Parte 3 (capítulos de la API) y mapa de la certificación (spec 010).
- Agent SDK, output styles y statusline en la práctica: solo se mencionan
  con un enlace.
- Revisión automática de **todas** las PR o tareas programadas con costo
  fijo.
- Otros servidores MCP (GitHub, bases de datos).

## Diseño

- **Lógica:** `extraerAplicacion` y el control de que todos los capítulos
  tengan etiqueta, en `src/lib/guia/guia.ts`, con tests. La numeración y los
  enlaces ya los controlan `problemasDeNumeracion` y el loader.
- **Datos:** `PARTES` se mantiene en tres partes en esta spec (1–8, 9–16,
  17–19). La parte 3 de la API la agrega la spec 010.
- **Fuentes:** cada función de Claude Code se confirma en code.claude.com
  antes de escribirla, con el agente `claude-code-guide`, y se enlaza.
  Nada de memoria.
- **Seguridad:**
  - El workflow de Claude no corre con PR de forks ni con comentarios de
    personas que no sean el dueño del repo.
  - El secreto no se escribe en ningún archivo.
  - El MCP no recibe permisos de `Bash`.
- **Costo:** el workflow solo corre a pedido. El cap. 16 explica cómo ver el
  consumo.

## Criterios de aceptación

| #   | Criterio (verificable)                                                                                                                                | Test                                            |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| 1   | `/guia/` muestra 19 capítulos numerados 1..19 en tres partes; el 6 es "MCP: conectar herramientas" y el 16 es "Claude Code en CI"                     | `e2e/guia.spec.ts`                              |
| 2   | Cada tarjeta del índice y cada página de capítulo muestran su etiqueta de aplicación ("En este repo", "En parte" o "Solo teórico")                    | `e2e/guia.spec.ts`                              |
| 3   | `extraerAplicacion` reconoce los tres tipos y devuelve `null` si no hay etiqueta; un capítulo sin etiqueta hace fallar el build                       | `src/lib/guia/guia.test.ts` + build             |
| 4   | `/guia/mcp/` y `/guia/claude-code-en-ci/` existen, tienen diagramas con texto alternativo y pasan axe en tema claro y oscuro                          | `e2e/guia.spec.ts`, `e2e/accesibilidad.spec.ts` |
| 5   | Las URL de los capítulos renumerados no cambian, y la numeración y los enlaces no tienen errores                                                      | `e2e/guia.spec.ts` + build                      |
| 6   | `.mcp.json` es JSON válido, declara el servidor de Playwright y no contiene claves ni rutas absolutas                                                 | Revisión de `revisor-codigo`                    |
| 7   | `claude mcp list` muestra el servidor del proyecto conectado, y una revisión visual de `/guia/` con sus herramientas funciona                         | Prueba manual                                   |
| 8   | `claude.yml` solo se dispara con `@claude` del dueño del repo o con la etiqueta `revision-claude`, no corre en PR de forks y no tiene permiso de push | Revisión de `revisor-codigo`                    |
| 9   | Con el secreto cargado, un `@claude` en una PR de prueba recibe respuesta                                                                             | Prueba manual (Patricio carga el secreto)       |
| 10  | Cada función nueva que nombra la guía enlaza a su página en code.claude.com                                                                           | Revisión de `revisor-contenido`                 |
| 11  | `/verificar` pasa completo y el CI actual sigue en verde                                                                                              | `/verificar` + GitHub Actions                   |

## Desvíos registrados al implementar

- **`allowed-tools`** pre-aprueba, no restringe (ver Alcance → Repo).
- **Prompt injection:** quedó ampliado en el cap. 18 (18.3), junto con el
  resto de la seguridad. El cap. 4 tiene un párrafo que remite ahí.
- **Criterio 8 ("sin permiso de push"):** el `GITHUB_TOKEN` de los dos jobs
  quedó en solo lectura, pero Claude publica con el token de la app "Claude",
  que tiene sus propios permisos. Desde el workflow no se puede garantizar
  "sin push"; se completa **protegiendo `main`** en GitHub (pendiente de
  Patricio). Además del criterio, el workflow corta en PR de forks también
  para los eventos de comentarios, que corren con secretos.
- **`@playwright/mcp`** quedó con versión fija (`0.0.85`) en lugar de
  `@latest`, para que los nombres de las herramientas de los permisos no
  cambien solos.
- **Lógica:** `extraerAplicacion` busca la etiqueta solo en el encabezado
  (antes de la primera `##`), para que un ejemplo del formato dentro de un
  capítulo no cuente como etiqueta.

## Pendientes manuales (Patricio)

- **Criterio 7:** abrir `claude` en el repo, aprobar el servidor
  `playwright` y comprobar con `claude mcp list` que conecta.
- **Criterio 9:** instalar la app "Claude" de GitHub, cargar
  `ANTHROPIC_API_KEY` y probar un `@claude` en una PR
  (`/install-github-app` hace los dos primeros pasos).
- Proteger `main` en GitHub (Settings → Branches).
