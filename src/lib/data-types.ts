// ============================================
// DATA TYPES & UTILITIES - Client-safe exports
// ============================================

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameUrdu?: string | null;
  author: string;
  vendor: string;
  price: number;
  compareAtPrice?: number | null;
  rating: number;
  reviewCount: number;
  category: string;
  categorySlug: string;
  badge?: string | null;
  description: string;
  features: string[];
  language: string;
  pages?: number | null;
  isbn?: string | null;
  weight?: string | null;
  dimensions?: string | null;
  inStock: boolean;
  gradient: string;
  icon: string;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
  icon: string;
  gradient: string;
  description: string;
}

export interface Collection {
  name: string;
  slug: string;
  gradient: string;
  description: string;
}

export const siteConfig = {
  name: "MyDeenMarket",
  title: "MyDeenMarket - Islamic Books, Quran, Hadith & More",
  description:
    "Pakistan's leading Islamic bookstore. Shop authentic Quran translations, Hadith collections, Seerah, Fiqh, children's Islamic books & more. Free shipping over Rs. 5,000.",
  url: "https://mydeenmarket.com",
  ogImage: "/og-image.jpg",
  address: "Shop #50, Ground Floor, Big City Plaza, Gullberg III, Lahore, Pakistan",
  email: "info@mydeenmarket.com",
  phone: "+92 303 5036392",
  hours: "Mon – Sat, 10 AM – 8 PM PKT",
  social: {
    facebook: "https://www.facebook.com/mydeenmarket",
    instagram: "https://www.instagram.com/mydeenmarket",
    youtube: "https://www.youtube.com/@mydeenmarket",
  },
  freeShippingThreshold: 5000,
};

export function formatPrice(price: number): string {
  return `Rs.${price.toLocaleString("en-PK")}`;
}
