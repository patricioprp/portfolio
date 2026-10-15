# 0002 · Menú móvil y tema con scripts de Astro, sin React

- **Estado:** Aceptado

## Contexto

El menú móvil y el selector de tema están en todas las páginas, incluida la
home, que tiene un presupuesto de 50 KB de JavaScript.

## Decisión

Implementarlos con scripts de Astro en JavaScript vanilla (< 2 KB).

## Alternativas consideradas

- **Islas React:** el runtime de React (~60 KB gzip) solo para un menú rompía
  el presupuesto de la home.

## Consecuencias

- La home no hidrata React.
- La accesibilidad del menú (foco, Escape, `aria-expanded`) se programa a mano
  y la cubren los tests e2e (`e2e/home.spec.ts`).
