import fs from "node:fs";
import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client.js";

type ImportProduct = {
  slug: string;
  name: string;
  nameUrdu?: string;
  author: string;
  vendor?: string;
  price: number;
  compareAtPrice?: number;
  rating?: number;
  reviewCount?: number;
  categorySlug: string;
  badge?: string;
  description: string;
  features?: string[];
  language: string;
  pages?: number;
  isbn?: string;
  weight?: string;
  dimensions?: string;
  inStock?: boolean;
  gradient?: string;
  icon?: string;
};

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

function getInputPath() {
  return process.argv[2]
    ? path.resolve(process.cwd(), process.argv[2])
    : path.resolve(process.cwd(), "prisma/products.import.json");
}

function loadProducts(filePath: string): ImportProduct[] {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `Import file not found at ${filePath}. Copy prisma/products.template.json to prisma/products.import.json and edit it.`
    );
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw) as ImportProduct[];

  if (!Array.isArray(parsed)) {
    throw new Error("Import file must contain a JSON array of products.");
  }

  return parsed;
}

async function main() {
  const inputPath = getInputPath();
  const products = loadProducts(inputPath);

  if (products.length === 0) {
    console.log("No products found in import file. Nothing to import.");
    return;
  }

  const categories = await prisma.category.findMany({
    select: { slug: true, name: true },
  });
  const categoryMap = new Map(categories.map((c) => [c.slug, c.name]));

  let imported = 0;
  for (const p of products) {
    const categoryName = categoryMap.get(p.categorySlug);
    if (!categoryName) {
      throw new Error(
        `Unknown categorySlug '${p.categorySlug}' for product '${p.slug}'. Create category first.`
      );
    }

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        slug: p.slug,
        name: p.name,
        nameUrdu: p.nameUrdu,
        author: p.author,
        vendor: p.vendor ?? "DARUSSALAM",
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        rating: p.rating ?? 5,
        reviewCount: p.reviewCount ?? 0,
        category: categoryName,
        categorySlug: p.categorySlug,
        badge: p.badge,
        description: p.description,
        features: JSON.stringify(p.features ?? []),
        language: p.language,
        pages: p.pages,
        isbn: p.isbn,
        weight: p.weight,
        dimensions: p.dimensions,
        inStock: p.inStock ?? true,
        gradient: p.gradient ?? "from-emerald-200 to-emerald-400",
        icon: p.icon ?? "book",
      },
      create: {
        slug: p.slug,
        name: p.name,
        nameUrdu: p.nameUrdu,
        author: p.author,
        vendor: p.vendor ?? "DARUSSALAM",
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        rating: p.rating ?? 5,
        reviewCount: p.reviewCount ?? 0,
        category: categoryName,
        categorySlug: p.categorySlug,
        badge: p.badge,
        description: p.description,
        features: JSON.stringify(p.features ?? []),
        language: p.language,
        pages: p.pages,
        isbn: p.isbn,
        weight: p.weight,
        dimensions: p.dimensions,
        inStock: p.inStock ?? true,
        gradient: p.gradient ?? "from-emerald-200 to-emerald-400",
        icon: p.icon ?? "book",
      },
    });

    imported += 1;
  }

  // Rebuild category product counts.
  for (const c of categories) {
    const count = await prisma.product.count({ where: { categorySlug: c.slug } });
    await prisma.category.update({ where: { slug: c.slug }, data: { count } });
  }

  console.log(`Imported/updated ${imported} products from ${inputPath}.`);
}

main()
  .catch((err) => {
    console.error("Product import failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
