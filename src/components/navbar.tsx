"use client";

import { Building2, CalendarDays, ChevronDown, Download, Radar, User } from "lucide-react";
import { INSTITUTION_INFO } from "@/data/routine";

interface NavbarProps {
  studentName?: string;
  batch: string;
  majorOrSection: string;
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
  onOpenSelector,
  onOpenEmptyRooms,
  onOpenCalendar,
  onOpenExport,
  currentTimeStr,
  currentDayStr,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-2xl transition-all">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Left: Brand Name (AIBA Radar) */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
            <Radar className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                AIBA Radar
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Phase 1
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400 leading-none">
              {currentDayStr} • {currentTimeStr}
            </p>
          </div>
        </div>

        {/* Center/Right: Selection Pill & Quick Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Batch/Section Chip */}
          <button
            type="button"
            onClick={onOpenSelector}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-400 hover:bg-slate-850 transition-all text-xs font-semibold text-slate-200 cursor-pointer shadow-sm shadow-slate-950/50"
            title="ব্যাচ বা নাম পরিবর্তন করুন"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-cyan-300 font-bold">{batch}</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-200">{majorOrSection}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 transition-colors" />
          </button>

          {/* Empty Rooms Button */}
          <button
            type="button"
            onClick={onOpenEmptyRooms}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-violet-400/50 hover:bg-violet-500/10 text-slate-300 hover:text-violet-300 transition-all text-xs font-medium cursor-pointer"
            title="ফাঁকা রুম ডিটেক্টর"
          >
            <Building2 className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden md:inline">ফাঁকা রুম</span>
          </button>

          {/* Academic Calendar Button */}
          <button
            type="button"
            onClick={onOpenCalendar}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-slate-300 hover:text-cyan-300 transition-all text-xs font-medium cursor-pointer"
            title="একাডেমিক ক্যালেন্ডার ও ছুটির তালিকা"
          >
            <CalendarDays className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">ক্যালেন্ডার</span>
          </button>

          {/* Routine Card Export Button */}
          <button
            type="button"
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-400/50 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-300 transition-all text-xs font-medium cursor-pointer"
            title="রুটিন ইমেজ হিসেবে ডাউনলোড করুন"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">এক্সপোর্ট</span>
          </button>
        </div>
      </div>
    </header>
  );
}
