"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/data-types";
import type { Product } from "@/lib/data-types";
import {
  ShoppingCart, Heart, Star, BookOpen, BookMarked, Scroll, Moon, Users, Gift, Feather, Pen,
} from "lucide-react";

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <Star key={i} className={`w-3 h-3 ${i < rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
        ))}
      </div>
      <span className="text-[11px] text-slate-400">({count})</span>
    </div>
  );
}

const iconMap: Record<string, React.ReactNode> = {
  book: <BookOpen className="w-8 h-8 text-white/60" />,
  "book-quran": <BookMarked className="w-8 h-8 text-white/60" />,
  "book-open": <BookOpen className="w-8 h-8 text-white/60" />,
  children: <Users className="w-8 h-8 text-white/60" />,
  scroll: <Scroll className="w-8 h-8 text-white/60" />,
  moon: <Moon className="w-8 h-8 text-white/60" />,
  gift: <Gift className="w-8 h-8 text-white/60" />,
  feather: <Feather className="w-8 h-8 text-white/60" />,
  pen: <Pen className="w-8 h-8 text-white/60" />,
};

const badgeStyles: Record<string, string> = {
  bestseller: "bg-[#d4a853] text-[#0f172a]",
  new: "bg-[#0f172a] text-white",
  sale: "bg-rose-500 text-white",
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
      if (existing) { existing.qty += 1; }
      else { cart.push({ id: product.id, name: product.name, price: product.price, qty: 1 }); }
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
      window.dispatchEvent(new Event("toggle-cart"));
    } catch { /* ignore */ }
  };

  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-slate-200 hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-500 flex flex-col">
      <Link href={`/product/${product.slug}`} className="relative block aspect-[4/5] overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-out"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${product.gradient} flex flex-col items-center justify-center gap-3 p-6 group-hover:scale-[1.05] transition-transform duration-700 ease-out`}>
            {iconMap[product.icon] || iconMap.book}
            <span className="text-sm font-medium text-white/70 text-center leading-tight">
              {product.name.length > 30 ? product.name.substring(0, 30) + "..." : product.name}
            </span>
          </div>
        )}
        {product.badge && (
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider ${badgeStyles[product.badge]}`}>
            {badgeLabels[product.badge]}
          </span>
        )}
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10 shadow-sm" aria-label={`Add ${product.name} to wishlist`}>
          <Heart className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </Link>
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <span className="text-[10px] font-semibold tracking-widest text-[#d4a853] uppercase mb-1.5">{product.vendor}</span>
        <h3 className="text-sm font-semibold text-slate-900 mb-2 line-clamp-2 leading-snug flex-1">
          <Link href={`/product/${product.slug}`} className="hover:text-[#d4a853] transition-colors">{product.name}</Link>
        </h3>
        <StarRating rating={product.rating} count={product.reviewCount} />
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</span>
          {product.compareAtPrice && <span className="text-xs text-slate-400 line-through">{formatPrice(product.compareAtPrice)}</span>}
        </div>
        <button onClick={addToCart} className="mt-4 w-full py-2.5 bg-[#0f172a] hover:bg-[#1e293b] text-white text-xs font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 hover:shadow-lg" aria-label={`Add ${product.name} to cart`}>
          <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
        </button>
      </div>
    </article>
  );
}
