// Hook SessionStart: al abrir una sesión, le da a Claude el estado actual
// (rama, cambios sin commitear y próximas tareas del roadmap) sin gastar
// turnos en averiguarlo. Lo que se imprime en stdout entra como contexto.

import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { raiz } from './leer-entrada.mjs'

const correr = (cmd) => {
  try {
    return execSync(cmd, { cwd: raiz, encoding: 'utf8' }).trim()
  } catch {
    return ''
  }
}

const rama = correr('git branch --show-current')
const cambios = correr('git status --short').split('\n').filter(Boolean)

let pendientes = []
try {
  pendientes = readFileSync(path.join(raiz, 'docs/ROADMAP.md'), 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.trimStart().startsWith('- [ ]'))
    .slice(0, 8)
    .map((l) => l.trim().replace('- [ ] ', '· '))
} catch {
  // Sin roadmap no hay nada que informar.
}

const lineas = [
  `Rama: ${rama || '(desconocida)'} · archivos con cambios: ${cambios.length}`,
  pendientes.length
    ? `Pendientes en docs/ROADMAP.md:\n${pendientes.join('\n')}`
    : 'Sin pendientes en docs/ROADMAP.md.'
]
process.stdout.write(lineas.join('\n') + '\n')
