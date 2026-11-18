# Hacé tu portfolio con IA — Claude Code

Una guía en español, desde cero, para construir un portfolio profesional como
este trabajando con **Claude Code**, un agente de IA que lee tu proyecto,
ejecuta comandos y edita archivos. Está pensada para quien ya programa (React,
Node.js, Laravel u otro stack) y usó la IA solo como chat.

También se puede leer en el sitio:
https://portfolio-patricio-polito.netlify.app/guia/

## Qué vas a lograr

- **Entender** cómo trabaja un agente de IA y por qué necesita estructura.
- **Construir** tu propio portfolio, paso a paso, con la misma arquitectura.
- **Llevarte el método:** specs, controles automáticos y revisiones, para
  usarlo en cualquier proyecto.

## Cómo está organizada

```mermaid
flowchart LR
    accTitle: Las tres partes de la guía: fundamentos, paso a paso y referencia
    F["Parte 1 · Fundamentos<br/>capítulos 1 a 8<br/>el marco teórico"] --> T["Parte 2 · Paso a paso<br/>capítulos 9 a 16<br/>tu portfolio de cero a publicado"]
    T --> R["Parte 3 · Referencia<br/>capítulos 17 a 19<br/>para el día a día"]
```

Cada capítulo dice, debajo del resumen, si lo que explica **se aplica en
este repo**, **en parte** o es **solo teórico** (por ejemplo, temas de la
certificación que un portfolio no necesita). Así sabés si podés buscarlo en el
código.

Si nunca usaste un agente, leé la guía en orden. Si ya conocés Claude Code y
querés ir directo a construir, empezá por el capítulo 9 y volvé a los
fundamentos cuando un paso no te cierre: cada uno indica qué capítulo
explica su porqué.

### Parte 1 · Fundamentos

| #   | Capítulo                                                               | Pregunta que responde                                     |
| --- | ---------------------------------------------------------------------- | --------------------------------------------------------- |
| 1   | [De chatear a trabajar con un agente](01-de-chatear-a-un-agente.md)    | ¿Qué cambia cuando la IA puede tocar el proyecto?         |
| 2   | [Primeros pasos con Claude Code](02-primeros-pasos.md)                 | ¿Cómo se abre una sesión y cómo se pide algo bien?        |
| 3   | [Contexto persistente: CLAUDE.md y reglas](03-contexto-persistente.md) | ¿Cómo sabe Claude las reglas del proyecto en cada sesión? |
| 4   | [Permisos y hooks](04-permisos-y-hooks.md)                             | ¿Cómo se garantiza lo que no puede fallar?                |
| 5   | [Skills y subagentes](05-skills-y-subagentes.md)                       | ¿Cómo se empaquetan procesos y revisiones?                |
| 6   | [MCP: conectar herramientas](06-mcp.md)                                | ¿Cómo se suman herramientas externas al agente?           |
| 7   | [Orquestación de agentes](07-orquestacion-de-agentes.md)               | ¿Cómo se reparte una tarea entre varios agentes?          |
| 8   | [Specs, ADR y fuente de verdad](08-specs-adr-y-fuente-de-verdad.md)    | ¿Cómo se acuerda qué construir, por qué y con qué datos?  |

### Parte 2 · Paso a paso

| #   | Capítulo                                                      | Resultado                                              |
| --- | ------------------------------------------------------------- | ------------------------------------------------------ |
| 9   | [Preparar el entorno](09-preparar-el-entorno.md)              | Cuentas, herramientas y tu repositorio con Claude Code |
| 10  | [Producto y contenido](10-producto-y-contenido.md)            | Tu objetivo, tu experiencia y tus casos, escritos      |
| 11  | [Proyecto base y calidad](11-proyecto-base-y-calidad.md)      | Astro + React + TypeScript con tests y `/verificar`    |
| 12  | [Claude Code en tu repositorio](12-claude-code-en-tu-repo.md) | Permisos, hooks, skills, revisores y CI                |
| 13  | [Construir el sitio con specs](13-construir-el-sitio.md)      | La home y las páginas, fase por fase                   |
| 14  | [Casos de estudio y demos](14-casos-y-demos.md)               | Tus casos publicados y, si querés, una demo            |
| 15  | [Publicar y mantener](15-publicar-y-mantener.md)              | El sitio en internet y un circuito para mantenerlo     |
| 16  | [Claude Code en CI](16-claude-code-en-ci.md)                  | Claude revisa tus PR cuando se lo pedís                |

### Parte 3 · Referencia

| #   | Capítulo                                                       | Para qué                                                 |
| --- | -------------------------------------------------------------- | -------------------------------------------------------- |
| 17  | [Flujos de trabajo](17-flujos-de-trabajo.md)                   | Qué hacer para una feature, una experiencia o un arreglo |
| 18  | [Buenas prácticas y problemas comunes](18-buenas-practicas.md) | Hábitos y qué hacer cuando algo sale mal                 |
| 19  | [Glosario](19-glosario.md)                                     | Cada término, con dónde aparece en el repo               |

## Dónde está cada cosa en el repositorio

```mermaid
flowchart LR
    accTitle: Mapa del repositorio: configuración de Claude Code, documentación y aplicación
    subgraph IA["Configuración de Claude Code"]
        CM["CLAUDE.md<br/>reglas globales"]
        ST[".claude/settings.json<br/>permisos y hooks"]
        HK[".claude/hooks/<br/>scripts de control"]
        RU[".claude/rules/<br/>reglas por carpeta"]
        SK[".claude/skills/<br/>procedimientos /comando"]
        AG[".claude/agents/<br/>revisores y traductor"]
    end
    subgraph DOC["Documentación (docs/)"]
        PR["PRODUCTO.md<br/>para qué"]
        AR["ARQUITECTURA.md<br/>cómo"]
        RM["ROADMAP.md<br/>qué falta"]
        SP["specs/<br/>qué construir"]
        AD["adr/<br/>por qué así"]
        CO["contenido/ y casos/<br/>datos reales"]
    end
    subgraph APP["Aplicación"]
        SRC["src/"]
        E2E["e2e/"]
        CI[".github/workflows/<br/>ci.yml y claude.yml"]
        MCP[".mcp.json<br/>servidor MCP"]
    end
    IA --> APP
    DOC --> APP
```

## Esta guía y el sitio

La guía tiene una sola fuente: estos archivos. Las páginas de `/guia/` del
portfolio se generan a partir de ellos en cada build
([spec 006](../specs/006-guia-ia-en-el-sitio.md)). Para que eso siga
funcionando, al editarla:

- un archivo por capítulo, con número de dos dígitos al principio del nombre
  (`NN-slug.md`); el slug es la URL (`/guia/slug/`);
- un solo título `#` por archivo y un primer párrafo que resume el capítulo
  (es la descripción de la página);
- cada diagrama en un bloque ` ```mermaid ` con una línea `accTitle:` (su
  texto alternativo); después de cambiar uno, `npm run diagramas`
  ([ADR 0006](../adr/0006-diagramas-mermaid-pre-renderizados.md));
- enlaces relativos: a otro capítulo (`02-primeros-pasos.md`) o a archivos del
  repo (`../../CLAUDE.md`, que en el sitio apuntan a GitHub);
- debajo del resumen, la etiqueta
  `> **Aplicación:** En este repo | En parte | Solo teórico — …` (sin ella,
  el build falla); una sección que es solo teoría empieza con
  `> **Para la certificación.**` o aclara que el repo no la usa;
- si se agrega un capítulo, va donde corresponde por tema y se ubica en su
  parte en `src/data/guia.ts`;
- nada de datos privados ni de nombres de clientes.
