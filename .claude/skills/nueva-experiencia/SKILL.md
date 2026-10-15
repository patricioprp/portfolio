---
name: nueva-experiencia
description: Agrega o actualiza una experiencia laboral (empleo, freelance, proyecto o formación) en el portfolio entrevistando a Patricio, y propaga el cambio a la fuente de verdad, la línea de tiempo ES/EN, el stack, el CV en PDF y los tests. Usar cuando Patricio quiera sumar un trabajo nuevo, cerrar el actual, cambiar de puesto o agregar logros.
argument-hint: '[empresa o descripción libre, opcional]'
---

# Nueva experiencia

Entrada: `$ARGUMENTS`. Puede ser:

- vacía → arrancá la entrevista del paso 1;
- una descripción libre → usala y preguntá solo lo que falte;
- la ruta de un borrador hecho con `docs/contenido/_plantilla-experiencia.md`
  → leelo, preguntá lo que quedó vacío y, al terminar, ofrecé borrarlo.

El contrato de datos y los criterios de aceptación están en
`docs/specs/005-experiencia.md`.

El objetivo es que Patricio solo cuente lo que hizo; Claude se ocupa del
formato, las traducciones y el código. **No inventes nada**: lo que no diga
Patricio no existe.

## 1. Entrevista

Si `$ARGUMENTS` trae datos, usalos y preguntá solo lo que falte. Hacé las
preguntas **en una sola tanda** (no de a una), con ejemplos de respuesta:

1. **Tipo:** ¿empleo nuevo, cambio de puesto en la misma empresa, cierre del
   trabajo actual, freelance o logros nuevos en una experiencia existente?
2. **Empresa** y **ubicación / modalidad** (ej. "Córdoba · Remoto"). ¿Se puede
   nombrar? Si es una consultora, el **cliente** va siempre anónimo
   ("fintech regional", "retail de alcance nacional").
3. **Rol** tal como figura en el contrato o en LinkedIn.
4. **Período:** desde (AAAA-MM) y hasta (AAAA-MM o "actualidad").
5. **Logros:** 2 a 5. Para cada uno pedí _qué problema había_, _qué hiciste vos_
   (o el equipo, y cuál fue tu parte) y _qué cambió_ (cifra si existe y si es
   real o estimada).
6. **Stack** usado de verdad en ese trabajo.
7. **Confidencialidad:** ¿hay nombres de sistemas, clientes o datos internos
   que no se pueden publicar? Anotalos en `docs/privado/terminos-sensibles.txt`
   (fuera de git), nunca en un archivo versionado.
8. **¿Merece un caso de estudio?** Si hay un problema con impacto medible, sí.

Cuando respondan, mostrá un **borrador** (ES y EN) de la entrada para la
línea de tiempo y pedí confirmación antes de tocar archivos.

## 2. Fuente de verdad

Actualizá `docs/contenido/experiencia.md` (orden cronológico inverso, mismo
formato que las entradas existentes: Rol, Período, Logros, Stack y, si
aplica, Confidencialidad y → Caso). Es lo primero que se escribe: el resto
sale de acá.

## 3. Código

| Qué                                     | Dónde                                                                                                                                                             |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Entrada de la línea de tiempo (ES + EN) | `src/content/experiencia.json` (esquema zod en `src/content.config.ts`; fechas `AAAA-MM`)                                                                         |
| Al cerrar el trabajo actual             | poner `hasta` en la entrada anterior; solo una puede tener `hasta: null`                                                                                          |
| Tecnologías nuevas                      | `stack.grupos` en `src/i18n/es.ts` y `src/i18n/en.ts`, en el grupo que corresponda                                                                                |
| Puesto actual nuevo                     | `hero`, `meta.tituloPersona` y textos que mencionen el rol en `src/i18n/{es,en}.ts`; test `la experiencia muestra el puesto actual primero` en `e2e/home.spec.ts` |
| Años de experiencia                     | revisar "+10 años" en `src/i18n/{es,en}.ts` solo si Patricio confirma un número nuevo                                                                             |
| Caso de estudio                         | `/nuevo-caso <slug>` y luego `caso: "<slug>"` en la entrada de experiencia                                                                                        |

Reglas de redacción: primera persona, verbos de acción, una oración por
logro, sin adjetivos vacíos. La versión en inglés es una traducción natural,
no literal. El `id` de la entrada es el nombre de la empresa en kebab-case.

## 4. Derivados y verificación

1. `npm run cv` → regenera `public/cv/CV_Patricio_Polito_{ES,EN}.pdf`.
2. `npm run og` si cambió el hero o el título.
3. `/verificar` (incluye e2e, porque cambia la home).
4. Agente `revisor-contenido` sobre `src/content/experiencia.json`,
   `src/i18n/` y `docs/contenido/experiencia.md`.
5. Mostrá un resumen de lo cambiado y proponé el commit con `/commit`
   (tipo `feat` si es experiencia nueva, `docs` si solo cambió la fuente).
