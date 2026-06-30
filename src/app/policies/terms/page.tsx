import type { Metadata } from "next";
import { siteConfig } from "@/lib/data-types";

export const metadata: Metadata = {
  title: "Terms & Services",
  description: "Terms and Conditions of MyDeenMarket. Please read carefully before using our website.",
  openGraph: {
    title: "Terms & Services",
    description: "Terms and Conditions of MyDeenMarket",
    url: `${siteConfig.url}/policies/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#0d5d4f] to-[#1a3d3a] text-white py-16 md:py-24">
        <div className="absolute inset-0 islamic-pattern-dark opacity-20" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="text-4xl font-bold mb-4">Terms & Services</h1>
          <p className="text-slate-300">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-sm sm:prose lg:prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-slate-700 leading-relaxed">
            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
          </p>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">2. Use License</h2>
          <p className="text-slate-700 leading-relaxed">
            Permission is granted to temporarily download one copy of the materials (information or software) on {siteConfig.name} for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
          </p>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>Modifying or copying the materials</li>
            <li>Using the materials for any commercial purpose or for any public display</li>
            <li>Attempting to decompile or reverse engineer any software contained on the website</li>
            <li>Removing any copyright or other proprietary notations from the materials</li>
            <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">3. Disclaimer</h2>
          <p className="text-slate-700 leading-relaxed">
            The materials on {siteConfig.name} are provided as is. {siteConfig.name} makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
          </p>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">4. Limitations</h2>
          <p className="text-slate-700 leading-relaxed">
            In no event shall {siteConfig.name} or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the {siteConfig.name} website, even if {siteConfig.name} has been notified orally or in writing of the possibility of such damage.
          </p>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">5. Accuracy of Materials</h2>
          <p className="text-slate-700 leading-relaxed">
            The materials appearing on {siteConfig.name} could include technical, typographical, or photographic errors. {siteConfig.name} does not warrant that any of the materials on its website are accurate, complete, or current. {siteConfig.name} may make changes to the materials contained on its website at any time without notice.
          </p>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">6. Product Information</h2>
          <p className="text-slate-700 leading-relaxed">
            We strive to provide accurate descriptions and images of all products. However, we do not warrant that product descriptions, pricing, or other content is accurate, complete, reliable, current, or error-free. If a product offered by {siteConfig.name} is not as described, your sole remedy is to request an exchange in line with our Shipment and Exchange Policy.
          </p>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">7. Links</h2>
          <p className="text-slate-700 leading-relaxed">
            {siteConfig.name} has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by {siteConfig.name} of the site. Use of any such linked website is at the user's own risk.
          </p>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">8. Modifications</h2>
          <p className="text-slate-700 leading-relaxed">
            {siteConfig.name} may revise these terms of service for its website at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
          </p>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">9. Governing Law</h2>
          <p className="text-slate-700 leading-relaxed">
            These terms and conditions are governed by and construed in accordance with the laws of Pakistan, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
          </p>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">10. User Responsibilities</h2>
          <p className="text-slate-700 leading-relaxed">
            You agree to use the website only for lawful purposes and in a way that does not infringe upon the rights of others or restrict their use and enjoyment of the website. Prohibited behavior includes:
          </p>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>Harassing or causing distress or inconvenience to any person</li>
            <li>Transmitting obscene or offensive content</li>
            <li>Disrupting the normal flow of dialogue within the website</li>
            <li>Attempting to gain unauthorized access to systems</li>
          </ul>

          <h2 className="text-2xl font-bold text-[#0f172a] mt-8 mb-4">11. Contact Information</h2>
          <p className="text-slate-700 leading-relaxed">
            If you have any questions about these Terms and Conditions, please contact us at:
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
