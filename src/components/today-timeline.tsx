"use client";

import { useState } from "react";
import { ClassSlot, FacultyMember } from "@/lib/types";
import { minutesToTime12, timeToMinutes } from "@/lib/time-utils";
import { TIME_PERIODS } from "@/data/routine";
import { getFacultyInfo } from "@/data/faculty";
import { Clock, MapPin, User, Check, Coffee, Copy, Info } from "lucide-react";

interface TodayTimelineProps {
  todayClasses: ClassSlot[];
  currentTime: Date;
  currentDayName: string;
  onSelectFaculty: (faculty: FacultyMember) => void;
}

export function TodayTimeline({
  todayClasses,
  currentTime,
  currentDayName,
  onSelectFaculty,
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
      <div className="rounded-3xl border border-dashed border-slate-800 p-8 text-center text-slate-400 bg-slate-950/40">
        <p className="text-sm">আজকে ({currentDayName}) এই সেকশনের কোনো ক্লাস শিডিউল নেই।</p>
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
              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-mono border transition-all ${
                isCurrent
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-300 shadow-sm"
                  : "bg-slate-950/40 border-slate-800/40 text-slate-500"
              }`}
            >
              <Coffee className={`w-3.5 h-3.5 ${isCurrent ? "text-amber-400 animate-bounce" : "text-slate-500"}`} />
              <span className="font-semibold">{periodInfo.name}</span>
              <span className="text-slate-500">•</span>
              <span>{periodInfo.label}</span>
              {isCurrent && (
                <span className="ml-auto px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                  চলমান বিরতি
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
              className="flex items-center justify-between p-4 rounded-2xl border border-dashed border-slate-800/80 bg-slate-900/20 text-slate-500 text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-400">{periodInfo.name}</span>
                <span>({periodInfo.label})</span>
              </div>
              <span className="italic text-slate-500">ফাঁকা স্লট (কোনো ক্লাস নেই)</span>
            </div>
          );
        }

        const faculty = getFacultyInfo(classInPeriod.instructor);

        return (
          <div
            key={classInPeriod.id}
            className={`relative p-5 rounded-2xl border transition-all ${
              isCurrent
                ? "bg-slate-900/95 border-cyan-400 shadow-xl shadow-cyan-950/30 scale-[1.01]"
                : isPast
                ? "bg-slate-950/40 border-slate-800/50 opacity-60"
                : "bg-slate-900/50 border-slate-800 hover:border-slate-700"
            }`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider ${
                    isCurrent
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {periodInfo.name}
                </span>

                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {minutesToTime12(classInPeriod.startTime)} – {minutesToTime12(classInPeriod.endTime)}
                </span>
              </div>

              <div>
                {isCurrent && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                    চলমান
                  </span>
                )}
                {isPast && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-mono text-slate-500 bg-slate-800/60">
                    <Check className="w-3 h-3" />
                    সম্পন্ন
                  </span>
                )}
                {isFuture && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono text-slate-400 bg-slate-800/40 border border-slate-700/40">
                    আসন্ন
                  </span>
                )}
              </div>
            </div>

            {/* Course Title */}
            <h4 className="text-base sm:text-lg font-bold text-white tracking-tight my-1.5 flex items-center gap-2">
              {classInPeriod.courseTitle}
              {classInPeriod.isClub && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-normal bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Club
                </span>
              )}
            </h4>

            {/* Bottom Row: Room & Instructor */}
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-800/60 text-xs font-mono">
              <button
                type="button"
                onClick={() => copyRoom(classInPeriod.room)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-cyan-300 font-bold border border-slate-800 transition-colors cursor-pointer"
                title="রুম কপি করুন"
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>রুম {classInPeriod.room}</span>
                {copiedRoom === classInPeriod.room ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-slate-500" />
                )}
              </button>

              <button
                type="button"
                onClick={() => onSelectFaculty(faculty)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-violet-500/50 transition-colors cursor-pointer"
                title="শিক্ষকের বিস্তারিত দেখতে ক্লিক করুন"
              >
                <User className="w-3.5 h-3.5 text-violet-400" />
                <span>{classInPeriod.instructor}</span>
                <Info className="w-3 h-3 text-slate-500" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
