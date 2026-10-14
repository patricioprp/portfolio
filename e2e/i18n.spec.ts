import { expect, test } from '@playwright/test'

test('la home en inglés usa el idioma, los textos y la imagen OG correctos', async ({
  page
}) => {
  await page.goto('/en/')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
  await expect(page).toHaveTitle(/Senior Frontend Developer/)
  await expect(
    page.getByText('I turn operational processes into software')
  ).toBeVisible()
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    /\/og\/en\/inicio\.png$/
  )
  // La experiencia se muestra con fechas en inglés.
  await expect(page.locator('#experiencia ol > li').first()).toContainText(
    'present'
  )
})

test('cada página declara su alternativa en el otro idioma', async ({
  page
}) => {
  await page.goto('/casos/acopio-planta/')
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute(
    'href',
    'https://portfolio-patricio-polito.netlify.app/en/case-studies/acopio-planta/'
  )
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute(
    'href',
    'https://portfolio-patricio-polito.netlify.app/casos/acopio-planta/'
  )
})

test('el selector de idioma lleva a la misma página en el otro idioma', async ({
  page
}) => {
  await page.goto('/demos/optimizador-viguetas/')
  await page.getByRole('link', { name: /EN.*English/ }).click()
  await expect(page).toHaveURL(/\/en\/demos\/optimizador-viguetas\/$/)
  await expect(
    page.getByRole('heading', { level: 1, name: 'Joist cutting optimizer' })
  ).toBeVisible()

  await page.getByRole('link', { name: /ES.*español/ }).click()
  await expect(page).toHaveURL(/\/demos\/optimizador-viguetas\/$/)
})

test('los casos en inglés enlazan entre sí y a su demo', async ({ page }) => {
  await page.goto('/en/')
  await page
    .locator('#casos')
    .getByRole('link', { name: 'Less steel with integer linear programming' })
    .click()
  await expect(page).toHaveURL(/\/en\/case-studies\/optimizador-viguetas\/$/)
  await expect(
    page.getByRole('link', { name: 'Open the demo' })
  ).toHaveAttribute('href', '/en/demos/optimizador-viguetas/')
})

test('la demo en inglés resuelve el ejemplo', async ({ page }) => {
  await page.goto('/en/demos/optimizador-viguetas/')
  await page.locator('astro-island:not([ssr])').waitFor()
  await page.getByRole('button', { name: 'Optimize' }).click()
  await expect(
    page.getByRole('heading', { level: 2, name: 'Optimal plan' })
  ).toBeVisible({ timeout: 30_000 })
  await expect(page.locator('dl').first()).toContainText('103.5')
})

test('el formulario de contacto en inglés vuelve a la página de gracias en inglés', async ({
  page
}) => {
  await page.goto('/en/')
  await expect(
    page.getByRole('form', { name: 'Contact form' })
  ).toHaveAttribute('action', '/en/thanks/')
})
