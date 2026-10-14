// Genera las imágenes Open Graph (1200 × 630) de todas las páginas.
// Levanta Astro en modo desarrollo, abre la plantilla src/pages/og/ con
// Chromium y guarda cada captura en public/og/<idioma>/<pagina>.png.
// Uso: npm run og
import { mkdir, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { dev } from 'astro'
import { chromium } from '@playwright/test'

const raiz = process.cwd()
const PUERTO = 4399

const sinExtension = (archivos, ext) =>
  archivos.filter((a) => a.endsWith(ext)).map((a) => a.slice(0, -ext.length))

const casos = sinExtension(
  await readdir(join(raiz, 'src/content/casos/es')),
  '.mdx'
)
const demos = sinExtension(
  await readdir(join(raiz, 'src/pages/demos')),
  '.astro'
)
const paginas = ['es', 'en'].flatMap((idioma) => [
  `${idioma}/inicio`,
  ...casos.map((c) => `${idioma}/casos/${c}`),
  ...demos.map((d) => `${idioma}/demos/${d}`)
])

const servidor = await dev({
  root: raiz,
  logLevel: 'error',
  devToolbar: { enabled: false },
  server: { port: PUERTO, host: '127.0.0.1' }
})

const navegador = await chromium.launch()
try {
  const pagina = await navegador.newPage({
    viewport: { width: 1200, height: 630 }
  })
  // En desarrollo, Vite puede recargar la página la primera vez que optimiza
  // dependencias; por eso se reintenta.
  const abrir = async (ruta, intentos = 3) => {
    try {
      const r = await pagina.goto(`http://127.0.0.1:${PUERTO}/og/${ruta}/`, {
        waitUntil: 'networkidle'
      })
      if (!r?.ok()) throw new Error(`No se pudo abrir /og/${ruta}/`)
      await pagina.evaluate(() => document.fonts.ready)
    } catch (e) {
      if (intentos <= 1) throw e
      await abrir(ruta, intentos - 1)
    }
  }

  for (const ruta of paginas) {
    await abrir(ruta)
    const destino = join(raiz, 'public', 'og', `${ruta}.png`)
    await mkdir(dirname(destino), { recursive: true })
    await pagina.locator('#tarjeta').screenshot({ path: destino })
    console.log(`✓ public/og/${ruta}.png`)
  }
} finally {
  await navegador.close()
  await servidor.stop()
}
