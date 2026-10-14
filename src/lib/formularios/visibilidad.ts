import type { Campo, Respuestas, Valor } from './types'

/** Los hijos se muestran cuando la respuesta coincide con la condición. */
export function cumpleCondicion(
  campo: Campo,
  valor: Valor | undefined
): boolean {
  if (!campo.hijos?.length || campo.mostrarHijosSi === undefined) return false
  return valor === campo.mostrarHijosSi
}

export interface CampoVisible {
  campo: Campo
  nivel: number
}

/** Recorre el árbol y devuelve solo los campos visibles, con su nivel (1 = raíz). */
export function camposVisibles(
  campos: readonly Campo[],
  respuestas: Respuestas,
  nivel = 1
): CampoVisible[] {
  return campos.flatMap((campo) => {
    const propio: CampoVisible = { campo, nivel }
    if (!cumpleCondicion(campo, respuestas[campo.id])) return [propio]
    return [propio, ...camposVisibles(campo.hijos ?? [], respuestas, nivel + 1)]
  })
}
