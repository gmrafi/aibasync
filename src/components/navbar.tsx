"use client";

import { Building2, CalendarDays, ChevronDown, Download, Moon, Sun } from "lucide-react";
import { INSTITUTION_INFO } from "@/data/routine";

interface NavbarProps {
  role?: "student" | "teacher";
  teacherCode?: string;
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
  role = "student",
  teacherCode,
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
    <header className="sticky top-0 z-40 w-full border-b border-emerald-200/80 dark:border-emerald-900/80 bg-white/90 dark:bg-slate-950/85 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-xl transition-colors">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Brand Logo & Name (AIBA Sync) */}
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
          <div className="relative flex items-center justify-center shrink-0">
            <img
              src="/logo.png"
              alt="AIBA Sylhet Crest"
              className="w-11 h-11 sm:w-12 sm:h-12 object-contain transition-transform hover:scale-105"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-base sm:text-lg tracking-[-0.02em] text-slate-900 dark:text-white">
                AIBA Sync
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5 tracking-wide">
              {currentDayStr} • {currentTimeStr}
            </p>
            <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
              {INSTITUTION_INFO.shortName}
            </p>
          </div>
        </div>

        {/* Center/Right: Selection Pill & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
          {/* Quick Batch/Section/Minor Chip */}
          <button
            type="button"
            onClick={onOpenSelector}
            className="group inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50/80 dark:bg-slate-900/95 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:bg-white dark:hover:bg-slate-800 transition-all text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-sm active:scale-[0.99]"
            title={role === "teacher" ? "ফ্যাকাল্টি প্রোফাইল বা ব্যাচ পরিবর্তন করুন" : "ব্যাচ অথবা মেজর/মাইনর পরিবর্তন করুন"}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-2 ring-emerald-500/20" />
            {role === "teacher" ? (
              <>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">শিক্ষক</span>
                {teacherCode && (
                  <>
                    <span className="text-slate-400 dark:text-slate-500">•</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{teacherCode}</span>
                  </>
                )}
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <span className="text-slate-600 dark:text-slate-400">
                  {batch === "MY_CLASSES" ? "আমার ক্লাস" : batch === "ALL_BATCHES" ? "মাস্টার রুটিন" : batch}
                </span>
              </>
            ) : (
              <>
                <span className="text-emerald-700 dark:text-emerald-300 font-bold">{batch}</span>
                <span className="text-slate-400 dark:text-slate-500">•</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium">{majorOrSection}{minorTag}</span>
              </>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-transform group-hover:translate-y-0.5" />
          </button>

          {/* Theme Toggle (Light / Dark) */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-emerald-50 dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/10 transition-colors cursor-pointer shadow-sm shrink-0"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-slate-900 border border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-500/50 hover:bg-blue-100 dark:hover:bg-blue-500/10 text-slate-800 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 transition-all text-[11px] sm:text-xs font-semibold cursor-pointer shadow-sm"
            title="ফাঁকা ক্লাসরুম তালিকা"
          >
            <Building2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-300" />
            <span className="hidden md:inline">ফাঁকা রুম</span>
          </button>

          {/* Academic Calendar Button */}
          <button
            type="button"
            onClick={onOpenCalendar}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/60 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all text-[11px] sm:text-xs font-semibold cursor-pointer shadow-sm"
            title="একাডেমিক ক্যালেন্ডার ও নোটিশ"
          >
            <CalendarDays className="w-3.5 h-3.5 text-blue-600 dark:text-blue-300" />
            <span className="hidden md:inline">ক্যালেন্ডার</span>
          </button>

          {/* Routine Card Export Button */}
          <button
            type="button"
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white border border-emerald-600 hover:bg-emerald-700 shadow-[0_8px_20px_rgba(16,185,129,0.18)] transition-all text-[11px] sm:text-xs font-bold cursor-pointer"
            title="রুটিন ইমেজ হিসেবে ডাউনলোড করুন"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">এক্সপোর্ট</span>
          </button>
        </div>
      </div>
    </header>
  );
}
