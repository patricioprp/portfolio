# Arquitectura

## Decisiones

| Decisión               | Elección                                                                         | Por qué                                                                                                                                       |
| ---------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework              | **Astro 7**                                                                      | HTML estático por defecto (SEO y velocidad), content collections para los casos, i18n nativo                                                  |
| Interactividad         | **Islas React 19**                                                               | Es el stack principal de Patricio; las demos muestran su forma de trabajar en React                                                           |
| Menú móvil y tema      | **Scripts de Astro** (vanilla, < 2 KB)                                           | El runtime de React (~60 KB gz) solo para un menú rompería el presupuesto de 50 KB de la home                                                 |
| Lenguaje               | **TypeScript 6 (`strictest`)**                                                   | Sin `any`; los modelos del optimizador y del formulario tipados                                                                               |
| Estilos                | **Tailwind CSS 4** (`@tailwindcss/vite`)                                         | Continuidad con la versión actual, sin CDN                                                                                                    |
| Solver LP              | **HiGHS** (`highs`, WebAssembly), detrás de una interfaz `Solver`                | javascript-lp-solver no terminaba en 5 min con 200 variables enteras; HiGHS resuelve en < 1 s. El .wasm (~1,2 MB gz) se carga solo en la demo |
| Ejecución del solver   | **Web Worker** en el navegador                                                   | Sin backend: el deploy sigue siendo estático y gratuito; la UI no se bloquea                                                                  |
| Formulario de contacto | **Netlify Forms**                                                                | Sin servidor propio; protección contra spam con honeypot                                                                                      |
| Íconos                 | `astro-icon` + Iconify (SVG sueltos)                                             | Se reemplaza Font Awesome completo por CDN                                                                                                    |
| Tests                  | **Vitest** (lib) + **Playwright** (e2e, smoke + a11y con `@axe-core/playwright`) | Mismo tooling que usa en su trabajo                                                                                                           |
| Deploy                 | **Netlify**, `publish = "dist"`                                                  | Ya está configurado; solo cambia la carpeta publicada                                                                                         |

## Estructura de carpetas (objetivo)

```text
mi-portfolio/
├─ CLAUDE.md
├─ .claude/                    # configuración de Claude Code (skills, agentes, permisos)
├─ docs/                       # fuente de verdad: producto, arquitectura, contenido, casos
│  └─ privado/                 # notas personales (gitignored, nunca se publican)
├─ legacy/index.html           # versión anterior, solo como referencia
├─ public/
│  ├─ cv/                      # CV públicos (ES/EN), sin referencias ni datos sensibles
│  ├─ og/                      # imágenes Open Graph
│  └─ favicon.svg
├─ src/
│  ├─ components/              # componentes .astro (Hero, CaseCard, Timeline, ...)
│  │  └─ ui/                   # primitivas (Button, Badge, Section, ...)
│  ├─ islands/                 # componentes React interactivos
│  │  ├─ optimizador/          # UI de la demo de cortes
│  │  ├─ formulario-dinamico/  # UI de la demo de planillas
│  ├─ lib/                     # lógica pura en TS, sin UI, con tests al lado
│  │  ├─ optimizador/
│  │  │  ├─ domain.ts          # tipos: Vigueta, Diametro, Patron, Plan
│  │  │  ├─ patrones.ts        # generador recursivo de patrones maximales (en cm)
│  │  │  ├─ modelo.ts          # arma el modelo LP a partir de patrones y demanda
│  │  │  ├─ solver/            # interfaz Solver + adaptador HiGHS
│  │  │  ├─ heuristica.ts      # "orden de llegada" para comparar el ahorro
│  │  │  ├─ reporte.ts         # KPIs: acero, recorte, sobreproducción, ahorro
│  │  │  └─ worker.ts          # entrada del Web Worker
│  │  └─ formularios/
│  │     ├─ types.ts           # Campo (árbol), Condicion, Respuestas
│  │     ├─ visibilidad.ts     # cumpleCondicion
│  │     └─ puntaje.ts         # descuentos + ítems críticos
│  ├─ content/
│  │  ├─ config.ts             # esquemas zod de las colecciones
│  │  ├─ casos/{es,en}/*.mdx
│  │  └─ experiencia/*.json
│  ├─ i18n/{es,en}.json + utils.ts
│  ├─ layouts/BaseLayout.astro # <head>, SEO, OG, JSON-LD, tema
│  ├─ pages/
│  │  ├─ index.astro
│  │  ├─ casos/[slug].astro
│  │  ├─ demos/{optimizador-viguetas,formulario-dinamico}.astro
│  │  └─ en/...                # espejo en inglés
│  └─ styles/global.css        # @import "tailwindcss" + tokens (@theme)
├─ e2e/                        # tests de Playwright
├─ astro.config.mjs
├─ netlify.toml
└─ package.json
```

## Textos e idiomas

- Textos de la UI y de la home: `src/i18n/es.ts` y `src/i18n/en.ts`. `en` está tipado como `Diccionario` (`typeof es`), así que una clave faltante rompe `npm run check`.
- Contenido estructurado con idioma por campo (`{ es, en }`): colección `experiencia` en `src/content/experiencia.json`.
- La home es `src/components/home/HomePage.astro` con prop `idioma`; la Fase 6 solo agrega `src/pages/en/index.astro`.
- Datos de contacto: `src/data/perfil.ts`.
- Casos: MDX en `src/content/casos/{es,en}/<slug>.mdx` (id del glob = `<idioma>/<slug>`); helpers en `src/data/casos.ts` (`obtenerCasos`, `slugDeCaso`, `rutaDeCaso`). La página es `src/components/caso/CasoPage.astro`.
- Demos: páginas en `src/components/demo/` sobre `DemoLayout.astro` (encabezado, enlaces al caso y al código, "Cómo funciona"); islas en `src/islands/{optimizador,formulario}/` y utilidades compartidas en `src/islands/compartido/`.
- Diagramas: `src/components/diagramas/`, cada uno con prop `idioma` y textos propios; envueltos en `Figura.astro` (scroll horizontal en mobile, mínimo 640 px).

## Demo 1: Optimizador de cortes de viguetas

Flujo: el usuario edita medidas, diámetro mínimo, costos y demanda → el Worker
genera los patrones por diámetro → arma el modelo → el solver resuelve → el
reporte calcula los KPIs → la UI dibuja los bancos y filas cortadas (como la
figura 2 de `docs/casos/optimizador-viguetas.md`) y el ahorro frente a la heurística.

Reglas del dominio (ver el caso para el detalle):

- Trabajar en **centímetros enteros** (evita errores de redondeo).
- Fila de 3300 cm; un banco produce siempre 3 filas con el mismo diámetro.
- Una vigueta puede llevar acero igual o más grueso que su mínimo, nunca más fino.
- Patrones **maximales** únicamente.
- Interfaz `Solver { resolver(modelo): Promise<SolucionLP> }`. Detalle en `src/lib/optimizador/README.md`.

Casos de test obligatorios (datos en el caso):

- El generador produce 8 patrones finos, 75 medios y 117 gruesos (200 en total).
- El plan cubre toda la demanda y su costo es 103,5 (≥ 99,2, la cota teórica).
- El ahorro frente a la heurística es positivo.

## Demo 2: Formulario dinámico

La planilla es un árbol JSON (tipo, opciones, condición de visibilidad, peso,
crítico, hijos hasta 3 niveles). Un **registro de componentes** asocia cada
`tipo` con su componente; un componente **recursivo** `Campo` dibuja los hijos
cuando se cumple la condición. Panel lateral con el puntaje en vivo (vista
previa: en el sistema real la fuente de verdad era el backend) y un editor
JSON para que el visitante modifique la planilla y vea el resultado sin
recargar.

Tests: visibilidad por nivel, descuento por ítem común, ítem crítico → 0,
campos ocultos no puntúan.

## Seguridad y headers (netlify.toml)

Mantener `X-Frame-Options: DENY` y `X-Content-Type-Options: nosniff`; agregar
`Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` y una
CSP que permita `worker-src 'self' blob:`.
