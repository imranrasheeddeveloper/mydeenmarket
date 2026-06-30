import Link from "next/link";
import Image from "next/image";
import { siteConfig, getCategories } from "@/lib/data";

export default async function Footer() {
  const categories = await getCategories();
  const mainCategories = categories.slice(0, 7);

  return (
    <footer className="relative" role="contentinfo">
      <div className="gradient-dark-islamic text-slate-300 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d5d4f 0%, #1a3d3a 50%, #0a4a42 100%)' }}>
        <div className="absolute inset-0 islamic-pattern-dark" />
        {/* Noor effects */}
        <div className="noor-glow w-[400px] h-[400px] top-[-100px] right-[-50px]" style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)' }} />
        <div className="noor-bubble w-[250px] h-[250px] bottom-[20%] left-[-40px]" style={{ animationDelay: '3s', background: 'radial-gradient(circle, rgba(13,148,136,0.08) 0%, transparent 70%)' }} />
        <div className="noor-bubble-teal w-[200px] h-[200px] top-[40%] right-[5%]" style={{ animationDelay: '1s', background: 'radial-gradient(circle, rgba(212,168,83,0.06) 0%, transparent 70%)' }} />
        <div className="noor-sparkle top-[15%] left-[25%]" style={{ animationDelay: '1s' }} />
        <div className="noor-sparkle bottom-[30%] right-[20%]" style={{ animationDelay: '2.5s' }} />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-18 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* About Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center mb-4" aria-label="MyDeenMarket Home">
              <Image src="/logo.svg" alt="MyDeenMarket logo" width={220} height={60} className="h-11 w-auto" />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Your trusted Islamic bookstore. Bringing authentic Islamic knowledge through books,
              resources, and products. Shop Quran, Hadith, Seerah, and more in Arabic, English, Urdu,
              and other languages.
            </p>
            <address className="not-italic space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <svg className="w-4 h-4 mt-0.5 text-[#d4a853] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{siteConfig.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#d4a853] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-[#d4a853] transition-colors">
                  {siteConfig.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#d4a853] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`} className="hover:text-[#d4a853] transition-colors">
                  {siteConfig.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-4 h-4 text-[#d4a853] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{siteConfig.hours}</span>
              </div>
            </address>
            <div className="flex items-center gap-3 mt-6">
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-[#d4a853]/20 hover:bg-[#d4a853]/20 hover:border-[#d4a853]/40 flex items-center justify-center transition-all"
                aria-label="Follow us on Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-[#d4a853]/20 hover:bg-[#d4a853]/20 hover:border-[#d4a853]/40 flex items-center justify-center transition-all"
                aria-label="Follow us on Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a
                href={siteConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 border border-[#d4a853]/20 hover:bg-[#d4a853]/20 hover:border-[#d4a853]/40 flex items-center justify-center transition-all"
                aria-label="Subscribe on YouTube"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          {/* Shop by Category */}
          <div>
            <h3 className="text-[#d4a853] font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-[#d4a853]/40" />
              Shop by Category
            </h3>
            <ul className="space-y-2.5">
              {mainCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/collections/${cat.slug}`}
                    className="text-sm text-slate-400 hover:text-[#d4a853] transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Who We Are */}
          <div>
            <h3 className="text-[#d4a853] font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-[#d4a853]/40" />
              Who We Are
            </h3>
            <ul className="space-y-2.5">
              <li><Link href="/about" className="text-sm text-slate-400 hover:text-[#d4a853] transition-colors">About Us</Link></li>
              <li><Link href="/faq" className="text-sm text-slate-400 hover:text-[#d4a853] transition-colors">FAQ</Link></li>
              <li><Link href="/policies/shipping" className="text-sm text-slate-400 hover:text-[#d4a853] transition-colors">Shipment and Refund Policy</Link></li>
              <li><Link href="/policies/terms" className="text-sm text-slate-400 hover:text-[#d4a853] transition-colors">Terms &amp; Services</Link></li>
              <li><Link href="/policies/privacy" className="text-sm text-slate-400 hover:text-[#d4a853] transition-colors">Privacy and Cookies Policy</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-400 hover:text-[#d4a853] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* My Account */}
          <div>
            <h3 className="text-[#d4a853] font-bold text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-[#d4a853]/40" />
              My Account
            </h3>
            <ul className="space-y-2.5">
              <li><Link href="/account" className="text-sm text-slate-400 hover:text-[#d4a853] transition-colors">Orders</Link></li>
              <li><Link href="/account" className="text-sm text-slate-400 hover:text-[#d4a853] transition-colors">Profile</Link></li>
            </ul>
          </div>
        </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#d4a853]/10" style={{ background: 'linear-gradient(90deg, #0a3a35 0%, #0d4a42 50%, #0a3a35 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} MyDeenMarket. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-slate-600 uppercase tracking-wider mr-2">We Accept</span>
            <svg className="w-8 h-5 text-[#d4a853]/40" viewBox="0 0 38 24" fill="currentColor"><rect width="38" height="24" rx="3" fill="currentColor" opacity="0.3"/><text x="19" y="15" textAnchor="middle" fontSize="8" fill="white">VISA</text></svg>
            <svg className="w-8 h-5 text-[#d4a853]/40" viewBox="0 0 38 24" fill="currentColor"><rect width="38" height="24" rx="3" fill="currentColor" opacity="0.3"/><text x="19" y="15" textAnchor="middle" fontSize="6" fill="white">MC</text></svg>
            <svg className="w-8 h-5 text-[#d4a853]/40" viewBox="0 0 38 24" fill="currentColor"><rect width="38" height="24" rx="3" fill="currentColor" opacity="0.3"/><text x="19" y="15" textAnchor="middle" fontSize="6" fill="white">COD</text></svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
