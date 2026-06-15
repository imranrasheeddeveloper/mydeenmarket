import type { Metadata } from "next";
import { siteConfig } from "@/lib/data-types";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy and Cookies Policy for MyDeenMarket. Learn how we protect your personal information.",
  openGraph: {
    title: "Privacy Policy",
    description: "Privacy and Cookies Policy for MyDeenMarket",
    url: `${siteConfig.url}/policies/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#0d5d4f] to-[#1a3d3a] text-white py-16 md:py-24">
        <div className="absolute inset-0 islamic-pattern-dark opacity-20" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl font-bold mb-4">Privacy and Cookies Policy</h1>
          <p className="text-slate-300">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm sm:prose lg:prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">1. Introduction</h2>
          <p className="text-slate-700 leading-relaxed">
            {siteConfig.name} ("we", "us", "our") operates the {siteConfig.name} website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
          </p>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">2. Information Collection and Use</h2>
          <p className="text-slate-700 leading-relaxed">We collect several different types of information for various purposes to provide and improve our Service to you.</p>
          
          <h3 className="text-xl font-semibold text-[#0f172a] mt-6 mb-3">Types of Data Collected:</h3>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li><strong>Personal Data:</strong> Email address, name, phone number, address, and other contact information</li>
            <li><strong>Usage Data:</strong> Information about how you access and use the Service (pages visited, time spent, etc.)</li>
            <li><strong>Cookies:</strong> We use cookies to track your preferences and improve your experience</li>
            <li><strong>Payment Information:</strong> Credit card or bank details (processed securely by payment providers)</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">3. Use of Data</h2>
          <p className="text-slate-700 leading-relaxed">MyDeenMarket uses the collected data for various purposes:</p>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information to improve our Service</li>
            <li>To monitor the usage of our Service</li>
            <li>To detect, prevent, and address technical issues and fraud</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">4. Cookies</h2>
          <p className="text-slate-700 leading-relaxed">
            Cookies are files with a small amount of data that are stored on your device. We use cookies to:
          </p>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>Remember your preferences and settings</li>
            <li>Understand how you use our Service</li>
            <li>Improve your user experience</li>
            <li>Track website analytics</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">5. Security of Data</h2>
          <p className="text-slate-700 leading-relaxed">
            The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. We use industry-standard encryption and secure protocols to protect your information.
          </p>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">6. Third-Party Services</h2>
          <p className="text-slate-700 leading-relaxed">
            We may use third-party service providers to analyze how our Service is used, process payments, and improve our Service. These third parties have access to your Personal Data only to perform these tasks on our behalf.
          </p>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">7. Analytics</h2>
          <p className="text-slate-700 leading-relaxed">
            We use Google Analytics and other analytics tools to understand how you use our Service. These services may collect information about your visits to our site and other websites.
          </p>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">8. Links to Other Sites</h2>
          <p className="text-slate-700 leading-relaxed">
            Our Service may contain links to other sites that are not operated by us. This Privacy Policy does not apply to third-party websites, and we are not responsible for their privacy practices.
          </p>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">9. Your Rights</h2>
          <p className="text-slate-700 leading-relaxed">You have the right to:</p>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">10. Contact Us</h2>
          <p className="text-slate-700 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <div className="bg-slate-50 p-6 rounded-lg mt-4">
            <p className="text-slate-700"><strong>Email:</strong> <a href={`mailto:${siteConfig.email}`} className="text-[#d4a853] hover:underline">{siteConfig.email}</a></p>
            <p className="text-slate-700"><strong>Phone:</strong> <a href={`tel:${siteConfig.phone.replace(/[^+\d]/g, "")}`} className="text-[#d4a853] hover:underline">{siteConfig.phone}</a></p>
            <p className="text-slate-700"><strong>Address:</strong> {siteConfig.address}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
