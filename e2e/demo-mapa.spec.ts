import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

const mapa = (page: Page) =>
  page.getByRole('application', { name: /Mapa de beneficios/ })

/** En mobile el listado está en otra pestaña; en desktop se ven las dos vistas. */
async function irAlListado(page: Page, isMobile: boolean) {
  if (isMobile) await page.getByRole('button', { name: 'Listado' }).click()
}

test.describe('demo: mapa de beneficios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos/mapa-beneficios/')
    await page.locator('astro-island:not([ssr])').waitFor()
  })

  test('un cluster muestra la cantidad y al tocarlo acerca el mapa', async ({
    page
  }) => {
    await page.getByRole('button', { name: 'Alejar' }).click()
    const cluster = mapa(page)
      .getByRole('button', { name: /comercios en esta zona/ })
      .first()
    await expect(cluster).toBeVisible()
    const antes = await mapa(page)
      .getByRole('button', { name: /comercios en esta zona/ })
      .count()
    await cluster.click()
    await expect
      .poll(() =>
        mapa(page)
          .getByRole('button', { name: /comercios en esta zona/ })
          .count()
      )
      .toBeLessThan(antes + 1)
  })

  test('"Ver en mapa" abre el carrusel de un edificio compartido', async ({
    page,
    isMobile
  }) => {
    await irAlListado(page, isMobile)
    await page
      .getByRole('listitem')
      .filter({ hasText: 'Café Central' })
      .getByRole('button', { name: 'Ver en mapa' })
      .click()
    const carrusel = mapa(page).getByRole('region', {
      name: '4 comercios en el mismo lugar'
    })
    await expect(carrusel).toBeVisible()
    await expect(carrusel).toContainText('Café Central')
    await carrusel.getByRole('button', { name: 'Comercio siguiente' }).click()
    await expect(carrusel).toContainText('2 de 4')
  })

  test('el recorrido llega del detalle al cupón', async ({
    page,
    isMobile
  }) => {
    await irAlListado(page, isMobile)
    await page
      .getByRole('listitem')
      .filter({ hasText: 'Óptica Norte' })
      .getByRole('button', { name: 'Ver detalle' })
      .click()
    const dialogo = page.getByRole('dialog')
    await expect(dialogo).toContainText('20% de descuento')
    await dialogo.getByRole('button', { name: 'Ver código QR' }).click()
    await expect(
      dialogo.getByRole('img', { name: /QR ilustrativo/ })
    ).toBeVisible()
    await dialogo.getByRole('button', { name: 'Generar cupón' }).click()
    await expect(dialogo).toContainText('¡Cupón listo!')
    await expect(dialogo).toContainText(/BEN-\w{3}-\w{3}/)
    await dialogo.getByRole('button', { name: 'Listo' }).click()
    await expect(dialogo).toBeHidden()
  })

  test('"Buscar en esta zona" filtra los resultados por el área visible', async ({
    page
  }) => {
    const total = page.getByText(/^\d+ comercios$/)
    await expect(total).toHaveText('20 comercios')
    await mapa(page).focus()
    await page.keyboard.press('+')
    await page.keyboard.press('+')
    await page.getByRole('button', { name: 'Buscar en esta zona' }).click()
    await expect(
      page.getByText('Mostrando solo esta zona del mapa')
    ).toBeVisible()
    await expect
      .poll(async () => Number((await total.textContent())?.split(' ')[0]))
      .toBeLessThan(20)
    await page.getByRole('button', { name: 'Ver todos los resultados' }).click()
    await expect(total).toHaveText('20 comercios')
  })

  test('el carrusel y el canje abiertos no tienen problemas de accesibilidad', async ({
    page,
    isMobile
  }) => {
    test.skip(isMobile, 'se analiza en desktop')
    await page
      .getByRole('listitem')
      .filter({ hasText: 'Café Central' })
      .getByRole('button', { name: 'Ver en mapa' })
      .click()
    const conCarrusel = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(conCarrusel.violations.map((v) => v.id)).toEqual([])
    await mapa(page).getByRole('button', { name: 'Ver detalle' }).click()
    const conDialogo = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(conDialogo.violations.map((v) => v.id)).toEqual([])
  })
})

test('la home y el caso enlazan a la demo del mapa', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.locator('#demos').getByRole('link', { name: 'Mapa de beneficios' })
  ).toHaveAttribute('href', '/demos/mapa-beneficios/')
  await page.goto('/casos/mapa-beneficios/')
  await expect(
    page.getByRole('link', { name: 'Abrir la demo' })
  ).toHaveAttribute('href', '/demos/mapa-beneficios/')
})
