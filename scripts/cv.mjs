// Genera los CV en PDF (A4) a partir del contenido del sitio.
// Levanta Astro en modo desarrollo, abre src/pages/cv/[idioma].astro con
// Chromium y guarda public/cv/CV_Patricio_Polito_{ES,EN}.pdf.
// Uso: npm run cv
import { mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { dev } from 'astro'
import { chromium } from '@playwright/test'

const raiz = process.cwd()
const PUERTO = 4398

const servidor = await dev({
  root: raiz,
  logLevel: 'error',
  devToolbar: { enabled: false },
  server: { port: PUERTO, host: '127.0.0.1' }
})

const navegador = await chromium.launch()
try {
  const pagina = await navegador.newPage()
  // En desarrollo, Vite puede recargar la página la primera vez que optimiza
  // dependencias; por eso se reintenta.
  const abrir = async (ruta, intentos = 3) => {
    try {
      const r = await pagina.goto(`http://127.0.0.1:${PUERTO}${ruta}`, {
        waitUntil: 'networkidle'
      })
      if (!r?.ok()) throw new Error(`No se pudo abrir ${ruta}`)
      await pagina.evaluate(() => document.fonts.ready)
    } catch (e) {
      if (intentos <= 1) throw e
      await abrir(ruta, intentos - 1)
    }
  }

  await mkdir(join(raiz, 'public', 'cv'), { recursive: true })
  for (const idioma of ['es', 'en']) {
    await abrir(`/cv/${idioma}/`)
    const destino = `cv/CV_Patricio_Polito_${idioma.toUpperCase()}.pdf`
    await pagina.pdf({
      path: join(raiz, 'public', destino),
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    })
    console.log(`✓ public/${destino}`)
  }
} finally {
  await navegador.close()
  await servidor.stop()
}
