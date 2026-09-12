"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Activity,
  CalendarDays,
  Eye,
  Globe,
  LogOut,
  Moon,
  RefreshCw,
  ShieldCheck,
  Sun,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";

interface CountRow {
  count: number;
}
type Row = { [key: string]: string | null; count: number };
interface VisitorsRow {
  ip_address: string | null;
  name: string | null;
  batch: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  visits: number;
  first_seen: string;
  last_seen: string;
}
interface RecentRow {
  id: number;
  name: string | null;
  batch: string | null;
  major_or_section: string | null;
  role: string | null;
  device_type: string | null;
  browser: string | null;
  ip_address: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  created_at: string;
}

interface Stats {
  total: number;
  uniqueVisitors: number;
  newVisitors: number;
  returningVisitors: number;
  today: number;
  daysActive: number;
  byBatch: Row[];
  byMajor: Row[];
  byRole: Row[];
  byDevice: Row[];
  byBrowser: Row[];
  byReferrer: Row[];
  daily: Row[];
  hourly: Row[];
  visitors: VisitorsRow[];
  recent: RecentRow[];
}

const DEVICE_LABELS: Record<string, string> = {
  desktop: "ডেস্কটপ",
  mobile: "মোবাইল",
  tablet: "ট্যাবলেট",
};

const ROLE_LABELS: Record<string, string> = {
  student: "শিক্ষার্থী",
  teacher: "শিক্ষক",
};

function bn(value: number): string {
  return value.toLocaleString("bn-BD");
}

function formatDateTime(value: string): string {
  const d = new Date(value);
  return d.toLocaleString("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function locationText(r: {
  country: string | null;
  region: string | null;
  city: string | null;
}): string {
  const parts = [r.city, r.region].filter(Boolean) as string[];
  const base = parts.join(", ");
  if (!base && !r.country) return "—";
  return r.country ? (base ? `${base} (${r.country})` : r.country) : base;
}

function BarList({ rows }: { rows: { label: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  if (rows.length === 0) {
    return (
      <p className="text-xs text-slate-500">কোনো ডেটা নেই — ভিজিট শুরু হলে এখানে দেখা যাবে।</p>
    );
  }
  return (
    <div className="space-y-2.5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3">
          <span className="w-24 shrink-0 truncate text-xs font-semibold text-slate-600">
            {r.label}
          </span>
          <div className="h-6 flex-1 overflow-hidden rounded-lg bg-slate-100">
            <div
              className="h-full rounded-lg bg-gradient-to-r from-sky-500 to-cyan-400"
              style={{ width: `${Math.max(2, (r.count / max) * 100)}%` }}
            />
          </div>
          <span className="w-9 shrink-0 text-right text-xs font-bold text-slate-700">
            {bn(r.count)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  // Default theme: LIGHT (clear & readable). Dark is optional.
  const [light, setLight] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("aibasync_admin_theme");
    if (saved === "dark") setLight(false);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", !light);
    localStorage.setItem("aibasync_admin_theme", light ? "light" : "dark");
  }, [light]);

  const login = useCallback(async (pw: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(data.error || "পাসওয়ার্ড ভুল হয়েছে");
        return false;
      }
      setStats((await res.json()) as Stats);
      return true;
    } catch {
      setError("সার্ভারে যোগাযোগে সমস্যা হয়েছে");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const saved = sessionStorage.getItem("aibasync_admin_password");
    if (saved) {
      setPassword(saved);
      login(saved).then((ok) => {
        if (ok) setAuthed(true);
        else sessionStorage.removeItem("aibasync_admin_password");
      });
    }
  }, [login]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!password.trim() || loading) return;
    const ok = await login(password);
    if (ok) {
      sessionStorage.setItem("aibasync_admin_password", password);
      setAuthed(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("aibasync_admin_password");
    setAuthed(false);
    setStats(null);
    setPassword("");
  };

  if (!authed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-md shadow-sky-600/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">অ্যাডমিন স্ট্যাটস</h1>
              <p className="text-xs font-semibold text-slate-500">
                AIBA Sync Analytics
              </p>
            </div>
          </div>
          <label className="mb-1.5 block text-xs font-bold text-slate-700">
            পাসওয়ার্ড
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="অ্যাডমিন পাসওয়ার্ড"
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
          {error && (
            <p className="mt-2 text-xs font-bold text-rose-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-sky-600 py-2.5 text-sm font-bold text-white shadow-md shadow-sky-600/30 transition hover:bg-sky-500 disabled:opacity-50"
          >
            {loading ? "নিরীক্ষা হচ্ছে…" : "ড্যাশবোর্ড দেখুন"}
          </button>
        </form>
      </main>
    );
  }

  const rows = {
    daily: (stats?.daily ?? []).map((r) => ({ label: r.day ? r.day.slice(5) : "—", count: r.count })),
    hourly: (stats?.hourly ?? []).map((r) => ({ label: r.hour ? `${r.hour}:00` : "—", count: r.count })),
    byBatch: (stats?.byBatch ?? []).map((r) => ({ label: r.batch ?? "—", count: r.count })),
    byMajor: (stats?.byMajor ?? []).map((r) => ({ label: r.major_or_section ?? "—", count: r.count })),
    byRole: (stats?.byRole ?? []).map((r) => ({ label: ROLE_LABELS[r.role ?? ""] ?? r.role ?? "—", count: r.count })),
    byDevice: (stats?.byDevice ?? []).map((r) => ({ label: DEVICE_LABELS[r.device_type ?? ""] ?? r.device_type ?? "—", count: r.count })),
    byBrowser: (stats?.byBrowser ?? []).map((r) => ({ label: r.browser ?? "—", count: r.count })),
    byReferrer: (stats?.byReferrer ?? []).map((r) => ({ label: r.referrer ?? "—", count: r.count })),
  };

  const cards = [
    { label: "মোট ভিজিট", value: stats ? bn(stats.total) : "—", icon: Eye, color: "bg-sky-500" },
    { label: "ইউনিক ভিজিটর", value: stats ? bn(stats.uniqueVisitors) : "—", icon: Users, color: "bg-violet-500" },
    { label: "নতুন ভিজিটর", value: stats ? bn(stats.newVisitors) : "—", icon: UserPlus, color: "bg-emerald-500" },
    { label: "ফিরে আসা", value: stats ? bn(stats.returningVisitors) : "—", icon: UserCheck, color: "bg-teal-500" },
    { label: "আজকের ভিজিট", value: stats ? bn(stats.today) : "—", icon: Activity, color: "bg-amber-500" },
    { label: "সক্রিয় দিন", value: stats ? bn(stats.daysActive) : "—", icon: CalendarDays, color: "bg-rose-500" },
  ];

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-md shadow-sky-500/30">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight">
                AIBA Sync — অ্যানালিটিক্স
              </h1>
              <p className="text-xs font-semibold text-slate-500">
                {stats
                  ? `সর্বশেষ আপডেট: ${formatDateTime(new Date().toISOString())} (ঢাকা সময়)`
                  : "ব্যবহারকারী ট্র্যাকিং ড্যাশবোর্ড"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => login(password)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:text-sky-600 cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">রিফ্রেশ</span>
            </button>
            <button
              type="button"
              onClick={() => setLight(!light)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-600 transition hover:text-sky-600 cursor-pointer"
            >
              {light ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span className="hidden sm:inline">{light ? "ডার্ক" : "লাইট"}</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">লগআউট</span>
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
            {error}
          </div>
        )}

        {!stats && loading ? (
          <p className="py-16 text-center text-sm font-bold text-slate-500">
            ডেটা লোড হচ্ছে…
          </p>
        ) : stats ? (
          <>
            <section className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {cards.map((c) => (
                <div
                  key={c.label}
                  className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div
                    className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl text-white ${c.color}`}
                  >
                    <c.icon className="h-4 w-4" />
                  </div>
                  <p className="text-2xl font-black tracking-tight">{c.value}</p>
                  <p className="text-xs font-bold text-slate-500">{c.label}</p>
                </div>
              ))}
            </section>

            <section className="mb-6 grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-black text-slate-800">
                  গত ১৪ দিনের ভিজিট
                </h2>
                <BarList rows={rows.daily} />
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-black text-slate-800">
                  কোন ঘণ্টায় বেশি ভিজিট হয় (গত ৭ দিন)
                </h2>
                <BarList rows={rows.hourly} />
              </div>
            </section>

            <section className="mb-6 grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-black text-slate-800">
                  ব্যাচ অনুযায়ী
                </h2>
                <BarList rows={rows.byBatch} />
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-black text-slate-800">
                  মেজর / সেকশন অনুযায়ী
                </h2>
                <BarList rows={rows.byMajor} />
              </div>
            </section>

            <section className="mb-6 grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-black text-slate-800">
                  ব্যবহারকারীর ধরন ও ডিভাইস
                </h2>
                <div className="space-y-5">
                  <div>
                    <p className="mb-2 text-xs font-bold text-slate-500">রোল</p>
                    <BarList rows={rows.byRole} />
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-bold text-slate-500">ডিভাইস</p>
                    <BarList rows={rows.byDevice} />
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-bold text-slate-500">ব্রাউজার</p>
                    <BarList rows={rows.byBrowser} />
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-black text-slate-800">
                  কোথা থেকে আসছে (রেফারার)
                </h2>
                <BarList rows={rows.byReferrer} />
                <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs font-black text-slate-700">
                    <Globe className="h-4 w-4 text-sky-600" />
                    ভিজিটর লোকেশন (IP থেকে, Vercel-এর হেডার)
                  </div>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    প্রতিটি ভিজিটে দেশ/অঞ্চল/শহর — নিচের তালিকায় দেখা যাবে। এই
                    তথ্য শুধু ডাটাবেসেই থাকে, GitHub-এ কিছুই লেখা হয় না।
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-black text-slate-800">
                ভিজিটর তালিকা (IP ও লোকেশনসহ)
              </h2>
              {stats.visitors.length === 0 ? (
                <p className="text-xs text-slate-500">
                  কোনো ডেটা নেই — ভিজিট শুরু হলে এখানে দেখা যাবে।
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="pb-2 pr-3 font-bold">IP অ্যাড্রেস</th>
                        <th className="pb-2 pr-3 font-bold">নাম</th>
                        <th className="pb-2 pr-3 font-bold">ব্যাচ</th>
                        <th className="pb-2 pr-3 font-bold">লোকেশন</th>
                        <th className="pb-2 pr-3 font-bold">ভিজিট</th>
                        <th className="pb-2 pr-3 font-bold">প্রথম দেখা</th>
                        <th className="pb-2 font-bold">সর্বশেষ দেখা</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.visitors.map((v) => (
                        <tr
                          key={v.ip_address ?? v.last_seen}
                          className="border-b border-slate-100 last:border-0"
                        >
                          <td className="py-2 pr-3 font-mono font-semibold text-slate-700">
                            {v.ip_address || "—"}
                          </td>
                          <td className="py-2 pr-3 font-bold">{v.name || "—"}</td>
                          <td className="py-2 pr-3">{v.batch || "—"}</td>
                          <td className="py-2 pr-3 font-medium text-slate-600">
                            {locationText(v)}
                          </td>
                          <td className="py-2 pr-3 font-bold">{bn(v.visits)}</td>
                          <td className="py-2 pr-3 text-slate-500">
                            {formatDateTime(v.first_seen)}
                          </td>
                          <td className="py-2 text-slate-500">
                            {formatDateTime(v.last_seen)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-black text-slate-800">
                সর্বশেষ ভিজিটসমূহ (সম্পূর্ণ বিবরণ)
              </h2>
              {stats.recent.length === 0 ? (
                <p className="text-xs text-slate-500">
                  কোনো ভিজিট নেই — প্রথম ভিজিট এখানে দেখা যাবে।
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500">
                        <th className="pb-2 pr-3 font-bold">সময় (ঢাকা)</th>
                        <th className="pb-2 pr-3 font-bold">নাম</th>
                        <th className="pb-2 pr-3 font-bold">ব্যাচ</th>
                        <th className="pb-2 pr-3 font-bold">মেজর/সেকশন</th>
                        <th className="pb-2 pr-3 font-bold">রোল</th>
                        <th className="pb-2 pr-3 font-bold">ডিভাইস</th>
                        <th className="pb-2 pr-3 font-bold">ব্রাউজার</th>
                        <th className="pb-2 pr-3 font-bold">IP</th>
                        <th className="pb-2 font-bold">লোকেশন</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recent.map((r) => (
                        <tr
                          key={r.id}
                          className="border-b border-slate-100 last:border-0"
                        >
                          <td className="py-2 pr-3 font-semibold text-slate-600">
                            {formatDateTime(r.created_at)}
                          </td>
                          <td className="py-2 pr-3 font-bold">{r.name || "—"}</td>
                          <td className="py-2 pr-3">{r.batch || "—"}</td>
                          <td className="py-2 pr-3">
                            {r.major_or_section || "—"}
                          </td>
                          <td className="py-2 pr-3">
                            {ROLE_LABELS[r.role ?? ""] ?? r.role ?? "—"}
                          </td>
                          <td className="py-2 pr-3">
                            {DEVICE_LABELS[r.device_type ?? ""] ??
                              r.device_type ??
                              "—"}
                          </td>
                          <td className="py-2 pr-3 font-semibold">
                            {r.browser || "—"}
                          </td>
                          <td className="py-2 pr-3 font-mono font-semibold text-slate-600">
                            {r.ip_address || "—"}
                          </td>
                          <td className="py-2 font-medium text-slate-600">
                            {locationText(r)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
