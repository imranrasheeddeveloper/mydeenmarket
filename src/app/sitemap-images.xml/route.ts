import { prisma } from "@/lib/prisma";

const BASE_URL = "https://mydeenmarket.com";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toAbsoluteUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function GET() {
  const products = await prisma.product
    .findMany({
      select: {
        slug: true,
        name: true,
        imageUrl: true,
        images: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    })
    .catch(() => []);

  const urlsXml = products
    .map((product) => {
      const parsedImages = (() => {
        try {
          const parsed = JSON.parse(product.images) as string[];
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      })();

      const uniqueImages = Array.from(
        new Set([
          ...(product.imageUrl ? [product.imageUrl] : []),
          ...parsedImages,
        ])
      ).slice(0, 10);

      if (uniqueImages.length === 0) {
        return "";
      }

      const imageXml = uniqueImages
        .map(
          (img) => `\n    <image:image>\n      <image:loc>${escapeXml(toAbsoluteUrl(img))}</image:loc>\n      <image:title>${escapeXml(product.name)}</image:title>\n    </image:image>`
        )
        .join("");

      return `\n  <url>\n    <loc>${BASE_URL}/product/${escapeXml(product.slug)}</loc>\n    <lastmod>${product.createdAt.toISOString()}</lastmod>${imageXml}\n  </url>`;
    })
    .filter(Boolean)
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset\n  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n>${urlsXml}\n</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
