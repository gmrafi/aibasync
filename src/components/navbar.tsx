"use client";

import { Building2, CalendarDays, ChevronDown, Download, Sparkles } from "lucide-react";
import { INSTITUTION_INFO } from "@/data/routine";

interface NavbarProps {
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
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        {/* Left: Brand / Terminal Tag */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center font-mono font-black text-xs text-black shadow-md shadow-cyan-500/20">
            C_
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-sm tracking-wider text-white">
                CLASSR
              </span>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {INSTITUTION_INFO.shortName}
              </span>
            </div>
            <p className="text-[10px] font-mono text-zinc-400 leading-none">
              {currentDayStr} • {currentTimeStr}
            </p>
          </div>
        </div>

        {/* Center/Right: Batch Selector Pill */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSelector}
            className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-800/80 transition-all text-xs font-semibold text-zinc-200 cursor-pointer shadow-sm"
            title="ব্যাচ অথবা সেকশন পরিবর্তন করুন"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-cyan-300 font-bold">{batch}</span>
            <span className="text-zinc-400">•</span>
            <span className="text-zinc-300">{majorOrSection}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 transition-colors" />
          </button>

          {/* Quick Action: Empty Rooms */}
          <button
            type="button"
            onClick={onOpenEmptyRooms}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-violet-500/50 hover:bg-violet-500/10 text-zinc-300 hover:text-violet-300 transition-all text-xs font-medium cursor-pointer"
            title="ফাঁকা রুম ডিটেক্টর"
          >
            <Building2 className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden md:inline">ফাঁকা রুম</span>
          </button>

          {/* Quick Action: Academic Calendar */}
          <button
            type="button"
            onClick={onOpenCalendar}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-cyan-500/50 hover:bg-cyan-500/10 text-zinc-300 hover:text-cyan-300 transition-all text-xs font-medium cursor-pointer"
            title="একাডেমিক ক্যালেন্ডার ও ছুটির তালিকা"
          >
            <CalendarDays className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">ক্যালেন্ডার</span>
          </button>

          {/* Quick Action: Export Image */}
          <button
            type="button"
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-zinc-300 hover:text-emerald-300 transition-all text-xs font-medium cursor-pointer"
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
