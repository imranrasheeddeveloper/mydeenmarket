import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
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
