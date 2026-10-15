// Utilidades compartidas por los hooks de Claude Code.
// Claude Code manda por stdin un JSON con el evento (tool_name, tool_input, ...).

import { readFileSync } from 'node:fs'
import path from 'node:path'

export function leerEntrada() {
  try {
    return JSON.parse(readFileSync(0, 'utf8') || '{}')
  } catch {
    return {}
  }
}

export const raiz = process.env.CLAUDE_PROJECT_DIR ?? process.cwd()

/** Ruta relativa a la raíz del proyecto, con barras normales. */
export function rutaRelativa(archivo) {
  if (!archivo) return ''
  return path.relative(raiz, path.resolve(raiz, archivo)).replaceAll('\\', '/')
}
