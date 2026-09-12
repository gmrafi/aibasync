"use client";

import { useMemo, useState } from "react";
import { ClassSlot, DayOfWeek, FacultyMember, UserRole } from "@/lib/types";
import { minutesToTime12, isSlotMatchingView } from "@/lib/time-utils";
import { getFacultyInfo } from "@/data/faculty";
import {
  Clock,
  MapPin,
  User,
  Calendar,
  Coffee,
  Utensils,
  LayoutGrid,
  ListFilter,
} from "lucide-react";

interface WeekViewProps {
  routineData: ClassSlot[];
  batch: string;
  majorOrSection: string;
  minor?: string;
  role?: UserRole;
  teacherCode?: string;
  currentRealDay: DayOfWeek;
  onSelectFaculty: (faculty: FacultyMember) => void;
}

const WEEK_DAYS: { key: DayOfWeek; label: string; short: string }[] = [
  { key: "Sunday", label: "রবিবার", short: "রবি" },
  { key: "Monday", label: "সোমবার", short: "সোম" },
  { key: "Tuesday", label: "মঙ্গলবার", short: "মঙ্গল" },
  { key: "Wednesday", label: "বুধবার", short: "বুধ" },
  { key: "Thursday", label: "বৃহস্পতিবার", short: "বৃহঃ" },
];

// Rich, vibrant subject theme palette with high contrast
function getSubjectTheme(courseTitle: string, majorOrSection?: string) {
  const t = (courseTitle + " " + (majorOrSection || "")).toLowerCase();
  if (t.includes("acc") || t.includes("accounting") || t.includes("cost") || t.includes("audit")) {
    return {
      border: "border-amber-400 dark:border-amber-600/80",
      bg: "bg-amber-50/95 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50",
      text: "text-amber-950 dark:text-amber-50",
      badge: "bg-amber-100 dark:bg-amber-500/25 text-amber-950 dark:text-amber-100 border-amber-400 dark:border-amber-500/40",
      accent: "bg-amber-500",
      chip: "text-amber-900 dark:text-amber-200",
    };
  }
  if (t.includes("fin") || t.includes("finance") || t.includes("bank") || t.includes("monetary")) {
    return {
      border: "border-emerald-400 dark:border-emerald-600/80",
      bg: "bg-emerald-50/95 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50",
      text: "text-emerald-950 dark:text-emerald-50",
      badge: "bg-emerald-100 dark:bg-emerald-500/25 text-emerald-950 dark:text-emerald-100 border-emerald-400 dark:border-emerald-500/40",
      accent: "bg-emerald-500",
      chip: "text-emerald-900 dark:text-emerald-200",
    };
  }
  if (t.includes("mkt") || t.includes("marketing") || t.includes("consumer") || t.includes("brand") || t.includes("promot")) {
    return {
      border: "border-rose-400 dark:border-rose-600/80",
      bg: "bg-rose-50/95 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50",
      text: "text-rose-950 dark:text-rose-50",
      badge: "bg-rose-100 dark:bg-rose-500/25 text-rose-950 dark:text-rose-100 border-rose-400 dark:border-rose-500/40",
      accent: "bg-rose-500",
      chip: "text-rose-900 dark:text-rose-200",
    };
  }
  if (t.includes("mis") || t.includes("tech") || t.includes("computer") || t.includes("system") || t.includes("cse") || t.includes("data")) {
    return {
      border: "border-cyan-400 dark:border-cyan-600/80",
      bg: "bg-cyan-50/95 dark:bg-cyan-950/40 hover:bg-cyan-100 dark:hover:bg-cyan-900/50",
      text: "text-cyan-950 dark:text-cyan-50",
      badge: "bg-cyan-100 dark:bg-cyan-500/25 text-cyan-950 dark:text-cyan-100 border-cyan-400 dark:border-cyan-500/40",
      accent: "bg-cyan-500",
      chip: "text-cyan-900 dark:text-cyan-200",
    };
  }
  if (t.includes("scm") || t.includes("supply") || t.includes("operations") || t.includes("procurement") || t.includes("stat") || t.includes("math")) {
    return {
      border: "border-orange-400 dark:border-orange-600/80",
      bg: "bg-orange-50/95 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/50",
      text: "text-orange-950 dark:text-orange-50",
      badge: "bg-orange-100 dark:bg-orange-500/25 text-orange-950 dark:text-orange-100 border-orange-400 dark:border-orange-500/40",
      accent: "bg-orange-500",
      chip: "text-orange-900 dark:text-orange-200",
    };
  }
  if (t.includes("hrm") || t.includes("management") || t.includes("conflict") || t.includes("organization") || t.includes("behavior")) {
    return {
      border: "border-indigo-400 dark:border-indigo-600/80",
      bg: "bg-indigo-50/95 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50",
      text: "text-indigo-950 dark:text-indigo-50",
      badge: "bg-indigo-100 dark:bg-indigo-500/25 text-indigo-950 dark:text-indigo-100 border-indigo-400 dark:border-indigo-500/40",
      accent: "bg-indigo-500",
      chip: "text-indigo-900 dark:text-indigo-200",
    };
  }
  return {
    border: "border-sky-400 dark:border-sky-600/80",
    bg: "bg-sky-50/95 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50",
    text: "text-sky-950 dark:text-sky-50",
    badge: "bg-sky-100 dark:bg-sky-500/25 text-sky-950 dark:text-sky-100 border-sky-400 dark:border-sky-500/40",
    accent: "bg-sky-500",
    chip: "text-sky-900 dark:text-sky-200",
  };
}

export function WeekView({
  routineData,
  batch,
  majorOrSection,
  minor,
  role = "student",
  teacherCode,
  currentRealDay,
  onSelectFaculty,
}: WeekViewProps) {
  const [layoutMode, setLayoutMode] = useState<"GRID" | "DAY">("GRID");
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | "ALL">("ALL");
  const [teacherFilter, setTeacherFilter] = useState<string>(
    role === "teacher"
      ? batch === "ALL_BATCHES"
        ? "ALL_BATCHES"
        : "MY_CLASSES"
      : batch
  );

  // Available batches for teachers to quick-switch
  const allBatches = useMemo(() => {
    const s = new Set<string>();
    routineData.forEach((r) => s.add(r.batch));
    return Array.from(s).sort();
  }, [routineData]);

  // Active slots according to user selection
  const activeSlots = useMemo(() => {
    const effectiveBatch = role === "teacher" ? teacherFilter : batch;
    return routineData.filter((s) =>
      isSlotMatchingView(s, effectiveBatch, majorOrSection, minor, role, teacherCode)
    );
  }, [routineData, role, teacherFilter, batch, majorOrSection, minor, teacherCode]);

  return (
    <div className="space-y-3.5">
      {/* Top Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400">
              <Calendar className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              {layoutMode === "GRID" ? "সাপ্তাহিক রুটিন ম্যাট্রিক্স" : "সাপ্তাহিক ক্লাস তালিকা"}
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
              মোট {activeSlots.length}টি ক্লাস
            </span>
          </div>
          <p className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
            রবিবার থেকে বৃহস্পতিবার পূর্ণাঙ্গ ক্লাস সূচি • এক নজরে সাপ্তাহিক ৩টি পিরিয়ড
          </p>
        </div>

        {/* View Switcher: Full Week Grid vs Day List */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 self-start sm:self-center shadow-xs">
          <button
            type="button"
            onClick={() => setLayoutMode("GRID")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              layoutMode === "GRID"
                ? "bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>টাইমটেবিল গ্রিড</span>
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode("DAY")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              layoutMode === "DAY"
                ? "bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>দিনভিত্তিক ভিউ</span>
          </button>
        </div>
      </div>

      {/* Teacher Specific Quick Batch Switcher Bar */}
      {role === "teacher" && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-black text-slate-600 dark:text-slate-300 px-2 shrink-0">
            রুটিন ফিল্টার:
          </span>
          <button
            type="button"
            onClick={() => setTeacherFilter("MY_CLASSES")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
              teacherFilter === "MY_CLASSES"
                ? "bg-sky-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            আমার ক্লাস সূচি
          </button>
          <button
            type="button"
            onClick={() => setTeacherFilter("ALL_BATCHES")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
              teacherFilter === "ALL_BATCHES"
                ? "bg-sky-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            মাস্টার রুটিন (সকল ব্যাচ)
          </button>
          {allBatches.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setTeacherFilter(b)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                teacherFilter === b
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 1: COMPACT SINGLE-GLANCE WEEKLY TIMETABLE MATRIX     */}
      {/* DAYS AS ROWS (LEFT), ALL 3 PERIODS VISIBLE/PEEKING       */}
      {/* ========================================================= */}
      {layoutMode === "GRID" && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md overflow-hidden transition-all">
          <div className="overflow-x-auto">
            <div className="min-w-[640px] sm:min-w-[720px]">
              {/* Table Column Headers */}
              <div className="grid grid-cols-[84px_minmax(145px,1fr)_38px_minmax(145px,1fr)_38px_minmax(145px,1fr)] sm:grid-cols-[96px_minmax(170px,1fr)_44px_minmax(170px,1fr)_44px_minmax(170px,1fr)] border-b border-slate-200 dark:border-slate-800 bg-slate-100/95 dark:bg-slate-950">
                {/* Column 1: Day Label (Sticky Left) */}
                <div className="p-2 sm:p-2.5 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center sticky left-0 z-20 bg-slate-100 dark:bg-slate-950 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                  <span className="text-[11px] sm:text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    বার
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    Day
                  </span>
                </div>

                {/* Column 2: Period 1 */}
                <div className="p-2 sm:p-2.5 text-center border-r border-slate-200 dark:border-slate-800">
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    পিরিয়ড ১
                  </div>
                  <div className="text-[11px] font-bold text-sky-700 dark:text-sky-300">
                    09:30 - 11:00 AM
                  </div>
                </div>

                {/* Column 3: Short Break */}
                <div
                  className="p-1 border-r border-amber-200/70 dark:border-amber-800/40 bg-amber-100/50 dark:bg-amber-950/40 flex flex-col items-center justify-center text-center"
                  title="বিরতি • 11:00 AM - 11:30 AM (৩০ মিনিট)"
                >
                  <Coffee className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mb-0.5" />
                  <span className="text-[9px] font-black text-amber-950 dark:text-amber-200 leading-tight">
                    বিরতি
                  </span>
                  <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 leading-none mt-0.5">
                    11:00
                  </span>
                </div>

                {/* Column 4: Period 2 */}
                <div className="p-2 sm:p-2.5 text-center border-r border-slate-200 dark:border-slate-800">
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    পিরিয়ড ২
                  </div>
                  <div className="text-[11px] font-bold text-sky-700 dark:text-sky-300">
                    11:30 AM - 01:00 PM
                  </div>
                </div>

                {/* Column 5: Lunch Break */}
                <div
                  className="p-1 border-r border-sky-200/70 dark:border-sky-800/40 bg-sky-100/50 dark:bg-sky-950/40 flex flex-col items-center justify-center text-center"
                  title="মধ্যাহ্ন বিরতি • 01:00 PM - 01:30 PM (৩০ মিনিট)"
                >
                  <Utensils className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 mb-0.5" />
                  <span className="text-[9px] font-black text-sky-950 dark:text-sky-200 leading-tight">
                    মধ্যাহ্ন
                  </span>
                  <span className="text-[9px] font-bold text-sky-700 dark:text-sky-400 leading-none mt-0.5">
                    01:00
                  </span>
                </div>

                {/* Column 6: Period 3 */}
                <div className="p-2 sm:p-2.5 text-center">
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    পিরিয়ড ৩
                  </div>
                  <div className="text-[11px] font-bold text-sky-700 dark:text-sky-300">
                    01:30 - 03:00 PM
                  </div>
                </div>
              </div>

              {/* TIMETABLE ROWS (Days as Rows: Sunday to Thursday) */}
              {WEEK_DAYS.map((day, dayIdx) => {
                const isToday = currentRealDay === day.key;
                const p1Slots = activeSlots.filter((s) => s.day === day.key && s.period === 1);
                const p2Slots = activeSlots.filter((s) => s.day === day.key && s.period === 2);
                const p3Slots = activeSlots.filter((s) => s.day === day.key && s.period === 3);

                return (
                  <div
                    key={day.key}
                    className={`grid grid-cols-[84px_minmax(145px,1fr)_38px_minmax(145px,1fr)_38px_minmax(145px,1fr)] sm:grid-cols-[96px_minmax(170px,1fr)_44px_minmax(170px,1fr)_44px_minmax(170px,1fr)] border-b last:border-b-0 border-slate-200 dark:border-slate-800 min-h-[115px] sm:min-h-[130px] transition-colors ${
                      isToday ? "bg-sky-50/20 dark:bg-sky-500/5" : ""
                    }`}
                  >
                    {/* Day Header Cell (Sticky Left) */}
                    <div
                      className={`p-2 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center sticky left-0 z-10 transition-colors ${
                        isToday
                          ? "bg-sky-100/95 dark:bg-slate-900 border-r-2 border-r-sky-500 shadow-[2px_0_8px_-2px_rgba(14,165,233,0.3)]"
                          : "bg-slate-50/95 dark:bg-slate-950 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight">
                          {day.label}
                        </span>
                        {isToday && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse shrink-0"
                            title="আজকের দিন"
                          />
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        {day.key.slice(0, 3)}
                      </span>
                      {isToday && (
                        <span className="mt-1 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-sky-600 text-white tracking-tight shadow-2xs">
                          আজ
                        </span>
                      )}
                    </div>

                    {/* Period 1 Cell */}
                    <div className="p-1.5 sm:p-2 border-r border-slate-200 dark:border-slate-800 flex flex-col gap-1.5 justify-center">
                      {p1Slots.length === 0 ? (
                        <div className="h-full min-h-[85px] rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-[11px] font-bold text-slate-400 dark:text-slate-600 bg-slate-50/40 dark:bg-slate-950/20">
                          <span>ফাঁকা</span>
                        </div>
                      ) : (
                        p1Slots.map((s) => (
                          <TimetableSlotCard
                            key={s.id}
                            slot={s}
                            showBatch={role === "teacher"}
                            onSelectFaculty={onSelectFaculty}
                          />
                        ))
                      )}
                    </div>

                    {/* Short Break Column: Centered badge in the exact middle row (Tuesday / dayIdx 2) */}
                    {dayIdx === 2 ? (
                      <div
                        className="p-1 border-r border-amber-200/60 dark:border-amber-800/40 bg-amber-100/70 dark:bg-amber-900/35 flex flex-col items-center justify-center text-center shadow-2xs"
                        title="বিরতি • 11:00 AM - 11:30 AM (৩০ মিনিট)"
                      >
                        <Coffee className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300 mb-1 shrink-0" />
                        <span className="[writing-mode:vertical-lr] text-[9px] font-black text-amber-950 dark:text-amber-100 tracking-wider rotate-180 select-none">
                          বিরতি • 11:00-11:30
                        </span>
                      </div>
                    ) : (
                      <div
                        className="border-r border-amber-200/40 dark:border-amber-800/30 bg-amber-50/20 dark:bg-amber-950/10 flex items-center justify-center"
                        title="বিরতি • 11:00 AM - 11:30 AM"
                      >
                        <div className="w-0.5 h-10 bg-amber-300/60 dark:bg-amber-700/40 rounded-full" />
                      </div>
                    )}

                    {/* Period 2 Cell */}
                    <div className="p-1.5 sm:p-2 border-r border-slate-200 dark:border-slate-800 flex flex-col gap-1.5 justify-center">
                      {p2Slots.length === 0 ? (
                        <div className="h-full min-h-[85px] rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-[11px] font-bold text-slate-400 dark:text-slate-600 bg-slate-50/40 dark:bg-slate-950/20">
                          <span>ফাঁকা</span>
                        </div>
                      ) : (
                        p2Slots.map((s) => (
                          <TimetableSlotCard
                            key={s.id}
                            slot={s}
                            showBatch={role === "teacher"}
                            onSelectFaculty={onSelectFaculty}
                          />
                        ))
                      )}
                    </div>

                    {/* Lunch Break Column: Centered badge in the exact middle row (Tuesday / dayIdx 2) */}
                    {dayIdx === 2 ? (
                      <div
                        className="p-1 border-r border-sky-200/60 dark:border-sky-800/40 bg-sky-100/70 dark:bg-sky-900/35 flex flex-col items-center justify-center text-center shadow-2xs"
                        title="মধ্যাহ্ন বিরতি • 01:00 PM - 01:30 PM (৩০ মিনিট)"
                      >
                        <Utensils className="w-3.5 h-3.5 text-sky-700 dark:text-sky-300 mb-1 shrink-0" />
                        <span className="[writing-mode:vertical-lr] text-[9px] font-black text-sky-950 dark:text-sky-100 tracking-wider rotate-180 select-none">
                          মধ্যাহ্ন বিরতি • 01:00-01:30
                        </span>
                      </div>
                    ) : (
                      <div
                        className="border-r border-sky-200/40 dark:border-sky-800/30 bg-sky-50/20 dark:bg-sky-950/10 flex items-center justify-center"
                        title="মধ্যাহ্ন বিরতি • 01:00 PM - 01:30 PM"
                      >
                        <div className="w-0.5 h-10 bg-sky-300/60 dark:bg-sky-700/40 rounded-full" />
                      </div>
                    )}

                    {/* Period 3 Cell */}
                    <div className="p-1.5 sm:p-2 flex flex-col gap-1.5 justify-center">
                      {p3Slots.length === 0 ? (
                        <div className="h-full min-h-[85px] rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-[11px] font-bold text-slate-400 dark:text-slate-600 bg-slate-50/40 dark:bg-slate-950/20">
                          <span>ফাঁকা</span>
                        </div>
                      ) : (
                        p3Slots.map((s) => (
                          <TimetableSlotCard
                            key={s.id}
                            slot={s}
                            showBatch={role === "teacher"}
                            onSelectFaculty={onSelectFaculty}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Color Coding Legend */}
          <div className="p-3 sm:p-3.5 bg-slate-50/90 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-3.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="text-slate-900 dark:text-white font-black">বিষয়ভিত্তিক কালার কোড:</span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>ফিন্যান্স (Finance)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>অ্যাকাউন্টিং (Accounting)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span>ম্যানেজমেন্ট / HRM</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>মার্কেটিং (Marketing)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span>এমআইএস / টেকনোলজি</span>
            </span>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 2: DAY-BY-DAY CARD VIEW                             */}
      {/* ========================================================= */}
      {layoutMode === "DAY" && (
        <div className="space-y-4">
          {/* Day Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedDay("ALL")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                selectedDay === "ALL"
                  ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              সব দিন
            </button>

            {WEEK_DAYS.map((day) => {
              const isSelected = selectedDay === day.key;
              const isToday = currentRealDay === day.key;
              return (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => setSelectedDay(day.key)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                      : isToday
                      ? "bg-white dark:bg-slate-900 border-2 border-sky-500 text-sky-700 dark:text-sky-300 font-black"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <span>{day.short}</span>
                  {isToday && <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />}
                </button>
              );
            })}
          </div>

          {/* List of day sections */}
          <div className="space-y-4">
            {(selectedDay === "ALL" ? WEEK_DAYS : WEEK_DAYS.filter((d) => d.key === selectedDay)).map((day) => {
              const daySlots = activeSlots
                .filter((s) => s.day === day.key)
                .sort((a, b) => a.period - b.period);
              const isToday = currentRealDay === day.key;

              return (
                <div
                  key={day.key}
                  className={`rounded-3xl border p-4 sm:p-5 transition-all ${
                    isToday
                      ? "bg-white dark:bg-slate-900 border-2 border-sky-400 dark:border-sky-500 shadow-md"
                      : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <h3 className="text-base font-black text-slate-900 dark:text-white">{day.label}</h3>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        ({day.key})
                      </span>
                    </div>
                    {isToday && (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30">
                        আজকের কার্যসূচি
                      </span>
                    )}
                  </div>

                  {daySlots.length === 0 ? (
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 py-4 text-center bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
                      এই দিনে কোনো ক্লাস নির্ধারিত নেই
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {daySlots.map((slot) => {
                        const theme = getSubjectTheme(slot.courseTitle, slot.majorOrSection);
                        const faculty = getFacultyInfo(slot.instructor);
                        return (
                          <div
                            key={slot.id}
                            className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex flex-col justify-between shadow-xs ${theme.bg} ${theme.border}`}
                          >
                            <div>
                              <div className="flex items-center justify-between text-xs font-black mb-1.5">
                                <span className={`px-2 py-0.5 rounded-lg border font-black text-xs ${theme.badge}`}>
                                  পিরিয়ড {slot.period}
                                </span>
                                <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold text-xs">
                                  <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                                  {minutesToTime12(slot.startTime)} - {minutesToTime12(slot.endTime)}
                                </span>
                              </div>

                              <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug my-1.5">
                                {slot.courseTitle}
                              </h4>

                              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                {role === "teacher" && (
                                  <span className="px-2 py-0.5 rounded-md text-xs font-black bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900">
                                    {slot.batch} {slot.majorOrSection}
                                  </span>
                                )}
                                {slot.majorOrSection && slot.majorOrSection !== "Common" && role !== "teacher" && (
                                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${theme.badge}`}>
                                    {slot.majorOrSection}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-300/60 dark:border-slate-800 text-xs">
                              <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black border border-slate-200 dark:border-slate-800 shadow-2xs">
                                <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                                রুম {slot.room}
                              </span>

                              <button
                                type="button"
                                onClick={() => onSelectFaculty(faculty)}
                                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black border border-slate-200 dark:border-slate-800 hover:border-violet-400 transition-colors cursor-pointer"
                                title="শিক্ষকের প্রোফাইল দেখুন"
                              >
                                <User className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                                <span>{slot.instructor}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Compact, high-aesthetic, high-contrast class card for the weekly grid cell
function TimetableSlotCard({
  slot,
  showBatch,
  onSelectFaculty,
}: {
  slot: ClassSlot;
  showBatch: boolean;
  onSelectFaculty: (faculty: FacultyMember) => void;
}) {
  const theme = getSubjectTheme(slot.courseTitle, slot.majorOrSection);
  const faculty = getFacultyInfo(slot.instructor);

  return (
    <div
      className={`p-2 sm:p-2.5 rounded-xl border-2 transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between group ${theme.bg} ${theme.border}`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className={`px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-black border ${theme.badge}`}>
            {showBatch ? `${slot.batch}` : slot.majorOrSection || "Class"}
          </span>
          <span className="flex items-center gap-0.5 text-[10px] sm:text-[11px] font-black text-slate-900 dark:text-slate-100 bg-white/90 dark:bg-slate-900/90 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 shadow-2xs shrink-0">
            <MapPin className="w-3 h-3 text-sky-600 dark:text-sky-400 shrink-0" />
            <span>{slot.room}</span>
          </span>
        </div>

        {/* Course Title: BOLD, CLEAR, HIGH CONTRAST */}
        <h5 className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white leading-snug line-clamp-2 my-0.5 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
          {slot.courseTitle}
        </h5>
      </div>

      {/* Footer: Instructor & Batch */}
      <div className="flex items-center justify-between gap-1 pt-1.5 mt-1 border-t border-slate-300/50 dark:border-slate-800">
        <button
          type="button"
          onClick={() => onSelectFaculty(faculty)}
          className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-black text-violet-700 dark:text-violet-300 hover:text-violet-900 dark:hover:text-violet-100 hover:underline cursor-pointer truncate"
          title={`${faculty.fullName} (${faculty.designation})`}
        >
          <User className="w-3 h-3 text-violet-600 dark:text-violet-400 shrink-0" />
          <span className="truncate max-w-[95px] sm:max-w-[125px]">{slot.instructor}</span>
        </button>

        {showBatch && slot.majorOrSection && (
          <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded-md bg-slate-200/70 dark:bg-slate-800 truncate">
            {slot.majorOrSection}
          </span>
        )}
      </div>
    </div>
  );
}
