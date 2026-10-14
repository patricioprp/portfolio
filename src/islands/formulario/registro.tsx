import type { ComponentType, ReactNode } from 'react'
import type { Campo, TipoCampo, Valor } from '@/lib/formularios/types'
import type { Diccionario } from '@/i18n'
import { interpolar } from '../compartido/formato'

export type TextosPlanilla = Diccionario['demoFormulario']['planilla']

export interface PropsCampo {
  campo: Campo
  valor: Valor | undefined
  onCambio: (valor: Valor | undefined) => void
  textos: TextosPlanilla
  idDom: string
}

const control =
  'mt-2 w-full rounded-md border border-line bg-bg px-3 py-2 text-strong focus:border-accent focus:outline-none'

/** Etiqueta del campo con sus marcas de puntaje (crítico, descuento). */
function Encabezado({
  campo,
  textos
}: Pick<PropsCampo, 'campo' | 'textos'>): ReactNode {
  return (
    <span className="flex flex-wrap items-center gap-2 font-medium text-strong">
      {campo.etiqueta}
      {campo.critico && (
        <span className="rounded-full bg-rose-500/15 px-2 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
          {textos.critico}
        </span>
      )}
      {(campo.peso ?? 0) > 0 && (
        <span className="rounded-full bg-surface-2 px-2 py-0.5 font-mono text-xs text-muted">
          {interpolar(textos.descuenta, { n: campo.peso ?? 0 })}
        </span>
      )}
    </span>
  )
}

function CampoSiNo({ campo, valor, onCambio, textos, idDom }: PropsCampo) {
  return (
    <fieldset>
      <legend>
        <Encabezado campo={campo} textos={textos} />
      </legend>
      <div className="mt-2 flex gap-2">
        {(['si', 'no'] as const).map((opcion) => (
          <label
            key={opcion}
            className="flex cursor-pointer items-center gap-2 rounded-md border border-line px-4 py-2 has-checked:border-accent has-checked:bg-accent-soft"
          >
            <input
              type="radio"
              name={idDom}
              value={opcion}
              checked={valor === opcion}
              onChange={() => onCambio(opcion)}
              className="accent-sky-600"
            />
            {opcion === 'si' ? textos.si : textos.no}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

function CampoCheckbox({ campo, valor, onCambio, textos, idDom }: PropsCampo) {
  return (
    <label htmlFor={idDom} className="flex cursor-pointer items-start gap-3">
      <input
        id={idDom}
        type="checkbox"
        checked={valor === true}
        onChange={(e) => onCambio(e.target.checked)}
        className="mt-1 size-4 accent-sky-600"
      />
      <Encabezado campo={campo} textos={textos} />
    </label>
  )
}

function CampoSeleccion({ campo, valor, onCambio, textos, idDom }: PropsCampo) {
  return (
    <div>
      <label htmlFor={idDom}>
        <Encabezado campo={campo} textos={textos} />
      </label>
      <select
        id={idDom}
        value={typeof valor === 'string' ? valor : ''}
        onChange={(e) => onCambio(e.target.value || undefined)}
        className={control}
      >
        <option value="">{textos.elegir}</option>
        {campo.opciones?.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.etiqueta}
          </option>
        ))}
      </select>
    </div>
  )
}

function CampoTexto({ campo, valor, onCambio, textos, idDom }: PropsCampo) {
  return (
    <div>
      <label htmlFor={idDom}>
        <Encabezado campo={campo} textos={textos} />
      </label>
      <textarea
        id={idDom}
        rows={3}
        value={typeof valor === 'string' ? valor : ''}
        onChange={(e) => onCambio(e.target.value)}
        className={control}
      />
    </div>
  )
}

/**
 * Registro de componentes: cada tipo de campo del JSON tiene su componente.
 * Es el reemplazo directo de lo que hacía Blade en el servidor.
 */
export const registro: Record<TipoCampo, ComponentType<PropsCampo>> = {
  'si-no': CampoSiNo,
  checkbox: CampoCheckbox,
  seleccion: CampoSeleccion,
  texto: CampoTexto
}
