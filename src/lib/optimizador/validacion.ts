import type { Parametros, TipoVigueta } from './domain'

export type ErrorEntrada =
  | { codigo: 'sin-demanda' }
  | { codigo: 'id-repetido'; id: string }
  | { codigo: 'largo-invalido'; id: string }
  | { codigo: 'largo-excede-fila'; id: string }
  | { codigo: 'demanda-invalida'; id: string }
  | { codigo: 'costo-invalido' }
  | { codigo: 'demasiados-tipos' }

export const MAX_TIPOS = 8

export function validarEntrada(
  tipos: readonly TipoVigueta[],
  parametros: Parametros
): ErrorEntrada[] {
  const errores: ErrorEntrada[] = []
  const vistos = new Set<string>()

  if (tipos.length > MAX_TIPOS) errores.push({ codigo: 'demasiados-tipos' })

  for (const t of tipos) {
    if (vistos.has(t.id)) errores.push({ codigo: 'id-repetido', id: t.id })
    vistos.add(t.id)
    if (!Number.isInteger(t.largoCm) || t.largoCm <= 0) {
      errores.push({ codigo: 'largo-invalido', id: t.id })
    } else if (t.largoCm > parametros.largoFilaCm) {
      errores.push({ codigo: 'largo-excede-fila', id: t.id })
    }
    if (!Number.isInteger(t.demanda) || t.demanda < 0 || t.demanda > 10_000) {
      errores.push({ codigo: 'demanda-invalida', id: t.id })
    }
  }

  if (!tipos.some((t) => t.demanda > 0)) errores.push({ codigo: 'sin-demanda' })

  const costos = Object.values(parametros.costoPorFila)
  if (costos.some((c) => !Number.isFinite(c) || c <= 0)) {
    errores.push({ codigo: 'costo-invalido' })
  }

  return errores
}
