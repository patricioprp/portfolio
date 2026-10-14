// Tipos del dominio del optimizador de cortes de viguetas.
// Todas las longitudes se trabajan en centímetros enteros para evitar errores
// de redondeo.

export const DIAMETROS = ['fino', 'medio', 'grueso'] as const
export type Diametro = (typeof DIAMETROS)[number]

/** Una vigueta puede llevar un acero igual o más grueso que su mínimo. */
export function admite(diametro: Diametro, minimo: Diametro): boolean {
  return DIAMETROS.indexOf(diametro) >= DIAMETROS.indexOf(minimo)
}

export interface TipoVigueta {
  id: string
  largoCm: number
  diametroMin: Diametro
  demanda: number
}

export interface Parametros {
  largoFilaCm: number
  filasPorBanco: number
  bancosPorJornada: number
  /** Costo relativo del acero de una fila completa, por diámetro. */
  costoPorFila: Record<Diametro, number>
}

export interface Patron {
  id: string
  diametro: Diametro
  /** Cantidad de piezas por id de vigueta. */
  piezas: Record<string, number>
  recorteCm: number
}

export interface FilaPlan {
  patron: Patron
  cantidad: number
}

export interface Plan {
  bancos: Record<Diametro, number>
  jornadas: number
  filas: FilaPlan[]
  costo: number
}

/** Datos ilustrativos del caso (docs/casos/optimizador-viguetas.md). */
export const EJEMPLO_TIPOS: TipoVigueta[] = [
  { id: 'V10', largoCm: 1000, diametroMin: 'grueso', demanda: 45 },
  { id: 'V7', largoCm: 700, diametroMin: 'medio', demanda: 60 },
  { id: 'V5', largoCm: 500, diametroMin: 'medio', demanda: 90 },
  { id: 'V4.4', largoCm: 440, diametroMin: 'fino', demanda: 120 },
  { id: 'V3', largoCm: 300, diametroMin: 'fino', demanda: 150 }
]

export const EJEMPLO_PARAMETROS: Parametros = {
  largoFilaCm: 3300,
  filasPorBanco: 3,
  bancosPorJornada: 3,
  costoPorFila: { fino: 1, medio: 1.5, grueso: 2.2 }
}
