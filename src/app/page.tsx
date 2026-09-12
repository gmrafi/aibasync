"use client";

import { useEffect, useState } from "react";
import { ROUTINE_DATA, INSTITUTION_INFO } from "@/data/routine";
import { DEFAULT_PREFERENCES, getStoredPreferences } from "@/lib/storage";
import { getActiveAndUpcomingClass, getDayName } from "@/lib/time-utils";
import { DayOfWeek, FacultyMember, UserPreferences } from "@/lib/types";
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
import {
  Clock,
  Layers,
  Building2,
  CalendarDays,
  Download,
  GraduationCap,
  FlaskConical,
} from "lucide-react";

export default function HomePage() {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoaded, setIsLoaded] = useState(false);
  const [viewMode, setViewMode] = useState<"TODAY" | "WEEK">("TODAY");

  // Modals state
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isEmptyRoomsOpen, setIsEmptyRoomsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);

  // Time & Simulator state
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [simulatedTime, setSimulatedTime] = useState<Date | undefined>(undefined);

  useEffect(() => {
    const stored = getStoredPreferences();
    setPreferences(stored);
    setIsLoaded(true);

    // If first visit, show the onboarding modal
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

  const effectiveTime = isSimulationMode && simulatedTime ? simulatedTime : currentTime;
  const currentDayName = getDayName(effectiveTime);

  const status = getActiveAndUpcomingClass(
    ROUTINE_DATA,
    preferences.batch,
    preferences.majorOrSection,
    effectiveTime
  );

  const handlePreferencesSaved = (name: string, batch: string, majorOrSection: string) => {
    setPreferences({
      studentName: name,
      batch,
      majorOrSection,
      hasOnboarded: true,
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

  return (
    <div className="min-h-screen ambient-glow text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <Navbar
        studentName={preferences.studentName}
        batch={preferences.batch}
        majorOrSection={preferences.majorOrSection}
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
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-5 sm:py-7 space-y-6 pb-24 md:pb-12">
        {/* Simulation Banner */}
        {isSimulationMode && (
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs font-mono text-amber-300 animate-in fade-in">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-amber-400" />
              <span>
                টেস্ট সিমুলেশন চালু: {currentDayName} {effectiveTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsSimulationMode(false);
                setSimulatedTime(undefined);
              }}
              className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 font-bold transition-colors cursor-pointer"
            >
              লাইভ সময়ে ফিরুন
            </button>
          </div>
        )}

        {/* Live Radar Hero Card */}
        <section aria-label="রিয়েল-টাইম ক্লাস রাডার">
          <LiveStatusCard
            routineData={ROUTINE_DATA}
            studentName={preferences.studentName}
            batch={preferences.batch}
            majorOrSection={preferences.majorOrSection}
            simulatedTime={isSimulationMode ? effectiveTime : undefined}
            onOpenEmptyRooms={() => setIsEmptyRoomsOpen(true)}
            onSelectFaculty={(fac) => setSelectedFaculty(fac)}
          />
        </section>

        {/* View Switcher & Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              {preferences.batch} ({preferences.majorOrSection}) রুটিন
              <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400">
                Fall 2026
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {viewMode === "TODAY"
                ? `আজকের টাইমলাইন (${currentDayName}) • ${status.todayClasses.length}টি ক্লাস শিডিউল`
                : "রবি থেকে বৃহস্পতিবারের পুরো শিডিউল"}
            </p>
          </div>

          {/* Segmented View Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-900/90 border border-slate-800 self-start sm:self-center shadow-md">
            <button
              type="button"
              onClick={() => setViewMode("TODAY")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                viewMode === "TODAY"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Today View</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("WEEK")}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                viewMode === "WEEK"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Week View</span>
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
            />
          ) : (
            <WeekView
              routineData={ROUTINE_DATA}
              batch={preferences.batch}
              majorOrSection={preferences.majorOrSection}
              currentRealDay={currentDayName}
              onSelectFaculty={(fac) => setSelectedFaculty(fac)}
            />
          )}
        </section>

        {/* Simulation Dock */}
        <div className="p-4 rounded-3xl border border-slate-800/80 bg-slate-950/50 backdrop-blur-sm space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
              <span>টাইম সিমুলেটর (রাতে বা বন্ধের দিনে প্রিভিউ দেখার জন্য):</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSimulationPreset("Sunday", 10, 15)}
              className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] font-mono text-slate-300 transition-colors cursor-pointer"
            >
              ১ম পিরিয়ড (10:15 AM)
            </button>
            <button
              type="button"
              onClick={() => setSimulationPreset("Sunday", 11, 15)}
              className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] font-mono text-slate-300 transition-colors cursor-pointer"
            >
              বিরতি স্লট (11:15 AM)
            </button>
            <button
              type="button"
              onClick={() => setSimulationPreset("Sunday", 12, 0)}
              className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] font-mono text-slate-300 transition-colors cursor-pointer"
            >
              ২য় পিরিয়ড (12:00 PM)
            </button>
            <button
              type="button"
              onClick={() => setSimulationPreset("Sunday", 14, 0)}
              className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] font-mono text-slate-300 transition-colors cursor-pointer"
            >
              ক্লাব/৩য় পিরিয়ড (02:00 PM)
            </button>
            <button
              type="button"
              onClick={() => setSimulationPreset("Sunday", 16, 0)}
              className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] font-mono text-slate-300 transition-colors cursor-pointer"
            >
              ক্লাস শেষ (04:00 PM)
            </button>
            <button
              type="button"
              onClick={() => setSimulationPreset("Friday", 11, 0)}
              className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] font-mono text-slate-300 transition-colors cursor-pointer"
            >
              ছুটির দিন (শুক্রবার)
            </button>
          </div>
        </div>

        {/* Footer info with Exact Author Credit */}
        <footer className="pt-6 border-t border-slate-800/80 text-center text-xs font-mono text-slate-400 space-y-2">
          <p>
            {INSTITUTION_INFO.name} • {INSTITUTION_INFO.subTitle}
          </p>
          <p className="text-[11px] text-slate-400">
            AIBA Radar (Phase 1) • Zero Backend • Client Powered
          </p>
          <div className="pt-2">
            <p className="text-xs text-slate-300">
              Designed and Developed by{" "}
              <a
                href="https://www.gmrafi.com.bd/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-4 decoration-cyan-500/40 hover:decoration-cyan-400 transition-all"
              >
                Md. Golam Mubasshir Rafi
              </a>
            </p>
          </div>
        </footer>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-2xl px-2 py-2 flex items-center justify-around text-[10px] font-mono text-slate-400"
      >
        <button
          type="button"
          onClick={() => setViewMode((prev) => (prev === "TODAY" ? "WEEK" : "TODAY"))}
          className="flex flex-col items-center gap-1 p-1 hover:text-cyan-400 cursor-pointer"
        >
          <Clock className="w-5 h-5 text-cyan-400" />
          <span>{viewMode === "TODAY" ? "Week View" : "Today View"}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsEmptyRoomsOpen(true)}
          className="flex flex-col items-center gap-1 p-1 hover:text-violet-400 cursor-pointer"
        >
          <Building2 className="w-5 h-5 text-violet-400" />
          <span>ফাঁকা রুম</span>
        </button>

        <button
          type="button"
          onClick={() => setIsCalendarOpen(true)}
          className="flex flex-col items-center gap-1 p-1 hover:text-emerald-400 cursor-pointer"
        >
          <CalendarDays className="w-5 h-5 text-emerald-400" />
          <span>ক্যালেন্ডার</span>
        </button>

        <button
          type="button"
          onClick={() => setIsSelectorOpen(true)}
          className="flex flex-col items-center gap-1 p-1 hover:text-cyan-400 cursor-pointer"
        >
          <GraduationCap className="w-5 h-5 text-cyan-400" />
          <span>ব্যাচ বদল</span>
        </button>

        <button
          type="button"
          onClick={() => setIsExportOpen(true)}
          className="flex flex-col items-center gap-1 p-1 hover:text-amber-400 cursor-pointer"
        >
          <Download className="w-5 h-5 text-amber-400" />
          <span>কার্ড</span>
        </button>
      </nav>

      {/* Modals */}
      <SelectionDialog
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        currentName={preferences.studentName}
        currentBatch={preferences.batch}
        currentMajorOrSection={preferences.majorOrSection}
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
