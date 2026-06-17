import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ||
    "postgresql://mydeenmarket:mydeenmarket@localhost:5433/mydeenmarket?schema=public",
});
const prisma = new PrismaClient({ adapter });

function hasConfirmFlag() {
  return process.argv.includes("--yes-clear-products");
}

async function main() {
  if (!hasConfirmFlag()) {
    console.error(
      "Refusing to clear products without explicit confirmation."
    );
    console.error(
      "Run: npm run db:clear:products -- --yes-clear-products"
    );
    process.exitCode = 1;
    return;
  }

  console.log("Clearing catalog products...");

  // Keep historical orders by detaching product references first.
  const detached = await prisma.orderItem.updateMany({
    where: { productId: { not: null } },
    data: { productId: null },
  });

  const deletedProducts = await prisma.product.deleteMany({});

  // Keep category metadata but reset counts until fresh import repopulates.
  await prisma.category.updateMany({ data: { count: 0 } });

  console.log(`Detached ${detached.count} order items from products.`);
  console.log(`Deleted ${deletedProducts.count} products.`);
  console.log("Category counts reset to 0.");
}

main()
  .catch((err) => {
    console.error("Failed to clear products:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
