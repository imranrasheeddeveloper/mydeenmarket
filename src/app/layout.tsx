import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import AuthProvider from "@/components/AuthProvider";
import { CurrencyProvider } from "@/components/CurrencyProvider";
import WhatsAppButton from "@/components/WhatsAppButton";
import { siteConfig } from "@/lib/data-types";
import { getCategories, getSearchableProducts } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { generateOrganizationSchema, generateWebSiteSchema, generateSiteNavigationSchema } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    // Primary keywords
    "Islamic books online Pakistan",
    "buy Quran online",
    "Hadith books",
    "Seerah books",
    "Islamic bookstore Pakistan",
    "MyDeenMarket",
    // Product keywords
    "Abaya online Pakistan",
    "Tasbih buy online",
    "Janamaz prayer mat",
    "Zamzam water Pakistan",
    "Talbina powder",
    "Ihram for Hajj Umrah",
    "Islamic fragrances",
    "Attar perfume",
    "Oud soap",
    "Miswak",
    "Islamic dates Ajwa",
    "prayer beads",
    // Category keywords
    "Fiqh books",
    "Tafseer Quran",
    "kids Islamic books",
    "Urdu Islamic books",
    "Arabic books Pakistan",
    "Islamic gifts",
    "Hajj Umrah essentials",
    "Prophetic medicine Tib e Nabvi",
    // Long-tail keywords
    "buy Islamic products online Pakistan",
    "best Islamic bookstore Lahore",
    "authentic Islamic books free delivery",
    "online Islamic store cash on delivery",
    "Quran with Urdu translation buy online",
    "Sahih Bukhari buy Pakistan",
    "Islamic gifts for Ramadan Eid",
    "prayer mat buy online Pakistan",
    "Zamzam water delivery Pakistan",
    "Abaya collection Pakistan",
    "Tasbih counter digital",
    "Ihram cloth for men women",
    "halal fragrances Pakistan",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${siteConfig.url}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
  // verification: {
  //   google: "YOUR_GOOGLE_VERIFICATION_CODE",
  // },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, searchableProducts, whatsappConfig] = await Promise.all([
    getCategories(),
    getSearchableProducts(),
    prisma.siteConfig.findFirst({ select: { whatsappNumber: true } }),
  ]);
  const whatsappNumber = whatsappConfig?.whatsappNumber || "+923035036392";
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full`}>
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebSiteSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateSiteNavigationSchema()),
          }}
        />
        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-SGJTN3D6C8"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-SGJTN3D6C8', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <AuthProvider>
          <CurrencyProvider>
            <a href="#main-content" className="skip-link">
              Skip to content
            </a>
            <Header categories={categories} searchableProducts={searchableProducts} />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
            <CartDrawer />
            <WhatsAppButton number={whatsappNumber} />
          </CurrencyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
