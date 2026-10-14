# Roadmap

Cada fase es una unidad de trabajo para Claude Code. Para avanzar:
"Ejecutá la Fase N de docs/ROADMAP.md". Al terminar cada fase: `/verificar`,
marcar los checkboxes y proponer el commit.

## Fase 0 — Decisiones (Patricio)

Bloquean contenido, no código. Respuestas volcadas en `docs/contenido/` y `CLAUDE.md`.

- [x] Fechas de Sertic: full-time abr. 2021 – nov. 2023; desde el ingreso a Quadion, solo mantenimientos puntuales de proyectos legacy hasta junio 2026.
- [x] Título en Quadion: **Frontend Senior**.
- [x] Teléfono: se publica, con botón de WhatsApp.
- [ ] ¿Foto profesional? (mejora la conversión en LinkedIn y en el hero)
- [x] Objetivo: **solo búsqueda laboral a largo plazo** → sin sección Servicios ni CTA freelance.
- [x] Dominio: https://portfolio-patricio-polito.netlify.app/
- [x] Clientes: **anónimos** ("call center de nivel internacional", "prepaga líder a nivel nacional").
- [ ] CV públicos ES/EN sin referencias, sin fecha de nacimiento y sin credenciales (PDF para `public/cv/`)

## Fase 1 — Scaffold ✅

- [x] `git mv index.html legacy/index.html`
- [x] Proyecto Astro 7 (`strictest`) en la raíz con React 19, Tailwind 4 (`@tailwindcss/vite`), `astro-icon` (Iconify: simple-icons, lucide) y `@astrojs/sitemap`
- [x] Prettier (+ plugins astro y tailwind), ESLint 10 (typescript-eslint, astro, react-hooks, jsx-a11y-x)
- [x] Vitest (`src/lib/texto.test.ts`) y Playwright desktop + mobile (`e2e/home.spec.ts`)
- [x] Scripts: `dev`, `build`, `preview`, `check`, `lint`, `lint:fix`, `format`, `format:check`, `test`, `test:watch`, `e2e`, `e2e:ui`
- [x] `netlify.toml`: `npm run build`, `publish = "dist"`, Node 24, headers + CSP
- [x] `.nvmrc` (Node 24 LTS)

## Fase 2 — Layout y home ✅

- [x] `BaseLayout` con SEO (title, description, canonical, OG, Twitter, JSON-LD `Person`), favicon e imagen OG (`npm run og`)
- [x] Modo claro/oscuro con tokens semánticos; sigue al sistema y recuerda la elección
- [x] Navegación con menú móvil accesible (script liviano, sin React: ver `docs/ARQUITECTURA.md`)
- [x] Secciones de la home según `docs/PRODUCTO.md`; textos en `src/i18n/{es,en}.ts`
- [x] Colección `experiencia` (zod) y componente `Timeline`
- [x] Formulario de contacto con Netlify Forms (honeypot, página `/gracias/`) + botón de WhatsApp; página 404
- [x] Botón "Descargar CV": aparece solo cuando existe `public/cv/CV_Patricio_Polito_ES.pdf` (pendiente de la Fase 0)

## Fase 3 — Casos de estudio ✅

- [x] Colección `casos` (zod: título, resumen ≤ 160, cliente, rol, período opcional, stack, problema, solución, impacto, métricas `real|ilustrativa`, demo, orden) con MDX en `src/content/casos/{es,en}/`
- [x] Página `casos/[slug]`: encabezado, "En 30 segundos", métricas reales, cuerpo MDX, bloque de demo (con las métricas ilustrativas y su aclaración), CTA y navegación entre casos
- [x] 3 casos migrados en ES y EN; tarjetas de la home y "Ver caso" de la experiencia enlazan a cada página
- [x] Diagramas SVG accesibles y con tema: ciclo del monitoreo, árbol de planilla, antes/después de la migración, planta con cuadrantes, bancos antes/después
- [x] Resaltado de código con temas duales (Shiki) y tipografía `prose` con los tokens del tema
- [x] Formularios dinámicos: Sertic, primer año (2021 – 2022). Optimizador: PHP vanilla. Acopio: análisis ABC en lugar de "curva de Gauss"

## Fase 4 — Demo: Optimizador de cortes de viguetas ✅

- [x] `src/lib/optimizador` (dominio, patrones, modelo LP, solver, heurística, reporte, validación) con tests: 200 patrones (8/75/117) y óptimo 103,5 en 24 bancos y 8 jornadas
- [x] Solver HiGHS (WebAssembly) en un Web Worker; javascript-lp-solver se descartó por rendimiento
- [x] Isla React: demanda editable (tarjetas en mobile), costos, "Optimizar", KPIs, bancos en SVG, producción y recortes
- [x] Estados de carga, validación, infactible y error; anuncios con `aria-live`
- [x] README de la demo (`src/lib/optimizador/README.md`); CSP con `'wasm-unsafe-eval'`
- [x] Home y caso enlazan a la demo; métrica ilustrativa del caso alineada con la demo (~37 %)
- [x] Repositorio público: https://github.com/patricioprp/portfolio (el enlace "Ver el código" apunta a `main`)

## Fase 5 — Demo: Formulario dinámico ✅

- [x] `src/lib/formularios` (esquema zod recursivo, visibilidad, puntaje, validación) con tests
- [x] Registro de componentes + `Campo` recursivo + panel de puntaje en vivo (barra fija en mobile)
- [x] Editor JSON validado con zod (mensajes localizados ES/EN) y reglas de negocio; se mantiene la última versión válida
- [x] Planilla de ejemplo con 3 niveles y un ítem crítico (ES/EN)
- [x] `DemoLayout` común para las páginas de demo; README en `src/lib/formularios/README.md`

## Fase 6 — Inglés, calidad y lanzamiento

- [x] Versión en inglés de todas las páginas (`/en/`, `/en/case-studies/`, `/en/demos/`, `/en/thanks/`), selector de idioma y `hreflang`
- [x] Imágenes OG por página e idioma (`npm run og`, plantilla en `src/pages/og/` solo en desarrollo)
- [x] e2e: navegación, menú móvil, formulario, demos e i18n; axe (WCAG 2.2 AA) sin violaciones en tema claro y oscuro
- [x] Lighthouse móvil: 99–100 en las 4 categorías en home, casos y demos (CLS 0 gracias a la API de fuentes de Astro)
- [x] Revisión del texto con el agente `revisor-contenido`
- [ ] **Patricio:** `git push` de `main` → Netlify despliega el sitio nuevo
- [ ] **Patricio:** en Netlify, Site configuration → Forms → activar "Form detection" y configurar la notificación por email (si se mantiene el formulario)
- [ ] **Patricio:** Google Search Console: verificar el sitio y enviar `/sitemap-index.xml`
- [ ] **Patricio:** actualizar el enlace al portfolio en LinkedIn y en el perfil de GitHub
- [ ] **Patricio:** CV públicos ES/EN en `public/cv/` (el botón "Descargar CV" aparece solo cuando existen)

## Ideas para después

- Calendario de producción en el optimizador (asignar bancos a jornadas según los turnos)
- Generación de columnas (Gilmore–Gomory) para muchas medidas
- Carga de demanda por CSV
- Versionado de planillas en la demo de formularios
- Blog técnico corto (1 artículo por caso)
