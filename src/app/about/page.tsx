import Link from "next/link";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/data-types";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about MyDeenMarket, your trusted Islamic bookstore offering authentic Islamic books, resources, and products.",
  openGraph: {
    title: "About Us",
    description: "Learn about MyDeenMarket's mission and values.",
    url: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#0d5d4f] to-[#1a3d3a] text-white py-20 md:py-28">
        <div className="absolute inset-0 islamic-pattern-dark opacity-20" />
        <div className="noor-glow w-[500px] h-[500px] top-[-100px] right-[-100px]" style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.1) 0%, transparent 70%)' }} />
        <div className="noor-bubble w-[300px] h-[300px] bottom-[10%] left-[-50px]" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center leading-tight">
            About <span className="text-[#d4a853]">MyDeenMarket</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto text-center">
            Your trusted Islamic bookstore bringing authentic Islamic knowledge and products to Muslims worldwide
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                MyDeenMarket was founded with a simple yet powerful vision: to make authentic Islamic knowledge and quality Islamic products accessible to every Muslim, regardless of location or background.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed mb-4">
                Based in Lahore, Pakistan, we curate the finest collection of Islamic books including Quranic studies, Hadith, Seerah, Tafseer, Fiqh, and Islamic history from trusted publishers worldwide.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Beyond books, we offer authentic Islamic products like prayer mats (Janamaz), prayer beads (Tasbih), Zamzam water, traditional remedies (Tib-e-Nabvi), and more—all designed to help Muslims deepen their faith and practice.
              </p>
            </div>
            <div className="relative h-96 bg-gradient-to-br from-[#d4a853] to-[#0d9488] rounded-2xl p-8 text-white flex items-center justify-center">
              <div className="text-center">
                <svg className="w-24 h-24 mx-auto mb-4 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
                <h3 className="text-2xl font-bold mb-2">Serving Since 2024</h3>
                <p className="text-sm opacity-90">Building Islamic understanding through authentic sources for thousands of happy customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0f172a] mb-16">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "✨",
                title: "Authenticity First",
                description: "Every book and product is carefully vetted to ensure it aligns with Quran and Sunnah. We source from trusted Islamic scholars and publishers.",
              },
              {
                icon: "📦",
                title: "Quality & Reliability",
                description: "We guarantee the quality of every product and provide transparent, reliable service with fast shipping across Pakistan.",
              },
              {
                icon: "🌍",
                title: "Community Focused",
                description: "We serve thousands of Muslims seeking Islamic knowledge. Our goal is to strengthen the Ummah through access to authentic resources.",
              },
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-[#0f172a] mb-3">{value.title}</h3>
                <p className="text-slate-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-12">Why Choose MyDeenMarket?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              "500+ Islamic books in Arabic, English, Urdu & regional languages",
              "Authentic products directly sourced from trusted publishers & suppliers",
              "Competitive pricing with frequent offers on bestsellers",
              "FREE shipping on orders over Rs. 5,000 across Pakistan",
              "Multiple payment options including Cash on Delivery",
              "Expert team to guide you in finding the right Islamic resources",
              "Regular new arrivals and curated collections for all levels",
              "Located in Lahore with physical presence for trust & accountability",
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#d4a853]/20 text-[#d4a853]">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <p className="text-slate-700 font-medium">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#0d5d4f] to-[#1a3d3a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Have Questions?</h2>
          <p className="text-lg text-slate-300 mb-8">
            We'd love to hear from you. Get in touch with our team for any inquiries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-[#d4a853] text-[#0f172a] font-bold hover:bg-[#b8933f] transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 rounded-lg border border-white text-white font-bold hover:bg-white/10 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
