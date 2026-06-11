"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@/lib/admin-data-types";
import { formatPrice } from "@/lib/data-types";

export default function AdminOrdersClient({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState("");
  const [updatePayment, setUpdatePayment] = useState("");
  const [updating, setUpdating] = useState(false);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusColors: Record<string, string> = {
    pending: "bg-orange-50 text-orange-700 border-orange-200",
    processing: "bg-amber-50 text-amber-700 border-amber-200",
    shipped: "bg-blue-50 text-blue-700 border-blue-200",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  const paymentColors: Record<string, string> = {
    paid: "bg-emerald-50 text-emerald-700",
    unpaid: "bg-orange-50 text-orange-700",
    refunded: "bg-gray-100 text-gray-600",
  };

  const detail = selectedOrder ? orders.find((o) => o.id === selectedOrder) : null;

  const handleSelectOrder = (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (order) {
      setUpdateStatus(order.status);
      setUpdatePayment(order.paymentStatus);
    }
    setSelectedOrder(id);
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: selectedOrder, status: updateStatus, paymentStatus: updatePayment }),
      });
      if (res.ok) {
        setSelectedOrder(null);
        router.refresh();
      }
    } catch {
      // ignore
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">{orders.length} total orders</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "All Orders", value: orders.length, filter: "" },
          { label: "Pending", value: orders.filter((o) => o.status === "pending").length, filter: "pending" },
          { label: "Processing", value: orders.filter((o) => o.status === "processing").length, filter: "processing" },
          { label: "Shipped", value: orders.filter((o) => o.status === "shipped").length, filter: "shipped" },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => setStatusFilter(s.filter)}
            className={`p-3 rounded-xl border text-left transition-colors ${
              statusFilter === s.filter ? "border-emerald-300 bg-emerald-50" : "border-gray-100 bg-white hover:bg-gray-50"
            }`}
          >
            <p className="text-xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search by order number, customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-emerald-600"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Order</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Date</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Customer</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Total</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Payment</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-emerald-700">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.items.length} item(s)</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("en-PK", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.createdAt).toLocaleTimeString("en-PK", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.customerEmail}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-bold text-gray-900">{formatPrice(order.total)}</p>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${paymentColors[order.paymentStatus]}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleSelectOrder(order.id)}
                      className="p-2 text-gray-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                      title="View details"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No orders found</p>
          </div>
        )}
      </div>

      {detail && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{detail.orderNumber}</h2>
                <p className="text-xs text-gray-500">
                  {new Date(detail.createdAt).toLocaleString("en-PK")}
                </p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-gray-500 hover:text-gray-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[detail.status]}`}>
                  {detail.status}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${paymentColors[detail.paymentStatus]}`}>
                  {detail.paymentStatus}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">Customer</h3>
                <p className="text-sm text-gray-700">{detail.customerName}</p>
                <p className="text-sm text-gray-500">{detail.customerEmail}</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">Shipping Address</h3>
                <p className="text-sm text-gray-600">{detail.shippingAddress}</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">Items</h3>
                <div className="space-y-2">
                  {detail.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                      </div>
                      <p className="font-bold text-gray-900">{formatPrice(item.price * item.qty)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">{formatPrice(detail.total)}</span>
              </div>

              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-emerald-600"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <select
                    value={updatePayment}
                    onChange={(e) => setUpdatePayment(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-emerald-600"
                  >
                    <option value="unpaid">Unpaid</option>
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <button
                  onClick={handleUpdateOrder}
                  disabled={updating}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors self-end"
                >
                  {updating ? "Saving..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
