/**
 * Scrapes all products from darussalam.pk (Shopify JSON API) and
 * writes them to prisma/products.import.json in your existing import format.
 *
 * Usage:
 *   DATABASE_URL='postgresql://...' npx tsx prisma/scrape-darussalam.ts
 *   DATABASE_URL='postgresql://...' npx tsx prisma/scrape-darussalam.ts --import
 *
 * Add --import flag to immediately import into your database after scraping.
 */

import fs from "node:fs";
import path from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

// ─── Shopify collection → your categorySlug ──────────────────────────────────
const COLLECTION_MAP: Record<string, string> = {
  "quran":                  "quran",
  "hadith-quran-hadith":    "hadith",
  "prayer-supplication":    "prayer",
  "prophet-s-seerah":       "seerah",
  "fiqh":                   "fiqh",
  "children":               "children",
  "biography":              "biography",
  "imams-scholars":         "biography",
  "faith-aqeedah":          "aqeedah",
  "history":                "history",
  "dawah":                  "dawah",
  "hajj-o-umrah-collection":"hajj-umrah",
  "health":                 "health",
  "education":              "children",
  "ahadith-e-nabvi":        "hadith",
  "ahadith-qudsi":          "hadith",
  "family":                 "biography",
  "fasting":                "fiqh",
};

// ─── Tag-based fallback category detection ───────────────────────────────────
function guessCategory(tags: string[], title: string): string {
  const all = [...tags.map(t => t.toLowerCase()), title.toLowerCase()];
  if (all.some(t => /quran|tajweed|qaidah|nazra|hafiz|tilaawat/.test(t))) return "quran";
  if (all.some(t => /hadith|ahadith|bukhari|muslim|tirmidhi|abu.?dawud/.test(t))) return "hadith";
  if (all.some(t => /seerah|sirah|nabawi|prophet|rasul|nabi/.test(t))) return "seerah";
  if (all.some(t => /prayer|salah|namaz|dua|supplication|wazaif|azkar/.test(t))) return "prayer";
  if (all.some(t => /fiqh|jurisprudence|fasting|sawm|zakat/.test(t))) return "fiqh";
  if (all.some(t => /aqeedah|aqeeda|faith|tawheed|creed/.test(t))) return "aqeedah";
  if (all.some(t => /kids|children|bachey|baccho/.test(t))) return "children";
  if (all.some(t => /biography|seerah|scholars|imams|hazrat/.test(t))) return "biography";
  if (all.some(t => /history|tarikh/.test(t))) return "history";
  if (all.some(t => /dawah|preaching/.test(t))) return "dawah";
  if (all.some(t => /hajj|umrah|pilgrimage/.test(t))) return "hajj-umrah";
  if (all.some(t => /health|tib|medicine|prophetic/.test(t))) return "health";
  return "biography"; // sensible default
}

// ─── Detect language from title ──────────────────────────────────────────────
function detectLanguage(title: string): string {
  const arabic = /[\u0600-\u06FF]/;
  if (arabic.test(title)) return "Arabic/Urdu";
  const english = /^[A-Za-z\s\-()0-9,.'":!&]+$/;
  if (english.test(title)) return "English";
  return "Urdu";
}

// ─── Strip HTML tags from body_html ──────────────────────────────────────────
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

// ─── Generate URL-safe slug ───────────────────────────────────────────────────
function toSlug(handle: string): string {
  return handle.toLowerCase().replace(/[^a-z0-9-]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

// ─── Category-based gradient ─────────────────────────────────────────────────
const GRADIENTS: Record<string, string> = {
  quran:      "from-emerald-200 to-emerald-400",
  hadith:     "from-sky-200 to-sky-400",
  prayer:     "from-purple-200 to-purple-400",
  seerah:     "from-amber-200 to-amber-400",
  fiqh:       "from-orange-200 to-orange-400",
  children:   "from-blue-200 to-blue-400",
  biography:  "from-green-200 to-green-400",
  aqeedah:    "from-rose-200 to-rose-400",
  history:    "from-stone-200 to-stone-400",
  dawah:      "from-teal-200 to-teal-400",
  "hajj-umrah": "from-yellow-200 to-yellow-400",
  health:     "from-lime-200 to-lime-400",
};

// ─── Shopify types ────────────────────────────────────────────────────────────
interface ShopifyVariant {
  price: string;
  compare_at_price: string | null;
  available: boolean;
}

interface ShopifyImage {
  src: string;
}

interface ShopifyProduct {
  id: number;
  handle: string;
  title: string;
  body_html: string;
  vendor: string;
  tags: string[];
  variants: ShopifyVariant[];
  images: ShopifyImage[];
}

interface ShopifyResponse {
  products: ShopifyProduct[];
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────
const DELAY_MS = 600; // be polite to the server
function sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { "Accept": "application/json", "User-Agent": "MyDeenMarket-Importer/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json() as Promise<T>;
}

async function fetchAllFromCollection(collectionSlug: string): Promise<ShopifyProduct[]> {
  const products: ShopifyProduct[] = [];
  let page = 1;

  while (true) {
    const url = `https://darussalam.pk/collections/${collectionSlug}/products.json?limit=250&page=${page}`;
    process.stdout.write(`  fetching page ${page} of ${collectionSlug}...`);
    const data = await fetchJson<ShopifyResponse>(url);

    if (!data.products?.length) {
      console.log(" done");
      break;
    }

    products.push(...data.products);
    console.log(` ${data.products.length} products`);

    if (data.products.length < 250) break;
    page++;
    await sleep(DELAY_MS);
  }

  return products;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const doImport = process.argv.includes("--import");

  console.log("=== Darussalam.pk Product Scraper ===\n");

  const seen = new Set<string>();
  const results: object[] = [];

  for (const [collection, categorySlug] of Object.entries(COLLECTION_MAP)) {
    console.log(`\n[${collection}] → ${categorySlug}`);
    let products: ShopifyProduct[] = [];

    try {
      products = await fetchAllFromCollection(collection);
    } catch (err) {
      console.warn(`  SKIP (fetch error): ${(err as Error).message}`);
      await sleep(DELAY_MS);
      continue;
    }

    for (const p of products) {
      if (seen.has(p.handle)) continue;
      seen.add(p.handle);

      const variant = p.variants[0];
      const price = Math.round(parseFloat(variant?.price || "0"));
      const compareAtPrice = variant?.compare_at_price
        ? Math.round(parseFloat(variant.compare_at_price))
        : undefined;
      const description = stripHtml(p.body_html) || p.title;
      const slug = toSlug(p.handle);
      const lang = detectLanguage(p.title);

      results.push({
        slug,
        name: p.title,
        author: p.vendor || "Darussalam",
        vendor: "DARUSSALAM",
        price: price || 0,
        ...(compareAtPrice ? { compareAtPrice } : {}),
        rating: 5,
        reviewCount: 0,
        categorySlug,
        badge: undefined,
        description,
        features: [],
        language: lang,
        inStock: variant?.available ?? true,
        gradient: GRADIENTS[categorySlug] || "from-emerald-200 to-emerald-400",
        icon: "book",
        ...(p.images[0]?.src ? { imageUrl: p.images[0].src } : {}),
      });
    }

    await sleep(DELAY_MS);
  }

  console.log(`\n✅ Scraped ${results.length} unique products from ${Object.keys(COLLECTION_MAP).length} collections.`);

  const outputPath = path.resolve(process.cwd(), "prisma/products.import.json");
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf8");
  console.log(`📄 Written to ${outputPath}`);

  if (!doImport) {
    console.log("\nRun with --import flag to import directly into database:");
    console.log("  DATABASE_URL='...' npx tsx prisma/scrape-darussalam.ts --import");
    return;
  }

  // ─── Direct import into database ───────────────────────────────────────────
  console.log("\n📦 Importing into database...");
  const adapter = new PrismaPg({
    connectionString:
      process.env.DATABASE_URL ||
      "postgresql://mydeenmarket:mydeenmarket@localhost:5433/mydeenmarket?schema=public",
  });
  const prisma = new PrismaClient({ adapter });

  const categories = await prisma.category.findMany({ select: { slug: true, name: true } });
  const categoryMap = new Map(categories.map(c => [c.slug, c.name]));

  let imported = 0;
  let skipped = 0;

  for (const raw of results) {
    const p = raw as Record<string, unknown>;
    const catName = categoryMap.get(p.categorySlug as string);
    if (!catName) {
      skipped++;
      continue;
    }

    await prisma.product.upsert({
      where: { slug: p.slug as string },
      update: {
        name:          p.name as string,
        author:        p.author as string,
        vendor:        (p.vendor as string) || "DARUSSALAM",
        price:         p.price as number,
        compareAtPrice:p.compareAtPrice as number | undefined,
        rating:        5,
        reviewCount:   0,
        category:      catName,
        categorySlug:  p.categorySlug as string,
        description:   p.description as string,
        features:      "[]",
        language:      p.language as string,
        inStock:       (p.inStock as boolean) ?? true,
        stockQty:      0,
        gradient:      p.gradient as string,
        icon:          "book",
        imageUrl:      (p.imageUrl as string) || null,
      },
      create: {
        slug:          p.slug as string,
        name:          p.name as string,
        author:        p.author as string,
        vendor:        (p.vendor as string) || "DARUSSALAM",
        price:         p.price as number,
        compareAtPrice:p.compareAtPrice as number | undefined,
        rating:        5,
        reviewCount:   0,
        category:      catName,
        categorySlug:  p.categorySlug as string,
        description:   p.description as string,
        features:      "[]",
        language:      p.language as string,
        inStock:       (p.inStock as boolean) ?? true,
        stockQty:      0,
        gradient:      p.gradient as string,
        icon:          "book",
        imageUrl:      (p.imageUrl as string) || null,
      },
    });
    imported++;
    if (imported % 50 === 0) process.stdout.write(`  ${imported} imported...\n`);
  }

  // Rebuild category counts
  for (const c of categories) {
    const count = await prisma.product.count({ where: { categorySlug: c.slug } });
    await prisma.category.update({ where: { slug: c.slug }, data: { count } });
  }

  await prisma.$disconnect();

  console.log(`\n✅ Import complete: ${imported} products imported, ${skipped} skipped (unknown category).`);
}

main().catch(err => {
  console.error("\n❌ Error:", err);
  process.exit(1);
});
