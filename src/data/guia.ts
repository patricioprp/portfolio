import { getCollection, type CollectionEntry } from 'astro:content'
import {
  CARPETA_GUIA,
  RAMA_PUBLICADA,
  REPO_URL,
  RUTA_GUIA,
  extraerResumen,
  extraerTitulo,
  infoDeArchivo
} from '@/lib/guia/guia'

/** Textos de la guía en el sitio. La guía existe solo en español. */
export const GUIA = {
  titulo: 'Hacé tu portfolio con IA — Claude Code',
  bajada:
    'Una guía en español, desde cero, para construir un portfolio profesional como este trabajando con Claude Code: el marco teórico para entender cada pieza y el paso a paso para hacer el tuyo.',
  descripcion:
    'Guía gratuita en español para construir tu portfolio profesional con Claude Code: fundamentos, tutorial paso a paso y referencia.',
  logros: [
    'Entender cómo trabaja un agente de IA y por qué necesita estructura.',
    'Construir tu propio portfolio, paso a paso, con la misma arquitectura.',
    'Llevarte el método: specs, controles automáticos y revisiones.'
  ],
  aviso:
    'La guía usa este portfolio como ejemplo. Podés reutilizar la estructura y la configuración; el contenido (experiencia, casos, CV) tiene que ser el tuyo.'
} as const

export interface Parte {
  id: 'fundamentos' | 'paso-a-paso' | 'referencia'
  numero: number
  titulo: string
  descripcion: string
  desde: number
  hasta: number
}

/** Partes de la guía por rango de capítulos (ver docs/guia-ia/README.md). */
export const PARTES: readonly Parte[] = [
  {
    id: 'fundamentos',
    numero: 1,
    titulo: 'Fundamentos',
    descripcion:
      'El marco teórico: qué es un agente, qué es el contexto y para qué sirve cada pieza de la configuración.',
    desde: 1,
    hasta: 6
  },
  {
    id: 'paso-a-paso',
    numero: 2,
    titulo: 'Paso a paso',
    descripcion:
      'El tutorial: de instalar las herramientas a tener tu portfolio publicado y listo para mantener.',
    desde: 7,
    hasta: 13
  },
  {
    id: 'referencia',
    numero: 3,
    titulo: 'Referencia',
    descripcion:
      'Para el día a día: flujos de trabajo, buenas prácticas y glosario.',
    desde: 14,
    hasta: 16
  }
]

export interface Capitulo {
  entrada: CollectionEntry<'guia'>
  numero: number
  slug: string
  titulo: string
  resumen: string
  parte: Parte
  /** El capítulo en GitHub (fuente de la página). */
  github: string
}

export function parteDeCapitulo(numero: number): Parte {
  const parte = PARTES.find((p) => numero >= p.desde && numero <= p.hasta)
  if (!parte) {
    throw new Error(
      `El capítulo ${numero} no está en ninguna parte de PARTES (src/data/guia.ts).`
    )
  }
  return parte
}

/** Falla el build con un mensaje claro si los capítulos no son coherentes. */
function validar(capitulos: Capitulo[]): Capitulo[] {
  const vistos = { numeros: new Set<number>(), slugs: new Set<string>() }
  for (const c of capitulos) {
    const archivo = `${CARPETA_GUIA}/${c.entrada.id}.md`
    if (vistos.numeros.has(c.numero)) {
      throw new Error(`${archivo}: el número ${c.numero} está repetido.`)
    }
    if (vistos.slugs.has(c.slug)) {
      throw new Error(`${archivo}: el slug "${c.slug}" está repetido.`)
    }
    if (!c.titulo || !c.resumen) {
      throw new Error(
        `${archivo}: falta el título "#" o el primer párrafo (resumen).`
      )
    }
    vistos.numeros.add(c.numero)
    vistos.slugs.add(c.slug)
  }
  return capitulos
}

export async function obtenerCapitulos(): Promise<Capitulo[]> {
  const entradas = await getCollection('guia')
  const capitulos = entradas
    .map((entrada) => {
      const info = infoDeArchivo(entrada.id)
      if (!info) throw new Error(`Nombre de capítulo inválido: ${entrada.id}`)
      const cuerpo = entrada.body ?? ''
      return {
        entrada,
        numero: info.numero,
        slug: info.slug,
        titulo: extraerTitulo(cuerpo),
        resumen: extraerResumen(cuerpo),
        parte: parteDeCapitulo(info.numero),
        github: `${REPO_URL}/blob/${RAMA_PUBLICADA}/${CARPETA_GUIA}/${entrada.id}.md`
      }
    })
    .sort((a, b) => a.numero - b.numero)
  return validar(capitulos)
}

/** Primer capítulo del tutorial (para los enlaces "Ir al paso a paso"). */
export async function primerCapituloDelTutorial(): Promise<Capitulo> {
  const capitulo = (await obtenerCapitulos()).find(
    (c) => c.parte.id === 'paso-a-paso'
  )
  if (!capitulo) throw new Error('La guía no tiene capítulos de "Paso a paso".')
  return capitulo
}

export function rutaDeCapitulo(slug: string): string {
  return `${RUTA_GUIA}${slug}/`
}

export { RUTA_GUIA }
