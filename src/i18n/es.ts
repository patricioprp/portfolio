export const es = {
  meta: {
    titulo: 'Patricio Rolando Polito | Frontend Senior',
    descripcion:
      'Frontend Senior e Ingeniero en Sistemas con más de 10 años de experiencia en React, Node y Laravel. Casos de estudio con impacto medible y demos en vivo.',
    tituloPersona: 'Frontend Senior'
  },
  nav: {
    saltar: 'Saltar al contenido',
    principal: 'Navegación principal',
    inicio: 'Inicio',
    casos: 'Casos',
    demos: 'Demos',
    experiencia: 'Experiencia',
    stack: 'Stack',
    contacto: 'Contacto',
    abrirMenu: 'Abrir menú',
    cerrarMenu: 'Cerrar menú',
    temaClaro: 'Cambiar a modo claro',
    temaOscuro: 'Cambiar a modo oscuro'
  },
  hero: {
    disponible: 'Abierto a nuevas oportunidades',
    nombre: 'Patricio Rolando Polito',
    rol: 'Frontend Senior · Ingeniero en Sistemas',
    propuesta:
      'Convierto procesos operativos en software que ahorra tiempo y dinero.',
    bajada:
      'Más de 10 años con React, Node y Laravel: de la migración de sistemas legacy a la optimización matemática de la producción.',
    verCasos: 'Ver casos de estudio',
    descargarCv: 'Descargar CV',
    contactar: 'Contactar'
  },
  impacto: {
    titulo: 'Impacto en números',
    items: [
      { valor: '+10 años', etiqueta: 'desarrollando software en producción' },
      {
        valor: '3 días → 0',
        etiqueta: 'de espera de camiones en una planta industrial'
      },
      {
        valor: '0 deploys',
        etiqueta: 'para crear o cambiar una planilla de calidad'
      }
    ]
  },
  casos: {
    eyebrow: 'Casos de estudio',
    titulo: 'Problemas reales, resultados concretos',
    bajada:
      'Tres proyectos contados como problema, solución e impacto, con las decisiones técnicas detrás.',
    problema: 'Problema',
    solucion: 'Solución',
    impacto: 'Impacto',
    leerCaso: 'Leer el caso completo'
  },
  caso: {
    volver: 'Todos los casos',
    enTreinta: 'En 30 segundos',
    cliente: 'Cliente',
    rol: 'Rol',
    periodo: 'Período',
    stack: 'Stack',
    metricas: 'Resultados clave',
    demoTitulo: 'Probalo en vivo',
    demoTexto:
      'Estoy preparando una reimplementación abierta de este caso, con datos de ejemplo, para usar en el navegador.',
    demoProximamente: 'La demo estará disponible próximamente.',
    demoDisponible:
      'Hay una reimplementación abierta de este caso, con datos de ejemplo, que podés usar en el navegador.',
    demoAbrir: 'Abrir la demo',
    ilustrativa: 'Ejemplo ilustrativo de la demo, no medido en producción.',
    ctaTitulo: '¿Este tipo de experiencia le suma a tu equipo?',
    ctaTexto:
      'Busco una posición estable como Frontend Senior o Full Stack. Conversemos.',
    ctaBoton: 'Contactame',
    anterior: 'Caso anterior',
    siguiente: 'Caso siguiente'
  },
  demos: {
    eyebrow: 'Demos en vivo',
    titulo: 'Probalo en el navegador',
    bajada:
      'Reimplementaciones abiertas de dos de los casos, con datos de ejemplo y el código en GitHub.',
    proximamente: 'Próximamente',
    probar: 'Probar la demo',
    items: [
      {
        slug: 'optimizador-viguetas',
        titulo: 'Optimizador de cortes de viguetas',
        descripcion:
          'Cargás la demanda y obtenés el plan de producción que minimiza el acero, comparado con llenar los bancos por orden de llegada.',
        stack: ['TypeScript', 'React', 'Web Worker', 'HiGHS (WebAssembly)']
      },
      {
        slug: 'formulario-dinamico',
        titulo: 'Formulario dinámico',
        descripcion:
          'Editás el JSON de una planilla con campos anidados en tres niveles y ves el formulario y el puntaje actualizarse en vivo.',
        stack: ['TypeScript', 'React', 'Zod']
      }
    ]
  },
  demoOptimizador: {
    meta: {
      titulo: 'Optimizador de cortes de viguetas | Demo de Patricio Polito',
      descripcion:
        'Demo en vivo: programación lineal entera en el navegador para minimizar el acero en la producción de viguetas.'
    },
    eyebrow: 'Demo en vivo',
    titulo: 'Optimizador de cortes de viguetas',
    bajada:
      'Cargá la demanda de cada medida y obtené el plan de producción que minimiza el acero. El modelo se resuelve en tu navegador, con HiGHS (WebAssembly) dentro de un Web Worker.',
    aviso:
      'Datos ilustrativos basados en largos comerciales habituales; no son mediciones de una planta real.',
    leerCaso: 'Leer el caso de estudio',
    verCodigo: 'Ver el código',
    entrada: {
      titulo: 'Demanda',
      medida: 'Medida',
      largo: 'Largo (m)',
      acero: 'Acero mínimo',
      demanda: 'Demanda',
      quitar: 'Quitar la medida {id}',
      agregar: 'Agregar medida',
      restaurar: 'Restaurar ejemplo',
      costos: 'Costo relativo del acero por fila',
      optimizar: 'Optimizar',
      calculando: 'Calculando…'
    },
    diametros: { fino: 'Fino', medio: 'Medio', grueso: 'Grueso' },
    bancoDe: {
      fino: 'Banco de acero fino',
      medio: 'Banco de acero medio',
      grueso: 'Banco de acero grueso'
    },
    errores: {
      'sin-demanda': 'Cargá demanda en al menos una medida.',
      'id-repetido': 'Hay dos medidas con el mismo nombre: {id}.',
      'largo-invalido': 'El largo de {id} tiene que ser un número mayor que 0.',
      'largo-excede-fila': 'La medida {id} es más larga que la fila de 33 m.',
      'demanda-invalida':
        'La demanda de {id} tiene que ser un entero entre 0 y 10.000.',
      'costo-invalido': 'Los costos tienen que ser números mayores que 0.',
      'demasiados-tipos': 'Se admiten hasta 8 medidas.',
      infactible: 'No hay un plan posible con estos datos.',
      error: 'No se pudo calcular el plan. Probá de nuevo.'
    },
    resultado: {
      titulo: 'Plan óptimo',
      costo: 'Costo del acero',
      vsHeuristica: 'vs. {valor} llenando los bancos por orden de llegada',
      ahorro: 'Ahorro de acero',
      ahorroDetalle:
        'frente al orden de llegada (promedio de 200 órdenes aleatorios)',
      sobreMinimo: 'Sobre el mínimo teórico',
      sobreMinimoDetalle:
        'mínimo: {valor}, con cada pieza en su acero justo y sin recortes',
      bancos: 'Bancos',
      bancosDetalle: '{jornadas} jornadas de 3 bancos',
      recorte: 'Recorte total',
      recorteDetalle: 'en {filas} filas de 33 m',
      bancosTitulo: 'Cómo producir',
      fila: 'Fila {n}',
      recorteFila: 'recorte {valor} m',
      produccionTitulo: 'Producción',
      producido: 'Producido',
      aStock: 'A stock',
      resumenVivo: 'Plan listo: costo {costo}, ahorro {ahorro}.',
      tiempo: '{patrones} patrones de corte evaluados en {ms} ms.'
    },
    comoFunciona: {
      titulo: 'Cómo funciona',
      pasos: [
        'Genera todos los patrones de corte maximales de una fila de 33 m para cada diámetro de acero, respetando que una vigueta nunca lleve un acero más fino que su mínimo.',
        'Arma un modelo de programación lineal entera: minimizar el costo del acero cubriendo la demanda, con bancos de 3 filas del mismo diámetro y jornadas de 3 bancos.',
        'HiGHS lo resuelve con símplex y branch and bound, dentro de un Web Worker para que la página no se trabe.',
        'Compara el plan con la práctica anterior: llenar las filas en el orden en que llegan las viguetas, con cada banco tomando el acero de la más larga.'
      ]
    }
  },
  experiencia: {
    eyebrow: 'Trayectoria',
    titulo: 'Experiencia',
    actualidad: 'actualidad',
    verCaso: 'Ver caso'
  },
  stack: {
    eyebrow: 'Herramientas',
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
        items: ['Node.js', 'Express', 'PHP', 'Laravel', 'API REST', 'SOAP']
      },
      {
        titulo: 'Datos',
        items: [
          'SQL Server (stored procedures)',
          'MySQL',
          'PostgreSQL',
          'Firebird'
        ]
      },
      {
        titulo: 'Calidad',
        items: ['Jest', 'Vitest', 'Playwright', 'Cypress', 'PHPUnit']
      },
      {
        titulo: 'Herramientas',
        items: ['Git', 'Docker', 'Kubernetes', 'Webpack', 'SCRUM']
      },
      {
        titulo: 'Explorando',
        items: ['n8n', 'Claude API', 'LangChain', 'LangGraph']
      }
    ]
  },
  formacion: {
    eyebrow: 'Formación',
    titulo: 'Formación académica',
    items: [
      {
        titulo: 'Ingeniería en Sistemas de Información',
        institucion: 'UTN — Facultad Regional Tucumán',
        detalle: 'Egreso 2025'
      },
      {
        titulo: 'Técnico en Computación',
        institucion: 'Escuela Técnica N.º 5, Tucumán',
        detalle: 'Abanderado · Promedio 7,33'
      }
    ]
  },
  contacto: {
    eyebrow: 'Contacto',
    titulo: 'Hablemos',
    bajada:
      'Estoy abierto a posiciones de Frontend Senior o Full Stack, remotas y a largo plazo. Escribime por el formulario, WhatsApp o email.',
    ubicacion: 'San Miguel de Tucumán, Argentina · Remoto',
    idiomas: 'Español (nativo) · Inglés (pre-intermedio)',
    whatsapp: 'Escribime por WhatsApp',
    mensajeWhatsapp: 'Hola Patricio, vi tu portfolio y me gustaría hablar.',
    form: {
      titulo: 'Formulario de contacto',
      nombre: 'Nombre',
      email: 'Email',
      empresa: 'Empresa (opcional)',
      mensaje: 'Mensaje',
      enviar: 'Enviar mensaje',
      honeypot: 'No completes este campo si sos humano'
    }
  },
  gracias: {
    titulo: '¡Gracias por escribirme!',
    texto: 'Recibí tu mensaje. Te respondo a la brevedad.',
    volver: 'Volver al inicio'
  },
  noEncontrada: {
    titulo: 'Página no encontrada',
    texto: 'La página que buscás no existe o se movió.',
    volver: 'Volver al inicio'
  },
  footer: {
    derechos: 'Patricio Rolando Polito.',
    hecho: 'Hecho con Astro y React.'
  }
}
