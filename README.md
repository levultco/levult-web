# Levult

La web de **Levult**, la empresa tecnológica detrás de [ParyUp](https://paryup.com) y [Oposalud](https://oposalud.app). Presenta la compañía y sus trabajos destacados con una experiencia de scroll animada: un fluido 3D en WebGL, transiciones de tinta líquida entre páginas e interfaces de las apps que se pueden usar.

## Stack

- **Next.js 16** (App Router, Cache Components) con **React 19** y TypeScript
- **Tailwind CSS 4**
- **Lenis** para el scroll suave y **GSAP + ScrollTrigger** para las animaciones
- **Three.js** para el fluido (un shader de raymarching con dos gotas que se funden y se separan)
- Fuente **Geist**

> Esta versión de Next.js tiene cambios respecto a versiones anteriores. Antes de tocar APIs o convenciones, consulta la guía correspondiente en `node_modules/next/dist/docs/` (ver `AGENTS.md`).

## Empezar

Se usa **bun** como gestor de paquetes.

```bash
bun install
```

```bash
bun run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Otros comandos:

```bash
bun run build
```

```bash
bun run start
```

```bash
bun run lint
```

### Variables de entorno

| Variable | Para qué sirve | Por defecto |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Dominio público: URL canónica, sitemap, robots, imágenes para compartir y datos estructurados | `https://levult.com` |

## Páginas

| Ruta | Contenido |
| --- | --- |
| `/` | Hero con el fluido, declaración, trabajos destacados (tarjetas apiladas), compañía, contacto y footer |
| `/features/[slug]` | Página de cada trabajo: datos, interfaz interactiva, qué hace, enlace a su web y siguiente trabajo |

## Estructura

```
app/
  layout.tsx              Layout raíz: metadatos base, script de arranque, header, footer, transiciones
  page.tsx                Home
  features/[slug]/        Página de cada trabajo y su imagen para compartir
  opengraph-image.tsx     Imagen para compartir de la home
  sitemap.ts, robots.ts, manifest.ts
  icon.svg, apple-icon.png
components/
  brand/                  Logo (Wordmark, LogoSymbol) y sus trazados
  layout/                 Header, menú, footer, indicador de scroll, transición de tinta e intro
  sections/               Secciones de la home
  product/                Piezas de las páginas de trabajo (escenario con luz de marca, siguiente trabajo…)
  mockups/                Interfaces interactivas de ParyUp y Oposalud
  webgl/                  Escena del fluido y shaders
  providers/              Scroll suave (Lenis) y coreografía de entradas (GSAP)
  ui/                     Píldoras, texto con morph, textos animados…
  seo/                    JSON-LD
lib/
  products.ts             Trabajos destacados (fuente única de datos)
  content.ts              Navegación, correo y contenido de los mockups
  site.ts                 Nombre, dominio, descripción y colores del sitio
  scene.ts                Coreografía del fluido según la sección visible
  ink.ts                  Forma de la tinta líquida (transiciones, intro y menú)
  structured-data.ts      Esquemas de Organization, WebSite y MobileApplication
public/brand/             Logo en SVG (logotipo, símbolo e icono de app, en negro y blanco)
```

## Añadir un trabajo destacado

Todo sale de `lib/products.ts`. Al añadir una entrada aparece automáticamente en:

- las tarjetas de la home, el menú y el footer;
- su página en `/features/<slug>`, con su imagen para compartir;
- el sitemap y los datos estructurados.

Campos principales: `name`, `kind` (App/Web), `category`, `platforms`, `status`, `url` (su web), `summary`, `lead`, `body`, `features`, `audience` (opcional) y `glow` (2–3 colores de marca para la luz del escenario). Si el producto tiene una interfaz interactiva, se indica en `device` y se añade su componente en `components/mockups/` y en `components/product/ProductDevice.tsx`.

## Marca

- Colores: fondo `#F0F1FA` y tinta `#0C0C0D` (en `app/globals.css` y `lib/site.ts`).
- El logo está en `components/brand/` y los archivos sueltos en `public/brand/`. Los trazados de `logo-paths.ts` se reconstruyeron a partir de una imagen; si se consigue el SVG original, basta con sustituirlos para que se actualice en toda la web.
- Favicon: `app/icon.svg`. Icono de iOS: `app/apple-icon.png`.

## Animación y accesibilidad

- El fluido solo aparece sobre las secciones blancas; antes de que llegue el panel negro, las gotas salen hacia los lados. Las posiciones de cada sección se definen en `lib/scene.ts`.
- La intro solo se reproduce en la primera visita de cada sesión.
- Todo respeta *reducir movimiento*: se desactivan el scroll suave, la intro, las transiciones y las animaciones, y el contenido se muestra directamente.
- Si el JavaScript no carga, el script de arranque deja el contenido visible a los 3,5 s.

## SEO y vistas previas

- Metadatos, URL canónica y Open Graph/Twitter en cada página.
- Imágenes para compartir de 1200×630 generadas con `next/og` (`app/opengraph-image.tsx` y `app/features/[slug]/opengraph-image.tsx`). Usan la fuente Geist en TTF del paquete `geist`.
- `sitemap.xml`, `robots.txt`, `manifest.webmanifest` y JSON-LD.
- Tras publicar, revisa las tarjetas con el [Sharing Debugger de Facebook](https://developers.facebook.com/tools/debug/), el [Post Inspector de LinkedIn](https://www.linkedin.com/post-inspector/) u [opengraph.xyz](https://www.opengraph.xyz).

## Notas de desarrollo

- Si el servidor de desarrollo deja de recoger cambios (sobre todo en `app/globals.css`), detenlo, borra `.next` y vuelve a arrancarlo.
- Los componentes que inyectan estilos críticos (intro, texto con morph) los llevan dentro del propio componente, para no depender de `globals.css`.

## Despliegue

Pensado para [Vercel](https://vercel.com). Configura `NEXT_PUBLIC_SITE_URL` con el dominio de producción si no es `levult.com`.
