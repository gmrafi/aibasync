"use client";

import { useState } from "react";
import { BATCH_LIST } from "@/data/routine";
import { savePreferences } from "@/lib/storage";
import { Check, GraduationCap, Sparkles, X } from "lucide-react";

interface SelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentBatch: string;
  currentMajorOrSection: string;
  onSaved: (batch: string, majorOrSection: string) => void;
}

export function SelectionDialog({
  isOpen,
  onClose,
  currentBatch,
  currentMajorOrSection,
  onSaved,
}: SelectionDialogProps) {
  const [selectedBatch, setSelectedBatch] = useState(currentBatch || "BBA-14");
  const batchInfo = BATCH_LIST.find((b) => b.batch === selectedBatch) || BATCH_LIST[3];
  const [selectedSub, setSelectedSub] = useState(
    currentMajorOrSection || batchInfo.sectionsOrMajors[0]
  );

  if (!isOpen) return null;

  const handleBatchSelect = (batchName: string) => {
    setSelectedBatch(batchName);
    const newBatchInfo = BATCH_LIST.find((b) => b.batch === batchName);
    if (newBatchInfo && !newBatchInfo.sectionsOrMajors.includes(selectedSub)) {
      setSelectedSub(newBatchInfo.sectionsOrMajors[0]);
    }
  };

  const handleSave = () => {
    savePreferences({ batch: selectedBatch, majorOrSection: selectedSub });
    onSaved(selectedBatch, selectedSub);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl relative text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              ব্যাচ ও সেকশন নির্বাচন
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </h2>
            <p className="text-xs text-zinc-400">
              একবার নির্বাচন করলে পরবর্তীতে সরাসরি আপনার রুটিন লোড হবে
            </p>
          </div>
        </div>

        {/* Step 1: Batch Selection */}
        <div className="mb-5">
          <label className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider block mb-2">
            ১. আপনার ব্যাচ সিলেক্ট করুন
          </label>
          <div className="grid grid-cols-3 gap-2">
            {BATCH_LIST.map((b) => {
              const isSelected = selectedBatch === b.batch;
              return (
                <button
                  key={b.batch}
                  type="button"
                  onClick={() => handleBatchSelect(b.batch)}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                    isSelected
                      ? "bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-500/20"
                      : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:bg-zinc-900"
                  }`}
                >
                  <span>{b.batch}</span>
                  <span className="text-[10px] font-normal text-zinc-500">
                    {b.isMajorBased ? "মেজর ভিত্তিক" : "সেকশন ভিত্তিক"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Major or Section Selection */}
        <div className="mb-6">
          <label className="text-xs font-mono font-medium text-zinc-400 uppercase tracking-wider block mb-2">
            ২. {batchInfo.isMajorBased ? "মেজর (Major)" : "সেকশন (Section)"} সিলেক্ট করুন
          </label>
          <div className="grid grid-cols-3 gap-2">
            {batchInfo.sectionsOrMajors.map((sub) => {
              const isSelected = selectedSub === sub;
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => setSelectedSub(sub)}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                    isSelected
                      ? "bg-violet-500/15 border-violet-500 text-violet-300 shadow-sm shadow-violet-500/20"
                      : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:bg-zinc-900"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-violet-400" />}
                  <span>{sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-zinc-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>রুটিন নিশ্চিত করুন ({selectedBatch} • {selectedSub})</span>
        </button>
      </div>
    </div>
  );
}
