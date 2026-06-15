import { getRevenueStats, getMonthlyRevenue, getTopProducts, getOrders } from "@/lib/admin-data";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [stats, monthly, topProducts, orders] = await Promise.all([
    getRevenueStats(),
    getMonthlyRevenue(),
    getTopProducts(),
    getOrders(),
  ]);

  return (
    <AdminDashboardClient
      stats={stats}
      monthly={monthly}
      topProducts={topProducts}
      recentOrders={orders.slice(0, 5)}
    />
  );
}
