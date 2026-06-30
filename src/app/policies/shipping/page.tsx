import type { Metadata } from "next";
import { siteConfig } from "@/lib/data-types";

export const metadata: Metadata = {
  title: "Shipment and Exchange Policy",
  description: "Shipping and Exchange Policy for MyDeenMarket. Learn about delivery and exchange-only terms.",
  openGraph: {
    title: "Shipment and Exchange Policy",
    description: "Shipping and Exchange Policy for MyDeenMarket",
    url: `${siteConfig.url}/policies/shipping`,
  },
};

export default function ShippingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#0d5d4f] to-[#1a3d3a] text-white py-16 md:py-24">
        <div className="absolute inset-0 islamic-pattern-dark opacity-20" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl font-bold mb-4">Shipment and Exchange Policy</h1>
          <p className="text-slate-300">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm sm:prose lg:prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">Shipping Policy</h2>

          <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">1. Shipping Rates & Free Shipping</h3>
          <p className="text-slate-700 leading-relaxed">
            We offer FREE SHIPPING on all orders over PKR {siteConfig.freeShippingThreshold.toLocaleString()}. For orders below this amount, shipping charges are calculated based on your delivery location at checkout.
          </p>

          <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">2. Delivery Timeline</h3>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li><strong>Major Cities (Lahore, Karachi, Islamabad, Rawalpindi, Multan, Faisalabad):</strong> 3-5 business days</li>
            <li><strong>Other Cities:</strong> 5-7 business days</li>
            <li><strong>Remote Areas:</strong> 7-10 business days</li>
          </ul>
          <p className="text-slate-700 leading-relaxed mt-4">
            Delivery times are estimates and may be affected by weather, holidays, or unforeseen circumstances. We'll keep you updated with tracking information.
          </p>

          <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">3. Order Tracking</h3>
          <p className="text-slate-700 leading-relaxed">
            Once your order is dispatched, you'll receive a tracking number via email and SMS. You can track your order status in real-time through your account dashboard on our website.
          </p>

          <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">4. Packaging & Care</h3>
          <p className="text-slate-700 leading-relaxed">
            We carefully package all items to ensure they arrive in perfect condition. Books are wrapped securely to prevent damage during transit. If you receive a damaged item, please report it within 24 hours with photos.
          </p>

          <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">5. Address Requirements</h3>
          <p className="text-slate-700 leading-relaxed">
            Please provide a complete, accurate delivery address including:
          </p>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>Full name and contact number</li>
            <li>Complete street address</li>
            <li>City and postal code</li>
            <li>Any relevant landmarks or directions</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">Exchange Policy (No Returns / No Refunds)</h2>

          <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">1. Exchange Eligibility</h3>
          <p className="text-slate-700 leading-relaxed">
            We do not accept returns and we do not issue refunds. We only offer exchanges within 7 days from the date of delivery. Products must be:
          </p>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>In original, unused condition</li>
            <li>In original packaging</li>
            <li>With all accompanying items and documentation</li>
            <li>Not damaged due to customer misuse</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">2. How to Request an Exchange</h3>
          <ol className="list-decimal pl-6 text-slate-700 space-y-2">
            <li>Log in to your account and navigate to Orders</li>
            <li>Select the order you wish to exchange</li>
            <li>Click Request Exchange and select the item(s)</li>
            <li>Choose your reason and provide details</li>
            <li>Our team will share exchange instructions by email or phone</li>
          </ol>

          <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">3. Exchange Shipping</h3>
          <p className="text-slate-700 leading-relaxed">
            For exchange requests due to customer preference, return shipping charges are paid by the customer. For wrong, damaged, or defective items sent by us, we will arrange pickup or replacement support.
          </p>

          <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">4. Price Difference During Exchange</h3>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>If the new item price is higher, the customer pays the difference</li>
            <li>If the new item price is lower, we issue store credit for the difference</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">5. Non-Exchangeable Items</h3>
          <p className="text-slate-700 leading-relaxed">
            The following items are not eligible for exchange:
          </p>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>Items reported after 7 days of delivery</li>
            <li>Items with signs of use, damage, or missing parts</li>
            <li>Items with missing or damaged original packaging</li>
            <li>Items marked final sale or clearance</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">6. Damaged, Defective, or Incorrect Items</h3>
          <p className="text-slate-700 leading-relaxed">
            If you receive a damaged, defective, or incorrect item, please:
          </p>
          <ol className="list-decimal pl-6 text-slate-700 space-y-2">
            <li>Report within 24 hours of delivery</li>
            <li>Provide clear photos of the issue</li>
            <li>We will arrange replacement or exchange support</li>
          </ol>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">Lost or Stolen Packages</h2>
          <p className="text-slate-700 leading-relaxed">
            While we strive to deliver your package safely, we understand that packages can sometimes be lost or stolen. If this happens:
          </p>
          <ol className="list-decimal pl-6 text-slate-700 space-y-2">
            <li>File a report with the courier within 24 hours</li>
            <li>Contact us with tracking number and photos if available</li>
            <li>We will investigate and either redeliver or provide exchange support</li>
          </ol>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">Contact Us</h2>
          <p className="text-slate-700 leading-relaxed">
            For any questions about shipping or exchanges, please contact us:
          </p>
          <div className="bg-slate-50 p-6 rounded-lg mt-4">
            <p className="text-slate-700"><strong>Email:</strong> <a href={`mailto:${siteConfig.email}`} className="text-[#d4a853] hover:underline">{siteConfig.email}</a></p>
            <p className="text-slate-700"><strong>Phone:</strong> <a href={`tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`} className="text-[#d4a853] hover:underline">{siteConfig.phone}</a></p>
            <p className="text-slate-700"><strong>Hours:</strong> {siteConfig.hours}</p>
            <p className="text-slate-700"><strong>Address:</strong> {siteConfig.address}</p>
          </div>

          <p className="text-sm text-slate-500 mt-8">
            This policy is subject to change without notice. We reserve the right to refuse any exchange request that does not meet the eligibility requirements.
          </p>
        </div>
      </section>
    </div>
  );
}
