import { siteConfig } from "./data-types";
import type { Metadata } from "next";

// ============================================
// SEO UTILITIES — JSON-LD Structured Data
// ============================================

export function generateSiteNavigationSchema() {
  const navItems = [
    { name: "Home", url: "/" },
    { name: "All Collections", url: "/collections" },
    { name: "Holy Quran", url: "/collections/quran" },
    { name: "Hadith Books", url: "/collections/hadith" },
    { name: "Prophet's Seerah", url: "/collections/seerah" },
    { name: "Islamic Fiqh", url: "/collections/fiqh" },
    { name: "Kids Islamic Books", url: "/collections/children" },
    { name: "Prayer & Supplication", url: "/collections/prayer" },
    { name: "Hajj & Umrah Essentials", url: "/collections/hajj-umrah" },
    { name: "Islamic Products", url: "/collections/islamic-products" },
    { name: "Best Sellers", url: "/collections?filter=bestseller" },
    { name: "Contact Us", url: "/contact" },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    "@id": `${siteConfig.url}/#navigation`,
    name: "Main Navigation",
    hasPart: navItems.map((item) => ({
      "@type": "WebPage",
      name: item.name,
      url: `${siteConfig.url}${item.url}`,
    })),
  };
}
// ============================================

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "Store"],
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/logo.svg`,
      width: 240,
      height: 80,
    },
    image: `${siteConfig.url}/og-image.jpg`,
    description: siteConfig.description,
    slogan: "Your Trusted Islamic Store — Books, Abaya, Tasbih, Zamzam & More",
    foundingDate: "2024",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Shop #50, Ground Floor, Big City Plaza, Gullberg III",
      addressLocality: "Lahore",
      addressRegion: "Punjab",
      postalCode: "54000",
      addressCountry: "PK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "31.5204",
      longitude: "74.3587",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phone,
        contactType: "customer service",
        email: siteConfig.email,
        availableLanguage: ["English", "Urdu", "Arabic"],
        areaServed: "PK",
      },
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phone,
        contactType: "sales",
        email: siteConfig.email,
        availableLanguage: ["English", "Urdu"],
      },
    ],
    sameAs: [
      siteConfig.social.facebook,
      siteConfig.social.instagram,
      siteConfig.social.youtube,
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "20:00",
    },
    priceRange: "$$",
    currenciesAccepted: "PKR",
    paymentAccepted: "Cash, Credit Card, Bank Transfer, JazzCash, EasyPaisa",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Islamic Products",
      itemListElement: [
        { "@type": "OfferCatalog", name: "Islamic Books" },
        { "@type": "OfferCatalog", name: "Abaya & Islamic Clothing" },
        { "@type": "OfferCatalog", name: "Tasbih & Prayer Accessories" },
        { "@type": "OfferCatalog", name: "Zamzam Water & Dates" },
        { "@type": "OfferCatalog", name: "Ihram & Hajj Essentials" },
        { "@type": "OfferCatalog", name: "Islamic Fragrances & Attar" },
        { "@type": "OfferCatalog", name: "Miswak & Natural Products" },
      ],
    },
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: ["en", "ur"],
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
    },
    potentialAction: [
      {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteConfig.url}/collections?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    ],
  };
}

export function generateProductSchema(product: {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  vendor: string;
  isbn?: string | null;
  inStock: boolean;
  language: string;
  author: string;
  category?: string;
  imageUrl?: string | null;
  images?: string[];
  reviews?: Array<{
    authorName: string;
    rating: number;
    comment: string;
    createdAt?: string;
  }>;
}) {
  const imageCandidates = Array.from(
    new Set([
      ...(product.imageUrl ? [product.imageUrl] : []),
      ...(product.images || []),
    ])
  ).slice(0, 10);

  const images = imageCandidates.map((img) =>
    img.startsWith("http://") || img.startsWith("https://")
      ? img
      : `${siteConfig.url}${img.startsWith("/") ? "" : "/"}${img}`
  );

  const reviews = (product.reviews || []).slice(0, 10).map((review) => ({
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: review.rating,
      bestRating: 5,
    },
    author: {
      "@type": "Person",
      name: review.authorName,
    },
    reviewBody: review.comment,
    datePublished: review.createdAt,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${siteConfig.url}/product/${product.slug}#product`,
    name: product.name,
    description: product.description,
    image: images.length > 0 ? images : [`${siteConfig.url}/og-image.jpg`],
    sku: product.id,
    mpn: product.isbn || product.id,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: product.vendor,
    },
    author: {
      "@type": "Person",
      name: product.author,
    },
    isbn: product.isbn,
    inLanguage: product.language,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "PKR",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: siteConfig.name,
      },
      url: `${siteConfig.url}/product/${product.slug}`,
      itemCondition: "https://schema.org/NewCondition",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "PK",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          businessDays: {
            "@type": "QuantitativeValue",
            minValue: 3,
            maxValue: 5,
          },
        },
      },
    },
    aggregateRating: product.reviewCount > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: product.rating,
          bestRating: 5,
          ratingCount: product.reviewCount,
        }
      : undefined,
    review: reviews.length > 0 ? reviews : undefined,
    url: `${siteConfig.url}/product/${product.slug}`,
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

export function generateCollectionSchema(
  name: string,
  description: string,
  slug: string,
  productCount: number
) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${name} — Buy Online at MyDeenMarket`,
    description,
    url: `${siteConfig.url}/collections/${slug}`,
    numberOfItems: productCount,
    provider: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: productCount,
      name,
    },
  };
}

export function generateCollectionItemListSchema(
  name: string,
  products: { name: string; slug: string; price: number }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 24).map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: product.name,
        url: `${siteConfig.url}/product/${product.slug}`,
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "PKR",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };
}

export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function generateItemListSchema(
  products: { name: string; slug: string; price: number; description: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.slice(0, 10).map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Product",
        name: product.name,
        url: `${siteConfig.url}/product/${product.slug}`,
        description: product.description.substring(0, 160),
        offers: {
          "@type": "Offer",
          price: product.price,
          priceCurrency: "PKR",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  };
}

export function generatePageMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || `${siteConfig.url}/og-image.jpg`;
  const ogTitle = `${title} | ${siteConfig.name}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: "en_US",
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          "max-image-preview": "large" as const,
          "max-snippet": -1,
          "max-video-preview": -1,
        },
  };
}
