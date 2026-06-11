import { getProducts } from "@/lib/data";
import AdminProductsClient from "./AdminProductsClient";

export default async function AdminProductsPage() {
  const products = await getProducts();
  return <AdminProductsClient products={products} />;
}
