"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type UiState = "loading" | "success" | "error";

function UnsubscribeContent() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [state, setState] = useState<UiState>("loading");
  const [message, setMessage] = useState("Unsubscribing...");

  useEffect(() => {
    async function run() {
      if (!token) {
        setState("error");
        setMessage("This unsubscribe link is invalid.");
        return;
      }

      try {
        const res = await fetch(`/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`, {
          method: "POST",
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) {
          setState("error");
          setMessage(data.error || "Unable to unsubscribe.");
          return;
        }

        setState("success");
        setMessage("You have been unsubscribed from promotional emails.");
      } catch {
        setState("error");
        setMessage("Something went wrong. Please try again later.");
      }
    }

    run();
  }, [token]);

  return (
    <main className="min-h-[60vh] bg-slate-50 py-16 px-4">
      <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Email Preferences</h1>
        <p className={`text-sm ${state === "success" ? "text-emerald-700" : state === "error" ? "text-red-600" : "text-slate-600"}`}>
          {message}
        </p>
        <div className="mt-6">
          <Link href="/" className="inline-flex items-center px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-700 transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[60vh] bg-slate-50 py-16 px-4">
          <div className="max-w-xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Email Preferences</h1>
            <p className="text-sm text-slate-600">Loading...</p>
          </div>
        </main>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
