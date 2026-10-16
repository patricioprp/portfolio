// Lógica de la guía "Hacé tu portfolio con IA": convierte los Markdown de
// docs/guia-ia/ en datos para el sitio. Sin dependencias (ni de Node ni de
// la UI) para poder usarla desde Astro, desde scripts y desde los tests.

export const REPO_URL = 'https://github.com/patricioprp/portfolio'
export const RAMA_PUBLICADA = 'main'
export const CARPETA_GUIA = 'docs/guia-ia'
export const RUTA_GUIA = '/guia/'

export interface InfoArchivo {
  numero: number
  slug: string
}

/** Número y slug de un capítulo a partir de su nombre (`01-slug.md`). */
export function infoDeArchivo(ruta: string): InfoArchivo | null {
  const nombre = ruta.split('/').pop() ?? ''
  const m = /^(\d{2})-([a-z0-9-]+?)(?:\.md)?$/.exec(nombre)
  if (!m?.[1] || !m[2]) return null
  return { numero: Number(m[1]), slug: m[2] }
}

/** Primer encabezado `#`, sin el prefijo "N · ". */
export function extraerTitulo(markdown: string): string {
  const linea = markdown.split(/\r?\n/).find((l) => /^#\s/.test(l)) ?? ''
  return linea
    .replace(/^#\s+/, '')
    .replace(/^\d+\s*·\s*/, '')
    .trim()
}

/** Quita la sintaxis de Markdown de una línea: enlaces, código y énfasis. */
export function textoPlano(markdown: string): string {
  return markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(^|[\s(])[*_]([^*_]+)[*_](?=[\s.,;:)]|$)/g, '$1$2')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Primer párrafo después del título, en texto plano. */
export function extraerResumen(markdown: string): string {
  const lineas = markdown.split(/\r?\n/)
  const inicio = lineas.findIndex((l) => /^#\s/.test(l)) + 1
  const parrafo: string[] = []
  for (const linea of lineas.slice(inicio)) {
    if (linea.trim() === '') {
      if (parrafo.length) break
      continue
    }
    if (/^(#|```|\||>|-\s)/.test(linea)) break
    parrafo.push(linea.trim())
  }
  return textoPlano(parrafo.join(' '))
}

/** Normaliza una ruta POSIX resolviendo `.` y `..`. */
function normalizar(segmentos: string[]): string {
  const salida: string[] = []
  for (const s of segmentos) {
    if (s === '..') salida.pop()
    else if (s !== '.' && s !== '') salida.push(s)
  }
  return salida.join('/')
}

/**
 * Convierte un enlace escrito para leer la guía en GitHub en uno que funcione
 * en el sitio: capítulos → `/guia/<slug>/`, README → `/guia/`, cualquier otro
 * archivo del repositorio → su página en GitHub.
 */
export function reescribirEnlace(href: string): string {
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || /^[#/]/.test(href)) return href

  const [ruta = '', ancla] = href.split('#')
  const sufijo = ancla ? `#${ancla}` : ''
  const destino = normalizar([...CARPETA_GUIA.split('/'), ...ruta.split('/')])

  // Dentro de la carpeta de la guía: el índice o un capítulo.
  if (destino === CARPETA_GUIA || destino === `${CARPETA_GUIA}/README.md`) {
    return `${RUTA_GUIA}${sufijo}`
  }
  const enGuia = destino.startsWith(`${CARPETA_GUIA}/`)
  const info = enGuia ? infoDeArchivo(destino) : null
  if (info && destino.endsWith('.md')) {
    return `${RUTA_GUIA}${info.slug}/${sufijo}`
  }

  const esCarpeta = ruta.endsWith('/')
  const tipo = esCarpeta ? 'tree' : 'blob'
  return `${REPO_URL}/${tipo}/${RAMA_PUBLICADA}/${destino}${esCarpeta ? '/' : ''}${sufijo}`
}

/** Capítulos enlazados con ruta relativa (`02-x.md`), para detectar rotos. */
export function enlacesACapitulos(markdown: string): string[] {
  return [
    ...markdown.matchAll(/\]\((?:\.\/)?(\d{2}-[a-z0-9-]+\.md)(?:#[^)]*)?\)/g)
  ]
    .map((m) => m[1] ?? '')
    .filter(Boolean)
}

/**
 * Párrafo de navegación del final de cada capítulo ("Anterior: … ·
 * Siguiente: …"). Sirve en GitHub; en el sitio lo reemplaza la navegación de
 * la página.
 */
export function esNavegacionDeCapitulo(texto: string): boolean {
  return /^(Anterior|Siguiente):|^Volver al /.test(texto.trim())
}

/** Bloques ```mermaid sin sangría. Única definición: la usan el sitio y el script. */
const REGEX_MERMAID = /^```mermaid\r?\n([\s\S]*?)^```[ \t]*\r?$/gm

/** Código de cada diagrama Mermaid del Markdown, en orden. */
export function extraerDiagramas(markdown: string): string[] {
  return [...markdown.matchAll(REGEX_MERMAID)].map((m) => m[1] ?? '')
}

/**
 * Prepara el Markdown de un capítulo para el sitio: cada bloque ```mermaid
 * pasa a ser el HTML que devuelve `figura` y se quita el párrafo de
 * navegación si es el último. El resto queda igual.
 */
export function transformarMarkdown(
  markdown: string,
  figura: (codigo: string) => string
): string {
  const lineas = markdown
    .replace(REGEX_MERMAID, (_, codigo: string) => `\n${figura(codigo)}\n`)
    .split(/\r?\n/)

  while (lineas.length && lineas.at(-1)?.trim() === '') lineas.pop()
  let inicio = lineas.length
  while (inicio > 0 && lineas[inicio - 1]?.trim() !== '') inicio--
  if (esNavegacionDeCapitulo(lineas[inicio] ?? '')) lineas.splice(inicio)

  return lineas.join('\n') + '\n'
}

/**
 * Ajusta el HTML ya renderizado: envuelve las tablas en una región
 * desplazable con teclado (no rompen el ancho en el celular), les da nombre
 * a las casillas de las listas y reescribe los enlaces con `reescribirEnlace`.
 */
export function transformarHtml(html: string): string {
  return (
    html
      .replace(
        /<table(?=[\s>])/g,
        '<div class="tabla" tabindex="0" role="region" aria-label="Tabla desplazable"><table'
      )
      .replace(/<\/table>/g, '</table></div>')
      // Casillas de "- [ ]": son solo visuales, pero necesitan nombre accesible.
      .replace(
        /<input([^>]*type="checkbox"[^>]*?)\s*\/?>/g,
        (_, attrs: string) => {
          const estado = /\schecked/.test(attrs) ? 'Hecho' : 'Pendiente'
          return `<input${attrs} aria-label="${estado}">`
        }
      )
      // Solo atributos de etiquetas <a> reales (no texto dentro de <code>).
      .replace(
        /(<a\s[^>]*?href=")([^"]*)"/g,
        (_, antes: string, href: string) => `${antes}${reescribirEnlace(href)}"`
      )
  )
}

/** Hash corto (FNV-1a de 32 bits) del código de un diagrama. */
export function hashDiagrama(codigo: string): string {
  const texto = codigo.replace(/\r\n/g, '\n').trim()
  let hash = 0x811c9dc5
  for (let i = 0; i < texto.length; i++) {
    hash ^= texto.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16).padStart(8, '0')
}

/** Texto alternativo del diagrama: la línea `accTitle:` de Mermaid. */
export function tituloAccesible(codigo: string): string | null {
  const m = /^\s*accTitle\s*:\s*(.+?)\s*$/m.exec(codigo)
  return m?.[1] ?? null
}

export interface Dimensiones {
  ancho: number
  alto: number
}

/** Ancho y alto del `<svg>` generado por `npm run diagramas`. */
export function dimensionesDeSvg(svg: string): Dimensiones | null {
  const etiqueta = /<svg\b[^>]*>/.exec(svg)?.[0] ?? ''
  const ancho = /\swidth="(\d+)"/.exec(etiqueta)?.[1]
  const alto = /\sheight="(\d+)"/.exec(etiqueta)?.[1]
  return ancho && alto ? { ancho: Number(ancho), alto: Number(alto) } : null
}

export type ResultadoFigura =
  | { tipo: 'ok'; html: string }
  | { tipo: 'sin-acctitle' }
  | { tipo: 'sin-svg'; alt: string }

const escapar = (texto: string) =>
  texto
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

/**
 * HTML de un diagrama: los dos SVG (claro y oscuro) con su texto alternativo.
 * `leerSvg` devuelve las dimensiones de un SVG de public/guia/diagramas/, o
 * null si no existe (hay que correr `npm run diagramas`).
 */
export function figuraDiagrama(
  codigo: string,
  leerSvg: (archivo: string) => Dimensiones | null
): ResultadoFigura {
  const alt = tituloAccesible(codigo)
  if (!alt) return { tipo: 'sin-acctitle' }
  const hash = hashDiagrama(codigo)
  const claro = leerSvg(`${hash}-claro.svg`)
  const oscuro = leerSvg(`${hash}-oscuro.svg`)
  if (!claro || !oscuro) return { tipo: 'sin-svg', alt }

  const img = (tema: string) =>
    `<img src="/guia/diagramas/${hash}-${tema}.svg" alt="${escapar(alt)}" width="${claro.ancho}" height="${claro.alto}" loading="lazy" decoding="async" class="diagrama-${tema}">`
  // `--ancho` fija en CSS un mínimo legible: si no entra, la figura se
  // desplaza, por eso es una región que se alcanza con teclado. El nombre
  // de la región es corto: el texto del diagrama ya está en el alt.
  return {
    tipo: 'ok',
    html: `<figure class="diagrama" style="--ancho:${claro.ancho}" tabindex="0" role="region" aria-label="Diagrama">${img('claro')}${img('oscuro')}</figure>`
  }
}
