import type { Parametros, TipoVigueta } from './domain'
import { simularOrdenDeLlegada } from './heuristica'
import { optimizar } from './optimizar'
import {
  agruparBancos,
  generarReporte,
  type GrupoBancos,
  type Reporte
} from './reporte'
import type { Solver } from './solver/tipos'
import { validarEntrada, type ErrorEntrada } from './validacion'

export interface PedidoOptimizacion {
  tipos: TipoVigueta[]
  parametros: Parametros
}

export type RespuestaOptimizacion =
  | {
      tipo: 'ok'
      reporte: Reporte
      grupos: GrupoBancos[]
      cantidadPatrones: number
      milisegundos: number
    }
  | { tipo: 'invalido'; errores: ErrorEntrada[] }
  | { tipo: 'infactible' }
  | { tipo: 'error'; detalle: string }

/** Flujo completo: validar → optimizar → comparar con la heurística → reporte. */
export async function ejecutarOptimizacion(
  { tipos, parametros }: PedidoOptimizacion,
  solver: Solver,
  ahora: () => number = () => performance.now()
): Promise<RespuestaOptimizacion> {
  const errores = validarEntrada(tipos, parametros)
  if (errores.length > 0) return { tipo: 'invalido', errores }

  const inicio = ahora()
  const conDemanda = tipos.filter((t) => t.demanda > 0)
  const resultado = await optimizar(conDemanda, parametros, solver)
  if (resultado.tipo !== 'ok') return resultado

  const heuristica = simularOrdenDeLlegada(conDemanda, parametros)
  return {
    tipo: 'ok',
    reporte: generarReporte(
      resultado.plan,
      conDemanda,
      parametros,
      heuristica.costoPromedio
    ),
    grupos: agruparBancos(resultado.plan, parametros),
    cantidadPatrones: resultado.cantidadPatrones,
    milisegundos: Math.round(ahora() - inicio)
  }
}
