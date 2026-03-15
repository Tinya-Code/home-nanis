import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: process.env.NODE_ENV === 'development' ? 'http://localhost:4321' : 'https://www.elhogardenanis.com',
  trailingSlash: 'never',
  output: 'static',
  
  // Soluciona los bloqueos de "Sec-Fetch-Site: cross-site" en el entorno de desarrollo
  security: {
    checkOrigin: false,
  },

  vite: {
    plugins: [tailwindcss()],
    server: {
      cors: true,
    },
  },

  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      filter: (page) => !page.includes('/admin'),
    }),
    icon(),
    compress({
      CSS: true,
      HTML: true,
      Image: false,
      JavaScript: true,
      SVG: true,
    }),
  ],

  image: {
    domains: ['elhogardenanis.com', 'www.elhogardenanis.com'],
    remotePatterns: [{ protocol: 'https' }],
  },

  build: {
    inlineStylesheets: 'auto',
  },
});