import {
  DIAMETROS,
  admite,
  type Diametro,
  type Patron,
  type TipoVigueta
} from './domain'

/**
 * Enumera los patrones de corte maximales de una fila para un diámetro: las
 * combinaciones de piezas compatibles que entran en la fila y ya no admiten
 * otra pieza.
 */
export function generarPatrones(
  tipos: readonly TipoVigueta[],
  largoFilaCm: number,
  diametro: Diametro
): Patron[] {
  const aptos = tipos.filter(
    (t) => admite(diametro, t.diametroMin) && t.largoCm <= largoFilaCm
  )
  if (aptos.length === 0) return []
  const minLargo = Math.min(...aptos.map((t) => t.largoCm))
  const patrones: Patron[] = []
  const actual: Record<string, number> = {}

  const recorrer = (i: number, restante: number) => {
    const tipo = aptos[i]
    if (!tipo) {
      const hayPiezas = Object.values(actual).some((n) => n > 0)
      if (restante < minLargo && hayPiezas) {
        const piezas = Object.fromEntries(
          Object.entries(actual).filter(([, n]) => n > 0)
        )
        patrones.push({
          id: `${diametro}-${patrones.length}`,
          diametro,
          piezas,
          recorteCm: restante
        })
      }
      return
    }
    for (let n = Math.floor(restante / tipo.largoCm); n >= 0; n--) {
      actual[tipo.id] = n
      recorrer(i + 1, restante - n * tipo.largoCm)
    }
    delete actual[tipo.id]
  }

  recorrer(0, largoFilaCm)
  return patrones
}

export function generarTodosLosPatrones(
  tipos: readonly TipoVigueta[],
  largoFilaCm: number
): Patron[] {
  return DIAMETROS.flatMap((d) => generarPatrones(tipos, largoFilaCm, d))
}
