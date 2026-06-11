import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "My Account",
  description:
    "Manage your MyDeenMarket account. View orders, saved addresses, and wishlist.",
  path: "/account",
  noIndex: true,
});

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
