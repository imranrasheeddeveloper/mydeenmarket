import Link from "next/link";
import Image from "next/image";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import StatsCounter from "@/components/StatsCounter";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getProducts, getCategories, getCollections } from "@/lib/data";
import { generateBreadcrumbSchema, generateFAQSchema, generateItemListSchema } from "@/lib/seo";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Zap,
  CreditCard,
  Percent,
  Flame,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [rawProducts, categories, collections] = await Promise.all([
    getProducts(),
    getCategories(),
    getCollections(),
  ]);

  const products = rawProducts.map((product) => ({
    ...product,
    description: product.description.slice(0, 180),
    features: [],
  }));

  const islamicCategory = categories.find((c) => c.slug === "islamic-products");
  const mainCategories = (
    islamicCategory
      ? [islamicCategory, ...categories.filter((c) => c.slug !== "islamic-products")]
      : categories
  ).slice(0, 10);
  const featuredProducts = products.slice(0, 8);
  const islamicProducts = products
    .filter(
      (p) =>
        p.categorySlug === "islamic-products" ||
        p.category.toLowerCase() === "islamic-products" ||
        p.category.toLowerCase().includes("islamic")
    )
    .slice(0, 8);
  const bestSellers = products.filter((p) => p.badge === "bestseller").slice(0, 8);
  const newArrivals = products.filter((p) => p.badge === "new").slice(0, 8);
  const topRated = [...products].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 8);
  const mainCollections = collections.slice(0, 4);

  const breadcrumbSchema = generateBreadcrumbSchema([{ name: "Home", url: "/" }]);
  const itemListSchema = generateItemListSchema(products.slice(0, 10));
  const faqSchema = generateFAQSchema([
    {
      question: "Do you offer free shipping in Pakistan?",
      answer: "Yes, free shipping is available on qualifying orders. Delivery options are shown at checkout.",
    },
    {
      question: "Are products authentic?",
      answer: "Yes. We source from trusted publishers and verified distributors.",
    },
    {
      question: "Is cash on delivery available?",
      answer: "Yes, cash on delivery is available in most cities across Pakistan.",
    },
  ]);

  const categoryImageBySlug: Record<string, string> = {
    "islamic-products": "/uploads/categories/aqeedah-islamic.jpg",
    quran: "/uploads/categories/quran-internet.jpg",
    hadith: "/uploads/categories/hadith-internet.jpg",
    seerah: "/uploads/categories/seerah-internet.jpg",
    fiqh: "/uploads/categories/fiqh-internet.jpg",
    fitar: "/uploads/categories/fiqh-internet.jpg",
    prayer: "/uploads/categories/prayer-internet.jpg",
    aqeedah: "/uploads/categories/aqeedah-islamic.jpg",
    children: "/uploads/categories/children-internet.jpg",
    biography: "/uploads/categories/biography-internet.jpg",
    history: "/uploads/products/history-of-islam-3-vol.png",
    "hajj-umrah": "/uploads/categories/hajj-umrah-internet.jpg",
    health: "/uploads/categories/health-islamic.jpg",
  };

  const trustItems = [
    { icon: Truck, title: "Nationwide Delivery", subtitle: "Fast dispatch from Lahore" },
    { icon: ShieldCheck, title: "Authentic Products", subtitle: "Trusted Islamic publishers" },
    { icon: CreditCard, title: "Secure Payments", subtitle: "COD, Card, Bank & Wallets" },
    { icon: Zap, title: "Quick Support", subtitle: "Order help via WhatsApp" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <h1 className="sr-only">MyDeenMarket - Islamic Books and Products in Pakistan</h1>

      <HeroSlider />

      <section className="py-16 md:py-24 bg-gradient-to-b from-[#d4a853]/5 via-white to-white relative overflow-hidden scroll-reveal" aria-labelledby="islamic-products-featured-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-12">
              <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a853] uppercase mb-3">Islamic Essentials Premium</p>
              <h2 id="islamic-products-featured-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 font-[family-name:var(--font-playfair)] mb-3">
                Islamic Products & Essentials
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto text-lg">Discover authentic Islamic products, fragrances, prayer essentials, and family items curated for modern Muslim living.</p>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 grid-stagger">
            {(islamicProducts.length > 0 ? islamicProducts : products.slice(0, 8)).map((product, i) => (
              <AnimateOnScroll key={product.id} animation="fade-up" delay={i * 50}>
                <div className="group perspective hover-lift">
                  <div className="card-3d transform-gpu" style={{ transformStyle: 'preserve-3d' }}>
                    <ProductCard product={product} />
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-slate-100 py-6" aria-label="Top benefits">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {trustItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <AnimateOnScroll key={item.title} animation="fade-up" delay={i * 80}>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-3.5">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-slate-800" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 leading-tight">{item.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#f8f7f4] scroll-reveal" aria-labelledby="shop-by-category-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#b8933f] uppercase mb-2">Shop by Category</p>
              <h2 id="shop-by-category-heading" className="text-2xl md:text-3xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">
                Popular Islamic Categories
              </h2>
            </div>
            <Link href="/collections" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 grid-stagger">
            {mainCategories.map((category, i) => {
              const categoryImage =
                categoryImageBySlug[category.slug] ||
                "/uploads/categories/quran-islamic.jpg";

              return (
                <AnimateOnScroll key={category.slug} animation="fade-up" delay={i * 50}>
                  <Link
                    href={`/collections/${category.slug}`}
                    className="group rounded-2xl border border-slate-200 bg-white overflow-hidden hover-lift card-3d block"
                  >
                    <div className="relative h-36 md:h-40 overflow-hidden transform-gpu transition-all duration-500 group-hover:scale-110" style={{ transformStyle: 'preserve-3d' }}>
                      <Image
                        src={categoryImage}
                        alt={category.name}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
                      <div className="absolute bottom-2.5 left-3 right-3">
                        <h3 className="text-sm md:text-base font-semibold text-white line-clamp-1">
                          {category.name}
                        </h3>
                      </div>
                    </div>
                    <div className="p-3.5 md:p-4">
                      <p className="text-xs text-slate-500">Browse collection</p>
                    </div>
                  </Link>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-5 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a]" aria-label="Deals strip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-3 md:gap-8 items-start md:items-center justify-between">
            <div className="flex items-center gap-2 text-[#e8c97a] text-sm font-semibold tracking-wide uppercase">
              <Flame className="w-4 h-4" />
              Weekly Deals
            </div>
            <p className="text-slate-200 text-sm">Limited-time discounts on selected Quran, Hadith and Kids titles.</p>
            <Link href="/collections" className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#e8c97a]">
              <Percent className="w-4 h-4" /> Shop Offers
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white scroll-reveal" aria-labelledby="featured-products-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#b8933f] uppercase mb-2">Featured</p>
              <h2 id="featured-products-heading" className="text-2xl md:text-3xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">
                Featured Products
              </h2>
            </div>
            <Link href="/collections" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 grid-stagger">
            {featuredProducts.map((product, i) => (
              <AnimateOnScroll key={product.id} animation="fade-up" delay={i * 50}>
                <ProductCard product={product} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white scroll-reveal" aria-label="Featured banners">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 grid-stagger">
            {mainCollections.slice(0, 2).map((collection, i) => (
              <AnimateOnScroll key={collection.slug} animation="fade-up" delay={i * 100}>
                <Link
                  href={`/collections/${collection.slug}`}
                  className="relative block rounded-3xl overflow-hidden min-h-[230px] md:min-h-[280px] p-7 border border-slate-200 hover-lift"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${collection.gradient}`} />
                  <div className="absolute inset-0 bg-black/25" />
                  <div className="relative z-10">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#e8c97a] mb-3 font-semibold">Special Collection</p>
                    <h3 className="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-playfair)] mb-3">{collection.name}</h3>
                    <p className="text-slate-100/90 text-sm max-w-sm mb-5">Handpicked titles and essentials from our most-loved Islamic categories.</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                      Explore Now <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white scroll-reveal" aria-labelledby="best-sellers-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#b8933f] uppercase mb-2">Best Sellers</p>
              <h2 id="best-sellers-heading" className="text-2xl md:text-3xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">
                Most Popular This Month
              </h2>
            </div>
            <Link href="/collections?filter=bestseller" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 grid-stagger">
            {bestSellers.map((product, i) => (
              <AnimateOnScroll key={product.id} animation="fade-up" delay={i * 50}>
                <ProductCard product={product} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[#f8f7f4] scroll-reveal" aria-labelledby="new-arrivals-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#b8933f] uppercase mb-2">Just Arrived</p>
              <h2 id="new-arrivals-heading" className="text-2xl md:text-3xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">
                New Arrivals
              </h2>
            </div>
            <Link href="/collections?filter=new" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 grid-stagger">
            {newArrivals.map((product, i) => (
              <AnimateOnScroll key={product.id} animation="fade-up" delay={i * 50}>
                <ProductCard product={product} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-white scroll-reveal" aria-labelledby="top-rated-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#b8933f] uppercase mb-2">Customer Picks</p>
              <h2 id="top-rated-heading" className="text-2xl md:text-3xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">
                Top Rated Products
              </h2>
            </div>
            <Link href="/collections" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 grid-stagger">
            {topRated.map((product, i) => (
              <AnimateOnScroll key={product.id} animation="fade-up" delay={i * 50}>
                <ProductCard product={product} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-20 gradient-dark-teal relative overflow-hidden scroll-reveal" aria-labelledby="stats-heading">
        <div className="absolute inset-0 islamic-pattern opacity-[0.04]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-10">
              <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a853] uppercase mb-2">Our Community</p>
              <h2 id="stats-heading" className="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-playfair)]">
                Trusted by Readers Across Pakistan
              </h2>
            </div>
          </AnimateOnScroll>
          <StatsCounter />
        </div>
      </section>

      <section className="py-16 md:py-24 gradient-dark-warm relative overflow-hidden scroll-reveal" aria-labelledby="newsletter-heading">
        <div className="absolute inset-0 islamic-pattern opacity-[0.04]" />
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <AnimateOnScroll animation="fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#d4a853]/30 text-[#e8c97a] text-xs uppercase tracking-[0.2em] font-semibold mb-5">
              <Star className="w-3.5 h-3.5" /> Exclusive Updates
            </div>
            <h2 id="newsletter-heading" className="text-3xl md:text-4xl font-bold text-white mb-3 font-[family-name:var(--font-playfair)]">
              Join the Deen Circle
            </h2>
            <p className="text-slate-300 text-sm mb-8">Get new book alerts, Islamic learning picks, and members-only offers.</p>
            <NewsletterSignup />
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
