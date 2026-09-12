"use client";

import { Building2, CalendarDays, ChevronDown, Download, Moon, Sun } from "lucide-react";
import { INSTITUTION_INFO } from "@/data/routine";

interface NavbarProps {
  studentName?: string;
  batch: string;
  majorOrSection: string;
  minor?: string;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenSelector: () => void;
  onOpenEmptyRooms: () => void;
  onOpenCalendar: () => void;
  onOpenExport: () => void;
  currentTimeStr: string;
  currentDayStr: string;
}

export function Navbar({
  studentName,
  batch,
  majorOrSection,
  minor,
  theme,
  onToggleTheme,
  onOpenSelector,
  onOpenEmptyRooms,
  onOpenCalendar,
  onOpenExport,
  currentTimeStr,
  currentDayStr,
}: NavbarProps) {
  const isBba11 = batch === "BBA-11";
  const minorTag = isBba11 && minor && minor !== "None" ? ` + ${minor.replace("-M", "")}` : "";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/85 dark:bg-slate-950/80 backdrop-blur-xl transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Left: Brand Logo & Name (AIBA Sync) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-center p-1 shrink-0">
            <img
              src="/logo.png"
              alt="AIBA Sylhet"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                AIBA Sync
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30">
                {INSTITUTION_INFO.shortName}
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-mono text-slate-500 dark:text-slate-400 leading-none mt-0.5">
              {currentDayStr} • {currentTimeStr}
            </p>
          </div>
        </div>

        {/* Center/Right: Selection Pill & Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Batch/Section/Minor Chip */}
          <button
            type="button"
            onClick={onOpenSelector}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 hover:bg-white dark:hover:bg-slate-800 transition-all text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-xs active:scale-98"
            title="ব্যাচ অথবা মেজর/মাইনর পরিবর্তন করুন"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ring-2 ring-emerald-500/20" />
            <span className="font-mono text-sky-700 dark:text-sky-300 font-bold">{batch}</span>
            <span className="text-slate-400 dark:text-slate-500">•</span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">{majorOrSection}{minorTag}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-transform group-hover:translate-y-0.5" />
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={theme === "dark" ? "লাইট মোডে স্যুইচ করুন" : "ডার্ক মোডে স্যুইচ করুন"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Empty Rooms Button */}
          <button
            type="button"
            onClick={onOpenEmptyRooms}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-500/50 hover:bg-violet-50 dark:hover:bg-violet-500/10 text-slate-700 dark:text-slate-300 hover:text-violet-700 dark:hover:text-violet-300 transition-all text-xs font-medium cursor-pointer"
            title="ফাঁকা ক্লাসরুম তালিকা"
          >
            <Building2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            <span className="hidden md:inline">ফাঁকা রুম</span>
          </button>

          {/* Academic Calendar Button */}
          <button
            type="button"
            onClick={onOpenCalendar}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500/50 hover:bg-sky-50 dark:hover:bg-sky-500/10 text-slate-700 dark:text-slate-300 hover:text-sky-700 dark:hover:text-sky-300 transition-all text-xs font-medium cursor-pointer"
            title="একাডেমিক ক্যালেন্ডার ও নোটিশ"
          >
            <CalendarDays className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span className="hidden md:inline">ক্যালেন্ডার</span>
          </button>

          {/* Routine Card Export Button */}
          <button
            type="button"
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all text-xs font-medium cursor-pointer"
            title="রুটিন ইমেজ হিসেবে ডাউনলোড করুন"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden lg:inline">এক্সপোর্ট</span>
          </button>
        </div>
      </div>
    </header>
  );
}
