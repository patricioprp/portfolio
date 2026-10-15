// Hook PreToolUse (Edit|Write): bloquea cambios que no deberían pasar nunca.
// Salir con código 2 cancela la herramienta y le muestra el motivo a Claude.

import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { leerEntrada, raiz, rutaRelativa } from './leer-entrada.mjs'

const entrada = leerEntrada()
const archivo = rutaRelativa(entrada.tool_input?.file_path)
if (!archivo || archivo.startsWith('..')) process.exit(0)

const bloquear = (motivo) => {
  process.stderr.write(
    `Bloqueado por .claude/hooks/proteger-archivos.mjs: ${motivo}\n`
  )
  process.exit(2)
}

// 1. Archivos generados o que no se editan a mano.
const generados = [
  ['dist/', 'es salida del build; cambiá el código fuente en src/'],
  ['.astro/', 'lo genera Astro'],
  ['legacy/', 'es la versión anterior, solo de referencia'],
  ['package-lock.json', 'se actualiza con npm install, no a mano']
]
for (const [prefijo, motivo] of generados) {
  if (archivo === prefijo || archivo.startsWith(prefijo)) {
    bloquear(`${archivo} ${motivo}.`)
  }
}
if (/(^|\/)\.env(\.|$)/.test(archivo) && !archivo.endsWith('.env.example')) {
  bloquear('los archivos .env no se editan desde Claude.')
}

// 2. Privacidad: el repositorio es público. Ningún término sensible puede
//    entrar en un archivo versionado (la lista vive fuera de git).
if (archivo.startsWith('docs/privado/')) process.exit(0)
const lista = path.join(raiz, 'docs/privado/terminos-sensibles.txt')
if (!existsSync(lista)) process.exit(0)

const terminos = readFileSync(lista, 'utf8')
  .split(/\r?\n/)
  .map((t) => t.trim())
  .filter((t) => t && !t.startsWith('#'))
const input = entrada.tool_input ?? {}
const texto = [input.content, input.new_string]
  .concat((input.edits ?? []).map((e) => e.new_string))
  .filter(Boolean)
  .join('\n')
  .toLowerCase()

const encontrado = terminos.find((t) => texto.includes(t.toLowerCase()))
if (encontrado) {
  // No se repite el término: el mensaje queda en el historial de la sesión.
  bloquear(
    `el cambio en ${archivo} contiene un término de docs/privado/terminos-sensibles.txt. Reescribilo sin datos privados (ver "Datos que nunca se publican" en CLAUDE.md).`
  )
}
