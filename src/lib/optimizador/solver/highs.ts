import type { Highs } from 'highs'
import type { SolucionLP, Solver } from './tipos'

/**
 * Adaptador de HiGHS (WebAssembly). Recibe el cargador para que el Worker
 * pueda indicar la URL del .wasm y los tests usen el cargador por defecto.
 */
export function crearSolverHighs(
  cargar: () => Promise<Highs>,
  limiteSegundos = 20
): Solver {
  let instancia: Promise<Highs> | undefined

  return {
    async resolver(modelo) {
      instancia ??= cargar()
      const highs = await instancia
      try {
        const r = highs.solve(modelo.lp, { time_limit: limiteSegundos })
        const valores = Object.fromEntries(
          Object.entries(r.Columns).map(([nombre, col]) => [
            nombre,
            Math.round(col.Primal)
          ])
        )
        if (r.Status === 'Optimal') {
          return { estado: 'optimo', objetivo: r.ObjectiveValue, valores }
        }
        if (
          r.Status === 'Infeasible' ||
          r.Status === 'Primal infeasible or unbounded'
        ) {
          return { estado: 'infactible', objetivo: NaN, valores: {} }
        }
        return {
          estado: 'error',
          objetivo: NaN,
          valores: {},
          detalle: r.Status
        } satisfies SolucionLP
      } catch (e) {
        return {
          estado: 'error',
          objetivo: NaN,
          valores: {},
          detalle: e instanceof Error ? e.message : String(e)
        }
      }
    }
  }
}
