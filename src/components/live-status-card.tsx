"use client";

import { useEffect, useState } from "react";
import { ClassSlot, FacultyMember } from "@/lib/types";
import {
  formatMinutesBengali,
  getActiveAndUpcomingClass,
  minutesToTime12,
} from "@/lib/time-utils";
import { getFacultyInfo } from "@/data/faculty";
import {
  Clock,
  MapPin,
  User,
  PartyPopper,
  Coffee,
  CalendarX,
  Compass,
  Copy,
  Check,
  Sparkles,
  Info,
} from "lucide-react";

interface LiveStatusCardProps {
  routineData: ClassSlot[];
  studentName?: string;
  batch: string;
  majorOrSection: string;
  simulatedTime?: Date;
  onOpenEmptyRooms: () => void;
  onSelectFaculty: (faculty: FacultyMember) => void;
}

export function LiveStatusCard({
  routineData,
  studentName,
  batch,
  majorOrSection,
  simulatedTime,
  onOpenEmptyRooms,
  onSelectFaculty,
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
    }, 10000);
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

  // Personalized Greeting
  const getGreeting = () => {
    const hours = currentTime.getHours();
    let timeGreeting = "স্বাগতম";
    if (hours < 12) timeGreeting = "Good morning";
    else if (hours < 17) timeGreeting = "Good afternoon";
    else timeGreeting = "Good evening";

    if (studentName && studentName.trim().length > 0) {
      return `${timeGreeting}, ${studentName.trim()}! Here is your radar 📡`;
    }
    return `${timeGreeting}! Here is your AIBA radar 📡`;
  };

  // Case 1: Weekend (Friday / Saturday)
  if (status.isWeekend) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-slate-700/60 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl shadow-slate-950/60 text-slate-100">
        <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-indigo-500 to-purple-600" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 mt-1 shadow-inner">
              <CalendarX className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono font-medium text-purple-300">
                  {getGreeting()}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                আজ ক্যাম্পাস বন্ধ! প্যারা নাই 🏖️
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                সপ্তাহের সব ক্লাস শেষ। আগামী রবিবারে পরবর্তী ক্লাস শুরু হবে।
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenEmptyRooms}
            className="self-start sm:self-center px-4 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-purple-400" />
            <span>সপ্তাহের রুটিন দেখুন</span>
          </button>
        </div>
      </div>
    );
  }

  // Case 2: Class is currently running!
  if (status.currentClass) {
    const cls = status.currentClass;
    const faculty = getFacultyInfo(cls.instructor);

    return (
      <div className="relative overflow-hidden rounded-3xl border border-rose-500/40 bg-gradient-to-br from-slate-900/95 via-slate-900/75 to-slate-950 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl shadow-rose-950/20 text-slate-100">
        <div className="absolute top-0 left-0 w-2 h-full bg-rose-500 animate-pulse" />

        {/* Greeting & Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-xs font-mono text-slate-400 block mb-1">
              {getGreeting()}
            </span>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/15 text-rose-300 border border-rose-500/40 uppercase tracking-wider">
                চলমান ক্লাস • {cls.isClub ? "Club Activity" : `Period ${cls.period}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-950/80 border border-slate-700/80 text-xs font-mono text-slate-200 self-start sm:self-auto">
            <Clock className="w-4 h-4 text-rose-400" />
            <span>
              শেষ হতে বাকি: <strong className="text-white font-bold">{formatMinutesBengali(status.minutesLeftInCurrent || 0)}</strong>
            </span>
          </div>
        </div>

        {/* Course Title & Room */}
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
            {cls.courseTitle}
          </h3>

          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs sm:text-sm font-mono text-slate-200">
            {/* Time Slot */}
            <span className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {minutesToTime12(cls.startTime)} – {minutesToTime12(cls.endTime)}
            </span>

            {/* Room with copy */}
            <button
              type="button"
              onClick={() => copyRoomNumber(cls.room)}
              className="flex items-center gap-1.5 bg-slate-950/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-800 text-cyan-300 font-bold transition-colors cursor-pointer"
              title="রুম কপি করুন"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>রুম {cls.room}</span>
              {copiedRoom === cls.room ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>

            {/* Teacher with Faculty Popover Trigger */}
            <button
              type="button"
              onClick={() => onSelectFaculty(faculty)}
              className="flex items-center gap-1.5 bg-slate-950/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-violet-500/50 text-slate-200 transition-colors cursor-pointer"
              title="শিক্ষকের তথ্য দেখুন"
            >
              <User className="w-3.5 h-3.5 text-violet-400" />
              <span>{cls.instructor}</span>
              <Info className="w-3 h-3 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 pt-3.5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <span>ক্লাসের সময় অতিবাহিত</span>
            <span>{status.progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-rose-500 to-amber-500 transition-all duration-500 rounded-full"
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
    const faculty = getFacultyInfo(next.instructor);

    return (
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/40 bg-gradient-to-br from-slate-900/95 via-slate-900/75 to-slate-950 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl shadow-cyan-950/30 text-slate-100">
        <div className="absolute top-0 left-0 w-2 h-full bg-cyan-400" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-xs font-mono text-slate-400 block mb-1">
              {getGreeting()}
            </span>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 uppercase tracking-wider">
                পরবর্তী ক্লাস • {next.isClub ? "Club Activity" : `Period ${next.period}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 self-start sm:self-auto">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>
              শুরু হতে বাকি: <strong className="text-white font-bold">{formatMinutesBengali(status.minutesToNext || 0)}</strong>
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-snug">
            {next.courseTitle}
          </h3>

          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs sm:text-sm font-mono text-slate-200">
            <span className="flex items-center gap-1.5 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              {minutesToTime12(next.startTime)} – {minutesToTime12(next.endTime)}
            </span>

            <button
              type="button"
              onClick={() => copyRoomNumber(next.room)}
              className="flex items-center gap-1.5 bg-slate-950/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-800 text-cyan-300 font-bold transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              <span>রুম {next.room}</span>
              {copiedRoom === next.room ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onSelectFaculty(faculty)}
              className="flex items-center gap-1.5 bg-slate-950/80 hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-800 hover:border-violet-500/50 text-slate-200 transition-colors cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-violet-400" />
              <span>{next.instructor}</span>
              <Info className="w-3 h-3 text-slate-500" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 4: All classes done for today
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-slate-950/90 backdrop-blur-2xl p-6 sm:p-7 shadow-2xl shadow-slate-950/50 text-slate-100">
      <div className="absolute top-0 left-0 w-2 h-full bg-emerald-400" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mt-1 shadow-inner">
            <PartyPopper className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-mono font-medium text-emerald-300">
                {getGreeting()}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              আজকের মতো সব ক্লাস শেষ! 🎉
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              বাড়ি যান বা ক্যাফেটেরিয়ায় আড্ডা দিন। কাল আবার দেখা হবে!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenEmptyRooms}
          className="self-start sm:self-center px-4 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Coffee className="w-4 h-4 text-amber-400" />
          <span>আড্ডার জন্য ফাঁকা রুম দেখুন</span>
        </button>
      </div>
    </div>
  );
}
