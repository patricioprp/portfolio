import { useId, useMemo, useState } from 'react'
import localeEn from 'zod/v4/locales/en.js'
import localeEs from 'zod/v4/locales/es.js'
import { PLANILLA_EJEMPLO } from '@/lib/formularios/ejemplo'
import { calcularPuntaje } from '@/lib/formularios/puntaje'
import type { Planilla, Respuestas, Valor } from '@/lib/formularios/types'
import {
  validarPlanilla,
  type ErrorPlanilla
} from '@/lib/formularios/validacion'
import type { Diccionario, Idioma } from '@/i18n'
import { interpolar } from '../compartido/formato'
import { Campo } from './Campo'

type Textos = Diccionario['demoFormulario']

interface Props {
  idioma: Idioma
  textos: Textos
}

const aTexto = (p: Planilla) => JSON.stringify(p, null, 2)

export default function FormularioDinamico({ idioma, textos }: Props) {
  const ejemplo = PLANILLA_EJEMPLO[idioma]
  const [texto, setTexto] = useState(() => aTexto(ejemplo))
  const [planilla, setPlanilla] = useState<Planilla>(ejemplo)
  const [errores, setErrores] = useState<ErrorPlanilla[]>([])
  const [respuestas, setRespuestas] = useState<Respuestas>({})
  const idBase = useId()

  const errorMap = useMemo(
    () => (idioma === 'es' ? localeEs() : localeEn()).localeError,
    [idioma]
  )
  const resultado = calcularPuntaje(planilla, respuestas)

  const editar = (nuevo: string) => {
    setTexto(nuevo)
    const r = validarPlanilla(nuevo, errorMap)
    if (r.ok) {
      setPlanilla(r.planilla)
      setErrores([])
    } else {
      setErrores(r.errores)
    }
  }

  const restaurar = () => {
    setTexto(aTexto(ejemplo))
    setPlanilla(ejemplo)
    setErrores([])
    setRespuestas({})
  }

  const responder = (id: string, valor: Valor | undefined) =>
    setRespuestas((r) => ({ ...r, [id]: valor }))

  const describir = (e: ErrorPlanilla): string => {
    switch (e.tipo) {
      case 'json':
        return interpolar(textos.errores.json, { detalle: e.detalle })
      case 'esquema': {
        const ruta =
          e.ruta.length === 0
            ? textos.errores.raiz
            : e.ruta
                .map((p) => (typeof p === 'number' ? String(p + 1) : p))
                .join(' › ')
        return interpolar(textos.errores.esquema, { ruta, mensaje: e.mensaje })
      }
      case 'profundidad':
        return interpolar(textos.errores.profundidad, {
          id: e.id,
          maximo: e.maximo
        })
      default:
        return interpolar(textos.errores[e.tipo], { id: e.id })
    }
  }

  const fallaCritica = resultado.criticosFallidos[0]
  const porcentaje = (resultado.puntaje / resultado.total) * 100

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem] lg:items-start">
        <form
          aria-labelledby={`${idBase}-titulo`}
          className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
          onSubmit={(e) => e.preventDefault()}
        >
          <p className="font-mono text-xs tracking-wider text-accent uppercase">
            {planilla.empresa} · {planilla.campania}
          </p>
          <h2
            id={`${idBase}-titulo`}
            className="mt-1 text-xl font-bold text-strong"
          >
            {planilla.titulo}
          </h2>
          <div className="mt-6 space-y-6">
            {planilla.campos.map((campo) => (
              <Campo
                key={campo.id}
                campo={campo}
                nivel={1}
                respuestas={respuestas}
                onCambio={responder}
                textos={textos.planilla}
                prefijoId={idBase}
              />
            ))}
          </div>
          <p className="mt-6 text-sm text-muted italic">{textos.aviso}</p>
          {/* En pantallas chicas el panel queda abajo: esta barra deja ver el
              puntaje mientras se responde. El anuncio accesible está en el panel. */}
          <div
            aria-hidden="true"
            className="sticky bottom-4 mt-6 flex items-center justify-between rounded-xl border border-line bg-surface-2/95 px-4 py-3 shadow-lg backdrop-blur lg:hidden"
          >
            <span className="text-sm font-medium text-muted">
              {textos.puntaje.titulo}
            </span>
            <span
              className={`font-mono text-lg font-bold ${
                fallaCritica
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-strong'
              }`}
            >
              {resultado.puntaje} / {resultado.total}
            </span>
          </div>
        </form>

        <aside
          aria-labelledby={`${idBase}-puntaje`}
          className="rounded-2xl border border-line bg-surface p-5 lg:sticky lg:top-24"
        >
          <h2
            id={`${idBase}-puntaje`}
            className="text-sm font-semibold text-muted"
          >
            {textos.puntaje.titulo}
          </h2>
          <p className="mt-2 flex items-baseline gap-2">
            <span
              className={`font-mono text-5xl font-bold ${
                fallaCritica
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-strong'
              }`}
            >
              {resultado.puntaje}
            </span>
            <span className="text-muted">
              {interpolar(textos.puntaje.de, { total: resultado.total })}
            </span>
          </p>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2"
            aria-hidden="true"
          >
            <div
              className={`h-full rounded-full transition-[width] motion-reduce:transition-none ${
                fallaCritica ? 'bg-rose-500' : 'bg-sky-500'
              }`}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-muted">
            {interpolar(textos.puntaje.respondidos, {
              r: resultado.respondidos,
              e: resultado.evaluables
            })}
          </p>

          {fallaCritica && (
            <div className="mt-4 rounded-lg border border-rose-500/50 bg-rose-500/10 p-3 text-sm">
              <p className="font-semibold text-strong">
                {textos.puntaje.criticoTitulo}
              </p>
              <p className="mt-1">
                {interpolar(textos.puntaje.criticoTexto, {
                  etiqueta: fallaCritica.etiqueta
                })}
              </p>
            </div>
          )}

          <h3 className="mt-5 text-sm font-semibold text-strong">
            {textos.puntaje.descuentos}
          </h3>
          {resultado.descuentos.length === 0 ? (
            <p className="mt-1 text-sm text-muted">
              {textos.puntaje.sinDescuentos}
            </p>
          ) : (
            <ul className="mt-2 space-y-1.5 text-sm">
              {resultado.descuentos.map((d) => (
                <li key={d.id} className="flex justify-between gap-3">
                  <span>{d.etiqueta}</span>
                  <span className="shrink-0 font-mono text-rose-600 dark:text-rose-400">
                    −{d.peso}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <p className="sr-only" aria-live="polite">
            {interpolar(textos.puntaje.anuncio, {
              p: resultado.puntaje,
              t: resultado.total
            })}
          </p>
        </aside>
      </div>

      <section
        aria-labelledby={`${idBase}-editor`}
        className="rounded-2xl border border-line bg-surface p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id={`${idBase}-editor`} className="text-xl font-bold text-strong">
            {textos.editor.titulo}
          </h2>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => errores.length === 0 && setTexto(aTexto(planilla))}
              disabled={errores.length > 0}
              className="rounded-lg border border-line px-3 py-2 text-sm font-semibold text-strong hover:bg-surface-2 disabled:opacity-50"
            >
              {textos.editor.formatear}
            </button>
            <button
              type="button"
              onClick={restaurar}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-accent hover:underline"
            >
              {textos.editor.restaurar}
            </button>
          </div>
        </div>
        <p id={`${idBase}-ayuda`} className="mt-2 text-sm text-muted">
          {textos.editor.ayuda}
        </p>
        <label htmlFor={`${idBase}-json`} className="sr-only">
          {textos.editor.etiqueta}
        </label>
        <textarea
          id={`${idBase}-json`}
          value={texto}
          onChange={(e) => editar(e.target.value)}
          spellCheck={false}
          rows={22}
          aria-describedby={`${idBase}-ayuda ${idBase}-estado`}
          aria-invalid={errores.length > 0}
          className="mt-4 w-full rounded-lg border border-line bg-bg p-3 font-mono text-xs leading-relaxed text-strong focus:border-accent focus:outline-none sm:text-sm"
        />
        <div
          id={`${idBase}-estado`}
          aria-live="polite"
          className="mt-3 text-sm"
        >
          {errores.length === 0 ? (
            <p className="text-emerald-700 dark:text-emerald-400">
              {textos.editor.valido}
            </p>
          ) : (
            <div className="rounded-lg border border-rose-500/50 bg-rose-500/10 p-3">
              <p className="font-semibold text-strong">
                {textos.editor.invalido}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {errores.slice(0, 8).map((e, i) => (
                  <li key={i}>{describir(e)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
