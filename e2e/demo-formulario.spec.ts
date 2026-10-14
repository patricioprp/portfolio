import { expect, test, type Page } from '@playwright/test'

const puntaje = (page: Page) =>
  page.getByRole('complementary', { name: 'Puntaje (vista previa)' })

const grupo = (page: Page, nombre: RegExp) =>
  page.getByRole('group', { name: nombre })

test.describe('demo: formulario dinámico', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demos/formulario-dinamico/')
    // Esperar la hidratación de la isla antes de interactuar.
    await page.locator('astro-island:not([ssr])').waitFor()
  })

  test('muestra los niveles anidados según las respuestas y descuenta puntos', async ({
    page
  }) => {
    await expect(puntaje(page)).toContainText('100')
    const derivacion = page.getByLabel(
      'La solución requirió derivar a otra área'
    )
    await expect(derivacion).toHaveCount(0)

    await grupo(page, /Ofreció una solución/)
      .getByLabel('Sí')
      .check()
    await expect(derivacion).toBeVisible()
    await expect(grupo(page, /número de reclamo/)).toHaveCount(0)

    await derivacion.check()
    await grupo(page, /número de reclamo/)
      .getByLabel('No')
      .check()
    await expect(puntaje(page)).toContainText('85')

    // Al ocultar el nieto, su descuento deja de contar.
    await derivacion.uncheck()
    await expect(puntaje(page)).toContainText('100')
  })

  test('un ítem crítico que falla lleva el puntaje a 0', async ({ page }) => {
    await grupo(page, /Validó la identidad/)
      .getByLabel('No')
      .check()
    await expect(puntaje(page)).toContainText('0')
    await expect(puntaje(page)).toContainText('Ítem crítico fallido')
  })

  test('el editor JSON actualiza la planilla y muestra errores claros', async ({
    page
  }) => {
    const editor = page.getByLabel('JSON de la planilla')
    const original = await editor.inputValue()

    await editor.fill(original.replace('Atención telefónica', 'Chat online'))
    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'Monitoreo de calidad — Chat online'
      })
    ).toBeVisible()

    await editor.fill(
      original.replace('"puntajeTotal": 100', '"puntajeTotal": "cien"')
    )
    await expect(page.getByText(/puntajeTotal: .*número/)).toBeVisible()
    // Se sigue mostrando la última versión válida.
    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'Monitoreo de calidad — Chat online'
      })
    ).toBeVisible()

    await page.getByRole('button', { name: 'Restaurar ejemplo' }).click()
    await expect(page.getByText('JSON válido')).toBeVisible()
  })
})

test('la home y el caso enlazan a la demo de formularios', async ({ page }) => {
  await page.goto('/')
  await expect(
    page.locator('#demos').getByRole('link', { name: 'Formulario dinámico' })
  ).toHaveAttribute('href', '/demos/formulario-dinamico/')

  await page.goto('/casos/formularios-dinamicos/')
  await expect(
    page.getByRole('link', { name: 'Abrir la demo' })
  ).toHaveAttribute('href', '/demos/formulario-dinamico/')
})
