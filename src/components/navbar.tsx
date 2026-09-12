"use client";

import { CalendarDays, ChevronDown, Download, GraduationCap, Moon, Sun } from "lucide-react";
import { INSTITUTION_INFO } from "@/data/routine";
import { getFacultyInfo } from "@/data/faculty";

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
  onOpenFacultyDirectory: () => void;
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
  onOpenFacultyDirectory,
  onOpenCalendar,
  onOpenExport,
  currentTimeStr,
  currentDayStr,
}: NavbarProps) {
  const isBba11 = batch === "BBA-11";
  const minorTag = isBba11 && minor && minor !== "None" ? ` + ${minor.replace("-M", "")}` : "";
  const teacherDisplayName = role === "teacher" && teacherCode ? getFacultyInfo(teacherCode).fullName : "";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-emerald-200/80 dark:border-emerald-900/80 bg-gradient-to-r from-white via-emerald-50/60 to-sky-50/70 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900/90 shadow-[0_1px_0_rgba(15,23,42,0.04)] backdrop-blur-xl transition-colors">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
          <div className="relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-sky-50 dark:from-emerald-500/10 dark:via-slate-900 dark:to-sky-500/10 border border-emerald-200 dark:border-emerald-800 p-1.5 shadow-sm shadow-emerald-500/10">
            <img
              src="/logo.png"
              alt="AIBA Sylhet Crest"
              className="w-10 h-10 sm:w-11 sm:h-11 object-contain transition-transform hover:scale-105"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-black text-base sm:text-lg tracking-[-0.03em] text-slate-900 dark:text-white">
                AIBA Sync
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5 tracking-[0.08em] uppercase">
              {currentDayStr} • {currentTimeStr}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap justify-end">
          {/* Quick Batch/Section/Minor Chip */}
          <button
            type="button"
            onClick={onOpenSelector}
            className="group inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50/80 dark:bg-slate-900/95 border border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-500/50 hover:bg-white dark:hover:bg-slate-800 transition-all text-[10px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer shadow-sm active:scale-[0.99]"
            title={role === "teacher" ? "ফ্যাকাল্টি প্রোফাইল বা ব্যাচ নির্বাচন করুন" : "ব্যাচ / মেজর / মাইনর নির্বাচন করুন"}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse ring-2 ring-emerald-500/20" />
            {role === "teacher" ? (
              <>
                {teacherDisplayName ? (
                  <>
                    <span className="font-bold text-emerald-700 dark:text-emerald-300">{teacherDisplayName}</span>
                    <span className="text-slate-400 dark:text-slate-500">•</span>
                  </>
                ) : (
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">শিক্ষক</span>
                )}
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
            onClick={onOpenFacultyDirectory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-slate-900 border border-sky-200 dark:border-sky-800 hover:border-sky-400 dark:hover:border-sky-500/50 hover:bg-sky-100 dark:hover:bg-sky-500/10 text-slate-800 dark:text-slate-200 hover:text-sky-700 dark:hover:text-sky-300 transition-all text-[11px] sm:text-xs font-semibold cursor-pointer shadow-sm"
            title="ফ্যাকাল্টি ডিরেক্টরি"
          >
            <GraduationCap className="w-3.5 h-3.5 text-sky-600 dark:text-sky-300" />
            <span className="hidden md:inline">ফ্যাকাল্টি</span>
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
