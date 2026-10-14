import { expect, test } from '@playwright/test'

const casos = [
  {
    slug: 'formularios-dinamicos',
    titulo: 'Formularios que se configuran, no se programan',
    diagramas: 3
  },
  {
    slug: 'acopio-planta',
    titulo: 'Acopio por rotación en una planta de premoldeados',
    diagramas: 1
  },
  {
    slug: 'optimizador-viguetas',
    titulo: 'Menos acero con programación lineal entera',
    diagramas: 1
  }
]

test('las tarjetas de la home enlazan a cada caso', async ({ page }) => {
  await page.goto('/')
  for (const caso of casos) {
    await expect(
      page.locator('#casos').getByRole('link', { name: caso.titulo })
    ).toHaveAttribute('href', `/casos/${caso.slug}/`)
  }
})

test('las métricas ilustrativas no aparecen en la home', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('main')).not.toContainText('37 %')
})

for (const caso of casos) {
  test(`caso ${caso.slug}: estructura, SEO y diagramas accesibles`, async ({
    page
  }) => {
    await page.goto(`/casos/${caso.slug}/`)
    await expect(
      page.getByRole('heading', { level: 1, name: caso.titulo })
    ).toBeVisible()
    await expect(page).toHaveTitle(new RegExp(caso.titulo))
    await expect(
      page.getByRole('heading', { level: 2, name: 'En 30 segundos' })
    ).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      `https://portfolio-patricio-polito.netlify.app/casos/${caso.slug}/`
    )

    const diagramas = page.locator('figure svg[role="img"]')
    await expect(diagramas).toHaveCount(caso.diagramas)
    for (const svg of await diagramas.all()) {
      await expect(svg.locator('title')).not.toBeEmpty()
      await expect(svg.locator('desc')).not.toBeEmpty()
    }
  })
}

test('las métricas ilustrativas solo aparecen junto a la demo, con aclaración', async ({
  page
}) => {
  await page.goto('/casos/optimizador-viguetas/')
  const demo = page.getByRole('complementary', { name: 'Probalo en vivo' })
  await expect(demo).toContainText('~37 %')
  await expect(demo).toContainText('no medido en producción')
})

test('se puede navegar entre casos', async ({ page }) => {
  await page.goto('/casos/formularios-dinamicos/')
  await page.getByRole('link', { name: /Caso siguiente/ }).click()
  await expect(page).toHaveURL(/\/casos\/acopio-planta\/$/)
})
