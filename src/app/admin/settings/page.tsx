"use client";

import { siteConfig } from "@/lib/data-types";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your store configuration</p>
      </div>

      {/* General Settings */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Store Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Name</label>
            <input type="text" defaultValue={siteConfig.name} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Store URL</label>
            <input type="url" defaultValue={siteConfig.url} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
            <input type="email" defaultValue={siteConfig.email} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
            <input type="tel" defaultValue={siteConfig.phone} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
            <input type="text" defaultValue={siteConfig.address} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Hours</label>
            <input type="text" defaultValue={siteConfig.hours} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Free Shipping Threshold (PKR)</label>
            <input type="number" defaultValue={siteConfig.freeShippingThreshold} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600" />
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          Social Media
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Facebook URL</label>
            <input type="url" defaultValue={siteConfig.social.facebook} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram URL</label>
            <input type="url" defaultValue={siteConfig.social.instagram} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">YouTube URL</label>
            <input type="url" defaultValue={siteConfig.social.youtube} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600" />
          </div>
        </div>
      </div>

      {/* SEO Settings */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          SEO Configuration
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Title</label>
            <input type="text" defaultValue={siteConfig.title} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600" />
            <p className="text-xs text-gray-400 mt-1">Recommended: 50-60 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Description</label>
            <textarea rows={3} defaultValue={siteConfig.description} className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600 resize-none" />
            <p className="text-xs text-gray-400 mt-1">Recommended: 150-160 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Verification Code</label>
            <input type="text" placeholder="your-google-verification-code" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600" />
          </div>
        </div>
      </div>

      {/* Authentication */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Authentication (Google OAuth)
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Client ID</label>
            <input type="text" placeholder="Set via GOOGLE_CLIENT_ID env variable" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600 bg-gray-50" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Client Secret</label>
            <input type="password" placeholder="Set via GOOGLE_CLIENT_SECRET env variable" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600 bg-gray-50" readOnly />
          </div>
          <div className="p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
            <strong>Note:</strong> OAuth credentials must be set via environment variables for security.
            Set <code className="bg-blue-100 px-1 rounded">GOOGLE_CLIENT_ID</code>, <code className="bg-blue-100 px-1 rounded">GOOGLE_CLIENT_SECRET</code>, and <code className="bg-blue-100 px-1 rounded">NEXTAUTH_SECRET</code> in your <code className="bg-blue-100 px-1 rounded">.env.local</code> file.
          </div>
        </div>
      </div>

      {/* Currency */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Currency Settings
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Default Currency</label>
            <select defaultValue="PKR" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-emerald-600">
              <option value="PKR">🇵🇰 Pakistani Rupee (PKR)</option>
              <option value="USD">🇺🇸 US Dollar (USD)</option>
              <option value="GBP">🇬🇧 British Pound (GBP)</option>
              <option value="EUR">🇪🇺 Euro (EUR)</option>
              <option value="SAR">🇸🇦 Saudi Riyal (SAR)</option>
              <option value="AED">🇦🇪 UAE Dirham (AED)</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="auto-detect" defaultChecked className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
            <label htmlFor="auto-detect" className="text-sm text-gray-700">
              Auto-detect visitor currency based on timezone/location
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="show-selector" defaultChecked className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
            <label htmlFor="show-selector" className="text-sm text-gray-700">
              Show currency selector in header
            </label>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-end gap-3">
        <button className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
          Reset
        </button>
        <button className="px-8 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-medium transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}
