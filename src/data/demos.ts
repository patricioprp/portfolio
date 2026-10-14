import type { Idioma } from '@/i18n'

/** Demos que ya tienen página publicada. */
const DISPONIBLES = new Set(['optimizador-viguetas', 'formulario-dinamico'])

export function demoDisponible(slug: string | null | undefined): boolean {
  return !!slug && DISPONIBLES.has(slug)
}

export function rutaDeDemo(idioma: Idioma, slug: string): string {
  return idioma === 'es' ? `/demos/${slug}/` : `/en/demos/${slug}/`
}
