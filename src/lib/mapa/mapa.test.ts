import { describe, expect, it } from 'vitest'
import { CENTRO, COMERCIOS, ENCUADRE } from './ejemplo'
import {
  agruparPorUbicacion,
  calcularMarcadores,
  dentro,
  desproyectar,
  distanciaKm,
  limitesDeVista,
  proyectar
} from './mapa'

const grupos = agruparPorUbicacion(COMERCIOS)

describe('agruparPorUbicacion', () => {
  it('une en un solo pin a los comercios del mismo edificio', () => {
    const shopping = grupos.find((g) => g.comercios.length === 4)
    expect(shopping?.comercios.map((c) => c.id)).toContain('cafe-central')
    expect(grupos.filter((g) => g.comercios.length > 1)).toHaveLength(2)
    expect(grupos.reduce((s, g) => s + g.comercios.length, 0)).toBe(
      COMERCIOS.length
    )
  })
})

describe('proyección', () => {
  const vista = { centro: CENTRO, zoom: 0 }

  it('el centro de la vista queda en el medio', () => {
    expect(proyectar(CENTRO, vista, ENCUADRE)).toEqual({ x: 0.5, y: 0.5 })
  })

  it('desproyectar invierte a proyectar', () => {
    const p = { lat: -34.605, lng: -58.44 }
    const q = desproyectar(proyectar(p, vista, ENCUADRE), vista, ENCUADRE)
    expect(q.lat).toBeCloseTo(p.lat, 9)
    expect(q.lng).toBeCloseTo(p.lng, 9)
  })

  it('cada nivel de zoom muestra la mitad del ancho', () => {
    const l0 = limitesDeVista(vista, ENCUADRE)
    const l1 = limitesDeVista({ ...vista, zoom: 1 }, ENCUADRE)
    expect((l1.este - l1.oeste) * 2).toBeCloseTo(l0.este - l0.oeste, 9)
    expect(dentro(CENTRO, l1)).toBe(true)
  })
})

describe('calcularMarcadores', () => {
  it('con poco zoom agrupa pines cercanos en clusters con la cantidad', () => {
    const m = calcularMarcadores(grupos, { centro: CENTRO, zoom: 0 }, ENCUADRE)
    const clusters = m.filter((x) => x.tipo === 'cluster')
    expect(clusters.length).toBeGreaterThan(0)
    const total = m.reduce(
      (s, x) =>
        s + (x.tipo === 'cluster' ? x.cantidad : x.grupo.comercios.length),
      0
    )
    expect(total).toBe(COMERCIOS.length)
  })

  it('con el zoom máximo muestra cada ubicación sin clusters', () => {
    const m = calcularMarcadores(
      grupos,
      { centro: CENTRO, zoom: ENCUADRE.zoomMaximo },
      ENCUADRE
    )
    expect(m.every((x) => x.tipo === 'grupo')).toBe(true)
  })

  it('solo incluye lo que está dentro de la vista', () => {
    const lejos = { centro: { lat: 0, lng: 0 }, zoom: 0 }
    expect(calcularMarcadores(grupos, lejos, ENCUADRE)).toEqual([])
  })
})

describe('distanciaKm', () => {
  it('calcula distancias cortas en km', () => {
    const d = distanciaKm(
      { lat: -34.6, lng: -58.45 },
      { lat: -34.61, lng: -58.45 }
    )
    expect(d).toBeCloseTo(1.11, 2)
  })
})
