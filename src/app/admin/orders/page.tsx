import { getOrders } from "@/lib/admin-data";
import AdminOrdersClient from "./AdminOrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getOrders();
  return <AdminOrdersClient orders={orders} />;
}
