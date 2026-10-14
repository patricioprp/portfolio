import {
  DIAMETROS,
  type Diametro,
  type Parametros,
  type TipoVigueta
} from './domain'

/** PRNG determinístico (mulberry32) para que la simulación sea reproducible. */
function crearAleatorio(semilla: number): () => number {
  let a = semilla >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function mezclar<T>(items: T[], aleatorio: () => number): T[] {
  const copia = [...items]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1))
    const a = copia[i] as T
    copia[i] = copia[j] as T
    copia[j] = a
  }
  return copia
}

/**
 * Costo de la práctica anterior para un orden de llegada dado: las filas se
 * llenan en ese orden (si una pieza no entra, se empieza otra fila) y cada
 * banco toma el acero de la vigueta más exigente de sus filas.
 */
export function costoOrdenDeLlegada(
  piezas: readonly TipoVigueta[],
  parametros: Parametros
): number {
  const filas: Diametro[] = []
  let restante = 0
  let diametroFila: Diametro | undefined

  for (const pieza of piezas) {
    if (diametroFila === undefined || pieza.largoCm > restante) {
      if (diametroFila !== undefined) filas.push(diametroFila)
      restante = parametros.largoFilaCm
      diametroFila = pieza.diametroMin
    }
    restante -= pieza.largoCm
    if (
      DIAMETROS.indexOf(pieza.diametroMin) > DIAMETROS.indexOf(diametroFila)
    ) {
      diametroFila = pieza.diametroMin
    }
  }
  if (diametroFila !== undefined) filas.push(diametroFila)

  let costo = 0
  for (let i = 0; i < filas.length; i += parametros.filasPorBanco) {
    const banco = filas.slice(i, i + parametros.filasPorBanco)
    const diametro = banco.reduce((max, d) =>
      DIAMETROS.indexOf(d) > DIAMETROS.indexOf(max) ? d : max
    )
    // Un banco produce siempre todas sus filas, aunque la última quede vacía.
    costo += parametros.costoPorFila[diametro] * parametros.filasPorBanco
  }
  return costo
}

export interface ResultadoHeuristica {
  costoPromedio: number
  simulaciones: number
}

/** Promedia el costo sobre órdenes de llegada aleatorios. */
export function simularOrdenDeLlegada(
  tipos: readonly TipoVigueta[],
  parametros: Parametros,
  { simulaciones = 200, semilla = 42 } = {}
): ResultadoHeuristica {
  const piezas = tipos.flatMap((t) =>
    Array.from({ length: t.demanda }, () => t)
  )
  const aleatorio = crearAleatorio(semilla)
  let total = 0
  for (let i = 0; i < simulaciones; i++) {
    total += costoOrdenDeLlegada(mezclar(piezas, aleatorio), parametros)
  }
  return { costoPromedio: total / simulaciones, simulaciones }
}
