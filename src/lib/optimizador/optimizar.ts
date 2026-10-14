import {
  DIAMETROS,
  type Diametro,
  type FilaPlan,
  type Parametros,
  type Plan,
  type TipoVigueta
} from './domain'
import { construirModelo } from './modelo'
import { generarTodosLosPatrones } from './patrones'
import type { Solver } from './solver/tipos'

export type ResultadoOptimizacion =
  | { tipo: 'ok'; plan: Plan; cantidadPatrones: number }
  | { tipo: 'infactible' }
  | { tipo: 'error'; detalle: string }

export async function optimizar(
  tipos: readonly TipoVigueta[],
  parametros: Parametros,
  solver: Solver
): Promise<ResultadoOptimizacion> {
  const patrones = generarTodosLosPatrones(tipos, parametros.largoFilaCm)
  const modelo = construirModelo(tipos, patrones, parametros)
  const solucion = await solver.resolver(modelo)

  if (solucion.estado === 'infactible') return { tipo: 'infactible' }
  if (solucion.estado === 'error') {
    return { tipo: 'error', detalle: solucion.detalle ?? 'desconocido' }
  }

  const filas: FilaPlan[] = []
  for (const [variable, patron] of modelo.patronPorVariable) {
    const cantidad = solucion.valores[variable] ?? 0
    if (cantidad > 0) filas.push({ patron, cantidad })
  }

  const bancos = Object.fromEntries(
    DIAMETROS.map((d) => [d, solucion.valores[modelo.variableBanco[d]] ?? 0])
  ) as Record<Diametro, number>

  return {
    tipo: 'ok',
    cantidadPatrones: patrones.length,
    plan: {
      bancos,
      jornadas: solucion.valores[modelo.variableJornadas] ?? 0,
      filas,
      costo: Number(solucion.objetivo.toFixed(6))
    }
  }
}
