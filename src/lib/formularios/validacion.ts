import type * as z from 'zod'
import {
  esquemaPlanilla,
  PROFUNDIDAD_MAXIMA,
  type Campo,
  type Planilla
} from './types'

export type ErrorPlanilla =
  | { tipo: 'json'; detalle: string }
  | { tipo: 'esquema'; ruta: (string | number)[]; mensaje: string }
  | { tipo: 'id-duplicado'; id: string }
  | { tipo: 'falta-falla'; id: string }
  | { tipo: 'falta-opciones'; id: string }
  | { tipo: 'falla-no-es-opcion'; id: string }
  | { tipo: 'profundidad'; id: string; maximo: number }

export type ResultadoValidacion =
  { ok: true; planilla: Planilla } | { ok: false; errores: ErrorPlanilla[] }

function reglasDeNegocio(planilla: Planilla): ErrorPlanilla[] {
  const errores: ErrorPlanilla[] = []
  const vistos = new Set<string>()

  const recorrer = (campos: readonly Campo[], nivel: number) => {
    for (const c of campos) {
      if (vistos.has(c.id)) errores.push({ tipo: 'id-duplicado', id: c.id })
      vistos.add(c.id)
      if (nivel > PROFUNDIDAD_MAXIMA) {
        errores.push({
          tipo: 'profundidad',
          id: c.id,
          maximo: PROFUNDIDAD_MAXIMA
        })
      }
      if ((c.critico || (c.peso ?? 0) > 0) && c.falla === undefined) {
        errores.push({ tipo: 'falta-falla', id: c.id })
      }
      if (c.tipo === 'seleccion') {
        if (!c.opciones) errores.push({ tipo: 'falta-opciones', id: c.id })
        else if (
          c.falla !== undefined &&
          !c.opciones.some((o) => o.valor === c.falla)
        ) {
          errores.push({ tipo: 'falla-no-es-opcion', id: c.id })
        }
      }
      recorrer(c.hijos ?? [], nivel + 1)
    }
  }

  recorrer(planilla.campos, 1)
  return errores
}

/** Parsea el JSON, valida el esquema (zod) y las reglas de negocio. */
export function validarPlanilla(
  texto: string,
  error?: z.core.$ZodErrorMap
): ResultadoValidacion {
  let datos: unknown
  try {
    datos = JSON.parse(texto)
  } catch (e) {
    return {
      ok: false,
      errores: [
        { tipo: 'json', detalle: e instanceof Error ? e.message : String(e) }
      ]
    }
  }

  const r = esquemaPlanilla.safeParse(datos, error ? { error } : undefined)
  if (!r.success) {
    return {
      ok: false,
      errores: r.error.issues.map((i) => ({
        tipo: 'esquema',
        ruta: i.path.filter((p): p is string | number => typeof p !== 'symbol'),
        mensaje: i.message
      }))
    }
  }

  const errores = reglasDeNegocio(r.data)
  return errores.length > 0
    ? { ok: false, errores }
    : { ok: true, planilla: r.data }
}
