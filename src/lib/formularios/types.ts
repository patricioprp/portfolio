import * as z from 'zod'

/** Profundidad máxima permitida al editar la planilla en la demo. */
export const PROFUNDIDAD_MAXIMA = 5

const valorRespuesta = z.union([z.string(), z.boolean()])

const opcion = z.object({
  valor: z.string().min(1),
  etiqueta: z.string().min(1)
})

/**
 * Un campo de la planilla. Es recursivo: `hijos` tiene la misma forma, y se
 * muestran solo cuando la respuesta del campo es igual a `mostrarHijosSi`.
 */
export const esquemaCampo = z.object({
  id: z.string().min(1),
  etiqueta: z.string().min(1),
  tipo: z.enum(['si-no', 'seleccion', 'checkbox', 'texto']),
  opciones: z.array(opcion).min(2).optional(),
  /** Puntos que descuenta si la respuesta es igual a `falla`. */
  peso: z.number().min(0).max(100).optional(),
  /** Si la respuesta es igual a `falla`, toda la evaluación vale 0. */
  critico: z.boolean().optional(),
  falla: valorRespuesta.optional(),
  mostrarHijosSi: valorRespuesta.optional(),
  get hijos() {
    return z.array(esquemaCampo).optional()
  }
})

export const esquemaPlanilla = z.object({
  titulo: z.string().min(1),
  empresa: z.string().min(1),
  campania: z.string().min(1),
  puntajeTotal: z.number().positive().max(1000),
  campos: z.array(esquemaCampo).min(1)
})

export type Campo = z.infer<typeof esquemaCampo>
export type Planilla = z.infer<typeof esquemaPlanilla>
export type Valor = z.infer<typeof valorRespuesta>
export type Respuestas = Record<string, Valor | undefined>
export type TipoCampo = Campo['tipo']
