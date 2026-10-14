// Web Worker: carga HiGHS (WebAssembly) bajo demanda y resuelve fuera del hilo
// principal para no bloquear la interfaz.
import highsLoader from 'highs'
import wasmUrl from 'highs/runtime?url'
import {
  ejecutarOptimizacion,
  type PedidoOptimizacion,
  type RespuestaOptimizacion
} from './ejecutar'
import { crearSolverHighs } from './solver/highs'

const solver = crearSolverHighs(() =>
  highsLoader({ locateFile: () => wasmUrl })
)

const responder = (respuesta: RespuestaOptimizacion) =>
  (
    self as unknown as { postMessage(m: RespuestaOptimizacion): void }
  ).postMessage(respuesta)

self.addEventListener('message', (evento: MessageEvent<PedidoOptimizacion>) => {
  ejecutarOptimizacion(evento.data, solver)
    .then(responder)
    .catch((e: unknown) =>
      responder({
        tipo: 'error',
        detalle: e instanceof Error ? e.message : String(e)
      })
    )
})
