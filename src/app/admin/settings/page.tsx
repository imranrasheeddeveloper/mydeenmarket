"use client";

import { useState, useEffect } from "react";

interface Settings {
  name: string;
  title: string;
  description: string;
  url: string;
  address: string;
  email: string;
  phone: string;
  hours: string;
  freeShippingThreshold: number;
  socialFacebook: string;
  socialInstagram: string;
  socialYoutube: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
  smtpFrom: string;
  smtpSecure: boolean;
  whatsappNumber: string;
  whatsappPhoneId: string;
  whatsappToken: string;
  enableMetaTracking: boolean;
  metaPixelId: string;
  metaCapiToken: string;
  enableGoogleTracking: boolean;
  ga4Id: string;
  googleAdsConversionId: string;
  googleAdsLabel: string;
}

const defaults: Settings = {
  name: "", title: "", description: "", url: "", address: "", email: "", phone: "", hours: "",
  freeShippingThreshold: 5000,
  socialFacebook: "", socialInstagram: "", socialYoutube: "",
  smtpHost: "", smtpPort: 587, smtpUser: "", smtpPass: "", smtpFrom: "", smtpSecure: false,
  whatsappNumber: "+923035036392", whatsappPhoneId: "", whatsappToken: "",
  enableMetaTracking: false, metaPixelId: "", metaCapiToken: "",
  enableGoogleTracking: false, ga4Id: "", googleAdsConversionId: "", googleAdsLabel: "",
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<Settings>(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [msg, setMsg] = useState("");
  const [smtpMsg, setSmtpMsg] = useState("");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => setForm((prev) => ({ ...prev, ...d })))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const update = (field: keyof Settings, value: string | number | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) setMsg("Settings saved successfully!");
      else setMsg("Failed to save settings.");
    } catch {
      setMsg("Error saving settings.");
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const handleTestSmtp = async () => {
    setTesting(true);
    setSmtpMsg("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          smtpHost: form.smtpHost,
          smtpPort: form.smtpPort,
          smtpUser: form.smtpUser,
          smtpPass: form.smtpPass,
          smtpSecure: form.smtpSecure,
          smtpFrom: form.smtpFrom,
        }),
      });
      const data = await res.json();
      if (res.ok) setSmtpMsg("Test email sent to your admin email!");
      else setSmtpMsg(data.error);
    } catch {
      setSmtpMsg("Connection error.");
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin" />
      </div>
    );
  }

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your store configuration</p>
        </div>
        {msg && (
          <span className={`text-sm font-medium ${msg.includes("success") ? "text-emerald-600" : "text-red-600"}`}>{msg}</span>
        )}
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
            <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Store URL</label>
            <input type="url" value={form.url} onChange={(e) => update("url", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
            <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
            <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} className={inputCls} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
            <input type="text" value={form.address} onChange={(e) => update("address", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Business Hours</label>
            <input type="text" value={form.hours} onChange={(e) => update("hours", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Free Shipping Threshold (PKR)</label>
            <input type="number" value={form.freeShippingThreshold} onChange={(e) => update("freeShippingThreshold", Number(e.target.value))} className={inputCls} />
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
            <input type="url" value={form.socialFacebook} onChange={(e) => update("socialFacebook", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Instagram URL</label>
            <input type="url" value={form.socialInstagram} onChange={(e) => update("socialInstagram", e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">YouTube URL</label>
            <input type="url" value={form.socialYoutube} onChange={(e) => update("socialYoutube", e.target.value)} className={inputCls} />
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
            <input type="text" value={form.title} onChange={(e) => update("title", e.target.value)} className={inputCls} />
            <p className="text-xs text-gray-400 mt-1">Recommended: 50-60 characters</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} className={`${inputCls} resize-none`} />
            <p className="text-xs text-gray-400 mt-1">Recommended: 150-160 characters</p>
          </div>
        </div>
      </div>

      {/* SMTP / Email Settings */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email / SMTP Configuration
        </h2>
        <p className="text-sm text-gray-500 mb-5">Configure SMTP to send order confirmations and status update emails to customers.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">SMTP Host</label>
            <input type="text" value={form.smtpHost} onChange={(e) => update("smtpHost", e.target.value)} placeholder="smtp.gmail.com" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">SMTP Port</label>
            <input type="number" value={form.smtpPort} onChange={(e) => update("smtpPort", Number(e.target.value))} className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">SMTP Username</label>
            <input type="text" value={form.smtpUser} onChange={(e) => update("smtpUser", e.target.value)} placeholder="your@email.com" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">SMTP Password / App Password</label>
            <input type="password" value={form.smtpPass} onChange={(e) => update("smtpPass", e.target.value)} placeholder="••••••••" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">From Email</label>
            <input type="email" value={form.smtpFrom} onChange={(e) => update("smtpFrom", e.target.value)} placeholder="noreply@yourstore.com" className={inputCls} />
            <p className="text-xs text-gray-400 mt-1">Defaults to SMTP username if empty</p>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2.5 pb-2.5">
              <input type="checkbox" checked={form.smtpSecure} onChange={(e) => update("smtpSecure", e.target.checked)} className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500" />
              <span className="text-sm text-gray-700">Use SSL/TLS (port 465)</span>
            </label>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3 flex-wrap">
          <button
            onClick={handleTestSmtp}
            disabled={testing || !form.smtpHost || !form.smtpUser}
            className="px-5 py-2.5 border border-emerald-200 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testing ? "Sending..." : "Send Test Email"}
          </button>
          {smtpMsg && <span className={`text-sm ${smtpMsg.includes("sent") ? "text-emerald-600" : "text-red-600"}`}>{smtpMsg}</span>}
        </div>
        <div className="mt-4 p-3 bg-amber-50 rounded-lg text-xs text-amber-700">
          <strong>Gmail tip:</strong> Use <code className="bg-amber-100 px-1 rounded">smtp.gmail.com</code>, port <code className="bg-amber-100 px-1 rounded">587</code>, and generate an <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="underline font-medium">App Password</a> (don&apos;t use your regular password).
        </div>
      </div>

      {/* WhatsApp Integration */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#25D366">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          WhatsApp Integration
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          The WhatsApp number is shown as a floating button on the site. The Phone Number ID and Token enable automatic order notifications via the Meta WhatsApp Cloud API.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp Number</label>
            <input
              type="tel"
              value={form.whatsappNumber}
              onChange={(e) => update("whatsappNumber", e.target.value)}
              placeholder="+923035036392"
              className={inputCls}
            />
            <p className="text-xs text-gray-400 mt-1">Shown as floating chat button on the website. Include country code (e.g. +923035036392).</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number ID <span className="text-gray-400 font-normal">(Meta WhatsApp Cloud API)</span></label>
            <input
              type="text"
              value={form.whatsappPhoneId}
              onChange={(e) => update("whatsappPhoneId", e.target.value)}
              placeholder="1234567890123456"
              className={inputCls}
            />
            <p className="text-xs text-gray-400 mt-1">Found in Meta Business → WhatsApp → API Setup → Phone Number ID.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Access Token <span className="text-gray-400 font-normal">(Meta WhatsApp Cloud API)</span></label>
            <input
              type="password"
              value={form.whatsappToken}
              onChange={(e) => update("whatsappToken", e.target.value)}
              placeholder="EAAxxxxxxxx..."
              className={inputCls}
            />
            <p className="text-xs text-gray-400 mt-1">Found in Meta Business → WhatsApp → API Setup → Temporary or Permanent Access Token.</p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-green-50 rounded-lg text-xs text-green-800">
          <strong>Setup guide:</strong> Go to{" "}
          <a href="https://developers.facebook.com/apps" target="_blank" rel="noopener noreferrer" className="underline font-medium">
            Meta for Developers
          </a>{" "}
          → Create App → Add WhatsApp product → copy <em>Phone Number ID</em> and <em>Access Token</em> from API Setup.
          New orders will automatically be sent to your WhatsApp number once configured.
        </div>
      </div>

      {/* Ads Tracking */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 19V6m0 0L7 10m4-4l4 4M5 19h14" />
          </svg>
          Ads Tracking (Meta + Google)
        </h2>
        <p className="text-sm text-gray-500 mb-5">
          Configure tracking IDs and toggles to send PageView, ViewContent, AddToCart, and Purchase events.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={form.enableMetaTracking}
                onChange={(e) => update("enableMetaTracking", e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Enable Meta tracking</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta Pixel ID</label>
            <input
              type="text"
              value={form.metaPixelId}
              onChange={(e) => update("metaPixelId", e.target.value)}
              placeholder="123456789012345"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Meta CAPI Token</label>
            <input
              type="password"
              value={form.metaCapiToken}
              onChange={(e) => update("metaCapiToken", e.target.value)}
              placeholder="EAAB..."
              className={inputCls}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={form.enableGoogleTracking}
                onChange={(e) => update("enableGoogleTracking", e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700">Enable Google tracking</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">GA4 Measurement ID</label>
            <input
              type="text"
              value={form.ga4Id}
              onChange={(e) => update("ga4Id", e.target.value)}
              placeholder="G-XXXXXXXXXX"
              className={inputCls}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Ads Conversion ID</label>
            <input
              type="text"
              value={form.googleAdsConversionId}
              onChange={(e) => update("googleAdsConversionId", e.target.value)}
              placeholder="AW-123456789"
              className={inputCls}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Google Ads Conversion Label</label>
            <input
              type="text"
              value={form.googleAdsLabel}
              onChange={(e) => update("googleAdsLabel", e.target.value)}
              placeholder="AbCdEFghIJKLmNoP"
              className={inputCls}
            />
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors"
        >
          {saving ? "Saving..." : "Save All Settings"}
        </button>
      </div>
    </div>
  );
}