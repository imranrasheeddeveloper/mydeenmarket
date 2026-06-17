import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://mydeenmarket:mydeenmarket@localhost:5433/mydeenmarket?schema=public",
});
const prisma = new PrismaClient({ adapter });

function toFeatureBullets(description: string, limit = 4): string[] {
  const clean = description.replace(/\s+/g, " ").trim();
  if (!clean) return [];

  const sentenceParts = clean
    .split(/(?<=[.!?])\s+|\s*;\s*/)
    .map((s) => s.replace(/["“”]+/g, "").trim())
    .filter((s) => s.length >= 20 && s.length <= 140);

  const picked: string[] = [];
  for (const part of sentenceParts) {
    const normalized = part.replace(/[.!?]+$/, "").trim();
    if (!normalized) continue;
    if (picked.some((x) => x.toLowerCase() === normalized.toLowerCase())) continue;
    picked.push(normalized);
    if (picked.length >= limit) break;
  }

  if (picked.length > 0) return picked;

  const words = clean.split(" ").filter(Boolean);
  if (words.length >= 10) {
    return [
      words.slice(0, 8).join(" "),
      words.slice(8, 16).join(" "),
      "Carefully selected for practical everyday use",
      "Quality checked by MyDeenMarket team",
    ].filter(Boolean);
  }

  return [
    "Carefully selected for practical everyday use",
    "Suitable for personal learning and gifting",
    "Quality checked by MyDeenMarket team",
  ];
}

function isFeatureListEmpty(raw: string | null | undefined): boolean {
  if (!raw) return true;
  try {
    const parsed = JSON.parse(raw);
    return !Array.isArray(parsed) || parsed.filter((x) => String(x).trim().length > 0).length === 0;
  } catch {
    return true;
  }
}

async function main() {
  console.log("Updating all product stock to 50 and filling empty features...");

  const stockUpdate = await prisma.product.updateMany({
    data: { stockQty: 50, inStock: true },
  });

  const rows = await prisma.product.findMany({
    select: { id: true, name: true, description: true, features: true },
  });

  let featuresUpdated = 0;
  for (const row of rows) {
    if (!isFeatureListEmpty(row.features)) continue;

    const bullets = toFeatureBullets(row.description || "");
    if (bullets.length === 0) continue;

    await prisma.product.update({
      where: { id: row.id },
      data: { features: JSON.stringify(bullets) },
    });
    featuresUpdated += 1;
  }

  console.log(`Stock updated for ${stockUpdate.count} products.`);
  console.log(`Features auto-filled for ${featuresUpdated} products.`);
}

main()
  .catch((err) => {
    console.error("Failed to update stock/features:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
