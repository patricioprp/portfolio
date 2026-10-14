import type { Planilla } from './types'

/** Planilla ilustrativa con tres niveles de anidamiento y un ítem crítico. */
export const PLANILLA_EJEMPLO: Record<'es' | 'en', Planilla> = {
  es: {
    titulo: 'Monitoreo de calidad — Atención telefónica',
    empresa: 'Empresa de ejemplo',
    campania: 'Retención de clientes',
    puntajeTotal: 100,
    campos: [
      {
        id: 'saludo',
        etiqueta: '¿Saludó con el speech institucional?',
        tipo: 'si-no',
        peso: 10,
        falla: 'no'
      },
      {
        id: 'identidad',
        etiqueta: '¿Validó la identidad del cliente?',
        tipo: 'si-no',
        critico: true,
        falla: 'no'
      },
      {
        id: 'solucion',
        etiqueta: '¿Ofreció una solución al motivo del llamado?',
        tipo: 'si-no',
        peso: 25,
        falla: 'no',
        mostrarHijosSi: 'si',
        hijos: [
          {
            id: 'derivacion',
            etiqueta: 'La solución requirió derivar a otra área',
            tipo: 'checkbox',
            mostrarHijosSi: true,
            hijos: [
              {
                id: 'numero-reclamo',
                etiqueta: '¿Informó al cliente el número de reclamo?',
                tipo: 'si-no',
                peso: 15,
                falla: 'no'
              }
            ]
          }
        ]
      },
      {
        id: 'tono',
        etiqueta: 'Tono y cordialidad',
        tipo: 'seleccion',
        opciones: [
          { valor: 'excelente', etiqueta: 'Excelente' },
          { valor: 'adecuado', etiqueta: 'Adecuado' },
          { valor: 'mejorable', etiqueta: 'Mejorable' }
        ],
        peso: 10,
        falla: 'mejorable'
      },
      {
        id: 'observaciones',
        etiqueta: 'Observaciones',
        tipo: 'texto'
      }
    ]
  },
  en: {
    titulo: 'Quality review — Phone support',
    empresa: 'Sample company',
    campania: 'Customer retention',
    puntajeTotal: 100,
    campos: [
      {
        id: 'saludo',
        etiqueta: 'Did the agent use the official greeting?',
        tipo: 'si-no',
        peso: 10,
        falla: 'no'
      },
      {
        id: 'identidad',
        etiqueta: "Did the agent verify the customer's identity?",
        tipo: 'si-no',
        critico: true,
        falla: 'no'
      },
      {
        id: 'solucion',
        etiqueta: 'Did the agent offer a solution to the issue?',
        tipo: 'si-no',
        peso: 25,
        falla: 'no',
        mostrarHijosSi: 'si',
        hijos: [
          {
            id: 'derivacion',
            etiqueta: 'The solution required escalating to another team',
            tipo: 'checkbox',
            mostrarHijosSi: true,
            hijos: [
              {
                id: 'numero-reclamo',
                etiqueta: 'Did the agent share the ticket number?',
                tipo: 'si-no',
                peso: 15,
                falla: 'no'
              }
            ]
          }
        ]
      },
      {
        id: 'tono',
        etiqueta: 'Tone and courtesy',
        tipo: 'seleccion',
        opciones: [
          { valor: 'excelente', etiqueta: 'Excellent' },
          { valor: 'adecuado', etiqueta: 'Adequate' },
          { valor: 'mejorable', etiqueta: 'Needs improvement' }
        ],
        peso: 10,
        falla: 'mejorable'
      },
      {
        id: 'observaciones',
        etiqueta: 'Notes',
        tipo: 'texto'
      }
    ]
  }
}
