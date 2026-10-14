import type { Campo, Planilla, Respuestas } from './types'
import { camposVisibles } from './visibilidad'

export interface Descuento {
  id: string
  etiqueta: string
  peso: number
}

export interface ResultadoPuntaje {
  puntaje: number
  total: number
  descuentos: Descuento[]
  criticosFallidos: { id: string; etiqueta: string }[]
  respondidos: number
  evaluables: number
}

const esEvaluable = (c: Campo) =>
  c.falla !== undefined && (c.critico === true || (c.peso ?? 0) > 0)

/**
 * Vista previa del puntaje (en el sistema real, la fuente de verdad era el
 * backend). Solo cuentan los campos visibles: los ítems comunes descuentan su
 * peso cuando fallan y un ítem crítico que falla lleva el puntaje a 0.
 */
export function calcularPuntaje(
  planilla: Planilla,
  respuestas: Respuestas
): ResultadoPuntaje {
  const visibles = camposVisibles(planilla.campos, respuestas)
    .map((v) => v.campo)
    .filter(esEvaluable)

  const descuentos: Descuento[] = []
  const criticosFallidos: ResultadoPuntaje['criticosFallidos'] = []
  let respondidos = 0

  for (const campo of visibles) {
    const valor = respuestas[campo.id]
    if (valor !== undefined && valor !== '') respondidos++
    if (valor === undefined || valor !== campo.falla) continue
    if (campo.critico) {
      criticosFallidos.push({ id: campo.id, etiqueta: campo.etiqueta })
    }
    if ((campo.peso ?? 0) > 0) {
      descuentos.push({
        id: campo.id,
        etiqueta: campo.etiqueta,
        peso: campo.peso ?? 0
      })
    }
  }

  const descontado = descuentos.reduce((s, d) => s + d.peso, 0)
  const puntaje =
    criticosFallidos.length > 0
      ? 0
      : Math.max(0, planilla.puntajeTotal - descontado)

  return {
    puntaje,
    total: planilla.puntajeTotal,
    descuentos,
    criticosFallidos,
    respondidos,
    evaluables: visibles.length
  }
}
