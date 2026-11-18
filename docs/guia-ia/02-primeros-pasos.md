# 2 · Primeros pasos con Claude Code

Este capítulo cubre lo práctico: cómo se instala Claude Code, cómo se abre en
el proyecto, qué significan los avisos de permisos, los atajos que se usan
todo el tiempo y, sobre todo, cómo escribir un pedido para que el resultado
salga bien a la primera.

> **Aplicación:** En este repo — los comandos, modos y atajos son los que se usan para trabajar en él.

## 2.1 Instalación

Necesitás una cuenta de Claude con acceso a Claude Code (o una API key). En
Windows, Claude Code usa **Git Bash** para ejecutar comandos, así que tiene
que estar instalado Git for Windows.

Hay un instalador nativo (la opción recomendada) y también un paquete de
npm, que requiere Node.js 18 o superior:

```bash
# Instalador nativo — macOS, Linux o Git Bash
curl -fsSL https://claude.ai/install.sh | bash

# Instalador nativo — PowerShell en Windows
irm https://claude.ai/install.ps1 | iex

# Alternativa con npm
npm install -g @anthropic-ai/claude-code
```

Los métodos de instalación cambian con el tiempo: antes de instalar, revisá
la documentación oficial de Claude Code
(https://code.claude.com/docs/en/setup). También
hay extensiones para VS Code y JetBrains. La
primera vez que lo abrís te pide iniciar sesión. El paso a paso completo de
la instalación (con Node, Git y las cuentas) está en el
[capítulo 9](09-preparar-el-entorno.md).

### Un laboratorio para practicar

Las prácticas de estos capítulos usan el repositorio de este portfolio como
laboratorio: cuando dicen "este repo", hablan de él. Clonalo en una carpeta
aparte para poder probar sin miedo:

```bash
git clone https://github.com/patricioprp/portfolio.git portfolio-referencia
cd portfolio-referencia
npm install
```

## 2.2 Abrir una sesión

Una **sesión** es una conversación con Claude dentro de una carpeta. Se abre
desde la terminal, parado en la raíz del proyecto:

```bash
cd portfolio-referencia
claude
```

Al arrancar pasan cosas que no ves pero que importan:

```mermaid
sequenceDiagram
    accTitle: Qué carga Claude Code al abrir una sesión
    actor Vos
    participant CC as Claude Code
    participant Repo as Repositorio
    Vos->>CC: claude
    CC->>Repo: Lee .claude/settings.json (permisos y hooks)
    CC->>Repo: Carga CLAUDE.md
    CC->>Repo: Ejecuta el hook SessionStart
    Repo-->>CC: "Rama main · 0 cambios · pendientes del roadmap…"
    CC->>Repo: Registra skills (.claude/skills) y agentes (.claude/agents)
    CC-->>Vos: Listo para tu primer pedido
```

Para retomar una sesión anterior: `claude -c` (continúa la última) o
`claude --resume` (elegís cuál).

## 2.3 Los avisos de permisos

Cuando Claude quiere hacer algo que no está pre-autorizado (por ejemplo,
editar un archivo o ejecutar un comando nuevo), te pregunta. Las opciones
típicas son:

| Opción                      | Qué significa                                                    |
| --------------------------- | ---------------------------------------------------------------- |
| Sí                          | Lo permite esta vez                                              |
| Sí, y no volver a preguntar | Lo permite para el resto de la sesión (o lo guarda como permiso) |
| No (y explicar qué hacer)   | Lo frena; podés escribirle por qué y qué hacer en su lugar       |

Leé siempre el comando antes de aceptar. En este repo, lo seguro y frecuente
(`npm test`, `npm run build`, `git diff`) ya está autorizado en
`.claude/settings.json`, y lo peligroso (`git push`, borrar carpetas, leer
`.env`) está prohibido. Lo vemos en el capítulo 4.

## 2.4 Modos de permiso

El **modo de permiso** decide cuánto pregunta Claude antes de actuar. Se ve
debajo del cuadro de texto y se cambia con **Shift+Tab**
([documentación](https://code.claude.com/docs/en/permission-modes)):

| Modo                                    | Qué hace                                                                   | Cuándo usarlo                                                                   |
| --------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| **Normal** (`default`)                  | Lee sin preguntar; pide permiso para editar y para comandos no autorizados | Mientras aprendés y en tareas delicadas                                         |
| **Plan** (`plan`)                       | Investiga y te presenta un plan; no edita hasta que lo aprobás             | Antes de un cambio grande o cuando no está claro el camino                      |
| **Aceptar ediciones** (`acceptEdits`)   | Edita archivos y corre comandos comunes de archivos sin preguntar          | Tareas mecánicas en las que ya confiás                                          |
| **Auto** (`auto`)                       | Actúa sin preguntar, con un clasificador que revisa cada acción riesgosa   | Sesiones largas con un plan ya aprobado                                         |
| **No preguntar** (`dontAsk`)            | Solo hace lo pre-aprobado; lo que tendría que preguntar, lo rechaza        | Ejecuciones sin supervisión con permisos bien definidos                         |
| **Sin controles** (`bypassPermissions`) | Hace todo sin ningún control                                               | Solo dentro de un contenedor o una máquina virtual aislada; nunca en tu máquina |

Shift+Tab recorre normal, aceptar ediciones, plan y auto (si está
disponible). `dontAsk` y `bypassPermissions` no aparecen en ese ciclo: se
eligen al abrir la sesión con `claude --permission-mode <modo>`. El modo
inicial de todas tus sesiones se fija con `permissions.defaultMode` en los
settings (capítulo 4).

El **modo plan** es el mejor aliado al principio: le pedís algo, Claude lee
el código y te muestra qué piensa hacer. Si el plan no te convence, lo
corregís antes de que haya tocado un solo archivo. En este repo, las specs se
escriben y se implementan siempre después de un plan aprobado.

## 2.5 Sesiones y checkpoints

Cada conversación es una **sesión** y queda guardada en tu máquina
([documentación](https://code.claude.com/docs/en/sessions)):

| Para                                    | Usá                                   |
| --------------------------------------- | ------------------------------------- |
| Seguir la última sesión de esta carpeta | `claude -c`                           |
| Elegir una sesión anterior              | `claude --resume` o `/resume` adentro |
| Retomar una sesión por nombre o ID      | `claude -r "<nombre>"`                |
| Ponerle nombre antes de un `/clear`     | `/rename`                             |

Además, Claude Code guarda un **checkpoint** antes de cada mensaje tuyo. Con
`Esc` `Esc` o `/rewind` elegís un mensaje anterior y decidís si
restaurar el código, la conversación o las dos cosas
([documentación](https://code.claude.com/docs/en/checkpointing)).

Ojo con lo que **no** vuelve atrás: los archivos que cambió solo un comando
de `Bash` (por ejemplo, las imágenes que regenera `npm run og`) y, en
general, lo que editó un subagente. Los checkpoints son un deshacer rápido; **git sigue
siendo la red de seguridad**. Por eso en este repo se trabaja en ramas y se
commitea al cerrar cada tarea.

## 2.6 Modelos, esfuerzo y costo

- **`/model`** cambia de modelo con un alias (`opus`, `sonnet`, `haiku`)
  ([documentación](https://code.claude.com/docs/en/model-config)). Un modelo
  más chico cuesta menos y alcanza para tareas mecánicas.
- **`/effort`** regula cuánto razona el modelo antes de responder (`low`,
  `medium`, `high`, `xhigh`, `max`, según el modelo). Más esfuerzo es mejor
  para planes y problemas difíciles, y gasta más.
- **Extended thinking:** los modelos actuales razonan antes de responder, y
  ese razonamiento se cobra como texto generado. No hace falta activarlo; lo
  regulás con `/effort`.
- **`/usage`** muestra lo que consumió la sesión. Con una clave de API ves
  tokens y costo estimado; con una suscripción, cuánto usaste del plan y qué
  lo explica ([documentación](https://code.claude.com/docs/en/costs)).

Lo que más baja el consumo: `/clear` entre tareas distintas, un
`CLAUDE.md` corto (se lee en cada mensaje) y delegar en subagentes lo que
produce mucha salida, como correr tests o leer logs (capítulo 7).

## 2.7 Atajos y comandos útiles

| Atajo / comando         | Para qué                                                                       |
| ----------------------- | ------------------------------------------------------------------------------ |
| `@ruta/archivo`         | Mencionar un archivo para que lo lea (`@docs/specs/003-demo-contingencias.md`) |
| `!comando`              | Ejecutar un comando vos mismo y que la salida quede en la conversación         |
| `Esc`                   | Interrumpir a Claude en lo que esté haciendo                                   |
| `Esc` `Esc` o `/rewind` | Volver a un mensaje anterior (y, opcionalmente, deshacer los cambios)          |
| `/clear`                | Vaciar el contexto y empezar una tarea nueva                                   |
| `/compact`              | Resumir la conversación para liberar contexto sin perder el hilo               |
| `/context`              | Ver cuánto contexto está ocupado y en qué                                      |
| `/init`                 | Generar un `CLAUDE.md` inicial en un proyecto nuevo                            |
| `/memory`               | Abrir y editar los archivos de memoria (`CLAUDE.md`)                           |
| `/permissions`          | Ver y editar los permisos                                                      |
| `/hooks`                | Ver los hooks configurados                                                     |
| `/list-agents`          | Ver los subagentes y sesiones que están corriendo (no los definidos)           |
| `/model`, `/effort`     | Cambiar de modelo y de nivel de esfuerzo (2.6)                                 |
| `/usage`                | Ver el consumo de la sesión (2.6)                                              |
| `/resume`               | Volver a una sesión anterior (2.5)                                             |
| `/mcp`                  | Ver y aprobar los servidores MCP (capítulo 6)                                  |
| `/help`                 | Lista completa                                                                 |
| `/verificar`, `/spec`…  | Skills de este proyecto (capítulo 5)                                           |

## 2.8 Cómo pedir las cosas

La diferencia entre un buen y un mal resultado casi siempre está en el
pedido. Un buen pedido tiene cuatro partes:

```mermaid
flowchart LR
    accTitle: Las cuatro partes de un buen pedido: objetivo, contexto, restricciones y criterio de terminado
    A["Objetivo<br/>qué querés lograr"] --> B["Contexto<br/>dónde mirar, qué existe"]
    B --> C["Restricciones<br/>qué no tocar, qué respetar"]
    C --> D["Criterio de terminado<br/>cómo se comprueba"]
```

Ejemplo con este proyecto:

| Pedido flojo                   | Pedido bueno                                                                                                                                                                                                    |
| ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "Arreglá el mapa que anda mal" | "En la demo del mapa (`src/islands/mapa/`), al hacer zoom con el teclado el foco se pierde. Reproducilo con un test e2e en `e2e/demo-mapa.spec.ts`, corregilo sin cambiar `src/lib/mapa` y corré `/verificar`." |
| "Agregá mi trabajo nuevo"      | "`/nueva-experiencia` Entré a una empresa como Tech Lead en marzo (ejemplo ficticio)."                                                                                                                          |
| "Mejorá la home"               | "Usá el modo plan. Quiero que la sección de demos se entienda mejor en mobile. Leé `docs/PRODUCTO.md` y proponeme dos alternativas antes de tocar código."                                                      |

Reglas prácticas:

- **Señalá archivos** con `@` o con la ruta: ahorra búsquedas y errores.
- **Decí cómo se verifica:** "que pase `npx vitest run src/lib/mapa`".
- **Una tarea por vez.** Si mezclás tres pedidos, el resultado mezcla tres cosas.
- **Si algo es ambiguo, pedile que pregunte:** "si te falta un dato, preguntame antes".

## 2.9 Revisar lo que hizo

Claude te muestra cada edición como un _diff_ (líneas agregadas y quitadas).
Al final de una tarea, revisá el conjunto:

```bash
git status      # qué archivos cambiaron
git diff        # qué cambió en cada uno
```

En este repo, además, el skill `/verificar` corre formato, lint, tipos,
tests, build y e2e. Nada se commitea sin que vos lo pidas.

## 2.10 Práctica guiada

Hacé esto en este repositorio para perderle el miedo:

1. Abrí `claude` en la raíz. Mirá el mensaje del hook de inicio con los pendientes.
2. Pasá a modo plan (Shift+Tab) y pedí: _"Explicame cómo se calcula el
   puntaje en la demo del formulario dinámico, con los archivos involucrados."_
3. Volvé a modo normal y pedí: _"Agregá un test en `src/lib/mapa/mapa.test.ts`
   que compruebe que `distanciaKm` de un punto a sí mismo es 0. Corré solo
   ese archivo."_
4. Mirá el diff y el resultado del test.
5. Si no te convence, `Esc` `Esc` para volver atrás, o pedile que lo deshaga.

## Resumen

- `claude` en la raíz abre una sesión; al arrancar carga permisos, hooks,
  `CLAUDE.md`, skills y agentes.
- Shift+Tab cambia de modo; el modo plan propone antes de editar.
- `claude -c` retoma la última sesión; `Esc Esc` vuelve a un checkpoint, pero
  git sigue siendo la red de seguridad.
- `/model`, `/effort` y `/usage` controlan calidad y consumo.
- Un buen pedido tiene objetivo, contexto, restricciones y criterio de terminado.
- Siempre se revisa el diff; `/verificar` comprueba que todo siga funcionando.

Anterior: [1 · De chatear a un agente](01-de-chatear-a-un-agente.md) ·
Siguiente: [3 · Contexto persistente](03-contexto-persistente.md)
