"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import {
  type Currency,
  currencies,
  getCurrencyByCode,
  getCurrencyForCountry,
  detectCountryFromTimezone,
  formatCurrencyPrice,
} from "@/lib/currency";

interface CurrencyContextType {
  currency: Currency;
  setCurrencyCode: (code: string) => void;
  formatPrice: (priceInPKR: number) => string;
  currencies: Currency[];
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>(currencies[0]);

  useEffect(() => {
    const saved = localStorage.getItem("currency");
    if (saved) {
      setCurrency(getCurrencyByCode(saved));
    } else {
      const country = detectCountryFromTimezone();
      const detected = getCurrencyForCountry(country);
      setCurrency(detected);
      localStorage.setItem("currency", detected.code);
    }
  }, []);

  const setCurrencyCode = useCallback((code: string) => {
    const c = getCurrencyByCode(code);
    setCurrency(c);
    localStorage.setItem("currency", code);
  }, []);

  const formatPrice = useCallback(
    (priceInPKR: number) => formatCurrencyPrice(priceInPKR, currency),
    [currency]
  );

  return (
    <CurrencyContext.Provider value={{ currency, setCurrencyCode, formatPrice, currencies }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
