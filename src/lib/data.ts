// ============================================
// DATA LAYER - Server-only Prisma queries
// ============================================

import "server-only";
import { prisma } from "./prisma";
import type { Product, Category, Collection, ProductReview } from "./data-types";

// Re-export types and utilities for convenience
export type { Product, Category, Collection, ProductReview } from "./data-types";
export { siteConfig, formatPrice } from "./data-types";

let reviewTableReady = false;

async function ensureReviewsTable() {
  if (reviewTableReady) return;

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS ProductReview (
      id TEXT PRIMARY KEY,
      productId TEXT NOT NULL,
      customerName TEXT NOT NULL,
      customerEmail TEXT,
      rating INTEGER NOT NULL,
      comment TEXT NOT NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (productId) REFERENCES Product(id) ON DELETE CASCADE
    )
  `);

  await prisma.$executeRawUnsafe(
    `CREATE INDEX IF NOT EXISTS ProductReview_productId_createdAt_idx ON ProductReview (productId, createdAt DESC)`
  );

  reviewTableReady = true;
}

// Map DB product row to Product interface (parse features JSON)
function mapProduct(row: {
  id: string;
  slug: string;
  name: string;
  nameUrdu: string | null;
  author: string;
  vendor: string;
  price: number;
  compareAtPrice: number | null;
  rating: number;
  reviewCount: number;
  category: string;
  categorySlug: string;
  badge: string | null;
  description: string;
  features: string;
  language: string;
  pages: number | null;
  isbn: string | null;
  weight: string | null;
  dimensions: string | null;
  imageUrl: string | null;
  inStock: boolean;
  gradient: string;
  icon: string;
}): Product {
  return {
    ...row,
    features: JSON.parse(row.features),
  };
}

// ─── Site Config ───

export async function getSiteConfig() {
  const config = await prisma.siteConfig.findFirst();
  if (!config) {
    return {
      name: "MyDeenMarket",
      title: "MyDeenMarket - Islamic Books, Quran, Hadith & More",
      description: "Pakistan's leading Islamic bookstore.",
      url: "https://mydeenmarket.com",
      ogImage: "/og-image.jpg",
      address: "",
      email: "",
      phone: "",
      hours: "",
      social: { facebook: "", instagram: "", youtube: "" },
      freeShippingThreshold: 5000,
    };
  }
  return {
    name: config.name,
    title: config.title,
    description: config.description,
    url: config.url,
    ogImage: "/og-image.jpg",
    address: config.address,
    email: config.email,
    phone: config.phone,
    hours: config.hours,
    social: {
      facebook: config.socialFacebook || "",
      instagram: config.socialInstagram || "",
      youtube: config.socialYoutube || "",
    },
    freeShippingThreshold: config.freeShippingThreshold,
  };
}

// ─── Categories ───

export async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  return prisma.category.findUnique({ where: { slug } });
}

// ─── Collections ───

export async function getCollections(): Promise<Collection[]> {
  return prisma.collection.findMany();
}

// ─── Products ───

export async function getProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ orderBy: { name: "asc" } });
  return rows.map(mapProduct);
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const row = await prisma.product.findUnique({ where: { slug } });
  return row ? mapProduct(row) : null;
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { categorySlug },
    orderBy: { name: "asc" },
  });
  return rows.map(mapProduct);
}

export async function getBestSellers(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { badge: "bestseller" },
  });
  return rows.map(mapProduct);
}

export async function getNewArrivals(): Promise<Product[]> {
  const rows = await prisma.product.findMany({ where: { badge: "new" } });
  return rows.map(mapProduct);
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.toLowerCase();
  const rows = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: q } },
        { author: { contains: q } },
        { category: { contains: q } },
        { description: { contains: q } },
      ],
    },
  });
  return rows.map(mapProduct);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const rows = await prisma.product.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const rows = await prisma.category.findMany({ select: { slug: true } });
  return rows.map((r) => r.slug);
}

export async function getProductReviews(
  productId: string,
  limit = 20
): Promise<ProductReview[]> {
  await ensureReviewsTable();

  const rows = await prisma.$queryRawUnsafe<
    Array<{
      id: string;
      productId: string;
      customerName: string;
      customerEmail: string | null;
      rating: number;
      comment: string;
      createdAt: string;
    }>
  >(
    `SELECT id, productId, customerName, customerEmail, rating, comment, createdAt
     FROM ProductReview
     WHERE productId = ?
     ORDER BY datetime(createdAt) DESC
     LIMIT ?`,
    productId,
    limit
  );

  return rows.map((row) => ({
    ...row,
    createdAt: new Date(row.createdAt).toISOString(),
  }));
}
