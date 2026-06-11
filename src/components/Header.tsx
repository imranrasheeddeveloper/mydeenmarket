"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { siteConfig } from "@/lib/data-types";
import type { Category } from "@/lib/data-types";
import CurrencySelector from "@/components/CurrencySelector";

export default function Header({ categories = [] }: { categories?: Category[] }) {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });

    const updateCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCartCount(cart.reduce((sum: number, item: { qty: number }) => sum + item.qty, 0));
      } catch { setCartCount(0); }
    };
    updateCart();
    window.addEventListener("cart-updated", updateCart);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("cart-updated", updateCart);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const mainCategories = categories.slice(0, 8);

  return (
    <>
      {/* Announcement Bar */}
      <div className="relative bg-gradient-to-r from-[#0A3D2E] via-[#0D503C] to-[#0A3D2E] text-white text-center text-sm py-2.5 px-4 font-medium tracking-wider overflow-hidden">
        <div className="absolute inset-0 islamic-pattern-dark" />
        <p className="relative z-10 flex items-center justify-center gap-2">
          <span className="text-[#E8D5A3]">✦</span>
          FREE SHIPPING ON ORDERS OVER RS. {siteConfig.freeShippingThreshold.toLocaleString()}
          <span className="text-[#E8D5A3]">✦</span>
        </p>
      </div>

      {/* Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0A3D2E]/95 backdrop-blur-xl shadow-[0_4px_30px_rgba(197,164,78,0.12)]"
            : "bg-[#0D503C] shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="MyDeenMarket Home">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#C5A44E] to-[#A08839] flex items-center justify-center shadow-lg group-hover:shadow-[0_0_20px_rgba(197,164,78,0.4)] transition-shadow">
                <svg className="w-5 h-5 text-[#0A3D2E]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <span className="text-lg md:text-xl font-bold text-white tracking-tight">
                  MyDeenMarket
                </span>
                <span className="block text-[10px] font-semibold tracking-[0.3em] text-[#C5A44E] uppercase -mt-0.5">
                  Islamic Books
                </span>
              </div>
            </Link>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-xl mx-4">
              <form className="w-full relative group" role="search" action="/collections">
                <input
                  type="search"
                  name="q"
                  placeholder="Search for books, authors, categories..."
                  className="w-full pl-5 pr-12 py-2.5 bg-white/10 border border-white/20 rounded-full text-sm text-white placeholder-white/50 focus:outline-none focus:bg-white/15 focus:border-[#C5A44E]/50 focus:shadow-[0_0_20px_rgba(197,164,78,0.1)] transition-all"
                  aria-label="Search products"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#C5A44E] to-[#A08839] hover:from-[#D4AF37] hover:to-[#C5A44E] text-[#0A3D2E] rounded-full w-9 h-9 flex items-center justify-center transition-all shadow-md"
                  aria-label="Search"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:block">
                <CurrencySelector />
              </div>

              {session ? (
                <Link
                  href="/account"
                  className="hidden sm:flex items-center gap-1.5 text-white/80 hover:text-[#C5A44E] transition-colors text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden lg:inline">{session.user?.name?.split(" ")[0] || "Account"}</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="hidden sm:flex items-center gap-1.5 text-white/80 hover:text-[#C5A44E] transition-colors text-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden lg:inline">Log In</span>
                </Link>
              )}

              <button
                className="relative flex items-center gap-1.5 text-white/80 hover:text-[#C5A44E] transition-colors text-sm"
                aria-label={`Cart with ${cartCount} items`}
                onClick={() => window.dispatchEvent(new Event("toggle-cart"))}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="hidden lg:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[#C5A44E] to-[#A08839] text-[#0A3D2E] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden p-2 text-white/80 hover:text-[#C5A44E]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:block border-t border-white/10" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center gap-1 text-sm font-medium -mb-px">
              <li>
                <Link href="/" className="inline-block py-3 px-3 text-white/80 hover:text-[#C5A44E] border-b-2 border-transparent hover:border-[#C5A44E] transition-colors">
                  Home
                </Link>
              </li>
              <li className="group relative">
                <Link href="/collections" className="inline-flex items-center gap-1 py-3 px-3 text-white/80 hover:text-[#C5A44E] border-b-2 border-transparent hover:border-[#C5A44E] transition-colors">
                  Collections
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                {/* Mega menu */}
                <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 absolute top-full left-0 w-[600px] glass-dark rounded-b-xl p-6 grid grid-cols-2 gap-6 z-50 shadow-2xl">
                  <div>
                    <h4 className="font-bold text-[#C5A44E] mb-3 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-4 h-px bg-[#C5A44E]/50" />
                      Holy Quran &amp; Hadith
                    </h4>
                    <div className="space-y-2">
                      <Link href="/collections/quran" className="block text-white/70 hover:text-[#C5A44E] text-sm transition-colors">Quran</Link>
                      <Link href="/collections/hadith" className="block text-white/70 hover:text-[#C5A44E] text-sm transition-colors">Hadith</Link>
                      <Link href="/collections/seerah" className="block text-white/70 hover:text-[#C5A44E] text-sm transition-colors">Prophet&apos;s Seerah</Link>
                      <Link href="/collections/biography" className="block text-white/70 hover:text-[#C5A44E] text-sm transition-colors">Biography</Link>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#C5A44E] mb-3 text-xs uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-4 h-px bg-[#C5A44E]/50" />
                      Islamic Knowledge
                    </h4>
                    <div className="space-y-2">
                      <Link href="/collections/fiqh" className="block text-white/70 hover:text-[#C5A44E] text-sm transition-colors">Fiqh</Link>
                      <Link href="/collections/aqeedah" className="block text-white/70 hover:text-[#C5A44E] text-sm transition-colors">Faith / Aqeedah</Link>
                      <Link href="/collections/prayer" className="block text-white/70 hover:text-[#C5A44E] text-sm transition-colors">Prayer / Supplication</Link>
                      <Link href="/collections/children" className="block text-white/70 hover:text-[#C5A44E] text-sm transition-colors">Kids / Children</Link>
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <Link href="/collections?filter=bestseller" className="inline-block py-3 px-3 text-white/80 hover:text-[#C5A44E] border-b-2 border-transparent hover:border-[#C5A44E] transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/collections/children" className="inline-block py-3 px-3 text-white/80 hover:text-[#C5A44E] border-b-2 border-transparent hover:border-[#C5A44E] transition-colors">
                  Kids/Children
                </Link>
              </li>
              <li>
                <Link href="/collections/hajj-umrah" className="inline-block py-3 px-3 text-white/80 hover:text-[#C5A44E] border-b-2 border-transparent hover:border-[#C5A44E] transition-colors">
                  Hajj/Umrah
                </Link>
              </li>
              <li>
                <Link href="/collections/islamic-products" className="inline-block py-3 px-3 text-white/80 hover:text-[#C5A44E] border-b-2 border-transparent hover:border-[#C5A44E] transition-colors">
                  Islamic Products
                </Link>
              </li>
              <li>
                <Link href="/collections?filter=sale" className="inline-block py-3 px-3 text-[#E8D5A3] hover:text-[#C5A44E] font-semibold border-b-2 border-transparent hover:border-[#C5A44E] transition-colors">
                  Sale ✦
                </Link>
              </li>
              <li>
                <Link href="/contact" className="inline-block py-3 px-3 text-white/80 hover:text-[#C5A44E] border-b-2 border-transparent hover:border-[#C5A44E] transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3">
          <form className="relative" role="search" action="/collections">
            <input
              type="search"
              name="q"
              placeholder="Search books..."
              className="w-full pl-4 pr-10 py-2 bg-white/10 border border-white/20 rounded-full text-sm text-white placeholder-white/50 focus:outline-none focus:border-[#C5A44E]/50"
              aria-label="Search products"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50" aria-label="Search">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <nav className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-[#0A3D2E] shadow-2xl overflow-y-auto" aria-label="Mobile navigation">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-lg font-bold text-white">
                MyDeen<span className="text-[#C5A44E]">Market</span>
              </span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-white/60" aria-label="Close menu">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ul className="py-2">
              <li><Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-3 text-white/80 hover:bg-white/5 hover:text-[#C5A44E] font-medium">Home</Link></li>
              <li><Link href="/collections" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-3 text-white/80 hover:bg-white/5 hover:text-[#C5A44E] font-medium">All Collections</Link></li>
              {mainCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/collections/${cat.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-6 py-3 text-white/60 hover:bg-white/5 hover:text-[#C5A44E]"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li><Link href="/collections?filter=sale" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-3 text-[#E8D5A3] hover:bg-white/5 font-semibold">Sale ✦</Link></li>
              <li><Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-3 text-white/80 hover:bg-white/5 hover:text-[#C5A44E] font-medium">Contact</Link></li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
