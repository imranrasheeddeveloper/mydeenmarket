"use client";

import { useEffect, useMemo, useState } from "react";

type Subscriber = {
  id: string;
  email: string;
  status: string;
  source: string;
  subscribedAt: string;
  unsubscribedAt: string | null;
};

type ApiResponse = {
  total: number;
  subscribed: number;
  unsubscribed: number;
  subscribers: Subscriber[];
};

export default function AdminNewsletterPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<ApiResponse | null>(null);
  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("<h2>New at MyDeenMarket</h2><p>Check our latest books and offers.</p><p><a href='{{unsubscribe_url}}'>Unsubscribe</a></p>");
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState<"" | "test" | "send">("");
  const [sendMsg, setSendMsg] = useState("");
  const [sendErr, setSendErr] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/newsletter/subscribers", { cache: "no-store" });
      const json = (await res.json()) as ApiResponse & { error?: string };
      if (!res.ok) {
        setError(json.error || "Failed to load subscribers.");
        return;
      }
      setData(json);
    } catch {
      setError("Failed to load subscribers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const csv = useMemo(() => {
    if (!data) return "";
    const header = "email,status,source,subscribedAt,unsubscribedAt";
    const rows = data.subscribers.map((s) => {
      const cols = [
        s.email,
        s.status,
        s.source,
        s.subscribedAt,
        s.unsubscribedAt || "",
      ];
      return cols.map((v) => `"${String(v).replaceAll("\"", "\"\"")}"`).join(",");
    });
    return [header, ...rows].join("\n");
  }, [data]);

  function downloadCsv() {
    if (!csv) return;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter-subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function sendCampaign(mode: "test" | "send") {
    setSendErr("");
    setSendMsg("");

    if (!subject.trim() || !html.trim()) {
      setSendErr("Subject and HTML are required.");
      return;
    }

    setSending(mode);
    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          subject,
          html,
          testEmail,
        }),
      });

      const json = (await res.json()) as {
        error?: string;
        message?: string;
        sent?: number;
        failed?: number;
        total?: number;
      };

      if (!res.ok) {
        setSendErr(json.error || "Failed to send campaign.");
        return;
      }

      if (mode === "test") {
        setSendMsg(json.message || "Test email sent.");
      } else {
        setSendMsg(`Campaign finished. Sent: ${json.sent || 0}/${json.total || 0}. Failed: ${json.failed || 0}.`);
      }
    } catch {
      setSendErr("Failed to send campaign.");
    } finally {
      setSending("");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter</h1>
          <p className="text-sm text-gray-500 mt-1">Track subscribers and exports for campaigns.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50"
          >
            Refresh
          </button>
          <button
            onClick={downloadCsv}
            disabled={!data?.subscribers?.length}
            className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 disabled:opacity-50"
          >
            Export CSV
          </button>
        </div>
      </div>

      {loading ? <div className="text-sm text-gray-500">Loading subscribers...</div> : null}
      {error ? <div className="text-sm text-red-600">{error}</div> : null}

      <div className="bg-white border border-gray-100 rounded-xl p-5 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Send Campaign</h2>
          <p className="text-sm text-gray-500 mt-1">
            Sends promotional email only to users with status subscribed. Include <span className="font-mono">{{"{{unsubscribe_url}}"}}</span> in HTML where you want the unsubscribe link.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            type="text"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
            placeholder="Example: 20% off this week"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">HTML Content</label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            rows={10}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-emerald-600"
            placeholder="<h2>Offer</h2><p>...</p><p><a href='{{unsubscribe_url}}'>Unsubscribe</a></p>"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Test Email (optional)</label>
          <input
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            type="email"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600"
            placeholder="If empty, admin account email is used"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => sendCampaign("test")}
            disabled={sending !== ""}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            {sending === "test" ? "Sending Test..." : "Send Test Email"}
          </button>
          <button
            onClick={() => sendCampaign("send")}
            disabled={sending !== ""}
            className="px-4 py-2 rounded-lg bg-emerald-700 text-white text-sm font-medium hover:bg-emerald-800 disabled:opacity-50"
          >
            {sending === "send" ? "Sending Campaign..." : "Send to Subscribed Users"}
          </button>
        </div>

        {sendMsg ? <p className="text-sm text-emerald-700">{sendMsg}</p> : null}
        {sendErr ? <p className="text-sm text-red-600">{sendErr}</p> : null}
      </div>

      {data ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{data.total}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-500">Subscribed</p>
              <p className="text-2xl font-bold text-emerald-700">{data.subscribed}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs text-gray-500">Unsubscribed</p>
              <p className="text-2xl font-bold text-amber-700">{data.unsubscribed}</p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
            <div className="overflow-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead className="bg-gray-50 text-gray-600">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium">Email</th>
                    <th className="text-left px-4 py-3 font-medium">Status</th>
                    <th className="text-left px-4 py-3 font-medium">Source</th>
                    <th className="text-left px-4 py-3 font-medium">Subscribed</th>
                    <th className="text-left px-4 py-3 font-medium">Unsubscribed</th>
                  </tr>
                </thead>
                <tbody>
                  {data.subscribers.map((s) => (
                    <tr key={s.id} className="border-t border-gray-100">
                      <td className="px-4 py-3 text-gray-900">{s.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.status === "subscribed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{s.source}</td>
                      <td className="px-4 py-3 text-gray-700">{new Date(s.subscribedAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-700">{s.unsubscribedAt ? new Date(s.unsubscribedAt).toLocaleString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
