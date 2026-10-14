# Caso: Formularios que se configuran, no se programan

- **Autor:** Patricio Rolando Polito, Senior Developer Full Stack
- **Slug:** `formularios-dinamicos`
- **Empresa y período:** Sertic, primer año (2021 – 2022)
- **Dominio:** plataforma de monitoreo de calidad para un call center de nivel internacional (cliente anónimo)
- **Stack:** Laravel → React + Node.js, SQL Server (stored procedures), file server
- **Demo asociada:** `/demos/formulario-dinamico`

## En 30 segundos

| El problema                                                                                                                                   | Lo que hice                                                                                                                                    | El impacto                                                                                                                                             |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Decenas de empresas, cada una con planillas de calidad que cambiaban todo el tiempo. Cada cambio implicaba programar, testear y hacer deploy. | Heredé la plataforma en Laravel, la evolucioné, optimicé sus reportes y la migré a React y Node, construyendo los nuevos proyectos desde cero. | Crear o modificar una planilla pasó a ser configuración, sin deploys. Reportes rápidos sobre grandes volúmenes y stack unificado con el de la empresa. |

## Contexto

La empresa daba servicio a un call center que atendía a muchas empresas. Los
supervisores evaluaban a los agentes con planillas de monitoreo de calidad
desde una aplicación web responsive. Cada empresa tenía una o más planillas, y
lo que se quería evaluar cambiaba con frecuencia.

Además del formulario, la plataforma gestionaba todo el ciclo de la evaluación:

1. El **supervisor** evalúa al agente → monitoreo guardado (estado _Enviada_).
2. El **agente** recibe una notificación y lee el monitoreo.
3. Lo **acepta** (_Aceptada_) o **pide rectificación** → el supervisor revisa → _Revisada_.

Reglas: solo quien cargó el monitoreo puede editarlo; ningún monitoreo se
elimina (trazabilidad completa); las evidencias (audios e imágenes) se guardan
en un file server.

Diagrama 1: ciclo del monitoreo (supervisor → enviada → agente → aceptada | rectificación → revisada).

## El reto técnico: formularios dinámicos

Para no tocar código con cada cambio, los formularios no estaban programados:
se leían de la base de datos. Cada campo era un registro parametrizable que
podía tener hijos, hasta tres niveles. Por ejemplo, un desplegable Sí/No que,
al responder "Sí", mostraba un checkbox, que a su vez podía desplegar otro
campo. Cada respuesta impactaba en el puntaje: los ítems comunes descontaban
del total y los **ítems críticos llevaban toda la evaluación a cero**.

Diagrama 2: planilla (empresa · campaña) → campo padre (nivel 1, desplegable Sí/No) → campo hijo (nivel 2, checkbox visible si "Sí") → campo nieto (nivel 3, visible si se marca); al costado, ítem crítico (si falla, puntaje = 0) y cálculo (total − descuentos).

## Lo que hice, en tres etapas

1. **Heredé y mejoré la plataforma en Laravel.** Agregué un tercer nivel de
   anidamiento entre campos, la carga de audios e imágenes como evidencia, los
   perfiles y la seguridad: solo el autor edita un monitoreo y ninguno se elimina.
2. **Optimicé el manejo de datos.** Los reportes filtraban por fecha, campaña,
   empresa, planilla, supervisor, evaluado y estado, y se exportaban a Excel.
   Con ese volumen, escribí y optimicé stored procedures que la aplicación
   consumía directamente para que los reportes cargaran rápido.
3. **Migré a React y Node, construyendo los proyectos desde cero.** La empresa
   quería unificar sus plataformas web en ese stack, así que inicié los nuevos
   proyectos de frontend y backend.

## La migración: el desafío más interesante

En Laravel, el servidor armaba el HTML de cada formulario inyectando los campos
en las vistas Blade. React no funciona así. La solución fue cambiar el enfoque:
**el servidor ya no dibuja el formulario, lo describe, y el cliente lo interpreta.**

- **Antes:** base de datos (campos y SP) → Laravel + Blade inyecta el HTML → el navegador recibe HTML listo.
- **Después:** base de datos (campos y SP) → API Node devuelve JSON → React renderiza de forma recursiva. Evidencias en el file server.

Diagrama 3: antes y después de la migración.

Cómo funciona:

- La API en Node lee los campos y devuelve la planilla como un **árbol JSON**:
  cada campo con su tipo, opciones, condición de visibilidad, peso y si es crítico.
- En React, un **registro de componentes** asocia cada tipo de campo con su
  componente visual: el reemplazo directo de lo que hacía Blade.
- Un **componente recursivo** dibuja cada campo y, si la respuesta cumple la
  condición, se llama a sí mismo con los hijos. Dibuja cualquier planilla sin
  cambiar una línea de código.
- El **puntaje oficial se calcula en el backend** (fuente de verdad); el frontend
  muestra una vista previa.

```jsx
const componentes = {
  select: SelectField,
  checkbox: CheckboxField,
  text: TextField
}

function Campo({ campo, respuestas, onChange }) {
  const Componente = componentes[campo.tipo]
  const valor = respuestas[campo.id]
  const mostrarHijos = campo.hijos?.length && cumpleCondicion(campo, valor)
  return (
    <div>
      <Componente campo={campo} valor={valor} onChange={onChange} />
      {mostrarHijos &&
        campo.hijos.map((hijo) => (
          <Campo
            key={hijo.id}
            campo={hijo}
            respuestas={respuestas}
            onChange={onChange}
          />
        ))}
    </div>
  )
}
```

## Resultados

Todos son resultados **reales** y cualitativos (no hay cifras medidas):

- **Sin deploys:** crear o modificar una planilla pasó a ser configuración.
- **Trazabilidad:** monitoreos que terceros no pueden alterar, con evidencias y ciclo de rectificación.
- **Rendimiento:** reportes rápidos sobre grandes volúmenes gracias a los stored procedures.
- **Stack unificado:** la plataforma quedó alineada con React y Node, como el resto de la empresa.

## Próximo paso que propondría

Versionado de planillas: guardar con cada monitoreo la versión del formulario
con la que se evaluó, para que los cambios futuros no afecten a las
evaluaciones históricas.
