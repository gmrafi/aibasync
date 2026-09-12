"use client";

import { useState } from "react";
import { ACADEMIC_CALENDAR, INSTITUTION_INFO } from "@/data/routine";
import { AcademicEvent } from "@/lib/types";
import { CalendarDays, X } from "lucide-react";

interface AcademicCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AcademicCalendarModal({
  isOpen,
  onClose,
}: AcademicCalendarModalProps) {
  const [filterType, setFilterType] = useState<"ALL" | "holiday" | "exam" | "academic">("ALL");

  if (!isOpen) return null;

  const filtered = ACADEMIC_CALENDAR.filter((item) => {
    if (filterType === "ALL") return true;
    return item.type === filterType;
  });

  const getTypeBadge = (type: AcademicEvent["type"]) => {
    switch (type) {
      case "holiday":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
            ছুটি (Holiday)
          </span>
        );
      case "exam":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            পরীক্ষা (Exam)
          </span>
        );
      case "academic":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            একাডেমিক
          </span>
        );
      case "event":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-violet-500/15 text-violet-300 border border-violet-500/30">
            ইভেন্ট
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl max-h-[85vh] bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950 border border-slate-700/60 rounded-3xl shadow-2xl shadow-cyan-950/40 flex flex-col text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-inner">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                একাডেমিক ক্যালেন্ডার • {INSTITUTION_INFO.term}
              </h3>
              <p className="text-xs text-slate-400">
                {INSTITUTION_INFO.name}, {INSTITUTION_INFO.subTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-3.5 border-b border-slate-800/80 bg-slate-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setFilterType("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
              filterType === "ALL"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            সকল নোটিশ ({ACADEMIC_CALENDAR.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("holiday")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
              filterType === "holiday"
                ? "bg-rose-500 text-white font-bold shadow-md shadow-rose-500/20"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            ছুটির তালিকা
          </button>
          <button
            type="button"
            onClick={() => setFilterType("exam")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
              filterType === "exam"
                ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            পরীক্ষা
          </button>
          <button
            type="button"
            onClick={() => setFilterType("academic")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
              filterType === "academic"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
            }`}
          >
            ক্লাস ও এডমিট কার্ড
          </button>
        </div>

        {/* Calendar Timeline */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filtered.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-slate-800/80 bg-slate-950/40 hover:bg-slate-900/60 transition-colors flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {item.date}
                  </span>
                  {getTypeBadge(item.type)}
                </div>
                <h4 className="text-sm font-semibold text-white tracking-tight">
                  {item.title}
                </h4>
                {item.note && (
                  <p className="text-[11px] font-mono text-slate-400 italic">
                    *{item.note}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
