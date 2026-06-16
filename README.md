# MyDeenMarket — Islamic Books & Products Online Store

A modern, full-stack e-commerce platform for authentic Islamic books and products, built with Next.js 16, Tailwind CSS v4, and Prisma ORM. Designed from the ground up with **programmatic SEO**, performance, and accessibility baked into the codebase.

**Live:** [mydeenmarket.com](https://mydeenmarket.com)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Programmatic SEO — How It Works](#programmatic-seo--how-it-works)
- [Getting Started](#getting-started)
- [Database Commands](#database-commands)
- [Backups](#backups)
- [Deployment](#deployment)

---

## Features

### Storefront
- **Product Catalog** — Browse by category, collection, filter by bestseller / new / sale, full-text search
- **Dynamic Product Pages** — Auto-generated from database via `generateStaticParams()` (SSG)
- **Collection Pages** — 13+ category pages, each with breadcrumbs, filtering, and related products
- **Hero Slider** — 3-slide animated banner with Islamic noor light effects
- **Cart & Checkout** — Client-side cart with drawer, full checkout flow with COD and card payment
- **Currency Selector** — Multi-currency display support (PKR, USD, GBP, EUR, SAR)

### Authentication & Admin
- **NextAuth v5** — Credentials + Google OAuth login/signup
- **Admin Dashboard** — Orders, customers, products, and settings management
- **Role-Based Access** — Middleware-protected `/admin` routes for admin users only

### Design & UX
- **Dark Navy + Amber Palette** — `#0f172a` / `#d4a853` / `#0d9488` (teal accent)
- **Islamic Noor Animations** — Custom CSS: `noor-breathe`, `noor-glow`, `noor-bubble`, `noor-sparkle`, `noor-ring`
- **Glassmorphic Cards** — `backdrop-blur`, semi-transparent borders, gradient overlays
- **Custom Logo & Favicons** — SVG logo, `.ico`, `.svg`, and Apple Touch Icon
- **Responsive** — Mobile-first layout, collapsible nav, mobile search
- **Accessibility** — Skip-to-content link, `aria-labels` on all interactive elements, semantic HTML

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| **Framework** | Next.js (App Router + Turbopack) | 16.2.9 |
| **Language** | TypeScript | 5.x |
| **UI** | React | 19.2.4 |
| **Styling** | Tailwind CSS v4 (`@import "tailwindcss"`) | 4.x |
| **Fonts** | Inter (body) + Playfair Display (headings) via `next/font/google` | — |
| **Icons** | lucide-react | 1.17.0 |
| **Database** | PostgreSQL via Prisma ORM | Prisma 7.8.0 |
| **Auth** | NextAuth v5 (next-auth beta) | 5.0.0-beta.31 |
| **Password Hashing** | bcryptjs | 3.0.3 |
| **Dev Tools** | ESLint, tsx, dotenv | — |
| **Deployment** | Docker + Docker Compose | — |

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout — fonts, metadata, JSON-LD schemas
│   ├── page.tsx            # Homepage — hero, categories, bestsellers, FAQ
│   ├── globals.css         # Tailwind theme, noor animations, gradients
│   ├── robots.ts           # Dynamic robots.txt with AI bot rules
│   ├── sitemap.ts          # Auto-generated sitemap from database
│   ├── collections/
│   │   ├── page.tsx        # All collections listing with search & filters
│   │   └── [slug]/page.tsx # Dynamic category pages (SSG)
│   ├── product/
│   │   └── [slug]/page.tsx # Dynamic product pages (SSG)
│   ├── contact/page.tsx    # Contact page with form
│   ├── login/page.tsx      # Login (client) + layout.tsx (metadata)
│   ├── signup/page.tsx     # Signup (client) + layout.tsx (metadata)
│   ├── checkout/page.tsx   # Checkout (client) + layout.tsx (metadata)
│   ├── account/page.tsx    # Account dashboard + layout.tsx (metadata)
│   └── admin/              # Admin dashboard (protected)
├── components/
│   ├── Header.tsx          # Sticky header, search dropdown, mega menu
│   ├── Footer.tsx          # Noor-styled footer with links & social
│   ├── HeroSlider.tsx      # 3-slide hero with noor effects
│   ├── ProductCard.tsx     # Reusable product card with gradient placeholder
│   ├── CartDrawer.tsx      # Slide-out cart drawer
│   ├── CurrencyProvider.tsx
│   └── ...
├── lib/
│   ├── seo.ts              # All JSON-LD schema generators
│   ├── data.ts             # Prisma database queries
│   ├── data-types.ts       # Types, siteConfig, formatPrice
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client singleton
│   └── currency.ts         # Currency conversion utils
└── middleware.ts            # Auth middleware for protected routes
```

---

## Programmatic SEO — How It Works

Every SEO optimization below is implemented **in code** — no CMS plugins, no manual meta tag entry, no third-party SEO tools. The entire system is self-generating from the database and route structure.

### 1. Dynamic Meta Tags (Title & Description)

Every route generates its own `<title>` and `<meta name="description">` programmatically:

```typescript
// src/lib/seo.ts — generatePageMetadata()
export function generatePageMetadata({ title, description, path, noIndex }) {
  return {
    title,                          // Uses layout template: "%s | MyDeenMarket"
    description,
    alternates: { canonical: url }, // Self-referencing canonical
    openGraph: { ... },
    twitter: { ... },
    robots: noIndex ? { index: false } : { index: true, follow: true },
  };
}
```

| Page | Title Pattern | Chars |
|---|---|---|
| Homepage | `MyDeenMarket — Islamic Books & Products Pakistan` | 49 |
| Product | `{product.name} — Buy Online at Best Price` | ~40-60 |
| Category | `{category.name} — Buy Online in Pakistan` | ~35-50 |
| Contact | `Contact Us — MyDeenMarket Lahore` | 33 |
| Login/Signup/Checkout/Account | Contextual titles, all `noindex` | <60 |

### 2. Self-Referencing Canonical URLs

Every indexable page sets its own canonical URL via `generatePageMetadata()`:

```typescript
alternates: { canonical: `${siteConfig.url}${path}` }
```

This eliminates duplicate content issues from query strings, trailing slashes, or protocol variations.

### 3. Automated Sitemap Generation

`src/app/sitemap.ts` queries the database on every build and generates a complete XML sitemap:

```typescript
export default async function sitemap() {
  const [products, categories, collections] = await Promise.all([
    getProducts(), getCategories(), getCollections(),
  ]);
  return [
    ...staticPages,        // /, /collections, /contact (priority 0.6-1.0)
    ...categoryPages,      // /collections/{slug} (priority 0.9)
    ...collectionPages,    // /collections/{slug} (priority 0.85)
    ...productPages,       // /product/{slug} (priority 0.8)
  ];
}
```

**When you add a product or category to the database, it automatically appears in the sitemap** — zero manual work.

### 4. Intelligent robots.txt

`src/app/robots.ts` generates a dynamic `robots.txt` that:
- **Permits** 10 crawler types: Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Applebot-Extended, anthropic-ai, Amazonbot, Googlebot-Image
- **Blocks junk bots**: AhrefsBot, SemrushBot, MJ12bot
- **Hides private routes**: `/account`, `/checkout`, `/api/`, `/admin`, `/_next/`
- **Declares** sitemap URL and canonical host

### 5. JSON-LD Structured Data (8 Schema Types)

All structured data is generated from TypeScript functions in `src/lib/seo.ts`:

| Schema Type | Where Injected | Purpose |
|---|---|---|
| `Organization + Store` | Root layout (every page) | Business info, address, hours, payment methods |
| `WebSite` + `SearchAction` | Root layout | Enables Google Sitelinks Search Box |
| `SiteNavigationElement` | Root layout | 12 nav items → drives Google Sitelinks |
| `BreadcrumbList` | All pages | Breadcrumb trail in search results |
| `FAQPage` | Homepage | 6 Q&As → FAQ rich snippets |
| `ItemList` | Homepage | Top 10 products → product carousels |
| `Product` + `Offer` + `AggregateRating` | Product pages | Full product rich snippets |
| `CollectionPage` | Category pages | Collection metadata |

Example — product schema auto-generates from database fields:

```typescript
export function generateProductSchema(product) {
  return {
    "@type": "Product",
    name: product.name,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "PKR",
      availability: product.inStock ? "InStock" : "OutOfStock",
    },
    aggregateRating: {
      ratingValue: product.rating,
      ratingCount: product.reviewCount,
    },
  };
}
```

### 6. Static Site Generation (SSG) for Product & Category Pages

```typescript
// src/app/product/[slug]/page.tsx
export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}
```

All product and category pages are **pre-rendered at build time** as static HTML — instant load, fully crawlable, zero JavaScript required for content.

### 7. Semantic HTML & Accessibility

- **Single `<h1>` per page** — homepage uses `sr-only` H1, all other pages have visible H1
- **Sequential heading hierarchy** — `h1 → h2 → h3`, no levels skipped
- **Descriptive alt text** — all `<Image>` components have meaningful `alt` attributes
- **ARIA labels** — every interactive element (`aria-label`, `aria-expanded`, `aria-labelledby`)
- **Skip-to-content link** — `<a href="#main-content">` for keyboard navigation
- **Microdata** — product pages use `itemScope itemType="https://schema.org/Product"` with `itemProp` attributes

### 8. BLUF Pattern for AI/LLM Scrapers

The homepage includes a visually hidden but crawlable summary:

```tsx
<section className="sr-only" aria-label="Store summary">
  <p>MyDeenMarket is Pakistan's trusted online Islamic store based in Lahore.
  We sell authentic Islamic books (Quran, Hadith, Seerah, Fiqh, Tafseer),
  Abaya, Tasbih, Janamaz prayer mats, Zamzam water, ...</p>
</section>
```

This gives AI answer engines (ChatGPT, Perplexity, Google AI Overviews) a clean, extractable summary without affecting visual design.

### 9. Core Web Vitals Optimizations

| Metric | Technique |
|---|---|
| **LCP** | `priority` flag on hero logo `<Image>`, `display: "swap"` on fonts, `preconnect` to Google Fonts |
| **CLS** | Explicit `min-h` on hero slider, `width`/`height` on all images, `aspect-ratio` on product cards |
| **INP** | Client components use `passive: true` scroll listeners, lightweight state updates |

### 10. Keyword Strategy (43 Keywords)

The root layout injects 43 targeted keywords covering:
- Primary: `Islamic books online Pakistan`, `buy Quran online`, `MyDeenMarket`
- Product: `Abaya online Pakistan`, `Tasbih buy online`, `Zamzam water Pakistan`
- Long-tail: `buy Islamic products online Pakistan`, `Quran with Urdu translation buy online`
- Branded: `best Islamic bookstore Lahore`, `online Islamic store cash on delivery`

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (or use Docker)

### Install & Run

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your DATABASE_URL, NEXTAUTH_SECRET, etc.

# Run database migrations
npm run db:migrate

# Seed sample data
npm run db:seed

# Start dev server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Using Docker

```bash
docker-compose up --build
```

---

## Database Commands

| Command | Description |
|---|---|
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed database with sample products |
| `npm run db:reset` | Reset database (destructive) |
| `npm run db:studio` | Open Prisma Studio GUI |

---

## Backups

This project includes a one-command production backup that copies both:

- PostgreSQL production data (SQL dump)
- Product image uploads folder

### Create local backup from production

```bash
npm run backup:prod
```

- Prompts for SSH password once
- Stores backup under `backups/production/<timestamp>/`
- Updates `backups/production/latest` symlink

### Restore local DB + images from backup

```bash
npm run restore:local
```

You can restore from a specific snapshot:

```bash
./scripts/restore-local-from-backup.sh ./backups/production/20260616-193000
```

Configurable environment variables for scripts:

- `REMOTE_HOST`, `REMOTE_USER`, `REMOTE_APP_DIR`, `REMOTE_IMAGE_DIR`
- `BACKUP_ROOT`
- `LOCAL_DATABASE_URL`, `LOCAL_IMAGE_DIR`

---

## Deployment

### Vercel (Recommended)

```bash
npm run build   # Generates static pages + sitemap
vercel deploy
```

### Docker

```bash
docker-compose up -d --build
```

The `Dockerfile` and `docker-compose.yml` are included for containerized deployment.

---

## License

Private project — all rights reserved.
