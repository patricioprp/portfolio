import { useState } from 'react'
import type { Comercio, Grupo } from '@/lib/mapa/mapa'
import { interpolar } from '../compartido/formato'
import type { TextosMapa } from './tipos'

interface PropsTarjeta {
  comercio: Comercio
  distancia: string
  textos: TextosMapa
  alVerDetalle: (c: Comercio) => void
}

export function Tarjeta({
  comercio,
  distancia,
  textos: t,
  alVerDetalle
}: PropsTarjeta) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-lg">
      <p className="text-xs font-semibold tracking-wider text-accent uppercase">
        {t.rubros[comercio.rubro as keyof TextosMapa['rubros']]}
      </p>
      <p className="mt-0.5 text-lg font-bold text-strong">{comercio.nombre}</p>
      <p className="text-sm text-muted">{comercio.direccion}</p>
      <p className="mt-2 inline-flex rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
        {interpolar(t.ui.descuento, { n: comercio.descuento })}
      </p>
      <div className="mt-3 flex items-center justify-between gap-3 text-sm">
        <span className="text-muted">
          {interpolar(t.ui.distancia, { km: distancia })}
        </span>
        <button
          type="button"
          onClick={() => alVerDetalle(comercio)}
          className="rounded-md bg-accent-solid px-3 py-1.5 font-semibold text-white hover:bg-accent-solid-hover"
        >
          {t.ui.verDetalle}
        </button>
      </div>
    </div>
  )
}

interface PropsSeleccion {
  grupo: Grupo
  indice: number
  textos: TextosMapa
  distancia: (c: Comercio) => string
  alCambiarIndice: (i: number) => void
  alCerrar: () => void
  alVerDetalle: (c: Comercio) => void
}

/** Card para un comercio; carrusel cuando varios comparten la ubicación. */
export function Seleccion({
  grupo,
  indice,
  textos: t,
  distancia,
  alCambiarIndice,
  alCerrar,
  alVerDetalle
}: PropsSeleccion) {
  const [inicioToque, setInicioToque] = useState<number | null>(null)
  const total = grupo.comercios.length
  const actual = grupo.comercios[Math.min(indice, total - 1)]
  if (!actual) return null
  const esCarrusel = total > 1

  const mover = (paso: number) =>
    alCambiarIndice((indice + paso + total) % total)

  return (
    <section
      aria-label={
        esCarrusel ? interpolar(t.ui.carrusel, { n: total }) : actual.nombre
      }
      aria-roledescription={esCarrusel ? 'carrusel' : undefined}
      className="relative"
      onTouchStart={(e) => setInicioToque(e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        const fin = e.changedTouches[0]?.clientX
        if (esCarrusel && inicioToque !== null && fin !== undefined) {
          const dx = fin - inicioToque
          if (Math.abs(dx) > 40) mover(dx < 0 ? 1 : -1)
        }
        setInicioToque(null)
      }}
    >
      {esCarrusel && (
        <div className="mb-2 flex items-center justify-between gap-2 rounded-lg bg-surface/95 px-3 py-1.5 text-sm shadow">
          <span className="font-semibold text-strong">
            {interpolar(t.ui.carrusel, { n: total })}
          </span>
          <span className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => mover(-1)}
              aria-label={t.ui.anterior}
              className="inline-flex size-8 items-center justify-center rounded-md text-strong hover:bg-surface-2"
            >
              ‹
            </button>
            <span className="font-mono text-xs text-muted" aria-live="polite">
              {interpolar(t.ui.posicion, { i: indice + 1, n: total })}
            </span>
            <button
              type="button"
              onClick={() => mover(1)}
              aria-label={t.ui.siguiente}
              className="inline-flex size-8 items-center justify-center rounded-md text-strong hover:bg-surface-2"
            >
              ›
            </button>
          </span>
        </div>
      )}
      <div className="relative">
        <Tarjeta
          comercio={actual}
          distancia={distancia(actual)}
          textos={t}
          alVerDetalle={alVerDetalle}
        />
        <button
          type="button"
          onClick={alCerrar}
          aria-label={t.ui.cerrar}
          className="absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-strong"
        >
          ✕
        </button>
      </div>
      {esCarrusel && (
        <div className="mt-2 flex justify-center gap-1.5" aria-hidden="true">
          {grupo.comercios.map((c, i) => (
            <span
              key={c.id}
              className={`size-1.5 rounded-full ${i === indice ? 'bg-accent' : 'bg-line'}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
