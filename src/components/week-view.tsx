"use client";

import { useState } from "react";
import { ClassSlot, DayOfWeek } from "@/lib/types";
import { minutesToTime12 } from "@/lib/time-utils";
import { Clock, MapPin, User, Calendar } from "lucide-react";

interface WeekViewProps {
  routineData: ClassSlot[];
  batch: string;
  majorOrSection: string;
  currentRealDay: DayOfWeek;
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
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setSelectedDay("ALL")}
          className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all shrink-0 cursor-pointer ${
            selectedDay === "ALL"
              ? "bg-cyan-500 text-zinc-950 font-bold shadow-md shadow-cyan-500/20"
              : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200"
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
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? "bg-cyan-500 text-zinc-950 font-bold shadow-md shadow-cyan-500/20"
                  : isToday
                  ? "bg-zinc-900 border border-cyan-500/50 text-cyan-300 hover:bg-zinc-800"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
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
              className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                isToday
                  ? "bg-zinc-900/60 border-zinc-700/80 shadow-lg"
                  : "bg-zinc-950/50 border-zinc-800/80"
              }`}
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800/70">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    {day.label}
                  </h3>
                  <span className="text-xs font-mono text-zinc-500">
                    ({day.key})
                  </span>
                </div>
                {isToday && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    আজকের দিন
                  </span>
                )}
              </div>

              {daySlots.length === 0 ? (
                <p className="text-xs font-mono text-zinc-500 italic py-2">
                  এই দিনে কোনো ক্লাস নেই।
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {daySlots.map((slot) => (
                    <div
                      key={slot.id}
                      className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-1.5">
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-semibold">
                          Period {slot.period}
                        </span>
                        <span className="flex items-center gap-1 text-zinc-400">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          {minutesToTime12(slot.startTime)}
                        </span>
                      </div>

                      <h4 className="text-sm font-semibold text-white line-clamp-2 my-1">
                        {slot.courseTitle}
                      </h4>

                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-zinc-800/60 text-xs font-mono">
                        <span className="flex items-center gap-1 text-cyan-300 font-bold">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          রুম {slot.room}
                        </span>
                        <span className="flex items-center gap-1 text-zinc-400">
                          <User className="w-3 h-3 text-violet-400" />
                          {slot.instructor}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
