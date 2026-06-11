import type { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Create Your Account",
  description:
    "Create a MyDeenMarket account to shop Islamic books, Abaya, Tasbih & more. Track orders and get exclusive offers.",
  path: "/signup",
  noIndex: true,
});

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
