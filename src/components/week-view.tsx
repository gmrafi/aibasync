"use client";

import { useState } from "react";
import { ClassSlot, DayOfWeek, FacultyMember } from "@/lib/types";
import { minutesToTime12 } from "@/lib/time-utils";
import { getFacultyInfo } from "@/data/faculty";
import { Clock, MapPin, User, Calendar, Info } from "lucide-react";

interface WeekViewProps {
  routineData: ClassSlot[];
  batch: string;
  majorOrSection: string;
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

export function WeekView({
  routineData,
  batch,
  majorOrSection,
  currentRealDay,
  onSelectFaculty,
}: WeekViewProps) {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | "ALL">(
    WEEK_DAYS.some((d) => d.key === currentRealDay) ? currentRealDay : "ALL"
  );

  const batchSlots = routineData.filter(
    (s) => s.batch === batch && s.majorOrSection === majorOrSection
  );

  const daysToDisplay =
    selectedDay === "ALL"
      ? WEEK_DAYS
      : WEEK_DAYS.filter((d) => d.key === selectedDay);

  return (
    <div className="space-y-4">
      {/* Day Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedDay("ALL")}
          className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all shrink-0 cursor-pointer ${
            selectedDay === "ALL"
              ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-lg shadow-cyan-500/25"
              : "bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200"
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
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-lg shadow-cyan-500/25"
                  : isToday
                  ? "bg-slate-900/90 border border-cyan-400/50 text-cyan-300 hover:bg-slate-800"
                  : "bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              }`}
            >
              <span>{day.short}</span>
              {isToday && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Grid of days */}
      <div className="space-y-4">
        {daysToDisplay.map((day) => {
          const daySlots = batchSlots
            .filter((s) => s.day === day.key)
            .sort((a, b) => a.period - b.period);
          const isToday = currentRealDay === day.key;

          return (
            <div
              key={day.key}
              className={`rounded-3xl border p-5 sm:p-6 transition-all ${
                isToday
                  ? "bg-slate-900/80 border-slate-700/80 shadow-xl shadow-slate-950/40"
                  : "bg-slate-900/40 border-slate-800/80"
              }`}
            >
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-base font-bold text-white">
                    {day.label}
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    ({day.key})
                  </span>
                </div>
                {isToday && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    আজকের দিন
                  </span>
                )}
              </div>

              {daySlots.length === 0 ? (
                <p className="text-xs font-mono text-slate-400 italic py-2">
                  এই দিনে কোনো ক্লাস নেই।
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {daySlots.map((slot) => {
                    const faculty = getFacultyInfo(slot.instructor);
                    return (
                      <div
                        key={slot.id}
                        className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-200 font-semibold">
                            Period {slot.period}
                          </span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            {minutesToTime12(slot.startTime)}
                          </span>
                        </div>

                        <h4 className="text-sm font-semibold text-white line-clamp-2 my-1.5">
                          {slot.courseTitle}
                        </h4>

                        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/60 text-xs font-mono">
                          <span className="flex items-center gap-1 text-cyan-300 font-bold">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                            রুম {slot.room}
                          </span>

                          <button
                            type="button"
                            onClick={() => onSelectFaculty(faculty)}
                            className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
                            title="শিক্ষকের তথ্য দেখুন"
                          >
                            <User className="w-3.5 h-3.5 text-violet-400" />
                            <span>{slot.instructor}</span>
                            <Info className="w-2.5 h-2.5 text-slate-400" />
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
  );
}
