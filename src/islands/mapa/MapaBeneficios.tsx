import {
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent
} from 'react'
import {
  CENTRO,
  COMERCIOS,
  ENCUADRE,
  RUBROS,
  UBICACION_SOCIO,
  ZONAS
} from '@/lib/mapa/ejemplo'
import {
  agruparPorUbicacion,
  calcularMarcadores,
  claveDeUbicacion,
  dentro,
  distanciaKm,
  limitesDeVista,
  proyectar,
  type Comercio,
  type Limites,
  type Punto,
  type Vista
} from '@/lib/mapa/mapa'
import type { Idioma } from '@/i18n'
import { interpolar } from '../compartido/formato'
import { Canje } from './Canje'
import { Seleccion } from './Tarjetas'
import type { TextosMapa } from './tipos'

interface Props {
  idioma: Idioma
  textos: TextosMapa
}

type Rubro = (typeof RUBROS)[number]
type Zona = (typeof ZONAS)[number]

const VISTA_INICIAL: Vista = { centro: UBICACION_SOCIO, zoom: 1 }
const LIMITE_PAN = 0.03

// Calles decorativas del plano ficticio, en coordenadas geográficas.
const CALLES: [Punto, Punto][] = [
  ...Array.from({ length: 13 }, (_, k): [Punto, Punto] => {
    const lat = CENTRO.lat + (k - 6) * 0.006
    return [
      { lat, lng: CENTRO.lng - 0.06 },
      { lat, lng: CENTRO.lng + 0.06 }
    ]
  }),
  ...Array.from({ length: 13 }, (_, k): [Punto, Punto] => {
    const lng = CENTRO.lng + (k - 6) * 0.008
    return [
      { lat: CENTRO.lat - 0.05, lng },
      { lat: CENTRO.lat + 0.05, lng }
    ]
  })
]
const AVENIDA: [Punto, Punto] = [
  { lat: CENTRO.lat + 0.035, lng: CENTRO.lng - 0.045 },
  { lat: CENTRO.lat - 0.035, lng: CENTRO.lng + 0.045 }
]
const PARQUE = {
  norte: CENTRO.lat + 0.0095,
  sur: CENTRO.lat + 0.0055,
  oeste: CENTRO.lng - 0.0135,
  este: CENTRO.lng - 0.0075
}

const limitar = (p: Punto): Punto => ({
  lat: Math.min(
    CENTRO.lat + LIMITE_PAN,
    Math.max(CENTRO.lat - LIMITE_PAN, p.lat)
  ),
  lng: Math.min(
    CENTRO.lng + LIMITE_PAN,
    Math.max(CENTRO.lng - LIMITE_PAN, p.lng)
  )
})

export default function MapaBeneficios({ idioma, textos: t }: Props) {
  const id = useId()
  const [zona, setZona] = useState<Zona | ''>('')
  const [rubro, setRubro] = useState<Rubro | ''>('')
  const [vista, setVista] = useState<Vista>(VISTA_INICIAL)
  const [area, setArea] = useState<Limites | null>(null)
  const [movido, setMovido] = useState(false)
  const [seleccion, setSeleccion] = useState<{
    clave: string
    indice: number
  } | null>(null)
  const [pestania, setPestania] = useState<'mapa' | 'listado'>('mapa')
  const [canje, setCanje] = useState<Comercio | null>(null)
  const mapa = useRef<HTMLDivElement>(null)
  const arrastre = useRef<{
    x: number
    y: number
    centro: Punto
    movido: boolean
  } | null>(null)

  const km = useMemo(
    () =>
      new Intl.NumberFormat(idioma, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }),
    [idioma]
  )
  const distancia = (c: Comercio) => km.format(distanciaKm(UBICACION_SOCIO, c))

  const filtrados = COMERCIOS.filter(
    (c) =>
      (!zona || c.zona === zona) &&
      (!rubro || c.rubro === rubro) &&
      (!area || dentro(c, area))
  )
  const grupos = agruparPorUbicacion(filtrados)
  const marcadores = calcularMarcadores(grupos, vista, ENCUADRE)
  const listado = [...filtrados].sort(
    (a, b) => distanciaKm(UBICACION_SOCIO, a) - distanciaKm(UBICACION_SOCIO, b)
  )
  const grupoSeleccionado = seleccion
    ? grupos.find((g) => g.clave === seleccion.clave)
    : undefined
  const comercioSeleccionado =
    grupoSeleccionado?.comercios[seleccion?.indice ?? 0]

  const mover = (centro: Punto, zoom = vista.zoom) => {
    setVista({
      centro: limitar(centro),
      zoom: Math.max(0, Math.min(ENCUADRE.zoomMaximo, zoom))
    })
    setMovido(true)
  }
  const pasoPan = (dx: number, dy: number) => {
    const l = limitesDeVista(vista, ENCUADRE)
    mover({
      lat: vista.centro.lat + dy * (l.norte - l.sur),
      lng: vista.centro.lng + dx * (l.este - l.oeste)
    })
  }

  const alPresionar = (e: PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) return
    arrastre.current = {
      x: e.clientX,
      y: e.clientY,
      centro: vista.centro,
      movido: false
    }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const alArrastrar = (e: PointerEvent<HTMLDivElement>) => {
    const a = arrastre.current
    const r = mapa.current?.getBoundingClientRect()
    if (!a || !r) return
    const dx = (e.clientX - a.x) / r.width
    const dy = (e.clientY - a.y) / r.height
    if (Math.abs(dx) + Math.abs(dy) > 0.01) a.movido = true
    if (!a.movido) return
    const l = limitesDeVista(vista, ENCUADRE)
    setVista({
      zoom: vista.zoom,
      centro: limitar({
        lat: a.centro.lat + dy * (l.norte - l.sur),
        lng: a.centro.lng - dx * (l.este - l.oeste)
      })
    })
  }
  const alSoltar = () => {
    if (arrastre.current?.movido) setMovido(true)
    arrastre.current = null
  }
  const alTeclear = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return
    const acciones: Record<string, () => void> = {
      ArrowUp: () => pasoPan(0, 0.15),
      ArrowDown: () => pasoPan(0, -0.15),
      ArrowLeft: () => pasoPan(-0.15, 0),
      ArrowRight: () => pasoPan(0.15, 0),
      '+': () => mover(vista.centro, vista.zoom + 1),
      '=': () => mover(vista.centro, vista.zoom + 1),
      '-': () => mover(vista.centro, vista.zoom - 1)
    }
    const accion = acciones[e.key]
    if (accion) {
      e.preventDefault()
      accion()
    }
  }

  const verEnMapa = (c: Comercio) => {
    const clave = claveDeUbicacion(c)
    const grupo = grupos.find((g) => g.clave === clave)
    setVista({ centro: limitar(c), zoom: ENCUADRE.zoomMaximo })
    setSeleccion({
      clave,
      indice: Math.max(0, grupo?.comercios.findIndex((x) => x.id === c.id) ?? 0)
    })
    setPestania('mapa')
    mapa.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }

  const buscarEnZona = () => {
    setArea(limitesDeVista(vista, ENCUADRE))
    setMovido(false)
    setSeleccion(null)
  }

  const linea = (
    a: Punto,
    b: Punto,
    clase: string,
    ancho: number,
    k: string
  ) => {
    const p = proyectar(a, vista, ENCUADRE)
    const q = proyectar(b, vista, ENCUADRE)
    return (
      <line
        key={k}
        x1={p.x * 100}
        y1={p.y * 100}
        x2={q.x * 100}
        y2={q.y * 100}
        className={clase}
        strokeWidth={ancho}
        vectorEffect="non-scaling-stroke"
      />
    )
  }
  const parqueNO = proyectar(
    { lat: PARQUE.norte, lng: PARQUE.oeste },
    vista,
    ENCUADRE
  )
  const parqueSE = proyectar(
    { lat: PARQUE.sur, lng: PARQUE.este },
    vista,
    ENCUADRE
  )
  const socio = proyectar(UBICACION_SOCIO, vista, ENCUADRE)

  const select =
    'mt-1 w-full rounded-md border border-line bg-bg px-2.5 py-2 text-sm text-strong focus:border-accent focus:outline-none'
  const pestaniaClase = (activa: boolean) =>
    `flex-1 rounded-md px-3 py-2 text-sm font-semibold ${activa ? 'bg-accent-solid text-white' : 'text-strong hover:bg-surface-2'}`

  return (
    <div className="space-y-4">
      <fieldset className="grid gap-3 rounded-2xl border border-line bg-surface p-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <legend className="sr-only">{t.ui.filtros}</legend>
        <label className="text-sm font-medium text-strong">
          {t.ui.zona}
          <select
            value={zona}
            onChange={(e) => {
              setZona(e.target.value as Zona | '')
              setSeleccion(null)
            }}
            className={select}
          >
            <option value="">{t.ui.todas}</option>
            {ZONAS.map((z) => (
              <option key={z} value={z}>
                {t.zonas[z]}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium text-strong">
          {t.ui.rubro}
          <select
            value={rubro}
            onChange={(e) => {
              setRubro(e.target.value as Rubro | '')
              setSeleccion(null)
            }}
            className={select}
          >
            <option value="">{t.ui.todos}</option>
            {RUBROS.map((r) => (
              <option key={r} value={r}>
                {t.rubros[r]}
              </option>
            ))}
          </select>
        </label>
        <p className="text-sm text-muted sm:pb-2" aria-live="polite">
          {interpolar(t.ui.resultados, { n: filtrados.length })}
        </p>
      </fieldset>

      {area && (
        <p className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-sky-500/40 bg-accent-soft px-3 py-2 text-sm text-strong">
          {t.ui.filtradoZona}
          <button
            type="button"
            onClick={() => setArea(null)}
            className="font-semibold text-accent hover:underline"
          >
            {t.ui.verTodos}
          </button>
        </p>
      )}

      <div
        role="group"
        aria-label={t.ui.vista}
        className="flex gap-1 rounded-lg border border-line bg-surface p-1 lg:hidden"
      >
        <button
          type="button"
          aria-pressed={pestania === 'mapa'}
          onClick={() => setPestania('mapa')}
          className={pestaniaClase(pestania === 'mapa')}
        >
          {t.ui.tabMapa}
        </button>
        <button
          type="button"
          aria-pressed={pestania === 'listado'}
          onClick={() => setPestania('listado')}
          className={pestaniaClase(pestania === 'listado')}
        >
          {t.ui.tabListado}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_22rem] lg:items-start">
        <section
          aria-labelledby={`${id}-mapa`}
          className={pestania === 'mapa' ? '' : 'hidden lg:block'}
        >
          <h2 id={`${id}-mapa`} className="sr-only">
            {t.ui.tabMapa}
          </h2>
          {/* El mapa es un widget propio (role="application"): se mueve con el
              puntero o con las flechas y hace zoom con + y −. La regla de
              jsx-a11y no considera interactivo ese rol. */}
          {/* eslint-disable jsx-a11y-x/no-noninteractive-element-interactions, jsx-a11y-x/no-noninteractive-tabindex */}
          <div
            ref={mapa}
            role="application"
            aria-roledescription="mapa"
            aria-label={t.ui.mapaEtiqueta}
            tabIndex={0}
            onPointerDown={alPresionar}
            onPointerMove={alArrastrar}
            onPointerUp={alSoltar}
            onPointerCancel={alSoltar}
            onKeyDown={alTeclear}
            className="relative aspect-[4/5] cursor-grab touch-none overflow-hidden rounded-2xl border border-line bg-surface-2 select-none active:cursor-grabbing sm:aspect-[4/3]"
          >
            {/* eslint-enable jsx-a11y-x/no-noninteractive-element-interactions, jsx-a11y-x/no-noninteractive-tabindex */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 size-full"
              aria-hidden="true"
            >
              <rect
                x={parqueNO.x * 100}
                y={parqueNO.y * 100}
                width={(parqueSE.x - parqueNO.x) * 100}
                height={(parqueSE.y - parqueNO.y) * 100}
                className="fill-emerald-500/20"
              />
              {CALLES.map(([a, b], i) =>
                linea(a, b, 'stroke-line', 1, `c${i}`)
              )}
              {linea(AVENIDA[0], AVENIDA[1], 'stroke-amber-500/50', 4, 'av')}
            </svg>

            <span
              aria-hidden="true"
              className="absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-sky-500 shadow-[0_0_0_6px_rgb(14_165_233/0.25)]"
              style={{ left: `${socio.x * 100}%`, top: `${socio.y * 100}%` }}
            />

            {marcadores.map((m) => {
              const estilo = { left: `${m.x * 100}%`, top: `${m.y * 100}%` }
              if (m.tipo === 'cluster') {
                return (
                  <button
                    key={m.id}
                    type="button"
                    style={estilo}
                    onClick={() => mover(m.centro, vista.zoom + 1)}
                    aria-label={interpolar(t.ui.cluster, { n: m.cantidad })}
                    className="absolute flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-sky-600 font-bold text-white shadow-lg ring-4 ring-sky-500/30 hover:bg-sky-700"
                  >
                    {m.cantidad}
                  </button>
                )
              }
              const varios = m.grupo.comercios.length
              const primero = m.grupo.comercios[0]
              const activo = seleccion?.clave === m.grupo.clave
              return (
                <button
                  key={m.id}
                  type="button"
                  style={estilo}
                  aria-pressed={activo}
                  onClick={() =>
                    setSeleccion({ clave: m.grupo.clave, indice: 0 })
                  }
                  aria-label={
                    varios > 1
                      ? interpolar(t.ui.pinGrupo, { n: varios })
                      : interpolar(t.ui.pinComercio, {
                          nombre: primero?.nombre ?? '',
                          descuento: primero?.descuento ?? 0
                        })
                  }
                  className={`absolute flex h-9 min-w-9 -translate-x-1/2 -translate-y-full items-center justify-center gap-1 rounded-full rounded-bl-none px-2 text-xs font-bold text-white shadow-lg ${
                    activo
                      ? 'z-10 scale-110 bg-rose-600 ring-4 ring-rose-500/30'
                      : 'bg-accent-solid hover:bg-accent-solid-hover'
                  }`}
                >
                  {varios > 1 ? (
                    <span>×{varios}</span>
                  ) : (
                    <span>{primero?.descuento}%</span>
                  )}
                </button>
              )
            })}

            <div className="absolute top-3 right-3 flex flex-col overflow-hidden rounded-lg border border-line bg-surface shadow">
              <button
                type="button"
                onClick={() => mover(vista.centro, vista.zoom + 1)}
                disabled={vista.zoom >= ENCUADRE.zoomMaximo}
                aria-label={t.ui.acercar}
                className="size-10 text-lg font-bold text-strong hover:bg-surface-2 disabled:opacity-40"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => mover(vista.centro, vista.zoom - 1)}
                disabled={vista.zoom <= 0}
                aria-label={t.ui.alejar}
                className="size-10 border-t border-line text-lg font-bold text-strong hover:bg-surface-2 disabled:opacity-40"
              >
                −
              </button>
              <button
                type="button"
                onClick={() => {
                  setVista(VISTA_INICIAL)
                  setMovido(false)
                }}
                aria-label={t.ui.miUbicacion}
                className="flex size-10 items-center justify-center border-t border-line text-strong hover:bg-surface-2"
              >
                <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                  <circle cx="12" cy="12" r="4" fill="currentColor" />
                  <path
                    d="M12 2v3M12 19v3M2 12h3M19 12h3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            {movido && (
              <button
                type="button"
                onClick={buscarEnZona}
                className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-surface px-4 py-2 text-sm font-semibold text-accent shadow-lg ring-1 ring-line hover:bg-surface-2"
              >
                {t.ui.buscarZona}
              </button>
            )}

            {grupoSeleccionado && seleccion && (
              <div className="absolute inset-x-3 bottom-3">
                <Seleccion
                  grupo={grupoSeleccionado}
                  indice={seleccion.indice}
                  textos={t}
                  distancia={distancia}
                  alCambiarIndice={(i) =>
                    setSeleccion({ clave: seleccion.clave, indice: i })
                  }
                  alCerrar={() => setSeleccion(null)}
                  alVerDetalle={setCanje}
                />
              </div>
            )}
          </div>
          <p className="sr-only" aria-live="polite">
            {comercioSeleccionado
              ? interpolar(t.ui.anuncioSeleccion, {
                  nombre: comercioSeleccionado.nombre
                })
              : ''}
          </p>
          <p className="mt-2 flex items-center gap-2 text-xs text-muted">
            <span
              aria-hidden="true"
              className="size-3 rounded-full border-2 border-white bg-sky-500"
            />
            {t.ui.tuUbicacion}
          </p>
        </section>

        <section
          aria-labelledby={`${id}-listado`}
          className={pestania === 'listado' ? '' : 'hidden lg:block'}
        >
          <h2 id={`${id}-listado`} className="sr-only">
            {t.ui.tabListado}
          </h2>
          {listado.length === 0 ? (
            <p className="rounded-2xl border border-line bg-surface p-4 text-sm text-muted">
              {t.ui.sinResultados}
            </p>
          ) : (
            <ul className="space-y-2 lg:max-h-[34rem] lg:overflow-y-auto lg:pr-1">
              {listado.map((c) => (
                <li
                  key={c.id}
                  className={`rounded-xl border bg-surface p-3 ${comercioSeleccionado?.id === c.id ? 'border-accent' : 'border-line'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-strong">{c.nombre}</p>
                      <p className="text-xs text-muted">
                        {t.rubros[c.rubro as Rubro]} ·{' '}
                        {interpolar(t.ui.distancia, { km: distancia(c) })}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      {interpolar(t.ui.descuento, { n: c.descuento })}
                    </span>
                  </div>
                  <div className="mt-2 flex gap-3 text-sm font-semibold">
                    <button
                      type="button"
                      onClick={() => verEnMapa(c)}
                      className="text-accent hover:underline"
                    >
                      {t.ui.verEnMapa}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCanje(c)}
                      className="text-accent hover:underline"
                    >
                      {t.ui.verDetalle}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="text-sm text-muted italic">{t.aviso}</p>
      <Canje
        comercio={canje}
        distancia={distancia}
        textos={t}
        alCerrar={() => setCanje(null)}
      />
    </div>
  )
}
