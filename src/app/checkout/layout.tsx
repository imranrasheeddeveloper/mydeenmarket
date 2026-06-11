import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Checkout",
  description:
    "Complete your order at MyDeenMarket. Secure checkout with Cash on Delivery and card payment options.",
  path: "/checkout",
  noIndex: true,
});

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
