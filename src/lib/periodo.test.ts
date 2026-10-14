import { describe, expect, it } from 'vitest'
import { compararPorFechaDesc, formatearPeriodo } from './periodo'

describe('formatearPeriodo', () => {
  it('muestra mes y año en español', () => {
    expect(formatearPeriodo('2021-04', '2026-06', 'es', 'actualidad')).toBe(
      'abr 2021 – jun 2026'
    )
  })

  it('usa el texto de actualidad cuando no hay fecha de fin', () => {
    expect(formatearPeriodo('2023-12', null, 'es', 'actualidad')).toBe(
      'dic 2023 – actualidad'
    )
  })

  it('acepta solo el año', () => {
    expect(formatearPeriodo('2016', '2018-05', 'en', 'present')).toBe(
      '2016 – May 2018'
    )
  })

  it('muestra una sola fecha si inicio y fin coinciden', () => {
    expect(formatearPeriodo('2018', '2018', 'es', 'actualidad')).toBe('2018')
  })
})

describe('compararPorFechaDesc', () => {
  it('ordena los vigentes primero y luego por fecha de fin', () => {
    const items = [
      { id: 'a', desde: '2010', hasta: '2014' },
      { id: 'b', desde: '2021-04', hasta: '2026-06' },
      { id: 'c', desde: '2023-12', hasta: null },
      { id: 'd', desde: '2018', hasta: '2019' }
    ]
    expect(items.sort(compararPorFechaDesc).map((i) => i.id)).toEqual([
      'c',
      'b',
      'd',
      'a'
    ])
  })
})
