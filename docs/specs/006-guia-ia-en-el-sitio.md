# 006 · Guía de desarrollo con IA en el sitio

- **Estado:** Borrador (no aprobada: la guía hoy vive solo en el repositorio)
- **Roadmap:** sin fase asignada ("Ideas para después")
- **Relacionado:** `docs/guia-ia/`, [ADR 0005](../adr/0005-desarrollo-guiado-por-specs-con-ia.md)

## Problema

La forma de trabajar con IA del proyecto es un diferencial para recruiters y
tech leads, pero hoy solo se ve entrando al repositorio de GitHub.

## Objetivo

Que un visitante pueda leer la guía dentro del portfolio, con la misma
navegación, tema claro/oscuro y accesibilidad que el resto del sitio, sin
mantener dos copias del texto.

## Alcance (propuesta)

- Sección `/guia-ia/` con índice y una página por capítulo, generada desde
  `docs/guia-ia/*.md` (una sola fuente; nada se copia a mano).
- Diagramas Mermaid renderizados como SVG, legibles en ambos temas.
- Navegación anterior/siguiente entre capítulos.
- Enlace desde la home o el footer (a definir).

### Fuera de alcance

- Traducción al inglés en la primera versión (a decidir: ver preguntas).
- Cambiar el contenido de la guía: se publica tal como está en el repo.

## Diseño (propuesta)

- **Contenido:** colección `guia` en `src/content.config.ts` con el loader
  `glob` apuntando a `docs/guia-ia/`, excluyendo `README.md` (que pasa a ser
  la página índice). Título = primer `#` del archivo; orden = prefijo
  numérico del nombre; resumen = primer párrafo.
- **Enlaces:** los enlaces relativos entre capítulos (`02-primeros-pasos.md`)
  se reescriben a rutas del sitio; los enlaces a código apuntan al archivo en
  GitHub.
- **Mermaid:** dos opciones a evaluar en un ADR:
  1. Render en el build a SVG (por ejemplo, `rehype-mermaid`): cero JS en el
     cliente, pero el build necesita un navegador headless (ya está
     Playwright).
  2. Render en el cliente con la librería `mermaid`: más simple, pero suma
     JS pesado a esas páginas.
- **Presupuesto:** la home no carga nada nuevo.
- **SEO:** cada capítulo con título, descripción e imagen OG.

## Criterios de aceptación (borrador)

| #   | Criterio                                                                       | Test                        |
| --- | ------------------------------------------------------------------------------ | --------------------------- |
| 1   | Cada archivo `docs/guia-ia/NN-*.md` genera una página, en orden                | e2e                         |
| 2   | Editar un capítulo en `docs/guia-ia/` cambia la página sin tocar otro archivo  | build                       |
| 3   | Los diagramas se ven como SVG con contraste AA en tema claro y oscuro          | `e2e/accesibilidad.spec.ts` |
| 4   | Los enlaces entre capítulos funcionan dentro del sitio                         | e2e                         |
| 5   | La home no aumenta su JS                                                       | build (tamaño)              |
| 6   | Ningún término de `docs/privado/terminos-sensibles.txt` aparece en las páginas | `/verificar`                |

## Preguntas abiertas

- ¿Se publica? ¿Con qué enlace de entrada (home, footer, página "Cómo trabajo")?
- ¿Se traduce al inglés? Duplica el mantenimiento.
- ¿Render de Mermaid en el build o en el cliente? (ADR)

## Convenciones que la guía ya respeta para que esto sea posible

Están en [`docs/guia-ia/README.md`](../guia-ia/README.md#esta-guía-y-el-sitio):
un archivo por capítulo con número, un solo `#`, primer párrafo como resumen,
diagramas en Mermaid y enlaces relativos.
