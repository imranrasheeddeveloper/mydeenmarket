"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/data-types";

interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
}

export default function CartDrawer() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);

  const loadCart = useCallback(() => {
    try {
      setItems(JSON.parse(localStorage.getItem("cart") || "[]"));
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    const toggle = () => { setOpen((o) => !o); loadCart(); };
    const update = () => loadCart();
    window.addEventListener("toggle-cart", toggle);
    window.addEventListener("cart-updated", update);
    return () => {
      window.removeEventListener("toggle-cart", toggle);
      window.removeEventListener("cart-updated", update);
    };
  }, [loadCart]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const updateQty = (id: string, delta: number) => {
    const cart = items.map((item) =>
      item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
    ).filter((item) => item.qty > 0);
    setItems(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const removeItem = (id: string) => {
    const cart = items.filter((item) => item.id !== id);
    setItems(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <aside className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl flex flex-col" aria-label="Shopping cart">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
          <button onClick={() => setOpen(false)} className="p-2 text-gray-500 hover:text-gray-700" aria-label="Close cart">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <svg className="w-16 h-16 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p className="text-gray-500">Your cart is empty</p>
              <button
                onClick={() => setOpen(false)}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-16 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-md flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                    <p className="text-sm text-emerald-700 font-bold mt-1">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="text-sm font-medium w-6 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="w-7 h-7 rounded border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                        aria-label={`Remove ${item.name}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-6 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-xl font-bold text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-gray-500">Shipping calculated at checkout</p>
            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="block w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-center font-bold rounded-lg transition-colors uppercase tracking-wide"
            >
              Checkout
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
