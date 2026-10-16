// Dibuja los diagramas Mermaid de docs/guia-ia/ como SVG (versión clara y
// oscura) en public/guia/diagramas/<hash>-{claro,oscuro}.svg.
// Los SVG se versionan: el build de Netlify no necesita un navegador.
// Uso: npm run diagramas   (ver docs/adr/0006-diagramas-mermaid-pre-renderizados.md)
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from '@playwright/test'
import {
  extraerDiagramas,
  hashDiagrama,
  tituloAccesible
} from '../src/lib/guia/guia.ts'

const raiz = process.cwd()
const origen = join(raiz, 'docs/guia-ia')
const destino = join(raiz, 'public/guia/diagramas')
const mermaid = join(raiz, 'node_modules/mermaid/dist/mermaid.min.js')

// Colores de los tokens de src/styles/global.css.
const fuente = 'Arial, Helvetica, sans-serif'
const TEMAS = {
  claro: {
    darkMode: false,
    background: 'transparent',
    fontFamily: fuente,
    primaryColor: '#e0f2fe',
    primaryBorderColor: '#0369a1',
    primaryTextColor: '#0f172a',
    secondaryColor: '#f1f5f9',
    secondaryBorderColor: '#5b6b80',
    secondaryTextColor: '#0f172a',
    tertiaryColor: '#ffffff',
    tertiaryBorderColor: '#e2e8f0',
    tertiaryTextColor: '#0f172a',
    lineColor: '#5b6b80',
    textColor: '#0f172a',
    clusterBkg: '#f8fafc',
    clusterBorder: '#94a3b8',
    edgeLabelBackground: '#ffffff',
    actorBkg: '#e0f2fe',
    actorBorder: '#0369a1',
    actorTextColor: '#0f172a',
    actorLineColor: '#5b6b80',
    signalColor: '#334155',
    signalTextColor: '#0f172a',
    labelBoxBkgColor: '#f1f5f9',
    labelBoxBorderColor: '#5b6b80',
    labelTextColor: '#0f172a',
    loopTextColor: '#0f172a',
    noteBkgColor: '#fef9c3',
    noteBorderColor: '#a16207',
    noteTextColor: '#0f172a',
    activationBkgColor: '#f1f5f9',
    activationBorderColor: '#5b6b80'
  },
  oscuro: {
    darkMode: true,
    background: 'transparent',
    fontFamily: fuente,
    primaryColor: '#1e293b',
    primaryBorderColor: '#38bdf8',
    primaryTextColor: '#ffffff',
    secondaryColor: '#172033',
    secondaryBorderColor: '#94a3b8',
    secondaryTextColor: '#ffffff',
    tertiaryColor: '#0f172a',
    tertiaryBorderColor: '#334155',
    tertiaryTextColor: '#ffffff',
    lineColor: '#94a3b8',
    textColor: '#e2e8f0',
    clusterBkg: '#172033',
    clusterBorder: '#475569',
    edgeLabelBackground: '#0f172a',
    actorBkg: '#1e293b',
    actorBorder: '#38bdf8',
    actorTextColor: '#ffffff',
    actorLineColor: '#94a3b8',
    signalColor: '#cbd5e1',
    signalTextColor: '#ffffff',
    labelBoxBkgColor: '#172033',
    labelBoxBorderColor: '#94a3b8',
    labelTextColor: '#ffffff',
    loopTextColor: '#ffffff',
    noteBkgColor: '#422006',
    noteBorderColor: '#facc15',
    noteTextColor: '#fef9c3',
    activationBkgColor: '#334155',
    activationBorderColor: '#94a3b8'
  }
}

// 1. Juntar los bloques mermaid de todos los Markdown de la guía.
const bloques = new Map()
const errores = []
for (const archivo of (await readdir(origen)).filter((a) =>
  a.endsWith('.md')
)) {
  const texto = await readFile(join(origen, archivo), 'utf8')
  // La misma función que usa el sitio: los dos encuentran los mismos bloques.
  for (const codigo of extraerDiagramas(texto)) {
    if (!tituloAccesible(codigo)) {
      errores.push(
        `${archivo}: diagrama sin "accTitle:" → ${codigo.trim().split('\n')[0]}`
      )
    }
    bloques.set(hashDiagrama(codigo), { archivo, codigo })
  }
}
if (errores.length) {
  console.error(
    'Cada diagrama necesita "accTitle: <texto alternativo>":\n' +
      errores.join('\n')
  )
  process.exit(1)
}

// 2. Dibujar cada diagrama en Chromium con Mermaid.
await mkdir(destino, { recursive: true })
const navegador = await chromium.launch()
try {
  const pagina = await navegador.newPage()
  await pagina.setContent('<!doctype html><html><body></body></html>')
  await pagina.addScriptTag({ path: mermaid })

  for (const [tema, variables] of Object.entries(TEMAS)) {
    for (const [hash, { archivo, codigo }] of bloques) {
      const svg = await pagina
        .evaluate(
          async ({ codigo, variables, id }) => {
            window.mermaid.initialize({
              startOnLoad: false,
              theme: 'base',
              themeVariables: variables,
              htmlLabels: false,
              flowchart: { htmlLabels: false },
              securityLevel: 'strict'
            })
            const { svg } = await window.mermaid.render(id, codigo)
            return svg
          },
          { codigo, variables, id: `g${hash}${tema}` }
        )
        .catch((e) => {
          throw new Error(
            `${archivo}: no se pudo dibujar el diagrama ${hash}: ${e.message}`
          )
        })

      // Tamaño intrínseco (para <img width height>) a partir del viewBox.
      const vb = /viewBox="[-\d.]+ [-\d.]+ ([\d.]+) ([\d.]+)"/.exec(svg)
      if (!vb) throw new Error(`${archivo}: SVG sin viewBox (${hash})`)
      const [ancho, alto] = [Math.ceil(Number(vb[1])), Math.ceil(Number(vb[2]))]
      const final = svg
        .replace(
          /<svg([^>]*?) width="100%"/,
          `<svg$1 width="${ancho}" height="${alto}"`
        )
        .replace(/ style="max-width:[^"]*"/, '')
      await writeFile(join(destino, `${hash}-${tema}.svg`), final)
    }
  }
} finally {
  await navegador.close()
}

// 3. Borrar los SVG de diagramas que ya no existen.
const vigentes = new Set(
  [...bloques.keys()].flatMap((h) => [`${h}-claro.svg`, `${h}-oscuro.svg`])
)
let borrados = 0
for (const a of await readdir(destino)) {
  if (!vigentes.has(a)) {
    await rm(join(destino, a))
    borrados++
  }
}
console.log(
  `${bloques.size} diagramas dibujados (claro y oscuro); ${borrados} SVG viejos borrados.`
)
