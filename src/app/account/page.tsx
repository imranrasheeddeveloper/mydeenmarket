"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/data-types";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface UserOrder {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus: string;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/orders")
        .then((r) => r.json())
        .then((data) => { if (Array.isArray(data)) setOrders(data); })
        .catch(() => {})
        .finally(() => setLoadingOrders(false));
    }
  }, [status]);

  const statusSteps = ["pending", "processing", "shipped", "delivered"];
  const statusLabels: Record<string, string> = {
    pending: "Order Placed",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
  };
  const statusColors: Record<string, string> = {
    pending: "bg-orange-50 text-orange-700 border-orange-200",
    processing: "bg-amber-50 text-amber-700 border-amber-200",
    shipped: "bg-blue-50 text-blue-700 border-blue-200",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              {session.user.image ? (
                <img src={session.user.image} alt={`${session.user.name || "User"} profile picture`} className="w-20 h-20 rounded-full object-cover" width={80} height={80} />
              ) : (
                <span className="text-3xl font-bold text-emerald-700">
                  {session.user.name?.[0]?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <h2 className="font-bold text-gray-900">{session.user.name}</h2>
            <p className="text-sm text-gray-500">{session.user.email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium capitalize">
              {session.user.role || "customer"}
            </span>

            {session.user.role === "admin" && (
              <Link
                href="/admin"
                className="mt-4 w-full block py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors text-center"
              >
                Admin Dashboard
              </Link>
            )}

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="mt-3 w-full py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">My Orders</h2>
            {loadingOrders ? (
              <div className="flex justify-center py-8">
                <div className="w-6 h-6 border-2 border-emerald-200 border-t-emerald-700 rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-gray-500 text-sm">No orders yet</p>
                <Link href="/collections" className="inline-block mt-3 text-sm text-emerald-700 font-medium hover:underline">
                  Start Shopping →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const currentStep = order.status === "cancelled" ? -1 : statusSteps.indexOf(order.status);
                  const isExpanded = expandedOrder === order.id;
                  return (
                    <div key={order.id} className="border border-gray-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-emerald-700">{order.orderNumber}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[order.status]}`}>
                              {statusLabels[order.status] || order.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString("en-PK", { month: "short", day: "numeric", year: "numeric" })}
                            {" · "}{order.items.length} item(s) · {formatPrice(order.total)}
                          </p>
                        </div>
                        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isExpanded && (
                        <div className="border-t border-gray-100 p-4 space-y-4">
                          {/* Progress tracker */}
                          {order.status !== "cancelled" ? (
                            <div className="flex items-center justify-between">
                              {statusSteps.map((step, i) => (
                                <div key={step} className="flex items-center flex-1 last:flex-initial">
                                  <div className="flex flex-col items-center">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                      i <= currentStep ? "bg-emerald-600 text-white" : "bg-gray-100 text-gray-400"
                                    }`}>
                                      {i <= currentStep ? "✓" : i + 1}
                                    </div>
                                    <span className={`text-[10px] mt-1 ${i <= currentStep ? "text-emerald-700 font-medium" : "text-gray-400"}`}>
                                      {statusLabels[step]}
                                    </span>
                                  </div>
                                  {i < statusSteps.length - 1 && (
                                    <div className={`flex-1 h-0.5 mx-1 ${i < currentStep ? "bg-emerald-600" : "bg-gray-200"}`} />
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-red-600 font-medium">This order has been cancelled.</p>
                          )}

                          {/* Items */}
                          <div className="space-y-2">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex justify-between text-sm p-2 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium text-gray-900">{item.name}</p>
                                  <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                </div>
                                <p className="font-bold text-gray-900">{formatPrice(item.price * item.qty)}</p>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between text-sm pt-2 border-t border-gray-100">
                            <span className="font-bold text-gray-900">Total</span>
                            <span className="font-bold text-gray-900">{formatPrice(order.total)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Saved Addresses */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Saved Addresses</h2>
              <button className="text-sm text-emerald-700 font-medium hover:underline">
                + Add Address
              </button>
            </div>
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No addresses saved</p>
            </div>
          </div>

          {/* Wishlist */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Wishlist</h2>
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">Your wishlist is empty</p>
              <Link href="/collections" className="inline-block mt-3 text-sm text-emerald-700 font-medium hover:underline">
                Browse Products →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
