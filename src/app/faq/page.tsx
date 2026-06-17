"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/data-types";

interface FAQItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: 1,
    category: "Orders & Shipping",
    question: "What is the delivery time?",
    answer: "We typically deliver within 3-5 business days in major cities. Delivery to remote areas may take 7-10 business days. You can track your order status in your account dashboard.",
  },
  {
    id: 2,
    category: "Orders & Shipping",
    question: "Do you offer free shipping?",
    answer: `Yes! We offer FREE SHIPPING on all orders over PKR ${siteConfig.freeShippingThreshold.toLocaleString()}. For orders below this amount, shipping charges are calculated at checkout based on your location.`,
  },
  {
    id: 3,
    category: "Orders & Shipping",
    question: "Can I change my order after placing it?",
    answer: "If you want to modify your order, please contact us immediately at " + siteConfig.email + " or call " + siteConfig.phone + " within 2 hours of placing your order. We will do our best to accommodate your request.",
  },
  {
    id: 4,
    category: "Products",
    question: "Are all your books authentic?",
    answer: "Yes, we guarantee that all our products are 100% authentic. We source directly from trusted publishers and distributors. Each book comes with authenticity verification.",
  },
  {
    id: 5,
    category: "Products",
    question: "What languages do your books come in?",
    answer: "Our Islamic books are available in multiple languages including Arabic, English, Urdu, and other regional languages. You can filter by language in our collections section.",
  },
  {
    id: 6,
    category: "Products",
    question: "Do you have books for children?",
    answer: "Yes! We have a dedicated Kids & Children category with age-appropriate Islamic books designed to help young Muslims learn about their faith in an engaging and fun way.",
  },
  {
    id: 7,
    category: "Payment & Returns",
    question: "What payment methods do you accept?",
    answer: "We accept multiple payment methods including Cash on Delivery (COD), Bank Transfer, Credit/Debit Cards, and Mobile Wallet payments. Choose your preferred method at checkout.",
  },
  {
    id: 8,
    category: "Payment & Returns",
    question: "What is your refund policy?",
    answer: "We offer a 7-day refund policy from the date of delivery. Products must be in original condition with original packaging. Please refer to our Shipment and Refund Policy page for detailed information.",
  },
  {
    id: 9,
    category: "Payment & Returns",
    question: "Can I return a book if I don't like it?",
    answer: "Yes, you can return any book within 7 days of delivery if it's in original condition. Simply contact our customer support team with your order number and reason for return.",
  },
  {
    id: 10,
    category: "Account & Orders",
    question: "How do I track my order?",
    answer: "You can track your order by logging into your account and visiting the Orders section. You'll see real-time tracking updates for your shipment.",
  },
  {
    id: 11,
    category: "Account & Orders",
    question: "Can I create an account without making a purchase?",
    answer: "Yes! You can create an account anytime to start building your wishlist, track orders faster, and receive personalized recommendations.",
  },
  {
    id: 12,
    category: "Account & Orders",
    question: "How do I reset my password?",
    answer: "Click on 'Log In' and select 'Forgot Password'. Enter your email address and you'll receive a password reset link within minutes.",
  },
  {
    id: 13,
    category: "General",
    question: "Do you offer international shipping?",
    answer: "Currently, we deliver within Pakistan and select neighboring regions. For international inquiries, please contact us at " + siteConfig.email + " to discuss custom shipping options.",
  },
  {
    id: 14,
    category: "General",
    question: "How can I contact customer support?",
    answer: `You can reach our customer support team through multiple channels:\n\nEmail: ${siteConfig.email}\nPhone: ${siteConfig.phone}\nAddress: ${siteConfig.address}\n\nWe're available during business hours: ${siteConfig.hours}`,
  },
];

export default function FAQPage() {
  const [activeId, setActiveId] = useState<number | null>(null);
  const categories = Array.from(new Set(faqs.map(faq => faq.category)));

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#0d5d4f] to-[#1a3d3a] text-white py-20 md:py-28">
        <div className="absolute inset-0 islamic-pattern-dark opacity-20" />
        <div className="noor-glow w-[500px] h-[500px] top-[-100px] right-[-100px]" style={{ background: 'radial-gradient(circle, rgba(212,168,83,0.1) 0%, transparent 70%)' }} />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center">
            Frequently Asked <span className="text-[#d4a853]">Questions</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto text-center">
            Find answers to common questions about our products, shipping, payments, and more.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors border"
                onClick={() => {
                  const element = document.getElementById(category.replace(/ /g, "-"));
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQs by Category */}
          {categories.map((category) => (
            <div key={category} id={category.replace(/ /g, "-")} className="mb-16">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-8 pb-4 border-b-2 border-[#d4a853]/20">
                {category}
              </h2>
              <div className="space-y-4">
                {faqs
                  .filter((faq) => faq.category === category)
                  .map((faq) => (
                    <div
                      key={faq.id}
                      className="border border-slate-200 rounded-lg overflow-hidden hover:border-[#d4a853]/50 transition-colors"
                    >
                      <button
                        onClick={() => setActiveId(activeId === faq.id ? null : faq.id)}
                        className="w-full px-6 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                      >
                        <h3 className="font-semibold text-[#0f172a] pr-4">{faq.question}</h3>
                        <svg
                          className={`w-5 h-5 text-[#d4a853] flex-shrink-0 transition-transform ${
                            activeId === faq.id ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </button>
                      {activeId === faq.id && (
                        <div className="px-6 py-4 bg-white border-t border-slate-200 text-slate-600 whitespace-pre-wrap leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}

          {/* Still Have Questions */}
          <div className="mt-16 bg-slate-50 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-[#0f172a] mb-4">Didn&apos;t find your answer?</h3>
            <p className="text-slate-600 mb-6">
              Our customer support team is here to help. Reach out to us anytime.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#d4a853] text-[#0f172a] font-bold hover:bg-[#b8933f] transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
