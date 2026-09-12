"use client";

import { useEffect, useState } from "react";
import { ClassSlot } from "@/lib/types";
import {
  formatMinutesBengali,
  getActiveAndUpcomingClass,
  minutesToTime12,
} from "@/lib/time-utils";
import {
  Clock,
  MapPin,
  User,
  PartyPopper,
  Coffee,
  CheckCircle2,
  CalendarX,
  Compass,
  Copy,
  Check,
} from "lucide-react";

interface LiveStatusCardProps {
  routineData: ClassSlot[];
  batch: string;
  majorOrSection: string;
  simulatedTime?: Date;
  onOpenEmptyRooms: () => void;
}

export function LiveStatusCard({
  routineData,
  batch,
  majorOrSection,
  simulatedTime,
  onOpenEmptyRooms,
}: LiveStatusCardProps) {
  const [copiedRoom, setCopiedRoom] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<Date>(simulatedTime || new Date());

  useEffect(() => {
    if (simulatedTime) {
      setCurrentTime(simulatedTime);
      return;
    }
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000); // update every 10s
    return () => clearInterval(interval);
  }, [simulatedTime]);

  const status = getActiveAndUpcomingClass(
    routineData,
    batch,
    majorOrSection,
    currentTime
  );

  const copyRoomNumber = (room: string) => {
    navigator.clipboard.writeText(room);
    setCopiedRoom(room);
    setTimeout(() => setCopiedRoom(null), 2000);
  };

  // Case 1: Weekend (Friday / Saturday)
  if (status.isWeekend) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/60 backdrop-blur-xl p-5 sm:p-6 shadow-xl text-zinc-100">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-600" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400 mt-1">
              <CalendarX className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  ছুটির দিন (Weekend)
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                আজ ক্যাম্পাস বন্ধ! প্যারা নাই 🏖️
              </h3>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                সপ্তাহের সব ক্লাস শেষ। আগামী রবিবারে পরবর্তী ক্লাস শুরু হবে।
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenEmptyRooms}
            className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 border border-zinc-700 transition-colors flex items-center gap-2"
          >
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>সপ্তাহের রুটিন দেখুন</span>
          </button>
        </div>
      </div>
    );
  }

  // Case 2: Class is currently running!
  if (status.currentClass) {
    const cls = status.currentClass;
    return (
      <div className="relative overflow-hidden rounded-2xl border border-rose-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900/90 to-zinc-950 backdrop-blur-xl p-5 sm:p-6 shadow-2xl text-zinc-100">
        <div className="absolute top-0 left-0 w-2 h-full bg-rose-500 animate-pulse" />
        
        {/* Top bar with Pulse beacon and countdown */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30 tracking-wide uppercase">
              চলমান ক্লাস • {cls.isClub ? "Club Activity" : `Period ${cls.period}`}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700/80 text-xs font-mono text-zinc-300">
            <Clock className="w-3.5 h-3.5 text-rose-400" />
            <span>
              শেষ হতে বাকি: <strong className="text-white font-bold">{formatMinutesBengali(status.minutesLeftInCurrent || 0)}</strong>
            </span>
          </div>
        </div>

        {/* Course Title & Room */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {cls.courseTitle}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-mono text-zinc-300">
              <span className="flex items-center gap-1.5 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {minutesToTime12(cls.startTime)} – {minutesToTime12(cls.endTime)}
              </span>

              <button
                type="button"
                onClick={() => copyRoomNumber(cls.room)}
                className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-800 text-cyan-300 font-bold transition-colors cursor-pointer"
                title="রুম নম্বর কপি করুন"
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>রুম {cls.room}</span>
                {copiedRoom === cls.room ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-zinc-500" />
                )}
              </button>

              <span className="flex items-center gap-1.5 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800 text-zinc-300">
                <User className="w-3.5 h-3.5 text-violet-400" />
                {cls.instructor}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 pt-3 border-t border-zinc-800/80">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
            <span>ক্লাসের অগ্রগতি</span>
            <span>{status.progressPercent}% সম্পন্ন</span>
          </div>
          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-rose-500 transition-all duration-500 rounded-full"
              style={{ width: `${status.progressPercent}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Case 3: Next class is coming up!
  if (status.nextClass) {
    const next = status.nextClass;
    return (
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-zinc-950 via-zinc-900/80 to-zinc-950 backdrop-blur-xl p-5 sm:p-6 shadow-2xl text-zinc-100">
        <div className="absolute top-0 left-0 w-2 h-full bg-cyan-500" />

        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 tracking-wide uppercase">
              পরবর্তী ক্লাস • {next.isClub ? "Club Activity" : `Period ${next.period}`}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              শুরু হতে বাকি: <strong className="text-white font-bold">{formatMinutesBengali(status.minutesToNext || 0)}</strong>
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {next.courseTitle}
          </h3>
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-mono text-zinc-300">
            <span className="flex items-center gap-1.5 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {minutesToTime12(next.startTime)} – {minutesToTime12(next.endTime)}
            </span>

            <button
              type="button"
              onClick={() => copyRoomNumber(next.room)}
              className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 px-2.5 py-1 rounded-lg border border-zinc-800 text-cyan-300 font-bold transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>রুম {next.room}</span>
              {copiedRoom === next.room ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-zinc-500" />
              )}
            </button>

            <span className="flex items-center gap-1.5 bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800 text-zinc-300">
              <User className="w-3.5 h-3.5 text-violet-400" />
              {next.instructor}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Case 4: All classes finished for today!
  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-zinc-900/60 backdrop-blur-xl p-5 sm:p-6 shadow-xl text-zinc-100">
      <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mt-1">
            <PartyPopper className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                শিডিউল সম্পূর্ণ
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              আজকের মতো সব ক্লাস শেষ! 🎉
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              বাড়ি যান বা ক্যাফেটেরিয়ায় আড্ডা দিন। কাল দেখা হবে!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenEmptyRooms}
          className="self-start sm:self-center px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 border border-zinc-700 transition-colors flex items-center gap-2"
        >
          <Coffee className="w-3.5 h-3.5 text-amber-400" />
          <span>আড্ডার জন্য ফাঁকা রুম দেখুন</span>
        </button>
      </div>
    </div>
  );
}
