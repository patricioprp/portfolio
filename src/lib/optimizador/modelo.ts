import {
  DIAMETROS,
  type Diametro,
  type Parametros,
  type Patron,
  type TipoVigueta
} from './domain'

/** Modelo de programación lineal entera en formato CPLEX LP. */
export interface ModeloLP {
  lp: string
  /** Nombre de la variable `x` → patrón que representa. */
  patronPorVariable: Map<string, Patron>
  variableBanco: Record<Diametro, string>
  variableJornadas: string
}

const formatear = (n: number) => Number(n.toFixed(6)).toString()

/**
 * Variables: x_j = filas cortadas con el patrón j; b_d = bancos con el
 * diámetro d; J = jornadas.
 * Objetivo: minimizar Σ costoBanco_d · b_d.
 * Restricciones: cubrir la demanda de cada medida; Σ_{j de d} x_j = filasPorBanco · b_d;
 * Σ b_d = bancosPorJornada · J.
 */
export function construirModelo(
  tipos: readonly TipoVigueta[],
  patrones: readonly Patron[],
  parametros: Parametros
): ModeloLP {
  const patronPorVariable = new Map<string, Patron>()
  patrones.forEach((p, i) => patronPorVariable.set(`x${i}`, p))

  const variableBanco = {
    fino: 'b_fino',
    medio: 'b_medio',
    grueso: 'b_grueso'
  } satisfies Record<Diametro, string>
  const variableJornadas = 'J'

  const objetivo = DIAMETROS.map(
    (d) =>
      `${formatear(parametros.costoPorFila[d] * parametros.filasPorBanco)} ${variableBanco[d]}`
  ).join(' + ')

  const restricciones: string[] = []

  tipos.forEach((tipo, i) => {
    if (tipo.demanda <= 0) return
    const terminos = [...patronPorVariable]
      .filter(([, p]) => (p.piezas[tipo.id] ?? 0) > 0)
      .map(([v, p]) => `${p.piezas[tipo.id]} ${v}`)
    // Sin patrones que la produzcan, la restricción vuelve infactible al modelo.
    const lado =
      terminos.length > 0 ? terminos.join(' + ') : `0 ${variableJornadas}`
    restricciones.push(` d${i}: ${lado} >= ${tipo.demanda}`)
  })

  for (const d of DIAMETROS) {
    const filas = [...patronPorVariable]
      .filter(([, p]) => p.diametro === d)
      .map(([v]) => v)
    const lado = filas.length > 0 ? `${filas.join(' + ')} - ` : ''
    restricciones.push(
      ` f_${d}: ${lado}${parametros.filasPorBanco} ${variableBanco[d]} = 0`
    )
  }

  restricciones.push(
    ` jornadas: ${DIAMETROS.map((d) => variableBanco[d]).join(' + ')} - ${parametros.bancosPorJornada} ${variableJornadas} = 0`
  )

  const enteras = [
    ...patronPorVariable.keys(),
    ...DIAMETROS.map((d) => variableBanco[d]),
    variableJornadas
  ]

  const lp = [
    'Minimize',
    ` costo: ${objetivo}`,
    'Subject To',
    ...restricciones,
    'General',
    ` ${enteras.join(' ')}`,
    'End'
  ].join('\n')

  return { lp, patronPorVariable, variableBanco, variableJornadas }
}
