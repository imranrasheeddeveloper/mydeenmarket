import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Sign In to Your Account",
  description:
    "Sign in to your MyDeenMarket account to track orders, manage your wishlist, and shop Islamic books & products.",
  path: "/login",
  noIndex: true,
});

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
