import { getCollection, type CollectionEntry } from 'astro:content'
import type { Idioma } from '@/i18n'

export type Caso = CollectionEntry<'casos'>

/** El id del glob es `<idioma>/<slug>`. */
export function slugDeCaso(caso: Caso): string {
  return caso.id.split('/').slice(1).join('/')
}

export async function obtenerCasos(idioma: Idioma): Promise<Caso[]> {
  const casos = await getCollection('casos', (c) =>
    c.id.startsWith(`${idioma}/`)
  )
  return casos.sort((a, b) => a.data.orden - b.data.orden)
}

export function rutaDeCaso(idioma: Idioma, slug: string): string {
  return idioma === 'es' ? `/casos/${slug}/` : `/en/case-studies/${slug}/`
}
