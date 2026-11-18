# 0008 · Servidor MCP de Playwright y Claude en CI a pedido

- **Estado:** Aceptado
- **Fecha:** 2026-11

## Contexto

Hasta la Fase 10, Claude Code trabajaba solo con sus herramientas
integradas, y el CI solo corría verificaciones deterministas (formato, lint,
tipos, tests, build y e2e). Quedaban dos huecos:

- **Ver la página.** Los e2e comprueban comportamiento y accesibilidad, pero
  no si algo "se ve roto". Claude no tenía cómo mirar el sitio en un
  navegador.
- **Pedir ayuda en GitHub.** Para que Claude revise una PR o conteste una
  pregunta, había que abrir una sesión local.

Las dos cosas tienen soporte oficial: servidores MCP
([documentación](https://code.claude.com/docs/en/mcp)) y la acción de GitHub
`anthropics/claude-code-action`
([documentación](https://code.claude.com/docs/en/github-actions)).

## Decisión

1. **`.mcp.json` con el servidor de Playwright** (`@playwright/mcp`), con
   alcance de proyecto y versionado.
   - Quien clona el repo lo aprueba la primera vez que abre `claude`: no se
     auto-aprueba en settings.
   - Las herramientas de navegación y captura se permiten.
   - Las que ejecutan código (`browser_evaluate` y
     `browser_run_code_unsafe`) quedan en `ask`.
2. **`.github/workflows/claude.yml`, solo a pedido.**
   - Un comentario con `@claude` en un issue o una PR, o la etiqueta
     `revision-claude` en una PR (revisión con los subagentes del repo,
     `revisor-codigo` y `revisor-contenido`, en lugar del plugin genérico
     `code-review`: así la PR se revisa con los mismos criterios que en una
     sesión local, incluida la privacidad del contenido).
   - Tiene `--max-turns` (15 para `@claude`, 30 para la revisión),
     `timeout-minutes: 20` y concurrencia por issue/PR.

## Alternativas consideradas

- **Solo Playwright en los tests (sin MCP):** ya existe y sigue siendo la red
  de seguridad, porque falla en CI. Pero no le da a Claude una forma de
  explorar y mirar una página mientras trabaja. El MCP la complementa; no la
  reemplaza.
- **Revisar todas las PR automáticamente** (en cada `opened`/`synchronize`,
  o con Code Review administrado): gasta tokens en cada push, incluidas las
  PR triviales. En un repo de una persona, pedirlo con una etiqueta es
  suficiente.
- **`claude -p` en un paso propio del CI:** da control total, pero hay que
  armar a mano el comentario en la PR, la autenticación y los permisos, que
  la acción oficial ya resuelve.

## Consecuencias

- **Seguridad:**
  - Solo el dueño del repo lo dispara (`author_association == 'OWNER'` en
    los comentarios, `sender.login == repository_owner` en la etiqueta),
    además del control de permiso de escritura que ya hace la acción.
  - Nunca corre sobre PR de forks. Los eventos de comentarios
    (`issue_comment`) corren con los secretos del repo aunque la PR venga
    de un fork, así que el workflow lo comprueba (`head.repo` o
    `gh pr view --json isCrossRepository`) antes de usar la clave.
  - El `GITHUB_TOKEN` solo lee. Claude publica con el token de la app
    "Claude", que tiene sus propios permisos: **`main` tiene que estar
    protegida** en GitHub para que nada llegue sin una PR revisada.
  - El secreto `ANTHROPIC_API_KEY` vive solo en GitHub.
- **Costo:** cada `@claude` o cada etiqueta consume tokens y minutos de
  Actions. Sin pedido no hay gasto.
- **Pasos manuales:** instalar la app "Claude" de GitHub y cargar el
  secreto. `/install-github-app` hace las dos cosas.
- **`@playwright/mcp` con versión fija** (0.0.85) en `.mcp.json`: evita que
  una versión nueva cambie los nombres de las herramientas que usan los
  permisos. Se actualiza a mano, revisando esos nombres.
- La guía lo explica en los capítulos 6 (MCP) y 16 (Claude Code en CI).
