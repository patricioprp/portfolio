import { expect, test } from '@playwright/test'

test.describe('home', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('muestra el hero con la propuesta de valor y los CTAs', async ({
    page
  }) => {
    await expect(page).toHaveTitle(/Patricio Rolando Polito/)
    await expect(
      page.getByRole('heading', { level: 1, name: 'Patricio Rolando Polito' })
    ).toBeVisible()
    await expect(
      page.getByText('Convierto procesos operativos en software')
    ).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Ver casos de estudio' })
    ).toBeVisible()
  })

  test('tiene todas las secciones con su título', async ({ page }) => {
    for (const titulo of [
      'Problemas reales, resultados concretos',
      'Probalo en el navegador',
      'Experiencia',
      'Stack',
      'Formación académica',
      'Hablemos'
    ]) {
      await expect(
        page.getByRole('heading', { level: 2, name: titulo })
      ).toBeAttached()
    }
  })

  test('la experiencia muestra el puesto actual primero', async ({ page }) => {
    const primero = page.locator('#experiencia ol > li').first()
    await expect(primero).toContainText('Frontend Senior')
    await expect(primero).toContainText('actualidad')
  })

  test('incluye SEO básico y JSON-LD de Person', async ({ page }) => {
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /Frontend Senior/
    )
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /\/og\/default\.png$/
    )
    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .textContent()
    expect(JSON.parse(jsonLd ?? '{}')).toMatchObject({ '@type': 'Person' })
  })

  test('el formulario de contacto está preparado para Netlify', async ({
    page
  }) => {
    const form = page.getByRole('form', { name: 'Formulario de contacto' })
    await expect(form).toHaveAttribute('data-netlify', 'true')
    await expect(form).toHaveAttribute('netlify-honeypot', 'bot-field')
    await expect(form.getByLabel('Nombre')).toHaveAttribute('required', '')
    await expect(form.getByLabel('Email', { exact: true })).toHaveAttribute(
      'type',
      'email'
    )
  })

  test('el botón de WhatsApp abre un chat con el número publicado', async ({
    page
  }) => {
    await expect(
      page.getByRole('link', { name: 'Escribime por WhatsApp' })
    ).toHaveAttribute('href', /^https:\/\/wa\.me\/5493814986358\?text=/)
  })

  test('el cambio de tema se aplica y persiste', async ({ page }) => {
    const html = page.locator('html')
    const inicial = await html.getAttribute('data-theme')
    const opuesto = inicial === 'dark' ? 'light' : 'dark'

    await page.locator('#tema-boton').click()
    await expect(html).toHaveAttribute('data-theme', opuesto)

    await page.reload()
    await expect(html).toHaveAttribute('data-theme', opuesto)
  })
})

test.describe('menú móvil', () => {
  test.skip(({ isMobile }) => !isMobile, 'solo en mobile')

  test('abre, navega y cierra con Escape', async ({ page }) => {
    await page.goto('/')
    const boton = page.getByRole('button', { name: 'Abrir menú' })
    const menu = page.locator('#menu-movil')

    await expect(menu).toBeHidden()
    await boton.click()
    await expect(menu).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Cerrar menú' })
    ).toHaveAttribute('aria-expanded', 'true')

    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
    await expect(boton).toBeFocused()

    await boton.click()
    await menu.getByRole('link', { name: 'Contacto' }).click()
    await expect(menu).toBeHidden()
    await expect(page).toHaveURL(/#contacto$/)
  })
})

test('la página de gracias no se indexa', async ({ page }) => {
  await page.goto('/gracias/')
  await expect(
    page.getByRole('heading', { level: 1, name: '¡Gracias por escribirme!' })
  ).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex'
  )
})
