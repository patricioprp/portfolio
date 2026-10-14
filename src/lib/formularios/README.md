# Formularios dinámicos

Reimplementación en TypeScript, para el portfolio, del enfoque que usé al migrar
una plataforma de monitoreo de calidad de Laravel a React + Node: **el servidor
no dibuja el formulario, lo describe en JSON, y el cliente lo interpreta**.

Demo: `/demos/formulario-dinamico/` · Caso: `/casos/formularios-dinamicos/`

## Módulos

| Archivo          | Responsabilidad                                                                     |
| ---------------- | ----------------------------------------------------------------------------------- |
| `types.ts`       | Esquema zod recursivo de la planilla (`Campo` con `hijos`) y tipos inferidos        |
| `visibilidad.ts` | `cumpleCondicion` y `camposVisibles`: qué campos se ven según las respuestas        |
| `puntaje.ts`     | Vista previa del puntaje: descuentos, ítems críticos, campos ocultos                |
| `validacion.ts`  | JSON → esquema zod → reglas de negocio (ids únicos, `falla`, opciones, profundidad) |
| `ejemplo.ts`     | Planilla ilustrativa (ES/EN) con tres niveles y un ítem crítico                     |

La UI está en `src/islands/formulario/`:

- `registro.tsx`: el **registro de componentes**, un componente por tipo de
  campo (`si-no`, `seleccion`, `checkbox`, `texto`).
- `Campo.tsx`: el **componente recursivo**. Dibuja el campo con el componente de
  su tipo y, si la respuesta cumple la condición, se llama a sí mismo con los
  hijos.
- `FormularioDinamico.tsx`: la isla con el formulario, el panel de puntaje y el
  editor JSON.

## Formato de un campo

```json
{
  "id": "solucion",
  "etiqueta": "¿Ofreció una solución?",
  "tipo": "si-no",
  "peso": 25,
  "falla": "no",
  "mostrarHijosSi": "si",
  "hijos": []
}
```

- `peso`: puntos que descuenta si la respuesta es igual a `falla`.
- `critico`: si la respuesta es igual a `falla`, la evaluación vale 0.
- `mostrarHijosSi`: los `hijos` se muestran cuando la respuesta es este valor.

## Reglas de puntaje

- Puntaje = total − descuentos de los ítems comunes que fallan (mínimo 0).
- Si falla un ítem crítico, el puntaje es 0.
- Los campos ocultos no cuentan, aunque tengan respuesta.
- En el sistema real el puntaje oficial lo calculaba el backend; acá es una
  vista previa.

## Tests

```bash
npx vitest run src/lib/formularios
```
