---
paths:
  - 'e2e/**'
  - 'playwright.config.ts'
---

# Reglas para los tests e2e (Playwright)

- Cada demo tiene su `e2e/demo-<slug>.spec.ts` y cada página nueva entra en la
  lista de rutas de `e2e/accesibilidad.spec.ts` (axe, WCAG 2.2 AA, tema claro
  y oscuro).
- Selectores por rol y nombre accesible (`getByRole`, `getByLabel`), no por
  clases de Tailwind ni por `data-testid` salvo que no haya alternativa.
- Los tests corren en dos proyectos (desktop y mobile Pixel 7). Si un flujo es
  distinto en mobile (pestañas, barra fija), cubrí los dos.
- Nada de `waitForTimeout`: esperá un estado visible (`toBeVisible`,
  `toHaveText`).
- Para la hora en el simulador de contingencias se usa el reloj simulado de
  la propia demo, no el del sistema.
