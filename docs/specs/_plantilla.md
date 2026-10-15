# NNN · Título

- **Estado:** Borrador | Aprobada | Implementada
- **Roadmap:** Fase N de `docs/ROADMAP.md`
- **Relacionado:** caso `docs/casos/<slug>.md`, ADR `docs/adr/NNNN-...`

## Problema

Qué le falta hoy al portfolio y a quién afecta (recruiter, tech lead). Una o
dos oraciones; enlazá `docs/PRODUCTO.md` si aplica.

## Objetivo

Qué tiene que poder hacer el visitante cuando esto esté terminado.

## Alcance

- Lo que se construye, en viñetas concretas.

### Fuera de alcance

- Lo que explícitamente **no** se hace ahora (va a "Ideas para después" del roadmap).

## Diseño

- **Lógica (`src/lib/<modulo>/`):** tipos, funciones públicas y reglas.
- **UI:** isla o componente Astro, estados (vacío, cargando, error, éxito),
  comportamiento en mobile.
- **Textos e i18n:** claves nuevas en `src/i18n/{es,en}.ts`.
- **Rutas:** ES y EN.
- **Rendimiento / seguridad:** JS que se carga, CSP, datos.

## Criterios de aceptación

| #   | Criterio (verificable)                          | Test                         |
| --- | ----------------------------------------------- | ---------------------------- |
| 1   | Dado …, cuando …, entonces …                    | `src/lib/<modulo>/x.test.ts` |
| 2   | La página pasa axe (WCAG 2.2 AA) en ambos temas | `e2e/accesibilidad.spec.ts`  |

## Preguntas abiertas

- `TODO(contenido)`: datos que tiene que confirmar Patricio.
