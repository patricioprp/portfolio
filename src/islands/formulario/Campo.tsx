import type {
  Campo as TipoCampo,
  Respuestas,
  Valor
} from '@/lib/formularios/types'
import { cumpleCondicion } from '@/lib/formularios/visibilidad'
import { interpolar } from '../compartido/formato'
import { registro, type TextosPlanilla } from './registro'

interface Props {
  campo: TipoCampo
  nivel: number
  respuestas: Respuestas
  onCambio: (id: string, valor: Valor | undefined) => void
  textos: TextosPlanilla
  prefijoId: string
}

/**
 * Dibuja un campo con el componente de su tipo y, si la respuesta cumple la
 * condición, se llama a sí mismo con los hijos. Así dibuja cualquier
 * profundidad sin cambiar código.
 */
export function Campo({
  campo,
  nivel,
  respuestas,
  onCambio,
  textos,
  prefijoId
}: Props) {
  const Componente = registro[campo.tipo]
  const valor = respuestas[campo.id]
  const mostrarHijos = cumpleCondicion(campo, valor)

  return (
    <div
      className={
        nivel > 1 ? 'border-l-2 border-sky-500/40 pl-4 sm:pl-5' : undefined
      }
    >
      {nivel > 1 && (
        <p className="mb-1 font-mono text-[11px] tracking-wider text-accent uppercase">
          {interpolar(textos.nivel, { n: nivel })}
        </p>
      )}
      <Componente
        campo={campo}
        valor={valor}
        onCambio={(v) => onCambio(campo.id, v)}
        textos={textos}
        idDom={`${prefijoId}-${campo.id}`}
      />
      {mostrarHijos && (
        <div className="mt-4 space-y-5">
          {campo.hijos?.map((hijo) => (
            <Campo
              key={hijo.id}
              campo={hijo}
              nivel={nivel + 1}
              respuestas={respuestas}
              onCambio={onCambio}
              textos={textos}
              prefijoId={prefijoId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
