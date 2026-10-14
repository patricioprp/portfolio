import { es } from './es'
import { en } from './en'

export type Diccionario = typeof es
export type Idioma = 'es' | 'en'

const diccionarios: Record<Idioma, Diccionario> = { es, en }

export function obtenerDiccionario(idioma: Idioma): Diccionario {
  return diccionarios[idioma]
}

export function esIdioma(valor: string | undefined): valor is Idioma {
  return valor === 'es' || valor === 'en'
}
