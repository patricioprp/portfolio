# Portfolio — Patricio Rolando Polito

Portfolio profesional de Patricio Rolando Polito, Frontend Senior e
Ingeniero en Sistemas. Incluye casos de estudio con impacto medible y demos
ejecutables: un optimizador de cortes con programación lineal entera y un
motor de formularios dinámicos.

- **Estado:** Fases 1 a 5 terminadas: home, casos de estudio y las dos demos en español. La versión anterior está en `legacy/index.html`.
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

## Trabajar con Claude Code

```bash
claude
> Ejecutá la Fase 1 de docs/ROADMAP.md
```

- `/verificar`: formato, lint, tipos, tests y build.
- `/nuevo-caso <slug>`: crea o migra un caso de estudio.
- Agente `revisor-contenido`: revisa exactitud, privacidad y tono del texto.
