"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { heroImages } from "@/lib/stock-images";

const slides = [
  {
    badge: "New Arrival",
    title: "Discover the Treasures of Islamic Knowledge",
    description:
      "Explore our curated collection of authentic Islamic books — from Quran translations to Hadith compilations.",
    cta: { text: "Shop Collection", href: "/collections" },
    arabicText: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    bgImage: heroImages[0],
  },
  {
    badge: "Best Seller",
    title: "Tib-e-Nabvi — Medicine of the Prophet ﷺ",
    description:
      "Now available in premium edition. A timeless guide to prophetic healing methods.",
    cta: { text: "View Book", href: "/product/tib-e-nabvi-latest" },
    arabicText: "وَنُنَزِّلُ مِنَ ٱلْقُرْآنِ مَا هُوَ شِفَآءٌ",
    bgImage: heroImages[1],
  },
  {
    badge: "Free Shipping",
    title: "Islamic Books for Young Readers",
    description:
      "Nurture young minds with beautiful Islamic stories and educational books for children.",
    cta: { text: "Explore", href: "/collections/children" },
    arabicText: "رَبِّ زِدْنِي عِلْمًا",
    bgImage: heroImages[2],
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrent(index);
      setTimeout(() => setIsAnimating(false), 700);
    },
    [isAnimating]
  );

  const next = useCallback(
    () => goTo((current + 1) % slides.length),
    [current, goTo]
  );

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section
      className="relative overflow-hidden bg-black"
      aria-label="Featured promotions"
    >
      {/* ═══ Slides Content (BEHIND noor effects) ═══ */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              i === current ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
            aria-hidden={i !== current}
          >
            <Image
              src={slide.bgImage.src}
              alt=""
              fill
              priority={i === 0}
              fetchPriority={i === 0 ? "high" : "low"}
              className="object-cover"
              quality={85}
              sizes="100vw"
            />
            {/* Dark overlay for text readability */}
            <div 
              className="absolute inset-0" 
              style={{ backgroundColor: slide.bgImage.overlayColor }}
            />
          </div>
        ))}
      </div>

      {/* ═══ Background Noor Effects (MIDDLE layer) ═══ */}
      <div className="absolute inset-0 z-5 pointer-events-none" aria-hidden="true">
        {/* Islamic geometric pattern */}
        <div className="absolute inset-0 islamic-pattern opacity-[0.08]" />

        {/* Noor breathing — central divine glow with adjusted colors */}
        <div className="noor-breathe w-[900px] h-[900px] top-1/2 left-[40%]" style={{ animationDuration: "10s", background: 'radial-gradient(circle, rgba(212,168,83,0.15) 0%, transparent 70%)' }} />
        <div className="noor-glow w-[600px] h-[600px] top-[20%] right-[-100px]" style={{ animationDuration: "12s", animationDelay: "3s", background: 'radial-gradient(circle, rgba(13,148,136,0.12) 0%, transparent 70%)' }} />

        {/* Drifting noor orbs */}
        <div className="noor-bubble w-[300px] h-[300px] top-[5%] right-[5%]" style={{ animationDelay: "0s", animationDuration: "14s", background: 'radial-gradient(circle, rgba(212,168,83,0.08) 0%, transparent 70%)' }} />
        <div className="noor-bubble w-[200px] h-[200px] bottom-[15%] left-[8%]" style={{ animationDelay: "3s", animationDuration: "16s", background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)' }} />
        <div className="noor-bubble-teal w-[250px] h-[250px] top-[10%] left-[50%]" style={{ animationDelay: "2s", background: 'radial-gradient(circle, rgba(13,148,136,0.1) 0%, transparent 70%)' }} />
        <div className="noor-bubble-teal w-[180px] h-[180px] bottom-[20%] right-[15%]" style={{ animationDelay: "5s", animationDuration: "20s", background: 'radial-gradient(circle, rgba(212,168,83,0.07) 0%, transparent 70%)' }} />

        {/* Sparkle particles */}
        <div className="noor-sparkle top-[12%] left-[18%]" style={{ animationDelay: "0s" }} />
        <div className="noor-sparkle top-[25%] right-[22%]" style={{ animationDelay: "1s" }} />
        <div className="noor-sparkle top-[55%] left-[12%]" style={{ animationDelay: "2s" }} />
        <div className="noor-sparkle bottom-[20%] right-[30%]" style={{ animationDelay: "3s" }} />
        <div className="noor-sparkle top-[35%] left-[45%]" style={{ animationDelay: "1.5s" }} />
        <div className="noor-sparkle bottom-[35%] left-[65%]" style={{ animationDelay: "2.5s" }} />

        {/* Rotating geometric rings */}
        <div className="noor-ring w-[500px] h-[500px] top-[5%] right-[-100px]" style={{ animationDuration: "50s", background: 'conic-gradient(from 0deg, rgba(212,168,83,0.1), transparent 50%)' }} />
        <div className="noor-ring w-[400px] h-[400px] bottom-[-80px] left-[-60px]" style={{ animationDuration: "40s", animationDirection: "reverse", background: 'conic-gradient(from 0deg, transparent 50%, rgba(13,148,136,0.08))' }} />
      </div>

      {/* ═══ Content Layer (FRONT) ═══ */}
      <div className="relative z-10 min-h-[520px] sm:min-h-[560px] md:min-h-[600px] lg:min-h-[680px] flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left — Text Content */}
            <div
              className={`transition-all duration-700 delay-100 ${
                "opacity-100 translate-y-0"
              }`}
            >
              {/* Arabic calligraphy */}
              <p
                className="text-[#d4a853] opacity-40 text-2xl md:text-3xl mb-6 font-[family-name:var(--font-playfair)]"
                dir="rtl"
                aria-hidden="true"
              >
                {slides[current].arabicText}
              </p>

              {/* Badge */}
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#d4a853]/15 border border-[#d4a853]/25 rounded-full text-[11px] font-semibold text-[#d4a853] tracking-widest uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#d4a853] animate-pulse" />
                {slides[current].badge}
              </span>

              {/* Title */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08] mb-6 font-[family-name:var(--font-playfair)] drop-shadow-lg">
                {slides[current].title}
              </h2>

              {/* Description */}
              <p className="text-slate-300 text-lg mb-10 max-w-lg leading-relaxed">
                {slides[current].description}
              </p>

              {/* CTAs */}
              <div className="flex items-center gap-5">
                <Link
                  href={slides[current].cta.href}
                  className="group inline-flex items-center gap-2.5 px-8 py-4 bg-[#d4a853] text-[#0f172a] rounded-full font-semibold text-sm hover:bg-[#e8c97a] transition-all duration-300 hover:shadow-[0_8px_40px_rgba(212,168,83,0.3)]"
                >
                  {slides[current].cta.text}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/collections"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Browse All →
                </Link>
              </div>
            </div>

            {/* Right — Decorative Panel */}
            <div className="hidden lg:flex justify-center">
              <div className="relative w-[320px] h-[420px]">
                {/* Noor glow behind panel */}
                <div
                  className="absolute inset-0 bg-[#d4a853]/[0.06] rounded-[2rem] blur-[60px] animate-pulse"
                  style={{ animationDuration: "6s" }}
                />
                {/* Outer border frames */}
                <div className="absolute inset-0 rounded-[2rem] border border-[#d4a853]/10" />
                <div className="absolute inset-3 rounded-[1.6rem] border border-[#d4a853]/[0.07]" />
                {/* Glow accents */}
                <div
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-40 h-12 bg-[#d4a853]/[0.08] rounded-full blur-2xl animate-pulse"
                  style={{ animationDuration: "5s" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Bottom gradient line ═══ */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4a853]/20 to-transparent z-10" />

      {/* ═══ Controls ═══ */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6">
        <button
          onClick={() => goTo((current - 1 + slides.length) % slides.length)}
          className="w-12 h-12 sm:w-10 sm:h-10 rounded-full border border-white/15 hover:border-[#d4a853]/40 flex items-center justify-center text-white/50 hover:text-[#d4a853] transition-all bg-white/5 hover:bg-white/10 backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all duration-500 ${
                i === current
                  ? "w-8 h-2.5 bg-[#d4a853]"
                  : "w-2.5 h-2.5 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === current ? "true" : undefined}
            />
          ))}
        </div>
        <button
          onClick={next}
          className="w-12 h-12 sm:w-10 sm:h-10 rounded-full border border-white/15 hover:border-[#d4a853]/40 flex items-center justify-center text-white/50 hover:text-[#d4a853] transition-all bg-white/5 hover:bg-white/10 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
