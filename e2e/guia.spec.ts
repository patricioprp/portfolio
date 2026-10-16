import { expect, test } from '@playwright/test'

// Guía "Hacé tu portfolio con IA — Claude Code" (spec 006).

test.describe('acceso a la guía', () => {
  test('el menú lleva a la guía en español y en inglés', async ({
    page,
    isMobile
  }) => {
    for (const [inicio, nombre] of [
      ['/', 'Guía IA'],
      ['/en/', 'AI guide (ES)']
    ] as const) {
      await page.goto(inicio)
      if (isMobile) {
        await page.getByRole('button', { name: /menú|menu/i }).click()
      }
      await page
        .getByRole('navigation', { name: /principal|main/i })
        .filter({ visible: true })
        .getByRole('link', { name: nombre })
        .click()
      await expect(page).toHaveURL(/\/guia\/$/)
      await expect(
        page.getByRole('heading', {
          level: 1,
          name: 'Hacé tu portfolio con IA — Claude Code'
        })
      ).toBeVisible()
    }
  })

  test('el bloque de la home lleva al índice y al paso a paso', async ({
    page
  }) => {
    await page.goto('/')
    const bloque = page.locator('#guia')
    await expect(
      bloque.getByRole('heading', { name: /Hacé tu portfolio con IA/ })
    ).toBeVisible()
    await bloque.getByRole('link', { name: 'Ir al paso a paso' }).click()
    await expect(page).toHaveURL(/\/guia\/preparar-el-entorno\/$/)
  })

  test('en inglés, el bloque aclara que la guía está en español', async ({
    page
  }) => {
    await page.goto('/en/')
    const bloque = page.locator('#guia')
    await expect(bloque).toContainText('written in Spanish')
    await expect(
      bloque.getByRole('link', { name: 'Start the guide' })
    ).toHaveAttribute('hreflang', 'es')
  })
})

test.describe('páginas de la guía', () => {
  test('el índice muestra las tres partes y los capítulos en orden', async ({
    page
  }) => {
    await page.goto('/guia/')
    for (const parte of [
      'Parte 1 · Fundamentos',
      'Parte 2 · Paso a paso',
      'Parte 3 · Referencia'
    ]) {
      await expect(
        page.getByRole('heading', { level: 2, name: parte })
      ).toBeVisible()
    }
    // Los números de capítulo, en el orden en que aparecen: 1, 2, …, n.
    const numeros = await page
      .locator('section[id] ol > li > span[aria-hidden="true"]')
      .allTextContents()
    expect(numeros.length).toBeGreaterThan(10)
    expect(numeros.map(Number)).toEqual(numeros.map((_, i) => i + 1))
    const capitulos = page.locator('section[id] ol > li')
    await expect(capitulos.first()).toContainText(
      'De chatear a trabajar con un agente'
    )
    await expect(capitulos.last()).toContainText('Glosario')
  })

  test('un capítulo muestra sus diagramas con texto alternativo y navega al siguiente', async ({
    page
  }) => {
    await page.goto('/guia/permisos-y-hooks/')
    await expect(page).toHaveTitle(/Permisos y hooks/)
    const imagenes = page.locator('figure.diagrama img')
    await expect(imagenes.first()).toHaveAttribute('alt', /\S/)
    // Se ve una sola versión del diagrama: la del tema actual.
    await expect(page.locator('figure.diagrama img:visible')).toHaveCount(
      await page.locator('figure.diagrama').count()
    )
    // Los enlaces de navegación escritos para GitHub no aparecen en el sitio.
    await expect(page.getByText('Anterior: 3 ·')).toHaveCount(0)

    await page
      .getByRole('navigation', { name: 'Capítulos' })
      .getByRole('link', { name: /Siguiente/ })
      .click()
    await expect(page).toHaveURL(/\/guia\/skills-y-subagentes\/$/)
  })

  test('los enlaces a archivos del repo van a GitHub', async ({ page }) => {
    await page.goto('/guia/contexto-persistente/')
    await expect(
      page
        .locator('.guia-contenido a[href*="github.com/patricioprp/portfolio"]')
        .first()
    ).toBeAttached()
    await expect(
      page.locator('.guia-contenido a[href$=".md"]:not([href^="http"])')
    ).toHaveCount(0)
  })

  test('las páginas de la guía no declaran versión en inglés', async ({
    page
  }) => {
    await page.goto('/guia/')
    await expect(
      page.locator('link[rel="alternate"][hreflang="en"]')
    ).toHaveCount(0)
  })
})
