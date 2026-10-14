import highsLoader from 'highs'
import { describe, expect, it } from 'vitest'
import {
  EJEMPLO_PARAMETROS as P,
  EJEMPLO_TIPOS as TIPOS,
  admite,
  type TipoVigueta
} from './domain'
import { costoOrdenDeLlegada, simularOrdenDeLlegada } from './heuristica'
import { optimizar } from './optimizar'
import { generarPatrones } from './patrones'
import { agruparBancos, generarReporte, minimoTeorico } from './reporte'
import { crearSolverHighs } from './solver/highs'
import { validarEntrada } from './validacion'

const solver = crearSolverHighs(() => highsLoader())

describe('generarPatrones', () => {
  it('genera los 200 patrones maximales del ejemplo (8 finos, 75 medios, 117 gruesos)', () => {
    expect(generarPatrones(TIPOS, 3300, 'fino')).toHaveLength(8)
    expect(generarPatrones(TIPOS, 3300, 'medio')).toHaveLength(75)
    expect(generarPatrones(TIPOS, 3300, 'grueso')).toHaveLength(117)
  })

  it('respeta el diámetro mínimo y el largo de la fila', () => {
    for (const d of ['fino', 'medio', 'grueso'] as const) {
      for (const p of generarPatrones(TIPOS, 3300, d)) {
        let usado = 0
        for (const [id, n] of Object.entries(p.piezas)) {
          const tipo = TIPOS.find((t) => t.id === id)
          expect(tipo).toBeDefined()
          expect(admite(d, tipo!.diametroMin)).toBe(true)
          usado += n * tipo!.largoCm
        }
        expect(usado + p.recorteCm).toBe(3300)
        expect(p.recorteCm).toBeLessThan(300)
      }
    }
  })
})

describe('optimizar', () => {
  it('encuentra el plan óptimo del ejemplo: costo 103,5 en 8 jornadas', async () => {
    const r = await optimizar(TIPOS, P, solver)
    expect(r.tipo).toBe('ok')
    if (r.tipo !== 'ok') return

    const { plan } = r
    expect(plan.costo).toBeCloseTo(103.5, 6)
    expect(plan.costo).toBeGreaterThanOrEqual(minimoTeorico(TIPOS, P))
    expect(plan.bancos).toEqual({ fino: 10, medio: 9, grueso: 5 })
    expect(plan.jornadas).toBe(8)

    for (const d of ['fino', 'medio', 'grueso'] as const) {
      const filas = plan.filas
        .filter((f) => f.patron.diametro === d)
        .reduce((s, f) => s + f.cantidad, 0)
      expect(filas).toBe(plan.bancos[d] * P.filasPorBanco)
    }

    const reporte = generarReporte(plan, TIPOS, P, 157)
    for (const p of reporte.produccion) {
      expect(p.producido).toBeGreaterThanOrEqual(p.demanda)
    }
  })

  it('informa infactible si no hay acero para una medida', async () => {
    const tipos: TipoVigueta[] = [
      { id: 'A', largoCm: 1000, diametroMin: 'grueso', demanda: 3 }
    ]
    const r = await optimizar(tipos, { ...P, largoFilaCm: 900 }, solver)
    expect(r.tipo).toBe('infactible')
  })
})

describe('heurística de orden de llegada', () => {
  it('cuesta más que el óptimo y es reproducible con la misma semilla', () => {
    const a = simularOrdenDeLlegada(TIPOS, P, { simulaciones: 50, semilla: 7 })
    const b = simularOrdenDeLlegada(TIPOS, P, { simulaciones: 50, semilla: 7 })
    expect(a.costoPromedio).toBe(b.costoPromedio)
    expect(a.costoPromedio).toBeGreaterThan(103.5)
  })

  it('un banco toma el acero de su vigueta más exigente', () => {
    const v10 = TIPOS[0]!
    const v3 = TIPOS[4]!
    // Una sola fila (3 x 10 m + 1 x 3 m) → un banco grueso completo.
    expect(costoOrdenDeLlegada([v10, v10, v10, v3], P)).toBeCloseTo(6.6)
    // Solo viguetas finas → banco fino.
    expect(costoOrdenDeLlegada([v3, v3], P)).toBeCloseTo(3)
  })
})

describe('reporte', () => {
  it('calcula el mínimo teórico del ejemplo (≈ 99,2)', () => {
    expect(minimoTeorico(TIPOS, P)).toBeCloseTo(99.18, 1)
  })

  it('agrupa los bancos idénticos sin perder filas', async () => {
    const r = await optimizar(TIPOS, P, solver)
    if (r.tipo !== 'ok') throw new Error('se esperaba un plan')
    const grupos = agruparBancos(r.plan, P)
    const bancos = grupos.reduce((s, g) => s + g.cantidad, 0)
    expect(bancos).toBe(24)
    for (const g of grupos) expect(g.filas).toHaveLength(3)
  })
})

describe('validarEntrada', () => {
  it('acepta el ejemplo', () => {
    expect(validarEntrada(TIPOS, P)).toEqual([])
  })

  it('detecta medidas más largas que la fila, demandas inválidas y falta de demanda', () => {
    const errores = validarEntrada(
      [
        { id: 'X', largoCm: 4000, diametroMin: 'fino', demanda: 0 },
        { id: 'Y', largoCm: 300, diametroMin: 'fino', demanda: -1 }
      ],
      P
    )
    expect(errores).toEqual(
      expect.arrayContaining([
        { codigo: 'largo-excede-fila', id: 'X' },
        { codigo: 'demanda-invalida', id: 'Y' },
        { codigo: 'sin-demanda' }
      ])
    )
  })
})
