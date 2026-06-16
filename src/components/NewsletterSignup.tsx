"use client";

import { FormEvent, useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    setIsError(false);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "homepage" }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setIsError(true);
        setMessage(data.error || "Subscription failed.");
        return;
      }

      setEmail("");
      setMessage("Subscribed. Please check your inbox.");
    } catch {
      setIsError(true);
      setMessage("Unable to subscribe right now.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <form className="flex flex-col sm:flex-row gap-3" onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 px-5 py-4 rounded-full text-sm bg-white/[0.06] border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-[#d4a853]/30 focus:bg-white/[0.08] transition-all"
          aria-label="Email address"
          required
        />
        <button
          type="submit"
          disabled={submitting}
          className="px-8 py-4 bg-[#d4a853] text-[#0f172a] rounded-full font-semibold text-sm hover:bg-[#e8c97a] transition-all hover:shadow-[0_4px_20px_rgba(212,168,83,0.3)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {message ? (
        <p className={`mt-4 text-xs ${isError ? "text-red-300" : "text-emerald-300"}`}>{message}</p>
      ) : null}
    </>
  );
}
