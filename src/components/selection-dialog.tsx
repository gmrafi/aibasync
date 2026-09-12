"use client";

import { useMemo, useState } from "react";
import { ClassSlot } from "@/lib/types";
import { savePreferences } from "@/lib/storage";
import { Check, Sparkles, User, X, Radar, ChevronRight } from "lucide-react";

interface SelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentName?: string;
  currentBatch: string;
  currentMajorOrSection: string;
  routineData: ClassSlot[];
  onSaved: (name: string, batch: string, majorOrSection: string) => void;
}

export function SelectionDialog({
  isOpen,
  onClose,
  currentName = "",
  currentBatch,
  currentMajorOrSection,
  routineData,
  onSaved,
}: SelectionDialogProps) {
  const [name, setName] = useState(currentName);

  // 1. Dynamic Unique Batches from routineData (Zero hardcoding)
  const safeData = routineData || [];
  const availableBatches = useMemo(() => {
    const set = new Set<string>();
    safeData.forEach((slot) => set.add(slot.batch));
    return Array.from(set).sort();
  }, [safeData]);

  const [selectedBatch, setSelectedBatch] = useState(
    currentBatch && availableBatches.includes(currentBatch)
      ? currentBatch
      : availableBatches[availableBatches.length - 2] || availableBatches[0] || "BBA-14"
  );

  // 2. Dynamic Majors/Sections for the selected batch
  const availableSubOptions = useMemo(() => {
    const set = new Set<string>();
    safeData
      .filter((slot) => slot.batch === selectedBatch)
      .forEach((slot) => {
        if (slot.majorOrSection) {
          set.add(slot.majorOrSection);
        }
      });
    return Array.from(set).sort();
  }, [safeData, selectedBatch]);

  // Is this batch major-based or section-based or single?
  const isMajorBased = selectedBatch === "BBA-11";
  const hasMultipleOptions = availableSubOptions.length > 1;

  const [selectedSub, setSelectedSub] = useState(
    currentMajorOrSection && availableSubOptions.includes(currentMajorOrSection)
      ? currentMajorOrSection
      : availableSubOptions[0] || "Alpha"
  );

  if (!isOpen) return null;

  const handleBatchSelect = (batchName: string) => {
    setSelectedBatch(batchName);
    const subOptions = Array.from(
      new Set(
        routineData
          .filter((s) => s.batch === batchName)
          .map((s) => s.majorOrSection)
      )
    ).sort();

    if (subOptions.length > 0 && !subOptions.includes(selectedSub)) {
      setSelectedSub(subOptions[0]);
    }
  };

  const handleSave = () => {
    const subToSave = hasMultipleOptions ? selectedSub : availableSubOptions[0] || "Core";
    savePreferences({
      studentName: name.trim(),
      batch: selectedBatch,
      majorOrSection: subToSave,
    });
    onSaved(name.trim(), selectedBatch, subToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-3xl bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950 border border-slate-700/60 p-6 sm:p-7 shadow-2xl shadow-cyan-950/50 relative text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Brand Title */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-inner">
            <Radar className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono font-bold tracking-wider text-cyan-400 uppercase">
                AIBA Radar Terminal
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              আপনার রাডার সেটআপ করুন
            </h2>
          </div>
        </div>

        {/* Field 1: Optional Student Name */}
        <div className="mb-5">
          <label className="text-xs font-mono font-medium text-slate-300 block mb-1.5">
            আপনার নাম (ঐচ্ছিক — পার্সোনালাইজড গ্রিটিংয়ের জন্য)
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mubasshir / Rafi"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-700/70 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Field 2: Dynamic Batch Selection */}
        <div className="mb-5">
          <label className="text-xs font-mono font-medium text-slate-300 block mb-2">
            ১. ব্যাচ নির্বাচন করুন (স্বয়ংক্রিয়ভাবে রুটিন ডেটা থেকে সংগৃহীত)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {availableBatches.map((b) => {
              const isSelected = selectedBatch === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => handleBatchSelect(b)}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all text-center flex flex-col items-center justify-center cursor-pointer ${
                    isSelected
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-md shadow-cyan-500/20 scale-[1.02]"
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/60"
                  }`}
                >
                  <span className="font-bold">{b}</span>
                  <span className="text-[10px] font-normal text-slate-400">
                    {b === "BBA-11" ? "মেজর ভিত্তিক" : "রেগুলার"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Field 3: Smart Conditional Major / Section Selection */}
        {hasMultipleOptions && (
          <div className="mb-6 animate-in fade-in slide-in-from-top-1 duration-200">
            <label className="text-xs font-mono font-medium text-slate-300 block mb-2">
              ২. {isMajorBased ? "মেজর (Major) নির্বাচন করুন" : "সেকশন (Section) নির্বাচন করুন"}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableSubOptions.map((sub) => {
                const isSelected = selectedSub === sub;
                return (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSub(sub)}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-violet-500/20 border-violet-400 text-violet-200 shadow-md shadow-violet-500/20 scale-[1.02]"
                        : "bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/60"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />}
                    <span>{sub}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>রাডার শুরু করুন</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        <p className="text-[11px] font-mono text-center text-slate-400 mt-3">
          কোনো পাসওয়ার্ড বা সাইনআপ নেই • আপনার ব্রাউজারে সংরক্ষিত থাকবে
        </p>
      </div>
    </div>
  );
}
