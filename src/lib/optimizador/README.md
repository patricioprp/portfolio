# Optimizador de cortes de viguetas

Reimplementación en TypeScript, para el portfolio, de un optimizador que
desarrollé originalmente en PHP para una planta de premoldeados. Planifica la
producción de viguetas minimizando el acero: un problema de corte (cutting
stock) formulado como programación lineal entera.

Demo: `/demos/optimizador-viguetas/` · Caso: `/casos/optimizador-viguetas/`

## El problema

- Cada banco de producción hace siempre 3 filas de 33 m con el mismo diámetro
  de acero, y en cada jornada se producen 3 bancos.
- Cada medida de vigueta tiene un diámetro mínimo: puede llevar un acero igual o
  más grueso, nunca más fino.
- Objetivo: cubrir la demanda de cada medida con el menor costo de acero.

## Módulos

| Archivo         | Responsabilidad                                                             |
| --------------- | --------------------------------------------------------------------------- |
| `domain.ts`     | Tipos (`TipoVigueta`, `Parametros`, `Patron`, `Plan`) y datos del ejemplo   |
| `patrones.ts`   | Genera los patrones de corte maximales por diámetro (recursivo, en cm)      |
| `modelo.ts`     | Arma el modelo LP en formato CPLEX: variables por patrón, bancos y jornadas |
| `solver/`       | Interfaz `Solver` y adaptador de [HiGHS](https://highs.dev) (WebAssembly)   |
| `optimizar.ts`  | Patrones → modelo → solver → `Plan`                                         |
| `heuristica.ts` | Simula la práctica anterior (orden de llegada) para medir el ahorro         |
| `reporte.ts`    | KPIs: costo, mínimo teórico, ahorro, producción, recortes; agrupa bancos    |
| `validacion.ts` | Valida la entrada del usuario antes de resolver                             |
| `ejecutar.ts`   | Flujo completo que usa el Worker                                            |
| `worker.ts`     | Web Worker: carga HiGHS bajo demanda y resuelve fuera del hilo principal    |

La lógica no depende de la UI ni del navegador: los tests corren en Node con el
mismo código.

## Modelo

- `x_j` = filas cortadas con el patrón `j` (entera ≥ 0)
- `b_d` = bancos producidos con el diámetro `d` (entera ≥ 0)
- `J` = jornadas (entera)
- Minimizar `Σ_d costoFila_d · 3 · b_d`
- Demanda: `Σ_j a_ij · x_j ≥ D_i` para cada medida `i`
- Bancos: `Σ_{j de d} x_j = 3 · b_d` para cada diámetro
- Jornadas: `Σ_d b_d = 3 · J`

## Decisiones

- **HiGHS en lugar de javascript-lp-solver.** El plan original era
  `javascript-lp-solver` (JS puro), pero con 200 variables enteras no terminaba
  en 5 minutos. HiGHS resuelve el ejemplo en menos de 1 segundo. Como el solver
  está detrás de la interfaz `Solver`, cambiarlo no tocó el resto del código.
- **Web Worker.** El `.wasm` de HiGHS pesa unos 1,2 MB comprimido: se descarga
  solo en la página de la demo y solo al presionar "Optimizar".
- **Centímetros enteros** para evitar errores de redondeo con largos como 4,40 m.
- **Heurística de comparación.** Las viguetas llegan de a una, en orden
  aleatorio; las filas se llenan en ese orden y cada banco toma el acero de su
  vigueta más exigente. Se promedian 200 órdenes con semilla fija, así el
  resultado es reproducible.

## Resultado con el ejemplo (ilustrativo)

Costo 103,5 en 24 bancos (5 gruesos, 9 medios, 10 finos) y 8 jornadas: 4 % sobre
el mínimo teórico (99,2) y alrededor de 37 % menos acero que la heurística de
orden de llegada (≈ 164). Puede haber óptimos alternativos con el mismo costo.

## Tests

```bash
npx vitest run src/lib/optimizador
```

Verifican los 200 patrones del ejemplo (8 finos, 75 medios, 117 gruesos), el
costo óptimo 103,5, la cobertura de la demanda, la infactibilidad, la
heurística y la validación de la entrada.
