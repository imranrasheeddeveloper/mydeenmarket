"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const slides = [
  {
    badge: "NEW ARRIVAL",
    title: "Discover the Treasures of Islamic Knowledge",
    description: "Explore our extensive collection of authentic Islamic books, from Quran translations to Hadith compilations",
    cta: { text: "Shop Now", href: "/collections" },
    bookTitle: "The Sealed Nectar",
    bookAuthor: "Ar-Raheeq Al-Makhtum",
    gradient: "from-[#0A3D2E] via-[#0D503C] to-[#14785A]",
    bookColor: "from-[#C5A44E] to-[#E8D5A3]",
    arabicText: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
  },
  {
    badge: "BEST SELLER",
    title: "Tib-e-Nabvi Collection",
    description: "Healing with the Medicine of the Prophet ﷺ — now available in premium edition",
    cta: { text: "View Book", href: "/product/tib-e-nabvi-latest" },
    bookTitle: "Tib-e-Nabvi",
    bookAuthor: "Ibn al-Qayyim",
    gradient: "from-[#1a1a2e] via-[#16213e] to-[#0f3460]",
    bookColor: "from-[#E8D5A3] to-[#C5A44E]",
    arabicText: "وَنُنَزِّلُ مِنَ ٱلْقُرْآنِ مَا هُوَ شِفَآءٌ",
  },
  {
    badge: "FREE SHIPPING",
    title: "Kids & Children Books",
    description: "Nurture young minds with our beautiful collection of Islamic stories and educational books for children",
    cta: { text: "Explore", href: "/collections/children" },
    bookTitle: "Stories of the Prophets",
    bookAuthor: "For Children",
    gradient: "from-[#2d1b69] via-[#44318D] to-[#5B3E96]",
    bookColor: "from-[#C5A44E] to-[#E8D5A3]",
    arabicText: "رَبِّ زِدْنِي عِلْمًا",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 600);
  }, [isAnimating]);

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo]);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative overflow-hidden" aria-label="Featured promotions">
      <div className="relative h-[420px] sm:h-[480px] md:h-[520px] lg:h-[580px]">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              i === current ? "opacity-100 translate-x-0" : i < current ? "opacity-0 -translate-x-full" : "opacity-0 translate-x-full"
            }`}
            aria-hidden={i !== current}
          >
            <div className={`h-full bg-gradient-to-br ${slide.gradient} relative`}>
              {/* Islamic geometric pattern overlay */}
              <div className="absolute inset-0 islamic-pattern opacity-30" />
              
              {/* Decorative geometric circles */}
              <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border border-[#C5A44E]/10 animate-rotate-slow" />
              <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full border border-[#C5A44E]/15" />
              <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full border border-[#C5A44E]/8 animate-rotate-slow" style={{ animationDirection: "reverse" }} />
              
              {/* Gold sparkle dots */}
              <div className="absolute top-[20%] right-[15%] w-1.5 h-1.5 rounded-full bg-[#C5A44E]/60 animate-sparkle" />
              <div className="absolute top-[40%] right-[25%] w-1 h-1 rounded-full bg-[#C5A44E]/40 animate-sparkle" style={{ animationDelay: "0.5s" }} />
              <div className="absolute top-[60%] right-[10%] w-1.5 h-1.5 rounded-full bg-[#C5A44E]/50 animate-sparkle" style={{ animationDelay: "1s" }} />
              <div className="absolute bottom-[30%] left-[5%] w-1 h-1 rounded-full bg-[#C5A44E]/30 animate-sparkle" style={{ animationDelay: "1.5s" }} />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center w-full">
                  {/* Text */}
                  <div className={`transition-all duration-700 delay-200 ${i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    {/* Arabic text ornament */}
                    <p className="text-[#C5A44E]/60 text-lg md:text-xl mb-3 font-serif" dir="rtl" aria-hidden="true">
                      {slide.arabicText}
                    </p>
                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#C5A44E]/20 backdrop-blur-sm rounded-full text-xs font-bold text-[#E8D5A3] tracking-wider mb-4 border border-[#C5A44E]/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C5A44E] animate-pulse" />
                      {slide.badge}
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                      {slide.title}
                    </h2>
                    <p className="text-white/70 text-base sm:text-lg mb-8 max-w-lg leading-relaxed">
                      {slide.description}
                    </p>
                    <Link
                      href={slide.cta.href}
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#C5A44E] to-[#A08839] text-[#0A3D2E] rounded-full font-bold text-sm hover:from-[#D4AF37] hover:to-[#C5A44E] transition-all shadow-[0_4px_20px_rgba(197,164,78,0.3)] hover:shadow-[0_4px_30px_rgba(197,164,78,0.5)]"
                    >
                      {slide.cta.text}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>

                  {/* Book Display */}
                  <div className={`hidden md:flex justify-center transition-all duration-700 delay-300 ${i === current ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-12 scale-95"}`}>
                    <div className="relative">
                      {/* Decorative Islamic arch behind book */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-72 h-80 rounded-t-[50%] border-2 border-[#C5A44E]/15 -z-10" />
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-64 h-76 rounded-t-[50%] border border-[#C5A44E]/10 -z-10" />
                      
                      {/* Shadow */}
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-40 h-6 bg-black/30 rounded-full blur-xl" />
                      {/* Book */}
                      <div className="relative w-48 h-64 lg:w-56 lg:h-72 perspective-[800px] animate-float-slow">
                        <div className="w-full h-full transform rotate-y-[-8deg] preserve-3d">
                          <div className={`w-full h-full bg-gradient-to-br ${slide.bookColor} rounded-r-lg rounded-l-sm shadow-2xl flex flex-col items-center justify-center p-6 relative overflow-hidden`}>
                            {/* Book spine effect */}
                            <div className="absolute left-0 top-0 bottom-0 w-3 bg-black/15" />
                            <div className="absolute left-3 top-0 bottom-0 w-px bg-black/5" />
                            {/* Gold border */}
                            <div className="absolute inset-2 border border-[#0A3D2E]/20 rounded-sm" />
                            {/* Content */}
                            <div className="text-center relative z-10">
                              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#0A3D2E]/20 flex items-center justify-center border border-[#0A3D2E]/10">
                                <svg className="w-7 h-7 text-[#0A3D2E]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                              </div>
                              <p className="text-sm font-bold text-[#0A3D2E] leading-tight mb-1">{slide.bookTitle}</p>
                              <p className="text-xs text-[#0A3D2E]/60">{slide.bookAuthor}</p>
                            </div>
                            {/* Decorative lines */}
                            <div className="absolute bottom-6 left-6 right-6 space-y-1.5">
                              <div className="h-px bg-[#0A3D2E]/10" />
                              <div className="h-px bg-[#0A3D2E]/10" />
                              <div className="h-px bg-[#0A3D2E]/10 w-2/3" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom gold line */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C5A44E]/40 to-transparent" />
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
        <button
          onClick={() => goTo((current - 1 + slides.length) % slides.length)}
          className="w-9 h-9 rounded-full bg-[#C5A44E]/20 backdrop-blur-sm hover:bg-[#C5A44E]/40 flex items-center justify-center text-[#E8D5A3] transition-colors border border-[#C5A44E]/20"
          aria-label="Previous slide"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current ? "w-8 h-2.5 bg-gradient-to-r from-[#C5A44E] to-[#E8D5A3]" : "w-2.5 h-2.5 bg-[#C5A44E]/30 hover:bg-[#C5A44E]/50"
              }`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current ? "true" : undefined}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="w-9 h-9 rounded-full bg-[#C5A44E]/20 backdrop-blur-sm hover:bg-[#C5A44E]/40 flex items-center justify-center text-[#E8D5A3] transition-colors border border-[#C5A44E]/20"
          aria-label="Next slide"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
