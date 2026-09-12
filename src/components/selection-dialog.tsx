"use client";

import { useMemo, useState } from "react";
import { ClassSlot } from "@/lib/types";
import { BBA11_MAJORS, BBA11_MINORS } from "@/data/routine";
import { savePreferences } from "@/lib/storage";
import { Check, ChevronRight, GraduationCap, User, X, BookOpen, Layers } from "lucide-react";

interface SelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentName?: string;
  currentBatch: string;
  currentMajorOrSection: string;
  currentMinor?: string;
  routineData: ClassSlot[];
  onSaved: (name: string, batch: string, majorOrSection: string, minor: string) => void;
}

export function SelectionDialog({
  isOpen,
  onClose,
  currentName = "",
  currentBatch,
  currentMajorOrSection,
  currentMinor = "None",
  routineData,
  onSaved,
}: SelectionDialogProps) {
  const [name, setName] = useState(currentName);

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

  const isBba11 = selectedBatch === "BBA-11";

  // Dynamic sections for junior batches
  const availableSections = useMemo(() => {
    if (isBba11) return [];
    const set = new Set<string>();
    safeData
      .filter((slot) => slot.batch === selectedBatch)
      .forEach((slot) => {
        if (slot.majorOrSection) {
          set.add(slot.majorOrSection);
        }
      });
    return Array.from(set).sort();
  }, [safeData, selectedBatch, isBba11]);

  // Major state for BBA-11
  const [selectedMajor, setSelectedMajor] = useState(
    isBba11 && currentMajorOrSection && BBA11_MAJORS.some((m) => m.code === currentMajorOrSection)
      ? currentMajorOrSection
      : "FIN"
  );

  // Minor state for BBA-11
  const normalizedInitialMinor =
    currentMinor?.replace("-M", "") || "MIS";

  const [selectedMinor, setSelectedMinor] = useState(
    isBba11 && currentMinor && (currentMinor === "None" || BBA11_MINORS.some((m) => m.code === normalizedInitialMinor))
      ? normalizedInitialMinor
      : "MIS"
  );

  // Section state for non-BBA-11
  const [selectedSection, setSelectedSection] = useState(
    !isBba11 && currentMajorOrSection && availableSections.includes(currentMajorOrSection)
      ? currentMajorOrSection
      : availableSections[0] || "Alpha"
  );

  if (!isOpen) return null;

  const handleBatchSelect = (batchName: string) => {
    setSelectedBatch(batchName);
    if (batchName === "BBA-11") {
      setSelectedMajor("FIN");
      setSelectedMinor("MIS");
    } else {
      const sections = Array.from(
        new Set(
          safeData
            .filter((s) => s.batch === batchName)
            .map((s) => s.majorOrSection)
        )
      ).sort();
      if (sections.length > 0) {
        setSelectedSection(sections[0]);
      }
    }
  };

  const handleMajorSelect = (majorCode: string) => {
    setSelectedMajor(majorCode);
    // If current minor matches new major, automatically switch minor to another discipline
    if (selectedMinor === majorCode) {
      const nextAvailableMinor = BBA11_MINORS.find((m) => m.code !== majorCode)?.code || "None";
      setSelectedMinor(nextAvailableMinor);
    }
  };

  const handleSave = () => {
    const finalMajorOrSection = isBba11 ? selectedMajor : selectedSection;
    const finalMinor = isBba11 ? selectedMinor : "None";

    savePreferences({
      studentName: name.trim(),
      batch: selectedBatch,
      majorOrSection: finalMajorOrSection,
      minor: finalMinor,
    });
    onSaved(name.trim(), selectedBatch, finalMajorOrSection, finalMinor);
    onClose();
  };

  const selectedMajorObj = BBA11_MAJORS.find((m) => m.code === selectedMajor);
  const selectedMinorObj = BBA11_MINORS.find((m) => m.code === selectedMinor);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="w-full max-w-xl max-h-[92vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-slate-900 dark:text-slate-100 relative my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-3.5 shrink-0">
          <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-500/15 border border-sky-200 dark:border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
              AIBA Sync • একাডেমিক প্রোফাইল
            </span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              ব্যাচ ও পাঠ্যক্রম নির্বাচন
            </h2>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Field 1: Student Name */}
          <div>
            <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
              শিক্ষার্থীর নাম (ঐচ্ছিক — ব্যক্তিগত গ্রিটিংয়ের জন্য)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="যেমন: Mubasshir / Rafi"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-colors"
              />
            </div>
          </div>

          {/* Field 2: Batch Selection */}
          <div>
            <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 block mb-2">
              ১. ব্যাচ নির্বাচন করুন
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {availableBatches.map((b) => {
                const isSelected = selectedBatch === b;
                return (
                  <button
                    key={b}
                    type="button"
                    onClick={() => handleBatchSelect(b)}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? "bg-sky-50 dark:bg-sky-500/20 border-sky-500 text-sky-700 dark:text-sky-200 shadow-xs font-bold"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="text-xs font-mono">{b}</div>
                    <div className="text-[9px] text-slate-400 dark:text-slate-500 truncate">
                      {b === "BBA-11" ? "Senior" : "Regular"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Field 3: If BBA-11 -> Show Major & Minor Options */}
          {isBba11 ? (
            <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 animate-in fade-in">
              {/* Major Selection */}
              <div>
                <label className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 block mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span>২. মেজর নির্বাচন (Major Discipline)</span>
                  </span>
                  <span className="text-[10px] text-sky-600 dark:text-sky-400 font-mono font-normal">
                    মূল পাঠ্যক্রম
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {BBA11_MAJORS.map((m) => {
                    const isSelected = selectedMajor === m.code;
                    return (
                      <button
                        key={m.code}
                        type="button"
                        onClick={() => handleMajorSelect(m.code)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start justify-between ${
                          isSelected
                            ? "bg-sky-50 dark:bg-sky-500/25 border-sky-500 text-sky-950 dark:text-sky-100 shadow-xs font-semibold"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">{m.name}</div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {m.fullName}
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Minor Selection */}
              <div>
                <label className="text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 block mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span>৩. মাইনর কোর্স নির্বাচন (Minor Course)</span>
                  </span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono font-normal">
                    সাপ্তাহিক ২ পিরিয়ড
                  </span>
                </label>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                  প্রতিটি মেজরের সাথে নির্ধারিত মাইনর কোর্সটি সিলেক্ট করুন:
                </p>

                <div className="space-y-1.5">
                  {BBA11_MINORS.map((m) => {
                    const isSelected = selectedMinor === m.code;
                    const isOwnMajor = selectedMajor === m.code;

                    return (
                      <button
                        key={m.code}
                        type="button"
                        disabled={isOwnMajor}
                        onClick={() => setSelectedMinor(m.code)}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between gap-2 ${
                          isOwnMajor
                            ? "opacity-40 bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed"
                            : isSelected
                            ? "bg-indigo-50 dark:bg-indigo-500/25 border-indigo-500 text-indigo-950 dark:text-indigo-100 shadow-xs cursor-pointer font-medium"
                            : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="px-1.5 py-0.5 rounded-md font-mono text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                              {m.code}
                            </span>
                            <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                              {m.courseTitle}
                            </span>
                            {isOwnMajor && (
                              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-normal">
                                (আপনার মেজর)
                              </span>
                            )}
                          </div>
                          {m.shortDescription && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono truncate">
                              {m.shortDescription}
                            </p>
                          )}
                        </div>

                        {isSelected && !isOwnMajor && (
                          <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </button>
                    );
                  })}

                  {/* None Option */}
                  <button
                    type="button"
                    onClick={() => setSelectedMinor("None")}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      selectedMinor === "None"
                        ? "bg-indigo-50 dark:bg-indigo-500/25 border-indigo-500 text-indigo-950 dark:text-indigo-100 font-medium"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span className="text-xs">কোনো মাইনর নেই (শুধুমাত্র মেজরের কোর্সসমূহ)</span>
                    {selectedMinor === "None" && (
                      <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Live Combination Preview Badge */}
              <div className="p-2.5 rounded-xl bg-sky-100/60 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 text-[11px] text-sky-900 dark:text-sky-200 flex items-center gap-2">
                <span className="font-bold">সারাংশ:</span>
                <span className="font-mono">{selectedBatch}</span>
                <span>•</span>
                <span>{selectedMajorObj?.name || selectedMajor}</span>
                {selectedMinor !== "None" && selectedMinorObj && (
                  <>
                    <span>+</span>
                    <span className="font-medium">{selectedMinorObj.code} ({selectedMinorObj.courseTitle})</span>
                  </>
                )}
              </div>
            </div>
          ) : (
          /* Field 3 Alternative: Non-BBA-11 Section selection */
          <div className="mb-6 animate-in fade-in">
            <label className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300 block mb-2">
              ২. সেকশন নির্বাচন
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableSections.map((sec) => {
                const isSelected = selectedSection === sec;
                return (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSelectedSection(sec)}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-sky-50 dark:bg-sky-500/20 border-sky-500 text-sky-700 dark:text-sky-200 shadow-sm"
                        : "bg-slate-50/70 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0" />}
                    <span>{sec}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        </div>

        {/* Modal Sticky Footer */}
        <div className="p-5 sm:p-6 pt-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-950/40 shrink-0">
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-sky-600/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>রুটিন দেখুন</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] font-mono text-center text-slate-500 dark:text-slate-400 mt-2.5">
            পাসওয়ার্ড বা রেজিস্ট্রেশনের প্রয়োজন নেই • ব্রাউজারে সংরক্ষিত থাকবে
          </p>
        </div>
      </div>
    </div>
  );
}
