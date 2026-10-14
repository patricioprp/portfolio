import type { Diccionario } from './index'

export const en: Diccionario = {
  meta: {
    titulo: 'Patricio Rolando Polito | Senior Frontend Developer',
    descripcion:
      'Senior Frontend Developer and Systems Engineer with 10+ years of experience in React, Node and Laravel. Case studies with measurable impact and live demos.',
    tituloPersona: 'Senior Frontend Developer'
  },
  nav: {
    saltar: 'Skip to content',
    principal: 'Main navigation',
    inicio: 'Home',
    casos: 'Case studies',
    demos: 'Demos',
    experiencia: 'Experience',
    stack: 'Stack',
    contacto: 'Contact',
    abrirMenu: 'Open menu',
    cerrarMenu: 'Close menu',
    temaClaro: 'Switch to light mode',
    temaOscuro: 'Switch to dark mode'
  },
  hero: {
    disponible: 'Open to new opportunities',
    nombre: 'Patricio Rolando Polito',
    rol: 'Senior Frontend Developer · Systems Engineer',
    propuesta:
      'I turn operational processes into software that saves time and money.',
    bajada:
      '10+ years with React, Node and Laravel: from migrating legacy systems to mathematically optimizing production.',
    verCasos: 'See case studies',
    descargarCv: 'Download CV',
    contactar: 'Get in touch'
  },
  impacto: {
    titulo: 'Impact in numbers',
    items: [
      { valor: '10+ years', etiqueta: 'building production software' },
      {
        valor: '3 days → 0',
        etiqueta: 'truck waiting time at an industrial plant'
      },
      {
        valor: '0 deploys',
        etiqueta: 'to create or change a quality form'
      }
    ]
  },
  casos: {
    eyebrow: 'Case studies',
    titulo: 'Real problems, concrete results',
    bajada:
      'Three projects told as problem, solution and impact, with the technical decisions behind them.',
    problema: 'Problem',
    solucion: 'Solution',
    impacto: 'Impact',
    leerCaso: 'Read the full case study'
  },
  caso: {
    volver: 'All case studies',
    enTreinta: 'In 30 seconds',
    cliente: 'Client',
    rol: 'Role',
    periodo: 'Period',
    stack: 'Stack',
    metricas: 'Key results',
    demoTitulo: 'Try it live',
    demoTexto:
      "I'm building an open-source reimplementation of this case, with sample data, that you'll be able to run in your browser.",
    demoProximamente: 'The demo will be available soon.',
    demoDisponible:
      'There is an open-source reimplementation of this case, with sample data, that you can use in your browser.',
    demoAbrir: 'Open the demo',
    ilustrativa:
      'Illustrative example from the demo, not measured in production.',
    ctaTitulo: 'Could your team use this kind of experience?',
    ctaTexto:
      "I'm looking for a long-term Senior Frontend or Full Stack role. Let's talk.",
    ctaBoton: 'Get in touch',
    anterior: 'Previous case',
    siguiente: 'Next case'
  },
  demos: {
    eyebrow: 'Live demos',
    titulo: 'Try it in your browser',
    bajada:
      'Open-source reimplementations of two of the case studies, with sample data and the code on GitHub.',
    proximamente: 'Coming soon',
    probar: 'Try the demo',
    items: [
      {
        slug: 'optimizador-viguetas',
        titulo: 'Joist cutting optimizer',
        descripcion:
          'Enter the demand and get the production plan that minimizes steel, compared with filling beds in order of arrival.',
        stack: ['TypeScript', 'React', 'Web Worker', 'HiGHS (WebAssembly)']
      },
      {
        slug: 'formulario-dinamico',
        titulo: 'Dynamic form',
        descripcion:
          'Edit the JSON of a form with fields nested three levels deep and watch the form and score update live.',
        stack: ['TypeScript', 'React', 'Zod']
      }
    ]
  },
  demoOptimizador: {
    meta: {
      titulo: 'Joist cutting optimizer | Demo by Patricio Polito',
      descripcion:
        'Live demo: integer linear programming in the browser to minimize steel in joist production.'
    },
    eyebrow: 'Live demo',
    titulo: 'Joist cutting optimizer',
    bajada:
      'Enter the demand for each length and get the production plan that minimizes steel. The model is solved in your browser, with HiGHS (WebAssembly) inside a Web Worker.',
    aviso:
      'Illustrative data based on common commercial lengths; not measurements from a real plant.',
    leerCaso: 'Read the case study',
    verCodigo: 'View the code',
    entrada: {
      titulo: 'Demand',
      medida: 'Length',
      largo: 'Length (m)',
      acero: 'Minimum steel',
      demanda: 'Demand',
      quitar: 'Remove length {id}',
      agregar: 'Add length',
      restaurar: 'Reset example',
      costos: 'Relative steel cost per row',
      optimizar: 'Optimize',
      calculando: 'Calculating…'
    },
    diametros: { fino: 'Thin', medio: 'Medium', grueso: 'Thick' },
    bancoDe: {
      fino: 'Thin-steel bed',
      medio: 'Medium-steel bed',
      grueso: 'Thick-steel bed'
    },
    errores: {
      'sin-demanda': 'Enter demand for at least one length.',
      'id-repetido': 'Two lengths share the same name: {id}.',
      'largo-invalido': 'The length of {id} must be a number greater than 0.',
      'largo-excede-fila': 'Length {id} is longer than the 33 m row.',
      'demanda-invalida':
        'The demand for {id} must be an integer between 0 and 10,000.',
      'costo-invalido': 'Costs must be numbers greater than 0.',
      'demasiados-tipos': 'Up to 8 lengths are supported.',
      infactible: 'There is no feasible plan for this data.',
      error: "The plan couldn't be calculated. Please try again."
    },
    resultado: {
      titulo: 'Optimal plan',
      costo: 'Steel cost',
      vsHeuristica: 'vs. {valor} filling beds first come, first served',
      ahorro: 'Steel savings',
      ahorroDetalle:
        'versus first come, first served (average of 200 random orders)',
      sobreMinimo: 'Above the theoretical minimum',
      sobreMinimoDetalle:
        'minimum: {valor}, with every piece on its exact steel and no offcuts',
      bancos: 'Beds',
      bancosDetalle: '{jornadas} production days of 3 beds',
      recorte: 'Total offcut',
      recorteDetalle: 'across {filas} rows of 33 m',
      bancosTitulo: 'How to produce',
      fila: 'Row {n}',
      recorteFila: 'offcut {valor} m',
      produccionTitulo: 'Production',
      producido: 'Produced',
      aStock: 'To stock',
      resumenVivo: 'Plan ready: cost {costo}, savings {ahorro}.',
      tiempo: '{patrones} cutting patterns evaluated in {ms} ms.'
    },
    comoFunciona: {
      titulo: 'How it works',
      pasos: [
        'Generates every maximal cutting pattern for a 33 m row and each steel diameter, making sure no joist gets thinner steel than its minimum.',
        'Builds an integer linear programming model: minimize steel cost while meeting demand, with beds of 3 rows of the same diameter and production days of 3 beds.',
        'HiGHS solves it with simplex and branch and bound, inside a Web Worker so the page stays responsive.',
        'Compares the plan with the previous practice: filling rows in the order joists arrive, with each bed using the steel of its longest joist.'
      ]
    }
  },
  demoFormulario: {
    meta: {
      titulo: 'Dynamic form | Demo by Patricio Polito',
      descripcion:
        'Live demo: a quality form described in JSON and rendered by a recursive React component, with a live score.'
    },
    eyebrow: 'Live demo',
    titulo: 'Dynamic form',
    bajada:
      'A quality form described in JSON and rendered by a recursive React component. Answer it and watch nested fields appear and the score change; then edit the JSON and the form updates without reloading.',
    aviso:
      'Illustrative form. In the real system the official score was calculated on the backend; this is a preview.',
    leerCaso: 'Read the case study',
    verCodigo: 'View the code',
    planilla: {
      nivel: 'Level {n}',
      critico: 'Critical',
      descuenta: '−{n} pts',
      si: 'Yes',
      no: 'No',
      elegir: 'Choose an option'
    },
    puntaje: {
      titulo: 'Score (preview)',
      de: 'out of {total}',
      respondidos: '{r} of {e} scored items answered',
      sinDescuentos: 'No deductions so far.',
      descuentos: 'Deductions',
      criticoTitulo: 'Critical item failed',
      criticoTexto: 'The review scores 0 because this failed: {etiqueta}',
      anuncio: 'Score: {p} out of {t}.'
    },
    editor: {
      titulo: 'Edit the form (JSON)',
      ayuda:
        'Changes apply as you type, as long as the JSON is valid. Field types: si-no (yes/no), seleccion (select), checkbox and texto (text). Try adding a fourth level inside "hijos".',
      etiqueta: 'Form JSON',
      formatear: 'Format',
      restaurar: 'Reset example',
      valido: 'Valid JSON: the form is up to date.',
      invalido: 'The JSON has problems; the last valid version is still shown.'
    },
    errores: {
      json: 'The JSON is not valid: {detalle}',
      esquema: '{ruta}: {mensaje}',
      'id-duplicado': 'The id “{id}” is used more than once.',
      'falta-falla':
        'Field “{id}” has a weight or is critical, but doesn\'t define "falla".',
      'falta-opciones': 'Select “{id}” needs "opciones".',
      'falla-no-es-opcion':
        'The "falla" value of “{id}” is not one of its options.',
      profundidad:
        '“{id}” goes beyond the {maximo} levels allowed in the demo.',
      raiz: 'form'
    },
    comoFunciona: {
      titulo: 'How it works',
      pasos: [
        'The form is a JSON tree: each field has a type, the condition for showing its children, a weight and whether it is critical.',
        'A component registry maps each field type to its React component, replacing what Blade used to do on the server.',
        'A recursive component renders each field and, if the answer meets the condition, calls itself with the children: any depth, no code changes.',
        "The score deducts failed regular items and drops to 0 if a critical item fails; hidden fields don't count. Zod validates the JSON before applying it."
      ]
    }
  },
  experiencia: {
    eyebrow: 'Career',
    titulo: 'Experience',
    actualidad: 'present',
    verCaso: 'See case study'
  },
  stack: {
    eyebrow: 'Tools',
    titulo: 'Stack',
    grupos: [
      {
        titulo: 'Frontend',
        items: [
          'React',
          'TypeScript',
          'JavaScript (ES6+)',
          'React Native',
          'Angular',
          'Material UI',
          'Storybook',
          'Bootstrap',
          'jQuery'
        ]
      },
      {
        titulo: 'Backend',
        items: ['Node.js', 'Express', 'PHP', 'Laravel', 'REST API', 'SOAP']
      },
      {
        titulo: 'Data',
        items: [
          'SQL Server (stored procedures)',
          'MySQL',
          'PostgreSQL',
          'Firebird'
        ]
      },
      {
        titulo: 'Quality',
        items: ['Jest', 'Vitest', 'Playwright', 'Cypress', 'PHPUnit']
      },
      {
        titulo: 'Tooling',
        items: ['Git', 'Docker', 'Kubernetes', 'Webpack', 'SCRUM']
      },
      {
        titulo: 'Exploring',
        items: ['n8n', 'Claude API', 'LangChain', 'LangGraph']
      }
    ]
  },
  formacion: {
    eyebrow: 'Education',
    titulo: 'Education',
    items: [
      {
        titulo: 'Information Systems Engineering',
        institucion: 'UTN — Tucumán Regional School',
        detalle: 'Graduated 2025'
      },
      {
        titulo: 'Computer Technician',
        institucion: 'Technical School No. 5, Tucumán',
        detalle: 'Flag bearer · GPA 7.33/10'
      }
    ]
  },
  contacto: {
    eyebrow: 'Contact',
    titulo: "Let's talk",
    bajada:
      "I'm open to long-term, remote Senior Frontend or Full Stack roles. Reach me through the form, WhatsApp or email.",
    ubicacion: 'San Miguel de Tucumán, Argentina · Remote',
    idiomas: 'Spanish (native) · English (pre-intermediate)',
    whatsapp: 'Message me on WhatsApp',
    mensajeWhatsapp: "Hi Patricio, I saw your portfolio and I'd like to talk.",
    form: {
      titulo: 'Contact form',
      nombre: 'Name',
      email: 'Email',
      empresa: 'Company (optional)',
      mensaje: 'Message',
      enviar: 'Send message',
      honeypot: "Don't fill this out if you're human"
    }
  },
  gracias: {
    titulo: 'Thanks for reaching out!',
    texto: "I got your message and I'll reply shortly.",
    volver: 'Back to home'
  },
  noEncontrada: {
    titulo: 'Page not found',
    texto: "The page you're looking for doesn't exist or has moved.",
    volver: 'Back to home'
  },
  footer: {
    derechos: 'Patricio Rolando Polito.',
    hecho: 'Built with Astro and React.'
  }
}
