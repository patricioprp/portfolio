import type { ModeloLP } from '../modelo'

export type EstadoSolucion = 'optimo' | 'infactible' | 'error'

export interface SolucionLP {
  estado: EstadoSolucion
  objetivo: number
  valores: Record<string, number>
  detalle?: string
}

/** Interfaz común para poder cambiar de solver sin tocar el resto. */
export interface Solver {
  resolver(modelo: ModeloLP): Promise<SolucionLP>
}
