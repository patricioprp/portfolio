import { useId } from 'react'
import type { Diametro, Patron, TipoVigueta } from '@/lib/optimizador/domain'

const COLOR: Record<Diametro, string> = {
  grueso: 'fill-rose-500/30 stroke-rose-500',
  medio: 'fill-violet-500/30 stroke-violet-500',
  fino: 'fill-sky-500/30 stroke-sky-500'
}

interface Props {
  filas: Patron[]
  tipos: TipoVigueta[]
  largoFilaCm: number
  etiquetaFila: (n: number) => string
  formatoLargo: (cm: number) => string
}

const ANCHO = 660
const ALTO_FILA = 26
const SEPARACION = 8
const MARGEN = 52

/** Dibuja las filas de un banco con sus cortes, a escala. */
export function VistaBanco({
  filas,
  tipos,
  largoFilaCm,
  etiquetaFila,
  formatoLargo
}: Props) {
  // useId incluye caracteres que no sirven dentro de url(#...).
  const idPatron = `recorte-${useId().replace(/[^\w-]/g, '')}`
  const escala = ANCHO / largoFilaCm
  const largoDe = new Map(tipos.map((t) => [t.id, t.largoCm]))
  const alto = filas.length * (ALTO_FILA + SEPARACION)

  return (
    <svg
      viewBox={`0 0 ${ANCHO + MARGEN + 4} ${alto}`}
      className="w-full min-w-[520px] font-sans"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id={idPatron}
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-45)"
        >
          <path d="M0 0 V5" strokeWidth="1.5" className="stroke-slate-400" />
        </pattern>
      </defs>
      {filas.map((patron, i) => {
        const y = i * (ALTO_FILA + SEPARACION)
        let x = MARGEN
        const segmentos = Object.entries(patron.piezas).flatMap(([id, n]) =>
          Array.from({ length: n }, () => id)
        )
        return (
          <g key={i}>
            <text
              x={MARGEN - 8}
              y={y + 17}
              textAnchor="end"
              className="fill-muted text-[11px]"
            >
              {etiquetaFila(i + 1)}
            </text>
            {segmentos.map((id, j) => {
              const ancho = (largoDe.get(id) ?? 0) * escala
              const xi = x
              x += ancho
              return (
                <g key={j}>
                  <rect
                    x={xi}
                    y={y}
                    width={ancho}
                    height={ALTO_FILA}
                    className={COLOR[patron.diametro]}
                  />
                  {ancho > 34 && (
                    <text
                      x={xi + ancho / 2}
                      y={y + 17}
                      textAnchor="middle"
                      className="fill-strong font-mono text-[11px] font-semibold"
                    >
                      {formatoLargo(largoDe.get(id) ?? 0)}
                    </text>
                  )}
                </g>
              )
            })}
            {patron.recorteCm > 0 && (
              <rect
                x={x}
                y={y}
                width={patron.recorteCm * escala}
                height={ALTO_FILA}
                fill={`url(#${idPatron})`}
                className="stroke-slate-400"
              />
            )}
          </g>
        )
      })}
    </svg>
  )
}
