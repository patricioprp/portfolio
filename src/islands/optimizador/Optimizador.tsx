import { useEffect, useId, useMemo, useRef, useState } from 'react'
import {
  DIAMETROS,
  EJEMPLO_PARAMETROS,
  EJEMPLO_TIPOS,
  type Diametro,
  type Parametros,
  type TipoVigueta
} from '@/lib/optimizador/domain'
import type {
  PedidoOptimizacion,
  RespuestaOptimizacion
} from '@/lib/optimizador/ejecutar'
import { MAX_TIPOS, type ErrorEntrada } from '@/lib/optimizador/validacion'
import type { Diccionario, Idioma } from '@/i18n'
import { interpolar, parsearDecimal } from '../compartido/formato'
import { VistaBanco } from './VistaBanco'

type Textos = Diccionario['demoOptimizador']

interface FilaEditable {
  clave: number
  id: string
  largoM: string
  diametroMin: Diametro
  demanda: string
}

type Estado =
  | { tipo: 'inicial' }
  | { tipo: 'calculando' }
  | { tipo: 'listo'; respuesta: RespuestaOptimizacion; tipos: TipoVigueta[] }

interface Props {
  idioma: Idioma
  textos: Textos
}

function filasDelEjemplo(idioma: Idioma): FilaEditable[] {
  const decimal = new Intl.NumberFormat(idioma, { minimumFractionDigits: 2 })
  return EJEMPLO_TIPOS.map((t, i) => ({
    clave: i,
    id: t.id,
    largoM: decimal.format(t.largoCm / 100),
    diametroMin: t.diametroMin,
    demanda: String(t.demanda)
  }))
}

function costosDelEjemplo(idioma: Idioma): Record<Diametro, string> {
  const f = new Intl.NumberFormat(idioma, { minimumFractionDigits: 1 })
  return {
    fino: f.format(EJEMPLO_PARAMETROS.costoPorFila.fino),
    medio: f.format(EJEMPLO_PARAMETROS.costoPorFila.medio),
    grueso: f.format(EJEMPLO_PARAMETROS.costoPorFila.grueso)
  }
}

export default function Optimizador({ idioma, textos }: Props) {
  const [filas, setFilas] = useState(() => filasDelEjemplo(idioma))
  const [costos, setCostos] = useState(() => costosDelEjemplo(idioma))
  const [estado, setEstado] = useState<Estado>({ tipo: 'inicial' })
  const worker = useRef<Worker | null>(null)
  const siguienteClave = useRef(EJEMPLO_TIPOS.length)
  const idBase = useId()

  const numero = useMemo(
    () => new Intl.NumberFormat(idioma, { maximumFractionDigits: 1 }),
    [idioma]
  )
  const entero = useMemo(() => new Intl.NumberFormat(idioma), [idioma])
  const metros = useMemo(
    () => new Intl.NumberFormat(idioma, { minimumFractionDigits: 2 }),
    [idioma]
  )

  useEffect(() => () => worker.current?.terminate(), [])

  const actualizarFila = (clave: number, cambios: Partial<FilaEditable>) =>
    setFilas((actual) =>
      actual.map((f) => (f.clave === clave ? { ...f, ...cambios } : f))
    )

  const agregarFila = () => {
    const clave = siguienteClave.current++
    setFilas((actual) => [
      ...actual,
      {
        clave,
        id: `M${clave + 1}`,
        largoM: '',
        diametroMin: 'fino',
        demanda: '0'
      }
    ])
  }

  const restaurar = () => {
    setFilas(filasDelEjemplo(idioma))
    setCostos(costosDelEjemplo(idioma))
    setEstado({ tipo: 'inicial' })
  }

  const optimizar = () => {
    const tipos: TipoVigueta[] = filas.map((f) => ({
      id: f.id.trim() || '?',
      largoCm: Math.round(parsearDecimal(f.largoM) * 100),
      diametroMin: f.diametroMin,
      demanda: Number(f.demanda.trim() === '' ? NaN : f.demanda)
    }))
    const parametros: Parametros = {
      ...EJEMPLO_PARAMETROS,
      costoPorFila: {
        fino: parsearDecimal(costos.fino),
        medio: parsearDecimal(costos.medio),
        grueso: parsearDecimal(costos.grueso)
      }
    }

    worker.current ??= new Worker(
      new URL('../../lib/optimizador/worker.ts', import.meta.url),
      { type: 'module' }
    )
    const w = worker.current
    setEstado({ tipo: 'calculando' })
    w.onmessage = (e: MessageEvent<RespuestaOptimizacion>) =>
      setEstado({ tipo: 'listo', respuesta: e.data, tipos })
    w.onerror = () =>
      setEstado({
        tipo: 'listo',
        respuesta: { tipo: 'error', detalle: 'worker' },
        tipos
      })
    w.postMessage({ tipos, parametros } satisfies PedidoOptimizacion)
  }

  const mensajeError = (e: ErrorEntrada) =>
    interpolar(textos.errores[e.codigo], 'id' in e ? { id: e.id } : {})

  const respuesta = estado.tipo === 'listo' ? estado.respuesta : undefined
  const calculando = estado.tipo === 'calculando'

  let anuncio = ''
  if (calculando) anuncio = textos.entrada.calculando
  else if (respuesta?.tipo === 'ok') {
    anuncio = interpolar(textos.resultado.resumenVivo, {
      costo: numero.format(respuesta.reporte.costo),
      ahorro: `${numero.format(respuesta.reporte.ahorroPct)} %`
    })
  } else if (respuesta?.tipo === 'infactible')
    anuncio = textos.errores.infactible
  else if (respuesta?.tipo === 'error') anuncio = textos.errores.error

  const campo =
    'w-full rounded-md border border-line bg-bg px-2.5 py-2 text-strong focus:border-accent focus:outline-none'

  return (
    <div className="space-y-10">
      <form
        className="rounded-2xl border border-line bg-surface p-4 sm:p-6"
        onSubmit={(e) => {
          e.preventDefault()
          optimizar()
        }}
        aria-labelledby={`${idBase}-entrada`}
      >
        <h2 id={`${idBase}-entrada`} className="text-xl font-bold text-strong">
          {textos.entrada.titulo}
        </h2>

        <div
          aria-hidden="true"
          className="mt-4 hidden grid-cols-[6rem_7rem_1fr_7rem_2.5rem] gap-2 text-sm font-medium text-muted sm:grid"
        >
          <span>{textos.entrada.medida}</span>
          <span>{textos.entrada.largo}</span>
          <span>{textos.entrada.acero}</span>
          <span>{textos.entrada.demanda}</span>
        </div>
        <ul className="mt-4 space-y-3 sm:mt-2 sm:space-y-2">
          {filas.map((f, i) => (
            <li
              key={f.clave}
              className="grid grid-cols-2 gap-2 rounded-xl border border-line p-3 sm:grid-cols-[6rem_7rem_1fr_7rem_2.5rem] sm:items-center sm:rounded-none sm:border-0 sm:p-0"
            >
              <label className="text-xs text-muted">
                <span className="sm:sr-only">{textos.entrada.medida}</span>
                <input
                  aria-label={`${textos.entrada.medida} ${i + 1}`}
                  value={f.id}
                  maxLength={8}
                  onChange={(e) =>
                    actualizarFila(f.clave, { id: e.target.value })
                  }
                  className={`${campo} mt-1 font-mono text-sm sm:mt-0`}
                />
              </label>
              <label className="text-xs text-muted">
                <span className="sm:sr-only">{textos.entrada.largo}</span>
                <input
                  aria-label={`${textos.entrada.largo} · ${f.id}`}
                  inputMode="decimal"
                  value={f.largoM}
                  onChange={(e) =>
                    actualizarFila(f.clave, { largoM: e.target.value })
                  }
                  className={`${campo} mt-1 text-sm sm:mt-0`}
                />
              </label>
              <label className="text-xs text-muted">
                <span className="sm:sr-only">{textos.entrada.acero}</span>
                <select
                  aria-label={`${textos.entrada.acero} · ${f.id}`}
                  value={f.diametroMin}
                  onChange={(e) =>
                    actualizarFila(f.clave, {
                      diametroMin: e.target.value as Diametro
                    })
                  }
                  className={`${campo} mt-1 text-sm sm:mt-0`}
                >
                  {DIAMETROS.map((d) => (
                    <option key={d} value={d}>
                      {textos.diametros[d]}
                    </option>
                  ))}
                </select>
              </label>
              <label className="text-xs text-muted">
                <span className="sm:sr-only">{textos.entrada.demanda}</span>
                <input
                  aria-label={`${textos.entrada.demanda} · ${f.id}`}
                  inputMode="numeric"
                  value={f.demanda}
                  onChange={(e) =>
                    actualizarFila(f.clave, { demanda: e.target.value })
                  }
                  className={`${campo} mt-1 text-sm sm:mt-0`}
                />
              </label>
              <div className="col-span-2 flex justify-end sm:col-span-1">
                <button
                  type="button"
                  onClick={() =>
                    setFilas((actual) =>
                      actual.filter((x) => x.clave !== f.clave)
                    )
                  }
                  disabled={filas.length <= 1}
                  aria-label={interpolar(textos.entrada.quitar, { id: f.id })}
                  className="inline-flex size-9 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-strong disabled:opacity-40"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M18 6 6 18M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </li>
          ))}
        </ul>

        <fieldset className="mt-6">
          <legend className="text-sm font-medium text-strong">
            {textos.entrada.costos}
          </legend>
          <div className="mt-2 grid grid-cols-3 gap-3 sm:max-w-md">
            {DIAMETROS.map((d) => (
              <label key={d} className="text-sm text-muted">
                {textos.diametros[d]}
                <input
                  inputMode="decimal"
                  value={costos[d]}
                  onChange={(e) =>
                    setCostos((c) => ({ ...c, [d]: e.target.value }))
                  }
                  className={`${campo} mt-1`}
                />
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={calculando}
            className="inline-flex items-center gap-2 rounded-lg bg-accent-solid px-5 py-3 font-semibold text-white hover:bg-accent-solid-hover disabled:opacity-70"
          >
            {calculando && (
              <span
                className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none"
                aria-hidden="true"
              />
            )}
            {calculando ? textos.entrada.calculando : textos.entrada.optimizar}
          </button>
          <button
            type="button"
            onClick={agregarFila}
            disabled={filas.length >= MAX_TIPOS}
            className="rounded-lg border border-line bg-surface px-4 py-3 font-semibold text-strong hover:bg-surface-2 disabled:opacity-50"
          >
            {textos.entrada.agregar}
          </button>
          <button
            type="button"
            onClick={restaurar}
            className="rounded-lg px-4 py-3 font-semibold text-accent hover:underline"
          >
            {textos.entrada.restaurar}
          </button>
        </div>
        <p className="mt-4 text-sm text-muted italic">{textos.aviso}</p>
      </form>

      <p className="sr-only" aria-live="polite">
        {anuncio}
      </p>

      {respuesta?.tipo === 'invalido' && (
        <div
          role="alert"
          className="rounded-2xl border border-rose-500/50 bg-rose-500/10 p-5"
        >
          <ul className="list-disc space-y-1 pl-5 text-sm text-strong">
            {respuesta.errores.map((e, i) => (
              <li key={i}>{mensajeError(e)}</li>
            ))}
          </ul>
        </div>
      )}

      {(respuesta?.tipo === 'infactible' || respuesta?.tipo === 'error') && (
        <div
          role="alert"
          className="rounded-2xl border border-rose-500/50 bg-rose-500/10 p-5 text-sm text-strong"
        >
          {respuesta.tipo === 'infactible'
            ? textos.errores.infactible
            : textos.errores.error}
        </div>
      )}

      {respuesta?.tipo === 'ok' && estado.tipo === 'listo' && (
        <section aria-labelledby={`${idBase}-resultado`} className="space-y-8">
          <div>
            <h2
              id={`${idBase}-resultado`}
              className="text-2xl font-bold text-strong"
            >
              {textos.resultado.titulo}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {interpolar(textos.resultado.tiempo, {
                patrones: entero.format(respuesta.cantidadPatrones),
                ms: entero.format(respuesta.milisegundos)
              })}
            </p>
          </div>

          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                titulo: textos.resultado.costo,
                valor: numero.format(respuesta.reporte.costo),
                detalle: interpolar(textos.resultado.vsHeuristica, {
                  valor: numero.format(respuesta.reporte.costoHeuristica)
                })
              },
              {
                titulo: textos.resultado.ahorro,
                valor: `${numero.format(respuesta.reporte.ahorroPct)} %`,
                detalle: textos.resultado.ahorroDetalle
              },
              {
                titulo: textos.resultado.sobreMinimo,
                valor: `+${numero.format(respuesta.reporte.sobreMinimoPct)} %`,
                detalle: interpolar(textos.resultado.sobreMinimoDetalle, {
                  valor: numero.format(respuesta.reporte.minimoTeorico)
                })
              },
              {
                titulo: textos.resultado.bancos,
                valor: entero.format(respuesta.reporte.totalBancos),
                detalle: interpolar(textos.resultado.bancosDetalle, {
                  jornadas: entero.format(respuesta.reporte.jornadas)
                })
              }
            ].map((kpi) => (
              <div
                key={kpi.titulo}
                className="rounded-2xl border border-line bg-surface p-5"
              >
                <dt className="text-sm font-medium text-muted">{kpi.titulo}</dt>
                <dd className="mt-1 font-mono text-3xl font-bold text-strong">
                  {kpi.valor}
                </dd>
                <dd className="mt-1 text-xs text-muted">{kpi.detalle}</dd>
              </div>
            ))}
          </dl>

          <div>
            <h3 className="text-xl font-bold text-strong">
              {textos.resultado.bancosTitulo}
            </h3>
            <ul className="mt-4 space-y-4">
              {respuesta.grupos.map((g, i) => (
                <li
                  key={i}
                  className="rounded-2xl border border-line bg-surface p-4 sm:p-5"
                >
                  <p className="flex items-baseline justify-between gap-4 font-semibold text-strong">
                    <span>{textos.bancoDe[g.diametro]}</span>
                    <span className="font-mono text-accent">
                      × {g.cantidad}
                    </span>
                  </p>
                  <div className="mt-3 overflow-x-auto">
                    <VistaBanco
                      filas={g.filas}
                      tipos={estado.tipos}
                      largoFilaCm={EJEMPLO_PARAMETROS.largoFilaCm}
                      etiquetaFila={(n) =>
                        interpolar(textos.resultado.fila, { n })
                      }
                      formatoLargo={(cm) => metros.format(cm / 100)}
                    />
                  </div>
                  <ul className="sr-only">
                    {g.filas.map((p, j) => (
                      <li key={j}>
                        {interpolar(textos.resultado.fila, { n: j + 1 })}:{' '}
                        {Object.entries(p.piezas)
                          .map(([id, n]) => `${n} × ${id}`)
                          .join(', ')}
                        {p.recorteCm > 0 &&
                          `, ${interpolar(textos.resultado.recorteFila, {
                            valor: metros.format(p.recorteCm / 100)
                          })}`}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-strong">
              {textos.resultado.produccionTitulo}
            </h3>
            <div className="mt-4 overflow-x-auto rounded-2xl border border-line">
              <table className="w-full text-sm">
                <thead className="bg-surface-2 text-left text-muted">
                  <tr>
                    <th scope="col" className="px-4 py-2 font-medium">
                      {textos.entrada.medida}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-right font-medium"
                    >
                      {textos.entrada.demanda}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-right font-medium"
                    >
                      {textos.resultado.producido}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-2 text-right font-medium"
                    >
                      {textos.resultado.aStock}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-surface">
                  {respuesta.reporte.produccion.map((p) => (
                    <tr key={p.id}>
                      <th
                        scope="row"
                        className="px-4 py-2 text-left font-mono text-strong"
                      >
                        {p.id}
                      </th>
                      <td className="px-4 py-2 text-right">
                        {entero.format(p.demanda)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {entero.format(p.producido)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {entero.format(p.excedente)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-muted">
              {textos.resultado.recorte}:{' '}
              <span className="font-mono text-strong">
                {numero.format(respuesta.reporte.recorteTotalM)} m
              </span>{' '}
              {interpolar(textos.resultado.recorteDetalle, {
                filas: entero.format(respuesta.reporte.totalFilas)
              })}
            </p>
          </div>
        </section>
      )}
    </div>
  )
}
