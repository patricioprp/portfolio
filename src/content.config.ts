import { defineCollection } from 'astro:content'
import { file, glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { guiaLoader } from './loaders/guia'

const textoLocalizado = z.object({ es: z.string(), en: z.string() })
const fecha = z.string().regex(/^\d{4}(-\d{2})?$/, 'Formato: AAAA o AAAA-MM')

const experiencia = defineCollection({
  loader: file('src/content/experiencia.json'),
  schema: z.object({
    empresa: textoLocalizado,
    ubicacion: textoLocalizado.optional(),
    rol: textoLocalizado,
    desde: fecha,
    hasta: fecha.nullable(),
    nota: textoLocalizado.optional(),
    logros: z.object({ es: z.array(z.string()), en: z.array(z.string()) }),
    stack: z.array(z.string()),
    caso: z.string().optional()
  })
})

// Un archivo por idioma: src/content/casos/{es,en}/<slug>.mdx
const casos = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/casos' }),
  schema: z.object({
    titulo: z.string(),
    resumen: z.string().max(160),
    cliente: z.string(),
    rol: z.string(),
    periodo: z.string().optional(),
    stack: z.array(z.string()).min(1),
    problema: z.string(),
    solucion: z.string(),
    impacto: z.string(),
    metricas: z
      .array(
        z.object({
          valor: z.string(),
          etiqueta: z.string(),
          tipo: z.enum(['real', 'ilustrativa'])
        })
      )
      .default([]),
    demo: z.string().nullable(),
    orden: z.number().int()
  })
})

// Guía "Hacé tu portfolio con IA": un Markdown por capítulo en docs/guia-ia/
// (sin frontmatter). Título, resumen y orden salen del archivo: ver src/data/guia.ts.
const guia = defineCollection({ loader: guiaLoader() })

export const collections = { experiencia, casos, guia }
