"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/data-types";
import type { Product } from "@/lib/data-types";
import {
  ShoppingCart,
  Eye,
  Heart,
  Star,
  BookOpen,
  BookMarked,
  Scroll,
  Moon,
  Users,
  Gift,
  Feather,
  Pen,
} from "lucide-react";

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${i < rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500">({count})</span>
    </div>
  );
}

const iconMap: Record<string, React.ReactNode> = {
  book: <BookOpen className="w-8 h-8 text-white/80" />,
  "book-quran": <BookMarked className="w-8 h-8 text-white/80" />,
  "book-open": <BookOpen className="w-8 h-8 text-white/80" />,
  children: <Users className="w-8 h-8 text-white/80" />,
  scroll: <Scroll className="w-8 h-8 text-white/80" />,
  moon: <Moon className="w-8 h-8 text-white/80" />,
  gift: <Gift className="w-8 h-8 text-white/80" />,
  feather: <Feather className="w-8 h-8 text-white/80" />,
  pen: <Pen className="w-8 h-8 text-white/80" />,
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
    <article className="group bg-white rounded-2xl border border-gray-100/80 overflow-hidden card-hover-lift flex flex-col relative">
      {/* Subtle gold corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-px h-10 bg-gradient-to-b from-[#C5A44E]/40 to-transparent" />
        <div className="absolute top-0 right-0 h-px w-10 bg-gradient-to-l from-[#C5A44E]/40 to-transparent" />
      </div>

      {/* Image */}
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden">
        <div className={`w-full h-full bg-gradient-to-br ${product.gradient} flex flex-col items-center justify-center gap-3 p-6 img-zoom`}>
          <div className="absolute inset-0 islamic-stars opacity-40" />
          {iconMap[product.icon] || iconMap.book}
          <span className="text-sm font-semibold text-white/90 text-center leading-tight relative z-10">
            {product.name.length > 30 ? product.name.substring(0, 30) + "..." : product.name}
          </span>
        </div>

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold shadow-lg badge-shine ${badgeStyles[product.badge]}`}>
            {badgeLabels[product.badge]}
          </span>
        )}

        {/* Wishlist button */}
        <button
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 hover:bg-white hover:scale-110 z-10"
          aria-label={`Add ${product.name} to wishlist`}
        >
          <Heart className="w-4 h-4 text-[#0A3D2E]" />
        </button>

        {/* Quick-action overlay that slides up */}
        <div className="absolute inset-x-0 bottom-0 z-10 overlay-slide-up">
          <div className="flex items-center justify-center gap-2 p-3 bg-gradient-to-t from-black/60 to-transparent pt-8">
            <Link
              href={`/product/${product.slug}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-white/95 backdrop-blur-sm text-[#0A3D2E] rounded-full text-xs font-bold shadow-lg hover:bg-white transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Quick View
            </Link>
            <button
              onClick={(e) => { e.preventDefault(); addToCart(); }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0D503C] text-white rounded-full text-xs font-bold shadow-lg hover:bg-[#0A3D2E] transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 bg-gradient-to-b from-white to-[#FEFCF6]/50">
        <span className="text-[10px] font-bold tracking-widest text-[#C5A44E] uppercase mb-1">
          {product.vendor}
        </span>
        <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-snug flex-1">
          <Link href={`/product/${product.slug}`} className="hover:text-[#0D503C] transition-colors">
            {product.name}
          </Link>
        </h3>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-xs text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
        </div>
        <button
          onClick={addToCart}
          className="mt-3 w-full py-2.5 bg-gradient-to-r from-[#0D503C] to-[#14785A] hover:from-[#0A3D2E] hover:to-[#0D503C] text-white text-sm font-bold rounded-xl transition-all uppercase tracking-wide shadow-md hover:shadow-xl flex items-center justify-center gap-2 group/btn"
          aria-label={`Add ${product.name} to cart`}
        >
          <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          Add to Cart
        </button>
      </div>
    </article>
  );
}
