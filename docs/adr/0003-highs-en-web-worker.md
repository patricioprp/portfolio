# 0003 · HiGHS (WebAssembly) en un Web Worker

- **Estado:** Aceptado

## Contexto

La demo del optimizador resuelve un modelo de programación lineal entera con
200 variables enteras en el navegador, sin backend (el deploy es estático y
gratuito).

## Decisión

Usar el solver **HiGHS** compilado a WebAssembly (paquete `highs`), detrás de
la interfaz `Solver`, ejecutado en un **Web Worker** y cargado solo al
presionar "Optimizar".

## Alternativas consideradas

- **javascript-lp-solver (JS puro):** era el plan original; con 200 variables
  enteras no terminaba en 5 minutos. HiGHS resuelve el ejemplo en menos de
  1 segundo.
- **Backend propio:** costo y mantenimiento de un servidor para una demo.

## Consecuencias

- El `.wasm` pesa ~1,2 MB gzip, pero solo se descarga en la demo.
- La UI no se bloquea mientras resuelve.
- La CSP necesita `'wasm-unsafe-eval'` y `worker-src 'self' blob:` en
  `netlify.toml`.
- Gracias a la interfaz `Solver`, cambiar de solver no tocó el resto del código.
