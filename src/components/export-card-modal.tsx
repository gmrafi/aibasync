"use client";

import { useRef, useState } from "react";
import { ClassSlot, DayOfWeek } from "@/lib/types";
import { INSTITUTION_INFO } from "@/data/routine";
import { minutesToTime12, isSlotMatchingStudent, isSlotMinor } from "@/lib/time-utils";
import { getFacultyInfo } from "@/data/faculty";
import { Download, Check, X, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";

interface ExportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  routineData: ClassSlot[];
  batch: string;
  majorOrSection: string;
  minor?: string;
}

const DAYS: DayOfWeek[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

export function ExportCardModal({
  isOpen,
  onClose,
  routineData,
  batch,
  majorOrSection,
  minor,
}: ExportCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const isBba11 = batch === "BBA-11";
  const batchSlots = routineData.filter((s) =>
    isSlotMatchingStudent(s, batch, majorOrSection, minor)
  );

  const getCourseAccent = (courseTitle: string, majorOrSection?: string) => {
    const t = `${courseTitle} ${majorOrSection || ""}`.toLowerCase().replace(/[^a-z0-9]+/g, " ");

    if (t.includes("corporate finance")) {
      return { bg: "bg-emerald-50", border: "border-emerald-300", badge: "bg-emerald-100 text-emerald-900 border-emerald-200" };
    }
    if (t.includes("bank fund management")) {
      return { bg: "bg-teal-50", border: "border-teal-300", badge: "bg-teal-100 text-teal-900 border-teal-200" };
    }
    if (t.includes("financial institutions") || t.includes("financial markets")) {
      return { bg: "bg-lime-50", border: "border-lime-300", badge: "bg-lime-100 text-lime-900 border-lime-200" };
    }
    if (t.includes("international financial management")) {
      return { bg: "bg-green-50", border: "border-green-300", badge: "bg-green-100 text-green-900 border-green-200" };
    }
    if (t.includes("principles of finance")) {
      return { bg: "bg-emerald-100", border: "border-emerald-300", badge: "bg-emerald-200 text-emerald-950 border-emerald-300" };
    }
    if (t.includes("taxation")) {
      return { bg: "bg-amber-50", border: "border-amber-300", badge: "bg-amber-100 text-amber-900 border-amber-200" };
    }
    if (t.includes("cost accounting") || t.includes("auditing") || t.includes("advanced accounting") || t.includes("principles of accounting") || t.includes("accounting")) {
      return { bg: "bg-amber-50", border: "border-amber-300", badge: "bg-amber-100 text-amber-900 border-amber-200" };
    }
    if (t.includes("marketing research") || t.includes("brand management") || t.includes("strategic marketing") || t.includes("consumer behavior") || t.includes("marketing")) {
      return { bg: "bg-rose-50", border: "border-rose-300", badge: "bg-rose-100 text-rose-900 border-rose-200" };
    }
    if (t.includes("human resources management") || t.includes("conflict management") || t.includes("negotiation") || t.includes("leadership") || t.includes("hrm")) {
      return { bg: "bg-indigo-50", border: "border-indigo-300", badge: "bg-indigo-100 text-indigo-900 border-indigo-200" };
    }
    if (t.includes("management information system") || t.includes("management of innovation and technology") || t.includes("computer and its application") || t.includes("technology") || t.includes("mis")) {
      return { bg: "bg-cyan-50", border: "border-cyan-300", badge: "bg-cyan-100 text-cyan-900 border-cyan-200" };
    }
    if (t.includes("production planning") || t.includes("logistics management") || t.includes("procurement management") || t.includes("supply chain") || t.includes("scm")) {
      return { bg: "bg-orange-50", border: "border-orange-300", badge: "bg-orange-100 text-orange-900 border-orange-200" };
    }
    if (t.includes("entrepreneurship") || t.includes("fundamentals of management") || t.includes("business leadership")) {
      return { bg: "bg-violet-50", border: "border-violet-300", badge: "bg-violet-100 text-violet-900 border-violet-200" };
    }
    if (t.includes("microeconomics") || t.includes("macroeconomics") || t.includes("economics")) {
      return { bg: "bg-fuchsia-50", border: "border-fuchsia-300", badge: "bg-fuchsia-100 text-fuchsia-900 border-fuchsia-200" };
    }
    if (t.includes("business statistics") || t.includes("business mathematics")) {
      return { bg: "bg-sky-50", border: "border-sky-300", badge: "bg-sky-100 text-sky-900 border-sky-200" };
    }
    return { bg: "bg-slate-50", border: "border-slate-300", badge: "bg-slate-100 text-slate-800 border-slate-200" };
  };

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });

      const link = document.createElement("a");
      const minorStr = isBba11 && minor && minor !== "None" ? `_${minor}` : "";
      link.download = `AIBASync_${batch}_${majorOrSection}${minorStr}_Routine.png`;
      link.href = dataUrl;
      link.click();
      setIsDone(true);
      setTimeout(() => setIsDone(false), 3000);
    } catch (err) {
      console.error("Failed to export routine image:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col text-slate-900 dark:text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/50">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
              রুটিন কার্ড ইমেজ এক্সপোর্ট
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ফোনের লকস্ক্রিন ওয়ালপেপার অথবা সংরক্ষণের জন্য উচ্চ-রেজোলিউশন কার্ড
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Preview Area */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-gradient-to-br from-slate-100 via-sky-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center">
          {/* Card to be captured */}
          <div
            ref={cardRef}
            className="w-full max-w-md bg-gradient-to-br from-white via-sky-50 to-violet-50 border border-slate-200 rounded-[28px] p-5 shadow-[0_30px_80px_rgba(15,23,42,0.18)] font-sans text-slate-900"
            style={{ minWidth: "320px" }}
          >
            {/* Header of exported card */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-1.5 shrink-0">
                  <img
                    src="/logo.png"
                    alt="AIBA Sylhet"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="font-black text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
                    AIBA Sync
                    <span className="text-[10px] font-mono font-bold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded-full border border-sky-200">Sylhet</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono tracking-[0.08em] uppercase">
                    {INSTITUTION_INFO.term}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1.5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-[10px] font-mono font-bold shadow-sm">
                  {batch} • {majorOrSection}{isBba11 && minor && minor !== "None" ? ` + ${minor.replace("-M", "")}` : ""}
                </span>
              </div>
            </div>

            {/* Days Table */}
            <div className="space-y-2.5">
              {DAYS.map((day) => {
                const daySlots = batchSlots
                  .filter((s) => s.day === day)
                  .sort((a, b) => a.period - b.period);

                return (
                  <div
                    key={day}
                    className="p-3 rounded-2xl border border-slate-200 bg-white/85 shadow-inner shadow-slate-200/40"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[10px] font-black text-slate-700 uppercase tracking-[0.18em]">
                        {day}
                      </div>
                      <div className="text-[9px] font-bold text-slate-500">
                        {daySlots.length} class{daySlots.length === 1 ? "" : "es"}
                      </div>
                    </div>

                    {daySlots.length === 0 ? (
                      <div className="text-[11px] font-mono text-slate-400 italic rounded-xl bg-slate-50 border border-dashed border-slate-200 px-2 py-2">
                        No class
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {daySlots.map((slot) => {
                          const accent = getCourseAccent(slot.courseTitle, slot.majorOrSection);
                          const faculty = getFacultyInfo(slot.instructor);

                          return (
                            <div
                              key={slot.id}
                              className={`flex items-start justify-between gap-2 text-xs font-mono rounded-2xl border ${accent.border} ${accent.bg} px-2.5 py-2`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className={`px-1.5 py-0.5 rounded-md border text-[9px] font-black ${accent.badge}`}>
                                    P{slot.period}
                                  </span>
                                  <span className="text-slate-900 font-bold truncate">
                                    {slot.courseTitle}
                                  </span>
                                </div>
                                {slot.isMinor && (
                                  <div className="mt-1 text-[9px] font-bold text-violet-700">
                                    Minor / Elective
                                  </div>
                                )}
                              </div>

                              <div className="flex flex-col items-end text-[10px] shrink-0">
                                <span className="text-sky-800 font-black bg-white/80 px-1.5 py-0.5 rounded-lg border border-slate-200">
                                  R-{slot.room}
                                </span>
                                <span className="mt-1 text-violet-700 font-semibold max-w-[110px] text-right leading-tight">
                                  {faculty.fullName}
                                </span>
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

            {/* Footer Watermark */}
            <div className="mt-4 pt-3.5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] font-mono text-slate-500">
              <span>Sylhet Cantonment Road, Sylhet</span>
              <span className="text-slate-700 font-bold">
                AIBA Sync • Routine Card
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-bold text-xs tracking-wider uppercase shadow-md shadow-sky-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ইমেজ জেনারেট হচ্ছে...</span>
              </>
            ) : isDone ? (
              <>
                <Check className="w-4 h-4" />
                <span>ডাউনলোড সম্পন্ন হয়েছে!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>কার্ড ডাউনলোড করুন (PNG)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
