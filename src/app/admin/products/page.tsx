import { getCategories, getProducts } from "@/lib/data";
import AdminProductsClient from "./AdminProductsClient";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return <AdminProductsClient products={products} categories={categories} />;
}
