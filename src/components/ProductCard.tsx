"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/data-types";
import type { Product } from "@/lib/data-types";

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center" aria-label={`${rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-3.5 h-3.5 ${i < rating ? "text-amber-400" : "text-gray-200"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-gray-500">({count})</span>
    </div>
  );
}

const iconMap: Record<string, React.ReactNode> = {
  book: (
    <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  "book-quran": (
    <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  "book-open": (
    <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  children: (
    <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

const badgeStyles: Record<string, string> = {
  bestseller: "bg-gradient-to-r from-[#C5A44E] to-[#A08839] text-[#0A3D2E]",
  new: "bg-gradient-to-r from-[#0D503C] to-[#14785A] text-white",
  sale: "bg-gradient-to-r from-red-600 to-red-500 text-white",
};

const badgeLabels: Record<string, string> = {
  bestseller: "Best Seller",
  new: "New",
  sale: "Sale",
};

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existing = cart.find((item: { id: string }) => item.id === product.id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
      window.dispatchEvent(new Event("toggle-cart"));
    } catch { /* ignore */ }
  };

  return (
    <article className="group bg-white rounded-xl border border-gray-100 overflow-hidden product-card-hover islamic-glow-hover flex flex-col relative">
      {/* Subtle gold corner accent */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-px h-8 bg-gradient-to-b from-[#C5A44E]/30 to-transparent" />
        <div className="absolute top-0 right-0 h-px w-8 bg-gradient-to-l from-[#C5A44E]/30 to-transparent" />
      </div>
      
      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden">
        <div className={`w-full h-full bg-gradient-to-br ${product.gradient} flex flex-col items-center justify-center gap-3 p-6 group-hover:scale-105 transition-transform duration-500`}>
          {/* Islamic pattern overlay on card image */}
          <div className="absolute inset-0 islamic-stars opacity-40" />
          {iconMap[product.icon] || iconMap.book}
          <span className="text-sm font-semibold text-white/90 text-center leading-tight relative z-10">
            {product.name.length > 30 ? product.name.substring(0, 30) + "..." : product.name}
          </span>
        </div>
        {product.badge && (
          <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold shadow-md ${badgeStyles[product.badge]}`}>
            {badgeLabels[product.badge]}
          </span>
        )}
        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 bg-white/95 backdrop-blur-sm text-[#0A3D2E] px-5 py-2.5 rounded-full text-sm font-bold shadow-lg border border-[#C5A44E]/20">
            Quick View
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 bg-gradient-to-b from-white to-[#FEFCF6]">
        <span className="text-[10px] font-bold tracking-widest text-[#C5A44E] uppercase mb-1">
          {product.vendor}
        </span>
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug flex-1">
          <Link href={`/product/${product.slug}`} className="hover:text-[#0D503C] transition-colors">
            {product.name}
          </Link>
        </h3>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="mt-2 flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>
        <button
          onClick={addToCart}
          className="mt-3 w-full py-2.5 bg-gradient-to-r from-[#0D503C] to-[#14785A] hover:from-[#0A3D2E] hover:to-[#0D503C] text-white text-sm font-bold rounded-lg transition-all uppercase tracking-wide shadow-md hover:shadow-lg"
          aria-label={`Add ${product.name} to cart`}
        >
          ADD TO CART
        </button>
      </div>
    </article>
  );
}
