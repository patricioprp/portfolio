// @ts-check
import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import icon from 'astro-icon'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://portfolio-patricio-polito.netlify.app',
  integrations: [mdx(), react(), sitemap(), icon()],
  markdown: {
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false
    }
  },
  vite: {
    plugins: [tailwindcss()]
  }
})
