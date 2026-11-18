# Portfolio — Patricio Rolando Polito

Portfolio profesional de Patricio Rolando Polito, Frontend Senior e
Ingeniero en Sistemas. Incluye casos de estudio con impacto medible y demos
ejecutables: un mapa de beneficios, un simulador de contingencias, un optimizador de cortes con
programación lineal entera y un motor de formularios dinámicos.

- **Estado:** Sitio completo en español e inglés: home, cinco casos de estudio, cuatro demos ejecutables y la guía "Hacé tu portfolio con IA — Claude Code" en `/guia/`. La versión anterior está en `legacy/index.html`.
- **Stack:** Astro 7 + React 19 + TypeScript + Tailwind CSS 4, deploy en Netlify.

## Desarrollo

Requiere Node 24 (`.nvmrc`).

```bash
npm install
npm run dev        # http://localhost:4321
npm run build && npm run preview
npm test           # Vitest
npm run e2e        # Playwright (la primera vez: npx playwright install chromium)
```

## Documentación

| Archivo                                        | Contenido                                              |
| ---------------------------------------------- | ------------------------------------------------------ |
| [`CLAUDE.md`](CLAUDE.md)                       | Guía para Claude Code: reglas, comandos y convenciones |
| [`docs/PRODUCTO.md`](docs/PRODUCTO.md)         | Estrategia, públicos, estructura del sitio y mejoras   |
| [`docs/ARQUITECTURA.md`](docs/ARQUITECTURA.md) | Stack, carpetas y diseño de las demos                  |
| [`docs/ROADMAP.md`](docs/ROADMAP.md)           | Plan por fases                                         |
| [`docs/contenido/`](docs/contenido/)           | Perfil y experiencia (fuente de verdad)                |
| [`docs/casos/`](docs/casos/)                   | Casos de estudio                                       |
| [`docs/specs/`](docs/specs/)                   | Specs: alcance y criterios de aceptación → tests       |
| [`docs/adr/`](docs/adr/)                       | Decisiones de arquitectura y alternativas descartadas  |
| [`docs/guia-ia/`](docs/guia-ia/README.md)      | Guía "Hacé tu portfolio con IA" (fuente de `/guia/`)   |

## Trabajar con Claude Code

El proyecto está preparado para desarrollarse con
[Claude Code](https://claude.com/claude-code) con un flujo guiado por specs.
El detalle de cada pieza está en
[`docs/guia-ia/`](docs/guia-ia/README.md), una guía en 17 capítulos con diagramas (fundamentos, paso a paso y referencia) que también se publica en el sitio.

```text
/spec <idea>          → docs/specs/NNN-slug.md (borrador para aprobar)
/implementar <spec>   → exploración en paralelo, TDD, /verificar, revisores y roadmap
/nueva-demo <slug>    → esqueleto de una demo nueva
/nuevo-caso <slug>    → caso de estudio ES (y EN con el traductor)
/nueva-experiencia    → entrevista y alta de una experiencia laboral
/verificar            → formato, lint, tipos, tests, build y e2e
/commit               → mensaje Conventional Commits a partir del diff
```

- Subagentes: `revisor-codigo` (diff) y `revisor-contenido` (texto), de solo lectura, y `traductor` (ES → EN). La sesión principal los orquesta: explora en paralelo, delega lo independiente y consolida las revisiones ([ADR 0007](docs/adr/0007-orquestacion-de-agentes.md)).
- Reglas por carpeta en `.claude/rules/`; hooks de formato y protección en `.claude/settings.json`.
- CI en `.github/workflows/ci.yml` con las mismas verificaciones.
