import type { Idioma } from '@/i18n'

/** Fecha en formato `AAAA` o `AAAA-MM`. */
export type FechaParcial = string

function formatearFecha(fecha: FechaParcial, idioma: Idioma): string {
  const [anio, mes] = fecha.split('-')
  if (!mes) return anio ?? fecha
  const date = new Date(Date.UTC(Number(anio), Number(mes) - 1, 1))
  return new Intl.DateTimeFormat(idioma, {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(date)
}

export function formatearPeriodo(
  desde: FechaParcial,
  hasta: FechaParcial | null,
  idioma: Idioma,
  textoActualidad: string
): string {
  const inicio = formatearFecha(desde, idioma)
  if (hasta === desde) return inicio
  const fin = hasta === null ? textoActualidad : formatearFecha(hasta, idioma)
  return `${inicio} – ${fin}`
}

/** Para ordenar de más reciente a más antiguo (los vigentes primero). */
export function compararPorFechaDesc(
  a: { desde: FechaParcial; hasta: FechaParcial | null },
  b: { desde: FechaParcial; hasta: FechaParcial | null }
): number {
  const clave = (p: { desde: FechaParcial; hasta: FechaParcial | null }) =>
    `${p.hasta ?? '9999'}|${p.desde}`
  return clave(b).localeCompare(clave(a))
}
