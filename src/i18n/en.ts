import type { Diccionario } from './index'

export const en: Diccionario = {
  meta: {
    titulo: 'Patricio R. Polito | Senior Frontend Developer',
    descripcion:
      'Senior Frontend Developer and Systems Engineer with 10+ years building software, today with React, Node and TypeScript. Case studies with measurable impact and live demos.',
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
    temaOscuro: 'Switch to dark mode',
    otroIdioma: 'ES',
    otroIdiomaEtiqueta: 'Leer esta página en español'
  },
  hero: {
    disponible: 'Open to new opportunities',
    credencial: 'Information Systems Engineer · UTN',
    nombre: 'Patricio R. Polito',
    rol: 'Senior Frontend Developer · Full stack experience',
    propuesta:
      'I turn operational processes into software that saves time and money.',
    bajada:
      '10+ years building software, today with React, Node and TypeScript, previously Laravel: from migrating legacy systems to mathematical optimization of production.',
    verCasos: 'See case studies',
    descargarCv: 'Download CV',
    contactar: 'Get in touch'
  },
  impacto: {
    titulo: 'Impact in numbers',
    items: [
      { valor: '10+ years', etiqueta: 'building production software' },
      {
        valor: 'Up to 3 days → 0',
        etiqueta: 'truck waiting time at an industrial plant'
      },
      {
        valor: '0 deploys',
        etiqueta: 'to create or change a quality scorecard'
      }
    ]
  },
  casos: {
    eyebrow: 'Case studies',
    titulo: 'Real problems, concrete results',
    bajada:
      'Five projects told as problem, solution and impact, with the technical decisions behind them.',
    problema: 'Problem',
    solucion: 'Solution',
    impacto: 'Impact',
    leerCaso: 'Read the full case study'
  },
  caso: {
    volver: 'All case studies',
    etiqueta: 'Case study',
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
      'Open-source reimplementations of four of the case studies, with sample data and the code on GitHub.',
    proximamente: 'Coming soon',
    probar: 'Try the demo',
    items: [
      {
        slug: 'contingencias',
        titulo: 'Contingency simulator',
        descripcion:
          'Turn off a request, announce maintenance or pause the whole portal from a remote configuration, and watch it respond with no deploys.',
        stack: ['TypeScript', 'React', 'Feature flags']
      },
      {
        slug: 'mapa-beneficios',
        titulo: 'Benefits map',
        descripcion:
          'A mobile-first map with clustering, a carousel for businesses sharing a building, a synced list and QR redemption.',
        stack: ['TypeScript', 'React', 'SVG map', 'Mobile-first']
      },
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
          'Edit the JSON of a quality scorecard with fields nested three levels deep and watch the form and score update live.',
        stack: ['TypeScript', 'React', 'Zod']
      }
    ]
  },
  demoOptimizador: {
    meta: {
      titulo: 'Joist cutting optimizer | Demo by Patricio R. Polito',
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
      restaurar: 'Reset to example',
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
      vsHeuristica: 'vs. {valor} filling beds in order of arrival',
      ahorro: 'Steel savings',
      ahorroDetalle:
        'versus filling in order of arrival (average of 200 random arrival sequences)',
      sobreMinimo: 'Above the theoretical minimum',
      sobreMinimoDetalle:
        'minimum: {valor}, with each joist using exactly the steel it needs and no offcuts',
      bancos: 'Beds',
      bancosDetalle: '{jornadas} production days of 3 beds',
      recorte: 'Total offcuts',
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
        'Compares the plan with a simple baseline that mimics the previous practice: filling rows in the order joists arrive, with each bed using the steel of its longest joist.'
      ]
    }
  },
  demoFormulario: {
    meta: {
      titulo: 'Dynamic form | Demo by Patricio R. Polito',
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
      restaurar: 'Reset to example',
      valido: 'Valid JSON: the form is up to date.',
      invalido: 'The JSON has problems; the last valid version is still shown.'
    },
    errores: {
      json: 'The JSON is not valid: {detalle}',
      esquema: '{ruta}: {mensaje}',
      'id-duplicado': 'The id “{id}” is used more than once.',
      'falta-falla':
        'Field “{id}” has a weight or is critical, but doesn\'t define "falla".',
      'falta-opciones': 'The select field “{id}” needs "opciones".',
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
        'A recursive component renders each field and, if the answer meets the condition, calls itself with the children: any depth with no code changes (the demo allows up to 5 levels).',
        "The score deducts failed regular items and drops to 0 if a critical item fails; hidden fields don't count. Zod validates the JSON before applying it."
      ]
    }
  },
  demoContingencias: {
    meta: {
      titulo: 'Contingency simulator | Demo by Patricio R. Polito',
      descripcion:
        'Live demo: a remote configuration turns off requests, announces maintenance or puts the whole portal in maintenance, with no deploys.'
    },
    eyebrow: 'Live demo',
    titulo: 'Contingency simulator',
    bajada:
      'This is how a portal with dozens of requests degrades gracefully: a single remote configuration turns off one request, announces maintenance or pauses the whole platform. Change the configuration and watch the portal respond, with no deploys.',
    aviso:
      "Fictional portal with generic requests. A simplified reimplementation to show the concept; it's not the client's code.",
    leerCaso: 'Read the case study',
    verCodigo: 'View the code',
    tramites: {
      reintegros: 'Reimbursements',
      autorizaciones: 'Authorizations',
      facturacion: 'Billing and payments',
      discapacidad: 'Disability',
      credencial: 'Digital ID card',
      cartilla: 'Provider directory'
    },
    control: {
      titulo: 'Remote configuration',
      total: 'Full maintenance',
      forzar: 'Force now',
      programar: 'Schedule a window',
      desde: 'From',
      hasta: 'To',
      apagados: 'Requests turned off',
      aviso: 'Scheduled maintenance notice',
      mostrarAviso: 'Announce a maintenance window',
      reloj: 'Simulated time',
      relojAyuda:
        'Move the clock forward to see when scheduled windows take effect.',
      relojValor: '+{h} h · {fecha}',
      ventanaInvalida: 'The end date must be after the start date.',
      restaurar: 'Reset',
      json: 'How the configuration travels (JSON)'
    },
    portal: {
      titulo: "Member's view",
      nombre: 'Member portal',
      hola: 'Hi, which request do you want to start?',
      disponible: 'Available',
      apagado: 'Temporarily unavailable',
      avisoProximo:
        'Scheduled maintenance: {desde} – {hasta}. Some requests may be unavailable.',
      avisoEnCurso:
        'Maintenance in progress until {hasta}. Some requests may be unavailable.',
      totalTitulo: "We're making improvements",
      totalTexto: 'The portal will be back shortly.',
      totalHasta: 'The portal will be back on {hasta}.',
      anuncio: 'Portal updated: {estado}.',
      estadoOperativo: '{n} requests available',
      estadoTotal: 'full maintenance'
    },
    comoFunciona: {
      titulo: 'How it works',
      pasos: [
        'In the real system, the app polls a remote configuration (Firebase Remote Config) every minute; here you edit that configuration in the panel.',
        'Full maintenance wins over everything else: it can be forced or scheduled for a date and time window.',
        "When the platform is up, each request that's turned off shows as unavailable while the rest keep working: one request fails, not the portal.",
        'A scheduled notice shows a banner before and during the window and disappears on its own when it ends. The logic lives in plain TypeScript with tests.'
      ]
    }
  },
  demoMapa: {
    meta: {
      titulo: 'Benefits map | Demo by Patricio R. Polito',
      descripcion:
        'Live demo: a mobile-first map with clustering, a carousel for businesses sharing a building, a synced list and QR redemption.'
    },
    eyebrow: 'Live demo',
    titulo: 'Benefits map',
    bajada:
      'A reimplementation of the hard cases I solved on the map: clusters when there are many results, a carousel when several businesses share a building, and a list and map kept in sync. It also includes the journey to the coupon. Try it the way a member would, ideally on your phone.',
    aviso:
      'Fictional city and businesses, map drawn in SVG. An illustrative reimplementation: the real system uses Google Maps and is not this code.',
    leerCaso: 'Read the case study',
    verCodigo: 'View the code',
    rubros: {
      gastronomia: 'Food & drink',
      farmacia: 'Pharmacy',
      optica: 'Eyewear',
      deportes: 'Sports',
      indumentaria: 'Clothing',
      libreria: 'Bookstore'
    },
    zonas: {
      centro: 'Downtown',
      norte: 'North side',
      sur: 'South side'
    },
    ui: {
      filtros: 'Filters',
      zona: 'Area',
      rubro: 'Category',
      todas: 'All',
      todos: 'All',
      vista: 'View',
      tabMapa: 'Map',
      tabListado: 'List',
      resultados: '{n} businesses',
      sinResultados: 'No businesses match these filters.',
      mapaEtiqueta:
        'Benefits map. Drag or use the arrow keys to move the map; + and − to zoom in or out.',
      acercar: 'Zoom in',
      alejar: 'Zoom out',
      miUbicacion: 'Back to my location',
      tuUbicacion: 'Your location',
      buscarZona: 'Search this area',
      verTodos: 'Show all results',
      filtradoZona: 'Showing this map area only',
      cluster: '{n} businesses in this area. Zoom in',
      pinComercio: '{nombre}: {descuento}% off',
      pinGrupo: '{n} businesses at this location',
      descuento: '{n}% off',
      distancia: '{km} km away',
      verDetalle: 'See details',
      verEnMapa: 'Show on map',
      cerrar: 'Close',
      anterior: 'Previous business',
      siguiente: 'Next business',
      carrusel: '{n} businesses at the same location',
      posicion: '{i} of {n}',
      anuncioSeleccion: 'Selected: {nombre}'
    },
    canje: {
      pasos: ['Details', 'QR code', 'Coupon'],
      verQr: 'Show QR code',
      qrTexto: 'Show this code at the business to generate your coupon.',
      qrAviso: "Illustrative QR, it can't be scanned.",
      generar: 'Generate coupon',
      cuponTitulo: 'Coupon ready!',
      cuponTexto: '{descuento}% off at {nombre}. Valid today.',
      codigo: 'Coupon code',
      volver: 'Back',
      terminar: 'Done'
    },
    comoFunciona: {
      titulo: 'How it works',
      pasos: [
        'Businesses are grouped by coordinates: if several share a building, the map shows a single pin that opens a carousel instead of overlapping pins.',
        'When zoomed out, pins that fall in the same cell of a screen grid merge into a cluster with the count; tapping it zooms into that area.',
        'The list and the map share the selected business: "Show on map" switches views, centers the map on its pin and opens its card.',
        'Moving the map reveals "Search this area", which filters results to the visible area. The logic lives in plain TypeScript with tests.'
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
          'Next.js',
          'JavaScript (ES6+)',
          'Microfrontends (Module Federation)',
          'Storybook',
          'Material UI',
          'React Native',
          'Angular',
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
        items: [
          'Git',
          'GitLab CI',
          'Docker',
          'Kubernetes',
          'Firebase Remote Config',
          'Figma',
          'Webpack',
          'SCRUM'
        ]
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
        institucion:
          'National Technological University (UTN) — Tucumán Regional Faculty',
        detalle: "Bachelor's-level engineering degree · 2025",
        destacado: true,
        nota: 'The Operations Research I used to model the cutting optimizer comes from this degree.',
        enlace: { texto: 'See the case study', caso: 'optimizador-viguetas' }
      },
      {
        titulo: 'Computer Technician',
        institucion: 'Technical School No. 5, Tucumán',
        detalle: '2000 – 2006'
      }
    ]
  },
  cv: {
    perfil: 'Profile',
    perfilTexto:
      'Senior Frontend Developer with full stack experience and an Information Systems Engineering degree. 10+ years building production software, today with React, Node and TypeScript, previously Laravel. I focus on migrating legacy systems, building software the business can configure without deploys, and applying mathematical optimization to operational processes.',
    casos: 'Selected case studies',
    contacto: 'Contact',
    idiomas: 'Languages',
    portfolio: 'Portfolio with case studies and live demos'
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
    derechos: 'Patricio R. Polito.',
    hecho: 'Built with Astro and React.'
  }
}
