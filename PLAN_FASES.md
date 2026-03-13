# 🗺️ PLAN DE FASES — El Hogar de Nanis
> Astro + Tailwind v4 + TypeScript · pnpm · Mobile-First  
> Referencia cruzada: `BEST_PRACTICES.md` + `STYLE_GUIDE.md`  
> Objetivo: sitio en producción con Lighthouse ≥ 90 en todas las categorías.

---

## 0. Índice

- [Visión general del plan](#visión-general-del-plan)
- [Fase 0 — Entorno y configuración base](#fase-0--entorno-y-configuración-base)
- [Fase 1 — Fundamentos: estructura, tokens y Layout](#fase-1--fundamentos-estructura-tokens-y-layout)
- [Fase 2 — Componentes UI base](#fase-2--componentes-ui-base)
- [Fase 3 — Páginas y secciones](#fase-3--páginas-y-secciones)
- [Fase 4 — SEO técnico completo](#fase-4--seo-técnico-completo)
- [Fase 5 — Rendimiento y Core Web Vitals](#fase-5--rendimiento-y-core-web-vitals)
- [Fase 6 — Accesibilidad y QA final](#fase-6--accesibilidad-y-qa-final)
- [Fase 7 — Deploy y monitoreo](#fase-7--deploy-y-monitoreo)
- [Mapa de dependencias](#mapa-de-dependencias)
- [Errores frecuentes y cómo prevenirlos](#errores-frecuentes-y-cómo-prevenirlos)

---

## Visión general del plan

```
FASE 0 → Entorno listo, dependencias instaladas, config de herramientas
FASE 1 → Layout.astro, tokens CSS, tipografía, global.css
FASE 2 → Componentes UI: Button, Card, Badge, Form, Nav, Footer
FASE 3 → Páginas: Home, Servicios, Quiénes somos, Cómo trabajamos,
          Capacitación, Bolsa de trabajo, Contacto
FASE 4 → SEO: meta tags, JSON-LD, sitemap, robots, OG, canonical
FASE 5 → Performance: imágenes WebP, fonts, scripts, CWV
FASE 6 → a11y: contraste, focus, ARIA, validación de formularios
FASE 7 → Deploy, DNS, monitoreo, Google Search Console
```

**Regla de oro:** no avanzar a la siguiente fase hasta completar el
checklist de la fase actual. Cada fase es la base de la siguiente.

---

## FASE 0 — Entorno y configuración base

> **Duración estimada:** 2–4 horas  
> **Resultado:** proyecto ejecutándose en local con todas las herramientas listas.

### 0.1 Verificar versiones requeridas

```bash
node --version   # Requiere Node ≥ 18.17.1 (LTS recomendado: 20.x)
pnpm --version   # Requiere pnpm ≥ 8.x
```

Si pnpm no está instalado:
```bash
npm install -g pnpm
```

### 0.2 Instalar integraciones oficiales de Astro

Ejecutar **en orden** desde la raíz del proyecto:

```bash
# 1. Integración de Tailwind CSS v4 para Astro
pnpm astro add tailwind

# 2. Sitemap automático (SEO crítico)
pnpm astro add sitemap

# 3. Compresión de assets en build
pnpm astro add compress

# 4. Prefetch para navegación instantánea
pnpm astro add prefetch
```

> ⚠️ **Advertencia `@astrojs/tailwind` vs Tailwind v4:**  
> Si el proyecto ya usa Tailwind v4 con `@tailwindcss/vite`, NO instalar
> `@astrojs/tailwind` (es para v3). Usar en su lugar:

```bash
# Solo si aún no está configurado Tailwind v4:
pnpm add -D tailwindcss@next @tailwindcss/vite
```

### 0.3 Instalar dependencias de desarrollo

```bash
# Iconos (Lucide para Astro)
pnpm add -D @iconify/astro

# Formateo
pnpm add -D prettier prettier-plugin-astro prettier-plugin-tailwindcss

# Linting
pnpm add -D eslint eslint-plugin-astro @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Tipos de Node para Astro
pnpm add -D @types/node
```

### 0.4 Instalar dependencias de producción opcionales

```bash
# Sharp — optimización de imágenes en build (recomendado por Astro)
pnpm add sharp

# Schema.org helper (opcional — facilita JSON-LD tipado)
pnpm add schema-dts
```

### 0.5 Configurar `astro.config.mjs`

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import compress from 'astro-compress';
import prefetch from '@astrojs/prefetch';

export default defineConfig({
  site: 'https://www.elhogardenanis.com',  // ← CRÍTICO para sitemap y canonical
  trailingSlash: 'never',                   // URLs sin barra final
  output: 'static',                         // SSG — sitio estático

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [
    sitemap({
      // Prioridades definidas en BEST_PRACTICES.md §4.6
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      // Excluir rutas privadas si las hubiera
      filter: (page) => !page.includes('/admin'),
    }),
    prefetch({
      // Prefetch al hacer hover en links internos
      prefetchAll: false,
      defaultStrategy: 'hover',
    }),
    compress({
      CSS: true,
      HTML: true,
      Image: false,  // Astro <Image> ya optimiza — no comprimir dos veces
      JavaScript: true,
      SVG: true,
    }),
  ],

  image: {
    // Dominios permitidos para imágenes remotas
    domains: ['elhogardenanis.com', 'www.elhogardenanis.com'],
    // Formato de salida preferido
    remotePatterns: [{ protocol: 'https' }],
  },

  // Compresión de HTML en build
  build: {
    inlineStylesheets: 'auto',
  },
});
```

### 0.6 Configurar `.prettierrc`

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  "overrides": [
    {
      "files": "*.astro",
      "options": { "parser": "astro" }
    }
  ]
}
```

### 0.7 Configurar `eslint.config.js`

```js
// eslint.config.js
import eslintPluginAstro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: { parser: tsParser },
    rules: {
      'no-console': 'warn',
      'prefer-const': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
    },
  },
];
```

### 0.8 Configurar `tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "strictNullChecks": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@layouts/*":    ["src/layouts/*"],
      "@lib/*":        ["src/lib/*"],
      "@types/*":      ["src/types/*"],
      "@assets/*":     ["src/assets/*"]
    }
  }
}
```

### 0.9 Agregar scripts a `package.json`

```json
{
  "scripts": {
    "dev":      "astro dev",
    "build":    "astro build",
    "preview":  "astro preview",
    "check":    "astro check",
    "lint":     "eslint src --ext .ts,.astro",
    "format":   "prettier --write src",
    "typecheck":"tsc --noEmit"
  }
}
```

### ✅ Checklist Fase 0

- [ ] `pnpm dev` arranca sin errores.
- [ ] `pnpm build` completa sin errores ni warnings de TypeScript.
- [ ] `pnpm check` (Astro check) sin errores.
- [ ] `pnpm lint` sin errores.
- [ ] `pnpm format` no cambia ningún archivo (ya formateado).
- [ ] `astro.config.mjs` tiene `site` configurado con la URL de producción.
- [ ] `tsconfig.json` en modo `strict`.
- [ ] Aliases de paths configurados y funcionando.

---

## FASE 1 — Fundamentos: estructura, tokens y Layout

> **Duración estimada:** 3–5 horas  
> **Resultado:** estructura de carpetas final, tokens CSS, Layout base con SEO.

### 1.1 Crear la estructura de carpetas

Ejecutar desde la raíz del proyecto:

```bash
# Estructura src/
mkdir -p src/{assets,lib,types}
mkdir -p src/components/{ui,sections}
mkdir -p src/styles

# Verificar
ls src/
```

La estructura final debe ser:
```
src/
├── assets/          ← imágenes que Astro optimizará
├── components/
│   ├── ui/          ← Button, Card, Badge, Form inputs
│   └── sections/    ← HeroSection, ServicesSection, etc.
├── layouts/
│   └── Layout.astro
├── lib/
│   ├── seo.ts       ← helpers para meta tags
│   └── formatters.ts
├── pages/
│   └── index.astro
├── styles/
│   └── global.css   ← @theme + @layer base/components/utilities
└── types/
    ├── site.ts
    ├── servicio.ts
    └── index.ts
```

### 1.2 Mover imágenes de `public/images/` a `src/assets/`

Las imágenes que Astro debe optimizar van en `src/assets/`.
Las que son completamente estáticas (favicon, og:image) permanecen en `public/`.

```bash
# Copiar imágenes de contenido a src/assets (Astro las optimizará)
cp public/images/bannerfinal.png     src/assets/
cp public/images/ninerasexclusivas.jpg  src/assets/
cp public/images/empleadasdelhogar.jpg  src/assets/
cp public/images/enfermerastecnicas.jpg src/assets/
cp public/images/empleadayninera.jpg    src/assets/
cp public/images/elmejor-300x241.png    src/assets/
cp public/images/hogarNanis.jpg         src/assets/

# Imágenes que SE QUEDAN en public/ (referenciadas por URL directa en JSON-LD / OG)
# public/images/logo2.png         ← og:image, schema.org
# public/images/bannerfinal.png   ← og:image fallback
```

> ⚠️ **Error común:** importar imágenes de `src/assets/` con rutas relativas
> desde páginas en subcarpetas. Usar siempre imports de ES modules:
> ```astro
> import heroImg from '@assets/bannerfinal.png';
> ```

### 1.3 Crear `src/styles/global.css`

Pegar el contenido completo del `STYLE_GUIDE.md` §2, §5 y §6 (tokens `@theme`,
`@layer base`, `@layer components`, `@layer utilities`).

```css
/* src/styles/global.css — estructura obligatoria */

@import "tailwindcss";   /* ← Tailwind v4: import, NO @tailwind directives */

@theme {
  /* ── Pegar tokens completos de STYLE_GUIDE.md §2 ── */
}

@layer base {
  /* ── Pegar reset semántico de STYLE_GUIDE.md §5 ── */
}

@layer components {
  /* ── Pegar componentes de STYLE_GUIDE.md §6 ── */
}

@layer utilities {
  /* ── Pegar utilities/keyframes de STYLE_GUIDE.md §9 ── */
}
```

> ⚠️ **Error frecuente con Tailwind v4:** usar `@tailwind base; @tailwind components;`
> (sintaxis v3). En v4 es un único `@import "tailwindcss";` al inicio.

### 1.4 Crear los tipos TypeScript

```typescript
// src/types/site.ts
export interface ContactDetail {
  id: string;
  type: string;
  label: string;
  value: string;
  icon: string;
  link: string;
}

export interface SiteData {
  name: string;
  slogan: string;
  shortDescription: string;
  contact: {
    phone: string;
    mobile: string[];
    email: string;
    address: string;
    whatsapp: string;
  };
  businessHours: string;
  certifications: string[];
}
```

```typescript
// src/types/servicio.ts
export interface Servicio {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  seoKeywords: string[];
  features: string[];
  image: {
    alt: string;
    localPath: string;
  };
}
```

```typescript
// src/types/index.ts  ← re-export central
export type { SiteData, ContactDetail } from './site';
export type { Servicio } from './servicio';
```

### 1.5 Crear helpers en `src/lib/`

```typescript
// src/lib/seo.ts
export interface SEOMeta {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

export function buildTitle(pageTitle: string, siteName = 'El Hogar de Nanis'): string {
  if (pageTitle.toLowerCase().includes('hogar de nanis')) return pageTitle;
  return `${pageTitle} | ${siteName}`;
}

export function truncateDescription(text: string, maxLength = 160): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, text.lastIndexOf(' ', maxLength)) + '…';
}
```

```typescript
// src/lib/formatters.ts
export function formatPhone(phone: string): string {
  // "941141780" → "941 141 780"
  return phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/51${phone}?text=${encoded}`;
}
```

### 1.6 Crear `Layout.astro`

```astro
---
// src/layouts/Layout.astro
import '../styles/global.css';
import type { SEOMeta } from '@lib/seo';
import { buildTitle } from '@lib/seo';
import siteData from '../../public/data/site.json';

interface Props extends SEOMeta {}

const {
  title,
  description,
  canonical,
  ogImage = '/images/bannerfinal.png',
  noindex = false,
} = Astro.props;

const builtTitle = buildTitle(title);
const canonicalURL = canonical ?? new URL(Astro.url.pathname, Astro.site).toString();

// JSON-LD LocalBusiness desde el JSON de datos
const schemaLD = JSON.stringify(siteData.localSeo.schemaLocalBusiness);
---

<!doctype html>
<html lang="es-PE" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#7F0FCB" />

    <!-- SEO Primary -->
    <title>{builtTitle}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonicalURL} />
    {noindex && <meta name="robots" content="noindex, nofollow" />}

    <!-- Open Graph -->
    <meta property="og:type"        content="website" />
    <meta property="og:url"         content={canonicalURL} />
    <meta property="og:title"       content={builtTitle} />
    <meta property="og:description" content={description} />
    <meta property="og:image"       content={new URL(ogImage, Astro.site).toString()} />
    <meta property="og:image:width"  content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale"      content="es_PE" />
    <meta property="og:site_name"   content="El Hogar de Nanis" />

    <!-- Twitter Card -->
    <meta name="twitter:card"        content="summary_large_image" />
    <meta name="twitter:title"       content={builtTitle} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image"       content={new URL(ogImage, Astro.site).toString()} />

    <!-- Favicon -->
    <link rel="icon"             href="/favicon.ico" sizes="any" />
    <link rel="icon"             href="/favicon.svg" type="image/svg+xml" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <!-- Fonts — preconnect primero, stylesheet después -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />

    <!-- JSON-LD LocalBusiness -->
    <script type="application/ld+json" set:html={schemaLD} />

    <!-- Slot para meta tags adicionales por página (BreadcrumbList, etc.) -->
    <slot name="head" />
  </head>

  <body class="bg-dark text-white font-body antialiased">
    <slot />
  </body>
</html>
```

### ✅ Checklist Fase 1

- [ ] `pnpm dev` sin errores tras crear `global.css`.
- [ ] Tokens `@theme` visibles: en DevTools, `--color-brand` aparece en `:root`.
- [ ] Layout renderiza `<title>` y `<meta description>` correctamente.
- [ ] JSON-LD LocalBusiness presente en el `<head>` de la home (inspeccionar HTML).
- [ ] Fuentes Plus Jakarta Sans y Nunito cargando (Network tab → Fonts).
- [ ] Aliases `@components`, `@lib`, `@types`, `@assets` resuelven sin error.
- [ ] Todas las interfaces TypeScript sin errores en `pnpm check`.

---

## FASE 2 — Componentes UI base

> **Duración estimada:** 4–6 horas  
> **Resultado:** librería de componentes atómicos lista para usar en páginas.

### Orden de creación (de menor a mayor dependencia)

```
1. ButtonPrimary.astro     ← no depende de nada
2. Badge.astro             ← no depende de nada
3. StarRating.astro        ← no depende de nada
4. ServiceCard.astro       ← usa Badge
5. TestimonialCard.astro   ← usa StarRating
6. StepCard.astro          ← usa Badge
7. SectionHeader.astro     ← usa Badge (eyebrow)
8. NavBar.astro            ← usa ButtonPrimary
9. Footer.astro            ← usa datos de site.json
```

### 2.1 Plantilla base para cada componente

Seguir esta estructura en todos los componentes:

```astro
---
// src/components/ui/NombreComponente.astro

/**
 * NombreComponente
 * ─────────────────
 * Descripción: qué hace y dónde se usa.
 * Props obligatorias: las que no tienen default.
 * Notas de accesibilidad o performance relevantes.
 */

// 1. Imports externos primero
// 2. Imports internos
// 3. Interface Props SIEMPRE explícita

interface Props {
  // todas las props tipadas
  variant?: 'default' | 'highlight';  // con defaults cuando aplique
}

const { variant = 'default' } = Astro.props;
---

<!-- Template limpio. Sin lógica compleja inline -->
```

### 2.2 `ButtonPrimary.astro` — ejemplo completo

```astro
---
// src/components/ui/ButtonPrimary.astro
interface Props {
  label: string;
  href?: string;
  variant?: 'primary' | 'gradient' | 'secondary' | 'outline' | 'ghost' | 'whatsapp';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
  external?: boolean;
}

const {
  label,
  href,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  type = 'button',
  external = false,
} = Astro.props;

const variantClass = {
  primary:   'btn-primary',
  gradient:  'btn-gradient',
  secondary: 'btn-secondary',
  outline:   'btn-outline-brand',
  ghost:     'btn-ghost',
  whatsapp:  'btn-whatsapp',
}[variant];

const sizeClass = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
  xl: 'btn-xl',
}[size];

const classes = [variantClass, sizeClass, fullWidth ? 'w-full' : ''].join(' ').trim();
const isLoading = loading;
---

{href ? (
  <a
    href={href}
    class={classes}
    aria-label={label}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
  >
    <slot name="icon-left" />
    {label}
    <slot name="icon-right" />
  </a>
) : (
  <button
    type={type}
    class={classes}
    aria-busy={isLoading}
    disabled={isLoading}
  >
    {isLoading && (
      <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
      </svg>
    )}
    {isLoading ? 'Cargando...' : label}
  </button>
)}
```

### 2.3 Reglas para todos los componentes UI

```
BUTTONS
  ├── Siempre min-height: 44px (ya en .btn base del global.css)
  ├── Cuando es <a>, siempre aria-label
  └── Links externos: target="_blank" + rel="noopener noreferrer"

CARDS
  ├── Usar <article> para cards de contenido (servicios, testimonios)
  ├── Usar <div> para cards decorativas o de UI
  └── Heading dentro del card debe seguir la jerarquía del padre

IMÁGENES EN COMPONENTES
  ├── Importar siempre con import { Image } from 'astro:assets'
  ├── Siempre width + height explícitos
  ├── Hero: loading="eager" fetchpriority="high"
  └── Cards: loading="lazy" (default)

FORMULARIOS
  ├── Todo <input> tiene su <label> asociado con for/id
  ├── Mensajes de error con role="alert"
  └── Campos requeridos con aria-required="true"
```

### ✅ Checklist Fase 2

- [ ] Todos los componentes tienen interface `Props` explícita.
- [ ] Ningún componente supera 150 líneas (si lo hace → dividir).
- [ ] `pnpm check` sin errores tras crear los componentes.
- [ ] Los botones tienen área de toque ≥ 44px (verificar en DevTools).
- [ ] Cards usan semántica correcta (`<article>` vs `<div>`).
- [ ] Ningún valor hex hardcodeado en los templates — solo clases de tokens.

---

## FASE 3 — Páginas y secciones

> **Duración estimada:** 8–12 horas  
> **Resultado:** todas las rutas del sitemap funcionando con contenido real.

### Orden de implementación (menor a mayor complejidad)

```
1. /                          ← Home (más importante, primero)
2. /nuestros-servicios
3. /agencia-de-nineras-y-nanas-lima
4. /agencia-de-empleadas-del-hogar-lima
5. /quienes-somos
6. /como-trabajamos
7. /capacitacion
8. /bolsa-de-trabajo
9. /contacto
```

### 3.1 Estructura de cada página

```astro
---
// src/pages/nombre-pagina.astro
import Layout from '@layouts/Layout.astro';
import SectionHeader from '@components/sections/SectionHeader.astro';
// ... otros imports de secciones

// Datos desde JSON
import pageData from '../../public/data/nombre.json';
---

<Layout
  title="Título único de la página — 50-60 chars"
  description="Descripción única — 145-160 chars. Incluir keyword + ciudad."
>
  <!-- BreadcrumbList JSON-LD en el slot head -->
  <script slot="head" type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [...]
    })}
  </script>

  <NavBar />
  <main id="main-content">
    <!-- Secciones de la página -->
  </main>
  <Footer />
</Layout>
```

### 3.2 Secciones de la Home — componentes requeridos

```
src/components/sections/
├── HeroSection.astro         ← H1, CTA principal, imagen hero con LCP
├── ServicesSection.astro     ← Grid de 4 servicios
├── WhyUsSection.astro        ← Valores (shield, heart, award, users)
├── ProcessSection.astro      ← 5 pasos del proceso de selección
├── TestimonialsSection.astro ← Reviews con rating
├── CertBadgesSection.astro   ← MTPE, RENAPE — genera confianza
└── CTASection.astro          ← CTA final antes del footer (WhatsApp)
```

### 3.3 Manejo de datos por página

```astro
---
// Patrón correcto para importar y tipar los JSON
import type { Servicio } from '@types/servicio';
import serviciosRaw from '../../public/data/servicios.json';
const servicios = serviciosRaw as Servicio[];

// Validar en dev — lanzará error si faltan campos
if (import.meta.env.DEV) {
  servicios.forEach((s, i) => {
    if (!s.id || !s.title) {
      throw new Error(`Servicio en índice ${i} tiene datos incompletos`);
    }
  });
}
---
```

### 3.4 Imagen hero — configuración LCP crítica

```astro
---
import { Image } from 'astro:assets';
import heroImg from '@assets/bannerfinal.png';
---

<!-- fetchpriority="high" es OBLIGATORIO en la imagen above-the-fold -->
<Image
  src={heroImg}
  alt="Familia de Lima feliz gracias a la agencia El Hogar de Nanis"
  width={1200}
  height={630}
  format="webp"
  quality={85}
  loading="eager"
  fetchpriority="high"
  class="w-full h-auto rounded-xl object-cover"
/>
```

### 3.5 Formulario de contacto — flujo completo

El formulario de contacto usa la API de Astro Actions (si Astro ≥ 4.9)
o un servicio externo (Formspree / Netlify Forms):

```astro
<!-- Opción Netlify Forms — zero config en Netlify deploy -->
<form
  name="contacto"
  method="POST"
  data-netlify="true"
  netlify-honeypot="bot-field"
  class="flex flex-col gap-5"
  aria-label="Formulario de contacto"
>
  <!-- Campo honeypot anti-spam — oculto para humanos -->
  <input type="hidden" name="form-name" value="contacto" />
  <p class="hidden">
    <label>No completar: <input name="bot-field" /></label>
  </p>

  <div class="form-group">
    <label class="form-label" for="nombre">Nombre completo *</label>
    <input
      class="form-input"
      id="nombre" name="nombre" type="text"
      required aria-required="true"
      autocomplete="name"
      placeholder="Tu nombre completo"
    />
  </div>
  <!-- ... resto de campos -->
</form>
```

### ✅ Checklist Fase 3

- [ ] Todas las rutas del sitemap renderizando con contenido real.
- [ ] Cada página tiene `title` y `description` **únicos** (no copiar entre páginas).
- [ ] H1 presente y único en cada página.
- [ ] Imagen hero con `loading="eager"` y `fetchpriority="high"`.
- [ ] No hay imágenes sin atributo `alt`.
- [ ] Formulario de contacto envía y muestra feedback al usuario.
- [ ] Navegación funciona en todos los breakpoints.
- [ ] Footer con datos de contacto reales desde `site.json`.

---

## FASE 4 — SEO técnico completo

> **Duración estimada:** 3–5 horas  
> **Resultado:** Lighthouse SEO = 100. Sitio indexable y con datos estructurados.

### 4.1 Verificar sitemap generado

Tras `pnpm build`:

```bash
# Verificar que se generó
ls dist/sitemap-index.xml
ls dist/sitemap-0.xml

# Revisar que contiene todas las rutas esperadas
cat dist/sitemap-0.xml
```

Debe contener las 8 rutas definidas en `BEST_PRACTICES.md §4.6`.

### 4.2 Crear `public/robots.txt`

```
User-agent: *
Allow: /

# Bloquear rutas de utilidad si existieran
Disallow: /api/
Disallow: /_astro/

Sitemap: https://www.elhogardenanis.com/sitemap-index.xml
```

### 4.3 JSON-LD adicional por página

**Página de servicios** — añadir `Service` schema:
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Niñeras y Nanas en Lima",
  "provider": {
    "@type": "LocalBusiness",
    "name": "El Hogar de Nanis"
  },
  "areaServed": {
    "@type": "City",
    "name": "Lima"
  }
}
```

**Página de testimonios / home** — añadir `AggregateRating`:
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "El Hogar de Nanis",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "150",
    "bestRating": "5"
  }
}
```

**FAQ** (si se agrega sección de preguntas frecuentes):
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cómo contratar una niñera en Lima?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Contáctanos por WhatsApp o teléfono..."
      }
    }
  ]
}
```

### 4.4 Crear `src/lib/jsonld.ts` — helpers para JSON-LD

```typescript
// src/lib/jsonld.ts
import type { WithContext, LocalBusiness, BreadcrumbList } from 'schema-dts';

export function buildBreadcrumb(items: { name: string; url: string }[]): string {
  const schema: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return JSON.stringify(schema);
}
```

### 4.5 Open Graph image dedicada

Crear una imagen OG de 1200×630px con:
- Logo de El Hogar de Nanis centrado
- Slogan en tipografía grande
- Fondo con gradiente de marca (morado → rosa)
- Guardar en `public/og-image.jpg`

Actualizar `Layout.astro`:
```astro
ogImage="/og-image.jpg"
```

### 4.6 Verificaciones de SEO on-page

Para cada página, verificar:
```
Title: ≤ 60 caracteres, incluye keyword primaria
Description: 145–160 caracteres, incluye CTA implícito
H1: 1 único, contiene keyword primaria
H2: 2–5 por página, semánticamente correctos
Imágenes: 100% tienen alt descriptivo
Links internos: texto descriptivo, no "click aquí"
URL: en español, kebab-case, sin tildes
Canonical: apunta a sí misma (no hay duplicados)
```

### ✅ Checklist Fase 4

- [ ] `dist/sitemap-0.xml` contiene las 8+ rutas del proyecto.
- [ ] `public/robots.txt` creado y apuntando al sitemap correcto.
- [ ] Lighthouse SEO = 100 en todas las páginas principales.
- [ ] JSON-LD LocalBusiness validado en [schema.org/validator](https://validator.schema.org).
- [ ] Open Graph image 1200×630 creada y funcionando (previsualizar en [opengraph.xyz](https://www.opengraph.xyz)).
- [ ] No hay páginas con title o description duplicados.
- [ ] Todos los títulos H1 únicos y con keyword principal.

---

## FASE 5 — Rendimiento y Core Web Vitals

> **Duración estimada:** 3–4 horas  
> **Resultado:** Lighthouse Performance ≥ 90 en móvil. LCP < 2.5s.

### 5.1 Auditar imágenes restantes

```bash
# Verificar qué imágenes pesadas quedan en public/
find public/images -name "*.jpg" -o -name "*.png" | xargs ls -lh
```

Para imágenes que NO pueden moverse a `src/assets/` (referenciadas en JSON-LD):

```bash
# Convertir manualmente a WebP con Sharp
pnpm exec sharp -i public/images/logo2.png -o public/images/logo2.webp
```

### 5.2 Configurar caché de assets

Si el deploy es en **Netlify** (`netlify.toml`):

```toml
# netlify.toml
[build]
  command = "pnpm build"
  publish = "dist"

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=2592000"

[[headers]]
  for = "/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

Si el deploy es en **Vercel** (`vercel.json`):

```json
{
  "headers": [
    {
      "source": "/_astro/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/images/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=2592000" }]
    }
  ]
}
```

### 5.3 Self-host de fuentes (opcional pero recomendado para LCP)

```bash
# Descargar fuentes con fontsource
pnpm add @fontsource-variable/plus-jakarta-sans
pnpm add @fontsource-variable/nunito
```

```astro
---
// Layout.astro — reemplazar Google Fonts link por imports locales
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/nunito';
---
<!-- Eliminar los <link> de Google Fonts -->
```

Ventaja: elimina la conexión externa a `fonts.googleapis.com` → mejora LCP ~100–200ms.

### 5.4 Estrategia de scripts de terceros

```astro
<!-- WhatsApp flotante — client:idle para no bloquear LCP -->
<!-- NO cargar scripts de chat, tracking ni widgets con defer en <head> -->

<!-- Google Analytics (si se usa) — siempre con partytown para off-thread -->
pnpm astro add partytown
```

Con Partytown configurado:
```js
// astro.config.mjs
import partytown from '@astrojs/partytown';

integrations: [
  partytown({
    config: { forward: ['dataLayer.push'] }
  })
]
```

```astro
<!-- Layout.astro -->
<script type="text/partytown" src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX" />
```

### 5.5 Preload de recursos críticos

```astro
<!-- Layout.astro <head> — preload del hero image -->
<link
  rel="preload"
  as="image"
  href="/images/bannerfinal.webp"
  type="image/webp"
/>
```

### ✅ Checklist Fase 5

- [ ] Lighthouse Performance ≥ 90 en mobile (simular 4G lento en DevTools).
- [ ] LCP < 2.5 s (identificado en Lighthouse — suele ser la imagen hero).
- [ ] CLS < 0.1 (verificar que imágenes tienen width/height explícitos).
- [ ] INP / FID < 200 ms.
- [ ] No hay requests bloqueantes en el `<head>` sin `async`/`defer`.
- [ ] Fuentes cargando sin FOUT visible (verificar en red lenta).
- [ ] Caché de assets configurada (verificar headers en producción).
- [ ] `pnpm build` + `pnpm preview`: tamaño total del bundle JS < 50 KB.

---

## FASE 6 — Accesibilidad y QA final

> **Duración estimada:** 2–3 horas  
> **Resultado:** Lighthouse Accessibility ≥ 95. Navegación por teclado completa.

### 6.1 Auditoría con axe DevTools

Instalar extensión [axe DevTools](https://www.deque.com/axe/devtools/) en Chrome.
Ejecutar en cada página y corregir todos los errores de nivel A y AA.

### 6.2 Prueba de teclado — recorrido obligatorio

```
Tab         → navegar hacia adelante entre elementos interactivos
Shift+Tab   → navegar hacia atrás
Enter/Space → activar botones y links
Escape      → cerrar modales/menús
```

En cada página verificar:
- [ ] El foco es siempre visible (nunca desaparece).
- [ ] El orden de foco es lógico (de arriba a abajo, izquierda a derecha).
- [ ] Los menús mobile abren y cierran con teclado.
- [ ] Los formularios se pueden completar y enviar solo con teclado.

### 6.3 Skip link — enlace de salto para lectores de pantalla

```astro
<!-- Layout.astro — primer elemento del <body> -->
<a
  href="#main-content"
  class="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4
         focus:z-50 focus:px-4 focus:py-2 focus:bg-brand focus:text-white
         focus:rounded-md focus:font-bold"
>
  Saltar al contenido principal
</a>
```

### 6.4 Verificación de contraste — colores del proyecto

| Combinación | Ratio | ¿Pasa AA? |
|---|---|---|
| `#FFFFFF` sobre `#7F0FCB` (brand) | 7.3:1 | ✅ AAA |
| `#FFFFFF` sobre `#141420` (dark) | 16.7:1 | ✅ AAA |
| `#FFFFFF` sobre `#EC1D91` (brand-alt) | 4.6:1 | ✅ AA |
| `#60739F` (gray) sobre `#141420` | 3.9:1 | ⚠️ Solo textos grandes |
| `#FFFFFF` sobre `#1E1E2E` (surface) | 14.2:1 | ✅ AAA |

> ⚠️ `color-gray` (#60739F) sobre fondo `dark` no pasa AA para texto de cuerpo.
> Usar solo en texto de 18px+ o en labels no críticos. Para texto de cuerpo
> importante, usar `text-white` o `text-gray-muted` (#A0AABF — ratio 5.8:1 ✅).

### 6.5 Test en dispositivos reales

Probar en al menos:
- [ ] iPhone SE (375px) — Chrome mobile
- [ ] Android mid-range (360px) — Chrome mobile
- [ ] iPad (768px) — Safari
- [ ] Desktop (1280px+) — Chrome y Firefox

### ✅ Checklist Fase 6

- [ ] Lighthouse Accessibility ≥ 95 en todas las páginas.
- [ ] axe DevTools: cero errores de nivel Critical y Serious.
- [ ] Navegación completa por teclado funciona en home y contacto.
- [ ] Skip link visible al presionar Tab desde el inicio.
- [ ] Formulario de contacto completado con lector de pantalla (VoiceOver/NVDA).
- [ ] Contraste verificado — `color-gray` solo en textos grandes.
- [ ] Imágenes decorativas con `alt=""` y `aria-hidden="true"`.

---

## FASE 7 — Deploy y monitoreo

> **Duración estimada:** 2–3 horas  
> **Resultado:** sitio en producción, Google Search Console activo.

### 7.1 Build final de verificación

```bash
# Build limpio
pnpm build

# Verificar tamaño del bundle
du -sh dist/
ls -lh dist/_astro/*.js

# Preview local del build de producción
pnpm preview
```

### 7.2 Variables de entorno

```bash
# .env.production (NO commitear al repositorio)
PUBLIC_SITE_URL=https://www.elhogardenanis.com
PUBLIC_GA_ID=G-XXXXXXXXXX       # Google Analytics (si aplica)
PUBLIC_WHATSAPP=51941141780
```

```bash
# .gitignore — verificar que estos están excluidos
.env
.env.local
.env.production
```

### 7.3 Deploy en Netlify

```bash
# Conectar repo y configurar:
# Build command: pnpm build
# Publish directory: dist
# Node version: 20
```

Agregar en Netlify dashboard:
- Environment variables del `.env.production`
- Form detection: activar para el formulario de contacto

### 7.4 Post-deploy — verificaciones

```bash
# Verificar que el sitemap es accesible
curl https://www.elhogardenanis.com/sitemap-index.xml

# Verificar robots.txt
curl https://www.elhogardenanis.com/robots.txt

# Verificar canonical en home
curl -s https://www.elhogardenanis.com | grep canonical
```

### 7.5 Google Search Console

1. Verificar propiedad con meta tag o DNS.
2. Enviar sitemap: `https://www.elhogardenanis.com/sitemap-index.xml`.
3. Solicitar indexación de las páginas principales.
4. Configurar alertas de errores de cobertura.

### 7.6 Monitoreo continuo

```
Herramientas recomendadas (todas con plan gratuito):
├── Google Search Console  → indexación, errores de crawl, keywords
├── PageSpeed Insights     → CWV en datos de campo reales
├── Umami (self-hosted)    → analytics sin cookies, GDPR-friendly
└── UptimeRobot            → alertas si el sitio cae
```

### ✅ Checklist Fase 7

- [ ] `pnpm build` sin errores ni warnings.
- [ ] URL de producción accesible con HTTPS.
- [ ] `www` y no-`www` redirigen a la URL canónica.
- [ ] Sitemap accesible en `/sitemap-index.xml`.
- [ ] Google Search Console configurado y sitemap enviado.
- [ ] Lighthouse en producción: Performance ≥ 90, SEO = 100, Accessibility ≥ 95.
- [ ] Formulario de contacto envía y el cliente recibe el email.
- [ ] WhatsApp CTA funciona desde mobile.

---

## Mapa de dependencias

```
devDependencies
├── tailwindcss@next              ← Tailwind v4 (CSS engine)
├── @tailwindcss/vite             ← Plugin Vite para Tailwind v4
├── @astrojs/sitemap              ← Generación automática de sitemap
├── @astrojs/prefetch             ← Prefetch de navegación
├── @astrojs/partytown            ← Scripts de terceros off-thread
├── astro-compress                ← Compresión HTML/CSS/JS en build
├── @iconify/astro                ← Iconos (incluye Lucide set)
├── prettier                      ← Formateo de código
├── prettier-plugin-astro         ← Soporte Astro en Prettier
├── prettier-plugin-tailwindcss   ← Ordenado de clases Tailwind
├── eslint                        ← Linting
├── eslint-plugin-astro           ← Reglas Astro en ESLint
├── @typescript-eslint/parser     ← Parser TS para ESLint
└── @types/node                   ← Tipos de Node para Astro

dependencies (producción)
├── sharp                         ← Optimización de imágenes (requerido por Astro Image)
├── schema-dts                    ← Tipado TypeScript para JSON-LD
└── @fontsource-variable/plus-jakarta-sans  ← Fuentes self-hosted (opcional)
    @fontsource-variable/nunito
```

---

## Errores frecuentes y cómo prevenirlos

| Error | Causa | Solución |
|---|---|---|
| `@tailwind base` no funciona | Sintaxis Tailwind v3 usada en v4 | Usar `@import "tailwindcss"` en v4 |
| Tokens `--color-brand` no disponibles | `global.css` no importado en Layout | Importar `'../styles/global.css'` en Layout.astro |
| Alias `@components` no resuelve | `paths` en tsconfig no configurados | Agregar paths en `tsconfig.json` y `astro.config.mjs` |
| Imagen hero no optimizada | Imagen en `public/` en lugar de `src/assets/` | Mover a `src/assets/` e importar con ES module |
| Sitemap vacío o sin rutas | `site` no configurado en `astro.config.mjs` | Agregar `site: 'https://...'` obligatoriamente |
| JSON-LD no aparece en el head | `set:html` no usado o mal colocado | Usar `<script type="application/ld+json" set:html={schema} />` |
| Fuentes con FOUT visible | Google Fonts sin `display=swap` o sin preconnect | Agregar `&display=swap` y los dos `<link rel="preconnect">` |
| CLS alto en móvil | Imágenes sin `width` y `height` explícitos | Siempre proveer dimensiones en `<Image>` |
| `pnpm check` falla con props | Interface Props no declarada en componente | Siempre declarar `interface Props` en el frontmatter |
| Contraste insuficiente | `text-gray` usado en texto de cuerpo pequeño | Usar `text-gray-muted` (#A0AABF) o `text-white` |
| Scripts de terceros bloquean | Script cargado en `<head>` sin `defer` | Usar Partytown o `client:idle` en componentes |

---

> **Referencia cruzada:**  
> `BEST_PRACTICES.md` → arquitectura, SOLID, convenciones de código, Git  
> `STYLE_GUIDE.md` → tokens CSS, componentes, animaciones, tipografía  
> `PLAN_FASES.md` → este documento, orden de implementación y comandos  
>
> Versión: 1.0 · Proyecto: El Hogar de Nanis · Stack: Astro + Tailwind v4 + pnpm
