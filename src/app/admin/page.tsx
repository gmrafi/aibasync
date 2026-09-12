"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import {
  Activity,
  CalendarDays,
  Eye,
  LogOut,
  Moon,
  ShieldCheck,
  Sun,
  Users,
} from "lucide-react";

interface BatchRow {
  batch: string | null;
  count: number;
}
interface MajorRow {
  major_or_section: string | null;
  count: number;
}
interface RoleRow {
  role: string | null;
  count: number;
}
interface DeviceRow {
  device_type: string | null;
  count: number;
}
interface DailyRow {
  day: string;
  count: number;
}
interface RecentRow {
  id: number;
  name: string | null;
  batch: string | null;
  major_or_section: string | null;
  role: string | null;
  device_type: string | null;
  created_at: string;
}

interface Stats {
  total: number;
  uniqueVisitors: number;
  today: number;
  daysActive: number;
  byBatch: BatchRow[];
  byMajor: MajorRow[];
  byRole: RoleRow[];
  byDevice: DeviceRow[];
  daily: DailyRow[];
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

function BarList({ rows }: { rows: { label: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  if (rows.length === 0) {
    return (
      <p className="text-xs text-slate-500 dark:text-slate-400">কোনো ডেটা নেই</p>
    );
  }
  return (
    <div className="space-y-2.5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-xs font-semibold text-slate-600 dark:text-slate-300">
            {r.label}
          </span>
          <div className="h-6 flex-1 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-lg bg-gradient-to-r from-sky-500 to-cyan-400 dark:from-sky-600 dark:to-cyan-500"
              style={{ width: `${Math.max(2, (r.count / max) * 100)}%` }}
            />
          </div>
          <span className="w-9 shrink-0 text-right text-xs font-bold text-slate-700 dark:text-slate-200">
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
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("aibasync_admin_theme");
    const isDark = savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(isDark);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("aibasync_admin_theme", dark ? "dark" : "light");
  }, [dark]);

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
      <main
        className={`flex min-h-screen items-center justify-center px-4 ${
          dark ? "bg-slate-950" : "bg-slate-100"
        }`}
      >
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-md shadow-sky-600/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white">
                অ্যাডমিন স্ট্যাটস
              </h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                AIBA Sync Analytics
              </p>
            </div>
          </div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">
            পাসওয়ার্ড
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="অ্যাডমিন পাসওয়ার্ড"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
          />
          {error && (
            <p className="mt-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
              {error}
            </p>
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

  const dailyRows =
    stats?.daily.map((d) => ({ label: d.day.slice(5), count: d.count })) ?? [];
  const batchRows =
    stats?.byBatch.map((r) => ({ label: r.batch ?? "—", count: r.count })) ??
    [];
  const majorRows =
    stats?.byMajor.map((r) => ({
      label: r.major_or_section ?? "—",
      count: r.count,
    })) ?? [];
  const deviceRows =
    stats?.byDevice.map((r) => ({
      label: DEVICE_LABELS[r.device_type ?? ""] ?? r.device_type ?? "—",
      count: r.count,
    })) ?? [];
  const roleRows =
    stats?.byRole.map((r) => ({
      label: ROLE_LABELS[r.role ?? ""] ?? r.role ?? "—",
      count: r.count,
    })) ?? [];

  const cards = [
    { label: "মোট ভিজিট", value: stats ? bn(stats.total) : "—", icon: Eye, color: "bg-sky-500" },
    { label: "ইউনিক ভিজিটর", value: stats ? bn(stats.uniqueVisitors) : "—", icon: Users, color: "bg-violet-500" },
    { label: "আজকের ভিজিট", value: stats ? bn(stats.today) : "—", icon: Activity, color: "bg-emerald-500" },
    { label: "সক্রিয় দিন", value: stats ? bn(stats.daysActive) : "—", icon: CalendarDays, color: "bg-amber-500" },
  ];

  return (
    <main
      className={`min-h-screen ${
        dark ? "bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-900"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 py-6 sm:py-8">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 text-white shadow-md shadow-sky-500/30">
              <Eye className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                AIBA Sync — অ্যানালিটিক্স
              </h1>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {stats
                  ? `সর্বশেষ আপডেট: ${formatDateTime(new Date().toISOString())} (ঢাকা সময়)`
                  : "ব্যবহারকারী ট্র্যাকিং ড্যাশবোর্ড"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDark(!dark)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 transition hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="hidden sm:inline">{dark ? "লাইট" : "ডার্ক"}</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-500/30 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-bold text-rose-600 dark:text-rose-300 transition hover:bg-rose-50 dark:hover:bg-rose-500/10 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">লগআউট</span>
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-5 rounded-2xl border border-rose-200 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        {!stats && loading ? (
          <p className="py-16 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
            ডেটা লোড হচ্ছে…
          </p>
        ) : stats ? (
          <>
            <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {cards.map((c) => (
                <div
                  key={c.label}
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm"
                >
                  <div
                    className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl text-white ${c.color}`}
                  >
                    <c.icon className="h-4 w-4" />
                  </div>
                  <p className="text-2xl font-black tracking-tight">{c.value}</p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {c.label}
                  </p>
                </div>
              ))}
            </section>

            <section className="mb-6 grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-bold">গত ১৪ দিনের ভিজিট</h2>
                <BarList rows={dailyRows} />
              </div>
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-bold">ব্যাচ অনুযায়ী</h2>
                <BarList rows={batchRows} />
              </div>
            </section>

            <section className="mb-6 grid gap-5 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-bold">মেজর / সেকশন অনুযায়ী</h2>
                <BarList rows={majorRows} />
              </div>
              <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
                <h2 className="mb-4 text-sm font-bold">ব্যবহারকারীর ধরন</h2>
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      রোল
                    </p>
                    <BarList rows={roleRows} />
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                      ডিভাইস
                    </p>
                    <BarList rows={deviceRows} />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-bold">সর্বশেষ ভিজিটসমূহ</h2>
              {stats.recent.length === 0 ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  কোনো ভিজিট নেই — প্রথম ভিজিট এখানে দেখা যাবে।
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                        <th className="pb-2 pr-3 font-semibold">সময় (ঢাকা)</th>
                        <th className="pb-2 pr-3 font-semibold">নাম</th>
                        <th className="pb-2 pr-3 font-semibold">ব্যাচ</th>
                        <th className="pb-2 pr-3 font-semibold">মেজর/সেকশন</th>
                        <th className="pb-2 pr-3 font-semibold">রোল</th>
                        <th className="pb-2 font-semibold">ডিভাইস</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recent.map((r) => (
                        <tr
                          key={r.id}
                          className="border-b border-slate-100 last:border-0 dark:border-slate-800/60"
                        >
                          <td className="py-2 pr-3 font-medium text-slate-600 dark:text-slate-300">
                            {formatDateTime(r.created_at)}
                          </td>
                          <td className="py-2 pr-3 font-semibold">
                            {r.name || "—"}
                          </td>
                          <td className="py-2 pr-3">{r.batch || "—"}</td>
                          <td className="py-2 pr-3">
                            {r.major_or_section || "—"}
                          </td>
                          <td className="py-2 pr-3">
                            {ROLE_LABELS[r.role ?? ""] ?? r.role ?? "—"}
                          </td>
                          <td className="py-2">
                            {DEVICE_LABELS[r.device_type ?? ""] ??
                              r.device_type ??
                              "—"}
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
