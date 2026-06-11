import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import { getProducts, getCategories, getCollections } from "@/lib/data";
import { generateBreadcrumbSchema } from "@/lib/seo";

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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero */}
      <HeroSlider />

      {/* Trust Badges */}
      <section className="py-8 bg-[#FEFCF6] border-y border-[#C5A44E]/10 relative" aria-label="Why shop with us">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0", title: "Standard Delivery", desc: "3–5 working days" },
              { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Fast Dispatch", desc: "Shipped from Lahore" },
              { icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z", title: "Authentic Titles", desc: "Official publications" },
              { icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z", title: "Secure Checkout", desc: "SSL encrypted payments" },
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-3 group">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#0D503C] to-[#14785A] flex items-center justify-center shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#E8D5A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={badge.icon} />
                  </svg>
                </div>
                <div>
                  <strong className="text-xs sm:text-sm font-bold text-gray-900 block">{badge.title}</strong>
                  <span className="text-xs text-gray-500">{badge.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="py-14 md:py-20 bg-islamic-light relative" aria-labelledby="categories-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-bold tracking-[0.3em] text-[#C5A44E] uppercase mb-2 block">Explore</span>
              <h2 id="categories-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 section-title">
                Shop by Category
              </h2>
            </div>
            <Link href="/collections" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#0D503C] hover:text-[#C5A44E] transition-colors group">
              View All
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {mainCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/collections/${cat.slug}`}
                className="group relative bg-white rounded-xl border border-gray-100 p-5 sm:p-6 islamic-glow-hover transition-all duration-300 text-center overflow-hidden"
              >
                {/* Subtle pattern background */}
                <div className="absolute inset-0 islamic-pattern opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{cat.name}</h3>
                  <span className="text-xs text-[#C5A44E] font-medium">{cat.count}+ Books</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-14 md:py-20 relative overflow-hidden" aria-labelledby="bestsellers-heading">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A3D2E] to-[#0D503C]" />
        <div className="absolute inset-0 islamic-pattern-dark" />
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-40 h-40 rounded-full border border-[#C5A44E]/10 animate-rotate-slow" />
        <div className="absolute bottom-10 left-10 w-32 h-32 rounded-full border border-[#C5A44E]/8" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-bold tracking-[0.3em] text-[#C5A44E] uppercase mb-2 block">✦ Most Popular</span>
              <h2 id="bestsellers-heading" className="text-2xl sm:text-3xl font-bold text-white">
                Best Sellers
              </h2>
            </div>
            <Link href="/collections?filter=bestseller" className="flex items-center gap-1.5 text-sm font-semibold text-[#C5A44E] hover:text-[#E8D5A3] transition-colors group">
              View All
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Quranic Verse Banner */}
      <section className="py-16 md:py-20 bg-[#FEFCF6] relative overflow-hidden" aria-label="Quranic inspiration">
        <div className="absolute inset-0 islamic-stars opacity-30" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Arabesque ornament */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#C5A44E]/60" />
            <div className="w-3 h-3 rotate-45 border border-[#C5A44E]/40" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#C5A44E]/60" />
          </div>
          <p className="text-2xl md:text-3xl text-[#C5A44E] mb-4 font-serif leading-relaxed" dir="rtl">
            اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ
          </p>
          <p className="text-lg text-gray-700 italic mb-2">
            &ldquo;Read in the name of your Lord who created&rdquo;
          </p>
          <p className="text-sm text-[#C5A44E] font-medium">— Surah Al-Alaq (96:1)</p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#C5A44E]/60" />
            <div className="w-3 h-3 rotate-45 border border-[#C5A44E]/40" />
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#C5A44E]/60" />
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-14 md:py-20 bg-islamic-light" aria-label="Featured collections">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/collections/hajj-umrah" className="group relative overflow-hidden rounded-2xl h-64 md:h-72">
              <div className="absolute inset-0 bg-gradient-to-br from-[#0A3D2E] to-[#14785A] group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 islamic-pattern opacity-20" />
              <div className="relative h-full flex flex-col justify-center p-8 md:p-10">
                <span className="text-[#C5A44E] text-xs font-bold tracking-[0.2em] uppercase mb-2">Sacred Journey</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Hajj &amp; Umrah Collection</h3>
                <p className="text-white/70 text-sm md:text-base mb-5 max-w-sm">
                  Everything you need for your sacred journey — books, guides, Ahraam &amp; essentials
                </p>
                <span className="inline-flex items-center gap-2 text-[#E8D5A3] font-semibold text-sm border border-[#C5A44E]/30 rounded-full px-5 py-2 w-fit group-hover:bg-[#C5A44E] group-hover:text-[#0A3D2E] transition-all">
                  Shop Now
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
            <Link href="/collections/children" className="group relative overflow-hidden rounded-2xl h-64 md:h-72">
              <div className="absolute inset-0 bg-gradient-to-br from-[#2d1b69] to-[#5B3E96] group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 islamic-stars opacity-20" />
              <div className="relative h-full flex flex-col justify-center p-8 md:p-10">
                <span className="text-[#E8D5A3] text-xs font-bold tracking-[0.2em] uppercase mb-2">Young Readers</span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Children&apos;s Corner</h3>
                <p className="text-white/70 text-sm md:text-base mb-5 max-w-sm">
                  Beautiful Islamic stories, activity books, and educational content for young readers
                </p>
                <span className="inline-flex items-center gap-2 text-[#E8D5A3] font-semibold text-sm border border-[#C5A44E]/30 rounded-full px-5 py-2 w-fit group-hover:bg-[#C5A44E] group-hover:text-[#0A3D2E] transition-all">
                  Explore
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-14 md:py-20" aria-labelledby="new-arrivals-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-bold tracking-[0.3em] text-[#C5A44E] uppercase mb-2 block">Just Arrived</span>
              <h2 id="new-arrivals-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 section-title">
                New Arrivals
              </h2>
            </div>
            <Link href="/collections?filter=new" className="flex items-center gap-1.5 text-sm font-semibold text-[#0D503C] hover:text-[#C5A44E] transition-colors group">
              View All
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Browse Collections */}
      <section className="py-14 md:py-20 bg-[#FEFCF6] relative" aria-labelledby="collections-heading">
        <div className="absolute inset-0 islamic-pattern opacity-15" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-bold tracking-[0.3em] text-[#C5A44E] uppercase mb-2 block">Curated</span>
              <h2 id="collections-heading" className="text-2xl sm:text-3xl font-bold text-gray-900 section-title">
                Browse Collections
              </h2>
            </div>
            <Link href="/collections" className="flex items-center gap-1.5 text-sm font-semibold text-[#0D503C] hover:text-[#C5A44E] transition-colors group">
              View All
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {mainCollections.map((col) => (
              <Link
                key={col.slug}
                href={`/collections/${col.slug}`}
                className="group relative overflow-hidden rounded-xl h-40 md:h-48"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${col.gradient} group-hover:scale-110 transition-transform duration-500`} />
                <div className="absolute inset-0 islamic-pattern-dark opacity-30" />
                <div className="relative h-full flex flex-col justify-end p-5 md:p-6">
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1">{col.name}</h3>
                  <span className="text-sm text-[#E8D5A3] group-hover:text-[#C5A44E] transition-colors font-medium">
                    Shop Now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 md:py-20 relative overflow-hidden" aria-labelledby="newsletter-heading">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A3D2E] via-[#0D503C] to-[#0A3D2E]" />
        <div className="absolute inset-0 islamic-stars opacity-30" />
        {/* Decorative arches */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-b-full border border-[#C5A44E]/8" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-b-full border border-[#C5A44E]/5" />
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#C5A44E]/20 flex items-center justify-center border border-[#C5A44E]/20 animate-pulse-gold">
            <svg className="w-8 h-8 text-[#E8D5A3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 id="newsletter-heading" className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Stay Updated
          </h2>
          <p className="text-[#E8D5A3]/80 mb-8">
            Subscribe to our newsletter for new arrivals, exclusive offers, and Islamic content
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3 rounded-full text-sm bg-white/10 border border-[#C5A44E]/20 text-white placeholder-white/50 focus:outline-none focus:border-[#C5A44E]/50 focus:bg-white/15 transition-all"
              aria-label="Email address for newsletter"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-[#C5A44E] to-[#A08839] text-[#0A3D2E] rounded-full font-bold text-sm hover:from-[#D4AF37] hover:to-[#C5A44E] transition-all shadow-[0_4px_20px_rgba(197,164,78,0.3)]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
