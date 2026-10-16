// Loader de la colección `guia` (spec 006): lee los capítulos de
// docs/guia-ia/, cambia los diagramas Mermaid por los SVG de
// `npm run diagramas`, renderiza con el procesador de Markdown de Astro y
// ajusta el HTML. Se usa un loader propio, y no plugins de remark, para no
// cambiar el procesador de todo el sitio.
// Toda la lógica está en src/lib/guia/guia.ts (con tests); acá solo hay
// lectura de archivos y la integración con Astro.

import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Loader } from 'astro/loaders'
import {
  CARPETA_GUIA,
  dimensionesDeSvg,
  enlacesACapitulos,
  figuraDiagrama,
  infoDeArchivo,
  transformarHtml,
  transformarMarkdown
} from '@/lib/guia/guia'

const CARPETA_SVG = 'public/guia/diagramas'

export function guiaLoader(): Loader {
  return {
    name: 'guia-loader',
    async load({
      config,
      store,
      renderMarkdown,
      generateDigest,
      watcher,
      logger
    }) {
      const raiz = fileURLToPath(config.root)
      const carpeta = path.join(raiz, CARPETA_GUIA)
      const carpetaSvg = path.join(raiz, CARPETA_SVG)

      const leerSvg = (archivo: string) => {
        const ruta = path.join(carpetaSvg, archivo)
        if (!existsSync(ruta)) return null
        const dimensiones = dimensionesDeSvg(readFileSync(ruta, 'utf8'))
        if (!dimensiones) {
          throw new Error(
            `${CARPETA_SVG}/${archivo} no tiene ancho y alto. Regeneralo con npm run diagramas.`
          )
        }
        return dimensiones
      }

      const cargar = async () => {
        const archivos = readdirSync(carpeta).filter(
          (a) => a.endsWith('.md') && infoDeArchivo(a)
        )
        const existentes = new Set(archivos)
        const entradas = []
        for (const archivo of archivos) {
          const cuerpo = readFileSync(path.join(carpeta, archivo), 'utf8')

          const rotos = enlacesACapitulos(cuerpo).filter(
            (destino) => !existentes.has(destino)
          )
          if (rotos.length) {
            throw new Error(
              `${archivo}: enlaza a capítulos que no existen: ${rotos.join(', ')}`
            )
          }

          const markdown = transformarMarkdown(cuerpo, (codigo) => {
            const r = figuraDiagrama(codigo, leerSvg)
            if (r.tipo === 'ok') return r.html
            throw new Error(
              r.tipo === 'sin-acctitle'
                ? `${archivo}: un diagrama no tiene "accTitle:" (texto alternativo).`
                : `${archivo}: falta el SVG del diagrama "${r.alt}". Corré npm run diagramas.`
            )
          })
          const rendered = await renderMarkdown(markdown)
          entradas.push({
            id: archivo.replace(/\.md$/, ''),
            data: {},
            body: cuerpo,
            rendered: { ...rendered, html: transformarHtml(rendered.html) },
            digest: generateDigest(cuerpo)
          })
        }
        // Se reemplaza el contenido solo si todos los capítulos cargaron bien.
        store.clear()
        for (const entrada of entradas) store.set(entrada)
        logger.info(`${entradas.length} capítulos de la guía`)
      }

      await cargar()

      // En desarrollo: recargar al agregar, cambiar o borrar un capítulo o un
      // SVG, de a una recarga por vez y sin tirar el servidor si algo falla.
      if (!watcher) return
      let enCurso: Promise<void> = Promise.resolve()
      const recargar = (ruta: string) => {
        const normalizada = ruta.replaceAll('\\', '/')
        if (
          !normalizada.includes(`/${CARPETA_GUIA}/`) &&
          !normalizada.includes(`/${CARPETA_SVG}/`)
        ) {
          return
        }
        enCurso = enCurso
          .then(cargar)
          .catch((e: unknown) =>
            logger.error(e instanceof Error ? e.message : String(e))
          )
      }
      watcher.add([carpeta, carpetaSvg])
      for (const evento of ['add', 'change', 'unlink'] as const) {
        watcher.on(evento, recargar)
      }
    }
  }
}
