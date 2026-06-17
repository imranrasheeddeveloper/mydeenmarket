import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://mydeenmarket.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, collections] = await Promise.all([
    prisma.product
      .findMany({
        select: { slug: true, categorySlug: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      })
      .catch(() => []),
    prisma.category.findMany({ select: { slug: true } }).catch(() => []),
    prisma.collection.findMany({ select: { slug: true } }).catch(() => []),
  ]);

  const now = new Date();
  const categoryLastModified = new Map<string, Date>();
  for (const product of products) {
    const existing = categoryLastModified.get(product.categorySlug);
    if (!existing || product.createdAt > existing) {
      categoryLastModified.set(product.categorySlug, product.createdAt);
    }
  }

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/collections`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/policies/privacy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/policies/terms`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/policies/shipping`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/collections/${cat.slug}`,
    lastModified: categoryLastModified.get(cat.slug) || now,
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  const collectionPages: MetadataRoute.Sitemap = collections.map((col) => ({
    url: `${BASE_URL}/collections/${col.slug}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    lastModified: product.createdAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...collectionPages, ...productPages];
}
