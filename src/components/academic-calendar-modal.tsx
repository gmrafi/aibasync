"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ACADEMIC_CALENDAR, INSTITUTION_INFO } from "@/data/routine";
import { AcademicEvent } from "@/lib/types";
import { CalendarDays, X } from "lucide-react";

interface AcademicCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function parseEventStartDate(dateString: string): Date | null {
  const raw = dateString.split("–")[0]?.trim() || dateString.trim();
  const match = raw.match(/(\d{1,2})\s+([A-Za-z]+)(?:\s+(\d{4}))?/);

  if (!match) return null;

  const day = Number(match[1]);
  const monthName = match[2];
  const year = match[3] ? Number(match[3]) : new Date().getFullYear();
  const month = new Date(`${monthName} 1, ${year}`).getMonth();

  return new Date(year, month, day);
}

export function AcademicCalendarModal({
  isOpen,
  onClose,
}: AcademicCalendarModalProps) {
  const [filterType, setFilterType] = useState<"ALL" | "holiday" | "exam" | "academic">("ALL");
  const itemRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const orderedItems = useMemo(() => {
    return [...ACADEMIC_CALENDAR].sort((a, b) => {
      const aDate = parseEventStartDate(a.date);
      const bDate = parseEventStartDate(b.date);
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return aDate.getTime() - bDate.getTime();
    });
  }, []);

  const filtered = useMemo(() => {
    return orderedItems.filter((item) => {
      if (filterType === "ALL") return true;
      return item.type === filterType;
    });
  }, [filterType, orderedItems]);

  useEffect(() => {
    if (!isOpen || filtered.length === 0) return;

    const now = new Date();
    let targetIndex = filtered.findIndex((item) => {
      const startDate = parseEventStartDate(item.date);
      return startDate && startDate.getTime() >= now.getTime();
    });

    if (targetIndex === -1) {
      targetIndex = filtered.length - 1;
    }

    const frame = window.requestAnimationFrame(() => {
      itemRefs.current[targetIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [isOpen, filtered]);

  if (!isOpen) return null;

  const getTypeBadge = (type: AcademicEvent["type"]) => {
    switch (type) {
      case "holiday":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">
            ছুটি (Holiday)
          </span>
        );
      case "exam":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
            পরীক্ষা (Exam)
          </span>
        );
      case "academic":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30">
            একাডেমিক
          </span>
        );
      case "event":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-50 dark:bg-violet-500/15 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30">
            ইভেন্ট
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col text-slate-900 dark:text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-500/15 border border-sky-200 dark:border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-sm">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                একাডেমিক ক্যালেন্ডার • {INSTITUTION_INFO.term}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {INSTITUTION_INFO.name}, {INSTITUTION_INFO.subTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setFilterType("ALL")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              filterType === "ALL"
                ? "bg-sky-600 text-white font-bold shadow-sm"
                : "bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            সকল বিজ্ঞপ্তি ({ACADEMIC_CALENDAR.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterType("holiday")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              filterType === "holiday"
                ? "bg-rose-600 text-white font-bold shadow-sm"
                : "bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            ছুটির তালিকা
          </button>
          <button
            type="button"
            onClick={() => setFilterType("exam")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              filterType === "exam"
                ? "bg-amber-600 text-white font-bold shadow-sm"
                : "bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            পরীক্ষা
          </button>
          <button
            type="button"
            onClick={() => setFilterType("academic")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              filterType === "academic"
                ? "bg-sky-600 text-white font-bold shadow-sm"
                : "bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            ক্লাস ও এডমিট কার্ড
          </button>
        </div>

        {/* Calendar Timeline */}
        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {filtered.map((item, idx) => (
            <div
              key={`${item.date}-${item.title}-${idx}`}
              ref={(node) => {
                itemRefs.current[idx] = node;
              }}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-slate-100/60 dark:hover:bg-slate-900/60 transition-colors flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                    {item.date}
                  </span>
                  {getTypeBadge(item.type)}
                </div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white tracking-tight">
                  {item.title}
                </h4>
                {item.note && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
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
