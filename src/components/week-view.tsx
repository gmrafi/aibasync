"use client";

import { useMemo, useState } from "react";
import { ClassSlot, DayOfWeek, FacultyMember, UserRole } from "@/lib/types";
import { minutesToTime12, isSlotMatchingView } from "@/lib/time-utils";
import { getFacultyInfo } from "@/data/faculty";
import {
  Clock,
  MapPin,
  User,
  Calendar,
  Coffee,
  Utensils,
  LayoutGrid,
  ListFilter,
} from "lucide-react";

interface WeekViewProps {
  routineData: ClassSlot[];
  batch: string;
  majorOrSection: string;
  minor?: string;
  role?: UserRole;
  teacherCode?: string;
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

// Map each distinct course title to its own color so BBA-11 courses like Corporate Finance and International Financial Management stay visually different.
function getSubjectTheme(courseTitle: string, majorOrSection?: string) {
  const normalized = `${courseTitle ?? ""} ${majorOrSection ?? ""}`.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  const courseTheme = (() => {
    if (normalized.includes("corporate finance")) return "finance-corporate";
    if (normalized.includes("bank fund management")) return "finance-banking";
    if (normalized.includes("financial institutions") || normalized.includes("financial markets")) return "finance-markets";
    if (normalized.includes("international financial management")) return "finance-global";
    if (normalized.includes("principles of finance")) return "finance-principles";

    if (normalized.includes("taxation")) return "accounting-tax";
    if (normalized.includes("cost accounting")) return "accounting-cost";
    if (normalized.includes("auditing")) return "accounting-audit";
    if (normalized.includes("advanced accounting")) return "accounting-advanced";
    if (normalized.includes("principles of accounting")) return "accounting-principles";

    if (normalized.includes("marketing research")) return "marketing-research";
    if (normalized.includes("brand management")) return "marketing-brand";
    if (normalized.includes("strategic marketing")) return "marketing-strategy";
    if (normalized.includes("consumer behavior")) return "marketing-consumer";

    if (normalized.includes("human resources management")) return "management-hrm";
    if (normalized.includes("conflict management") || normalized.includes("negotiation")) return "management-conflict";
    if (normalized.includes("leadership")) return "management-leadership";

    if (normalized.includes("management of innovation and technology")) return "technology-innovation";
    if (normalized.includes("management information system") || normalized.includes("mis")) return "technology-mis";
    if (normalized.includes("computer and its application")) return "technology-computer";

    if (normalized.includes("production planning")) return "operations-planning";
    if (normalized.includes("logistics management")) return "operations-logistics";
    if (normalized.includes("procurement management")) return "operations-procurement";
    if (normalized.includes("supply chain")) return "operations-scm";

    if (normalized.includes("business leadership")) return "business-leadership";
    if (normalized.includes("fundamentals of management")) return "management-foundation";
    if (normalized.includes("entrepreneurship")) return "business-entrepreneurship";

    if (normalized.includes("microeconomics")) return "economics-micro";
    if (normalized.includes("macroeconomics")) return "economics-macro";
    if (normalized.includes("business statistics")) return "analytics-stats";
    if (normalized.includes("business mathematics")) return "analytics-math";

    if (normalized.includes("presentation skill") || normalized.includes("functional english") || normalized.includes("communicative english") || normalized.includes("communication")) return "language-communication";
    if (normalized.includes("environmental studies") || normalized.includes("bangladesh") || normalized.includes("international studies")) return "general-social";

    return "general-core";
  })();

  switch (courseTheme) {
    case "finance-corporate":
      return {
        border: "border-emerald-400 dark:border-emerald-600/80",
        bg: "bg-emerald-50/95 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50",
        text: "text-emerald-950 dark:text-emerald-50",
        badge: "bg-emerald-100 dark:bg-emerald-500/25 text-emerald-950 dark:text-emerald-100 border-emerald-400 dark:border-emerald-500/40",
        accent: "bg-emerald-500",
        chip: "text-emerald-900 dark:text-emerald-200",
      };
    case "finance-banking":
      return {
        border: "border-teal-400 dark:border-teal-600/80",
        bg: "bg-teal-50/95 dark:bg-teal-950/40 hover:bg-teal-100 dark:hover:bg-teal-900/50",
        text: "text-teal-950 dark:text-teal-50",
        badge: "bg-teal-100 dark:bg-teal-500/25 text-teal-950 dark:text-teal-100 border-teal-400 dark:border-teal-500/40",
        accent: "bg-teal-500",
        chip: "text-teal-900 dark:text-teal-200",
      };
    case "finance-markets":
      return {
        border: "border-lime-400 dark:border-lime-600/80",
        bg: "bg-lime-50/95 dark:bg-lime-950/40 hover:bg-lime-100 dark:hover:bg-lime-900/50",
        text: "text-lime-950 dark:text-lime-50",
        badge: "bg-lime-100 dark:bg-lime-500/25 text-lime-950 dark:text-lime-100 border-lime-400 dark:border-lime-500/40",
        accent: "bg-lime-500",
        chip: "text-lime-900 dark:text-lime-200",
      };
    case "finance-global":
      return {
        border: "border-green-400 dark:border-green-600/80",
        bg: "bg-green-50/95 dark:bg-green-950/40 hover:bg-green-100 dark:hover:bg-green-900/50",
        text: "text-green-950 dark:text-green-50",
        badge: "bg-green-100 dark:bg-green-500/25 text-green-950 dark:text-green-100 border-green-400 dark:border-green-500/40",
        accent: "bg-green-500",
        chip: "text-green-900 dark:text-green-200",
      };
    case "finance-principles":
      return {
        border: "border-emerald-300 dark:border-emerald-500/80",
        bg: "bg-emerald-100/90 dark:bg-emerald-900/35 hover:bg-emerald-200 dark:hover:bg-emerald-900/40",
        text: "text-emerald-950 dark:text-emerald-50",
        badge: "bg-emerald-200 dark:bg-emerald-500/30 text-emerald-950 dark:text-emerald-100 border-emerald-400 dark:border-emerald-500/40",
        accent: "bg-emerald-400",
        chip: "text-emerald-900 dark:text-emerald-200",
      };
    case "accounting-tax":
      return {
        border: "border-amber-400 dark:border-amber-600/80",
        bg: "bg-amber-50/95 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50",
        text: "text-amber-950 dark:text-amber-50",
        badge: "bg-amber-100 dark:bg-amber-500/25 text-amber-950 dark:text-amber-100 border-amber-400 dark:border-amber-500/40",
        accent: "bg-amber-500",
        chip: "text-amber-900 dark:text-amber-200",
      };
    case "accounting-cost":
      return {
        border: "border-yellow-400 dark:border-yellow-600/80",
        bg: "bg-yellow-50/95 dark:bg-yellow-950/40 hover:bg-yellow-100 dark:hover:bg-yellow-900/50",
        text: "text-yellow-950 dark:text-yellow-50",
        badge: "bg-yellow-100 dark:bg-yellow-500/25 text-yellow-950 dark:text-yellow-100 border-yellow-400 dark:border-yellow-500/40",
        accent: "bg-yellow-500",
        chip: "text-yellow-900 dark:text-yellow-200",
      };
    case "accounting-audit":
      return {
        border: "border-orange-400 dark:border-orange-600/80",
        bg: "bg-orange-50/95 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/50",
        text: "text-orange-950 dark:text-orange-50",
        badge: "bg-orange-100 dark:bg-orange-500/25 text-orange-950 dark:text-orange-100 border-orange-400 dark:border-orange-500/40",
        accent: "bg-orange-500",
        chip: "text-orange-900 dark:text-orange-200",
      };
    case "accounting-advanced":
      return {
        border: "border-amber-300 dark:border-amber-500/80",
        bg: "bg-amber-100/90 dark:bg-amber-900/35 hover:bg-amber-200 dark:hover:bg-amber-900/40",
        text: "text-amber-950 dark:text-amber-50",
        badge: "bg-amber-200 dark:bg-amber-500/30 text-amber-950 dark:text-amber-100 border-amber-400 dark:border-amber-500/40",
        accent: "bg-amber-400",
        chip: "text-amber-900 dark:text-amber-200",
      };
    case "accounting-principles":
      return {
        border: "border-rose-400 dark:border-rose-600/80",
        bg: "bg-rose-50/95 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50",
        text: "text-rose-950 dark:text-rose-50",
        badge: "bg-rose-100 dark:bg-rose-500/25 text-rose-950 dark:text-rose-100 border-rose-400 dark:border-rose-500/40",
        accent: "bg-rose-500",
        chip: "text-rose-900 dark:text-rose-200",
      };
    case "marketing-research":
      return {
        border: "border-rose-400 dark:border-rose-600/80",
        bg: "bg-rose-50/95 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50",
        text: "text-rose-950 dark:text-rose-50",
        badge: "bg-rose-100 dark:bg-rose-500/25 text-rose-950 dark:text-rose-100 border-rose-400 dark:border-rose-500/40",
        accent: "bg-rose-500",
        chip: "text-rose-900 dark:text-rose-200",
      };
    case "marketing-brand":
      return {
        border: "border-pink-400 dark:border-pink-600/80",
        bg: "bg-pink-50/95 dark:bg-pink-950/40 hover:bg-pink-100 dark:hover:bg-pink-900/50",
        text: "text-pink-950 dark:text-pink-50",
        badge: "bg-pink-100 dark:bg-pink-500/25 text-pink-950 dark:text-pink-100 border-pink-400 dark:border-pink-500/40",
        accent: "bg-pink-500",
        chip: "text-pink-900 dark:text-pink-200",
      };
    case "marketing-strategy":
      return {
        border: "border-red-400 dark:border-red-600/80",
        bg: "bg-red-50/95 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/50",
        text: "text-red-950 dark:text-red-50",
        badge: "bg-red-100 dark:bg-red-500/25 text-red-950 dark:text-red-100 border-red-400 dark:border-red-500/40",
        accent: "bg-red-500",
        chip: "text-red-900 dark:text-red-200",
      };
    case "marketing-consumer":
      return {
        border: "border-fuchsia-400 dark:border-fuchsia-600/80",
        bg: "bg-fuchsia-50/95 dark:bg-fuchsia-950/40 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/50",
        text: "text-fuchsia-950 dark:text-fuchsia-50",
        badge: "bg-fuchsia-100 dark:bg-fuchsia-500/25 text-fuchsia-950 dark:text-fuchsia-100 border-fuchsia-400 dark:border-fuchsia-500/40",
        accent: "bg-fuchsia-500",
        chip: "text-fuchsia-900 dark:text-fuchsia-200",
      };
    case "management-hrm":
      return {
        border: "border-indigo-400 dark:border-indigo-600/80",
        bg: "bg-indigo-50/95 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50",
        text: "text-indigo-950 dark:text-indigo-50",
        badge: "bg-indigo-100 dark:bg-indigo-500/25 text-indigo-950 dark:text-indigo-100 border-indigo-400 dark:border-indigo-500/40",
        accent: "bg-indigo-500",
        chip: "text-indigo-900 dark:text-indigo-200",
      };
    case "management-conflict":
      return {
        border: "border-violet-400 dark:border-violet-600/80",
        bg: "bg-violet-50/95 dark:bg-violet-950/40 hover:bg-violet-100 dark:hover:bg-violet-900/50",
        text: "text-violet-950 dark:text-violet-50",
        badge: "bg-violet-100 dark:bg-violet-500/25 text-violet-950 dark:text-violet-100 border-violet-400 dark:border-violet-500/40",
        accent: "bg-violet-500",
        chip: "text-violet-900 dark:text-violet-200",
      };
    case "management-foundation":
      return {
        border: "border-indigo-300 dark:border-indigo-500/80",
        bg: "bg-indigo-100/90 dark:bg-indigo-900/35 hover:bg-indigo-200 dark:hover:bg-indigo-900/40",
        text: "text-indigo-950 dark:text-indigo-50",
        badge: "bg-indigo-200 dark:bg-indigo-500/30 text-indigo-950 dark:text-indigo-100 border-indigo-400 dark:border-indigo-500/40",
        accent: "bg-indigo-400",
        chip: "text-indigo-900 dark:text-indigo-200",
      };
    case "management-leadership":
      return {
        border: "border-purple-400 dark:border-purple-600/80",
        bg: "bg-purple-50/95 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50",
        text: "text-purple-950 dark:text-purple-50",
        badge: "bg-purple-100 dark:bg-purple-500/25 text-purple-950 dark:text-purple-100 border-purple-400 dark:border-purple-500/40",
        accent: "bg-purple-500",
        chip: "text-purple-900 dark:text-purple-200",
      };
    case "technology-innovation":
      return {
        border: "border-cyan-400 dark:border-cyan-600/80",
        bg: "bg-cyan-50/95 dark:bg-cyan-950/40 hover:bg-cyan-100 dark:hover:bg-cyan-900/50",
        text: "text-cyan-950 dark:text-cyan-50",
        badge: "bg-cyan-100 dark:bg-cyan-500/25 text-cyan-950 dark:text-cyan-100 border-cyan-400 dark:border-cyan-500/40",
        accent: "bg-cyan-500",
        chip: "text-cyan-900 dark:text-cyan-200",
      };
    case "technology-mis":
      return {
        border: "border-sky-400 dark:border-sky-600/80",
        bg: "bg-sky-50/95 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50",
        text: "text-sky-950 dark:text-sky-50",
        badge: "bg-sky-100 dark:bg-sky-500/25 text-sky-950 dark:text-sky-100 border-sky-400 dark:border-sky-500/40",
        accent: "bg-sky-500",
        chip: "text-sky-900 dark:text-sky-200",
      };
    case "technology-computer":
      return {
        border: "border-sky-300 dark:border-sky-500/80",
        bg: "bg-sky-100/90 dark:bg-sky-900/35 hover:bg-sky-200 dark:hover:bg-sky-900/40",
        text: "text-sky-950 dark:text-sky-50",
        badge: "bg-sky-200 dark:bg-sky-500/30 text-sky-950 dark:text-sky-100 border-sky-400 dark:border-sky-500/40",
        accent: "bg-sky-400",
        chip: "text-sky-900 dark:text-sky-200",
      };
    case "operations-planning":
      return {
        border: "border-orange-400 dark:border-orange-600/80",
        bg: "bg-orange-50/95 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/50",
        text: "text-orange-950 dark:text-orange-50",
        badge: "bg-orange-100 dark:bg-orange-500/25 text-orange-950 dark:text-orange-100 border-orange-400 dark:border-orange-500/40",
        accent: "bg-orange-500",
        chip: "text-orange-900 dark:text-orange-200",
      };
    case "operations-logistics":
      return {
        border: "border-yellow-400 dark:border-yellow-600/80",
        bg: "bg-yellow-50/95 dark:bg-yellow-950/40 hover:bg-yellow-100 dark:hover:bg-yellow-900/50",
        text: "text-yellow-950 dark:text-yellow-50",
        badge: "bg-yellow-100 dark:bg-yellow-500/25 text-yellow-950 dark:text-yellow-100 border-yellow-400 dark:border-yellow-500/40",
        accent: "bg-yellow-500",
        chip: "text-yellow-900 dark:text-yellow-200",
      };
    case "operations-procurement":
      return {
        border: "border-orange-300 dark:border-orange-500/80",
        bg: "bg-orange-100/90 dark:bg-orange-900/35 hover:bg-orange-200 dark:hover:bg-orange-900/40",
        text: "text-orange-950 dark:text-orange-50",
        badge: "bg-orange-200 dark:bg-orange-500/30 text-orange-950 dark:text-orange-100 border-orange-400 dark:border-orange-500/40",
        accent: "bg-orange-400",
        chip: "text-orange-900 dark:text-orange-200",
      };
    case "operations-scm":
      return {
        border: "border-amber-400 dark:border-amber-600/80",
        bg: "bg-amber-50/95 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50",
        text: "text-amber-950 dark:text-amber-50",
        badge: "bg-amber-100 dark:bg-amber-500/25 text-amber-950 dark:text-amber-100 border-amber-400 dark:border-amber-500/40",
        accent: "bg-amber-500",
        chip: "text-amber-900 dark:text-amber-200",
      };
    case "business-leadership":
      return {
        border: "border-violet-400 dark:border-violet-600/80",
        bg: "bg-violet-50/95 dark:bg-violet-950/40 hover:bg-violet-100 dark:hover:bg-violet-900/50",
        text: "text-violet-950 dark:text-violet-50",
        badge: "bg-violet-100 dark:bg-violet-500/25 text-violet-950 dark:text-violet-100 border-violet-400 dark:border-violet-500/40",
        accent: "bg-violet-500",
        chip: "text-violet-900 dark:text-violet-200",
      };
    case "business-entrepreneurship":
      return {
        border: "border-purple-400 dark:border-purple-600/80",
        bg: "bg-purple-50/95 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50",
        text: "text-purple-950 dark:text-purple-50",
        badge: "bg-purple-100 dark:bg-purple-500/25 text-purple-950 dark:text-purple-100 border-purple-400 dark:border-purple-500/40",
        accent: "bg-purple-500",
        chip: "text-purple-900 dark:text-purple-200",
      };
    case "economics-micro":
      return {
        border: "border-fuchsia-400 dark:border-fuchsia-600/80",
        bg: "bg-fuchsia-50/95 dark:bg-fuchsia-950/40 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/50",
        text: "text-fuchsia-950 dark:text-fuchsia-50",
        badge: "bg-fuchsia-100 dark:bg-fuchsia-500/25 text-fuchsia-950 dark:text-fuchsia-100 border-fuchsia-400 dark:border-fuchsia-500/40",
        accent: "bg-fuchsia-500",
        chip: "text-fuchsia-900 dark:text-fuchsia-200",
      };
    case "economics-macro":
      return {
        border: "border-pink-400 dark:border-pink-600/80",
        bg: "bg-pink-50/95 dark:bg-pink-950/40 hover:bg-pink-100 dark:hover:bg-pink-900/50",
        text: "text-pink-950 dark:text-pink-50",
        badge: "bg-pink-100 dark:bg-pink-500/25 text-pink-950 dark:text-pink-100 border-pink-400 dark:border-pink-500/40",
        accent: "bg-pink-500",
        chip: "text-pink-900 dark:text-pink-200",
      };
    case "analytics-stats":
      return {
        border: "border-sky-400 dark:border-sky-600/80",
        bg: "bg-sky-50/95 dark:bg-sky-950/40 hover:bg-sky-100 dark:hover:bg-sky-900/50",
        text: "text-sky-950 dark:text-sky-50",
        badge: "bg-sky-100 dark:bg-sky-500/25 text-sky-950 dark:text-sky-100 border-sky-400 dark:border-sky-500/40",
        accent: "bg-sky-500",
        chip: "text-sky-900 dark:text-sky-200",
      };
    case "analytics-math":
      return {
        border: "border-cyan-400 dark:border-cyan-600/80",
        bg: "bg-cyan-50/95 dark:bg-cyan-950/40 hover:bg-cyan-100 dark:hover:bg-cyan-900/50",
        text: "text-cyan-950 dark:text-cyan-50",
        badge: "bg-cyan-100 dark:bg-cyan-500/25 text-cyan-950 dark:text-cyan-100 border-cyan-400 dark:border-cyan-500/40",
        accent: "bg-cyan-500",
        chip: "text-cyan-900 dark:text-cyan-200",
      };
    case "language-communication":
      return {
        border: "border-pink-400 dark:border-pink-600/80",
        bg: "bg-pink-50/95 dark:bg-pink-950/40 hover:bg-pink-100 dark:hover:bg-pink-900/50",
        text: "text-pink-950 dark:text-pink-50",
        badge: "bg-pink-100 dark:bg-pink-500/25 text-pink-950 dark:text-pink-100 border-pink-400 dark:border-pink-500/40",
        accent: "bg-pink-500",
        chip: "text-pink-900 dark:text-pink-200",
      };
    default:
      return {
        border: "border-slate-400 dark:border-slate-600/80",
        bg: "bg-slate-50/95 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-900/50",
        text: "text-slate-950 dark:text-slate-50",
        badge: "bg-slate-100 dark:bg-slate-500/25 text-slate-950 dark:text-slate-100 border-slate-400 dark:border-slate-500/40",
        accent: "bg-slate-500",
        chip: "text-slate-900 dark:text-slate-200",
      };
  }
}

export function WeekView({
  routineData,
  batch,
  majorOrSection,
  minor,
  role = "student",
  teacherCode,
  currentRealDay,
  onSelectFaculty,
}: WeekViewProps) {
  const [layoutMode, setLayoutMode] = useState<"GRID" | "DAY">("GRID");
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | "ALL">("ALL");
  const [teacherFilter, setTeacherFilter] = useState<string>(
    role === "teacher"
      ? batch === "ALL_BATCHES"
        ? "ALL_BATCHES"
        : "MY_CLASSES"
      : batch
  );

  // Available batches for teachers to quick-switch
  const allBatches = useMemo(() => {
    const s = new Set<string>();
    routineData.forEach((r) => s.add(r.batch));
    return Array.from(s).sort();
  }, [routineData]);

  // Active slots according to user selection
  const activeSlots = useMemo(() => {
    const effectiveBatch = role === "teacher" ? teacherFilter : batch;
    return routineData.filter((s) =>
      isSlotMatchingView(s, effectiveBatch, majorOrSection, minor, role, teacherCode)
    );
  }, [routineData, role, teacherFilter, batch, majorOrSection, minor, teacherCode]);

  const subjectLegend = useMemo(() => {
    const byCourse = new Map<string, { label: string; accent: string }>();
    activeSlots.forEach((slot) => {
      const label = slot.courseTitle.trim();
      if (!label) return;
      if (!byCourse.has(label)) {
        const theme = getSubjectTheme(slot.courseTitle, slot.majorOrSection);
        byCourse.set(label, { label, accent: theme.accent });
      }
    });
    return Array.from(byCourse.values());
  }, [activeSlots]);

  return (
    <div className="space-y-3.5">
      {/* Top Header & View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3.5 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400">
              <Calendar className="w-4 h-4" />
            </span>
            <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              Weekly View
            </h3>
          </div>
        </div>

        {/* View Switcher: Full Week Grid vs Day List */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 self-start sm:self-center shadow-xs">
          <button
            type="button"
            onClick={() => setLayoutMode("GRID")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              layoutMode === "GRID"
                ? "bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Grid</span>
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode("DAY")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              layoutMode === "DAY"
                ? "bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Day</span>
          </button>
        </div>
      </div>

      {/* Teacher Specific Quick Batch Switcher Bar */}
      {role === "teacher" && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar p-1.5 rounded-2xl bg-slate-100/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
          <span className="text-xs font-black text-slate-600 dark:text-slate-300 px-2 shrink-0">
            Routine Filter:
          </span>
          <button
            type="button"
            onClick={() => setTeacherFilter("MY_CLASSES")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
              teacherFilter === "MY_CLASSES"
                ? "bg-sky-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            My Classes
          </button>
          <button
            type="button"
            onClick={() => setTeacherFilter("ALL_BATCHES")}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
              teacherFilter === "ALL_BATCHES"
                ? "bg-sky-600 text-white shadow-xs"
                : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            Master Routine (All Batches)
          </button>
          {allBatches.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setTeacherFilter(b)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                teacherFilter === b
                  ? "bg-sky-600 text-white shadow-xs"
                  : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 1: COMPACT SINGLE-GLANCE WEEKLY TIMETABLE MATRIX     */}
      {/* DAYS AS ROWS (LEFT), ALL 3 PERIODS VISIBLE/PEEKING       */}
      {/* ========================================================= */}
      {layoutMode === "GRID" && (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md overflow-hidden transition-all">
          <div className="overflow-x-auto">
            <div className="min-w-[640px] sm:min-w-[720px]">
              {/* Table Column Headers */}
              <div className="grid grid-cols-[84px_minmax(145px,1fr)_38px_minmax(145px,1fr)_38px_minmax(145px,1fr)] sm:grid-cols-[96px_minmax(170px,1fr)_44px_minmax(170px,1fr)_44px_minmax(170px,1fr)] border-b border-slate-200 dark:border-slate-800 bg-slate-100/95 dark:bg-slate-950">
                {/* Column 1: Day Label (Sticky Left) */}
                <div className="p-2 sm:p-2.5 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center sticky left-0 z-20 bg-slate-100 dark:bg-slate-950 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]">
                  <span className="text-[11px] sm:text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Day
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    Week
                  </span>
                </div>

                {/* Column 2: Period 1 */}
                <div className="p-2 sm:p-2.5 text-center border-r border-slate-200 dark:border-slate-800">
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    Period 1
                  </div>
                  <div className="text-[11px] font-bold text-sky-700 dark:text-sky-300">
                    09:30 - 11:00 AM
                  </div>
                </div>

                {/* Column 3: Short Break */}
                <div
                  className="p-1 border-r border-amber-200/70 dark:border-amber-800/40 bg-amber-100/50 dark:bg-amber-950/40 flex flex-col items-center justify-center text-center"
                  title="Break • 11:00 AM - 11:30 AM (30 minutes)"
                >
                  <Coffee className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mb-0.5" />
                  <span className="text-[9px] font-black text-amber-950 dark:text-amber-200 leading-tight">
                    Break
                  </span>
                  <span className="text-[9px] font-bold text-amber-700 dark:text-amber-400 leading-none mt-0.5">
                    11:00
                  </span>
                </div>

                {/* Column 4: Period 2 */}
                <div className="p-2 sm:p-2.5 text-center border-r border-slate-200 dark:border-slate-800">
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    Period 2
                  </div>
                  <div className="text-[11px] font-bold text-sky-700 dark:text-sky-300">
                    11:30 AM - 01:00 PM
                  </div>
                </div>

                {/* Column 5: Lunch Break */}
                <div
                  className="p-1 border-r border-sky-200/70 dark:border-sky-800/40 bg-sky-100/50 dark:bg-sky-950/40 flex flex-col items-center justify-center text-center"
                  title="Lunch Break • 01:00 PM - 01:30 PM (30 minutes)"
                >
                  <Utensils className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 mb-0.5" />
                  <span className="text-[9px] font-black text-sky-950 dark:text-sky-200 leading-tight">
                    Lunch
                  </span>
                  <span className="text-[9px] font-bold text-sky-700 dark:text-sky-400 leading-none mt-0.5">
                    01:00
                  </span>
                </div>

                {/* Column 6: Period 3 */}
                <div className="p-2 sm:p-2.5 text-center">
                  <div className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                    Period 3
                  </div>
                  <div className="text-[11px] font-bold text-sky-700 dark:text-sky-300">
                    01:30 - 03:00 PM
                  </div>
                </div>
              </div>

              {/* TIMETABLE ROWS (Days as Rows: Sunday to Thursday) */}
              {WEEK_DAYS.map((day, dayIdx) => {
                const isToday = currentRealDay === day.key;
                const p1Slots = activeSlots.filter((s) => s.day === day.key && s.period === 1);
                const p2Slots = activeSlots.filter((s) => s.day === day.key && s.period === 2);
                const p3Slots = activeSlots.filter((s) => s.day === day.key && s.period === 3);

                return (
                  <div
                    key={day.key}
                    className={`grid grid-cols-[84px_minmax(145px,1fr)_38px_minmax(145px,1fr)_38px_minmax(145px,1fr)] sm:grid-cols-[96px_minmax(170px,1fr)_44px_minmax(170px,1fr)_44px_minmax(170px,1fr)] border-b last:border-b-0 border-slate-200 dark:border-slate-800 min-h-[115px] sm:min-h-[130px] transition-colors ${
                      isToday ? "bg-sky-50/20 dark:bg-sky-500/5" : ""
                    }`}
                  >
                    {/* Day Header Cell (Sticky Left) */}
                    <div
                      className={`p-2 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center sticky left-0 z-10 transition-colors ${
                        isToday
                          ? "bg-sky-100/95 dark:bg-slate-900 border-r-2 border-r-sky-500 shadow-[2px_0_8px_-2px_rgba(14,165,233,0.3)]"
                          : "bg-slate-50/95 dark:bg-slate-950 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.06)]"
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white leading-tight">
                          {day.label}
                        </span>
                        {isToday && (
                          <span
                            className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse shrink-0"
                            title="আজকের দিন"
                          />
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                        {day.key.slice(0, 3)}
                      </span>
                      {isToday && (
                        <span className="mt-1 px-1.5 py-0.2 rounded-full text-[9px] font-black bg-sky-600 text-white tracking-tight shadow-2xs">
                          Today
                        </span>
                      )}
                    </div>

                    {/* Period 1 Cell */}
                    <div className="p-1.5 sm:p-2 border-r border-slate-200 dark:border-slate-800 flex flex-col gap-1.5 justify-center">
                      {p1Slots.length === 0 ? (
                        <div className="h-full min-h-[85px] rounded-xl border border-dashed border-slate-200 dark:border-slate-800/80 flex flex-col items-center justify-center text-xs font-semibold text-slate-400 dark:text-slate-600 bg-slate-50/40 dark:bg-slate-950/20">
                          <span>ক্লাস নেই</span>
                        </div>
                      ) : (
                        p1Slots.map((s) => (
                          <TimetableSlotCard
                            key={s.id}
                            slot={s}
                            showBatch={role === "teacher"}
                            onSelectFaculty={onSelectFaculty}
                          />
                        ))
                      )}
                    </div>

                    {/* Short Break Column: Centered badge in the exact middle row (Tuesday / dayIdx 2) */}
                    {dayIdx === 2 ? (
                      <div
                        className="p-1 border-r border-amber-200/60 dark:border-amber-800/40 bg-amber-100/70 dark:bg-amber-900/35 flex flex-col items-center justify-center text-center shadow-2xs"
                        title="বিরতি • 11:00 AM - 11:30 AM (৩০ মিনিট)"
                      >
                        <Coffee className="w-3.5 h-3.5 text-amber-700 dark:text-amber-300 mb-1 shrink-0" />
                        <span className="[writing-mode:vertical-lr] text-[9px] font-black text-amber-950 dark:text-amber-100 tracking-wider rotate-180 select-none">
                          বিরতি • 11:00-11:30
                        </span>
                      </div>
                    ) : (
                      <div
                        className="border-r border-amber-200/40 dark:border-amber-800/30 bg-amber-50/20 dark:bg-amber-950/10 flex items-center justify-center"
                        title="বিরতি • 11:00 AM - 11:30 AM"
                      >
                        <div className="w-0.5 h-10 bg-amber-300/60 dark:bg-amber-700/40 rounded-full" />
                      </div>
                    )}

                    {/* Period 2 Cell */}
                    <div className="p-1.5 sm:p-2 border-r border-slate-200 dark:border-slate-800 flex flex-col gap-1.5 justify-center">
                      {p2Slots.length === 0 ? (
                        <div className="h-full min-h-[85px] rounded-xl border border-dashed border-slate-200 dark:border-slate-800/80 flex flex-col items-center justify-center text-xs font-semibold text-slate-400 dark:text-slate-600 bg-slate-50/40 dark:bg-slate-950/20">
                          <span>ক্লাস নেই</span>
                        </div>
                      ) : (
                        p2Slots.map((s) => (
                          <TimetableSlotCard
                            key={s.id}
                            slot={s}
                            showBatch={role === "teacher"}
                            onSelectFaculty={onSelectFaculty}
                          />
                        ))
                      )}
                    </div>

                    {/* Lunch Break Column: Centered badge in the exact middle row (Tuesday / dayIdx 2) */}
                    {dayIdx === 2 ? (
                      <div
                        className="p-1 border-r border-sky-200/60 dark:border-sky-800/40 bg-sky-100/70 dark:bg-sky-900/35 flex flex-col items-center justify-center text-center shadow-2xs"
                        title="মধ্যাহ্ন বিরতি • 01:00 PM - 01:30 PM (৩০ মিনিট)"
                      >
                        <Utensils className="w-3.5 h-3.5 text-sky-700 dark:text-sky-300 mb-1 shrink-0" />
                        <span className="[writing-mode:vertical-lr] text-[9px] font-black text-sky-950 dark:text-sky-100 tracking-wider rotate-180 select-none">
                          মধ্যাহ্ন বিরতি • 01:00-01:30
                        </span>
                      </div>
                    ) : (
                      <div
                        className="border-r border-sky-200/40 dark:border-sky-800/30 bg-sky-50/20 dark:bg-sky-950/10 flex items-center justify-center"
                        title="মধ্যাহ্ন বিরতি • 01:00 PM - 01:30 PM"
                      >
                        <div className="w-0.5 h-10 bg-sky-300/60 dark:bg-sky-700/40 rounded-full" />
                      </div>
                    )}

                    {/* Period 3 Cell */}
                    <div className="p-1.5 sm:p-2 flex flex-col gap-1.5 justify-center">
                      {p3Slots.length === 0 ? (
                        <div className="h-full min-h-[85px] rounded-xl border border-dashed border-slate-200 dark:border-slate-800/80 flex flex-col items-center justify-center text-xs font-semibold text-slate-400 dark:text-slate-600 bg-slate-50/40 dark:bg-slate-950/20">
                          <span>ক্লাস নেই</span>
                        </div>
                      ) : (
                        p3Slots.map((s) => (
                          <TimetableSlotCard
                            key={s.id}
                            slot={s}
                            showBatch={role === "teacher"}
                            onSelectFaculty={onSelectFaculty}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Course-specific Color Legend */}
          <div className="p-3 sm:p-3.5 bg-slate-50/90 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-center gap-2.5 text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="text-slate-900 dark:text-white font-black mr-1">Active course key:</span>
            {subjectLegend.length === 0 ? (
              <span className="text-slate-500 dark:text-slate-400">No active courses</span>
            ) : (
              subjectLegend.map((entry) => (
                <span key={entry.label} className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-2 py-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${entry.accent}`} />
                  <span className="truncate max-w-[120px] sm:max-w-[160px]">{entry.label}</span>
                </span>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODE 2: DAY-BY-DAY CARD VIEW                             */}
      {/* ========================================================= */}
      {layoutMode === "DAY" && (
        <div className="space-y-4">
          {/* Day Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setSelectedDay("ALL")}
              className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 cursor-pointer ${
                selectedDay === "ALL"
                  ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
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
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-sky-600 text-white shadow-md shadow-sky-600/20"
                      : isToday
                      ? "bg-white dark:bg-slate-900 border-2 border-sky-500 text-sky-700 dark:text-sky-300 font-black"
                      : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <span>{day.short}</span>
                  {isToday && <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />}
                </button>
              );
            })}
          </div>

          {/* List of day sections */}
          <div className="space-y-4">
            {(selectedDay === "ALL" ? WEEK_DAYS : WEEK_DAYS.filter((d) => d.key === selectedDay)).map((day) => {
              const daySlots = activeSlots
                .filter((s) => s.day === day.key)
                .sort((a, b) => a.period - b.period);
              const isToday = currentRealDay === day.key;

              return (
                <div
                  key={day.key}
                  className={`rounded-3xl border p-4 sm:p-5 transition-all ${
                    isToday
                      ? "bg-white dark:bg-slate-900 border-2 border-sky-400 dark:border-sky-500 shadow-md"
                      : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800"
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      <h3 className="text-base font-black text-slate-900 dark:text-white">{day.label}</h3>
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        ({day.key})
                      </span>
                    </div>
                    {isToday && (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-50 dark:bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30">
                        আজকের কার্যসূচি
                      </span>
                    )}
                  </div>

                  {daySlots.length === 0 ? (
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 py-4 text-center bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
                      এই দিনে কোনো ক্লাস নির্ধারিত নেই
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {daySlots.map((slot) => {
                        const theme = getSubjectTheme(slot.courseTitle, slot.majorOrSection);
                        const faculty = getFacultyInfo(slot.instructor);
                        return (
                          <div
                            key={slot.id}
                            className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all flex flex-col justify-between shadow-xs ${theme.bg} ${theme.border}`}
                          >
                            <div>
                              <div className="flex items-center justify-between text-xs font-black mb-1.5">
                                <span className={`px-2 py-0.5 rounded-lg border font-black text-xs ${theme.badge}`}>
                                  পিরিয়ড {slot.period}
                                </span>
                                <span className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 font-bold text-xs">
                                  <Clock className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                                  {minutesToTime12(slot.startTime)} - {minutesToTime12(slot.endTime)}
                                </span>
                              </div>

                              <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug my-1.5">
                                {slot.courseTitle}
                              </h4>

                              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                                {role === "teacher" && (
                                  <span className="px-2 py-0.5 rounded-md text-xs font-black bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900">
                                    {slot.batch} {slot.majorOrSection}
                                  </span>
                                )}
                                {slot.majorOrSection && slot.majorOrSection !== "Common" && role !== "teacher" && (
                                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold border ${theme.badge}`}>
                                    {slot.majorOrSection}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-300/60 dark:border-slate-800 text-xs">
                              <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black border border-slate-200 dark:border-slate-800 shadow-2xs">
                                <MapPin className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                                রুম {slot.room}
                              </span>

                              <button
                                type="button"
                                onClick={() => onSelectFaculty(faculty)}
                                className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black border border-slate-200 dark:border-slate-800 hover:border-violet-400 transition-colors cursor-pointer"
                                title="শিক্ষকের প্রোফাইল দেখুন"
                              >
                                <User className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                                <span>{slot.instructor}</span>
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
      )}
    </div>
  );
}

// Compact, high-aesthetic, high-contrast class card for the weekly grid cell
function TimetableSlotCard({
  slot,
  showBatch,
  onSelectFaculty,
}: {
  slot: ClassSlot;
  showBatch: boolean;
  onSelectFaculty: (faculty: FacultyMember) => void;
}) {
  const theme = getSubjectTheme(slot.courseTitle, slot.majorOrSection);
  const faculty = getFacultyInfo(slot.instructor);

  return (
    <div
      className={`p-2 sm:p-2.5 rounded-xl border-2 transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between group ${theme.bg} ${theme.border}`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <span className={`px-1.5 py-0.5 rounded-md text-[10px] sm:text-[11px] font-black border ${theme.badge}`}>
            {showBatch ? `${slot.batch}` : slot.majorOrSection || "Class"}
          </span>
          <span className="flex items-center gap-0.5 text-[10px] sm:text-[11px] font-black text-slate-900 dark:text-slate-100 bg-white/90 dark:bg-slate-900/90 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-800 shadow-2xs shrink-0">
            <MapPin className="w-3 h-3 text-sky-600 dark:text-sky-400 shrink-0" />
            <span>{slot.room}</span>
          </span>
        </div>

        {/* Course Title: BOLD, CLEAR, HIGH CONTRAST */}
        <h5 className="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white leading-snug line-clamp-2 my-0.5 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
          {slot.courseTitle}
        </h5>
      </div>

      {/* Footer: Instructor & Batch */}
      <div className="flex items-center justify-between gap-1 pt-1.5 mt-1 border-t border-slate-300/50 dark:border-slate-800">
        <button
          type="button"
          onClick={() => onSelectFaculty(faculty)}
          className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-black text-violet-700 dark:text-violet-300 hover:text-violet-900 dark:hover:text-violet-100 hover:underline cursor-pointer truncate"
          title={`${faculty.fullName} (${faculty.designation})`}
        >
          <User className="w-3 h-3 text-violet-600 dark:text-violet-400 shrink-0" />
          <span className="truncate max-w-[95px] sm:max-w-[125px]">{slot.instructor}</span>
        </button>

        {showBatch && slot.majorOrSection && (
          <span className="text-[10px] font-black text-slate-600 dark:text-slate-300 px-1.5 py-0.2 rounded-md bg-slate-200/70 dark:bg-slate-800 truncate">
            {slot.majorOrSection}
          </span>
        )}
      </div>
    </div>
  );
}
