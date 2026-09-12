"use client";

import { useState } from "react";
import { ClassSlot, FacultyMember } from "@/lib/types";
import { minutesToTime12, timeToMinutes, isSlotMinor } from "@/lib/time-utils";
import { TIME_PERIODS } from "@/data/routine";
import { getFacultyInfo } from "@/data/faculty";
import { Clock, MapPin, User, Check, Coffee, Copy, Info, BookOpen } from "lucide-react";

interface TodayTimelineProps {
  todayClasses: ClassSlot[];
  currentTime: Date;
  currentDayName: string;
  onSelectFaculty: (faculty: FacultyMember) => void;
  batch?: string;
  minor?: string;
}

export function TodayTimeline({
  todayClasses,
  currentTime,
  currentDayName,
  onSelectFaculty,
  batch,
  minor,
}: TodayTimelineProps) {
  const [copiedRoom, setCopiedRoom] = useState<string | null>(null);
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  const copyRoom = (room: string) => {
    navigator.clipboard.writeText(room);
    setCopiedRoom(room);
    setTimeout(() => setCopiedRoom(null), 2000);
  };

  if (todayClasses.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8 text-center text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-950/40">
        <p className="text-sm">আজকে ({currentDayName}) এই ব্যাচের জন্য কোনো ক্লাস নির্ধারিত নেই।</p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      {TIME_PERIODS.map((periodInfo, idx) => {
        const startM = timeToMinutes(periodInfo.startTime);
        const endM = timeToMinutes(periodInfo.endTime);
        const isPast = currentMinutes >= endM;
        const isCurrent = currentMinutes >= startM && currentMinutes < endM;
        const isFuture = currentMinutes < startM;

        // Break slot
        if (periodInfo.isBreak) {
          return (
            <div
              key={`break-${idx}`}
              className={`flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-semibold transition-all ${
                isCurrent
                  ? "bg-amber-100 dark:bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-500/40 shadow-xs"
                  : "bg-slate-100/70 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800/60"
              }`}
            >
              <Coffee className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{periodInfo.name} ({periodInfo.label})</span>
              {isCurrent && (
                <span className="px-2 py-0.5 rounded-md bg-amber-600 text-white text-xs font-bold">
                  চলমান
                </span>
              )}
            </div>
          );
        }

        // Period slot
        const classInPeriod = todayClasses.find((c) => c.period === periodInfo.period);

        if (!classInPeriod) {
          return (
            <div
              key={`empty-period-${periodInfo.period}`}
              className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-slate-800 dark:text-slate-200">{periodInfo.name}</span>
                <span className="font-semibold text-slate-600 dark:text-slate-400">({periodInfo.label})</span>
              </div>
              <span className="font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-2.5 py-1 rounded-lg">
                ফাঁকা স্লট
              </span>
            </div>
          );
        }

        const faculty = getFacultyInfo(classInPeriod.instructor);

        return (
          <div
            key={classInPeriod.id}
            className={`relative p-4 sm:p-5 rounded-2xl border transition-all ${
              isCurrent
                ? "bg-white dark:bg-slate-900 border-sky-500 dark:border-sky-400 shadow-md shadow-sky-500/10 ring-2 ring-sky-500/20"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs"
            }`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2.5">
                <span
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide ${
                    isCurrent
                      ? "bg-sky-600 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {periodInfo.name}
                </span>

                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  {minutesToTime12(classInPeriod.startTime)} – {minutesToTime12(classInPeriod.endTime)}
                </span>
              </div>

              <div>
                {isCurrent && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-500/20 text-sky-800 dark:text-sky-200 border border-sky-300 dark:border-sky-500/40">
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                    চলমান
                  </span>
                )}
                {isPast && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30">
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    সম্পন্ন
                  </span>
                )}
                {isFuture && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    আসন্ন
                  </span>
                )}
              </div>
            </div>

            {/* Course Title */}
            <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight my-2 flex items-center gap-2 flex-wrap">
              <span>{classInPeriod.courseTitle}</span>
              {classInPeriod.isClub && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-500/20 text-violet-800 dark:text-violet-200 border border-violet-300 dark:border-violet-500/30">
                  Club Activity
                </span>
              )}
              {(isSlotMinor(classInPeriod, batch || "", minor) || classInPeriod.isMinor) && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-500/30">
                  মাইনর: {minor && minor !== "None" ? minor : "Minor"}
                </span>
              )}
            </h4>

            {/* Bottom Row: Room & Instructor */}
            <div className="flex flex-wrap items-center gap-2.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => copyRoom(classInPeriod.room)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/70 hover:bg-sky-100 dark:hover:bg-sky-900/50 text-sky-800 dark:text-sky-200 font-bold border border-sky-200 dark:border-sky-800 transition-colors cursor-pointer"
                title="রুম কপি করুন"
              >
                <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>রুম {classInPeriod.room}</span>
                {copiedRoom === classInPeriod.room ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-sky-600/70 dark:text-sky-400/70" />
                )}
              </button>

              <button
                type="button"
                onClick={() => onSelectFaculty(faculty)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-800 hover:border-violet-400 transition-colors cursor-pointer"
                title="শিক্ষকের বিস্তারিত দেখতে ক্লিক করুন"
              >
                <User className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                <span>{classInPeriod.instructor}</span>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
