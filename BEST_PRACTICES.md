# 📋 BEST PRACTICES — El Hogar de Nanis
> Proyecto Astro + Tailwind v4 · Lima, Perú  
> Aplica a: código, arquitectura, SEO, accesibilidad, rendimiento y proceso.

---

## 0. Índice rápido

1. [Estructura de archivos y carpetas](#1-estructura-de-archivos-y-carpetas)
2. [Principios SOLID aplicados a Astro](#2-principios-solid-aplicados-a-astro)
3. [Mobile-First con Tailwind v4](#3-mobile-first-con-tailwind-v4)
4. [SEO técnico y Local SEO Lima](#4-seo-técnico-y-local-seo-lima)
5. [Principios SMART de objetivos y métricas](#5-principios-smart-de-objetivos-y-métricas)
6. [Calidad de código — Convenciones y estilo](#6-calidad-de-código--convenciones-y-estilo)
7. [Accesibilidad (a11y)](#7-accesibilidad-a11y)
8. [Performance y Core Web Vitals](#8-performance-y-core-web-vitals)
9. [Gestión de datos (JSON → componentes)](#9-gestión-de-datos-json--componentes)
10. [Git y control de versiones](#10-git-y-control-de-versiones)
11. [Checklist antes de cada PR / deploy](#11-checklist-antes-de-cada-pr--deploy)

---

## 1. Estructura de archivos y carpetas

```
src/
├── assets/           # SVG, imágenes que Astro optimiza en build
├── components/       # Átomos y moléculas reutilizables
│   ├── ui/           # Botones, cards, badges (sin lógica de negocio)
│   └── sections/     # Hero, Servicios, Testimonios (contienen datos)
├── layouts/          # Layout.astro (shell HTML completo)
├── pages/            # Una carpeta = una ruta (index, servicios, etc.)
├── lib/              # Helpers puros: formatters, slugify, seo-utils
└── types/            # TypeScript interfaces (Site, Servicio, Review…)

public/
├── data/             # JSON de contenido (ya existente — no mover)
└── images/           # Imágenes públicas sin optimización de Astro
```

### Reglas de nomenclatura

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componente Astro | PascalCase | `ServiceCard.astro` |
| Página | kebab-case | `como-trabajamos.astro` |
| Helper / util | camelCase | `formatPhone.ts` |
| Constante global | SCREAMING_SNAKE | `SITE_URL` |
| CSS class (Tailwind) | utility-first, sin clases semánticas propias | `text-brand` |

---

## 2. Principios SOLID aplicados a Astro

### S — Single Responsibility
Cada componente hace **una sola cosa**.

```astro
<!-- ❌ Mal: un componente que carga datos Y los pinta Y tiene lógica SEO -->
<!-- ✅ Bien: separar en ServiceCard.astro (pintar), servicios.json (datos),
           y la página servicios.astro (orquestar) -->
```

- Un `.astro` no debe superar ~150 líneas. Si lo hace, extrae sub-componentes.
- Los helpers en `src/lib/` nunca importan componentes; solo procesan datos.

### O — Open / Closed
Los componentes se **extienden via props**, no se modifican internamente.

```astro
---
// ServiceCard.astro — abierto a variantes, cerrado a edición directa
interface Props {
  title: string;
  description: string;
  variant?: 'default' | 'highlight';
}
const { title, description, variant = 'default' } = Astro.props;
---
```

### L — Liskov Substitution
Si tienes `BaseCard.astro`, cualquier variante (`ServiceCard`, `TestimonialCard`) debe poder usarse en su lugar sin romper el layout.

### I — Interface Segregation
En `src/types/`, define interfaces específicas en lugar de mega-objetos.

```ts
// ❌ Mal
interface Todo { site: object; servicios: object[]; contacto: object }

// ✅ Bien — un fichero por dominio
// types/servicio.ts
export interface Servicio {
  id: string;
  title: string;
  shortDescription: string;
  features: string[];
}
```

### D — Dependency Inversion
Las páginas dependen de **abstracciones (tipos + props)**, no de implementaciones concretas.

```astro
---
// pages/nuestros-servicios.astro
import type { Servicio } from '../types/servicio';
import data from '../../public/data/servicios.json';
import ServiceCard from '../components/sections/ServiceCard.astro';
---
{(data as Servicio[]).map(s => <ServiceCard {...s} />)}
```

---

## 3. Mobile-First con Tailwind v4

### Regla de oro
Escribe el estilo **base para móvil** y agrega breakpoints hacia arriba:

```html
<!-- ❌ Desktop-first (evitar) -->
<div class="grid grid-cols-3 md:grid-cols-1">

<!-- ✅ Mobile-first -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### Breakpoints del proyecto

| Token Tailwind | Ancho mínimo | Uso típico |
|---|---|---|
| *(base)* | 0px | Móvil (< 640 px) |
| `sm:` | 640 px | Móvil grande / landscape |
| `md:` | 768 px | Tablet |
| `lg:` | 1024 px | Desktop |
| `xl:` | 1280 px | Desktop ancho |

### Componentes táctiles
- Área mínima de toque: **44 × 44 px** (botones, links de navegación).
- Espaciado entre elementos táctiles: mínimo `gap-3` (12 px).
- No uses `hover:` como único indicador de estado; agrega `focus-visible:` y `active:`.

### Tipografía fluida (recomendada)
```css
/* En tu CSS global o @theme */
font-size: clamp(0.875rem, 2.5vw, 1rem);   /* body */
font-size: clamp(1.5rem,   4vw,  2.5rem);  /* h1   */
```

---

## 4. SEO técnico y Local SEO Lima

### 4.1 Estructura de metadatos por página

Cada página debe recibir props de SEO y renderizarlos en el `<Layout>`:

```astro
---
// Layout.astro
interface Props {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
}
---
<head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical ?? Astro.url.href} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage ?? '/images/bannerfinal.png'} />
  <meta property="og:locale" content="es_PE" />
</head>
```

Límites recomendados:
- `<title>`: 50–60 caracteres (incluir keyword principal + marca).
- `<meta description>`: 145–160 caracteres.

### 4.2 JSON-LD Local Business (ya definido en `all.json`)

Renderizar en `Layout.astro` como script inline:

```astro
---
import siteData from '../../public/data/site.json';
const schema = JSON.stringify(siteData.localSeo.schemaLocalBusiness);
---
<script type="application/ld+json" set:html={schema} />
```

Complementar con `BreadcrumbList` en páginas internas:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Inicio", "item": "https://www.elhogardenanis.com" },
    { "@type": "ListItem", "position": 2, "name": "Servicios", "item": "https://www.elhogardenanis.com/nuestros-servicios" }
  ]
}
```

### 4.3 Headings — jerarquía obligatoria

```
H1 → 1 por página. Contiene keyword primaria + nombre de ciudad.
H2 → Secciones principales (servicios, testimonios…).
H3 → Items dentro de secciones (nombre del servicio individual).
```

Nunca saltar niveles (de H1 a H3 directamente).

### 4.4 Imágenes SEO-friendly

```astro
<!-- Usa el componente <Image> de Astro para imágenes en src/assets/ -->
import { Image } from 'astro:assets';
import heroImg from '../assets/bannerfinal.png';

<Image
  src={heroImg}
  alt="Familia de Lima feliz gracias a la agencia El Hogar de Nanis"
  width={1200}
  height={630}
  format="webp"
  loading="eager"   <!-- Solo para imagen above-the-fold -->
  fetchpriority="high"
/>
```

- `alt` siempre descriptivo, nunca vacío en imágenes de contenido.
- Imágenes decorativas: `alt=""` y `role="presentation"`.
- Usa `loading="lazy"` en todas las imágenes below-the-fold.

### 4.5 URLs y slugs

- Todas en kebab-case y en **español**: `/agencia-de-nineras-y-nanas-lima`.
- Sin caracteres especiales (tildes, ñ) en la URL.
- Trailing slash consistente (configura en `astro.config.mjs`):
  ```js
  export default defineConfig({ trailingSlash: 'never' });
  ```

### 4.6 Sitemap y robots

```js
// astro.config.mjs
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://www.elhogardenanis.com',
  integrations: [sitemap()],
});
```

`public/robots.txt`:
```
User-agent: *
Allow: /
Sitemap: https://www.elhogardenanis.com/sitemap-index.xml
```

---

## 5. Principios SMART de objetivos y métricas

Aplica SMART a cada tarea de desarrollo antes de comenzarla:

| Letra | Significado | Ejemplo en este proyecto |
|---|---|---|
| **S**pecific | Tarea concreta y delimitada | "Crear componente `TestimonialCard.astro` con rating de estrellas" |
| **M**easurable | Hay criterio de éxito medible | "Lighthouse Performance ≥ 90 en móvil" |
| **A**chievable | Realista con los recursos disponibles | "Optimizar imágenes hero a WebP en 1 sprint" |
| **R**elevant | Impacto directo en el negocio o usuario | "Mejorar CLS para reducir rebote en mobile" |
| **T**ime-bound | Fecha límite o estimación clara | "Antes del deploy de la semana 2" |

### KPIs técnicos del proyecto (SMART concretos)

- **LCP** (Largest Contentful Paint) < 2.5 s en 4G móvil.
- **CLS** (Cumulative Layout Shift) < 0.1.
- **FID / INP** < 200 ms.
- **Lighthouse SEO** = 100 / **Accesibilidad** ≥ 95.
- **Cobertura de metadatos**: 100 % de rutas con title + description únicos.

---

## 6. Calidad de código — Convenciones y estilo

### TypeScript estricto

```json
// tsconfig.json — ya incluido en el proyecto Astro base
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

- Nunca usar `any`. Usar `unknown` y acotar con type guards si es necesario.
- Todos los props de componentes Astro deben tener interface `Props` explícita.

### Componentes Astro — reglas

```astro
---
// 1. Imports primero (externos → internos → tipos)
import { Image } from 'astro:assets';
import ServiceCard from '../components/ui/ServiceCard.astro';
import type { Servicio } from '../types/servicio';

// 2. Props con interface
interface Props { servicio: Servicio; featured?: boolean; }
const { servicio, featured = false } = Astro.props;

// 3. Lógica mínima — sin side effects en el frontmatter
const hasFeatures = servicio.features.length > 0;
---

<!-- 4. Template limpio, sin lógica compleja inline -->
<article class:list={['card', { 'card--featured': featured }]}>
  <h3>{servicio.title}</h3>
  {hasFeatures && (
    <ul>
      {servicio.features.map(f => <li>{f}</li>)}
    </ul>
  )}
</article>
```

### Tailwind — buenas prácticas

```html
<!-- ❌ Clases repetidas sin extracción -->
<button class="px-6 py-3 bg-brand text-white rounded-full font-semibold hover:bg-brand-alt transition">CTA</button>
<button class="px-6 py-3 bg-brand text-white rounded-full font-semibold hover:bg-brand-alt transition">CTA 2</button>

<!-- ✅ Componente reutilizable o @apply en global.css para patrones frecuentes -->
<!-- ButtonPrimary.astro -->
```

Usa `@apply` **solo** para patrones que se repiten 3+ veces y que no justifican un componente Astro propio (ej. `.btn-primary`).

### Comentarios

- Comenta el **por qué**, no el qué.
- Los componentes complejos deben tener un bloque JSDoc en el frontmatter:

```astro
---
/**
 * HeroSection
 * Sección principal de la home. Consume datos de site.json.
 * LCP target: imagen hero debe cargar en < 2.5 s → usar fetchpriority="high".
 */
---
```

### Linting y formateo

```json
// .eslintrc o eslint.config.js
{
  "extends": ["eslint:recommended", "plugin:astro/recommended"],
  "rules": {
    "no-console": "warn",
    "prefer-const": "error"
  }
}
```

Prettier config recomendada (`.prettierrc`):
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "plugins": ["prettier-plugin-astro", "prettier-plugin-tailwindcss"]
}
```

---

## 7. Accesibilidad (a11y)

### Mínimos obligatorios

- **Contraste** mínimo de color: 4.5:1 para texto normal, 3:1 para texto grande (WCAG AA).
  - Verifica: `#7F0FCB` (brand) sobre `#ffffff` = ratio 7.3:1 ✅
  - Verifica: `#EC1D91` (brand-alt) sobre `#ffffff` = ratio 4.6:1 ✅ (justo en el límite)
- **Focus visible** en todos los elementos interactivos:
  ```css
  :focus-visible { outline: 2px solid var(--color-brand); outline-offset: 3px; }
  ```
- **Landmarks HTML5** presentes en cada página:
  ```html
  <header>, <nav>, <main>, <footer>
  <!-- Y en páginas ricas: <section aria-labelledby="id-del-h2"> -->
  ```

### Formulario de contacto / bolsa de trabajo

```html
<!-- Asociar siempre label con input -->
<label for="nombre">Nombre completo</label>
<input id="nombre" name="nombre" type="text" required
       aria-describedby="nombre-hint" />
<span id="nombre-hint" class="text-sm text-gray">Tal como aparece en tu DNI</span>

<!-- Errores accesibles -->
<input aria-invalid="true" aria-errormessage="nombre-error" />
<span id="nombre-error" role="alert">Este campo es obligatorio</span>
```

### Imágenes e iconos

```astro
<!-- Iconos decorativos (Lucide, SVG inline) -->
<svg aria-hidden="true" focusable="false">...</svg>

<!-- Iconos con significado -->
<svg role="img" aria-label="Teléfono">...</svg>
```

---

## 8. Performance y Core Web Vitals

### Estrategia de carga de imágenes

| Imagen | `loading` | `fetchpriority` |
|---|---|---|
| Hero (`bannerfinal.png`) | `eager` | `high` |
| Logo en header | `eager` | `high` |
| Imágenes de servicios | `lazy` | *(omitir)* |
| Fotos de testimonios | `lazy` | *(omitir)* |

### Fonts

- No cargar Google Fonts externos en producción (latencia). Usar `@font-face` auto-hosted o las variable fonts de Astro.
- Si usas fuentes externas, siempre `preconnect`:
  ```html
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  ```

### Scripts de terceros (WhatsApp, Analytics)

```astro
<!-- Cargar scripts de terceros con is:inline + defer o en el cliente -->
<script is:inline defer src="..."></script>

<!-- O con la directiva client: de Astro para componentes interactivos -->
<WhatsAppWidget client:idle />
```

Orden de directivas client recomendado:
- `client:load` → solo para elementos críticos above-the-fold.
- `client:idle` → widgets secundarios (chat de WhatsApp).
- `client:visible` → secciones below-the-fold.

### Caché y headers (si usas Netlify/Vercel)

```toml
# netlify.toml
[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.json"
  [headers.values]
    Cache-Control = "public, max-age=3600"
```

---

## 9. Gestión de datos (JSON → componentes)

### Patrón de importación en páginas

```astro
---
// Importación tipada desde public/data/
import serviciosRaw from '../../public/data/servicios.json';
import type { Servicio } from '../types/servicio';

const servicios = serviciosRaw as Servicio[];
---
```

### Nunca hardcodear datos de negocio en componentes

```astro
<!-- ❌ Datos de negocio hardcodeados en template -->
<p>Llámanos: 01-2282987</p>

<!-- ✅ Provenir siempre del JSON -->
<p>Llámanos: {contactData.phone}</p>
```

### Validación de datos en desarrollo

Para detectar errores en los JSON en build time, añade una función de validación:

```ts
// src/lib/validateData.ts
import type { Servicio } from '../types/servicio';

export function assertServicio(data: unknown): asserts data is Servicio {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Servicio inválido: esperaba un objeto');
  }
  // …más checks
}
```

---

## 10. Git y control de versiones

### Conventional Commits

```
feat(servicios): agregar card de adulto mayor con animación hover
fix(seo): corregir canonical duplicado en página de contacto
perf(images): convertir empleadasdelhogar.jpg a webp con Astro Image
style(layout): ajustar padding en mobile para HeroSection
chore(deps): actualizar astro a v5.x
```

### Branching

```
main          ← producción (siempre desplegable)
dev           ← integración continua
feat/xxx      ← nuevas funcionalidades
fix/xxx       ← correcciones
perf/xxx      ← mejoras de rendimiento
```

### Pull Request checklist

Ver sección 11.

---

## 11. Checklist antes de cada PR / deploy

### Código
- [ ] No hay `any` en TypeScript.
- [ ] Todos los componentes tienen interface `Props` definida.
- [ ] No hay datos hardcodeados de negocio (teléfonos, direcciones, textos).
- [ ] Sin `console.log` en producción.
- [ ] Prettier ejecutado (`pnpm format`).
- [ ] ESLint sin errores ni warnings nuevos (`pnpm lint`).

### SEO
- [ ] Cada página tiene `<title>` único (≤ 60 car.) y `<meta description>` (≤ 160 car.).
- [ ] JSON-LD de LocalBusiness presente en el `<head>` de la home.
- [ ] Todas las imágenes tienen `alt` descriptivo.
- [ ] Canonical correcto en páginas con parámetros de URL.
- [ ] `sitemap.xml` generado y actualizado.

### Accesibilidad
- [ ] Jerarquía de headings H1 → H2 → H3 correcta en todas las páginas.
- [ ] Contraste de texto ≥ 4.5:1 verificado con herramienta.
- [ ] Focus visible funciona con teclado en todos los elementos interactivos.
- [ ] Formularios con labels asociados y mensajes de error accesibles.

### Performance
- [ ] Lighthouse Performance ≥ 90 en móvil (simular 4G lento).
- [ ] LCP < 2.5 s · CLS < 0.1 · INP < 200 ms.
- [ ] Imagen hero usa `loading="eager"` y `fetchpriority="high"`.
- [ ] Resto de imágenes usan `loading="lazy"`.
- [ ] No hay CSS o JS bloqueante en el `<head>` sin `defer`/`async`.

### Mobile
- [ ] Layout probado en 375 px (iPhone SE), 390 px (iPhone 14), 768 px (tablet).
- [ ] Todos los botones y links tienen área de toque ≥ 44 × 44 px.
- [ ] Sin scroll horizontal en ningún breakpoint.

---

> **Nota**: Este documento es vivo. Actualízalo cuando el equipo acuerde nuevas convenciones o cuando el stack cambie de versión mayor.  
> Versión: 1.0 · Proyecto: El Hogar de Nanis · Stack: Astro + Tailwind v4 + TypeScript
