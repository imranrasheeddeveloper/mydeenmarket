"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { formatPrice, siteConfig } from "@/lib/data-types";

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    notes: "",
  });

  useEffect(() => {
    setMounted(true);
    try {
      setItems(JSON.parse(localStorage.getItem("cart") || "[]"));
    } catch {
      setItems([]);
    }
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal >= siteConfig.freeShippingThreshold ? 0 : 200;
  const total = subtotal + shipping;

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, items }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to place order");
        setLoading(false);
        return;
      }

      // Clear cart
      localStorage.setItem("cart", JSON.stringify([]));
      window.dispatchEvent(new Event("cart-updated"));

      setOrderNumber(data.orderNumber);
      setGeneratedPassword(data.generatedPassword || "");

      // Auto sign-in the user
      if (data.generatedPassword) {
        await signIn("credentials", {
          email: form.email,
          password: data.generatedPassword,
          redirect: false,
        });
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-700 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h1>
          <p className="text-gray-600 mb-2">
            JazakAllah Khair for your order.
          </p>
          <p className="text-sm font-medium text-emerald-700 mb-4">
            Order #: {orderNumber}
          </p>
          {generatedPassword && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 text-left">
              <p className="text-sm font-bold text-amber-800 mb-1">Your Account Has Been Created!</p>
              <p className="text-sm text-amber-700 mb-2">You can track your orders by logging in:</p>
              <p className="text-sm text-gray-700"><strong>Email:</strong> {form.email}</p>
              <p className="text-sm text-gray-700"><strong>Password:</strong> {generatedPassword}</p>
              <p className="text-xs text-amber-600 mt-2">Please save your password. You can change it later from your account page.</p>
            </div>
          )}
          <div className="flex gap-3">
            <Link
              href="/account"
              className="flex-1 px-4 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors text-sm"
            >
              My Orders
            </Link>
            <Link
              href="/"
              className="flex-1 px-4 py-3 border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-50 font-bold rounded-lg transition-colors text-sm"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some items to your cart before checking out.</p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#0A3D2E] py-6">
        <div className="max-w-6xl mx-auto px-4">
          <Link href="/" className="text-[#C5A44E] font-bold text-xl">
            MyDeenMarket
          </Link>
          <h1 className="text-white text-2xl font-bold mt-2">Checkout</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    id="address"
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      id="city"
                      type="text"
                      required
                      value={form.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      Province *
                    </label>
                    <select
                      id="state"
                      required
                      value={form.state}
                      onChange={(e) => updateField("state", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
                    >
                      <option value="">Select</option>
                      <option value="Punjab">Punjab</option>
                      <option value="Sindh">Sindh</option>
                      <option value="KPK">KPK</option>
                      <option value="Balochistan">Balochistan</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="AJK">AJK</option>
                      <option value="GB">Gilgit-Baltistan</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      id="zip"
                      type="text"
                      value={form.zip}
                      onChange={(e) => updateField("zip", e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                    Order Notes (optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => updateField("notes", e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                    placeholder="Special instructions for delivery..."
                  />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Payment Method</h2>
              <div className="flex items-center gap-3 p-4 border-2 border-emerald-600 rounded-lg bg-emerald-50">
                <input type="radio" checked readOnly className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="font-medium text-gray-900">Cash on Delivery (COD)</p>
                  <p className="text-sm text-gray-500">Pay when you receive your order</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              <ul className="space-y-3 mb-4">
                {items.map((item) => (
                  <li key={item.id} className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900 shrink-0">
                      {formatPrice(item.price * item.qty)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-medium" : "text-gray-900"}>
                    {shipping === 0 ? "FREE" : formatPrice(shipping)}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-emerald-700">
                    Free shipping on orders over {formatPrice(siteConfig.freeShippingThreshold)}
                  </p>
                )}
                <div className="flex justify-between text-lg font-bold border-t pt-3">
                  <span className="text-gray-900">Total</span>
                  <span className="text-emerald-700">{formatPrice(total)}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-3.5 bg-[#C5A44E] hover:bg-[#A08839] disabled:opacity-60 disabled:cursor-not-allowed text-[#0A3D2E] font-bold rounded-lg transition-colors uppercase tracking-wide text-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Placing Order...
                  </span>
                ) : (
                  <>Place Order — {formatPrice(total)}</>
                )}
              </button>
              {error && (
                <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
              )}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
