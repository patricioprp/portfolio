# 0001 · Astro estático con islas React

- **Estado:** Aceptado

## Contexto

La versión anterior (`legacy/index.html`) era un HTML con Tailwind y Font
Awesome por CDN: lenta, sin menú móvil y difícil de mantener. El portfolio
necesita SEO, carga rápida en celulares, contenido en dos idiomas y, a la vez,
demos interactivas que muestren cómo trabaja Patricio en React.

## Decisión

Astro 7 con salida estática y **islas** de React 19 solo donde hay
interactividad (las demos). Contenido en content collections validadas con
zod. Deploy estático en Netlify.

## Alternativas consideradas

- **Next.js:** también es React, pero para un sitio de contenido manda más
  JavaScript al cliente por defecto y agrega complejidad de servidor que no
  se necesita.
- **SPA con Vite + React:** peor SEO y primera carga más pesada.
- **Seguir con HTML plano:** sin componentes, sin i18n, sin tests.

## Consecuencias

- La home sale como HTML puro (sin runtime de React) y cumple el presupuesto
  de JS.
- Las demos cargan React solo en su propia página.
- Hay que distinguir componentes `.astro` (estáticos) de islas (`src/islands/`).
