---
paths:
  - 'src/lib/**'
---

# Reglas para `src/lib/` (lógica de negocio)

- TypeScript puro: **sin** imports de React, Astro, `window` ni `document`.
  Si algo necesita el navegador (Worker, WASM), queda en un adaptador detrás
  de una interfaz (ver `Solver` en `src/lib/optimizador/solver/tipos.ts`).
- Funciones puras siempre que se pueda: entrada → salida, sin estado global.
  Las fechas se reciben por parámetro (`ahora: Date`), no con `new Date()`
  adentro, para que los tests sean deterministas.
- Test al lado del código: `<modulo>.test.ts`. Primero el test que falla,
  después la implementación (TDD). Los nombres de los tests describen la regla
  de negocio en español ("un ítem crítico que falla lleva el puntaje a 0").
- Validá la entrada del usuario con zod o con una función `validar*` que
  devuelva errores tipados (unión discriminada), nunca con excepciones sueltas.
- Cada módulo de demo tiene un `README.md` con módulos, reglas y decisiones.
  Si cambiás una regla, actualizá el README y la spec en `docs/specs/`.
- Ejecutá `npx vitest run src/lib/<modulo>` antes de dar el cambio por bueno.
