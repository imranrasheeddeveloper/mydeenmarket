"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { siteConfig } from "@/lib/data-types";
import type { Category } from "@/lib/data-types";
import CurrencySelector from "@/components/CurrencySelector";

export default function Header({ categories = [] }: { categories?: Category[] }) {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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
    return () => { window.removeEventListener("scroll", handleScroll); window.removeEventListener("cart-updated", updateCart); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) setMobileSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const popularSearches = ["Quran", "Hadith", "Sealed Nectar", "Tib e Nabvi", "Kids Books", "Prayer Guide"];
  const trendingCategories = [
    { name: "Holy Quran", slug: "quran", icon: "📖" },
    { name: "Hadith", slug: "hadith", icon: "📚" },
    { name: "Seerah", slug: "seerah", icon: "🌙" },
    { name: "Kids / Children", slug: "children", icon: "🧒" },
    { name: "Prayer", slug: "prayer", icon: "🤲" },
    { name: "Fiqh", slug: "fiqh", icon: "⚖️" },
  ];

  const filteredSearches = searchQuery.trim()
    ? popularSearches.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    : popularSearches;

  const mainCategories = categories.slice(0, 8);

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-[#0c1220] via-[#1a1f3a] to-[#0c1220] text-white text-center text-[13px] py-2.5 px-4 font-medium tracking-wider relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `radial-gradient(circle at 20% 50%, rgba(212,168,83,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(13,148,136,0.06) 0%, transparent 50%)` }} />
        <p className="flex items-center justify-center gap-2 relative z-10">
          <span className="text-[#d4a853]">✦</span>
          FREE SHIPPING ON ORDERS OVER RS. {siteConfig.freeShippingThreshold.toLocaleString()}
          <span className="text-[#d4a853]">✦</span>
        </p>
      </div>

      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100" : "bg-white border-b border-slate-100"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[72px] gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="MyDeenMarket Home">
              <Image src="/logo-icon.svg" alt="MyDeenMarket logo" width={36} height={36} className="rounded-lg" priority />
              <div>
                <span className="text-lg font-bold text-slate-900 tracking-tight">MyDeenMarket</span>
                <span className="block text-[10px] font-semibold tracking-[0.2em] text-[#d4a853] uppercase -mt-0.5">Islamic Books</span>
              </div>
            </Link>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-xl mx-6 relative" ref={searchRef}>
              <form className="w-full relative" role="search" action="/collections" onSubmit={() => setSearchOpen(false)}>
                <input
                  type="search"
                  name="q"
                  placeholder="Search books, authors, categories..."
                  className={`w-full pl-5 pr-12 py-2.5 bg-slate-50 border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                    searchOpen ? "border-[#d4a853]/50 ring-2 ring-[#d4a853]/10 rounded-t-2xl rounded-b-none bg-white" : "border-slate-200 rounded-full"
                  }`}
                  aria-label="Search products"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  autoComplete="off"
                />
                <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors" aria-label="Search">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </button>
              </form>

              {/* Search Dropdown */}
              {searchOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border border-t-0 border-slate-200 rounded-b-2xl shadow-xl shadow-slate-200/60 z-50 overflow-hidden animate-[fadeSlideDown_0.2s_ease-out]">
                  <div className="p-5">
                    {/* Popular Searches */}
                    <div className="mb-5">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-3 flex items-center gap-2">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        Popular Searches
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {filteredSearches.map((term) => (
                          <Link
                            key={term}
                            href={`/collections?q=${encodeURIComponent(term)}`}
                            onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-50 hover:bg-[#d4a853]/10 border border-slate-100 hover:border-[#d4a853]/30 rounded-full text-sm text-slate-600 hover:text-[#0f172a] transition-all group"
                          >
                            <svg className="w-3 h-3 text-slate-300 group-hover:text-[#d4a853] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            {term}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Trending Categories */}
                    {!searchQuery.trim() && (
                      <div>
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-3 flex items-center gap-2">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                          Browse Categories
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          {trendingCategories.map((cat) => (
                            <Link
                              key={cat.slug}
                              href={`/collections/${cat.slug}`}
                              onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                            >
                              <span className="text-base">{cat.icon}</span>
                              <span className="text-sm text-slate-600 group-hover:text-[#0f172a] transition-colors">{cat.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="border-t border-slate-100 px-5 py-3 bg-slate-50/50 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Press Enter to search</span>
                    <Link
                      href="/collections"
                      onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                      className="text-xs font-medium text-[#d4a853] hover:text-[#b8933f] transition-colors"
                    >
                      View all products →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="hidden sm:block"><CurrencySelector /></div>
              {session ? (
                <Link href="/account" className="hidden sm:flex items-center gap-1.5 text-slate-600 hover:text-[#d4a853] transition-colors text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span className="hidden lg:inline">{session.user?.name?.split(" ")[0] || "Account"}</span>
                </Link>
              ) : (
                <Link href="/login" className="hidden sm:flex items-center gap-1.5 text-slate-600 hover:text-[#d4a853] transition-colors text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  <span className="hidden lg:inline">Log In</span>
                </Link>
              )}
              <button className="relative flex items-center gap-1.5 text-slate-600 hover:text-[#d4a853] transition-colors text-sm" aria-label={`Cart with ${cartCount} items`} onClick={() => window.dispatchEvent(new Event("toggle-cart"))}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                <span className="hidden lg:inline">Cart</span>
                {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-[#d4a853] text-[#0f172a] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">{cartCount}</span>}
              </button>
              <button className="md:hidden p-2 text-slate-600 hover:text-[#d4a853]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu" aria-expanded={mobileMenuOpen}>
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:block border-t border-slate-100 bg-gradient-to-r from-slate-50/80 via-white to-slate-50/80" aria-label="Main navigation">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center gap-1 text-sm font-medium -mb-px">
              <li><Link href="/" className="inline-block py-3 px-3 text-slate-600 hover:text-[#d4a853] border-b-2 border-transparent hover:border-[#d4a853] transition-colors">Home</Link></li>
              <li className="group relative">
                <Link href="/collections" className="inline-flex items-center gap-1 py-3 px-3 text-slate-600 hover:text-[#d4a853] border-b-2 border-transparent hover:border-[#d4a853] transition-colors">
                  Collections
                  <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </Link>
                <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 absolute top-full left-0 w-[560px] bg-white rounded-xl border border-slate-100 p-6 grid grid-cols-2 gap-6 z-50 shadow-xl shadow-slate-200/50">
                  <div>
                    <h4 className="font-bold text-[#d4a853] mb-3 text-xs uppercase tracking-wider">Holy Quran &amp; Hadith</h4>
                    <div className="space-y-2.5">
                      <Link href="/collections/quran" className="block text-slate-500 hover:text-[#d4a853] text-sm transition-colors">Quran</Link>
                      <Link href="/collections/hadith" className="block text-slate-500 hover:text-[#d4a853] text-sm transition-colors">Hadith</Link>
                      <Link href="/collections/seerah" className="block text-slate-500 hover:text-[#d4a853] text-sm transition-colors">Prophet&apos;s Seerah</Link>
                      <Link href="/collections/biography" className="block text-slate-500 hover:text-[#d4a853] text-sm transition-colors">Biography</Link>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-[#d4a853] mb-3 text-xs uppercase tracking-wider">Islamic Knowledge</h4>
                    <div className="space-y-2.5">
                      <Link href="/collections/fiqh" className="block text-slate-500 hover:text-[#d4a853] text-sm transition-colors">Fiqh</Link>
                      <Link href="/collections/aqeedah" className="block text-slate-500 hover:text-[#d4a853] text-sm transition-colors">Faith / Aqeedah</Link>
                      <Link href="/collections/prayer" className="block text-slate-500 hover:text-[#d4a853] text-sm transition-colors">Prayer / Supplication</Link>
                      <Link href="/collections/children" className="block text-slate-500 hover:text-[#d4a853] text-sm transition-colors">Kids / Children</Link>
                    </div>
                  </div>
                </div>
              </li>
              <li><Link href="/collections?filter=bestseller" className="inline-block py-3 px-3 text-slate-600 hover:text-[#d4a853] border-b-2 border-transparent hover:border-[#d4a853] transition-colors">Best Sellers</Link></li>
              <li><Link href="/collections/children" className="inline-block py-3 px-3 text-slate-600 hover:text-[#d4a853] border-b-2 border-transparent hover:border-[#d4a853] transition-colors">Kids/Children</Link></li>
              <li><Link href="/collections/hajj-umrah" className="inline-block py-3 px-3 text-slate-600 hover:text-[#d4a853] border-b-2 border-transparent hover:border-[#d4a853] transition-colors">Hajj/Umrah</Link></li>
              <li><Link href="/collections/islamic-products" className="inline-block py-3 px-3 text-slate-600 hover:text-[#d4a853] border-b-2 border-transparent hover:border-[#d4a853] transition-colors">Islamic Products</Link></li>
              <li><Link href="/collections?filter=sale" className="inline-block py-3 px-3 text-[#d4a853] hover:text-[#b8933f] font-semibold border-b-2 border-transparent hover:border-[#d4a853] transition-colors">Sale ✦</Link></li>
              <li><Link href="/contact" className="inline-block py-3 px-3 text-slate-600 hover:text-[#d4a853] border-b-2 border-transparent hover:border-[#d4a853] transition-colors">Contact</Link></li>
            </ul>
          </div>
        </nav>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-3 relative" ref={mobileSearchRef}>
          <form className="relative" role="search" action="/collections" onSubmit={() => setMobileSearchOpen(false)}>
            <input
              type="search"
              name="q"
              placeholder="Search books..."
              className={`w-full pl-4 pr-10 py-2 bg-slate-50 border text-sm text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                mobileSearchOpen ? "border-[#d4a853]/50 rounded-t-xl rounded-b-none bg-white" : "border-slate-200 rounded-full"
              }`}
              aria-label="Search products"
              onFocus={() => setMobileSearchOpen(true)}
              autoComplete="off"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Search">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </form>
          {mobileSearchOpen && (
            <div className="absolute left-4 right-4 bg-white border border-t-0 border-slate-200 rounded-b-xl shadow-lg z-50">
              <div className="p-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-2">Popular Searches</h4>
                <div className="flex flex-wrap gap-1.5">
                  {popularSearches.map((term) => (
                    <Link key={term} href={`/collections?q=${encodeURIComponent(term)}`} onClick={() => setMobileSearchOpen(false)} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-xs text-slate-600 hover:bg-[#d4a853]/10 hover:border-[#d4a853]/30 transition-all">{term}</Link>
                  ))}
                </div>
                <h4 className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mt-3 mb-2">Categories</h4>
                <div className="grid grid-cols-2 gap-1">
                  {trendingCategories.map((cat) => (
                    <Link key={cat.slug} href={`/collections/${cat.slug}`} onClick={() => setMobileSearchOpen(false)} className="flex items-center gap-2 px-2.5 py-2 rounded-lg hover:bg-slate-50 text-sm text-slate-600">
                      <span>{cat.icon}</span>{cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <nav className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-white shadow-2xl overflow-y-auto" aria-label="Mobile navigation">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <span className="text-lg font-bold text-slate-900 flex items-center gap-2"><Image src="/logo-icon.svg" alt="" width={28} height={28} className="rounded-md" />MyDeen<span className="text-[#d4a853]">Market</span></span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400" aria-label="Close menu">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <ul className="py-2">
              <li><Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-3 text-slate-700 hover:bg-slate-50 hover:text-[#d4a853] font-medium">Home</Link></li>
              <li><Link href="/collections" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-3 text-slate-700 hover:bg-slate-50 hover:text-[#d4a853] font-medium">All Collections</Link></li>
              {mainCategories.map((cat) => (
                <li key={cat.slug}><Link href={`/collections/${cat.slug}`} onClick={() => setMobileMenuOpen(false)} className="block px-6 py-3 text-slate-500 hover:bg-slate-50 hover:text-[#d4a853]">{cat.name}</Link></li>
              ))}
              <li><Link href="/collections?filter=sale" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-3 text-[#d4a853] hover:bg-slate-50 font-semibold">Sale ✦</Link></li>
              <li><Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-6 py-3 text-slate-700 hover:bg-slate-50 hover:text-[#d4a853] font-medium">Contact</Link></li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
