"use client";

import { useCurrency } from "./CurrencyProvider";

export default function CurrencySelector() {
  const { currency, setCurrencyCode, currencies } = useCurrency();

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-[#d4a853] transition-colors px-2 py-1 rounded-md hover:bg-slate-50"
        aria-label="Select currency"
      >
        <span>{currency.flag}</span>
        <span className="font-medium">{currency.code}</span>
        <svg className="w-3 h-3 text-slate-400 group-hover:text-[#d4a853] transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 absolute top-full right-0 mt-1 w-56 bg-white border border-slate-100 rounded-xl py-2 z-50 max-h-72 overflow-y-auto shadow-xl shadow-slate-200/50">
        {currencies.map((c) => (
          <button
            key={c.code}
            onClick={() => setCurrencyCode(c.code)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors ${
              c.code === currency.code ? "bg-[#d4a853]/10 text-[#d4a853] font-medium" : "text-slate-600"
            }`}
          >
            <span className="text-lg">{c.flag}</span>
            <span className="flex-1 text-left">{c.name}</span>
            <span className="text-xs text-slate-400">{c.code}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
