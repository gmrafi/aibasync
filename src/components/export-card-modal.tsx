"use client";

import { useRef, useState } from "react";
import { ClassSlot, DayOfWeek } from "@/lib/types";
import { INSTITUTION_INFO } from "@/data/routine";
import { minutesToTime12, isSlotMatchingStudent, isSlotMinor } from "@/lib/time-utils";
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
        <div className="p-4 sm:p-6 overflow-y-auto bg-slate-100/60 dark:bg-slate-950/40 flex items-center justify-center">
          {/* Card to be captured */}
          <div
            ref={cardRef}
            className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl font-sans text-slate-900"
            style={{ minWidth: "320px" }}
          >
            {/* Header of exported card */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-3.5 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-700 flex items-center justify-center text-white shadow-sm font-mono font-bold text-xs">
                  AS
                </div>
                <div>
                  <div className="font-bold text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
                    AIBA Sync
                    <span className="text-[10px] font-mono font-semibold text-sky-700">Sylhet</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    {INSTITUTION_INFO.term}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded-xl bg-sky-50 border border-sky-200 text-xs font-mono font-bold text-sky-800">
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
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80"
                  >
                    <div className="text-xs font-mono font-bold text-sky-800 mb-1.5 uppercase tracking-wide">
                      {day}
                    </div>

                    {daySlots.length === 0 ? (
                      <div className="text-[11px] font-mono text-slate-400 italic">
                        নো ক্লাস
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {daySlots.map((slot) => (
                          <div
                            key={slot.id}
                            className="flex items-center justify-between text-xs font-mono bg-white px-3 py-1.5 rounded-xl border border-slate-200"
                          >
                            <div className="truncate mr-2">
                              <span className="text-slate-900 font-medium">
                                {slot.courseTitle}
                              </span>
                              {(isSlotMinor(slot, batch, minor) || slot.isMinor) && (
                                <span className="ml-1 text-[9px] text-indigo-700 font-bold">
                                  [{minor && minor !== "None" ? minor : "Minor"}]
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 text-[11px]">
                              <span className="text-sky-800 font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                R-{slot.room}
                              </span>
                              <span className="text-violet-700 font-semibold font-mono">
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

            {/* Footer Watermark */}
            <div className="mt-4 pt-3.5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] font-mono text-slate-500">
              <span>Sylhet Cantonment Road, Sylhet</span>
              <span className="text-slate-700 font-medium">
                Designed & Developed by Md. Golam Mubasshir Rafi
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
