---
name: verificar
description: Ejecuta las verificaciones del portfolio (formato, lint, tipos, tests, build) y reporta el resultado. Usar antes de dar por terminada cualquier tarea o fase del roadmap.
allowed-tools: Bash(npm run format) Bash(npm run lint) Bash(npm run check) Bash(npm test) Bash(npm run build) Bash(npm run diagramas) Bash(npm run e2e) Bash(npm run preview) Bash(git grep *) mcp__playwright__browser_navigate mcp__playwright__browser_snapshot mcp__playwright__browser_take_screenshot mcp__playwright__browser_resize
---

# Verificar

Ejecutá en este orden y frená en el primer error que no puedas corregir:

1. `npm run format` (aplica Prettier; revisá el diff resultante)
2. `npm run lint`
3. `npm run check` (astro check: tipos y archivos .astro)
4. `npm test`
5. `npm run build` (si cambió un diagrama de `docs/guia-ia/`, antes `npm run diagramas`)
6. Si la tarea tocó páginas, navegación, el formulario o las demos: `npm run e2e`
7. Opcional, si cambió el aspecto de una página y el servidor MCP `playwright`
   está aprobado: con `npm run preview` corriendo, abrí la página con
   `browser_navigate`, probá el ancho de celular y de escritorio con
   `browser_resize`, y revisá `browser_snapshot` o una captura. Informá lo
   que se vea roto. No reemplaza a los e2e, que son los que fallan en CI.

Si un paso falla:

- Corregí la causa raíz; no desactives reglas, no uses `any`, no saltees tests.
- Volvé a correr desde el paso que falló.

Al final, informá en una tabla breve: paso, resultado (OK / falló / omitido y
por qué) y, si aplica, el tamaño del JS de la home del output del build.

Comprobaciones de contenido (siempre que la tarea haya cambiado texto):

- Ningún dato de la sección "Datos que nunca se publican" de `CLAUDE.md` en
  `src/`, `public/`, `dist/` ni en ningún archivo versionado. Los términos a
  buscar están en `docs/privado/terminos-sensibles.txt` (uno por línea; el
  archivo está en `.gitignore`). Usá
  `git grep -nIiF --untracked -f docs/privado/terminos-sensibles.txt -- . ':!docs/privado'`
  (sin salida = OK).
  **Nunca copies esos términos a un archivo versionado** (el repositorio es público).
  Si el archivo no existe, avisale a Patricio en lugar de inventar la lista.
- Ninguna métrica ilustrativa (ej. "~37 %") fuera de la página de su caso y de su demo.
