// Genera public/og/default.png (1200x630) con Chromium de Playwright.
// Uso: npm run og
import { mkdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from '@playwright/test'

const raiz = process.cwd()
// Las fuentes van como data URI: Chromium no carga file:// desde setContent.
const fuente = async (paquete, archivo) => {
  const datos = await readFile(
    join(raiz, 'node_modules', paquete, 'files', archivo)
  )
  return `data:font/woff2;base64,${datos.toString('base64')}`
}
const inter = await fuente(
  '@fontsource-variable/inter',
  'inter-latin-wght-normal.woff2'
)
const mono = await fuente(
  '@fontsource-variable/jetbrains-mono',
  'jetbrains-mono-latin-wght-normal.woff2'
)

const html = `<!doctype html>
<html>
<head>
<style>
  @font-face { font-family: Inter; src: url('${inter}'); font-weight: 100 900; }
  @font-face { font-family: Mono; src: url('${mono}'); font-weight: 100 800; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; background: #0f172a; color: #cbd5e1;
         font-family: Inter; padding: 80px; display: flex; flex-direction: column;
         justify-content: space-between; position: relative; overflow: hidden; }
  .glow { position: absolute; top: -260px; right: -200px; width: 760px; height: 760px;
          border-radius: 50%; background: radial-gradient(circle, rgba(14,165,233,.28), transparent 65%); }
  .logo { font-family: Mono; font-size: 30px; font-weight: 700; color: #38bdf8; }
  .logo span { color: #fff; }
  h1 { font-size: 76px; font-weight: 800; color: #fff; letter-spacing: -2px; line-height: 1.05; }
  .rol { font-family: Mono; font-size: 30px; color: #38bdf8; margin-top: 18px; }
  .prop { font-size: 32px; margin-top: 34px; max-width: 900px; line-height: 1.3; }
  .pie { display: flex; gap: 14px; }
  .tag { font-family: Mono; font-size: 22px; border: 1px solid #334155; background: #1e293b;
         border-radius: 10px; padding: 8px 16px; }
</style>
</head>
<body>
  <div class="glow"></div>
  <div class="logo">PRP<span>.dev</span></div>
  <div>
    <h1>Patricio Rolando Polito</h1>
    <div class="rol">Frontend Senior · Ingeniero en Sistemas</div>
    <div class="prop">Convierto procesos operativos en software que ahorra tiempo y dinero.</div>
  </div>
  <div class="pie">
    <span class="tag">React</span><span class="tag">TypeScript</span>
    <span class="tag">Node.js</span><span class="tag">Laravel</span>
  </div>
</body>
</html>`

const navegador = await chromium.launch()
const pagina = await navegador.newPage({
  viewport: { width: 1200, height: 630 }
})
await pagina.setContent(html, { waitUntil: 'load' })
await pagina.evaluate(() => document.fonts.ready)
await mkdir(join(raiz, 'public', 'og'), { recursive: true })
await pagina.screenshot({ path: join(raiz, 'public', 'og', 'default.png') })
await navegador.close()
console.log('OG generada en public/og/default.png')
