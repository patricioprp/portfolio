# Caso: Optimización del acero en la producción de viguetas

- **Autor:** Patricio Rolando Polito (trabajo de principio a fin)
- **Slug:** `optimizador-viguetas`
- **Empresa:** la misma del caso `acopio-planta`
- **Técnica:** problema de corte (cutting stock), programación lineal entera
- **Implementación original:** PHP vanilla (confirmado por Patricio). La demo del portfolio es una reimplementación en TypeScript.
- **Demo asociada:** `/demos/optimizador-viguetas` (reimplementación para el portfolio)

## En 30 segundos

| El problema                                                                                                                   | Lo que hice                                                                                                                             | El impacto                                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Las viguetas cortas salían con el acero de las largas ("superviguetas") y sobraban recortes: desperdicio del insumo más caro. | Lo modelé como un problema de corte con programación lineal entera e implementé el algoritmo que generaba el plan de producción óptimo. | La planificación dejó de depender de la intuición: cada vigueta se produce con el acero de su medida y bajó el consumo de acero. |

## Contexto

Cada vigueta lleva acero en su interior, y su diámetro depende del largo:
cuanto más larga, más grueso. La planta tenía **3 bancos de producción**; cada
banco producía siempre **3 filas de 33 m a la vez** (9 filas por jornada), que
después se cortaban en las medidas de la demanda: unas cinco medidas distintas,
la más larga de unos 10 m.

## El problema

Cuando en un mismo banco se producían viguetas largas y cortas, las cortas
salían con el acero de las largas: mucho más resistentes de lo necesario, un
exceso del insumo más caro. A eso se sumaban los recortes sobrantes.

## Lo que hice

Identifiqué que era un problema de corte (visto en Investigación Operativa) y lo
formulé como un modelo de programación lineal entera: **minimizar el acero
utilizado con la restricción de satisfacer la demanda de cada medida**. Después
implementé el algoritmo que resolvía el modelo y generaba la planificación
óptima: cuántos bancos producir con cada diámetro y cómo cortar cada fila.

## Resultados

- **Real (cualitativo):** cada vigueta se produce con el acero que corresponde a su medida; bajó el consumo del insumo más costoso de la línea; la planificación dejó de depender de la intuición.
- **Ilustrativo (ejemplo de la demo, no medido en la empresa):** con los datos de abajo, el plan óptimo usa ~37 % menos acero que llenar los bancos por orden de llegada (valor que calcula la demo; ver la actualización en el anexo). Solo se puede mostrar junto a la demo, aclarando que es un ejemplo.

Diagrama "antes/después" (figura 2): antes, una fila mezclada con acero grueso
(las de 3,00 m salen con el acero de la de 10,00 m). Después, cada banco con su
diámetro:

- Banco grueso: 3 × 10,00 + 1 × 3,00 (aprovecha el sobrante)
- Banco medio: 4 × 7,00 + 1 × 5,00 (sin recorte)
- Banco fino: 6 × 4,40 + 2 × 3,00

---

## Anexo técnico (especificación de la demo y de los tests)

Los números son ilustrativos, basados en largos comerciales habituales de
viguetas pretensadas en Argentina, extendidos hasta 10 m.

### Datos del ejemplo

| Vigueta | Largo   | Acero mínimo | Demanda |
| ------- | ------- | ------------ | ------- |
| V10     | 10,00 m | Grueso       | 45      |
| V7      | 7,00 m  | Medio        | 60      |
| V5      | 5,00 m  | Medio        | 90      |
| V4.4    | 4,40 m  | Fino         | 120     |
| V3      | 3,00 m  | Fino         | 150     |

- Fila: 33 m. Banco: 3 filas con el mismo diámetro; no se puede producir una fila sola.
- Costo relativo del acero **por fila**: fino 1,0 · medio 1,5 · grueso 2,2 (por banco: 3,0 · 4,5 · 6,6).
- Una vigueta puede llevar acero igual o más grueso que el que necesita, nunca más fino.

### Modelo

Paso 1: generar los patrones. Para cada diámetro se enumeran las
combinaciones de piezas compatibles que entran en 33 m y se conservan las
**maximales** (no admiten otra pieza). Resultado esperado: **200 patrones (8
finos, 75 medios, 117 gruesos)**.

Paso 2: plantear el modelo.

- Variables: `x_j` = filas cortadas con el patrón j (entero ≥ 0); `y_d` = bancos con diámetro d (entero ≥ 0).
- Objetivo: minimizar `Σ_d costoBanco_d · y_d`.
- Demanda: `Σ_j a_ij · x_j ≥ D_i` para cada medida i.
- Bancos: `Σ_{j con diámetro d} x_j = 3 · y_d` para cada diámetro.
- Jornadas: `Σ_d y_d = 3 · J`, con J entero.

Paso 3: lo que el modelo descubre solo. Una única función objetivo penaliza
los dos desperdicios a la vez (acero sobredimensionado y recortes, porque se
paga la fila entera). Pero distingue cuándo una vigueta sobredimensionada
aprovecha un sobrante: 3 × 10,00 + 1 × 3,00 cuesta lo mismo que 3 × 10,00 y
entrega una vigueta más.

### Resultado de referencia

| Acero  | Patrón por fila (33 m) | Filas | Recorte |
| ------ | ---------------------- | ----- | ------- |
| Grueso | 3 × 10,00 + 1 × 3,00   | 15    | 0,00 m  |
| Medio  | 4 × 7,00 + 1 × 5,00    | 12    | 0,00 m  |
| Medio  | 1 × 7,00 + 5 × 5,00    | 12    | 1,00 m  |
| Medio  | 6 × 5,00 + 1 × 3,00    | 3     | 0,00 m  |
| Fino   | 6 × 4,40 + 2 × 3,00    | 15    | 0,60 m  |
| Fino   | 2 × 4,40 + 8 × 3,00    | 15    | 0,20 m  |

- 24 bancos (5 gruesos, 9 medios, 10 finos) = 8 jornadas.
- Cubre exactamente la demanda, salvo 18 viguetas de 3,00 m que van a stock.
- **Costo 103,5**; mínimo teórico 99,2 (cada pieza con su acero justo y sin recortes) → +4 %.
- Heurística "orden de llegada" (cada banco toma el acero de su vigueta más larga): costo promedio 157,0 → el óptimo usa ~34 % menos acero.
- **Actualización (demo, Fase 4):** la demo simula viguetas que llegan de a una en orden aleatorio (200 órdenes, semilla fija) y obtiene un costo promedio ≈ 164 → **~37 % de ahorro**. El 157,0 original venía de supuestos no documentados; el sitio usa el valor de la demo para que caso y demo coincidan.

Puede haber óptimos alternativos con el mismo costo: los tests verifican
cobertura de la demanda y costo ≤ 103,5, no el plan exacto.

### Cómo lo resuelve el solver

Branch and bound sobre la relajación lineal (símplex): si una variable da 7,4,
se ramifica en x ≤ 7 y x ≥ 8 y se podan las ramas que no pueden mejorar la mejor
solución. El trabajo propio es generar los patrones y armar el modelo; con este
tamaño el solver responde en milisegundos.

### Piezas de código de referencia

Generador de patrones (trabajar en centímetros):

```js
function generarPatrones(tipos, L, diametro) {
  const aptos = tipos.filter((t) => t.diametroMin <= diametro)
  const minLargo = Math.min(...aptos.map((t) => t.largo))
  const patrones = []
  function rec(i, restante, actual) {
    if (i === aptos.length) {
      if (restante < minLargo && Object.values(actual).some((n) => n > 0))
        patrones.push({ diametro, piezas: { ...actual }, recorte: restante })
      return
    }
    const t = aptos[i]
    for (let n = Math.floor(restante / t.largo); n >= 0; n--) {
      actual[t.id] = n
      rec(i + 1, restante - n * t.largo, actual)
    }
    delete actual[t.id]
  }
  rec(0, L, {})
  return patrones
}
```

> **Decisión final:** la demo usa HiGHS (WebAssembly). javascript-lp-solver no terminó en 5 minutos con 200 variables enteras; el modelo de abajo queda como referencia del formato.

Modelo para `javascript-lp-solver` (cada banco "consume" 3 filas de su diámetro):

```js
const modelo = {
  optimize: 'costo',
  opType: 'min',
  constraints: {
    V10: { min: 45 },
    V7: { min: 60 },
    V5: { min: 90 },
    'V4.4': { min: 120 },
    V3: { min: 150 },
    filas_G: { equal: 0 },
    filas_M: { equal: 0 },
    filas_F: { equal: 0 }
  },
  variables: {
    G_10x3_3x1: { V10: 3, V3: 1, filas_G: 1 },
    M_7x4_5x1: { V7: 4, V5: 1, filas_M: 1 },
    F_44x6_3x2: { 'V4.4': 6, V3: 2, filas_F: 1 },
    // ... una variable por patrón generado
    banco_G: { costo: 6.6, filas_G: -3 },
    banco_M: { costo: 4.5, filas_M: -3 },
    banco_F: { costo: 3.0, filas_F: -3 }
  },
  ints: {} // todas las variables
}
```

Falta modelar la restricción de jornadas (`Σ y_d = 3·J`): agregar una variable
entera `jornadas` con `{ bancos_total: -3 }` y sumar `bancos_total: 1` en cada `banco_*`.
