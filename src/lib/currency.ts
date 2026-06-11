// ============================================
// MULTI-CURRENCY SYSTEM
// Detects user country and shows local prices
// ============================================

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Rate relative to PKR (1 PKR = X of this currency)
  locale: string;
  flag: string;
}

export const currencies: Currency[] = [
  { code: "PKR", symbol: "Rs.", name: "Pakistani Rupee", rate: 1, locale: "en-PK", flag: "🇵🇰" },
  { code: "USD", symbol: "$", name: "US Dollar", rate: 0.0036, locale: "en-US", flag: "🇺🇸" },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.0028, locale: "en-GB", flag: "🇬🇧" },
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.0033, locale: "de-DE", flag: "🇪🇺" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", rate: 0.0132, locale: "ar-AE", flag: "🇦🇪" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", rate: 0.0135, locale: "ar-SA", flag: "🇸🇦" },
  { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 0.30, locale: "en-IN", flag: "🇮🇳" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", rate: 0.005, locale: "en-CA", flag: "🇨🇦" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 0.0055, locale: "en-AU", flag: "🇦🇺" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", rate: 0.016, locale: "ms-MY", flag: "🇲🇾" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", rate: 0.12, locale: "tr-TR", flag: "🇹🇷" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", rate: 0.43, locale: "bn-BD", flag: "🇧🇩" },
];

// Map country codes to currency codes
const countryToCurrency: Record<string, string> = {
  PK: "PKR", US: "USD", GB: "GBP", DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR",
  NL: "EUR", BE: "EUR", AT: "EUR", IE: "EUR", PT: "EUR", FI: "EUR", GR: "EUR",
  AE: "AED", SA: "SAR", IN: "INR", CA: "CAD", AU: "AUD", MY: "MYR", TR: "TRY",
  BD: "BDT", QA: "SAR", KW: "SAR", BH: "SAR", OM: "SAR",
};

export function getCurrencyByCode(code: string): Currency {
  return currencies.find((c) => c.code === code) || currencies[0];
}

export function getCurrencyForCountry(countryCode: string): Currency {
  const currencyCode = countryToCurrency[countryCode] || "PKR";
  return getCurrencyByCode(currencyCode);
}

export function convertPrice(priceInPKR: number, currency: Currency): number {
  return Math.round(priceInPKR * currency.rate * 100) / 100;
}

export function formatCurrencyPrice(priceInPKR: number, currency: Currency): string {
  const converted = convertPrice(priceInPKR, currency);
  if (currency.code === "PKR") {
    return `Rs.${converted.toLocaleString("en-PK")}`;
  }
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: converted < 10 ? 2 : 0,
      maximumFractionDigits: 2,
    }).format(converted);
  } catch {
    return `${currency.symbol}${converted.toFixed(2)}`;
  }
}

// Timezone-based country detection (no external API needed)
const timezoneToCountry: Record<string, string> = {
  "Asia/Karachi": "PK", "America/New_York": "US", "America/Chicago": "US",
  "America/Denver": "US", "America/Los_Angeles": "US", "Europe/London": "GB",
  "Europe/Berlin": "DE", "Europe/Paris": "FR", "Europe/Rome": "IT",
  "Europe/Madrid": "ES", "Asia/Dubai": "AE", "Asia/Riyadh": "SA",
  "Asia/Kolkata": "IN", "Asia/Calcutta": "IN", "America/Toronto": "CA",
  "Australia/Sydney": "AU", "Asia/Kuala_Lumpur": "MY", "Europe/Istanbul": "TR",
  "Asia/Dhaka": "BD", "Asia/Qatar": "QA", "Asia/Kuwait": "KW",
  "Asia/Bahrain": "BH", "Asia/Muscat": "OM",
};

export function detectCountryFromTimezone(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return timezoneToCountry[tz] || "PK";
  } catch {
    return "PK";
  }
}
