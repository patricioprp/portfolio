# 001 · Demo: Optimizador de cortes de viguetas

- **Estado:** Implementada
- **Roadmap:** Fase 4
- **Relacionado:** caso `docs/casos/optimizador-viguetas.md`,
  [ADR 0003](../adr/0003-highs-en-web-worker.md), `src/lib/optimizador/README.md`

## Problema

El caso del optimizador describe un modelo matemático que un tech lead no
puede comprobar leyendo. Una demo ejecutable demuestra el criterio técnico.

## Objetivo

El visitante edita medidas, demanda y costos, presiona "Optimizar" y ve, en
el navegador y sin backend, el plan óptimo y el ahorro frente a la práctica
anterior.

## Alcance

- Generación de patrones de corte maximales por diámetro, en centímetros enteros.
- Modelo de programación lineal entera resuelto con HiGHS en un Web Worker.
- Heurística "orden de llegada" para comparar el ahorro.
- KPIs, bancos dibujados en SVG, producción y recortes.
- Estados de carga, validación, infactible y error, anunciados con `aria-live`.

### Fuera de alcance

- Calendario de producción por turnos, generación de columnas y carga por CSV
  (en "Ideas para después").

## Diseño

- **Lógica:** `src/lib/optimizador/` (dominio, patrones, modelo, solver,
  heurística, reporte, validación). El solver está detrás de la interfaz
  `Solver`.
- **Reglas del dominio:** fila de 3300 cm; un banco = 3 filas del mismo
  diámetro; una vigueta admite acero igual o más grueso que su mínimo;
  3 bancos por jornada.
- **UI:** `src/islands/optimizador/`; tarjetas en mobile en lugar de tabla.
- **Rendimiento:** el `.wasm` (~1,2 MB gz) se descarga solo al optimizar.
- **Seguridad:** CSP con `'wasm-unsafe-eval'` y `worker-src 'self' blob:`.

## Criterios de aceptación

| #   | Criterio                                                                      | Test                                               |
| --- | ----------------------------------------------------------------------------- | -------------------------------------------------- |
| 1   | El ejemplo genera 200 patrones maximales: 8 finos, 75 medios, 117 gruesos     | `src/lib/optimizador/optimizador.test.ts`          |
| 2   | Los patrones respetan el diámetro mínimo y el largo de la fila                | `src/lib/optimizador/optimizador.test.ts`          |
| 3   | El plan óptimo del ejemplo cuesta 103,5 en 8 jornadas y cubre toda la demanda | `src/lib/optimizador/optimizador.test.ts`          |
| 4   | El costo óptimo es ≥ al mínimo teórico (≈ 99,2)                               | `src/lib/optimizador/optimizador.test.ts`          |
| 5   | Sin acero válido para una medida, el resultado es "infactible"                | `src/lib/optimizador/optimizador.test.ts`          |
| 6   | La heurística cuesta más que el óptimo y es reproducible con la misma semilla | `src/lib/optimizador/optimizador.test.ts`          |
| 7   | Las entradas inválidas muestran errores sin llamar al solver                  | `e2e/demo-optimizador.spec.ts`                     |
| 8   | El ejemplo se resuelve en el navegador (ES y EN) y se puede restaurar         | `e2e/demo-optimizador.spec.ts`, `e2e/i18n.spec.ts` |
| 9   | Los resultados pasan axe en tema claro y oscuro                               | `e2e/accesibilidad.spec.ts`                        |
