# 002 · Demo: Formulario dinámico

- **Estado:** Implementada
- **Roadmap:** Fase 5
- **Relacionado:** caso `docs/casos/formularios-dinamicos.md`,
  `src/lib/formularios/README.md`

## Problema

El caso de formularios dinámicos afirma que el negocio crea y cambia
planillas "sin deploys". La demo lo muestra: el formulario sale de un JSON
que el visitante puede editar.

## Objetivo

El visitante responde una planilla de ejemplo, ve aparecer los niveles
anidados y el puntaje en vivo, y edita el JSON para ver el resultado sin
recargar.

## Alcance

- Esquema zod recursivo (`Campo` con `hijos`) y validación con reglas de negocio.
- Registro de componentes por `tipo` y componente `Campo` recursivo.
- Panel de puntaje en vivo (barra fija en mobile).
- Editor JSON validado con mensajes localizados; conserva la última versión válida.
- Planilla de ejemplo ES/EN con 3 niveles y un ítem crítico.

### Fuera de alcance

- Versionado de planillas (en "Ideas para después").
- Persistencia: el puntaje es una vista previa; en el sistema real lo
  calculaba el backend.

## Diseño

- **Lógica:** `src/lib/formularios/` (`types`, `visibilidad`, `puntaje`,
  `validacion`, `ejemplo`).
- **UI:** `src/islands/formulario/` (`registro.tsx`, `Campo.tsx`,
  `FormularioDinamico.tsx`).

## Criterios de aceptación

| #   | Criterio                                                                                                           | Test                                      |
| --- | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- |
| 1   | Sin respuestas solo se ven los campos de nivel 1                                                                   | `src/lib/formularios/formularios.test.ts` |
| 2   | Cada nivel se muestra solo si se cumple la condición del padre                                                     | `src/lib/formularios/formularios.test.ts` |
| 3   | Sin fallas el puntaje vale el total; cada ítem común que falla descuenta su peso                                   | `src/lib/formularios/formularios.test.ts` |
| 4   | Un ítem crítico que falla lleva el puntaje a 0                                                                     | unitario + `e2e/demo-formulario.spec.ts`  |
| 5   | Los campos ocultos no puntúan y el puntaje nunca baja de 0                                                         | `src/lib/formularios/formularios.test.ts` |
| 6   | JSON mal formado, errores de esquema, ids repetidos y opciones inválidas se informan con ruta y mensaje localizado | `src/lib/formularios/formularios.test.ts` |
| 7   | El editor JSON actualiza la planilla y muestra errores claros                                                      | `e2e/demo-formulario.spec.ts`             |
| 8   | Con niveles abiertos y un error JSON, la página pasa axe en ambos temas                                            | `e2e/accesibilidad.spec.ts`               |
