"use client";

import { useMemo, useState } from "react";
import { ClassSlot, DayOfWeek, FacultyMember, UserRole } from "@/lib/types";
import { minutesToTime12, isSlotMatchingView, isSlotMinor } from "@/lib/time-utils";
import { getFacultyInfo } from "@/data/faculty";
import {
  Clock,
  MapPin,
  User,
  Calendar,
  Coffee,
  Sparkles,
  LayoutGrid,
  ListFilter,
  Check,
  Building2,
  BookOpen,
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

const PERIOD_DEFS = [
  { period: 1, name: "পিরিয়ড ১", time: "09:30 AM - 11:00 AM" },
  { period: 2, name: "পিরিয়ড ২", time: "11:30 AM - 01:00 PM" },
  { period: 3, name: "পিরিয়ড ৩", time: "01:30 PM - 03:00 PM" },
];

// Rich, vibrant subject theme palette
function getSubjectTheme(courseTitle: string, majorOrSection?: string) {
  const t = (courseTitle + " " + (majorOrSection || "")).toLowerCase();
  if (t.includes("acc") || t.includes("accounting") || t.includes("cost") || t.includes("audit")) {
    return {
      border: "border-amber-400/60 dark:border-amber-500/50",
      bg: "bg-amber-50/90 dark:bg-amber-950/40 hover:bg-amber-100/90 dark:hover:bg-amber-900/50",
      text: "text-amber-950 dark:text-amber-100",
      badge: "bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-500/30",
      accent: "bg-amber-500",
      chip: "text-amber-800 dark:text-amber-300",
    };
  }
  if (t.includes("fin") || t.includes("finance") || t.includes("bank") || t.includes("monetary")) {
    return {
      border: "border-emerald-400/60 dark:border-emerald-500/50",
      bg: "bg-emerald-50/90 dark:bg-emerald-950/40 hover:bg-emerald-100/90 dark:hover:bg-emerald-900/50",
      text: "text-emerald-950 dark:text-emerald-100",
      badge: "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 border-emerald-300 dark:border-emerald-500/30",
      accent: "bg-emerald-500",
      chip: "text-emerald-800 dark:text-emerald-300",
    };
  }
  if (t.includes("mkt") || t.includes("marketing") || t.includes("consumer") || t.includes("brand") || t.includes("promot")) {
    return {
      border: "border-rose-400/60 dark:border-rose-500/50",
      bg: "bg-rose-50/90 dark:bg-rose-950/40 hover:bg-rose-100/90 dark:hover:bg-rose-900/50",
      text: "text-rose-950 dark:text-rose-100",
      badge: "bg-rose-100 dark:bg-rose-500/20 text-rose-900 dark:text-rose-200 border-rose-300 dark:border-rose-500/30",
      accent: "bg-rose-500",
      chip: "text-rose-800 dark:text-rose-300",
    };
  }
  if (t.includes("mis") || t.includes("tech") || t.includes("computer") || t.includes("system") || t.includes("cse") || t.includes("data")) {
    return {
      border: "border-cyan-400/60 dark:border-cyan-500/50",
      bg: "bg-cyan-50/90 dark:bg-cyan-950/40 hover:bg-cyan-100/90 dark:hover:bg-cyan-900/50",
      text: "text-cyan-950 dark:text-cyan-100",
      badge: "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-900 dark:text-cyan-200 border-cyan-300 dark:border-cyan-500/30",
      accent: "bg-cyan-500",
      chip: "text-cyan-800 dark:text-cyan-300",
    };
  }
  if (t.includes("scm") || t.includes("supply") || t.includes("operations") || t.includes("procurement") || t.includes("stat") || t.includes("math")) {
    return {
      border: "border-orange-400/60 dark:border-orange-500/50",
      bg: "bg-orange-50/90 dark:bg-orange-950/40 hover:bg-orange-100/90 dark:hover:bg-orange-900/50",
      text: "text-orange-950 dark:text-orange-100",
      badge: "bg-orange-100 dark:bg-orange-500/20 text-orange-900 dark:text-orange-200 border-orange-300 dark:border-orange-500/30",
      accent: "bg-orange-500",
      chip: "text-orange-800 dark:text-orange-300",
    };
  }
  if (t.includes("hrm") || t.includes("management") || t.includes("conflict") || t.includes("organization") || t.includes("behavior")) {
    return {
      border: "border-indigo-400/60 dark:border-indigo-500/50",
      bg: "bg-indigo-50/90 dark:bg-indigo-950/40 hover:bg-indigo-100/90 dark:hover:bg-indigo-900/50",
      text: "text-indigo-950 dark:text-indigo-100",
      badge: "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-900 dark:text-indigo-200 border-indigo-300 dark:border-indigo-500/30",
      accent: "bg-indigo-500",
      chip: "text-indigo-800 dark:text-indigo-300",
    };
  }
  return {
    border: "border-sky-400/60 dark:border-sky-500/50",
    bg: "bg-sky-50/90 dark:bg-sky-950/40 hover:bg-sky-100/90 dark:hover:bg-sky-900/50",
    text: "text-sky-950 dark:text-sky-100",
    badge: "bg-sky-100 dark:bg-sky-500/20 text-sky-900 dark:text-sky-200 border-sky-300 dark:border-sky-500/30",
    accent: "bg-sky-500",
    chip: "text-sky-800 dark:text-sky-300",
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
    role === "teacher" ? batch || "MY_CLASSES" : batch
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
    <div className="space-y-4">
      {/* Top Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400">
              <Calendar className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {layoutMode === "GRID" ? "সাপ্তাহিক রুটিন ম্যাট্রিক্স" : "সাপ্তাহিক ক্লাস তালিকা"}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
              মোট {activeSlots.length}টি ক্লাস
            </span>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
            রবিবার থেকে বৃহস্পতিবার পর্যন্ত পূর্ণাঙ্গ ক্লাস শিডিউল • এক নজরে সাপ্তাহিক ক্যালেন্ডার
          </p>
        </div>

        {/* View Switcher: Full Week Grid vs Day List */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 self-start sm:self-center shadow-xs">
          <button
            type="button"
            onClick={() => setLayoutMode("GRID")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 px-2 shrink-0">
            রুটিন ফিল্টার:
          </span>
          <button
            type="button"
            onClick={() => setTeacherFilter("MY_CLASSES")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              teacherFilter === "MY_CLASSES"
                ? "bg-sky-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            আমার ক্লাস সূচি
          </button>
          <button
            type="button"
            onClick={() => setTeacherFilter("ALL_BATCHES")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              teacherFilter === "ALL_BATCHES"
                ? "bg-sky-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            মাস্টার রুটিন (সকল ব্যাচ)
          </button>
          {allBatches.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setTeacherFilter(b)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                teacherFilter === b
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 1: SINGLE-GLANCE WEEKLY TIMETABLE MATRIX (GRID)     */}
      {/* ========================================================= */}
      {layoutMode === "GRID" && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg overflow-hidden transition-all">
          <div className="overflow-x-auto">
            <div className="min-w-[840px]">
              {/* Day Header Columns */}
              <div className="grid grid-cols-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950/80">
                {/* Top-Left Axis Label */}
                <div className="p-3 sm:p-4 border-r border-slate-200 dark:border-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-400">
                  <span>সময় ও পিরিয়ড</span>
                </div>

                {/* 5 Day Column Headers */}
                {WEEK_DAYS.map((day) => {
                  const isToday = currentRealDay === day.key;
                  return (
                    <div
                      key={day.key}
                      className={`p-3 sm:p-3.5 text-center border-r last:border-r-0 border-slate-200 dark:border-slate-800 transition-colors ${
                        isToday
                          ? "bg-sky-100/60 dark:bg-sky-500/15 border-b-2 border-b-sky-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {day.label}
                        </span>
                        {isToday && (
                          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" title="আজকের দিন" />
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                        {day.key}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* TIMETABLE ROWS */}
              {/* Period 1 */}
              <div className="grid grid-cols-6 border-b border-slate-100 dark:border-slate-800/80 min-h-[140px]">
                <div className="p-3 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col justify-center text-center">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">পিরিয়ড ১</span>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    09:30 AM - 11:00 AM
                  </span>
                </div>
                {WEEK_DAYS.map((day) => {
                  const slots = activeSlots.filter((s) => s.day === day.key && s.period === 1);
                  const isToday = currentRealDay === day.key;
                  return (
                    <div
                      key={`p1-${day.key}`}
                      className={`p-2 border-r last:border-r-0 border-slate-100 dark:border-slate-800/80 flex flex-col gap-2 ${
                        isToday ? "bg-sky-50/20 dark:bg-sky-500/5" : ""
                      }`}
                    >
                      {slots.length === 0 ? (
                        <div className="h-full min-h-[110px] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-[11px] font-medium text-slate-400 dark:text-slate-600 bg-slate-50/30 dark:bg-slate-950/20">
                          ফাঁকা
                        </div>
                      ) : (
                        slots.map((s) => (
                          <TimetableSlotCard
                            key={s.id}
                            slot={s}
                            showBatch={role === "teacher"}
                            onSelectFaculty={onSelectFaculty}
                          />
                        ))
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Short Break Ribbon */}
              <div className="py-2 px-4 bg-amber-50/70 dark:bg-amber-950/20 border-b border-slate-200 dark:border-slate-800 text-center flex items-center justify-center gap-2 text-xs font-semibold text-amber-900 dark:text-amber-300">
                <Coffee className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>বিরতি • 11:00 AM - 11:30 AM (৩০ মিনিট)</span>
              </div>

              {/* Period 2 */}
              <div className="grid grid-cols-6 border-b border-slate-100 dark:border-slate-800/80 min-h-[140px]">
                <div className="p-3 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col justify-center text-center">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">পিরিয়ড ২</span>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    11:30 AM - 01:00 PM
                  </span>
                </div>
                {WEEK_DAYS.map((day) => {
                  const slots = activeSlots.filter((s) => s.day === day.key && s.period === 2);
                  const isToday = currentRealDay === day.key;
                  return (
                    <div
                      key={`p2-${day.key}`}
                      className={`p-2 border-r last:border-r-0 border-slate-100 dark:border-slate-800/80 flex flex-col gap-2 ${
                        isToday ? "bg-sky-50/20 dark:bg-sky-500/5" : ""
                      }`}
                    >
                      {slots.length === 0 ? (
                        <div className="h-full min-h-[110px] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-[11px] font-medium text-slate-400 dark:text-slate-600 bg-slate-50/30 dark:bg-slate-950/20">
                          ফাঁকা
                        </div>
                      ) : (
                        slots.map((s) => (
                          <TimetableSlotCard
                            key={s.id}
                            slot={s}
                            showBatch={role === "teacher"}
                            onSelectFaculty={onSelectFaculty}
                          />
                        ))
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Lunch & Prayer Break Banner */}
              <div className="py-2.5 px-4 bg-slate-100/80 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-center flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Coffee className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>লাঞ্চ ও নামাজের বিরতি • 01:00 PM - 01:30 PM (৩০ মিনিট)</span>
              </div>

              {/* Period 3 */}
              <div className="grid grid-cols-6 min-h-[140px]">
                <div className="p-3 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 flex flex-col justify-center text-center">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">পিরিয়ড ৩</span>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                    01:30 PM - 03:00 PM
                  </span>
                </div>
                {WEEK_DAYS.map((day) => {
                  const slots = activeSlots.filter((s) => s.day === day.key && s.period === 3);
                  const isToday = currentRealDay === day.key;
                  return (
                    <div
                      key={`p3-${day.key}`}
                      className={`p-2 border-r last:border-r-0 border-slate-100 dark:border-slate-800/80 flex flex-col gap-2 ${
                        isToday ? "bg-sky-50/20 dark:bg-sky-500/5" : ""
                      }`}
                    >
                      {slots.length === 0 ? (
                        <div className="h-full min-h-[110px] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-[11px] font-medium text-slate-400 dark:text-slate-600 bg-slate-50/30 dark:bg-slate-950/20">
                          ফাঁকা
                        </div>
                      ) : (
                        slots.map((s) => (
                          <TimetableSlotCard
                            key={s.id}
                            slot={s}
                            showBatch={role === "teacher"}
                            onSelectFaculty={onSelectFaculty}
                          />
                        ))
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Color Coding Legend */}
          <div className="p-3.5 sm:p-4 bg-slate-50/80 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span className="text-slate-800 dark:text-slate-200 font-bold">বিষয়ভিত্তিক কালার কোড:</span>
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
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 cursor-pointer ${
                selectedDay === "ALL"
                  ? "bg-sky-600 text-white font-bold shadow-md shadow-sky-600/20"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
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
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-sky-600 text-white font-bold shadow-md shadow-sky-600/20"
                      : isToday
                      ? "bg-white dark:bg-slate-900 border border-sky-400 dark:border-sky-500/50 text-sky-700 dark:text-sky-300 font-semibold"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                  }`}
                >
                  <span>{day.short}</span>
                  {isToday && <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />}
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
                  className={`rounded-3xl border p-5 sm:p-6 transition-all ${
                    isToday
                      ? "bg-white dark:bg-slate-900/90 border-slate-300 dark:border-slate-700 shadow-md"
                      : "bg-white/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">{day.label}</h3>
                      <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        ({day.key})
                      </span>
                    </div>
                    {isToday && (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30">
                        আজকের কার্যসূচি
                      </span>
                    )}
                  </div>

                  {daySlots.length === 0 ? (
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 py-4 text-center bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
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
                            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between shadow-xs ${theme.bg} ${theme.border}`}
                          >
                            <div>
                              <div className="flex items-center justify-between text-xs font-bold mb-2">
                                <span className={`px-2 py-0.5 rounded-lg border font-bold text-[11px] ${theme.badge}`}>
                                  পিরিয়ড {slot.period}
                                </span>
                                <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                                  <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                                  {minutesToTime12(slot.startTime)} - {minutesToTime12(slot.endTime)}
                                </span>
                              </div>

                              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug my-1.5">
                                {slot.courseTitle}
                              </h4>

                              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                {role === "teacher" && (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900">
                                    {slot.batch} {slot.majorOrSection}
                                  </span>
                                )}
                                {slot.majorOrSection && slot.majorOrSection !== "Common" && role !== "teacher" && (
                                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${theme.badge}`}>
                                    {slot.majorOrSection}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 text-xs">
                              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold border border-slate-200 dark:border-slate-800 shadow-2xs">
                                <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                                রুম {slot.room}
                              </span>

                              <button
                                type="button"
                                onClick={() => onSelectFaculty(faculty)}
                                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold border border-slate-200 dark:border-slate-800 hover:border-violet-400 transition-colors cursor-pointer"
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

// Compact, high-aesthetic class card for the weekly grid cell
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
      className={`p-2.5 rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between group ${theme.bg} ${theme.border}`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-1 mb-1.5">
          <span className={`px-1.5 py-0.5 rounded-md font-mono text-[10px] font-bold border ${theme.badge}`}>
            {showBatch ? `${slot.batch}` : slot.majorOrSection || "Class"}
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-slate-700 dark:text-slate-300">
            <MapPin className="w-3 h-3 text-sky-600 dark:text-sky-400 shrink-0" />
            <span>{slot.room}</span>
          </span>
        </div>

        {/* Course Title */}
        <h5 className="text-xs font-bold text-slate-900 dark:text-white leading-snug line-clamp-2 mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
          {slot.courseTitle}
        </h5>
      </div>

      {/* Footer: Instructor & Batch */}
      <div className="flex items-center justify-between gap-1 pt-1.5 mt-1 border-t border-slate-200/50 dark:border-slate-800/60">
        <button
          type="button"
          onClick={() => onSelectFaculty(faculty)}
          className="inline-flex items-center gap-1 text-[10px] font-bold text-violet-700 dark:text-violet-300 hover:underline cursor-pointer"
          title={`${faculty.fullName} (${faculty.designation})`}
        >
          <User className="w-2.5 h-2.5 text-violet-600 dark:text-violet-400" />
          <span>{slot.instructor}</span>
        </button>

        {showBatch && slot.majorOrSection && (
          <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 truncate">
            {slot.majorOrSection}
          </span>
        )}
      </div>
    </div>
  );
}

