import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "FAQs — Shipping, Orders, Returns & Payments",
  description:
    "Find answers to common MyDeenMarket questions about shipping, cash on delivery, returns, order tracking, and Islamic product authenticity.",
  path: "/faq",
});

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
