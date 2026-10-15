import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const PAGINAS = [
  '/',
  '/casos/portal-tramites/',
  '/demos/contingencias/',
  '/casos/mapa-beneficios/',
  '/demos/mapa-beneficios/',
  '/en/demos/mapa-beneficios/',
  '/en/case-studies/portal-tramites/',
  '/casos/formularios-dinamicos/',
  '/casos/acopio-planta/',
  '/casos/optimizador-viguetas/',
  '/demos/optimizador-viguetas/',
  '/demos/formulario-dinamico/',
  '/gracias/',
  '/en/',
  '/en/case-studies/optimizador-viguetas/',
  '/en/demos/optimizador-viguetas/',
  '/en/demos/formulario-dinamico/'
]

const TEMAS = ['light', 'dark'] as const

async function analizar(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze()
  return violations.map((v) => ({
    regla: v.id,
    impacto: v.impact,
    nodos: v.nodes.slice(0, 3).map((n) => n.target.join(' '))
  }))
}

// Una sola vez (desktop): los temas cambian los contrastes, no la estructura.
test.describe('accesibilidad (axe, WCAG 2.2 AA)', () => {
  test.skip(({ isMobile }) => isMobile, 'se analiza en desktop')

  for (const tema of TEMAS) {
    for (const ruta of PAGINAS) {
      test(`${ruta} · tema ${tema}`, async ({ page }) => {
        await page.addInitScript((t) => localStorage.setItem('tema', t), tema)
        await page.goto(ruta)
        await page.evaluate(() => document.fonts.ready)
        expect(await analizar(page)).toEqual([])
      })
    }

    test(`resultados del optimizador · tema ${tema}`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('tema', t), tema)
      await page.goto('/demos/optimizador-viguetas/')
      await page.locator('astro-island:not([ssr])').waitFor()
      await page.getByRole('button', { name: 'Optimizar' }).click()
      await page
        .getByRole('heading', { name: 'Plan óptimo' })
        .waitFor({ timeout: 30_000 })
      expect(await analizar(page)).toEqual([])
    })

    test(`formulario con niveles abiertos y error JSON · tema ${tema}`, async ({
      page
    }) => {
      await page.addInitScript((t) => localStorage.setItem('tema', t), tema)
      await page.goto('/demos/formulario-dinamico/')
      await page.locator('astro-island:not([ssr])').waitFor()
      await page
        .getByRole('group', { name: /Ofreció una solución/ })
        .getByLabel('Sí')
        .check()
      await page.getByLabel('La solución requirió derivar a otra área').check()
      await page
        .getByRole('group', { name: /Validó la identidad/ })
        .getByLabel('No')
        .check()
      await page.getByLabel('JSON de la planilla').fill('{ roto')
      expect(await analizar(page)).toEqual([])
    })
  }
})
