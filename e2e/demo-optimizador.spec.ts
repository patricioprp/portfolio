import { expect, test } from '@playwright/test'

test.describe('demo: optimizador de cortes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos/optimizador-viguetas/')
    // Astro quita el atributo `ssr` cuando la isla termina de hidratarse; antes
    // de eso, lo que se escribe en los campos no llega al estado de React.
    await page.locator('astro-island:not([ssr])').waitFor()
  })

  test('resuelve el ejemplo en el navegador y muestra el plan óptimo', async ({
    page
  }) => {
    const errores: string[] = []
    page.on('pageerror', (e) => errores.push(e.message))

    await page.getByRole('button', { name: 'Optimizar' }).click()
    await expect(
      page.getByRole('heading', { level: 2, name: 'Plan óptimo' })
    ).toBeVisible({ timeout: 30_000 })

    const kpis = page.locator('dl').first()
    await expect(kpis).toContainText('103,5')
    await expect(kpis).toContainText('24')
    await expect(kpis).toContainText('8 jornadas')
    await expect(page.getByText('Banco de acero grueso')).toBeVisible()
    await expect(page.getByText('200 patrones de corte')).toBeVisible()
    expect(errores).toEqual([])
  })

  test('muestra errores de validación sin llamar al solver', async ({
    page
  }) => {
    await page.getByLabel('Largo (m) · V10').fill('40')
    await page.getByRole('button', { name: 'Optimizar' }).click()
    await expect(page.getByRole('alert')).toContainText(
      'La medida V10 es más larga que la fila de 33 m.'
    )
  })

  test('se puede restaurar el ejemplo', async ({ page }) => {
    const demanda = page.getByLabel('Demanda · V3')
    await demanda.fill('999')
    await page.getByRole('button', { name: 'Restaurar ejemplo' }).click()
    await expect(demanda).toHaveValue('150')
  })
})

test('la home y el caso enlazan a la demo', async ({ page }) => {
  await page.goto('/')
  await expect(
    page
      .locator('#demos')
      .getByRole('link', { name: 'Optimizador de cortes de viguetas' })
  ).toHaveAttribute('href', '/demos/optimizador-viguetas/')

  await page.goto('/casos/optimizador-viguetas/')
  await expect(
    page.getByRole('link', { name: 'Abrir la demo' })
  ).toHaveAttribute('href', '/demos/optimizador-viguetas/')
})
