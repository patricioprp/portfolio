# 14 · Flujos de trabajo paso a paso

Con todas las piezas presentadas, este capítulo las junta en los flujos que
vas a usar de verdad: una funcionalidad nueva, una experiencia laboral, un
caso de estudio, un arreglo chico y el camino de un cambio hasta que el sitio
se publica. Cada flujo muestra qué escribís vos y qué hace Claude.

## 14.1 Cuál flujo usar

```mermaid
flowchart TD
    accTitle: Qué flujo usar según lo que quieras hacer
    Q["¿Qué querés hacer?"] --> A["Funcionalidad, página o<br/>sección nueva"]
    Q --> B["Demo nueva"]
    Q --> C["Sumar o actualizar<br/>experiencia laboral"]
    Q --> D["Caso de estudio"]
    Q --> E["Arreglo chico o texto"]
    A --> A1["/spec → aprobar → /implementar"]
    B --> B1["/spec → aprobar → /nueva-demo → /implementar"]
    C --> C1["/nueva-experiencia"]
    D --> D1["/nuevo-caso slug"]
    E --> E1["Pedido directo → /verificar"]
    A1 --> Z["/commit cuando quieras"]
    B1 --> Z
    C1 --> Z
    D1 --> Z
    E1 --> Z
```

## 14.2 Funcionalidad nueva

```mermaid
sequenceDiagram
    accTitle: Flujo completo de una funcionalidad nueva, de la spec al commit
    actor P as Vos
    participant C as Claude
    participant R as Revisores
    P->>C: /spec sección "Charlas y artículos"
    C->>C: Lee PRODUCTO, ARQUITECTURA y specs
    C-->>P: Todas las preguntas juntas
    P->>C: Respuestas
    C-->>P: docs/specs/007-charlas.md (Borrador) + tarea en el ROADMAP
    P->>C: "Cambiá X" o "Aprobada"
    P->>C: /implementar docs/specs/007-charlas.md
    loop Por cada criterio de aceptación
        C->>C: Test que falla → código → test en verde
    end
    C->>C: /verificar
    C->>R: revisor-codigo y revisor-contenido en paralelo
    R-->>C: Hallazgos
    C->>C: Corrige lo bloqueante, marca la spec Implementada
    C-->>P: Resumen, desvíos y pendientes
    P->>C: /commit
```

Lo que te toca a vos: responder las preguntas, aprobar la spec y revisar el
resultado. El resto lo guían los skills.

## 14.3 Sumar experiencia laboral

Pensado para que solo tengas que contar lo que hiciste. Hay dos caminos:

```mermaid
flowchart TD
    accTitle: Dos caminos para sumar experiencia laboral y los archivos que se actualizan
    S{"¿Cómo preferís?"} --> E["Entrevista<br/>/nueva-experiencia"]
    S --> B["Borrador<br/>completás docs/contenido/_plantilla-experiencia.md<br/>y ejecutás /nueva-experiencia ruta"]
    E --> Q["Claude pregunta todo junto:<br/>rol, fechas, logros, stack,<br/>qué es confidencial, ¿caso?"]
    B --> Q2["Claude pregunta solo lo que falta"]
    Q --> D["Borrador ES y EN para que confirmes"]
    Q2 --> D
    D --> F1["1 · docs/contenido/experiencia.md"]
    F1 --> F2["2 · src/content/experiencia.json<br/>(cierra el trabajo anterior si corresponde)"]
    F2 --> F3["3 · Stack de la home si hay tecnologías nuevas"]
    F3 --> F4["4 · Hero, título y test e2e si cambió tu puesto"]
    F4 --> F5["5 · npm run cv → CV en PDF"]
    F5 --> F6["6 · /verificar + revisor-contenido"]
    F6 --> F7{"¿Merece un caso?"}
    F7 -- "Sí" --> NC["/nuevo-caso y enlace desde la experiencia"]
    F7 -- "No" --> CM["/commit"]
    NC --> CM
```

Ejemplos de cómo arrancar:

```text
/nueva-experiencia
/nueva-experiencia Entré a una empresa como Tech Lead en marzo
/nueva-experiencia docs/contenido/borrador-consultora.md
```

Para cada logro, Claude te va a pedir tres cosas: **qué problema había, qué
hiciste vos (o el equipo, y cuál fue tu parte) y qué cambió**. Es el formato
que convierte una lista de tareas en impacto, y lo que un recruiter busca.

## 14.4 Caso de estudio

```text
/nuevo-caso <slug>
```

Si existe `docs/casos/<slug>.md`, esa es la fuente. Si no, Claude la crea con
la estructura y te pide confirmar los datos marcados `TODO(contenido)`.
Después genera las versiones ES y EN, los diagramas, corre `/verificar` y le
pide una revisión a `revisor-contenido`.

## 14.5 Arreglo chico

Para un texto mal escrito o un bug puntual no hace falta spec:

```text
En la página del caso de acopio, en inglés, "stock" aparece como "stok".
Corregilo y corré /verificar.
```

Si el bug está en `src/lib/`, pedí primero un test que lo reproduzca: así
queda cubierto para siempre.

## 14.6 Del cambio a la publicación

```mermaid
flowchart LR
    accTitle: Camino de un cambio desde tu máquina hasta el sitio publicado
    L["Cambio en local"] --> V["/verificar<br/>formato, lint, tipos,<br/>tests, build, e2e"]
    V --> CO["/commit<br/>(Claude, si lo pedís)"]
    CO --> PU["git push<br/>(solo vos)"]
    PU --> CI["GitHub Actions<br/>mismas verificaciones"]
    PU --> N["Netlify<br/>build y deploy"]
    CI -. "si falla, revisás<br/>antes de seguir" .-> L
```

El CI (`.github/workflows/ci.yml`) repite los mismos pasos que `/verificar`.
Si algo se escapó en local, aparece ahí en rojo en la pestaña _Actions_ del
repositorio.

## 14.7 Ejemplo de una conversación (ficticia y abreviada)

```text
Vos:    /nueva-experiencia Entré a una empresa como Tech Lead en marzo

Claude: Para armarla necesito:
        1. ¿Nombre de la consultora y se puede publicar? ¿Cliente (anónimo)?
        2. Ubicación y modalidad (ej. "Córdoba · Remoto").
        3. ¿Tu trabajo actual termina en febrero? ¿En qué fecha exacta?
        4. Logros: para cada uno, problema → qué hiciste → qué cambió.
        5. Stack que usás de verdad.
        6. ¿Algo confidencial (sistemas, clientes)?
        7. ¿Hay algo con impacto medible para un caso de estudio?

Vos:    (respondés)

Claude: Borrador ES / EN: … ¿Lo confirmo?

Vos:    Sí

Claude: Actualicé experiencia.md, experiencia.json (cerré el trabajo anterior),
        agregué 2 tecnologías al stack, cambié el rol del hero y el test e2e,
        regeneré el CV. /verificar: todo OK. revisor-contenido: sin hallazgos
        bloqueantes. ¿Hago el commit?
```

## Resumen

- Funcionalidad: `/spec` → aprobar → `/implementar`.
- Experiencia: `/nueva-experiencia`, por entrevista o con la plantilla.
- Caso: `/nuevo-caso`. Arreglo chico: directo + `/verificar`.
- Claude puede commitear si se lo pedís; el push y la publicación son tuyos.

Anterior: [13 · Tutorial: publicar y mantener](13-publicar-y-mantener.md) ·
Siguiente: [15 · Buenas prácticas](15-buenas-practicas.md)
