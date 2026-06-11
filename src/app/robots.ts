import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account", "/checkout", "/api/", "/admin", "/_next/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/account", "/checkout", "/api/", "/admin"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
      },
      // AI & retrieval-augmented search crawlers
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: ["/account", "/checkout", "/api/", "/admin"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/account", "/checkout", "/api/", "/admin"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/account", "/checkout", "/api/", "/admin"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/account", "/checkout", "/api/", "/admin"],
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: ["/account", "/checkout", "/api/", "/admin"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/account", "/checkout", "/api/", "/admin"],
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/account", "/checkout", "/api/", "/admin"],
      },
      {
        userAgent: "Amazonbot",
        allow: "/",
        disallow: ["/account", "/checkout", "/api/", "/admin"],
      },
      // Block known junk/scraper bots
      {
        userAgent: "AhrefsBot",
        disallow: ["/"],
      },
      {
        userAgent: "SemrushBot",
        disallow: ["/"],
      },
      {
        userAgent: "MJ12bot",
        disallow: ["/"],
      },
    ],
    sitemap: "https://mydeenmarket.com/sitemap.xml",
    host: "https://mydeenmarket.com",
  };
}
