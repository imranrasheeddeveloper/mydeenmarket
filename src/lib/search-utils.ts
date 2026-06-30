import Fuse from "fuse.js";
import type { Product } from "./data-types";

export type SearchableProduct = Pick<
  Product,
  "id" | "slug" | "name" | "author" | "category" | "categorySlug" | "vendor" | "description" | "features" | "nameUrdu" | "language" | "isbn" | "badge"
>;

/**
 * Free Algolia-like search using Fuse.js
 * - typo tolerant fuzzy matching
 * - weighted keys for relevance ranking
 * - supports multi-term queries
 */
export function searchProducts(
  query: string,
  products: SearchableProduct[],
  limit?: number
): SearchableProduct[] {
  const cleanedQuery = query.trim();
  if (!cleanedQuery) return [];

  const fuse = new Fuse(products, {
    includeScore: true,
    ignoreLocation: true,
    shouldSort: true,
    threshold: 0.35,
    minMatchCharLength: 2,
    keys: [
      { name: "name", weight: 0.38 },
      { name: "slug", weight: 0.2 },
      { name: "author", weight: 0.14 },
      { name: "category", weight: 0.12 },
      { name: "categorySlug", weight: 0.08 },
      { name: "vendor", weight: 0.05 },
      { name: "features", weight: 0.02 },
      { name: "description", weight: 0.01 },
    ],
  });

  const terms = cleanedQuery
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const seen = new Set<string>();
  const ranked: SearchableProduct[] = [];

  // Search full query first for best phrase relevance.
  for (const result of fuse.search(cleanedQuery)) {
    if (!seen.has(result.item.id)) {
      seen.add(result.item.id);
      ranked.push(result.item);
    }
  }

  // Backfill with per-term fuzzy matches to improve typo tolerance.
  for (const term of terms) {
    for (const result of fuse.search(term)) {
      if (!seen.has(result.item.id)) {
        seen.add(result.item.id);
        ranked.push(result.item);
      }
    }
  }

  return typeof limit === "number" ? ranked.slice(0, limit) : ranked;
}
