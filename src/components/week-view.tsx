"use client";

import { useState } from "react";
import { ClassSlot, DayOfWeek, FacultyMember } from "@/lib/types";
import { minutesToTime12, isSlotMatchingStudent, isSlotMinor } from "@/lib/time-utils";
import { getFacultyInfo } from "@/data/faculty";
import { Clock, MapPin, User, Calendar, Info } from "lucide-react";

interface WeekViewProps {
  routineData: ClassSlot[];
  batch: string;
  majorOrSection: string;
  minor?: string;
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
  minor,
  currentRealDay,
  onSelectFaculty,
}: WeekViewProps) {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | "ALL">(
    WEEK_DAYS.some((d) => d.key === currentRealDay) ? currentRealDay : "ALL"
  );

  const batchSlots = routineData.filter((s) =>
    isSlotMatchingStudent(s, batch, majorOrSection, minor)
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
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? "bg-sky-600 text-white font-bold shadow-md shadow-sky-600/20"
                  : isToday
                  ? "bg-white dark:bg-slate-900 border border-sky-400 dark:border-sky-500/50 text-sky-700 dark:text-sky-300 font-semibold"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <span>{day.short}</span>
              {isToday && (
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
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
                  ? "bg-white dark:bg-slate-900/90 border-slate-300 dark:border-slate-700 shadow-md"
                  : "bg-white/80 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
              }`}
            >
              <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {day.label}
                  </h3>
                  <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    ({day.key})
                  </span>
                </div>
                {isToday && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30">
                    আজকের কার্যসূচি
                  </span>
                )}
              </div>

              {daySlots.length === 0 ? (
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 py-3 text-center bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
                  এই দিনে কোনো ক্লাস নির্ধারিত নেই
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {daySlots.map((slot) => {
                    const faculty = getFacultyInfo(slot.instructor);
                    return (
                      <div
                        key={slot.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs font-bold mb-2">
                            <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100">
                              Period {slot.period}
                            </span>
                            <span className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                              <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                              {minutesToTime12(slot.startTime)} – {minutesToTime12(slot.endTime)}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug my-2">
                            {slot.courseTitle}
                          </h4>

                          {(isSlotMinor(slot, batch, minor) || slot.isMinor) && (
                            <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-800 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-500/30 mb-2">
                              মাইনর: {minor && minor !== "None" ? minor : "Minor"}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-200/70 dark:border-slate-800/80 text-xs">
                          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-800 dark:text-sky-200 font-bold border border-sky-200 dark:border-sky-800">
                            <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                            রুম {slot.room}
                          </span>

                          <button
                            type="button"
                            onClick={() => onSelectFaculty(faculty)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-800 hover:border-violet-400 transition-colors cursor-pointer"
                            title="শিক্ষকের তথ্য দেখুন"
                          >
                            <User className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                            <span>{slot.instructor}</span>
                            <Info className="w-3 h-3 text-slate-400" />
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
