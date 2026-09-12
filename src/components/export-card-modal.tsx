"use client";

import { useRef, useState } from "react";
import { ClassSlot, DayOfWeek } from "@/lib/types";
import { INSTITUTION_INFO } from "@/data/routine";
import { minutesToTime12 } from "@/lib/time-utils";
import { Download, Check, Sparkles, X, Loader2 } from "lucide-react";
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
        pixelRatio: 2, // High DPI for wallpaper/retina
        cacheBust: true,
      });

      const link = document.createElement("a");
      link.download = `CLASSR_${batch}_${majorOrSection}_Routine.png`;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col text-zinc-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              রুটিন কার্ড ইমেজ এক্সপোর্ট
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h3>
            <p className="text-xs text-zinc-400">
              ফোনে সেভ করে ওয়ালপেপার দিন বা বন্ধুদের মেসেঞ্জারে পাঠান
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Preview Area */}
        <div className="p-4 sm:p-6 overflow-y-auto bg-zinc-900/20 flex items-center justify-center">
          {/* Card to be captured */}
          <div
            ref={cardRef}
            className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-5 shadow-2xl font-sans text-zinc-100"
            style={{ minWidth: "320px" }}
          >
            {/* Header of exported card */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3 mb-4">
              <div>
                <div className="flex items-center gap-1.5 font-mono font-black text-sm tracking-wider text-cyan-400">
                  CLASSR // AIBA SYLHET
                </div>
                <div className="text-[11px] text-zinc-400 font-mono">
                  {INSTITUTION_INFO.term}
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-xs font-mono font-bold text-cyan-300">
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
                    className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800/80"
                  >
                    <div className="text-xs font-mono font-bold text-cyan-300 mb-1.5 uppercase tracking-wide">
                      {day}
                    </div>

                    {daySlots.length === 0 ? (
                      <div className="text-[11px] font-mono text-zinc-500 italic">
                        নো ক্লাস
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {daySlots.map((slot) => (
                          <div
                            key={slot.id}
                            className="flex items-center justify-between text-xs font-mono bg-zinc-950/60 px-2.5 py-1.5 rounded-lg border border-zinc-800/50"
                          >
                            <div className="truncate mr-2">
                              <span className="text-white font-medium">
                                {slot.courseTitle}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 text-[11px]">
                              <span className="text-cyan-400 font-bold bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
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
            <div className="mt-4 pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] font-mono text-zinc-500">
              <span>Sylhet Cantonment Road, Sylhet</span>
              <span className="text-zinc-400">Designed & Developed by Md. Golam Mubasshir Rafi</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-zinc-950 font-bold text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>ইমেজ জেনারেট হচ্ছে...</span>
              </>
            ) : isDone ? (
              <>
                <Check className="w-4 h-4 text-zinc-950" />
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
