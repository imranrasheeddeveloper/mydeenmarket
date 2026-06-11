// ============================================
// ADMIN DATA — Orders, Customers, Analytics
// Queries from Prisma/SQLite Database
// ============================================

import "server-only";
import { prisma } from "./prisma";
import type { Order, Customer } from "./admin-data-types";

export type { Order, OrderItem, Customer } from "./admin-data-types";

export async function getOrders(): Promise<Order[]> {
  const rows = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    customerName: o.customerName,
    customerEmail: o.customerEmail,
    items: o.items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
    total: o.total,
    status: o.status,
    paymentStatus: o.paymentStatus,
    createdAt: o.createdAt.toISOString(),
    shippingAddress: o.shippingAddress,
  }));
}

export async function getCustomers(): Promise<Customer[]> {
  const rows = await prisma.customer.findMany({
    orderBy: { name: "asc" },
  });
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    totalOrders: c.totalOrders,
    totalSpent: c.totalSpent,
    joinedAt: c.joinedAt.toISOString().split("T")[0],
    lastOrderAt: c.lastOrderAt
      ? c.lastOrderAt.toISOString().split("T")[0]
      : null,
  }));
}

export async function getRevenueStats() {
  const orders = await prisma.order.findMany();
  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const totalRevenue = paidOrders.reduce((s, o) => s + o.total, 0);
  const totalOrders = orders.length;
  const avgOrderValue =
    paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0;

  return {
    totalRevenue,
    totalOrders,
    avgOrderValue,
    pendingOrders: orders.filter((o) => o.status === "pending").length,
    processingOrders: orders.filter((o) => o.status === "processing").length,
    shippedOrders: orders.filter((o) => o.status === "shipped").length,
    deliveredOrders: orders.filter((o) => o.status === "delivered").length,
    cancelledOrders: orders.filter((o) => o.status === "cancelled").length,
  };
}

export async function getMonthlyRevenue() {
  return prisma.monthlyRevenue.findMany({ orderBy: { id: "asc" } });
}

export async function getTopProducts() {
  return prisma.topProduct.findMany({ orderBy: { sold: "desc" } });
}
