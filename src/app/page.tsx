import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import StatsCounter from "@/components/StatsCounter";
import { getProducts, getCategories, getCollections } from "@/lib/data";
import { generateBreadcrumbSchema } from "@/lib/seo";
import {
  Truck,
  Zap,
  ShieldCheck,
  Lock,
  BookOpen,
  Star,
  ArrowRight,
  Sparkles,
  Heart,
  Gift,
  Users,
  BookMarked,
  Scroll,
  Moon,
  ChevronRight,
  Mail,
  TrendingUp,
  Award,
  Package,
} from "lucide-react";

export default async function HomePage() {
  const [products, categories, collections] = await Promise.all([
    getProducts(),
    getCategories(),
    getCollections(),
  ]);
  const newArrivals = products.filter((p) => p.badge === "new");
  const mainCategories = categories.slice(0, 8);
  const mainCollections = collections.slice(0, 6);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
  ]);

  const categoryIcons = [BookOpen, BookMarked, Scroll, Moon, Heart, Gift, Users, Star];

  const trustBadges = [
    { icon: Truck, title: "Standard Delivery", desc: "3–5 working days" },
    { icon: Zap, title: "Fast Dispatch", desc: "Shipped from Lahore" },
    { icon: ShieldCheck, title: "Authentic Titles", desc: "Official publications" },
    { icon: Lock, title: "Secure Checkout", desc: "SSL encrypted payments" },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <HeroSlider />

      {/* ─── Trust Badges ─── */}
      <section className="py-10 bg-gradient-to-b from-[#FEFCF6] to-white border-y border-[#C5A44E]/10 relative" aria-label="Why shop with us">
        <div className="absolute inset-0 islamic-pattern opacity-15" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {trustBadges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <AnimateOnScroll key={i} delay={i * 100} animation="fade-up">
                  <div className="flex items-center gap-3.5 group p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-[#C5A44E]/10 hover:border-[#C5A44E]/25 hover:bg-white/90 transition-all duration-300 hover:shadow-lg hover:shadow-[#C5A44E]/5">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#0D503C] to-[#14785A] flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#E8D5A3]" />
                    </div>
                    <div>
                      <strong className="text-xs sm:text-sm font-bold text-gray-900 block">{badge.title}</strong>
                      <span className="text-xs text-gray-500">{badge.desc}</span>
                    </div>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Shop by Category ─── */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-[#FEFCF6] relative" aria-labelledby="categories-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.3em] text-[#C5A44E] uppercase mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Explore
                </span>
                <h2 id="categories-heading" className="text-2xl sm:text-4xl font-bold text-gray-900">
                  Shop by Category
                </h2>
              </div>
              <Link href="/collections" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#0D503C] hover:text-[#C5A44E] transition-colors group">
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {mainCategories.map((cat, i) => {
              const Icon = categoryIcons[i % categoryIcons.length];
              return (
                <AnimateOnScroll key={cat.slug} delay={i * 80} animation="scale">
                  <Link
                    href={`/collections/${cat.slug}`}
                    className="group relative bg-white rounded-2xl border border-gray-100/80 p-5 sm:p-6 transition-all duration-500 text-center overflow-hidden card-hover-lift"
                  >
                    {/* Hover glow */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#C5A44E]/5 to-[#0D503C]/5" />
                    <div className="absolute inset-0 islamic-pattern opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                        <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{cat.name}</h3>
                      <span className="text-xs text-[#C5A44E] font-medium">{cat.count}+ Books</span>
                    </div>
                  </Link>
                </AnimateOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Best Sellers ─── */}
      <section className="py-16 md:py-24 relative overflow-hidden" aria-labelledby="bestsellers-heading">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A3D2E] via-[#0D503C] to-[#0A3D2E]" />
        <div className="absolute inset-0 islamic-pattern-dark" />
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-48 h-48 rounded-full border border-[#C5A44E]/10 animate-rotate-slow" />
        <div className="absolute bottom-10 left-10 w-36 h-36 rounded-full border border-[#C5A44E]/8" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-[#C5A44E]/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimateOnScroll animation="fade-up">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.3em] text-[#C5A44E] uppercase mb-3">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Most Popular
                </span>
                <h2 id="bestsellers-heading" className="text-2xl sm:text-4xl font-bold text-white">
                  Best Sellers
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C5A44E]/15 border border-[#C5A44E]/25 text-[#E8D5A3] text-sm font-semibold animate-glow-pulse">
                  <Award className="w-4 h-4" />
                  8 Best Sellers
                </span>
                <Link href="/collections?filter=bestseller" className="flex items-center gap-1.5 text-sm font-semibold text-[#C5A44E] hover:text-[#E8D5A3] transition-colors group">
                  View All
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map((product, i) => (
              <AnimateOnScroll key={product.id} delay={i * 80} animation="fade-up">
                <ProductCard product={product} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Quranic Verse Banner ─── */}
      <section className="py-20 md:py-28 bg-[#FEFCF6] relative overflow-hidden" aria-label="Quranic inspiration">
        <div className="absolute inset-0 islamic-stars opacity-30 bg-parallax" />
        {/* Decorative arches */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-b-full border border-[#C5A44E]/6 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[550px] h-[275px] rounded-b-full border border-[#C5A44E]/4 pointer-events-none" />

        <AnimateOnScroll animation="scale">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Ornament top */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-20 h-px bg-gradient-to-r from-transparent to-[#C5A44E]/60" />
              <div className="w-2.5 h-2.5 rotate-45 border border-[#C5A44E]/40" />
              <Star className="w-4 h-4 text-[#C5A44E]/50 fill-[#C5A44E]/20" />
              <div className="w-2.5 h-2.5 rotate-45 border border-[#C5A44E]/40" />
              <div className="w-20 h-px bg-gradient-to-l from-transparent to-[#C5A44E]/60" />
            </div>

            <p className="text-3xl md:text-4xl text-[#C5A44E] mb-5 font-serif leading-relaxed" dir="rtl">
              اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
            </p>
            <p className="text-lg md:text-xl text-gray-700 italic mb-3 font-light">
              &ldquo;Read in the name of your Lord who created&rdquo;
            </p>
            <p className="text-sm text-[#C5A44E] font-semibold tracking-wide">— Surah Al-Alaq (96:1)</p>

            {/* Ornament bottom */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <div className="w-20 h-px bg-gradient-to-r from-transparent to-[#C5A44E]/60" />
              <div className="w-2.5 h-2.5 rotate-45 border border-[#C5A44E]/40" />
              <Star className="w-4 h-4 text-[#C5A44E]/50 fill-[#C5A44E]/20" />
              <div className="w-2.5 h-2.5 rotate-45 border border-[#C5A44E]/40" />
              <div className="w-20 h-px bg-gradient-to-l from-transparent to-[#C5A44E]/60" />
            </div>
          </div>
        </AnimateOnScroll>
      </section>

      {/* ─── Stats Counter ─── */}
      <section className="py-16 md:py-24 relative overflow-hidden" aria-label="Our impact">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A3D2E] via-[#0D503C] to-[#0A3D2E]" />
        <div className="absolute inset-0 islamic-pattern-dark" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#C5A44E]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#14785A]/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimateOnScroll animation="fade-up">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.3em] text-[#C5A44E] uppercase mb-3">
                <Package className="w-3.5 h-3.5" />
                Our Impact
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold text-white">
                Trusted by Thousands
              </h2>
            </div>
          </AnimateOnScroll>
          <StatsCounter />
        </div>
      </section>

      {/* ─── Promotional Banners ─── */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[#FEFCF6] to-white" aria-label="Featured collections">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimateOnScroll animation="fade-left">
              <Link href="/collections/hajj-umrah" className="group relative overflow-hidden rounded-2xl h-64 md:h-72 block">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A3D2E] to-[#14785A] group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 islamic-pattern opacity-20" />
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#C5A44E]/10 rounded-full blur-3xl group-hover:bg-[#C5A44E]/20 transition-colors duration-700" />
                <div className="relative h-full flex flex-col justify-center p-8 md:p-10">
                  <span className="text-[#C5A44E] text-xs font-bold tracking-[0.2em] uppercase mb-2">Sacred Journey</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Hajj &amp; Umrah Collection</h3>
                  <p className="text-white/70 text-sm md:text-base mb-5 max-w-sm">
                    Everything you need for your sacred journey — books, guides, Ahraam &amp; essentials
                  </p>
                  <span className="inline-flex items-center gap-2 text-[#E8D5A3] font-semibold text-sm border border-[#C5A44E]/30 rounded-full px-5 py-2.5 w-fit group-hover:bg-[#C5A44E] group-hover:text-[#0A3D2E] transition-all duration-300">
                    Shop Now
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </AnimateOnScroll>
            <AnimateOnScroll animation="fade-right">
              <Link href="/collections/children" className="group relative overflow-hidden rounded-2xl h-64 md:h-72 block">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2d1b69] to-[#5B3E96] group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 islamic-stars opacity-20" />
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#E8D5A3]/10 rounded-full blur-3xl group-hover:bg-[#E8D5A3]/20 transition-colors duration-700" />
                <div className="relative h-full flex flex-col justify-center p-8 md:p-10">
                  <span className="text-[#E8D5A3] text-xs font-bold tracking-[0.2em] uppercase mb-2">Young Readers</span>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Children&apos;s Corner</h3>
                  <p className="text-white/70 text-sm md:text-base mb-5 max-w-sm">
                    Beautiful Islamic stories, activity books, and educational content for young readers
                  </p>
                  <span className="inline-flex items-center gap-2 text-[#E8D5A3] font-semibold text-sm border border-[#C5A44E]/30 rounded-full px-5 py-2.5 w-fit group-hover:bg-[#C5A44E] group-hover:text-[#0A3D2E] transition-all duration-300">
                    Explore
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* ─── New Arrivals ─── */}
      <section className="py-16 md:py-24" aria-labelledby="new-arrivals-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimateOnScroll animation="fade-up">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.3em] text-[#C5A44E] uppercase mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  Just Arrived
                </span>
                <h2 id="new-arrivals-heading" className="text-2xl sm:text-4xl font-bold text-gray-900">
                  New Arrivals
                </h2>
              </div>
              <Link href="/collections?filter=new" className="flex items-center gap-1.5 text-sm font-semibold text-[#0D503C] hover:text-[#C5A44E] transition-colors group">
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product, i) => (
              <AnimateOnScroll key={product.id} delay={i * 80} animation="fade-up">
                <ProductCard product={product} />
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Browse Collections ─── */}
      <section className="py-16 md:py-24 bg-[#FEFCF6] relative" aria-labelledby="collections-heading">
        <div className="absolute inset-0 islamic-pattern opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimateOnScroll animation="fade-up">
            <div className="flex items-center justify-between mb-12">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.3em] text-[#C5A44E] uppercase mb-3">
                  <BookOpen className="w-3.5 h-3.5" />
                  Curated
                </span>
                <h2 id="collections-heading" className="text-2xl sm:text-4xl font-bold text-gray-900">
                  Browse Collections
                </h2>
              </div>
              <Link href="/collections" className="flex items-center gap-1.5 text-sm font-semibold text-[#0D503C] hover:text-[#C5A44E] transition-colors group">
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </AnimateOnScroll>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {mainCollections.map((col, i) => (
              <AnimateOnScroll key={col.slug} delay={i * 100} animation="scale">
                <Link
                  href={`/collections/${col.slug}`}
                  className="group relative overflow-hidden rounded-2xl h-44 md:h-52 block"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${col.gradient} group-hover:scale-110 transition-transform duration-700`} />
                  <div className="absolute inset-0 islamic-pattern-dark opacity-30" />
                  {/* Hover glow */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                  <div className="relative h-full flex flex-col justify-end p-5 md:p-7">
                    <h3 className="text-lg md:text-xl font-bold text-white mb-1.5">{col.name}</h3>
                    <span className="inline-flex items-center gap-1 text-sm text-[#E8D5A3] group-hover:text-[#C5A44E] transition-colors font-medium">
                      Shop Now
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Newsletter ─── */}
      <section className="py-20 md:py-28 relative overflow-hidden" aria-labelledby="newsletter-heading">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A3D2E] via-[#0D503C] to-[#0A3D2E]" />
        <div className="absolute inset-0 islamic-stars opacity-30" />
        {/* Decorative arches */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-b-full border border-[#C5A44E]/8 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-b-full border border-[#C5A44E]/5 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#C5A44E]/5 rounded-full blur-3xl" />

        <AnimateOnScroll animation="fade-up">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            {/* Glassmorphic card */}
            <div className="p-8 md:p-12 rounded-3xl bg-white/5 backdrop-blur-md border border-[#C5A44E]/15">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#C5A44E]/20 flex items-center justify-center border border-[#C5A44E]/20 animate-float">
                <Mail className="w-8 h-8 text-[#E8D5A3]" />
              </div>
              <h2 id="newsletter-heading" className="text-2xl sm:text-3xl font-bold text-white mb-3">
                Stay Updated
              </h2>
              <p className="text-[#E8D5A3]/80 mb-8 max-w-md mx-auto">
                Subscribe to our newsletter for new arrivals, exclusive offers, and Islamic content
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-5 py-3.5 rounded-full text-sm bg-white/10 border border-[#C5A44E]/20 text-white placeholder-white/50 focus:outline-none focus:border-[#C5A44E]/50 focus:bg-white/15 transition-all"
                  aria-label="Email address for newsletter"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-gradient-to-r from-[#C5A44E] to-[#A08839] text-[#0A3D2E] rounded-full font-bold text-sm hover:from-[#D4AF37] hover:to-[#C5A44E] transition-all shadow-[0_4px_20px_rgba(197,164,78,0.3)] hover:shadow-[0_8px_30px_rgba(197,164,78,0.4)] hover:scale-105"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </AnimateOnScroll>
      </section>
    </>
  );
}
