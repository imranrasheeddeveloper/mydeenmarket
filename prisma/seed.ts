import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import bcrypt from "bcryptjs";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Site Config ───
  await prisma.siteConfig.upsert({
    where: { id: "main" },
    update: {},
    create: {
      id: "main",
      name: "MyDeenMarket",
      title: "MyDeenMarket - Islamic Books, Quran, Hadith & More",
      description:
        "Pakistan's leading Islamic bookstore. Shop authentic Quran translations, Hadith collections, Seerah, Fiqh, children's Islamic books & more. Free shipping over Rs. 5,000.",
      url: "https://mydeenmarket.com",
      address: "Shop #50, Ground Floor, Big City Plaza, Gullberg III, Lahore, Pakistan",
      email: "info@mydeenmarket.com",
      phone: "+92 303 5036392",
      hours: "Mon – Sat, 10 AM – 8 PM PKT",
      freeShippingThreshold: 5000,
      socialFacebook: "https://www.facebook.com/mydeenmarket",
      socialInstagram: "https://www.instagram.com/mydeenmarket",
      socialYoutube: "https://www.youtube.com/@mydeenmarket",
    },
  });
  console.log("  ✅ Site config");

  // ─── Users ───
  await prisma.user.upsert({
    where: { email: "admin@mydeenmarket.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@mydeenmarket.com",
      password: bcrypt.hashSync("admin123", 10),
      role: "admin",
      provider: "credentials",
    },
  });
  console.log("  ✅ Users (admin)");

  // ─── Categories ───
  const categoriesData = [
    { name: "Quran", slug: "quran", count: 120, icon: "book-quran", gradient: "from-emerald-900 to-emerald-600", description: "Explore our extensive collection of Quran translations, Tafseer, and Tajweed guides." },
    { name: "Qaida / Nazra", slug: "qaida-nazra", count: 40, icon: "book", gradient: "from-emerald-800 to-cyan-600", description: "Noorani Qaida, Qurani Qaida, and Nazra learning books for beginners and kids." },
    { name: "Hadith", slug: "hadith", count: 85, icon: "book-open", gradient: "from-sky-900 to-sky-600", description: "Authentic Hadith collections including Sahih Bukhari, Sahih Muslim, and other renowned compilations." },
    { name: "Prayer / Supplication", slug: "prayer", count: 60, icon: "hands-praying", gradient: "from-purple-900 to-purple-600", description: "Books on Salah, Duas, Fortress of the Muslim, and guides to perfecting your prayer and supplications." },
    { name: "Prophet's Seerah", slug: "seerah", count: 45, icon: "star-and-crescent", gradient: "from-amber-900 to-amber-600", description: "The life and biography of Prophet Muhammad ﷺ — from The Sealed Nectar to comprehensive Seerah collections." },
    { name: "Fiqh", slug: "fiqh", count: 70, icon: "scale-balanced", gradient: "from-orange-900 to-orange-600", description: "Islamic jurisprudence covering all schools of thought — Hanafi, Shafi'i, Maliki, and Hanbali." },
    { name: "Kids / Children", slug: "children", count: 95, icon: "children", gradient: "from-blue-700 to-blue-400", description: "Beautiful Islamic stories, activity books, and educational content designed to nurture young Muslim minds." },
    { name: "Biography", slug: "biography", count: 50, icon: "user-pen", gradient: "from-green-700 to-green-400", description: "Biographies of the Sahaba, scholars, and great personalities in Islamic history." },
    { name: "Islamic Products", slug: "islamic-products", count: 40, icon: "mosque", gradient: "from-violet-700 to-violet-400", description: "Calligraphy, prayer mats, Attar, dates, Zamzam water, and other Islamic essentials." },
    { name: "Faith / Aqeedah", slug: "aqeedah", count: 35, icon: "heart", gradient: "from-rose-800 to-rose-500", description: "Strengthen your faith with books on Islamic creed, Tawheed, and foundational beliefs." },
    { name: "Islamic Studies", slug: "islamic-studies", count: 30, icon: "atom", gradient: "from-cyan-800 to-indigo-600", description: "Research-driven Islamic books including civilization studies, notable Muslim personalities, and science-related topics in light of the Quran and Sunnah." },
    { name: "History", slug: "history", count: 40, icon: "landmark", gradient: "from-stone-800 to-stone-500", description: "Islamic history from the early caliphates to the Ottoman era — battles, civilizations, and scholarship." },
    { name: "Dawah", slug: "dawah", count: 30, icon: "bullhorn", gradient: "from-teal-800 to-teal-500", description: "Resources for sharing the message of Islam — comparative religion, new Muslim guides, and more." },
    { name: "Hajj / Umrah", slug: "hajj-umrah", count: 25, icon: "kaaba", gradient: "from-yellow-800 to-yellow-500", description: "Complete guides, duas, and essentials for your Hajj and Umrah pilgrimage." },
    { name: "Health / Prophetic Medicine", slug: "health", count: 15, icon: "heart-pulse", gradient: "from-lime-800 to-lime-500", description: "Prophetic medicine, natural remedies, and health guidance from the Sunnah." },
    { name: "Women in Islam", slug: "women-in-islam", count: 20, icon: "book-heart", gradient: "from-fuchsia-800 to-rose-600", description: "Books about the lives, scholarship, and legacy of women in Islamic history." },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }
  console.log(`  ✅ Categories (${categoriesData.length})`);

  // ─── Collections ───
  const collectionsData = [
    { name: "Quran Collection", slug: "quran", gradient: "from-emerald-900 to-emerald-500", description: "Complete range of Quran editions, translations, and Tafseer." },
    { name: "Hadith Collection", slug: "hadith", gradient: "from-sky-900 to-sky-500", description: "Authentic Hadith compilations and explanations." },
    { name: "Prophet's Seerah", slug: "seerah", gradient: "from-amber-900 to-amber-500", description: "Life and biography of the Prophet Muhammad ﷺ." },
    { name: "Fiqh & Islamic Law", slug: "fiqh", gradient: "from-purple-900 to-purple-500", description: "Islamic jurisprudence across all major schools of thought." },
    { name: "Calligraphy", slug: "calligraphy", gradient: "from-orange-900 to-orange-500", description: "Beautiful Islamic calligraphy and art pieces." },
    { name: "Education", slug: "education", gradient: "from-blue-800 to-blue-400", description: "Educational resources for students of Islamic knowledge." },
  ];

  for (const col of collectionsData) {
    await prisma.collection.upsert({
      where: { slug: col.slug },
      update: col,
      create: col,
    });
  }
  console.log("  ✅ Collections (6)");

  // ─── Products ───
  const productsData = [
    {
      id: "prod-1", slug: "tib-e-nabvi-latest", name: "Tib-e-Nabvi (Latest) - Ibn al Qayyim",
      author: "Ibn al-Qayyim al-Jawziyyah", vendor: "DARUSSALAM", price: 4000,
      rating: 5, reviewCount: 22, category: "Health", categorySlug: "health",
      badge: "bestseller",
      description: "A comprehensive guide to Prophetic Medicine (Tib-e-Nabvi) by the renowned scholar Ibn al-Qayyim. This latest edition covers natural remedies, dietary guidance, and spiritual healing methods prescribed by the Prophet Muhammad ﷺ. Beautifully typeset with references from authentic Hadith sources.",
      features: JSON.stringify(["Latest premium edition with full-color illustrations", "Authentic Hadith references throughout", "Covers natural remedies and spiritual healing", "Comprehensive index for quick reference"]),
      language: "Urdu", pages: 640, isbn: "978-9960-897-55-0", weight: "850g", dimensions: "17 x 24 cm",
      inStock: true, gradient: "from-amber-200 to-amber-400", icon: "book",
    },
    {
      id: "prod-2", slug: "qurani-qaidah-14x21", name: "Qurani Qaidah 14X21",
      author: "Darussalam Research Center", vendor: "DARUSSALAM", price: 200,
      rating: 5, reviewCount: 8, category: "Quran", categorySlug: "quran",
      description: "An essential Quran reading primer for beginners. This Qurani Qaidah uses a systematic approach to teach Arabic letters, vowels, and Tajweed rules. Perfect for children and adults learning to read the Holy Quran.",
      features: JSON.stringify(["Color-coded Tajweed rules", "Step-by-step progressive lessons", "Large, clear Arabic text", "Suitable for all ages"]),
      language: "Arabic/Urdu", pages: 64, weight: "150g", dimensions: "14 x 21 cm",
      inStock: true, gradient: "from-green-200 to-green-400", icon: "book-quran",
    },
    {
      id: "prod-3", slug: "the-sealed-nectar", name: "The Sealed Nectar (Ar-Raheequl-Makhtum)",
      author: "Safiur-Rahman Al-Mubarakpuri", vendor: "DARUSSALAM", price: 1750,
      rating: 5, reviewCount: 27, category: "Prophet's Seerah", categorySlug: "seerah",
      badge: "bestseller",
      description: "Award-winning biography of Prophet Muhammad ﷺ. The Sealed Nectar (Ar-Raheeq Al-Makhtum) won first prize in a worldwide competition on the Seerah organized by the Muslim World League. A must-read for every Muslim household.",
      features: JSON.stringify(["Award-winning Seerah — 1st prize worldwide", "Comprehensive and authentic biography", "Maps and genealogical charts included", "Detailed index and bibliography"]),
      language: "English", pages: 476, isbn: "978-9960-899-55-1", weight: "600g", dimensions: "14 x 21 cm",
      inStock: true, gradient: "from-yellow-200 to-yellow-400", icon: "book",
    },
    {
      id: "prod-4", slug: "fortress-of-muslim", name: "Fortress Of Muslim - Pocket Size",
      author: "Sa'id bin Ali bin Wahf Al-Qahtani", vendor: "DARUSSALAM", price: 320,
      rating: 5, reviewCount: 2, category: "Prayer / Supplication", categorySlug: "prayer",
      description: "Hisnul Muslim — a compact collection of authentic supplications (Duas) for every occasion. This pocket-sized edition is perfect for carrying with you at all times. Includes Arabic text with English and Urdu translations.",
      features: JSON.stringify(["Pocket-friendly size for daily carry", "Arabic text with transliteration", "English and Urdu translations", "Duas categorized by occasion"]),
      language: "Arabic/English/Urdu", pages: 256, weight: "120g", dimensions: "8 x 12 cm",
      inStock: true, gradient: "from-violet-200 to-violet-400", icon: "book-open",
    },
    {
      id: "prod-5", slug: "noble-quran-hardcover", name: "The Noble Quran (Hard Cover) 14x21",
      author: "Dr. Muhammad Muhsin Khan & Dr. Muhammad Taqi-ud-Din Al-Hilali", vendor: "DARUSSALAM", price: 1750,
      rating: 5, reviewCount: 5, category: "Quran", categorySlug: "quran",
      description: "The Noble Quran with English translation of meanings and commentary. This hardcover edition features the Arabic text alongside a clear, scholarly English translation. Published by Darussalam with the approval of the Saudi Ministry of Islamic Affairs.",
      features: JSON.stringify(["Arabic text with English translation", "Scholarly commentary and footnotes", "Premium hardcover binding", "Clear, readable typography"]),
      language: "Arabic/English", pages: 924, isbn: "978-9960-740-79-2", weight: "1200g", dimensions: "14 x 21 cm",
      inStock: true, gradient: "from-sky-200 to-sky-400", icon: "book-quran",
    },
    {
      id: "prod-6", slug: "stories-of-the-prophets", name: "Stories of the Prophets (PBUH) - Imam Ibn Kathir",
      author: "Imam Ibn Kathir", vendor: "DARUSSALAM", price: 1750,
      rating: 5, reviewCount: 13, category: "Biography", categorySlug: "biography",
      badge: "bestseller",
      description: "The classic collection of stories of the Prophets from Adam to Muhammad ﷺ, narrated by the renowned historian Imam Ibn Kathir. Based on authentic Quranic verses and Hadith narrations. A timeless masterpiece for all ages.",
      features: JSON.stringify(["Complete stories from Adam to Muhammad ﷺ", "Based on authentic Quran and Hadith sources", "Scholarly commentary by Ibn Kathir", "Suitable for family reading"]),
      language: "English", pages: 600, isbn: "978-9960-892-26-5", weight: "750g", dimensions: "14 x 21 cm",
      inStock: true, gradient: "from-orange-200 to-orange-400", icon: "book",
    },
    {
      id: "prod-7", slug: "namaz-e-nabvi", name: "Namaz e Nabvi (14x21)",
      author: "Hafiz Zubair Ali Zai", vendor: "DARUSSALAM", price: 850,
      rating: 5, reviewCount: 16, category: "Prayer / Supplication", categorySlug: "prayer",
      description: "A comprehensive guide to performing Salah (prayer) according to the Sunnah of the Prophet ﷺ. Includes detailed illustrations, authentic Hadith references, and step-by-step instructions for all prayers.",
      features: JSON.stringify(["Step-by-step prayer guide with illustrations", "Based on authentic Hadith narrations", "Covers all types of prayers", "Arabic text with Urdu explanation"]),
      language: "Urdu", pages: 448, weight: "550g", dimensions: "14 x 21 cm",
      inStock: true, gradient: "from-green-200 to-green-400", icon: "book-open",
    },
    {
      id: "prod-8", slug: "ar-raheeq-al-makhtum-urdu", name: "Ar Raheeq Al Makhtum (Urdu)",
      author: "Safiur-Rahman Al-Mubarakpuri", vendor: "DARUSSALAM", price: 990,
      rating: 5, reviewCount: 24, category: "Prophet's Seerah", categorySlug: "seerah",
      badge: "sale",
      description: "Urdu translation of the internationally acclaimed Seerah — The Sealed Nectar. This award-winning biography chronicles the life of Prophet Muhammad ﷺ in beautiful Urdu prose. A household essential for Urdu-speaking Muslims.",
      features: JSON.stringify(["Award-winning Seerah in Urdu", "Fluent and scholarly Urdu translation", "Complete and unabridged edition", "Maps and illustrations included"]),
      language: "Urdu", pages: 520, weight: "650g", dimensions: "14 x 21 cm",
      inStock: true, gradient: "from-rose-200 to-rose-400", icon: "book",
    },
    {
      id: "prod-9", slug: "tajalliyat-e-nabuwwat", name: "Tajalliyat-e-Nabuwwat (New Edition) 17x24",
      author: "Darussalam Research Center", vendor: "DARUSSALAM", price: 1600,
      rating: 5, reviewCount: 7, category: "Prophet's Seerah", categorySlug: "seerah",
      badge: "new",
      description: "A comprehensive study of the signs and miracles of prophethood. This new edition features enhanced typography, full-color illustrations, and additional scholarly commentary.",
      features: JSON.stringify(["New enhanced edition with color illustrations", "Scholarly research and commentary", "Covers miracles and signs of prophethood", "Premium 17x24 cm format"]),
      language: "Urdu", pages: 520, weight: "800g", dimensions: "17 x 24 cm",
      inStock: true, gradient: "from-amber-200 to-amber-400", icon: "book",
    },
    {
      id: "prod-10", slug: "sealed-nectar-4-color", name: "The Sealed Nectar (Ar Raheeq Al Makhtoum) - (4 Color Print)",
      author: "Safiur-Rahman Al-Mubarakpuri", vendor: "DARUSSALAM", price: 3500,
      rating: 5, reviewCount: 32, category: "Prophet's Seerah", categorySlug: "seerah",
      badge: "new",
      description: "The premium 4-color edition of the world-renowned Seerah. Featuring stunning full-color maps, illustrations, and photographs of historical sites.",
      features: JSON.stringify(["Premium 4-color full-page illustrations", "Historical photographs and maps", "Collector's quality binding", "The most comprehensive English Seerah"]),
      language: "English", pages: 600, isbn: "978-9960-899-55-3", weight: "1100g", dimensions: "17 x 24 cm",
      inStock: true, gradient: "from-sky-200 to-sky-400", icon: "book-quran",
    },
    {
      id: "prod-11", slug: "healing-medicine-prophet", name: "Healing with the Medicine of the Prophet ﷺ",
      author: "Ibn al-Qayyim al-Jawziyyah", vendor: "DARUSSALAM", price: 2000,
      rating: 5, reviewCount: 7, category: "Health", categorySlug: "health",
      badge: "new",
      description: "The 4-color local edition of the classic Prophetic Medicine guide. Covers diet, natural remedies, Ruqyah, and spiritual healing based on the Sunnah.",
      features: JSON.stringify(["4-color premium local edition", "Natural remedies from the Sunnah", "Covers diet, spiritual healing, and Ruqyah", "Indexed for easy reference"]),
      language: "English", pages: 460, weight: "700g", dimensions: "14 x 21 cm",
      inStock: true, gradient: "from-green-200 to-green-400", icon: "book-open",
    },
    {
      id: "prod-12", slug: "uswa-tul-alam", name: "Uswa tul Alam",
      author: "Abdul Malik Mujahid", vendor: "DARUSSALAM", price: 3200,
      rating: 5, reviewCount: 1, category: "Prophet's Seerah", categorySlug: "seerah",
      badge: "new",
      description: "A masterful presentation of the Prophet Muhammad ﷺ as a role model for humanity.",
      features: JSON.stringify(["Comprehensive Seerah study", "Practical life lessons from the Prophet ﷺ", "By the renowned author Abdul Malik Mujahid", "Premium hardcover binding"]),
      language: "Urdu", pages: 800, weight: "1000g", dimensions: "17 x 24 cm",
      inStock: true, gradient: "from-yellow-200 to-yellow-400", icon: "book",
    },
    {
      id: "prod-13", slug: "qawaid-al-tajweed", name: "Qawaid al Tajweed",
      author: "Darussalam Research Center", vendor: "DARUSSALAM", price: 250,
      rating: 5, reviewCount: 3, category: "Quran", categorySlug: "quran",
      description: "Learn the rules of Tajweed with this concise and practical guide. Color-coded examples make it easy to master proper Quranic recitation.",
      features: JSON.stringify(["Color-coded Tajweed rules", "Practical examples from the Quran", "Concise and easy to follow", "Ideal for self-study and classrooms"]),
      language: "Arabic/Urdu", pages: 96, weight: "180g", dimensions: "14 x 21 cm",
      inStock: true, gradient: "from-teal-200 to-teal-400", icon: "book-quran",
    },
    {
      id: "prod-14", slug: "rabbana-qurani-duayein", name: "Rabbana (Qurani Duayein)",
      author: "Darussalam Research Center", vendor: "DARUSSALAM", price: 100,
      rating: 5, reviewCount: 1, category: "Prayer / Supplication", categorySlug: "prayer",
      description: "A beautiful compilation of all the Duas (supplications) mentioned in the Holy Quran. Features Arabic text, transliteration, and translations.",
      features: JSON.stringify(["All Quranic supplications compiled", "Arabic text with transliteration", "Urdu and English translations", "Pocket-friendly format"]),
      language: "Arabic/Urdu/English", pages: 80, weight: "80g", dimensions: "10 x 15 cm",
      inStock: true, gradient: "from-indigo-200 to-indigo-400", icon: "book-open",
    },
    {
      id: "prod-15", slug: "60-golden-hadith-children", name: "60 Golden Hadith For Children (Urdu, Arabic, English)",
      author: "Darussalam Research Center", vendor: "DARUSSALAM", price: 250,
      rating: 4, reviewCount: 3, category: "Kids / Children", categorySlug: "children",
      badge: "new",
      description: "A beautifully illustrated collection of 60 essential Hadith selected for young readers.",
      features: JSON.stringify(["60 carefully selected Hadith for children", "Trilingual: Arabic, Urdu, English", "Full-color illustrations", "Age-appropriate explanations"]),
      language: "Arabic/Urdu/English", pages: 128, weight: "250g", dimensions: "21 x 28 cm",
      inStock: true, gradient: "from-pink-200 to-pink-400", icon: "children",
    },
    {
      id: "prod-16", slug: "tafseer-ahsan-al-kalam", name: "Tafseer Ahsan al Kalam (Pocket-size 10x15 cm)",
      author: "Hafiz Salahuddin Yusuf", vendor: "DARUSSALAM", price: 3000,
      rating: 5, reviewCount: 1, category: "Quran", categorySlug: "quran",
      description: "Complete Quran with Urdu translation and brief Tafseer by Hafiz Salahuddin Yusuf. This pocket-size edition is perfect for daily reading and travel.",
      features: JSON.stringify(["Complete Quran with Urdu Tafseer", "Pocket-size for travel and daily use", "Color-coded Tajweed", "Premium quality paper and binding"]),
      language: "Arabic/Urdu", pages: 1200, weight: "400g", dimensions: "10 x 15 cm",
      inStock: true, gradient: "from-emerald-200 to-emerald-400", icon: "book-quran",
    },
    {
      id: "prod-17", slug: "great-women-of-islam", name: "Great Women of Islam",
      author: "Mahmood Ahmad Ghadanfar", vendor: "DARUSSALAM", price: 1450,
      rating: 5, reviewCount: 0, category: "Women in Islam", categorySlug: "women-in-islam",
      badge: "new",
      description: "Inspiring biographies of exemplary women from early Islamic history, highlighting their faith, knowledge, and contribution to the Ummah.",
      features: JSON.stringify(["Biographies of notable Muslim women", "Authentic historical sources", "Practical lessons for modern readers", "Clear and engaging writing style"]),
      language: "English", pages: 380, isbn: "978-603-500-410-9", weight: "520g", dimensions: "14 x 21 cm",
      inStock: true, gradient: "from-rose-200 to-fuchsia-400", icon: "book-heart",
    },
  ];

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: prod,
    });
  }
  console.log(`  ✅ Products (${productsData.length})`);

  // ─── Customers ───
  const customersData = [
    { id: "cust-1", name: "Ahmad Hassan", email: "ahmad@example.com", phone: "+92 300 1234567", totalOrders: 5, totalSpent: 12500, joinedAt: new Date("2025-01-15"), lastOrderAt: new Date("2026-06-10") },
    { id: "cust-2", name: "Fatima Ali", email: "fatima@example.com", phone: "+92 321 9876543", totalOrders: 3, totalSpent: 8900, joinedAt: new Date("2025-03-22"), lastOrderAt: new Date("2026-06-10") },
    { id: "cust-3", name: "Usman Tariq", email: "usman@example.com", phone: "+92 333 5551234", totalOrders: 2, totalSpent: 4350, joinedAt: new Date("2025-06-10"), lastOrderAt: new Date("2026-06-09") },
    { id: "cust-4", name: "Ayesha Khan", email: "ayesha@example.com", phone: "+92 312 7778899", totalOrders: 8, totalSpent: 24300, joinedAt: new Date("2024-11-01"), lastOrderAt: new Date("2026-06-11") },
    { id: "cust-5", name: "Bilal Ahmed", email: "bilal@example.com", totalOrders: 12, totalSpent: 45000, joinedAt: new Date("2024-06-15"), lastOrderAt: new Date("2026-06-08") },
    { id: "cust-6", name: "Zainab Malik", email: "zainab@example.com", phone: "+92 345 1112233", totalOrders: 1, totalSpent: 1980, joinedAt: new Date("2026-05-20"), lastOrderAt: new Date("2026-06-07") },
    { id: "cust-7", name: "Omar Farooq", email: "omar@example.com", phone: "+92 301 4445566", totalOrders: 4, totalSpent: 15600, joinedAt: new Date("2025-08-12"), lastOrderAt: new Date("2026-06-09") },
    { id: "cust-8", name: "Maryam Siddiqui", email: "maryam@example.com", totalOrders: 6, totalSpent: 8750, joinedAt: new Date("2025-02-28"), lastOrderAt: new Date("2026-06-06") },
    { id: "cust-9", name: "Imran Rasheed", email: "imran@example.com", phone: "+92 302 4666688", totalOrders: 15, totalSpent: 62000, joinedAt: new Date("2024-01-01"), lastOrderAt: new Date("2026-06-10") },
    { id: "cust-10", name: "Khadija Noor", email: "khadija@example.com", phone: "+92 311 9990000", totalOrders: 2, totalSpent: 3200, joinedAt: new Date("2026-01-10"), lastOrderAt: new Date("2026-06-11") },
  ];

  for (const cust of customersData) {
    await prisma.customer.upsert({
      where: { email: cust.email },
      update: cust,
      create: cust,
    });
  }
  console.log("  ✅ Customers (10)");

  // ─── Orders with Items ───
  const ordersData = [
    {
      id: "ord-1", orderNumber: "DS-10001", customerName: "Ahmad Hassan", customerEmail: "ahmad@example.com",
      items: [{ name: "The Sealed Nectar", qty: 1, price: 1750 }, { name: "Fortress Of Muslim", qty: 2, price: 320 }],
      total: 2390, status: "delivered", paymentStatus: "paid", createdAt: new Date("2026-06-10T14:30:00Z"),
      shippingAddress: "House 12, Block F, Gulberg III, Lahore",
    },
    {
      id: "ord-2", orderNumber: "DS-10002", customerName: "Fatima Ali", customerEmail: "fatima@example.com",
      items: [{ name: "Tib-e-Nabvi (Latest)", qty: 1, price: 4000 }],
      total: 4000, status: "shipped", paymentStatus: "paid", createdAt: new Date("2026-06-10T10:15:00Z"),
      shippingAddress: "Apt 5B, Defence Phase 5, Karachi",
    },
    {
      id: "ord-3", orderNumber: "DS-10003", customerName: "Usman Tariq", customerEmail: "usman@example.com",
      items: [{ name: "Stories of the Prophets", qty: 1, price: 1750 }, { name: "Namaz e Nabvi", qty: 1, price: 850 }],
      total: 2600, status: "processing", paymentStatus: "paid", createdAt: new Date("2026-06-09T16:45:00Z"),
      shippingAddress: "15-A, University Town, Peshawar",
    },
    {
      id: "ord-4", orderNumber: "DS-10004", customerName: "Ayesha Khan", customerEmail: "ayesha@example.com",
      items: [{ name: "Noble Quran (Hard Cover)", qty: 2, price: 1750 }, { name: "Qurani Qaidah", qty: 3, price: 200 }],
      total: 4100, status: "pending", paymentStatus: "unpaid", createdAt: new Date("2026-06-11T08:00:00Z"),
      shippingAddress: "Plot 22, Sector H-8, Islamabad",
    },
    {
      id: "ord-5", orderNumber: "DS-10005", customerName: "Bilal Ahmed", customerEmail: "bilal@example.com",
      items: [{ name: "Sealed Nectar 4-Color", qty: 1, price: 3500 }, { name: "Uswa tul Alam", qty: 1, price: 3200 }],
      total: 6700, status: "delivered", paymentStatus: "paid", createdAt: new Date("2026-06-08T12:20:00Z"),
      shippingAddress: "Block 3, PECHS, Karachi",
    },
    {
      id: "ord-6", orderNumber: "DS-10006", customerName: "Zainab Malik", customerEmail: "zainab@example.com",
      items: [{ name: "Ar Raheeq Al Makhtum (Urdu)", qty: 2, price: 990 }],
      total: 1980, status: "cancelled", paymentStatus: "refunded", createdAt: new Date("2026-06-07T09:10:00Z"),
      shippingAddress: "Street 5, Satellite Town, Rawalpindi",
    },
    {
      id: "ord-7", orderNumber: "DS-10007", customerName: "Omar Farooq", customerEmail: "omar@example.com",
      items: [{ name: "Healing with Medicine of Prophet", qty: 1, price: 2000 }, { name: "Tafseer Ahsan al Kalam", qty: 1, price: 3000 }],
      total: 5000, status: "shipped", paymentStatus: "paid", createdAt: new Date("2026-06-09T11:30:00Z"),
      shippingAddress: "House 44, Model Town, Lahore",
    },
    {
      id: "ord-8", orderNumber: "DS-10008", customerName: "Maryam Siddiqui", customerEmail: "maryam@example.com",
      items: [{ name: "60 Golden Hadith For Children", qty: 5, price: 250 }],
      total: 1250, status: "delivered", paymentStatus: "paid", createdAt: new Date("2026-06-06T15:00:00Z"),
      shippingAddress: "Plot 8, DHA Phase 2, Lahore",
    },
    {
      id: "ord-9", orderNumber: "DS-10009", customerName: "Imran Rasheed", customerEmail: "imran@example.com",
      items: [{ name: "Qawaid al Tajweed", qty: 10, price: 250 }, { name: "Rabbana", qty: 10, price: 100 }],
      total: 3500, status: "processing", paymentStatus: "paid", createdAt: new Date("2026-06-10T17:45:00Z"),
      shippingAddress: "Mohalla Islamabad, Faisalabad",
    },
    {
      id: "ord-10", orderNumber: "DS-10010", customerName: "Khadija Noor", customerEmail: "khadija@example.com",
      items: [{ name: "Tajalliyat-e-Nabuwwat", qty: 1, price: 1600 }],
      total: 1600, status: "pending", paymentStatus: "unpaid", createdAt: new Date("2026-06-11T06:30:00Z"),
      shippingAddress: "Sector G-11, Islamabad",
    },
  ];

  for (const ord of ordersData) {
    const { items, ...orderData } = ord;
    await prisma.order.upsert({
      where: { orderNumber: orderData.orderNumber },
      update: orderData,
      create: {
        ...orderData,
        items: {
          create: items,
        },
      },
    });
  }
  console.log("  ✅ Orders (10) with items");

  // ─── Monthly Revenue ───
  const revenueData = [
    { month: "Jan", revenue: 125000 },
    { month: "Feb", revenue: 148000 },
    { month: "Mar", revenue: 162000 },
    { month: "Apr", revenue: 139000 },
    { month: "May", revenue: 185000 },
    { month: "Jun", revenue: 210000 },
  ];

  await prisma.monthlyRevenue.deleteMany();
  for (const r of revenueData) {
    await prisma.monthlyRevenue.create({ data: r });
  }
  console.log("  ✅ Monthly revenue (6 months)");

  // ─── Top Products ───
  const topProductsData = [
    { name: "The Sealed Nectar", sold: 156, revenue: 273000 },
    { name: "Tib-e-Nabvi (Latest)", sold: 89, revenue: 356000 },
    { name: "Ar Raheeq Al Makhtum", sold: 124, revenue: 122760 },
    { name: "Fortress Of Muslim", sold: 201, revenue: 64320 },
    { name: "Stories of Prophets", sold: 78, revenue: 136500 },
  ];

  await prisma.topProduct.deleteMany();
  for (const tp of topProductsData) {
    await prisma.topProduct.create({ data: tp });
  }
  console.log("  ✅ Top products (5)");

  console.log("\n✨ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
