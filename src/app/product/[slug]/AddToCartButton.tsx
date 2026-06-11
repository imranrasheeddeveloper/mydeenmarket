"use client";

import type { Product } from "@/lib/data-types";
import { formatPrice } from "@/lib/data-types";
import { useState } from "react";

export default function AddToCartButton({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = cart.find((item: { id: string }) => item.id === product.id);
      if (existing) {
        existing.qty += qty;
      } else {
        cart.push({ id: product.id, name: product.name, price: product.price, qty });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
      window.dispatchEvent(new Event("toggle-cart"));
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch { /* ignore */ }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Quantity */}
      <div className="flex items-center border border-gray-200 rounded-lg">
        <button
          onClick={() => setQty(Math.max(1, qty - 1))}
          className="w-11 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-l-lg text-lg"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="w-12 h-12 flex items-center justify-center text-sm font-medium border-x border-gray-200">
          {qty}
        </span>
        <button
          onClick={() => setQty(qty + 1)}
          className="w-11 h-12 flex items-center justify-center text-gray-600 hover:bg-gray-50 rounded-r-lg text-lg"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Add to Cart */}
      <button
        onClick={addToCart}
        disabled={!product.inStock}
        className={`flex-1 py-3 px-8 rounded-lg text-sm font-bold uppercase tracking-wide transition-all ${
          added
            ? "bg-green-600 text-white"
            : product.inStock
            ? "bg-emerald-700 hover:bg-emerald-800 text-white"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
        aria-label={`Add ${product.name} to cart`}
      >
        {added ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Added!
          </span>
        ) : product.inStock ? (
          `Add to Cart — ${formatPrice(product.price * qty)}`
        ) : (
          "Out of Stock"
        )}
      </button>
    </div>
  );
}
