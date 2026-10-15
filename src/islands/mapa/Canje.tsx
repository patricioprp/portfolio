import { useEffect, useId, useRef, useState } from 'react'
import type { Comercio } from '@/lib/mapa/mapa'
import { interpolar } from '../compartido/formato'
import { codigoCupon, patronQr } from './qr'
import type { TextosMapa } from './tipos'

interface Props {
  comercio: Comercio | null
  distancia: (c: Comercio) => string
  textos: TextosMapa
  alCerrar: () => void
}

/** Recorrido del socio: detalle → código QR → cupón. */
export function Canje({ comercio, distancia, textos: t, alCerrar }: Props) {
  const dialogo = useRef<HTMLDialogElement>(null)
  const [paso, setPaso] = useState(0)
  const id = useId()

  useEffect(() => {
    const d = dialogo.current
    if (!d) return
    if (comercio && !d.open) {
      setPaso(0)
      d.showModal()
    }
    if (!comercio && d.open) d.close()
  }, [comercio])

  const qr = comercio ? patronQr(comercio.id) : []

  return (
    <dialog
      ref={dialogo}
      aria-labelledby={`${id}-titulo`}
      onClose={alCerrar}
      className="m-auto w-[min(26rem,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-0 text-fg shadow-2xl backdrop:bg-black/60"
    >
      {comercio && (
        <div className="p-5">
          <ol className="flex gap-2 text-xs font-semibold">
            {t.canje.pasos.map((nombre, i) => (
              <li
                key={nombre}
                aria-current={i === paso ? 'step' : undefined}
                className={`flex-1 rounded-full px-2 py-1 text-center ${
                  i === paso
                    ? 'bg-accent-solid text-white'
                    : i < paso
                      ? 'bg-accent-soft text-accent'
                      : 'bg-surface-2 text-muted'
                }`}
              >
                {nombre}
              </li>
            ))}
          </ol>

          <h2
            id={`${id}-titulo`}
            className="mt-4 text-xl font-bold text-strong"
          >
            {paso === 2 ? t.canje.cuponTitulo : comercio.nombre}
          </h2>

          {paso === 0 && (
            <div className="mt-2 space-y-1 text-sm">
              <p className="text-accent">
                {t.rubros[comercio.rubro as keyof TextosMapa['rubros']]} ·{' '}
                {t.zonas[comercio.zona as keyof TextosMapa['zonas']]}
              </p>
              <p>{comercio.direccion}</p>
              <p className="text-muted">
                {interpolar(t.ui.distancia, { km: distancia(comercio) })}
              </p>
              <p className="pt-2 text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                {interpolar(t.ui.descuento, { n: comercio.descuento })}
              </p>
            </div>
          )}

          {paso === 1 && (
            <div className="mt-3 text-center">
              <svg
                viewBox={`-2 -2 ${qr.length + 4} ${qr.length + 4}`}
                className="mx-auto size-48 rounded-lg bg-white"
                role="img"
                aria-label={t.canje.qrAviso}
              >
                {qr.flatMap((fila, y) =>
                  fila.map((lleno, x) =>
                    lleno ? (
                      <rect
                        key={`${x}-${y}`}
                        x={x}
                        y={y}
                        width="1"
                        height="1"
                        fill="#0f172a"
                      />
                    ) : null
                  )
                )}
              </svg>
              <p className="mt-3 text-sm">{t.canje.qrTexto}</p>
              <p className="mt-1 text-xs text-muted italic">
                {t.canje.qrAviso}
              </p>
            </div>
          )}

          {paso === 2 && (
            <div className="mt-2 text-sm">
              <p>
                {interpolar(t.canje.cuponTexto, {
                  descuento: comercio.descuento,
                  nombre: comercio.nombre
                })}
              </p>
              <p className="mt-4 text-xs text-muted">{t.canje.codigo}</p>
              <p className="mt-1 rounded-lg border border-dashed border-accent bg-accent-soft px-4 py-3 text-center font-mono text-2xl font-bold tracking-widest text-strong">
                {codigoCupon(comercio.id, new Date())}
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-between gap-3">
            <button
              type="button"
              onClick={() => (paso === 0 ? alCerrar() : setPaso(paso - 1))}
              className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-strong hover:bg-surface-2"
            >
              {paso === 0 ? t.ui.cerrar : t.canje.volver}
            </button>
            <button
              type="button"
              onClick={() => (paso === 2 ? alCerrar() : setPaso(paso + 1))}
              className="rounded-lg bg-accent-solid px-4 py-2 text-sm font-semibold text-white hover:bg-accent-solid-hover"
            >
              {paso === 0
                ? t.canje.verQr
                : paso === 1
                  ? t.canje.generar
                  : t.canje.terminar}
            </button>
          </div>
        </div>
      )}
    </dialog>
  )
}
