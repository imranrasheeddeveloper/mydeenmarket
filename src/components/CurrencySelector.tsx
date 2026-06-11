"use client";

import { useCurrency } from "./CurrencyProvider";

export default function CurrencySelector() {
  const { currency, setCurrencyCode, currencies } = useCurrency();

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-1.5 text-sm text-white/70 hover:text-[#C5A44E] transition-colors px-2 py-1 rounded-md hover:bg-white/5"
        aria-label="Select currency"
      >
        <span>{currency.flag}</span>
        <span className="font-medium">{currency.code}</span>
        <svg className="w-3 h-3 text-white/40 group-hover:text-[#C5A44E] transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 absolute top-full right-0 mt-1 w-56 glass-dark rounded-xl py-2 z-50 max-h-72 overflow-y-auto shadow-2xl">
        {currencies.map((c) => (
          <button
            key={c.code}
            onClick={() => setCurrencyCode(c.code)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-colors ${
              c.code === currency.code ? "bg-white/10 text-[#C5A44E] font-medium" : "text-white/70"
            }`}
          >
            <span className="text-lg">{c.flag}</span>
            <span className="flex-1 text-left">{c.name}</span>
            <span className="text-xs text-white/30">{c.code}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
