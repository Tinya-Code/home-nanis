import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.elhogardenanis.com',
  trailingSlash: 'never',
  output: 'static',
  
  // Soluciona los bloqueos de "Sec-Fetch-Site: cross-site" en el entorno de desarrollo
  server: {
    cors: true,
  },
  
  security: {
    checkOrigin: false,
  },

  vite: {
    plugins: [tailwindcss()],
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