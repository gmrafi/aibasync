"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ROUTINE_DATA, INSTITUTION_INFO } from "@/data/routine";
import { DEFAULT_PREFERENCES, getStoredPreferences, savePreferences } from "@/lib/storage";
import {
  formatMinutesBengali,
  getActiveAndUpcomingClass,
  getDayName,
  minutesToTime12,
  timeToMinutes,
} from "@/lib/time-utils";
import { trackRoutineView } from "@/lib/tracking";
import { DayOfWeek, FacultyMember, UserPreferences, UserRole } from "@/lib/types";
import { Navbar } from "@/components/navbar";
import { LiveStatusCard } from "@/components/live-status-card";
import { TodayTimeline } from "@/components/today-timeline";
import { WeekView } from "@/components/week-view";
import { SelectionDialog } from "@/components/selection-dialog";
import { EmptyRoomFinder } from "@/components/empty-room-finder";
import { AcademicCalendarModal } from "@/components/academic-calendar-modal";
import { ExportCardModal } from "@/components/export-card-modal";
import { FacultyModal } from "@/components/faculty-modal";
import { PwaInstallBanner } from "@/components/pwa-install-banner";
import { getFacultyInfo } from "@/data/faculty";
import {
  Clock,
  Layers,
  Building2,
  CalendarDays,
  Download,
  GraduationCap,
  FlaskConical,
  BookOpen,
  ExternalLink,
  Globe,
} from "lucide-react";

export default function HomePage() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [viewMode, setViewMode] = useState<"TODAY" | "WEEK">("WEEK");

  // Modals state
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isEmptyRoomsOpen, setIsEmptyRoomsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);

  // Time & Simulator state
  const [currentTime, setCurrentTime] = useState<Date>(new Date("2024-01-01T09:00:00"));
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [simulatedTime, setSimulatedTime] = useState<Date | undefined>(undefined);

  useEffect(() => {
    setIsHydrated(true);
    setCurrentTime(new Date());

    const stored = getStoredPreferences();
    setPreferences(stored);
    setIsLoaded(true);

    // Apply theme to document
    if (stored.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Default to WEEK view for the first-load experience, because it is the primary dashboard view.
    setViewMode("WEEK");

    // If first visit, show the academic selection dialog
    if (!stored.hasOnboarded) {
      setIsSelectorOpen(true);
    }

    // Register PWA Service Worker in production
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const timer = setInterval(() => {
      if (!isSimulationMode) {
        setCurrentTime(new Date());
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [isSimulationMode]);

  const toggleTheme = () => {
    const newTheme = preferences.theme === "dark" ? "light" : "dark";
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    const updated = savePreferences({ theme: newTheme });
    setPreferences(updated);
  };

  const effectiveTime = isHydrated
    ? isSimulationMode && simulatedTime ? simulatedTime : currentTime
    : new Date("2024-01-01T09:00:00");
  const currentDayName = getDayName(effectiveTime);

  const effectiveTeacherBatch = preferences.role === "teacher" ? "MY_CLASSES" : preferences.batch;

  const status = getActiveAndUpcomingClass(
    ROUTINE_DATA,
    effectiveTeacherBatch,
    preferences.majorOrSection,
    effectiveTime,
    preferences.minor,
    preferences.role,
    preferences.teacherCode
  );

  const handlePreferencesSaved = (
    name: string,
    batch: string,
    majorOrSection: string,
    minor: string,
    role?: UserRole,
    teacherCode?: string
  ) => {
    setPreferences((prev) => ({
      ...prev,
      role: role || "student",
      teacherCode: teacherCode || "",
      studentName: name,
      batch,
      majorOrSection,
      minor,
      hasOnboarded: true,
    }));

    // রুটিন ভিউ ট্র্যাক করুন (ব্যাকগ্রাউন্ডে নীরবে /api/track-এ পাঠানো হয়)
    trackRoutineView({
      name: name || undefined,
      batch,
      majorOrSection,
      minor,
      role: role || "student",
      teacherCode: teacherCode || "",
    });
  };

  const setSimulationPreset = (day: DayOfWeek, hours: number, minutes: number) => {
    const d = new Date();
    const dayMap: Record<DayOfWeek, number> = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6,
    };
    const currentDayIdx = d.getDay();
    const targetDayIdx = dayMap[day];
    const diff = targetDayIdx - currentDayIdx;
    d.setDate(d.getDate() + diff);
    d.setHours(hours, minutes, 0, 0);

    setSimulatedTime(d);
    setIsSimulationMode(true);
  };

  const isBba11 = preferences.batch === "BBA-11";
  const minorDisplay = isBba11 && preferences.minor && preferences.minor !== "None"
    ? ` + Minor: ${preferences.minor.replace("-M", "")}`
    : "";
  const teacherDisplayName = preferences.role === "teacher" && preferences.teacherCode
    ? getFacultyInfo(preferences.teacherCode).fullName
    : "Faculty Profile";

  const nextClasses = status.todayClasses
    .filter((slot) => timeToMinutes(slot.startTime) > effectiveTime.getHours() * 60 + effectiveTime.getMinutes())
    .slice(0, 3);

  const freeWindows = status.todayClasses.reduce<Array<{ start: string; end: string; minutes: number }>>(
    (windows, slot, index, arr) => {
      if (index === arr.length - 1) return windows;
      const nextSlot = arr[index + 1];
      const gap = timeToMinutes(nextSlot.startTime) - timeToMinutes(slot.endTime);
      if (gap > 30) {
        windows.push({
          start: slot.endTime,
          end: nextSlot.startTime,
          minutes: gap,
        });
      }
      return windows;
    },
    []
  );

  const bestFreeWindow = freeWindows.sort((a, b) => b.minutes - a.minutes)[0] || null;

  const summaryCards = [
    {
      label: "আজকের ক্লাস",
      value: `${status.todayClasses.length}`,
      note: status.currentClass ? "চলমান" : status.allDoneForToday ? "শেষ" : "সিডিউল",
    },
    {
      label: "পরবর্তী",
      value: nextClasses[0] ? minutesToTime12(nextClasses[0].startTime) : status.isWeekend ? "ছুটি" : status.allDoneForToday ? "শেষ" : "—",
      note: nextClasses[0] ? nextClasses[0].courseTitle.slice(0, 18) : "কোন ক্লাস নেই",
    },
    {
      label: "ফ্রি স্লট",
      value: bestFreeWindow ? formatMinutesBengali(bestFreeWindow.minutes) : "—",
      note: bestFreeWindow ? `${bestFreeWindow.start}–${bestFreeWindow.end}` : "কোন gap নেই",
    },
    {
      label: "স্ট্যাটাস",
      value: status.currentClass ? "নাউ" : nextClasses[0] ? "রেডি" : "ফ্রি",
      note: status.currentClass ? status.currentClass.room : nextClasses[0] ? nextClasses[0].room : "আজ আপডেটেড",
    },
  ];

  return (
    <div
      className={`min-h-screen ${
        preferences.theme === "dark" ? "academic-canvas-dark" : "academic-canvas-light"
      } text-slate-900 dark:text-slate-100 flex flex-col selection:bg-sky-500/20 selection:text-sky-900 dark:selection:text-sky-200 transition-colors`}
    >
      {/* Top Navbar */}
      <Navbar
        role={preferences.role}
        teacherCode={preferences.teacherCode}
        studentName={preferences.studentName}
        batch={preferences.batch}
        majorOrSection={preferences.majorOrSection}
        minor={preferences.minor}
        theme={preferences.theme || "light"}
        onToggleTheme={toggleTheme}
        onOpenSelector={() => setIsSelectorOpen(true)}
        onOpenEmptyRooms={() => setIsEmptyRoomsOpen(true)}
        onOpenCalendar={() => setIsCalendarOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        currentTimeStr={effectiveTime.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
        currentDayStr={currentDayName}
      />

      {/* Main Container */}
      <main className="flex-1 w-full mx-auto max-w-[420px] sm:max-w-4xl px-3 sm:px-4 py-3 sm:py-7 space-y-4 sm:space-y-6 pb-24 md:pb-12">
        {/* Simulation Banner */}
        {isSimulationMode && (
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 flex items-center justify-between text-xs font-medium text-amber-800 dark:text-amber-300 animate-in fade-in">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>সিমুলেশন মোড চালু আছে: {currentDayName}, {effectiveTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsSimulationMode(false);
                setSimulatedTime(undefined);
              }}
              className="px-2.5 py-1 rounded-xl bg-amber-200/60 dark:bg-amber-500/20 hover:bg-amber-300 dark:hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 font-bold transition-colors cursor-pointer"
            >
              লাইভ সময়ে প্রত্যাবর্তন
            </button>
          </div>
        )}

        {/* Live Status Hero Card */}
        <section aria-label="রিয়েল-টাইম ক্লাস স্ট্যাটাস">
          <LiveStatusCard
            routineData={ROUTINE_DATA}
            role={preferences.role}
            teacherCode={preferences.teacherCode}
            studentName={preferences.studentName}
            batch={preferences.batch}
            majorOrSection={preferences.majorOrSection}
            minor={preferences.minor}
            simulatedTime={isSimulationMode ? effectiveTime : undefined}
            onOpenEmptyRooms={() => setIsEmptyRoomsOpen(true)}
            onSelectFaculty={(fac) => setSelectedFaculty(fac)}
            onSwitchToWeekView={() => setViewMode("WEEK")}
          />
        </section>

        {/* Weekend Quick Switch Helper Banner */}
        {status.isWeekend && viewMode === "TODAY" && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between gap-3 text-xs text-emerald-950 dark:text-emerald-200 animate-in fade-in">
            <span>No classes today — weekend break. View the full weekly schedule below.</span>
            <button
              type="button"
              onClick={() => setViewMode("WEEK")}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs active:scale-98"
            >
              Weekly View
            </button>
          </div>
        )}

        {/* View Switcher & Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                {preferences.role === "teacher"
                  ? (preferences.batch === "MY_CLASSES"
                      ? "My Class Schedule"
                      : preferences.batch === "ALL_BATCHES"
                      ? "Master Routine (All Batches)"
                      : preferences.batch)
                  : preferences.batch}
              </h2>
              {preferences.role === "teacher" ? (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300">
                  {teacherDisplayName}
                </span>
              ) : (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/15 border border-blue-200 dark:border-blue-500/30 text-blue-800 dark:text-blue-300">
                  {preferences.majorOrSection}{minorDisplay}
                </span>
              )}
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Fall 2026
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1">
              {viewMode === "TODAY"
                ? `${currentDayName} • ${status.todayClasses.length} classes scheduled`
                : `${currentDayName} • ${status.todayClasses.length} classes scheduled`}
            </p>
          </div>

          {/* Segmented View Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 self-start sm:self-center shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode("TODAY")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "TODAY"
                  ? "bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Today</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("WEEK")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "WEEK"
                  ? "bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Weekly</span>
            </button>
          </div>
        </div>

        {/* Schedule Display */}
        <section aria-label="ক্লাস শিডিউল গ্রিড">
          {viewMode === "TODAY" ? (
            <TodayTimeline
              todayClasses={status.todayClasses}
              currentTime={effectiveTime}
              currentDayName={currentDayName}
              onSelectFaculty={(fac) => setSelectedFaculty(fac)}
              batch={preferences.batch}
              minor={preferences.minor}
              role={preferences.role}
              teacherCode={preferences.teacherCode}
            />
          ) : (
            <WeekView
              routineData={ROUTINE_DATA}
              batch={preferences.batch}
              majorOrSection={preferences.majorOrSection}
              minor={preferences.minor}
              role={preferences.role}
              teacherCode={preferences.teacherCode}
              currentRealDay={currentDayName}
              currentClass={status.currentClass}
              nextClass={status.nextClass}
              onSelectFaculty={(fac) => setSelectedFaculty(fac)}
            />
          )}
        </section>

        {/* Simulation Dock */}
        <div className="p-4 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/50 backdrop-blur-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              <span>টাইম সিমুলেশন কন্ট্রোল (অবসরকালীন ইন্টারফেস নিরীক্ষণ):</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSimulationPreset("Sunday", 10, 15)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              ১ম পিরিয়ড (10:15 AM)
            </button>
            <button
              type="button"
              onClick={() => setSimulationPreset("Sunday", 11, 15)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              বিরতি স্লট (11:15 AM)
            </button>
            <button
              type="button"
              onClick={() => setSimulationPreset("Sunday", 12, 0)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              ২য় পিরিয়ড (12:00 PM)
            </button>
            <button
              type="button"
              onClick={() => setSimulationPreset("Sunday", 14, 0)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              ৩য় পিরিয়ড (02:00 PM)
            </button>
            <button
              type="button"
              onClick={() => setSimulationPreset("Sunday", 16, 0)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              ক্লাস সমাপ্তি (04:00 PM)
            </button>
            <button
              type="button"
              onClick={() => setSimulationPreset("Friday", 11, 0)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              সাপ্তাহিক ছুটি (শুক্রবার)
            </button>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200/90 dark:border-slate-800/90" />

        {/* Upgraded Interactive Footer */}
        <footer className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          {/* Top Section: Institutional & Quick Shortcuts */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pb-5 border-b border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/80 p-1.5 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center justify-center shrink-0">
                <Image
                  src="/logo.png"
                  alt="AIBA Sylhet Logo"
                  width={40}
                  height={40}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
                    {INSTITUTION_INFO.name}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30">
                    {INSTITUTION_INFO.shortName}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                  {INSTITUTION_INFO.subTitle} • {INSTITUTION_INFO.term}
                </p>
              </div>
            </div>

            {/* Quick Action Pills */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <button
                type="button"
                onClick={() => setIsSelectorOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-sky-50 hover:text-sky-700 dark:hover:bg-sky-500/15 dark:hover:text-sky-300 transition-colors cursor-pointer border border-transparent hover:border-sky-200 dark:hover:border-sky-500/30"
              >
                <Layers className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>ব্যাচ বদল</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEmptyRoomsOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-violet-50 hover:text-violet-700 dark:hover:bg-violet-500/15 dark:hover:text-violet-300 transition-colors cursor-pointer border border-transparent hover:border-violet-200 dark:hover:border-violet-500/30"
              >
                <Building2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                <span>ফাঁকা রুম</span>
              </button>
              <button
                type="button"
                onClick={() => setIsCalendarOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-500/15 dark:hover:text-amber-300 transition-colors cursor-pointer border border-transparent hover:border-amber-200 dark:hover:border-amber-500/30"
              >
                <CalendarDays className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>ক্যালেন্ডার</span>
              </button>
              <button
                type="button"
                onClick={() => setIsExportOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-500/15 dark:hover:text-emerald-300 transition-colors cursor-pointer border border-transparent hover:border-emerald-200 dark:hover:border-emerald-500/30"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>কার্ড ডাউনলোড</span>
              </button>
            </div>
          </div>

          {/* Bottom Section: Author Attribution & Links */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1 text-xs">
            <div className="flex items-center gap-2 font-medium">
              <span className="text-slate-500 dark:text-slate-400">
                Designed and Developed by
              </span>
              <a
                href="https://www.gmrafi.com.bd/"
                target="_blank"
                rel="noopener noreferrer"
                className="group font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 inline-flex items-center gap-1 underline underline-offset-4 decoration-sky-500/40 hover:decoration-sky-400 transition-all"
              >
                <span>Md. Golam Mubasshir Rafi</span>
                <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <a
                href="https://www.gmrafi.com.bd/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>gmrafi.com.bd</span>
              </a>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <a
                href="https://github.com/gmrafi/aibasync"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
              >
                GitHub Repo
              </a>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                Zero-Backend PWA
              </span>
            </div>
          </div>
        </footer>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl px-2 py-2 flex items-center justify-around text-xs font-semibold text-slate-600 dark:text-slate-400 shadow-lg"
      >
        <button
          type="button"
          onClick={() => setViewMode((prev) => (prev === "TODAY" ? "WEEK" : "TODAY"))}
          className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition-all cursor-pointer ${
            viewMode === "WEEK"
              ? "text-sky-600 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-950/50"
              : "hover:text-sky-600 dark:hover:text-sky-400"
          }`}
        >
          {viewMode === "TODAY" ? (
            <Layers className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          ) : (
            <Clock className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          )}
          <span>{viewMode === "TODAY" ? "সাপ্তাহিক" : "আজকের"}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsEmptyRoomsOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2 rounded-xl hover:text-violet-600 dark:hover:text-violet-400 cursor-pointer transition-all"
        >
          <Building2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          <span>ফাঁকা রুম</span>
        </button>

        <button
          type="button"
          onClick={() => setIsCalendarOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2 rounded-xl hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer transition-all"
        >
          <CalendarDays className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          <span>ক্যালেন্ডার</span>
        </button>

        <button
          type="button"
          onClick={() => setIsSelectorOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2 rounded-xl hover:text-sky-600 dark:hover:text-sky-400 cursor-pointer transition-all"
        >
          <GraduationCap className="w-5 h-5 text-sky-600 dark:text-sky-400" />
          <span>ব্যাচ বদল</span>
        </button>

        <button
          type="button"
          onClick={() => setIsExportOpen(true)}
          className="flex flex-col items-center gap-1 py-1 px-2 rounded-xl hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-all"
        >
          <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>কার্ড</span>
        </button>
      </nav>

      {/* Modals */}
      <SelectionDialog
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        currentRole={preferences.role}
        currentTeacherCode={preferences.teacherCode}
        currentName={preferences.studentName}
        currentBatch={preferences.batch}
        currentMajorOrSection={preferences.majorOrSection}
        currentMinor={preferences.minor}
        routineData={ROUTINE_DATA}
        onSaved={handlePreferencesSaved}
      />

      <EmptyRoomFinder
        isOpen={isEmptyRoomsOpen}
        onClose={() => setIsEmptyRoomsOpen(false)}
        routineData={ROUTINE_DATA}
        currentTime={effectiveTime}
      />

      <AcademicCalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
      />

      <ExportCardModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        routineData={ROUTINE_DATA}
        batch={preferences.batch}
        majorOrSection={preferences.majorOrSection}
        minor={preferences.minor}
      />

      {/* Faculty Info Popover */}
      <FacultyModal
        faculty={selectedFaculty}
        onClose={() => setSelectedFaculty(null)}
      />

      {/* PWA Mobile Banner */}
      <PwaInstallBanner />
    </div>
  );
}
