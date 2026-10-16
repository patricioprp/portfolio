// @ts-check
import { defineConfig, fontProviders } from 'astro/config'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://portfolio-patricio-polito.netlify.app',
  integrations: [
    mdx(),
    react(),
    // Las páginas de agradecimiento no se indexan.
    sitemap({
      filter: (pagina) => !/\/(gracias|en\/thanks)\/$/.test(pagina)
    }),
    icon()
  ],
  // Fuentes servidas desde el propio sitio. Astro genera fallbacks con
  // métricas ajustadas para que el cambio de fuente no mueva el layout (CLS).
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Inter',
      cssVariable: '--font-inter',
      fallbacks: ['sans-serif'],
      options: {
        variants: [
          {
            src: [
              '@fontsource-variable/inter/files/inter-latin-wght-normal.woff2'
            ],
            weight: '100 900',
            style: 'normal'
          }
        ]
      }
    },
    {
      provider: fontProviders.local(),
      name: 'JetBrains Mono',
      cssVariable: '--font-jetbrains',
      fallbacks: ['monospace'],
      options: {
        variants: [
          {
            src: [
              '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2'
            ],
            weight: '100 800',
            style: 'normal'
          }
        ]
      }
    }
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light-high-contrast',
        dark: 'github-dark-high-contrast'
      },
      defaultColor: false
    }
  },
  vite: {
    plugins: [tailwindcss()]
  }
})
