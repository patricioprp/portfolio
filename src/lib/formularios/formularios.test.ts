import * as z from 'zod'
import { describe, expect, it } from 'vitest'
import { PLANILLA_EJEMPLO } from './ejemplo'
import { calcularPuntaje } from './puntaje'
import type { Planilla, Respuestas } from './types'
import { validarPlanilla } from './validacion'
import { camposVisibles, cumpleCondicion } from './visibilidad'

const planilla = PLANILLA_EJEMPLO.es
const ids = (r: Respuestas) =>
  camposVisibles(planilla.campos, r).map((v) => `${v.nivel}:${v.campo.id}`)

describe('visibilidad', () => {
  it('sin respuestas solo se ven los campos de nivel 1', () => {
    expect(ids({})).toEqual([
      '1:saludo',
      '1:identidad',
      '1:solucion',
      '1:tono',
      '1:observaciones'
    ])
  })

  it('muestra cada nivel solo si se cumple la condición del padre', () => {
    expect(ids({ solucion: 'si' })).toContain('2:derivacion')
    expect(ids({ solucion: 'si' })).not.toContain('3:numero-reclamo')
    expect(ids({ solucion: 'si', derivacion: true })).toContain(
      '3:numero-reclamo'
    )
    // Si el abuelo deja de cumplir, el nieto se oculta aunque tenga respuesta.
    expect(ids({ solucion: 'no', derivacion: true })).not.toContain(
      '3:numero-reclamo'
    )
  })

  it('cumpleCondicion es falso para campos sin hijos', () => {
    expect(cumpleCondicion(planilla.campos[0]!, 'si')).toBe(false)
  })
})

describe('puntaje', () => {
  it('sin fallas vale el total', () => {
    expect(calcularPuntaje(planilla, { saludo: 'si' }).puntaje).toBe(100)
  })

  it('los ítems comunes descuentan su peso', () => {
    const r = calcularPuntaje(planilla, { saludo: 'no', tono: 'mejorable' })
    expect(r.puntaje).toBe(80)
    expect(r.descuentos.map((d) => d.id)).toEqual(['saludo', 'tono'])
  })

  it('un ítem crítico que falla lleva el puntaje a 0', () => {
    const r = calcularPuntaje(planilla, { saludo: 'si', identidad: 'no' })
    expect(r.puntaje).toBe(0)
    expect(r.criticosFallidos.map((c) => c.id)).toEqual(['identidad'])
  })

  it('los campos ocultos no puntúan', () => {
    const respuestas: Respuestas = {
      solucion: 'si',
      derivacion: false,
      'numero-reclamo': 'no'
    }
    expect(calcularPuntaje(planilla, respuestas).puntaje).toBe(100)
    expect(
      calcularPuntaje(planilla, { ...respuestas, derivacion: true }).puntaje
    ).toBe(85)
  })

  it('nunca baja de 0', () => {
    const chica: Planilla = {
      ...planilla,
      puntajeTotal: 20,
      campos: [{ id: 'a', etiqueta: 'A', tipo: 'si-no', peso: 30, falla: 'no' }]
    }
    expect(calcularPuntaje(chica, { a: 'no' }).puntaje).toBe(0)
  })
})

describe('validarPlanilla', () => {
  it('acepta la planilla de ejemplo', () => {
    const r = validarPlanilla(JSON.stringify(planilla))
    expect(r.ok).toBe(true)
  })

  it('informa JSON mal formado', () => {
    const r = validarPlanilla('{ "titulo": ')
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errores[0]?.tipo).toBe('json')
  })

  it('informa errores de esquema con la ruta y el mensaje localizado', () => {
    const r = validarPlanilla(
      JSON.stringify({ ...planilla, puntajeTotal: 'cien' }),
      z.locales.es().localeError
    )
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.errores[0]).toMatchObject({
        tipo: 'esquema',
        ruta: ['puntajeTotal']
      })
      expect(r.errores[0]?.tipo === 'esquema' && r.errores[0].mensaje).toMatch(
        /número/
      )
    }
  })

  it('detecta ids repetidos y ítems evaluables sin condición de falla', () => {
    const r = validarPlanilla(
      JSON.stringify({
        ...planilla,
        campos: [
          { id: 'x', etiqueta: 'X', tipo: 'si-no', peso: 10 },
          { id: 'x', etiqueta: 'Y', tipo: 'texto' }
        ]
      })
    )
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.errores).toEqual(
        expect.arrayContaining([
          { tipo: 'falta-falla', id: 'x' },
          { tipo: 'id-duplicado', id: 'x' }
        ])
      )
    }
  })

  it('exige opciones en las selecciones y que la falla sea una de ellas', () => {
    const r = validarPlanilla(
      JSON.stringify({
        ...planilla,
        campos: [
          {
            id: 's',
            etiqueta: 'S',
            tipo: 'seleccion',
            opciones: [
              { valor: 'a', etiqueta: 'A' },
              { valor: 'b', etiqueta: 'B' }
            ],
            peso: 5,
            falla: 'z'
          },
          { id: 't', etiqueta: 'T', tipo: 'seleccion' }
        ]
      })
    )
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.errores).toEqual(
        expect.arrayContaining([
          { tipo: 'falla-no-es-opcion', id: 's' },
          { tipo: 'falta-opciones', id: 't' }
        ])
      )
    }
  })
})
