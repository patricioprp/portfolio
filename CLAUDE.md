# CLAUDE.md

Guía para Claude Code en este repositorio.

> El `CLAUDE.md` que está en `C:\Users\ppolito\Desktop` describe otro proyecto
> (Shell Container / OSDE) y **no aplica acá**. Ignorá sus comandos y convenciones.

## Qué es este proyecto

Portfolio profesional de **Patricio Rolando Polito** (Frontend Senior con
experiencia full stack, Ingeniero en Sistemas — UTN FRT). El objetivo es
conseguir un empleo estable a largo plazo: entrevistas con recruiters y tech
leads. **No se ofrecen servicios freelance.**
El diferencial frente a un portfolio típico son los **casos de estudio con
impacto medible** y las **demos ejecutables** en el navegador.

- Estrategia, público y estructura de páginas: `docs/PRODUCTO.md`
- Stack, carpetas y decisiones técnicas: `docs/ARQUITECTURA.md`
- Plan de trabajo por fases (con checkboxes): `docs/ROADMAP.md`
- Specs de cada funcionalidad (criterios de aceptación → tests): `docs/specs/`
- Decisiones técnicas con alternativas (ADR): `docs/adr/`
- Guía de cómo se trabaja con IA en este repo (capítulos con diagramas): `docs/guia-ia/`

## Estado actual

Fases 1 a 8 terminadas: sitio completo en español e inglés (home, cinco casos, cuatro demos) y flujo de trabajo con IA documentado. Pendientes manuales del lanzamiento en la Fase 6 de `docs/ROADMAP.md`.
`legacy/index.html` es la versión anterior (HTML + Tailwind por CDN); sirve
solo de referencia de contenido y estética (paleta oscura slate + sky). El
progreso está en `docs/ROADMAP.md`.

## Stack

Astro 7 + islas React 19 + TypeScript 6 (`astro/tsconfigs/strictest`) +
Tailwind CSS 4, salida estática, deploy en Netlify. Tests con Vitest 5
(unitarios) y Playwright (e2e, desktop + mobile). Alias de imports: `@/` →
`src/`. Ver justificación en `docs/ARQUITECTURA.md`.

Notas de versiones:

- TypeScript queda en `~6.0`: `typescript-eslint` y `@astrojs/check` todavía
  no soportan TS 7.
- Para a11y en JSX se usa `eslint-plugin-jsx-a11y-x` (el fork compatible con
  ESLint 10), no `eslint-plugin-jsx-a11y`.

## Comandos

```bash
npm run dev        # servidor de desarrollo (http://localhost:4321)
npm run build      # build estático en /dist
npm run preview    # sirve /dist
npm run check      # astro check (tipos + .astro)
npm run lint       # eslint
npm run format     # prettier --write
npm test           # vitest run
npx vitest run <ruta>   # un solo archivo
npm run e2e        # playwright (desktop + mobile)
npm run og         # regenera las imágenes OG (public/og/<idioma>/...)
npm run cv         # regenera los CV en PDF (public/cv/) desde el contenido del sitio
```

Antes de dar una tarea por terminada, ejecutá la skill `/verificar`.

## Cómo trabajar

| Pedido                                  | Flujo                                                |
| --------------------------------------- | ---------------------------------------------------- |
| Funcionalidad, demo o página nueva      | `/spec` → aprobación de Patricio → `/implementar`    |
| Demo nueva (con spec aprobada)          | `/nueva-demo <slug>` y después `/implementar`        |
| Caso de estudio                         | `/nuevo-caso <slug>`                                 |
| Experiencia laboral nueva o actualizada | `/nueva-experiencia` (entrevista o borrador)         |
| Arreglo chico o ajuste de texto         | directo, con test si toca `src/lib/`, y `/verificar` |
| Commit                                  | `/commit`, solo cuando Patricio lo pida              |

- Revisores (subagentes de solo lectura): `revisor-codigo` para el diff y
  `revisor-contenido` para el texto visible. Usalos antes de cerrar una tarea.
- Reglas por carpeta en `.claude/rules/` (se cargan solas al tocar
  `src/lib/`, `src/islands/`, contenido o `e2e/`).
- Hooks en `.claude/settings.json`: Prettier corre solo después de cada
  edición; editar `dist/`, `legacy/`, `.astro/`, `package-lock.json` o `.env`
  está bloqueado, igual que escribir términos de
  `docs/privado/terminos-sensibles.txt`. Si un hook bloquea, corregí la causa;
  no lo esquives.
- Una decisión técnica con alternativas reales se registra como ADR.
- Si cambiás algo de `.claude/` (skills, agentes, reglas, hooks, permisos),
  actualizá el capítulo correspondiente de `docs/guia-ia/` para que la guía
  siga describiendo el repo real.

## Fuente de verdad del contenido

Todo texto del sitio sale de `docs/contenido/` y `docs/casos/`. **No inventes
datos, fechas, clientes, métricas ni tecnologías.** Si algo falta o es
ambiguo, preguntá o dejalo marcado con `TODO(contenido)`.

- Las métricas están etiquetadas como **real** o **ilustrativa**. Una métrica
  ilustrativa solo puede aparecer junto a la demo o el ejemplo que la produce,
  nunca como logro profesional.
- Los clientes de los casos **siempre son anónimos** ("prepaga líder a nivel
  nacional", "call center de nivel internacional", "empresa de premoldeados
  para la construcción"). Nunca nombres de empresas cliente en el sitio.
- Del trabajo actual en Quadion (cliente: prepaga) no se publican nombres de
  servicios, endpoints, repositorios ni el nombre interno de la librería
  compartida. No usar como fuente el `CLAUDE.md` de `C:\Users\ppolito\Desktop`.

### Datos que nunca se publican

- Referencias laborales y sus teléfonos/emails.
- Credenciales de sistemas (ej. usuario/contraseña de demo del Ministerio).
- Fecha de nacimiento, Skype.
- Cualquier cosa dentro de `docs/privado/` (está en `.gitignore`; es material
  personal de preparación de entrevistas).

## Convenciones

- Idioma: español rioplatense profesional (voseo moderado) por defecto; versión
  en inglés bajo `/en`. Toda clave nueva de UI va en ambos diccionarios.
- Prettier: comillas simples, sin punto y coma, sin trailing commas, 80
  columnas, `prettier-plugin-tailwindcss` + `prettier-plugin-astro`.
- Sin `any`. Lógica de negocio (optimizador, formularios) en TS puro bajo
  `src/lib/`, sin dependencias de UI, con tests.
- Componentes Astro por defecto; React solo para islas interactivas.
- Accesibilidad: HTML semántico, foco visible, contraste AA, `prefers-reduced-motion`.
- Commits: Conventional Commits (`feat`, `fix`, `docs`, `chore`, `refactor`,
  `test`, `style`, `perf`, `ci`). Solo commitear cuando el usuario lo pida.
