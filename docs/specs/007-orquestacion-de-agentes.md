# 007 · Orquestación de agentes

- **Estado:** Implementada
- **Roadmap:** Fase 10 de `docs/ROADMAP.md`
- **Relacionado:** `.claude/`, `docs/guia-ia/`,
  [spec 006](006-guia-ia-en-el-sitio.md),
  [ADR 0007](../adr/0007-orquestacion-de-agentes.md)

## Problema

La guía "Hacé tu portfolio con IA" explica skills y subagentes por separado,
pero no cómo **orquestarlos**: una sesión principal que reparte trabajo entre
varios agentes, en paralelo o en cadena, y después junta los resultados. El
repo tampoco lo hace: lo único parecido es que `/implementar` lanza los dos
revisores en paralelo. Como la guía tiene que describir el repo real, hay
que resolver las dos cosas juntas.

## Objetivo

- Que el repo **use** la orquestación en sus flujos principales (`/spec`,
  `/implementar`, `/nuevo-caso`, `/nueva-experiencia`).
- Que el lector de la guía entienda qué es orquestar, cuándo conviene y
  cuándo no, y pueda reproducirlo en su proyecto con el ejemplo de este repo.

## Alcance

### Repo (`.claude/` y `CLAUDE.md`)

- **Patrón único:** explorar en paralelo → planificar (sesión principal) →
  ejecutar (delegado solo si las tareas son independientes) → verificar →
  revisar en paralelo → consolidar.
- `/implementar`:
  - Exploración inicial con hasta 3 agentes `Explore` en paralelo, uno por
    área: `src/lib/`, islas y páginas, tests y e2e.
  - El plan marca qué tareas son independientes.
  - Una tarea independiente y acotada se delega en un subagente con un
    encargo autocontenido. Si dos agentes editan a la vez, trabajan sobre
    archivos distintos o, si no se puede garantizar, cada uno en su
    worktree.
  - La consolidación de los revisores: deduplicar, ordenar por gravedad,
    corregir lo bloqueante y volver a revisar solo si hubo correcciones
    bloqueantes.
  - Límites: cuándo no delegar y qué hacer si un subagente falla o se
    contradice con otro.
- `/spec`: exploración en paralelo (specs y ADR existentes, código afectado)
  antes de hacer las preguntas.
- **Agente nuevo `traductor`:** escribe la versión en inglés a partir del
  texto en español ya confirmado. Puede leer y editar, pero no ejecutar
  comandos.
- `/nuevo-caso` y `/nueva-experiencia`: cadena productor → verificador. La
  sesión principal escribe el ES y lo confirma con la persona. Después
  `traductor` escribe el EN, se corre `/verificar` y `revisor-contenido`
  controla la paridad.
- `CLAUDE.md`: la lista de subagentes incluye `traductor` y una línea remite
  al patrón (ADR 0007).
- ADR 0007: sesión única vs. orquestador + subagentes (la opción elegida)
  vs. agent teams o scripts headless.

### Guía (`docs/guia-ia/`)

- Capítulo nuevo `06-orquestacion-de-agentes.md` ("6 · Orquestación de
  agentes") en Fundamentos, con estas secciones:
  - Qué es orquestar y por qué conviene.
  - Patrones: paralelo y unión, cadena productor → verificador,
    orquestador + trabajadores con worktrees, y bucle de revisión.
  - Cómo escribir un encargo, con plantilla.
  - La orquestación en este repo.
  - Cuándo no orquestar, con árbol de decisión.
  - Funciones avanzadas, solo las confirmadas en la documentación oficial.
  - Práctica guiada y resumen.
- Renumeración de los capítulos 6–16 → 7–17. Los slugs y las URL no
  cambian. Se actualizan títulos, enlaces, "Anterior/Siguiente", menciones
  "capítulo N", `PARTES` en `src/data/guia.ts` y las tablas del README de la
  guía.
- Ajustes en otros capítulos:
  - Cap. 1: la herramienta `Agent` remite al cap. 6.
  - Cap. 5: suma `traductor` y un puente al 6.
  - Cap. 11 (Claude Code en tu repo): copiar `traductor.md` y probar la
    orquestación.
  - Cap. 15 (flujos): diagramas actualizados.
  - Cap. 16 (buenas prácticas): problemas comunes de la orquestación.
  - Cap. 17 (glosario): términos nuevos.
- Diagramas regenerados (`npm run diagramas`) y OG del capítulo nuevo
  (`npm run og`).

### Fuera de alcance

- Agent teams o cualquier función experimental en la configuración del repo.
  Solo se mencionan en la guía si están documentados.
- Scripts headless (`claude -p`) en `package.json` o en CI.
- Cambios de permisos o hooks, salvo que la delegación con worktrees los
  necesite. En ese caso se documentan en el cap. 4.
- Traducción de la guía al inglés.
- Plugin o repositorio plantilla para reutilizar la estructura (idea aparte).

## Diseño

- **Lógica:** los enlaces rotos ya los controlaba el loader con
  `enlacesACapitulos`. Durante la implementación apareció que nada controlaba
  que el título `# N ·` coincidiera con el número del archivo ni que la
  numeración fuera seguida. Por eso se agregó `problemasDeNumeracion` en
  `src/lib/guia/guia.ts` (con tests) y el loader corta el build si encuentra
  un problema.
- **Datos:** `PARTES` en `src/data/guia.ts` → Fundamentos 1–7, Paso a paso
  8–14, Referencia 15–17.
- **Archivos:** `git mv` de `06-…16-` a `07-…17-`. El slug sale del nombre
  sin el número, así que `/guia/<slug>/` no cambia.
- **Encargo a un subagente (formato común en los skills):** objetivo,
  contexto mínimo (spec y archivos), límites (qué no tocar), criterio de
  "listo", cómo verificar y formato de la respuesta.
- **Rendimiento / seguridad:** no cambia nada del sitio. `traductor` no
  tiene `Bash`. Los revisores siguen siendo de solo lectura.

## Criterios de aceptación

| #   | Criterio (verificable)                                                                                                                        | Test                                                     |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 1   | `/guia/` muestra 17 capítulos numerados 1..17 en tres partes; el 6 es "Orquestación de agentes" y el último es "Glosario"                     | `e2e/guia.spec.ts`                                       |
| 2   | `/guia/orquestacion-de-agentes/` existe, tiene al menos 4 diagramas con texto alternativo y navega a "Specs, ADR y fuente de verdad"          | `e2e/guia.spec.ts`                                       |
| 3   | Ningún capítulo enlaza a un archivo `NN-slug.md` inexistente, y el título `# N ·` de cada archivo coincide con su número                      | `src/lib/guia/*.test.ts`                                 |
| 4   | Las URL de los capítulos renumerados son las mismas que antes (por ejemplo, `/guia/specs-adr-y-fuente-de-verdad/` responde)                   | `e2e/guia.spec.ts`                                       |
| 5   | `/guia/orquestacion-de-agentes/` pasa axe (WCAG 2.2 AA) en tema claro y oscuro                                                                | `e2e/accesibilidad.spec.ts`                              |
| 6   | `.claude/agents/traductor.md` declara `tools` sin `Bash`; los revisores siguen sin `Edit` ni `Write`                                          | Revisión de `revisor-codigo`                             |
| 7   | `/implementar` y `/spec` indican la exploración en paralelo (máx. 3 `Explore`); `/implementar` incluye delegación, límites y consolidación    | Revisión manual del SKILL.md                             |
| 8   | `/nuevo-caso` y `/nueva-experiencia` delegan el EN en `traductor` después de que la persona confirma el ES, y cierran con `revisor-contenido` | Prueba manual con un caso existente (cambios revertidos) |
| 9   | Toda función de Claude Code que se nombra en el cap. 6 está confirmada en la documentación oficial y lleva su enlace                          | Revisión de `revisor-contenido`                          |
| 10  | `/verificar` pasa completo (formato, lint, tipos, unitarios, build, e2e y términos privados)                                                  | `/verificar`                                             |

## Preguntas abiertas

- Ninguna de contenido: no se publican datos personales nuevos.
- Antes de escribir el cap. 6, falta confirmar en la documentación oficial
  qué campos acepta el frontmatter de los agentes, el aislamiento con
  worktree, los agentes en segundo plano y el estado de agent teams.
