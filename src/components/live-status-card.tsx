"use client";

import { useEffect, useState } from "react";
import { ClassSlot, FacultyMember, UserRole } from "@/lib/types";
import {
  formatMinutesBengali,
  formatSecondsBengali,
  getActiveAndUpcomingClass,
  minutesToTime12,
} from "@/lib/time-utils";
import { getFacultyInfo } from "@/data/faculty";
import {
  Clock,
  MapPin,
  User,
  CalendarCheck,
  CheckCircle2,
  Copy,
  Check,
  Info,
  CalendarX,
  Building2,
  CalendarDays,
  Sparkles,
} from "lucide-react";

interface LiveStatusCardProps {
  routineData: ClassSlot[];
  role?: UserRole;
  studentName?: string;
  teacherCode?: string;
  batch: string;
  majorOrSection: string;
  minor?: string;
  simulatedTime?: Date;
  onOpenEmptyRooms: () => void;
  onSelectFaculty: (faculty: FacultyMember) => void;
  onSwitchToWeekView?: () => void;
}

export function LiveStatusCard({
  routineData,
  role = "student",
  studentName,
  teacherCode,
  batch,
  majorOrSection,
  minor,
  simulatedTime,
  onOpenEmptyRooms,
  onSelectFaculty,
  onSwitchToWeekView,
}: LiveStatusCardProps) {
  const [copiedRoom, setCopiedRoom] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date("2024-01-01T09:00:00"));

  useEffect(() => {
    setHasMounted(true);
    setCurrentTime(simulatedTime || new Date());
  }, [simulatedTime]);

  useEffect(() => {
    if (simulatedTime) return;

    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, [simulatedTime]);

  const displayTime = hasMounted ? currentTime : new Date("2024-01-01T09:00:00");

  const status = getActiveAndUpcomingClass(
    routineData,
    batch,
    majorOrSection,
    displayTime,
    minor,
    role,
    teacherCode
  );

  const copyRoomNumber = (room: string) => {
    navigator.clipboard.writeText(room);
    setCopiedRoom(room);
    setTimeout(() => setCopiedRoom(null), 2000);
  };

  // Natural Human Academic Greeting
  const getGreeting = () => {
    const timeSource = hasMounted ? currentTime : new Date("2024-01-01T09:00:00");
    const hours = timeSource.getHours();
    let timeGreeting = "স্বাগতম";
    if (hours < 12) timeGreeting = "শুভ সকাল";
    else if (hours < 17) timeGreeting = "শুভ অপরাহ্ন";
    else timeGreeting = "শুভ সন্ধ্যা";

    if (role === "teacher") {
      const teacher = teacherCode ? getFacultyInfo(teacherCode) : null;
      const displayName = studentName || teacher?.fullName || teacherCode;
      if (displayName) {
        return `${timeGreeting}, ${displayName} স্যার/ম্যাম!`;
      }
      return `${timeGreeting}, স্যার/ম্যাম!`;
    }

    if (studentName && studentName.trim().length > 0) {
      return `${timeGreeting}, ${studentName.trim()}!`;
    }
    return `${timeGreeting}!`;
  };

  // Case 1: Weekend (Friday / Saturday)
  if (status.isWeekend) {
    return (
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-200/80 dark:border-emerald-500/30 bg-white dark:bg-slate-900 shadow-lg p-4 sm:p-7 text-slate-900 dark:text-slate-100 transition-colors">
        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-600 dark:bg-emerald-500" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 mt-0.5 shadow-xs shrink-0">
              <CalendarX className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                  {getGreeting()}
                </span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                আজ সাপ্তাহিক ছুটি
              </h3>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                ক্যাম্পাসের নিয়মিত ক্লাস রবিবার শুরু হবে। নিচের বাটনে ক্লিক করে পুরো সপ্তাহের ক্লাস শিডিউল দেখতে পারেন।
              </p>
            </div>
          </div>
          {onSwitchToWeekView && (
            <button
              type="button"
              onClick={onSwitchToWeekView}
              className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer active:scale-98 shrink-0"
            >
              <CalendarDays className="w-4 h-4 text-white" />
              <span>সাপ্তাহিক রুটিন দেখুন</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Case 2: Class is currently running!
  if (status.currentClass) {
    const cls = status.currentClass;
    const faculty = getFacultyInfo(cls.instructor);

    return (
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-emerald-200 dark:border-emerald-500/40 bg-white dark:bg-slate-900/90 shadow-xl shadow-emerald-500/5 dark:shadow-emerald-950/20 p-4 sm:p-7 text-slate-900 dark:text-slate-100 transition-colors">
        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500 animate-pulse" />

        {/* Greeting & Status Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block mb-1">
              {getGreeting()}
            </span>
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 uppercase tracking-wider">
                চলমান ক্লাস • {cls.isClub ? "Club Activity" : `Period ${cls.period}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] sm:text-xs font-semibold text-slate-800 dark:text-slate-200 self-start sm:self-auto">
            <Clock className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <span>
              শেষ হতে বাকি: <strong className="text-emerald-700 dark:text-emerald-300 font-bold">{formatSecondsBengali(status.secondsLeftInCurrent || 0)}</strong>
            </span>
          </div>
        </div>

        {/* Course Title & Room */}
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
            {cls.courseTitle}
          </h3>

          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs sm:text-sm font-semibold">
            {/* Time Slot */}
            <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
              <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              {minutesToTime12(cls.startTime)} - {minutesToTime12(cls.endTime)}
            </span>

            {role === "teacher" && (
              <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 font-bold text-xs">
                {cls.batch} {cls.majorOrSection}
              </span>
            )}

            {/* Room with copy */}
            <button
              type="button"
              onClick={() => copyRoomNumber(cls.room)}
              className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sky-700 dark:text-sky-300 font-bold transition-colors cursor-pointer"
              title="রুম নম্বর কপি করুন"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>রুম {cls.room}</span>
              {copiedRoom === cls.room ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            {/* Teacher info */}
            <button
              type="button"
              onClick={() => onSelectFaculty(faculty)}
              className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-violet-400 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer font-semibold"
              title="শিক্ষকের তথ্য দেখুন"
            >
              <User className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span className="max-w-[180px] truncate">{faculty.fullName}</span>
              <span className="text-[10px] font-bold text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/15 px-1.5 py-0.5 rounded-md border border-violet-200 dark:border-violet-500/30">
                {cls.instructor}
              </span>
              <Info className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300 mb-1.5">
            <span>ক্লাসের সময় অতিবাহিত</span>
            <span>{status.progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 to-rose-500 transition-all duration-500 rounded-full"
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
      <div className="relative overflow-hidden rounded-3xl border border-sky-200 dark:border-sky-500/40 bg-white dark:bg-slate-900/90 shadow-xl shadow-sky-500/5 dark:shadow-sky-950/20 p-6 sm:p-7 text-slate-900 dark:text-slate-100 transition-colors">
        <div className="absolute top-0 left-0 w-2 h-full bg-sky-500" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200 block mb-1">
              {getGreeting()}
            </span>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 uppercase tracking-wider">
                পরবর্তী ক্লাস • {next.isClub ? "Club Activity" : `Period ${next.period}`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 text-xs font-semibold text-sky-800 dark:text-sky-200 self-start sm:self-auto">
            <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>
              শুরু হতে বাকি: <strong className="text-slate-900 dark:text-white font-bold">{formatSecondsBengali(status.secondsToNext || 0)}</strong>
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug">
            {next.courseTitle}
          </h3>

          <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs sm:text-sm font-semibold">
            <span className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
              <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              {minutesToTime12(next.startTime)} - {minutesToTime12(next.endTime)}
            </span>

            {role === "teacher" && (
              <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 font-bold text-xs">
                {next.batch} {next.majorOrSection}
              </span>
            )}

            <button
              type="button"
              onClick={() => copyRoomNumber(next.room)}
              className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sky-700 dark:text-sky-300 font-bold transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>রুম {next.room}</span>
              {copiedRoom === next.room ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => onSelectFaculty(faculty)}
              className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-violet-400 text-slate-800 dark:text-slate-200 transition-colors cursor-pointer font-semibold"
            >
              <User className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span className="max-w-[180px] truncate">{faculty.fullName}</span>
              <span className="text-[10px] font-bold text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-500/15 px-1.5 py-0.5 rounded-md border border-violet-200 dark:border-violet-500/30">
                {next.instructor}
              </span>
              <Info className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Case 4: All classes done for today
  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-200 dark:border-emerald-500/30 bg-white dark:bg-slate-900 shadow-lg p-6 sm:p-7 text-slate-900 dark:text-slate-100 transition-colors">
      <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 mt-1 shadow-sm shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                {getGreeting()}
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              আজকের সকল ক্লাস সম্পন্ন হয়েছে
            </h3>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mt-1">
              পরবর্তী ক্লাসসূচি আগামী কর্মদিবসে শুরু হবে।
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenEmptyRooms}
          className="self-start sm:self-center px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
        >
          <Building2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>ফাঁকা ক্লাসরুম দেখুন</span>
        </button>
      </div>
    </div>
  );
}
