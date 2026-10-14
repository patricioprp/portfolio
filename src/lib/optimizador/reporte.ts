import {
  DIAMETROS,
  type Diametro,
  type Parametros,
  type Patron,
  type Plan,
  type TipoVigueta
} from './domain'

export interface Produccion {
  id: string
  demanda: number
  producido: number
  excedente: number
}

export interface Reporte {
  costo: number
  minimoTeorico: number
  sobreMinimoPct: number
  costoHeuristica: number
  ahorroPct: number
  bancos: Record<Diametro, number>
  totalBancos: number
  jornadas: number
  totalFilas: number
  recorteTotalM: number
  produccion: Produccion[]
}

/** Costo si cada pieza llevara su acero justo y no hubiera recortes. */
export function minimoTeorico(
  tipos: readonly TipoVigueta[],
  parametros: Parametros
): number {
  return tipos.reduce(
    (total, t) =>
      total +
      (t.demanda * t.largoCm * parametros.costoPorFila[t.diametroMin]) /
        parametros.largoFilaCm,
    0
  )
}

export function generarReporte(
  plan: Plan,
  tipos: readonly TipoVigueta[],
  parametros: Parametros,
  costoHeuristica: number
): Reporte {
  const producido = new Map<string, number>()
  let recorteCm = 0
  let totalFilas = 0
  for (const { patron, cantidad } of plan.filas) {
    totalFilas += cantidad
    recorteCm += patron.recorteCm * cantidad
    for (const [id, n] of Object.entries(patron.piezas)) {
      producido.set(id, (producido.get(id) ?? 0) + n * cantidad)
    }
  }

  const minimo = minimoTeorico(tipos, parametros)
  return {
    costo: plan.costo,
    minimoTeorico: minimo,
    sobreMinimoPct: (plan.costo / minimo - 1) * 100,
    costoHeuristica,
    ahorroPct: (1 - plan.costo / costoHeuristica) * 100,
    bancos: plan.bancos,
    totalBancos: DIAMETROS.reduce((s, d) => s + plan.bancos[d], 0),
    jornadas: plan.jornadas,
    totalFilas,
    recorteTotalM: recorteCm / 100,
    produccion: tipos.map((t) => {
      const p = producido.get(t.id) ?? 0
      return {
        id: t.id,
        demanda: t.demanda,
        producido: p,
        excedente: p - t.demanda
      }
    })
  }
}

export interface GrupoBancos {
  diametro: Diametro
  filas: Patron[]
  cantidad: number
}

/**
 * Reparte las filas del plan en bancos (filasPorBanco filas del mismo
 * diámetro) y agrupa los bancos idénticos para mostrarlos.
 */
export function agruparBancos(
  plan: Plan,
  parametros: Parametros
): GrupoBancos[] {
  const grupos = new Map<string, GrupoBancos>()
  for (const d of [...DIAMETROS].reverse()) {
    const filas = plan.filas
      .filter((f) => f.patron.diametro === d)
      .flatMap((f) => Array.from({ length: f.cantidad }, () => f.patron))
    for (let i = 0; i < filas.length; i += parametros.filasPorBanco) {
      const banco = filas.slice(i, i + parametros.filasPorBanco)
      const clave = `${d}|${banco.map((p) => p.id).join(',')}`
      const grupo = grupos.get(clave)
      if (grupo) grupo.cantidad++
      else grupos.set(clave, { diametro: d, filas: banco, cantidad: 1 })
    }
  }
  return [...grupos.values()]
}
