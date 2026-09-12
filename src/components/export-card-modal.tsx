"use client";

import { useRef, useState } from "react";
import { ClassSlot, DayOfWeek } from "@/lib/types";
import { INSTITUTION_INFO } from "@/data/routine";
import { minutesToTime12 } from "@/lib/time-utils";
import { Download, Check, Sparkles, X, Loader2, Radar } from "lucide-react";
import { toPng } from "html-to-image";

interface ExportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  routineData: ClassSlot[];
  batch: string;
  majorOrSection: string;
}

const DAYS: DayOfWeek[] = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];

export function ExportCardModal({
  isOpen,
  onClose,
  routineData,
  batch,
  majorOrSection,
}: ExportCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen) return null;

  const batchSlots = routineData.filter(
    (s) => s.batch === batch && s.majorOrSection === majorOrSection
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
      link.download = `AIBARadar_${batch}_${majorOrSection}_Routine.png`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl max-h-[90vh] bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950 border border-slate-700/60 rounded-3xl shadow-2xl shadow-cyan-950/40 flex flex-col text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              রুটিন কার্ড ইমেজ এক্সপোর্ট
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h3>
            <p className="text-xs text-slate-400">
              ফোনে সেভ করে ওয়ালপেপার দিন বা বন্ধুদের মেসেঞ্জারে পাঠান
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Preview Area */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-slate-950/40 flex items-center justify-center">
          {/* Card to be captured */}
          <div
            ref={cardRef}
            className="w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-700/80 rounded-3xl p-6 shadow-2xl font-sans text-slate-100"
            style={{ minWidth: "320px" }}
          >
            {/* Header of exported card */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center text-white shadow-md">
                  <Radar className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                    AIBA Radar
                    <span className="text-[10px] font-mono text-cyan-400">Sylhet</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {INSTITUTION_INFO.term}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="px-2.5 py-1 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300">
                  {batch} • {majorOrSection}
                </span>
              </div>
            </div>

            {/* Days Table */}
            <div className="space-y-3">
              {DAYS.map((day) => {
                const daySlots = batchSlots
                  .filter((s) => s.day === day)
                  .sort((a, b) => a.period - b.period);

                return (
                  <div
                    key={day}
                    className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800/80"
                  >
                    <div className="text-xs font-mono font-bold text-cyan-300 mb-1.5 uppercase tracking-wide">
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
                            className="flex items-center justify-between text-xs font-mono bg-slate-950/70 px-3 py-1.5 rounded-xl border border-slate-800/60"
                          >
                            <div className="truncate mr-2">
                              <span className="text-white font-medium">
                                {slot.courseTitle}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 text-[11px]">
                              <span className="text-cyan-400 font-bold bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                R-{slot.room}
                              </span>
                              <span className="text-violet-400 font-mono">
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
            <div className="mt-4 pt-3.5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] font-mono text-slate-400">
              <span>Sylhet Cantonment Road, Sylhet</span>
              <span className="text-slate-300 font-medium">
                Designed & Developed by Md. Golam Mubasshir Rafi
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ইমেজ জেনারেট হচ্ছে...</span>
              </>
            ) : isDone ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
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
