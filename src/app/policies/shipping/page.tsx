import type { Metadata } from "next";
import { siteConfig } from "@/lib/data-types";

export const metadata: Metadata = {
  title: "Shipment and Refund Policy",
  description: "Shipping and Refund Policy for MyDeenMarket. Learn about our delivery and return process.",
  openGraph: {
    title: "Shipment and Refund Policy",
    description: "Shipping and Refund Policy for MyDeenMarket",
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
          <h1 className="text-4xl font-bold mb-4">Shipment and Refund Policy</h1>
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

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">Refund Policy</h2>

          <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">1. Refund Eligibility</h3>
          <p className="text-slate-700 leading-relaxed">
            We offer a 7-day refund policy from the date of delivery. Products must be:
          </p>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>In original, unused condition</li>
            <li>In original packaging</li>
            <li>With all accompanying items and documentation</li>
            <li>Not damaged due to customer misuse</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">2. How to Request a Refund</h3>
          <ol className="list-decimal pl-6 text-slate-700 space-y-2">
            <li>Log in to your account and navigate to "Orders"</li>
            <li>Select the order you wish to return</li>
            <li>Click "Request Refund" and select the item(s)</li>
            <li>Choose your reason and provide any additional details</li>
            <li>You'll receive a return address via email</li>
          </ol>

          <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">3. Return Shipping</h3>
          <p className="text-slate-700 leading-relaxed">
            For refunds due to customer's change of mind: You'll need to arrange and bear the return shipping cost. For refunds due to our error or defective products: We'll provide a prepaid shipping label.
          </p>

          <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">4. Refund Processing</h3>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>Once we receive and inspect your return: 3-5 business days</li>
            <li>Refund processing time: 5-10 business days</li>
            <li>Refund will be issued to your original payment method</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">5. Non-Refundable Items</h3>
          <p className="text-slate-700 leading-relaxed">
            Unfortunately, the following items cannot be refunded:
          </p>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>Items requested after 7 days from delivery</li>
            <li>Items that show signs of use or damage</li>
            <li>Items with missing or damaged original packaging</li>
            <li>Items from orders placed during clearance/final sale events</li>
          </ul>

          <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">6. Damaged or Defective Items</h3>
          <p className="text-slate-700 leading-relaxed">
            If you receive a damaged, defective, or incorrect item, please:
          </p>
          <ol className="list-decimal pl-6 text-slate-700 space-y-2">
            <li>Report within 24 hours of delivery</li>
            <li>Provide clear photos of the damage/defect</li>
            <li>We'll arrange a replacement or full refund immediately</li>
            <li>No return shipping required for defective items</li>
          </ol>

          <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">7. Exchanges</h3>
          <p className="text-slate-700 leading-relaxed">
            If you'd like to exchange an item for another product, you can request an exchange within 7 days of delivery. If the new item is more expensive, you'll need to pay the difference. If it's less expensive, we'll refund the difference.
          </p>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">Lost or Stolen Packages</h2>
          <p className="text-slate-700 leading-relaxed">
            While we strive to deliver your package safely, we understand that packages can sometimes be lost or stolen. If this happens:
          </p>
          <ol className="list-decimal pl-6 text-slate-700 space-y-2">
            <li>File a report with the courier within 24 hours</li>
            <li>Contact us with tracking number and photos if available</li>
            <li>We'll investigate and either redeliver or issue a refund</li>
          </ol>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">Contact Us</h2>
          <p className="text-slate-700 leading-relaxed">
            For any questions about shipping or returns, please contact us:
          </p>
          <div className="bg-slate-50 p-6 rounded-lg mt-4">
            <p className="text-slate-700"><strong>Email:</strong> <a href={`mailto:${siteConfig.email}`} className="text-[#d4a853] hover:underline">{siteConfig.email}</a></p>
            <p className="text-slate-700"><strong>Phone:</strong> <a href={`tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`} className="text-[#d4a853] hover:underline">{siteConfig.phone}</a></p>
            <p className="text-slate-700"><strong>Hours:</strong> {siteConfig.hours}</p>
            <p className="text-slate-700"><strong>Address:</strong> {siteConfig.address}</p>
          </div>

          <p className="text-sm text-slate-500 mt-8">
            This policy is subject to change without notice. We reserve the right to refuse any return that doesn't meet our refund eligibility requirements.
          </p>
        </div>
      </section>
    </div>
  );
}
