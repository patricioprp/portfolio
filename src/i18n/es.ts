export const es = {
  meta: {
    titulo: 'Patricio R. Polito | Frontend Senior',
    descripcion:
      'Frontend Senior e Ingeniero en Sistemas con más de 10 años desarrollando software, hoy con React, Node y TypeScript. Casos de estudio con impacto medible y demos en vivo.',
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
    temaOscuro: 'Cambiar a modo oscuro',
    otroIdioma: 'EN',
    otroIdiomaEtiqueta: 'Read this page in English'
  },
  hero: {
    disponible: 'Abierto a nuevas oportunidades',
    credencial: 'Ingeniero en Sistemas de Información · UTN',
    nombre: 'Patricio R. Polito',
    rol: 'Frontend Senior · Experiencia full stack',
    propuesta:
      'Convierto procesos operativos en software que ahorra tiempo y dinero.',
    bajada:
      'Más de 10 años desarrollando software, hoy con React, Node y TypeScript y antes con Laravel: de la migración de sistemas legacy a la optimización matemática de la producción.',
    verCasos: 'Ver casos de estudio',
    descargarCv: 'Descargar CV',
    contactar: 'Contactar'
  },
  impacto: {
    titulo: 'Impacto en números',
    items: [
      { valor: '+10 años', etiqueta: 'desarrollando software en producción' },
      {
        valor: 'Hasta 3 días → 0',
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
      'Cuatro proyectos contados como problema, solución e impacto, con las decisiones técnicas detrás.',
    problema: 'Problema',
    solucion: 'Solución',
    impacto: 'Impacto',
    leerCaso: 'Leer el caso completo'
  },
  caso: {
    volver: 'Todos los casos',
    etiqueta: 'Caso de estudio',
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
      'Reimplementaciones abiertas de tres de los casos, con datos de ejemplo y el código en GitHub.',
    proximamente: 'Próximamente',
    probar: 'Probar la demo',
    items: [
      {
        slug: 'contingencias',
        titulo: 'Simulador de contingencias',
        descripcion:
          'Apagás un trámite, anunciás un mantenimiento o ponés todo el portal en pausa desde una configuración remota, y ves cómo responde sin deploys.',
        stack: ['TypeScript', 'React', 'Feature flags']
      },
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
      titulo: 'Optimizador de cortes de viguetas | Demo de Patricio R. Polito',
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
        'frente al orden de llegada (promedio de 200 secuencias de llegada aleatorias)',
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
        'Compara el plan con una referencia simple que imita la práctica anterior: llenar las filas en el orden en que llegan las viguetas, con cada banco tomando el acero de la más larga.'
      ]
    }
  },
  demoFormulario: {
    meta: {
      titulo: 'Formulario dinámico | Demo de Patricio R. Polito',
      descripcion:
        'Demo en vivo: una planilla de calidad descrita en JSON y dibujada por un componente React recursivo, con puntaje en vivo.'
    },
    eyebrow: 'Demo en vivo',
    titulo: 'Formulario dinámico',
    bajada:
      'Una planilla de calidad descrita en JSON y dibujada por un componente React recursivo. Respondé y mirá cómo aparecen los campos anidados y cambia el puntaje; después editá el JSON y la planilla se actualiza sin recargar.',
    aviso:
      'Planilla ilustrativa. En el sistema real el puntaje oficial lo calculaba el backend; acá es una vista previa.',
    leerCaso: 'Leer el caso de estudio',
    verCodigo: 'Ver el código',
    planilla: {
      nivel: 'Nivel {n}',
      critico: 'Crítico',
      descuenta: '−{n} pts',
      si: 'Sí',
      no: 'No',
      elegir: 'Elegí una opción'
    },
    puntaje: {
      titulo: 'Puntaje (vista previa)',
      de: 'de {total}',
      respondidos: '{r} de {e} ítems evaluables respondidos',
      sinDescuentos: 'Sin descuentos por ahora.',
      descuentos: 'Descuentos',
      criticoTitulo: 'Ítem crítico fallido',
      criticoTexto: 'La evaluación vale 0 porque falló: {etiqueta}',
      anuncio: 'Puntaje: {p} de {t}.'
    },
    editor: {
      titulo: 'Editá la planilla (JSON)',
      ayuda:
        'Los cambios se aplican mientras escribís, si el JSON es válido. Tipos de campo: si-no, seleccion, checkbox y texto. Probá agregar un cuarto nivel dentro de "hijos".',
      etiqueta: 'JSON de la planilla',
      formatear: 'Formatear',
      restaurar: 'Restaurar ejemplo',
      valido: 'JSON válido: la planilla está actualizada.',
      invalido:
        'Hay problemas en el JSON; se sigue mostrando la última versión válida.'
    },
    errores: {
      json: 'El JSON no es válido: {detalle}',
      esquema: '{ruta}: {mensaje}',
      'id-duplicado': 'El id «{id}» está repetido.',
      'falta-falla':
        'El campo «{id}» tiene peso o es crítico, pero no define "falla".',
      'falta-opciones': 'La selección «{id}» necesita "opciones".',
      'falla-no-es-opcion': 'La "falla" de «{id}» no es una de sus opciones.',
      profundidad: '«{id}» supera los {maximo} niveles permitidos en la demo.',
      raiz: 'planilla'
    },
    comoFunciona: {
      titulo: 'Cómo funciona',
      pasos: [
        'La planilla es un árbol JSON: cada campo tiene un tipo, la condición para mostrar a sus hijos, un peso y si es crítico.',
        'Un registro de componentes asocia cada tipo de campo con su componente React, el reemplazo de lo que antes hacía Blade en el servidor.',
        'Un componente recursivo dibuja cada campo y, si la respuesta cumple la condición, se llama a sí mismo con los hijos: cualquier profundidad sin cambiar código (la demo admite hasta 5 niveles).',
        'El puntaje descuenta los ítems comunes que fallan y vale 0 si falla un ítem crítico; los campos ocultos no cuentan. Zod valida el JSON antes de aplicarlo.'
      ]
    }
  },
  demoContingencias: {
    meta: {
      titulo: 'Simulador de contingencias | Demo de Patricio R. Polito',
      descripcion:
        'Demo en vivo: una configuración remota apaga trámites, anuncia mantenimientos o pone todo el portal en mantenimiento, sin deploys.'
    },
    eyebrow: 'Demo en vivo',
    titulo: 'Simulador de contingencias',
    bajada:
      'Así se degrada de forma controlada un portal con decenas de trámites: una única configuración remota apaga un trámite, anuncia un mantenimiento o pone toda la plataforma en pausa. Cambiá la configuración y mirá cómo responde el portal, sin deploys.',
    aviso:
      'Portal ficticio con trámites genéricos. Reimplementación simplificada para mostrar el concepto; no es el código del cliente.',
    leerCaso: 'Leer el caso de estudio',
    verCodigo: 'Ver el código',
    tramites: {
      reintegros: 'Reintegros',
      autorizaciones: 'Autorizaciones',
      facturacion: 'Facturación y pagos',
      discapacidad: 'Discapacidad',
      credencial: 'Credencial digital',
      cartilla: 'Cartilla médica'
    },
    control: {
      titulo: 'Configuración remota',
      total: 'Mantenimiento total',
      forzar: 'Forzar ahora',
      programar: 'Programar una ventana',
      desde: 'Desde',
      hasta: 'Hasta',
      apagados: 'Trámites apagados',
      aviso: 'Aviso de mantenimiento programado',
      mostrarAviso: 'Anunciar un mantenimiento',
      reloj: 'Hora simulada',
      relojAyuda:
        'Adelantá el reloj para ver cuándo entran en vigor las ventanas programadas.',
      relojValor: '+{h} h · {fecha}',
      ventanaInvalida:
        'La fecha de fin tiene que ser posterior a la de inicio.',
      restaurar: 'Restaurar',
      json: 'Así viaja la configuración (JSON)'
    },
    portal: {
      titulo: 'Vista del socio',
      nombre: 'Portal de socios',
      hola: 'Hola, ¿qué trámite querés hacer?',
      disponible: 'Disponible',
      apagado: 'No disponible por el momento',
      avisoProximo:
        'Mantenimiento programado: {desde} – {hasta}. Algunos trámites podrían no estar disponibles.',
      avisoEnCurso:
        'Mantenimiento en curso hasta {hasta}. Algunos trámites podrían no estar disponibles.',
      totalTitulo: 'Estamos haciendo mejoras',
      totalTexto: 'El portal vuelve a estar disponible en breve.',
      totalHasta: 'El portal vuelve a estar disponible el {hasta}.',
      anuncio: 'Portal actualizado: {estado}.',
      estadoOperativo: '{n} trámites disponibles',
      estadoTotal: 'mantenimiento total'
    },
    comoFunciona: {
      titulo: 'Cómo funciona',
      pasos: [
        'En el sistema real, la aplicación consulta cada minuto una configuración remota (Firebase Remote Config); acá la configuración se edita en el panel.',
        'El mantenimiento total gana sobre todo: puede forzarse o programarse en una ventana de fecha y hora.',
        'Si la plataforma opera, cada trámite apagado se muestra como no disponible y el resto sigue funcionando: falla un trámite, no el portal.',
        'Un aviso programado se anuncia con un banner antes y durante la ventana, y desaparece solo al terminar. La lógica vive en TypeScript puro con tests.'
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
        institucion:
          'Universidad Tecnológica Nacional — Facultad Regional Tucumán',
        detalle: 'Título de grado · 2025',
        destacado: true,
        nota: 'De la carrera viene la Investigación Operativa con la que modelé el optimizador de cortes.',
        enlace: { texto: 'Ver el caso', caso: 'optimizador-viguetas' }
      },
      {
        titulo: 'Técnico en Computación',
        institucion: 'Escuela Técnica N.º 5, Tucumán',
        detalle: '2000 – 2006'
      }
    ]
  },
  cv: {
    perfil: 'Perfil',
    perfilTexto:
      'Frontend Senior con experiencia full stack e Ingeniero en Sistemas de Información. Más de 10 años desarrollando software en producción, hoy con React, Node y TypeScript y antes con Laravel. Me especializo en migrar sistemas legacy, construir software que el negocio configura sin deploys y aplicar optimización matemática a procesos operativos.',
    casos: 'Casos de estudio destacados',
    contacto: 'Contacto',
    idiomas: 'Idiomas',
    portfolio: 'Portfolio con casos y demos en vivo'
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
    derechos: 'Patricio R. Polito.',
    hecho: 'Hecho con Astro y React.'
  }
}
