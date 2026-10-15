import { describe, expect, it } from 'vitest'
import {
  aJson,
  enVentana,
  evaluar,
  ventanaValida,
  type ConfigContingencia
} from './evaluar'

const h = (horas: number) => new Date(Date.UTC(2026, 9, 15, horas))
const ahora = h(10)

const base: ConfigContingencia = {
  mantenimientoTotal: { forzado: false, ventana: null },
  tramitesApagados: [],
  aviso: null
}

describe('ventanas', () => {
  it('incluye el inicio y excluye el fin', () => {
    const v = { desde: h(10), hasta: h(12) }
    expect(enVentana(v, h(10))).toBe(true)
    expect(enVentana(v, h(12))).toBe(false)
  })

  it('una ventana que termina antes de empezar no es válida', () => {
    expect(ventanaValida({ desde: h(12), hasta: h(10) })).toBe(false)
    expect(enVentana({ desde: h(12), hasta: h(10) }, h(11))).toBe(false)
  })
})

describe('evaluar', () => {
  it('sin contingencias, todo opera', () => {
    const e = evaluar(base, ahora)
    expect(e).toMatchObject({ tipo: 'operativo', aviso: null })
    if (e.tipo === 'operativo') expect(e.apagados.size).toBe(0)
  })

  it('apaga solo los trámites indicados', () => {
    const e = evaluar({ ...base, tramitesApagados: ['reintegros'] }, ahora)
    expect(e.tipo).toBe('operativo')
    if (e.tipo === 'operativo') {
      expect(e.apagados.has('reintegros')).toBe(true)
      expect(e.apagados.has('autorizaciones')).toBe(false)
    }
  })

  it('el mantenimiento total forzado gana sobre todo lo demás', () => {
    const e = evaluar(
      {
        mantenimientoTotal: { forzado: true, ventana: null },
        tramitesApagados: ['reintegros'],
        aviso: { desde: h(20), hasta: h(21) }
      },
      ahora
    )
    expect(e).toEqual({ tipo: 'mantenimiento-total', hasta: null })
  })

  it('el mantenimiento total programado aplica solo dentro de su ventana', () => {
    const config: ConfigContingencia = {
      ...base,
      mantenimientoTotal: {
        forzado: false,
        ventana: { desde: h(11), hasta: h(13) }
      }
    }
    expect(evaluar(config, h(10)).tipo).toBe('operativo')
    expect(evaluar(config, h(12))).toEqual({
      tipo: 'mantenimiento-total',
      hasta: h(13)
    })
    expect(evaluar(config, h(13)).tipo).toBe('operativo')
  })

  it('el aviso se anuncia antes, se marca en curso y desaparece al terminar', () => {
    const config = { ...base, aviso: { desde: h(11), hasta: h(12) } }
    const antes = evaluar(config, h(10))
    const durante = evaluar(config, h(11))
    const despues = evaluar(config, h(12))
    expect(antes.tipo === 'operativo' && antes.aviso?.enCurso).toBe(false)
    expect(durante.tipo === 'operativo' && durante.aviso?.enCurso).toBe(true)
    expect(despues.tipo === 'operativo' && despues.aviso).toBeNull()
  })

  it('ignora un aviso con fechas inválidas', () => {
    const e = evaluar({ ...base, aviso: { desde: h(12), hasta: h(11) } }, ahora)
    expect(e.tipo === 'operativo' && e.aviso).toBeNull()
  })
})

describe('aJson', () => {
  it('serializa las fechas en ISO', () => {
    const json = JSON.parse(
      aJson({ ...base, aviso: { desde: h(11), hasta: h(12) } })
    )
    expect(json.aviso).toEqual({
      desde: '2026-10-15T11:00:00.000Z',
      hasta: '2026-10-15T12:00:00.000Z'
    })
  })
})
