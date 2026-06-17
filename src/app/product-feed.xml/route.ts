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
  const products = await prisma.product.findMany({
    select: {
      slug: true,
      name: true,
      description: true,
      price: true,
      inStock: true,
      imageUrl: true,
      images: true,
      vendor: true,
      category: true,
    },
    orderBy: { name: "asc" },
  });

  const itemXml = products
    .map((product) => {
      const parsedImages = (() => {
        try {
          const parsed = JSON.parse(product.images) as string[];
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      })();

      const primaryImage = product.imageUrl || parsedImages[0] || "/og-image.jpg";

      const title = escapeXml(product.name);
      const description = escapeXml(product.description.slice(0, 5000));
      const link = `${BASE_URL}/product/${escapeXml(product.slug)}`;
      const imageLink = escapeXml(toAbsoluteUrl(primaryImage));
      const availability = product.inStock ? "in stock" : "out of stock";
      const price = `${product.price} PKR`;
      const brand = escapeXml(product.vendor || "MyDeenMarket");
      const productType = escapeXml(product.category || "Islamic Products");

      return `\n  <item>\n    <g:id>${escapeXml(product.slug)}</g:id>\n    <title>${title}</title>\n    <description>${description}</description>\n    <link>${link}</link>\n    <g:image_link>${imageLink}</g:image_link>\n    <g:availability>${availability}</g:availability>\n    <g:price>${price}</g:price>\n    <g:brand>${brand}</g:brand>\n    <g:condition>new</g:condition>\n    <g:product_type>${productType}</g:product_type>\n  </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">\n<channel>\n  <title>MyDeenMarket Product Feed</title>\n  <link>${BASE_URL}</link>\n  <description>Product feed for MyDeenMarket catalog.</description>${itemXml}\n</channel>\n</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
