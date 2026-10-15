---
paths:
  - 'src/islands/**'
---

# Reglas para `src/islands/` (islas React)

- Una isla solo dibuja y maneja eventos: la lógica vive en `src/lib/` y se
  importa. Si escribís un cálculo de negocio acá, movelo a `src/lib/` con test.
- Hidratación: `client:load` en las demos (la isla es el contenido principal
  de la página); `client:only="react"` solo si la isla depende del navegador
  al primer render, como la hora local del simulador de contingencias.
- Los textos llegan por props desde la página (diccionarios de `src/i18n/`);
  la isla no decide el idioma por su cuenta.
- Accesibilidad: controles nativos (`button`, `input`, `label`), foco visible,
  `aria-live="polite"` para resultados que cambian, navegación por teclado en
  todo lo que se pueda arrastrar o hacer clic. Respetar `prefers-reduced-motion`.
- Colores: solo tokens del tema (`bg-surface`, `text-fg`, `text-muted`,
  `border-line`, `text-accent`… definidos en `src/styles/global.css`); nada de
  colores fijos que se rompan en modo claro.
- Presupuesto: la home no carga React. No importes islas desde la home.
