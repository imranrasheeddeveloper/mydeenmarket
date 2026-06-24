import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// Curated category data with stock-style imagery
const categories = [
  {
    slug: "quran",
    name: "Quran",
    label: "Holy Quran",
    tagline: "Translations, Tafseer & Recitation",
    image: "/uploads/categories/quran-islamic.jpg",
    featured: true, // large card
  },
  {
    slug: "hadith",
    name: "Hadith",
    label: "Hadith Collections",
    tagline: "Prophetic Traditions",
    image: "/uploads/categories/hadith-islamic.jpg",
    featured: true,
  },
  {
    slug: "seerah",
    name: "Prophet's Seerah",
    label: "Seerah",
    tagline: "Life of the Prophet ﷺ",
    image: "/uploads/categories/seerah-islamic.jpg",
    featured: false,
  },
  {
    slug: "fiqh",
    name: "Fiqh",
    label: "Islamic Jurisprudence",
    tagline: "Rulings & Principles",
    image: "/uploads/categories/fiqh-islamic.jpg",
    featured: false,
  },
  {
    slug: "children",
    name: "Kids / Children",
    label: "Children's Books",
    tagline: "Islamic Stories & Learning",
    image: "/uploads/categories/children-islamic.jpg",
    featured: false,
  },
  {
    slug: "biography",
    name: "Biography",
    label: "Islamic Biographies",
    tagline: "Scholars & Companions",
    image: "/uploads/categories/biography-islamic.jpg",
    featured: false,
  },
  {
    slug: "aqeedah",
    name: "Faith / Aqeedah",
    label: "Aqeedah",
    tagline: "Belief & Theology",
    image: "/uploads/categories/aqeedah-islamic.jpg",
    featured: false,
  },
  {
    slug: "health",
    name: "Health / Prophetic Medicine",
    label: "Prophetic Medicine",
    tagline: "Healing & Wellness",
    image: "/uploads/categories/health-islamic.jpg",
    featured: false,
  },
  {
    slug: "prayer",
    name: "Prayer / Supplication",
    label: "Prayer & Dua",
    tagline: "Salah, Dhikr & Dua",
    image: "/uploads/categories/prayer-islamic.jpg",
    featured: false,
  },
  {
    slug: "hajj-umrah",
    name: "Hajj / Umrah",
    label: "Hajj & Umrah",
    tagline: "Guides for the Sacred Journey",
    image: "/uploads/categories/hajj-umrah-islamic.jpg",
    featured: false,
  },
];

export default function CategoryGallery() {
  const featured = categories.filter((c) => c.featured);
  const regular = categories.filter((c) => !c.featured);

  return (
    <section className="py-16 md:py-24 bg-[#0d1b2a]" aria-labelledby="cat-gallery-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-[#d4a853] uppercase mb-2">
              Our Collection
            </p>
            <h2
              id="cat-gallery-heading"
              className="text-3xl sm:text-4xl font-bold text-white font-[family-name:var(--font-playfair)]"
            >
              Explore Islamic Books &amp;{" "}
              <em className="not-italic text-[#d4a853]">Lifestyle</em>
            </h2>
            <p className="text-slate-400 text-sm mt-2 max-w-lg">
              From Quranic sciences to children&apos;s stories — every category curated with care.
            </p>
          </div>
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 self-start md:self-auto px-5 py-2.5 rounded-full border border-white/20 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            View all categories
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* ── Featured row (Quran + Hadith) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {featured.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/collections/${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl block"
              style={{ aspectRatio: "16/9" }}
            >
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Stronger readability layer */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/15" />
              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="rounded-xl bg-black/45 backdrop-blur-sm border border-white/15 p-4">
                  <span className="text-[#f2d38f] text-xs font-semibold tracking-widest uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                  {cat.tagline}
                  </span>
                  <h3 className="text-white text-2xl font-bold font-[family-name:var(--font-playfair)] mt-1 drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                    {cat.label}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 text-white text-sm font-semibold mt-1.5 group-hover:text-[#f2d38f] transition-colors drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                    Shop Now <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Regular grid (8 categories) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {regular.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/collections/${cat.slug}`}
              className="group relative overflow-hidden rounded-xl block"
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              {/* Stronger readability layer */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10" />
              {/* Content */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="rounded-lg bg-black/50 backdrop-blur-sm border border-white/10 px-3 py-2.5">
                  <h3 className="text-white text-sm sm:text-base font-bold leading-tight font-[family-name:var(--font-playfair)] drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
                    {cat.label}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[#f2d38f] text-xs font-semibold mt-1.5 group-hover:gap-2 transition-all drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
                    Browse <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
              {/* Hover shine */}
              <div className="absolute inset-0 bg-[#d4a853]/0 group-hover:bg-[#d4a853]/5 transition-colors duration-300" />
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
