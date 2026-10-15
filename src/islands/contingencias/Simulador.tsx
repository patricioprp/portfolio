import { useId, useMemo, useState } from 'react'
import {
  aJson,
  evaluar,
  ventanaValida,
  type ConfigContingencia,
  type Ventana
} from '@/lib/contingencias/evaluar'
import type { Diccionario, Idioma } from '@/i18n'
import { interpolar } from '../compartido/formato'

type Textos = Diccionario['demoContingencias']
type IdTramite = keyof Textos['tramites']

const TRAMITES: IdTramite[] = [
  'reintegros',
  'autorizaciones',
  'facturacion',
  'discapacidad',
  'credencial',
  'cartilla'
]

const HORA = 3_600_000

/** Date → valor de un <input type="datetime-local"> (hora local). */
function aLocal(fecha: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${fecha.getFullYear()}-${p(fecha.getMonth() + 1)}-${p(fecha.getDate())}T${p(fecha.getHours())}:${p(fecha.getMinutes())}`
}

function enPunto(fecha: Date, horasAdelante: number): Date {
  const d = new Date(fecha.getTime() + horasAdelante * HORA)
  d.setMinutes(0, 0, 0)
  return d
}

interface Estado {
  forzado: boolean
  programado: boolean
  totalDesde: string
  totalHasta: string
  apagados: IdTramite[]
  avisoActivo: boolean
  avisoDesde: string
  avisoHasta: string
  horasSimuladas: number
}

function estadoInicial(base: Date): Estado {
  return {
    forzado: false,
    programado: false,
    totalDesde: aLocal(enPunto(base, 20)),
    totalHasta: aLocal(enPunto(base, 22)),
    apagados: ['reintegros'],
    avisoActivo: true,
    avisoDesde: aLocal(enPunto(base, 3)),
    avisoHasta: aLocal(enPunto(base, 5)),
    horasSimuladas: 0
  }
}

const CAMPO =
  'mt-1 w-full rounded-md border border-line bg-bg px-2.5 py-1.5 text-sm text-strong focus:border-accent focus:outline-none'

function aVentana(desde: string, hasta: string): Ventana {
  return { desde: new Date(desde), hasta: new Date(hasta) }
}

interface PropsVentana {
  textos: Textos['control']
  idError: string
  desde: string
  hasta: string
  alCambiar: (c: { desde?: string; hasta?: string }) => void
}

/** Par de campos "desde / hasta" con validación. */
function CamposVentana({
  textos,
  idError,
  desde,
  hasta,
  alCambiar
}: PropsVentana) {
  const valida = ventanaValida(aVentana(desde, hasta))
  const descripcion = valida ? undefined : idError
  return (
    <div className="mt-2 grid gap-2">
      <label className="text-xs text-muted">
        {textos.desde}
        <input
          type="datetime-local"
          value={desde}
          onChange={(ev) => alCambiar({ desde: ev.target.value })}
          className={CAMPO}
          aria-describedby={descripcion}
        />
      </label>
      <label className="text-xs text-muted">
        {textos.hasta}
        <input
          type="datetime-local"
          value={hasta}
          onChange={(ev) => alCambiar({ hasta: ev.target.value })}
          className={CAMPO}
          aria-invalid={!valida}
          aria-describedby={descripcion}
        />
      </label>
      {!valida && (
        <p id={idError} className="text-sm text-rose-700 dark:text-rose-400">
          {textos.ventanaInvalida}
        </p>
      )}
    </div>
  )
}

interface Props {
  idioma: Idioma
  textos: Textos
}

export default function Simulador({ idioma, textos: t }: Props) {
  const [base] = useState(() => new Date())
  const [e, setE] = useState(() => estadoInicial(base))
  const id = useId()

  const formato = useMemo(
    () =>
      new Intl.DateTimeFormat(idioma, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
    [idioma]
  )

  const cambiar = (cambios: Partial<Estado>) =>
    setE((s) => ({ ...s, ...cambios }))
  const ventanaTotal = aVentana(e.totalDesde, e.totalHasta)
  const ventanaAviso = aVentana(e.avisoDesde, e.avisoHasta)

  const config: ConfigContingencia = {
    mantenimientoTotal: {
      forzado: e.forzado,
      ventana: e.programado ? ventanaTotal : null
    },
    tramitesApagados: e.apagados,
    aviso: e.avisoActivo ? ventanaAviso : null
  }
  const ahora = new Date(base.getTime() + e.horasSimuladas * HORA)
  const estado = evaluar(config, ahora)

  const disponibles =
    estado.tipo === 'operativo'
      ? TRAMITES.filter((tr) => !estado.apagados.has(tr)).length
      : 0
  const anuncio = interpolar(t.portal.anuncio, {
    estado:
      estado.tipo === 'mantenimiento-total'
        ? t.portal.estadoTotal
        : interpolar(t.portal.estadoOperativo, { n: disponibles })
  })

  const interruptor = 'size-4 accent-sky-600'

  return (
    <div className="grid gap-6 lg:grid-cols-[22rem_1fr] lg:items-start">
      <form
        aria-labelledby={`${id}-config`}
        onSubmit={(ev) => ev.preventDefault()}
        className="space-y-5 rounded-2xl border border-line bg-surface p-5"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 id={`${id}-config`} className="text-lg font-bold text-strong">
            {t.control.titulo}
          </h2>
          <button
            type="button"
            onClick={() => setE(estadoInicial(base))}
            className="rounded-md px-2 py-1 text-sm font-semibold text-accent hover:underline"
          >
            {t.control.restaurar}
          </button>
        </div>

        <fieldset>
          <legend className="text-sm font-semibold text-strong">
            {t.control.total}
          </legend>
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={e.forzado}
              onChange={(ev) => cambiar({ forzado: ev.target.checked })}
              className={interruptor}
            />
            {t.control.forzar}
          </label>
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={e.programado}
              onChange={(ev) => cambiar({ programado: ev.target.checked })}
              className={interruptor}
            />
            {t.control.programar}
          </label>
          {e.programado && (
            <CamposVentana
              textos={t.control}
              idError={`${id}-total-error`}
              desde={e.totalDesde}
              hasta={e.totalHasta}
              alCambiar={(c) =>
                cambiar({
                  ...(c.desde !== undefined && { totalDesde: c.desde }),
                  ...(c.hasta !== undefined && { totalHasta: c.hasta })
                })
              }
            />
          )}
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-strong">
            {t.control.apagados}
          </legend>
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
            {TRAMITES.map((tr) => (
              <label key={tr} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={e.apagados.includes(tr)}
                  onChange={(ev) =>
                    cambiar({
                      apagados: ev.target.checked
                        ? [...e.apagados, tr]
                        : e.apagados.filter((x) => x !== tr)
                    })
                  }
                  className={interruptor}
                />
                {t.tramites[tr]}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="text-sm font-semibold text-strong">
            {t.control.aviso}
          </legend>
          <label className="mt-2 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={e.avisoActivo}
              onChange={(ev) => cambiar({ avisoActivo: ev.target.checked })}
              className={interruptor}
            />
            {t.control.mostrarAviso}
          </label>
          {e.avisoActivo && (
            <CamposVentana
              textos={t.control}
              idError={`${id}-aviso-error`}
              desde={e.avisoDesde}
              hasta={e.avisoHasta}
              alCambiar={(c) =>
                cambiar({
                  ...(c.desde !== undefined && { avisoDesde: c.desde }),
                  ...(c.hasta !== undefined && { avisoHasta: c.hasta })
                })
              }
            />
          )}
        </fieldset>

        <div>
          <label
            htmlFor={`${id}-reloj`}
            className="text-sm font-semibold text-strong"
          >
            {t.control.reloj}
          </label>
          <p id={`${id}-reloj-ayuda`} className="text-xs text-muted">
            {t.control.relojAyuda}
          </p>
          <input
            id={`${id}-reloj`}
            type="range"
            min={0}
            max={36}
            step={1}
            value={e.horasSimuladas}
            onChange={(ev) =>
              cambiar({ horasSimuladas: Number(ev.target.value) })
            }
            aria-describedby={`${id}-reloj-ayuda`}
            aria-valuetext={interpolar(t.control.relojValor, {
              h: e.horasSimuladas,
              fecha: formato.format(ahora)
            })}
            className="mt-2 w-full accent-sky-600"
          />
          <p className="font-mono text-sm text-accent">
            {interpolar(t.control.relojValor, {
              h: e.horasSimuladas,
              fecha: formato.format(ahora)
            })}
          </p>
        </div>

        <details>
          <summary className="cursor-pointer text-sm font-semibold text-accent">
            {t.control.json}
          </summary>
          <pre className="mt-2 max-h-64 overflow-auto rounded-lg border border-line bg-bg p-3 font-mono text-xs text-strong">
            {aJson(config)}
          </pre>
        </details>
      </form>

      <section
        aria-labelledby={`${id}-portal`}
        className="overflow-hidden rounded-2xl border border-line bg-surface"
      >
        <h2 id={`${id}-portal`} className="sr-only">
          {t.portal.titulo}
        </h2>
        <p className="sr-only" aria-live="polite">
          {anuncio}
        </p>
        <div className="flex items-center justify-between border-b border-line bg-surface-2 px-4 py-3">
          <p className="font-semibold text-strong">{t.portal.nombre}</p>
          <p className="font-mono text-xs text-muted">
            {formato.format(ahora)}
          </p>
        </div>

        {estado.tipo === 'mantenimiento-total' ? (
          <div className="flex min-h-80 flex-col items-center justify-center gap-3 p-8 text-center">
            <svg
              viewBox="0 0 24 24"
              className="size-12 text-accent"
              aria-hidden="true"
            >
              <path
                d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-xl font-bold text-strong">
              {t.portal.totalTitulo}
            </p>
            <p className="text-muted">
              {estado.hasta
                ? interpolar(t.portal.totalHasta, {
                    hasta: formato.format(estado.hasta)
                  })
                : t.portal.totalTexto}
            </p>
          </div>
        ) : (
          <div className="p-4 sm:p-5">
            {estado.aviso && (
              <p
                className={`mb-4 rounded-lg border px-3 py-2 text-sm ${
                  estado.aviso.enCurso
                    ? 'border-amber-500/60 bg-amber-500/15 text-strong'
                    : 'border-sky-500/40 bg-accent-soft text-strong'
                }`}
              >
                {estado.aviso.enCurso
                  ? interpolar(t.portal.avisoEnCurso, {
                      hasta: formato.format(estado.aviso.hasta)
                    })
                  : interpolar(t.portal.avisoProximo, {
                      desde: formato.format(estado.aviso.desde),
                      hasta: formato.format(estado.aviso.hasta)
                    })}
              </p>
            )}
            <p className="font-semibold text-strong">{t.portal.hola}</p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {TRAMITES.map((tr) => {
                const apagado = estado.apagados.has(tr)
                return (
                  <li
                    key={tr}
                    className={`rounded-xl border p-4 transition-colors motion-reduce:transition-none ${
                      apagado
                        ? 'border-dashed border-line bg-surface-2'
                        : 'border-line bg-bg'
                    }`}
                  >
                    <p
                      className={`font-semibold ${apagado ? 'text-muted line-through' : 'text-strong'}`}
                    >
                      {t.tramites[tr]}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs">
                      <span
                        aria-hidden="true"
                        className={`size-2 rounded-full ${apagado ? 'bg-rose-500' : 'bg-emerald-500'}`}
                      />
                      <span className={apagado ? 'text-muted' : 'text-fg'}>
                        {apagado ? t.portal.apagado : t.portal.disponible}
                      </span>
                    </p>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
        <p className="border-t border-line px-4 py-3 text-xs text-muted italic">
          {t.aviso}
        </p>
      </section>
    </div>
  )
}
