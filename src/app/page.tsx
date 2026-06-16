import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import StatsCounter from "@/components/StatsCounter";
import NewsletterSignup from "@/components/NewsletterSignup";
import { getProducts, getCategories, getCollections } from "@/lib/data";
import { generateBreadcrumbSchema, generateFAQSchema, generateItemListSchema } from "@/lib/seo";
import {
  Truck, Zap, ShieldCheck, Lock, BookOpen, Star, ArrowRight,
  Heart, Gift, Users, BookMarked, Scroll, Moon, ChevronRight, Mail,
  BookText, HandHeart, Sparkles, Scale, Baby, Feather, Gem, Landmark, Megaphone, Compass, Leaf,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [products, categories, collections] = await Promise.all([
    getProducts(), getCategories(), getCollections(),
  ]);
  const newArrivals = products.filter((p) => p.badge === "new");
  const mainCategories = categories.slice(0, 8);
  const mainCollections = collections.slice(0, 6);
  const breadcrumbSchema = generateBreadcrumbSchema([{ name: "Home", url: "/" }]);

  const bestSellers = products.filter((p) => p.badge === "bestseller");
  
  // Top rated products (sorted by rating)
  const topRated = [...products]
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 8);

  // Most reviewed products
  const mostReviewed = [...products]
    .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
    .slice(0, 8);

  // New bestsellers (products that are both new and bestseller)
  const newBestsellers = products.filter((p) => p.badge === "bestseller").slice(0, 4);
  
  // Category-specific best sellers
  const categoryBestSellers = {
    quran: products.filter((p) => p.category === "quran" && p.badge === "bestseller").slice(0, 4),
    hadith: products.filter((p) => p.category === "hadith" && p.badge === "bestseller").slice(0, 4),
    prayer: products.filter((p) => p.category === "prayer" && p.badge === "bestseller").slice(0, 4),
    fiqh: products.filter((p) => p.category === "fiqh" && p.badge === "bestseller").slice(0, 4),
    seerah: products.filter((p) => p.category === "seerah" && p.badge === "bestseller").slice(0, 4),
    biography: products.filter((p) => p.category === "biography" && p.badge === "bestseller").slice(0, 4),
    aqeedah: products.filter((p) => p.category === "aqeedah" && p.badge === "bestseller").slice(0, 4),
    history: products.filter((p) => p.category === "history" && p.badge === "bestseller").slice(0, 4),
    dawah: products.filter((p) => p.category === "dawah" && p.badge === "bestseller").slice(0, 4),
    "hajj-umrah": products.filter((p) => p.category === "hajj-umrah" && p.badge === "bestseller").slice(0, 4),
    health: products.filter((p) => p.category === "health" && p.badge === "bestseller").slice(0, 4),
    children: products.filter((p) => p.category === "children" && p.badge === "bestseller").slice(0, 4),
  };
  const itemListSchema = generateItemListSchema(products.slice(0, 10));
  const faqSchema = generateFAQSchema([
    {
      question: "What Islamic products does MyDeenMarket sell?",
      answer: "MyDeenMarket sells authentic Islamic books (Quran, Hadith, Seerah, Fiqh, Tafseer), Abaya, Tasbih, Janamaz (prayer mats), Zamzam water, Talbina, Ihram, Attar & Islamic fragrances, Oud soap, Miswak, Ajwa dates, and many more Islamic essentials.",
    },
    {
      question: "Do you offer free shipping in Pakistan?",
      answer: "Yes! We offer free shipping on all orders above Rs. 5,000 across Pakistan. Orders are dispatched same-day from Lahore.",
    },
    {
      question: "Can I pay cash on delivery?",
      answer: "Yes, we accept Cash on Delivery (COD) across Pakistan. We also accept credit/debit cards, bank transfers, JazzCash, and EasyPaisa.",
    },
    {
      question: "Are your Islamic books authentic?",
      answer: "100% authentic. We source directly from official publishers and verified distributors. All our Quran copies, Hadith collections, and Islamic literature are original publications.",
    },
    {
      question: "Do you ship internationally?",
      answer: "Currently we deliver across Pakistan. International shipping will be available soon. Contact us at info@mydeenmarket.com for special international orders.",
    },
    {
      question: "Where is MyDeenMarket located?",
      answer: "Our physical store is at Shop #50, Ground Floor, Big City Plaza, Gullberg III, Lahore, Pakistan. Open Monday–Saturday, 10 AM–8 PM.",
    },
  ]);
  const categoryIconMap: Record<string, LucideIcon> = {
    quran: BookOpen,
    hadith: BookText,
    prayer: HandHeart,
    seerah: Sparkles,
    fiqh: Scale,
    children: Baby,
    biography: Feather,
    "islamic-products": Gem,
    aqeedah: Heart,
    history: Landmark,
    dawah: Megaphone,
    "hajj-umrah": Compass,
    health: Leaf,
  };

  const trustBadges = [
    { icon: Truck, title: "Free Delivery", desc: "On orders over Rs. 3,000" },
    { icon: Zap, title: "Fast Dispatch", desc: "Same-day from Lahore" },
    { icon: ShieldCheck, title: "100% Authentic", desc: "Official publications" },
    { icon: Lock, title: "Secure Checkout", desc: "SSL encrypted" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <HeroSlider />

      {/* Visually hidden H1 for SEO — hero slides use H2 */}
      <h1 className="sr-only">MyDeenMarket — Islamic Books & Products Online in Pakistan</h1>

      {/* BLUF Summary — LLM/AI scraper readable block */}
      <section className="sr-only" aria-label="Store summary">
        <p>
          MyDeenMarket is Pakistan&apos;s trusted online Islamic store based in Lahore. We sell authentic Islamic books
          (Quran, Hadith, Seerah, Fiqh, Tafseer), Abaya, Tasbih, Janamaz prayer mats, Zamzam water, Talbina,
          Ihram for Hajj &amp; Umrah, Islamic fragrances (Attar, Oud), Miswak, and Ajwa dates.
          Free shipping on orders over Rs. 5,000. Cash on delivery available across Pakistan.
          Visit us at Shop #50, Big City Plaza, Gullberg III, Lahore or call +92 303 5036392.
        </p>
      </section>

      {/* Trust Strip */}
      <section className="py-8 bg-white border-b border-slate-100" aria-label="Why shop with us">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {trustBadges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <AnimateOnScroll key={i} delay={i * 80} animation="fade-up">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                      <Icon className="w-5 h-5 text-[#0f172a]" />
                    </div>
                    <div>
                      <strong className="text-sm font-semibold text-slate-900 block leading-tight">{badge.title}</strong>
                      <span className="text-xs text-slate-400">{badge.desc}</span>
                    </div>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 md:py-28 gradient-dark-warm relative overflow-hidden" aria-labelledby="categories-heading">
        {/* Noor effects */}
        <div className="noor-glow w-[500px] h-[500px] top-[-100px] right-[-100px]" />
        <div className="noor-bubble w-[300px] h-[300px] bottom-[10%] left-[-50px]" />
        <div className="noor-bubble-teal w-[250px] h-[250px] top-[20%] right-[10%]" />
        <div className="noor-sparkle top-[15%] left-[20%]" style={{ animationDelay: '0s' }} />
        <div className="noor-sparkle top-[60%] right-[15%]" style={{ animationDelay: '1.5s' }} />
        <div className="noor-sparkle bottom-[25%] left-[40%]" style={{ animationDelay: '3s' }} />
        <div className="noor-ring w-[400px] h-[400px] top-[-100px] left-[-100px]" />
        <div className="noor-ring w-[300px] h-[300px] bottom-[-80px] right-[-60px]" style={{ animationDirection: 'reverse', animationDuration: '45s' }} />
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a853' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4a853]/10 border border-[#d4a853]/20 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4a853] animate-pulse" />
                <span className="text-xs font-semibold tracking-[0.2em] text-[#d4a853] uppercase">Explore Our Collection</span>
              </div>
              <h2 id="categories-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white font-[family-name:var(--font-playfair)] mb-3">
                Shop by Category
              </h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">Discover our curated Islamic library spanning every area of knowledge</p>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {mainCategories.map((cat, i) => {
              const Icon = categoryIconMap[cat.slug] || BookMarked;
              return (
                <AnimateOnScroll key={cat.slug} delay={i * 60} animation="fade-up">
                  <Link href={`/collections/${cat.slug}`} className="group relative overflow-hidden rounded-2xl bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] hover:bg-white/[0.08] hover:border-[#d4a853]/30 transition-all duration-500 block">
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#d4a853]/0 via-transparent to-[#d4a853]/0 group-hover:from-[#d4a853]/5 group-hover:to-transparent transition-all duration-700" />
                    
                    <div className="relative p-5 sm:p-7 flex flex-col items-center text-center">
                      {/* Icon container */}
                      <div className="relative mb-5">
                        <div className="absolute inset-0 bg-[#d4a853]/20 rounded-2xl blur-xl scale-0 group-hover:scale-100 transition-transform duration-500" />
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-[#d4a853]/20 to-[#d4a853]/5 border border-[#d4a853]/10 flex items-center justify-center group-hover:border-[#d4a853]/30 group-hover:from-[#d4a853]/30 group-hover:to-[#d4a853]/10 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3">
                          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-[#d4a853] transition-transform duration-500 group-hover:scale-110" strokeWidth={1.5} />
                        </div>
                      </div>
                      
                      {/* Text */}
                      <h3 className="font-semibold text-white text-sm mb-1.5 group-hover:text-[#d4a853] transition-colors duration-300">{cat.name}</h3>
                      <span className="text-[11px] text-slate-500 group-hover:text-slate-400 transition-colors font-medium tracking-wide">{cat.count}+ titles</span>
                      
                      {/* Arrow indicator */}
                      <div className="mt-4 flex items-center gap-1 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <span className="text-[10px] text-[#d4a853] font-semibold uppercase tracking-wider">Browse</span>
                        <ArrowRight className="w-3 h-3 text-[#d4a853]" />
                      </div>
                    </div>
                  </Link>
                </AnimateOnScroll>
              );
            })}
          </div>
          <AnimateOnScroll animation="fade-up" delay={400}>
            <div className="text-center mt-14">
              <Link href="/collections" className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#d4a853] text-[#0f172a] text-sm font-bold hover:bg-[#e8c97a] transition-all duration-300 group shadow-lg shadow-[#d4a853]/20 hover:shadow-[#d4a853]/40">
                View All Categories
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 md:py-28 bg-[#f8f7f4]" aria-labelledby="bestsellers-heading">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-semibold tracking-[0.3em] text-[#d4a853] uppercase mb-3">Most Popular</p>
                <h2 id="bestsellers-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">Best Sellers</h2>
              </div>
              <Link href="/collections?filter=bestseller" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white hover:border-slate-300 transition-all group">
                View All Best Sellers <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map((product, i) => (
              <AnimateOnScroll key={product.id} delay={i * 50} animation="fade-up">
                <ProductCard product={product} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Quran Best Sellers */}
      {categoryBestSellers.quran.length > 0 && (
        <section className="py-20 md:py-28 bg-white" aria-labelledby="quran-bestsellers-heading">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <AnimateOnScroll animation="fade-up">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-semibold tracking-[0.3em] text-[#d4a853] uppercase mb-3">Quranic Studies</p>
                  <h2 id="quran-bestsellers-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">Best Selling Quran Copies</h2>
                </div>
                <Link href="/collections/quran" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white hover:border-slate-300 transition-all group">
                  View All Quran Books <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </AnimateOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categoryBestSellers.quran.map((product, i) => (
                <AnimateOnScroll key={product.id} delay={i * 50} animation="fade-up">
                  <ProductCard product={product} />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hadith Best Sellers */}
      {categoryBestSellers.hadith.length > 0 && (
        <section className="py-20 md:py-28 bg-[#f8f7f4]" aria-labelledby="hadith-bestsellers-heading">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <AnimateOnScroll animation="fade-up">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-semibold tracking-[0.3em] text-[#d4a853] uppercase mb-3">Prophetic Traditions</p>
                  <h2 id="hadith-bestsellers-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">Best Selling Hadith Books</h2>
                </div>
                <Link href="/collections/hadith" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white hover:border-slate-300 transition-all group">
                  View All Hadith Books <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </AnimateOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categoryBestSellers.hadith.map((product, i) => (
                <AnimateOnScroll key={product.id} delay={i * 50} animation="fade-up">
                  <ProductCard product={product} />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Prayer Best Sellers */}
      {categoryBestSellers.prayer.length > 0 && (
        <section className="py-20 md:py-28 bg-white" aria-labelledby="prayer-bestsellers-heading">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <AnimateOnScroll animation="fade-up">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-semibold tracking-[0.3em] text-[#d4a853] uppercase mb-3">Islamic Practice</p>
                  <h2 id="prayer-bestsellers-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">Best Selling Prayer Books</h2>
                </div>
                <Link href="/collections/prayer" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white hover:border-slate-300 transition-all group">
                  View All Prayer Books <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </AnimateOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categoryBestSellers.prayer.map((product, i) => (
                <AnimateOnScroll key={product.id} delay={i * 50} animation="fade-up">
                  <ProductCard product={product} />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fiqh Best Sellers */}
      {categoryBestSellers.fiqh.length > 0 && (
        <section className="py-20 md:py-28 bg-[#f8f7f4]" aria-labelledby="fiqh-bestsellers-heading">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <AnimateOnScroll animation="fade-up">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-semibold tracking-[0.3em] text-[#d4a853] uppercase mb-3">Islamic Jurisprudence</p>
                  <h2 id="fiqh-bestsellers-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">Best Selling Fiqh Books</h2>
                </div>
                <Link href="/collections/fiqh" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white hover:border-slate-300 transition-all group">
                  View All Fiqh Books <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </AnimateOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categoryBestSellers.fiqh.map((product, i) => (
                <AnimateOnScroll key={product.id} delay={i * 50} animation="fade-up">
                  <ProductCard product={product} />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Seerah Best Sellers */}
      {categoryBestSellers.seerah.length > 0 && (
        <section className="py-20 md:py-28 bg-white" aria-labelledby="seerah-bestsellers-heading">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <AnimateOnScroll animation="fade-up">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-semibold tracking-[0.3em] text-[#d4a853] uppercase mb-3">Prophet's Biography</p>
                  <h2 id="seerah-bestsellers-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">Best Selling Seerah Books</h2>
                </div>
                <Link href="/collections/seerah" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white hover:border-slate-300 transition-all group">
                  View All Seerah Books <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </AnimateOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categoryBestSellers.seerah.map((product, i) => (
                <AnimateOnScroll key={product.id} delay={i * 50} animation="fade-up">
                  <ProductCard product={product} />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Children Best Sellers */}
      {categoryBestSellers.children.length > 0 && (
        <section className="py-20 md:py-28 bg-[#f8f7f4]" aria-labelledby="children-bestsellers-heading">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <AnimateOnScroll animation="fade-up">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-semibold tracking-[0.3em] text-[#d4a853] uppercase mb-3">Young Readers</p>
                  <h2 id="children-bestsellers-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">Best Selling Kids Books</h2>
                </div>
                <Link href="/collections/children" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white hover:border-slate-300 transition-all group">
                  View All Kids Books <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </AnimateOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categoryBestSellers.children.map((product, i) => (
                <AnimateOnScroll key={product.id} delay={i * 50} animation="fade-up">
                  <ProductCard product={product} />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Biography Best Sellers */}
      {categoryBestSellers.biography.length > 0 && (
        <section className="py-20 md:py-28 bg-white" aria-labelledby="biography-bestsellers-heading">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <AnimateOnScroll animation="fade-up">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-semibold tracking-[0.3em] text-[#d4a853] uppercase mb-3">Life Stories</p>
                  <h2 id="biography-bestsellers-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">Best Selling Biography Books</h2>
                </div>
                <Link href="/collections/biography" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white hover:border-slate-300 transition-all group">
                  View All Biography Books <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </AnimateOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categoryBestSellers.biography.map((product, i) => (
                <AnimateOnScroll key={product.id} delay={i * 50} animation="fade-up">
                  <ProductCard product={product} />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Aqeedah Best Sellers */}
      {categoryBestSellers.aqeedah.length > 0 && (
        <section className="py-20 md:py-28 bg-[#f8f7f4]" aria-labelledby="aqeedah-bestsellers-heading">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <AnimateOnScroll animation="fade-up">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-semibold tracking-[0.3em] text-[#d4a853] uppercase mb-3">Islamic Beliefs</p>
                  <h2 id="aqeedah-bestsellers-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">Best Selling Aqeedah Books</h2>
                </div>
                <Link href="/collections/aqeedah" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white hover:border-slate-300 transition-all group">
                  View All Aqeedah Books <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </AnimateOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categoryBestSellers.aqeedah.map((product, i) => (
                <AnimateOnScroll key={product.id} delay={i * 50} animation="fade-up">
                  <ProductCard product={product} />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* History Best Sellers */}
      {categoryBestSellers.history.length > 0 && (
        <section className="py-20 md:py-28 bg-white" aria-labelledby="history-bestsellers-heading">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <AnimateOnScroll animation="fade-up">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-semibold tracking-[0.3em] text-[#d4a853] uppercase mb-3">Islamic Heritage</p>
                  <h2 id="history-bestsellers-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">Best Selling History Books</h2>
                </div>
                <Link href="/collections/history" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white hover:border-slate-300 transition-all group">
                  View All History Books <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </AnimateOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categoryBestSellers.history.map((product, i) => (
                <AnimateOnScroll key={product.id} delay={i * 50} animation="fade-up">
                  <ProductCard product={product} />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dawah Best Sellers */}
      {categoryBestSellers.dawah.length > 0 && (
        <section className="py-20 md:py-28 bg-[#f8f7f4]" aria-labelledby="dawah-bestsellers-heading">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <AnimateOnScroll animation="fade-up">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-semibold tracking-[0.3em] text-[#d4a853] uppercase mb-3">Call to Islam</p>
                  <h2 id="dawah-bestsellers-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">Best Selling Dawah Books</h2>
                </div>
                <Link href="/collections/dawah" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white hover:border-slate-300 transition-all group">
                  View All Dawah Books <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </AnimateOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categoryBestSellers.dawah.map((product, i) => (
                <AnimateOnScroll key={product.id} delay={i * 50} animation="fade-up">
                  <ProductCard product={product} />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Hajj & Umrah Best Sellers */}
      {categoryBestSellers["hajj-umrah"].length > 0 && (
        <section className="py-20 md:py-28 bg-white" aria-labelledby="hajj-umrah-bestsellers-heading">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <AnimateOnScroll animation="fade-up">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-semibold tracking-[0.3em] text-[#d4a853] uppercase mb-3">Sacred Journey</p>
                  <h2 id="hajj-umrah-bestsellers-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">Best Selling Hajj & Umrah Books</h2>
                </div>
                <Link href="/collections/hajj-umrah" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white hover:border-slate-300 transition-all group">
                  View All Hajj & Umrah Books <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </AnimateOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categoryBestSellers["hajj-umrah"].map((product, i) => (
                <AnimateOnScroll key={product.id} delay={i * 50} animation="fade-up">
                  <ProductCard product={product} />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Health Best Sellers */}
      {categoryBestSellers.health.length > 0 && (
        <section className="py-20 md:py-28 bg-[#f8f7f4]" aria-labelledby="health-bestsellers-heading">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <AnimateOnScroll animation="fade-up">
              <div className="flex items-end justify-between mb-12">
                <div>
                  <p className="text-xs font-semibold tracking-[0.3em] text-[#d4a853] uppercase mb-3">Wellness</p>
                  <h2 id="health-bestsellers-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">Best Selling Health Books</h2>
                </div>
                <Link href="/collections/health" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white hover:border-slate-300 transition-all group">
                  View All Health Books <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </AnimateOnScroll>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categoryBestSellers.health.map((product, i) => (
                <AnimateOnScroll key={product.id} delay={i * 50} animation="fade-up">
                  <ProductCard product={product} />
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Top Rated Products */}
      <section className="py-20 md:py-28 bg-white" aria-labelledby="top-rated-heading">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-semibold tracking-[0.3em] text-[#d4a853] uppercase mb-3">Customer Favorites</p>
                <h2 id="top-rated-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">Top Rated Products</h2>
              </div>
              <Link href="/collections" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white hover:border-slate-300 transition-all group">
                View All Products <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {topRated.map((product, i) => (
              <AnimateOnScroll key={product.id} delay={i * 50} animation="fade-up">
                <ProductCard product={product} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Most Reviewed Products */}
      <section className="py-20 md:py-28 bg-[#f8f7f4]" aria-labelledby="most-reviewed-heading">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-semibold tracking-[0.3em] text-[#d4a853] uppercase mb-3">Customer Reviews</p>
                <h2 id="most-reviewed-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">Most Reviewed Books</h2>
              </div>
              <Link href="/collections" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white hover:border-slate-300 transition-all group">
                View All Products <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {mostReviewed.map((product, i) => (
              <AnimateOnScroll key={product.id} delay={i * 50} animation="fade-up">
                <ProductCard product={product} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Quranic Verse */}
      <section className="py-24 md:py-32 gradient-dark-rich relative overflow-hidden" aria-label="Quranic inspiration">
        <div className="absolute inset-0 islamic-pattern opacity-[0.03]" />
        {/* Noor effects — divine light radiating from center */}
        <div className="noor-glow w-[700px] h-[700px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDuration: '10s' }} />
        <div className="noor-bubble w-[200px] h-[200px] top-[5%] right-[15%]" style={{ animationDelay: '2s' }} />
        <div className="noor-bubble w-[150px] h-[150px] bottom-[10%] left-[10%]" style={{ animationDelay: '4s' }} />
        <div className="noor-bubble-teal w-[180px] h-[180px] top-[30%] left-[5%]" style={{ animationDelay: '1s' }} />
        <div className="noor-sparkle top-[20%] left-[30%]" style={{ animationDelay: '0.5s' }} />
        <div className="noor-sparkle top-[40%] right-[25%]" style={{ animationDelay: '2s' }} />
        <div className="noor-sparkle bottom-[30%] left-[55%]" style={{ animationDelay: '3.5s' }} />
        <div className="noor-sparkle top-[15%] right-[40%]" style={{ animationDelay: '1s' }} />
        <div className="noor-ring w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDuration: '40s' }} />
        <div className="noor-ring w-[350px] h-[350px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDuration: '25s', animationDirection: 'reverse' }} />
        <AnimateOnScroll animation="fade-up">
          <div className="max-w-3xl mx-auto px-6 sm:px-8 text-center relative z-10">
            <div className="flex items-center justify-center gap-4 mb-10">
              <div className="w-20 h-px bg-gradient-to-r from-transparent to-[#d4a853]/20" />
              <div className="w-2 h-2 rotate-45 border border-[#d4a853]/20" />
              <Star className="w-4 h-4 text-[#d4a853]/20" />
              <div className="w-2 h-2 rotate-45 border border-[#d4a853]/20" />
              <div className="w-20 h-px bg-gradient-to-l from-transparent to-[#d4a853]/20" />
            </div>
            <p className="text-4xl md:text-6xl text-[#d4a853]/80 mb-6 font-[family-name:var(--font-playfair)] leading-relaxed" dir="rtl">
              اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
            </p>
            <p className="text-xl md:text-2xl text-slate-300 italic mb-3 font-light">
              &ldquo;Read in the name of your Lord who created&rdquo;
            </p>
            <p className="text-sm text-[#d4a853]/50 font-medium tracking-wider">— Surah Al-Alaq (96:1)</p>
            <div className="flex items-center justify-center gap-4 mt-10">
              <div className="w-20 h-px bg-gradient-to-r from-transparent to-[#d4a853]/20" />
              <div className="w-2 h-2 rotate-45 border border-[#d4a853]/20" />
              <Star className="w-4 h-4 text-[#d4a853]/20" />
              <div className="w-2 h-2 rotate-45 border border-[#d4a853]/20" />
              <div className="w-20 h-px bg-gradient-to-l from-transparent to-[#d4a853]/20" />
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* Promo Banners */}
      <section className="py-20 md:py-28 bg-white" aria-label="Featured collections">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <AnimateOnScroll animation="fade-up">
              <Link href="/collections/hajj-umrah" className="group relative overflow-hidden rounded-3xl h-80 md:h-96 block">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0d9488]/30 group-hover:scale-[1.03] transition-transform duration-700" />
                <div className="absolute inset-0 islamic-pattern opacity-[0.04]" />
                <div className="absolute top-0 right-0 w-60 h-60 bg-[#0d9488]/10 rounded-full blur-[80px]" />
                <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                  <span className="text-[#d4a853] text-[11px] font-semibold tracking-[0.25em] uppercase mb-3">Sacred Journey</span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight font-[family-name:var(--font-playfair)]">Hajj &amp; Umrah<br/>Collection</h3>
                  <p className="text-slate-400 text-sm mb-6 max-w-xs">Essential books, guides &amp; resources for your sacred journey.</p>
                  <span className="inline-flex items-center gap-2 text-[#d4a853] font-semibold text-sm group-hover:gap-3 transition-all w-fit">
                    Shop Hajj & Umrah Books <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-up" delay={100}>
              <Link href="/collections/children" className="group relative overflow-hidden rounded-3xl h-80 md:h-96 block">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a0e2e] via-[#2d1b69] to-[#d4a853]/10 group-hover:scale-[1.03] transition-transform duration-700" />
                <div className="absolute inset-0 islamic-pattern opacity-[0.04]" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#d4a853]/10 rounded-full blur-[80px]" />
                <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                  <span className="text-[#e8c97a] text-[11px] font-semibold tracking-[0.25em] uppercase mb-3">Young Readers</span>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight font-[family-name:var(--font-playfair)]">Children&apos;s<br/>Corner</h3>
                  <p className="text-slate-400 text-sm mb-6 max-w-xs">Beautiful Islamic stories and educational content for young readers.</p>
                  <span className="inline-flex items-center gap-2 text-[#e8c97a] font-semibold text-sm group-hover:gap-3 transition-all w-fit">
                    Explore Kids Islamic Books <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 md:py-28 bg-[#f8f7f4]" aria-labelledby="new-arrivals-heading">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-semibold tracking-[0.3em] text-[#d4a853] uppercase mb-3">Just Arrived</p>
                <h2 id="new-arrivals-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">New Arrivals</h2>
              </div>
              <Link href="/collections?filter=new" className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:bg-white hover:border-slate-300 transition-all group">
                View New Arrivals <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product, i) => (
              <AnimateOnScroll key={product.id} delay={i * 50} animation="fade-up">
                <ProductCard product={product} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 md:py-28 gradient-dark-teal relative overflow-hidden" aria-label="Our impact">
        <div className="absolute inset-0 islamic-pattern opacity-[0.03]" />
        {/* Noor effects */}
        <div className="noor-glow w-[400px] h-[400px] top-[-50px] right-[-50px]" style={{ animationDelay: '1s' }} />
        <div className="noor-bubble w-[250px] h-[250px] bottom-[-30px] left-[20%]" style={{ animationDelay: '3s' }} />
        <div className="noor-bubble-teal w-[200px] h-[200px] top-[30%] left-[-30px]" />
        <div className="noor-sparkle top-[20%] right-[30%]" style={{ animationDelay: '1s' }} />
        <div className="noor-sparkle bottom-[30%] left-[60%]" style={{ animationDelay: '2.5s' }} />
        <div className="noor-ring w-[350px] h-[350px] top-[-80px] right-[-80px]" style={{ animationDuration: '35s' }} />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold tracking-[0.3em] text-[#d4a853] uppercase mb-3">Our Impact</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-white font-[family-name:var(--font-playfair)]">Trusted by Thousands</h2>
            </div>
          </AnimateOnScroll>
          <StatsCounter />
        </div>
      </section>

      {/* Collections */}
      <section className="py-20 md:py-28 bg-white" aria-labelledby="collections-heading">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-14">
              <p className="text-xs font-semibold tracking-[0.3em] text-[#d4a853] uppercase mb-3">Curated</p>
              <h2 id="collections-heading" className="text-3xl sm:text-4xl font-bold text-slate-900 font-[family-name:var(--font-playfair)]">Browse Collections</h2>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
            {mainCollections.map((col, i) => (
              <AnimateOnScroll key={col.slug} delay={i * 60} animation="fade-up">
                <Link href={`/collections/${col.slug}`} className="group relative overflow-hidden rounded-2xl h-48 md:h-56 block">
                  <div className={`absolute inset-0 bg-gradient-to-br ${col.gradient} group-hover:scale-105 transition-transform duration-700`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5 font-[family-name:var(--font-playfair)]">{col.name}</h3>
                    <span className="inline-flex items-center gap-1 text-sm text-white/60 group-hover:text-white transition-colors font-medium">
                      Browse {col.name} <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 md:py-32 gradient-dark-warm relative overflow-hidden" aria-labelledby="newsletter-heading">
        <div className="absolute inset-0 islamic-pattern opacity-[0.03]" />
        {/* Noor effects */}
        <div className="noor-glow w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ animationDuration: '12s' }} />
        <div className="noor-bubble w-[200px] h-[200px] top-[10%] left-[15%]" style={{ animationDelay: '2s' }} />
        <div className="noor-bubble-teal w-[180px] h-[180px] bottom-[15%] right-[10%]" style={{ animationDelay: '5s' }} />
        <div className="noor-sparkle top-[25%] right-[20%]" style={{ animationDelay: '0.5s' }} />
        <div className="noor-sparkle bottom-[20%] left-[30%]" style={{ animationDelay: '2s' }} />
        <div className="noor-sparkle top-[50%] left-[15%]" style={{ animationDelay: '3.5s' }} />
        <div className="noor-ring w-[400px] h-[400px] bottom-[-100px] left-[-100px]" style={{ animationDuration: '50s' }} />
        <AnimateOnScroll animation="fade-up">
          <div className="max-w-lg mx-auto px-6 sm:px-8 text-center relative z-10">
            <div className="w-14 h-14 mx-auto mb-7 rounded-2xl bg-[#d4a853]/10 flex items-center justify-center border border-[#d4a853]/10">
              <Mail className="w-6 h-6 text-[#d4a853]" />
            </div>
            <h2 id="newsletter-heading" className="text-3xl sm:text-4xl font-bold text-white mb-4 font-[family-name:var(--font-playfair)]">Stay Updated</h2>
            <p className="text-slate-400 mb-10 text-sm leading-relaxed">Get notified about new arrivals, exclusive offers, and Islamic content.</p>
            <NewsletterSignup />
          </div>
        </AnimateOnScroll>
      </section>
    </>
  );
}
