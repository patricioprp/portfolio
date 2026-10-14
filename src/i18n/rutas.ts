import type { Idioma } from './index'

/** URL de la misma página en cada idioma (para hreflang y el selector). */
export type Alternos = Record<Idioma, string>

export function rutaInicio(idioma: Idioma): string {
  return idioma === 'es' ? '/' : '/en/'
}

export const ALTERNOS_INICIO: Alternos = { es: '/', en: '/en/' }

export function otroIdioma(idioma: Idioma): Idioma {
  return idioma === 'es' ? 'en' : 'es'
}

/** Ruta de la imagen Open Graph generada por `npm run og`. */
export function rutaOg(idioma: Idioma, pagina: string): string {
  return `/og/${idioma}/${pagina}.png`
}
