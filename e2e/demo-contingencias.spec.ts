import { expect, test, type Page } from '@playwright/test'

const portal = (page: Page) =>
  page.getByRole('region', { name: 'Vista del socio' })

test.describe('demo: simulador de contingencias', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos/contingencias/')
    await page.locator('astro-island:not([ssr])').waitFor()
  })

  test('apaga y prende trámites sin afectar al resto', async ({ page }) => {
    const tarjeta = (nombre: string) =>
      portal(page).getByRole('listitem').filter({ hasText: nombre })

    await expect(tarjeta('Reintegros')).toContainText('No disponible')
    await expect(tarjeta('Autorizaciones')).toContainText('Disponible')

    await page.getByRole('checkbox', { name: 'Autorizaciones' }).check()
    await expect(tarjeta('Autorizaciones')).toContainText('No disponible')

    await page.getByRole('checkbox', { name: 'Reintegros' }).uncheck()
    await expect(tarjeta('Reintegros')).not.toContainText('No disponible')
  })

  test('el mantenimiento total forzado reemplaza todo el portal', async ({
    page
  }) => {
    await page.getByRole('checkbox', { name: 'Forzar ahora' }).check()
    await expect(portal(page)).toContainText('Estamos haciendo mejoras')
    await expect(portal(page).getByRole('listitem')).toHaveCount(0)
  })

  test('el aviso programado se anuncia, entra en curso y desaparece al pasar la hora', async ({
    page
  }) => {
    const reloj = page.getByRole('slider', { name: 'Hora simulada' })
    await expect(portal(page)).toContainText('Mantenimiento programado')

    await reloj.fill('4')
    await expect(portal(page)).toContainText('Mantenimiento en curso')

    await reloj.fill('8')
    await expect(portal(page)).not.toContainText('Mantenimiento')
  })

  test('una ventana con fin anterior al inicio muestra un error', async ({
    page
  }) => {
    await page.getByLabel('Hasta').fill('2020-01-01T00:00')
    await expect(
      page.getByText('La fecha de fin tiene que ser posterior a la de inicio.')
    ).toBeVisible()
  })
})

test('la home y el caso enlazan al simulador', async ({ page }) => {
  await page.goto('/')
  await expect(
    page
      .locator('#demos')
      .getByRole('link', { name: 'Simulador de contingencias' })
  ).toHaveAttribute('href', '/demos/contingencias/')
  await page.goto('/casos/portal-tramites/')
  await expect(
    page.getByRole('link', { name: 'Abrir la demo' })
  ).toHaveAttribute('href', '/demos/contingencias/')
})
