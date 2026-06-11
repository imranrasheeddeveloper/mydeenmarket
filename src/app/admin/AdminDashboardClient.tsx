"use client";

import { formatPrice } from "@/lib/data-types";
import Link from "next/link";
import type { Order } from "@/lib/admin-data-types";

function StatsCard({ title, value, subtitle, icon, color }: {
  title: string; value: string; subtitle: string; icon: string; color: string;
}) {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-700",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
    rose: "bg-rose-100 text-rose-700",
  };
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
          </svg>
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
      <p className="text-xs text-emerald-600 font-medium mt-2">{subtitle}</p>
    </div>
  );
}

interface Props {
  stats: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
  };
  monthly: { month: string; revenue: number }[];
  topProducts: { name: string; sold: number; revenue: number }[];
  recentOrders: Order[];
}

export default function AdminDashboardClient({ stats, monthly, topProducts, recentOrders }: Props) {
  const maxRevenue = Math.max(...monthly.map((m) => m.revenue));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your store performance</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Revenue"
          value={formatPrice(stats.totalRevenue)}
          subtitle="+12.5% from last month"
          icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          color="emerald"
        />
        <StatsCard
          title="Total Orders"
          value={String(stats.totalOrders)}
          subtitle="+8 new this week"
          icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          color="blue"
        />
        <StatsCard
          title="Avg. Order Value"
          value={formatPrice(Math.round(stats.avgOrderValue))}
          subtitle="+5.2% from last month"
          icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          color="amber"
        />
        <StatsCard
          title="Pending Orders"
          value={String(stats.pendingOrders)}
          subtitle={`${stats.processingOrders} processing`}
          icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-gray-900">Revenue Overview</h2>
              <p className="text-sm text-gray-500">Monthly revenue for 2026</p>
            </div>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
              +18.2% YoY
            </span>
          </div>
          <div className="flex items-end gap-3 h-48">
            {monthly.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">
                  {formatPrice(m.revenue / 1000)}k
                </span>
                <div
                  className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-md transition-all hover:from-emerald-700 hover:to-emerald-500 cursor-pointer"
                  style={{ height: `${(m.revenue / maxRevenue) * 140}px` }}
                  title={`${m.month}: ${formatPrice(m.revenue)}`}
                />
                <span className="text-xs text-gray-400">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-bold text-gray-900 mb-6">Order Status</h2>
          <div className="space-y-4">
            {[
              { label: "Delivered", value: stats.deliveredOrders, color: "bg-emerald-500", total: stats.totalOrders },
              { label: "Shipped", value: stats.shippedOrders, color: "bg-blue-500", total: stats.totalOrders },
              { label: "Processing", value: stats.processingOrders, color: "bg-amber-500", total: stats.totalOrders },
              { label: "Pending", value: stats.pendingOrders, color: "bg-orange-500", total: stats.totalOrders },
              { label: "Cancelled", value: stats.cancelledOrders, color: "bg-red-500", total: stats.totalOrders },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-gray-600">{s.label}</span>
                  <span className="font-medium text-gray-900">{s.value}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${s.color} rounded-full transition-all`}
                    style={{ width: `${(s.value / s.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-emerald-700 font-medium hover:underline">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const statusColors: Record<string, string> = {
                pending: "bg-orange-50 text-orange-700",
                processing: "bg-amber-50 text-amber-700",
                shipped: "bg-blue-50 text-blue-700",
                delivered: "bg-emerald-50 text-emerald-700",
                cancelled: "bg-red-50 text-red-700",
              };
              return (
                <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                      {order.customerName.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">{order.customerName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{formatPrice(order.total)}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Top Products</h2>
            <Link href="/admin/products" className="text-sm text-emerald-700 font-medium hover:underline">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {topProducts.map((product, i) => (
              <div key={product.name} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-md bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                    #{i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.sold} sold</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-gray-900">{formatPrice(product.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
