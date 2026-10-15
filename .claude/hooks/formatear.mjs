// Hook PostToolUse (Edit|Write): aplica Prettier al archivo recién editado.
// Así el formato no depende de que Claude "se acuerde": es determinístico.

import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { leerEntrada, raiz, rutaRelativa } from './leer-entrada.mjs'

const entrada = leerEntrada()
const archivo = rutaRelativa(
  entrada.tool_input?.file_path ?? entrada.tool_response?.filePath
)
const formateables = /\.(astro|ts|tsx|js|mjs|cjs|json|md|mdx|css|ya?ml)$/

if (archivo && !archivo.startsWith('..') && formateables.test(archivo)) {
  // --ignore-unknown y .prettierignore evitan tocar lo que no corresponde.
  // Se llama al binario local con el mismo Node: sin shell ni npx, anda
  // igual en Windows, macOS y Linux.
  const prettier = path.join(raiz, 'node_modules/prettier/bin/prettier.cjs')
  if (!existsSync(prettier)) process.exit(0)
  const r = spawnSync(
    process.execPath,
    [prettier, '--write', '--ignore-unknown', '--log-level', 'warn', archivo],
    { cwd: raiz, encoding: 'utf8' }
  )
  if (r.status !== 0) {
    // No bloquea: avisa a Claude para que corrija la sintaxis.
    process.stderr.write(`Prettier no pudo formatear ${archivo}:\n${r.stderr}`)
    process.exit(2)
  }
}
