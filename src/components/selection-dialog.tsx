"use client";

import { useMemo, useState } from "react";
import { ClassSlot, UserRole } from "@/lib/types";
import { BBA11_MAJORS, BBA11_MINORS } from "@/data/routine";
import { FACULTY_LIST } from "@/data/faculty";
import { savePreferences } from "@/lib/storage";
import { Check, ChevronRight, GraduationCap, User, X, BookOpen, Layers, AlertCircle, Info } from "lucide-react";

interface SelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole?: UserRole;
  currentName?: string;
  currentTeacherCode?: string;
  currentBatch: string;
  currentMajorOrSection: string;
  currentMinor?: string;
  routineData: ClassSlot[];
  onSaved: (
    name: string,
    batch: string,
    majorOrSection: string,
    minor: string,
    role?: UserRole,
    teacherCode?: string
  ) => void;
}

export function SelectionDialog({
  isOpen,
  onClose,
  currentRole = "student",
  currentName = "",
  currentTeacherCode = "",
  currentBatch,
  currentMajorOrSection,
  currentMinor = "None",
  routineData,
  onSaved,
}: SelectionDialogProps) {
  const [role, setRole] = useState<UserRole>(currentRole);
  const [teacherCode, setTeacherCode] = useState(currentTeacherCode);
  const [name, setName] = useState(currentName);
  const [teacherError, setTeacherError] = useState(false);
  const [bba11Error, setBba11Error] = useState<string>("");

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

  // Major state for BBA-11: DO NOT pre-select default
  const [selectedMajor, setSelectedMajor] = useState<string>(
    isBba11 && currentMajorOrSection && BBA11_MAJORS.some((m) => m.code === currentMajorOrSection)
      ? currentMajorOrSection
      : ""
  );

  // Minor state for BBA-11: DO NOT pre-select default
  const normalizedInitialMinor = currentMinor?.replace("-M", "");
  const [selectedMinor, setSelectedMinor] = useState<string>(
    isBba11 && currentMinor && (currentMinor === "None" || BBA11_MINORS.some((m) => m.code === normalizedInitialMinor))
      ? normalizedInitialMinor
      : ""
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
    setBba11Error("");
    if (batchName === "BBA-11") {
      setSelectedMajor("");
      setSelectedMinor("");
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
    setBba11Error("");
    // If current minor matches new major, clear minor
    if (selectedMinor === majorCode) {
      setSelectedMinor("");
    }
  };

  const selectedMajorObj = BBA11_MAJORS.find((m) => m.code === selectedMajor);
  const selectedMinorObj = BBA11_MINORS.find((m) => m.code === selectedMinor);

  const handleSave = () => {
    if (role === "teacher") {
      if (!teacherCode) {
        setTeacherError(true);
        return;
      }
      setTeacherError(false);
      const faculty = FACULTY_LIST.find((f) => f.code === teacherCode);
      const displayName = name.trim() || faculty?.fullName || teacherCode;
      savePreferences({
        role: "teacher",
        studentName: displayName,
        teacherCode,
        batch: "MY_CLASSES",
        majorOrSection: "",
        minor: "None",
      });
      onSaved(displayName, "MY_CLASSES", "", "None", "teacher", teacherCode);
      onClose();
      return;
    }

    // Student validation: If BBA-11, both Major and Minor must be explicitly chosen
    if (isBba11) {
      if (!selectedMajor) {
        setBba11Error("অনুগ্রহ করে আপনার মেজর বিষয় নির্বাচন করুন");
        return;
      }
      if (!selectedMinor) {
        setBba11Error("অনুগ্রহ করে আপনার মাইনর কোর্স নির্বাচন করুন");
        return;
      }
    }
    setBba11Error("");

    const finalMajorOrSection = isBba11 ? selectedMajor : selectedSection;
    const finalMinor = isBba11 ? (selectedMinor === "None" ? "None" : `${selectedMinor}-M`) : "None";
    const studentDisplayName = name.trim();

    savePreferences({
      role: "student",
      studentName: studentDisplayName,
      teacherCode: undefined,
      batch: selectedBatch,
      majorOrSection: finalMajorOrSection,
      minor: finalMinor,
    });
    onSaved(studentDisplayName, selectedBatch, finalMajorOrSection, finalMinor, "student");
    onClose();
  };

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

        {/* Modal Header with Official University Logo */}
        <div className="p-5 sm:p-6 pb-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center gap-3.5 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center p-1 shrink-0 shadow-xs">
            <img
              src="/logo.png"
              alt="AIBA Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-xs font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
              AIBA Sync • একাডেমিক প্রোফাইল
            </span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              {role === "teacher" ? "শিক্ষক প্রোফাইল নির্বাচন" : "ব্যাচ ও পাঠ্যক্রম নির্বাচন"}
            </h2>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {/* Role Selection Switcher: Student First, Teacher Second */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
              একাডেমিক প্রোফাইলের ধরন
            </label>
            <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setRole("student");
                  if (selectedBatch === "MY_CLASSES" || selectedBatch === "ALL_BATCHES") {
                    setSelectedBatch("BBA-14");
                  }
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  role === "student"
                    ? "bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>শিক্ষার্থী</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setRole("teacher");
                  if (!teacherCode && FACULTY_LIST.length > 0) {
                    setTeacherCode(FACULTY_LIST[0].code);
                    setName(FACULTY_LIST[0].fullName);
                    setTeacherError(false);
                  }
                  setSelectedBatch("MY_CLASSES");
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  role === "teacher"
                    ? "bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <User className="w-4 h-4" />
                <span>শিক্ষক / ফ্যাকাল্টি</span>
              </button>
            </div>
          </div>

          {role === "teacher" ? (
            /* TEACHER CONTROLS */
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5 flex items-center justify-between">
                  <span>শিক্ষকদের তালিকা থেকে আপনার প্রোফাইল নির্বাচন করুন</span>
                  {teacherError && (
                    <span className="text-rose-600 dark:text-rose-400 text-xs font-semibold animate-pulse">
                      অনুগ্রহ করে শিক্ষক নির্বাচন করুন
                    </span>
                  )}
                </label>
                <select
                  value={teacherCode}
                  onChange={(e) => {
                    const code = e.target.value;
                    setTeacherCode(code);
                    const faculty = FACULTY_LIST.find((f) => f.code === code);
                    if (faculty) {
                      setName(faculty.fullName);
                      setTeacherError(false);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="">-- শিক্ষক নির্বাচন করুন --</option>
                  {FACULTY_LIST.map((f) => (
                    <option key={f.code} value={f.code}>
                      {f.fullName} ({f.code}) | {f.designation}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                  প্রদর্শিত নাম ও পদবি (প্রয়োজনে সম্পাদনা করতে পারেন)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: Chinmoy Das Gupta"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  প্রাথমিক রুটিন প্রদর্শন মোড
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setSelectedBatch("MY_CLASSES")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedBatch === "MY_CLASSES"
                        ? "bg-sky-50 dark:bg-sky-500/20 border-sky-500 text-sky-800 dark:text-sky-200 shadow-xs font-bold"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>আমার ক্লাস সূচি</span>
                      {selectedBatch === "MY_CLASSES" && <Check className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">সবগুলো ব্যাচে নিজের ক্লাস</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedBatch("ALL_BATCHES")}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedBatch === "ALL_BATCHES"
                        ? "bg-sky-50 dark:bg-sky-500/20 border-sky-500 text-sky-800 dark:text-sky-200 shadow-xs font-bold"
                        : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>মাস্টার রুটিন</span>
                      {selectedBatch === "ALL_BATCHES" && <Check className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">বিশ্ববিদ্যালয়ের সকল ব্যাচ</div>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* STUDENT CONTROLS */
            <>
              {/* Field 1: Student Full Name (Optional - Never blocks) */}
              <div>
                <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5 flex items-center justify-between">
                  <span>শিক্ষার্থীর নাম</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: Md. Golam Mubasshir Rafi"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 transition-all"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  নাম খালি রাখলেও সরাসরি রুটিনে প্রবেশ করা যাবে।
                </p>
              </div>

              {/* Field 2: Batch Selection */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
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
                        <div className="text-xs font-mono font-bold">{b}</div>
                        <div className="text-[9px] text-slate-500 dark:text-slate-400 truncate">
                          {b === "BBA-11" ? "Senior" : "Regular"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Field 3: If BBA-11 -> Show Major & Minor in Sequence */}
              {isBba11 ? (
                <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 animate-in fade-in">
                  {/* Major Selection */}
                  <div>
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                        <span>২. মেজর নির্বাচন করুন (Major Discipline)</span>
                      </span>
                      {!selectedMajor ? (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold animate-pulse">
                          * নির্বাচন আবশ্যক
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                          <Check className="w-3 h-3" />
                          <span>নির্বাচিত: {selectedMajor}</span>
                        </span>
                      )}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {BBA11_MAJORS.map((m) => {
                        const isSelected = selectedMajor === m.code;
                        return (
                          <button
                            key={m.code}
                            type="button"
                            onClick={() => handleMajorSelect(m.code)}
                            className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex items-start justify-between ${
                              isSelected
                                ? "bg-sky-50 dark:bg-sky-500/25 border-sky-500 text-sky-950 dark:text-sky-100 shadow-xs font-semibold"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-300 dark:hover:border-sky-700"
                            }`}
                          >
                            <div>
                              <div className="text-xs font-black">{m.name}</div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                                {m.fullName}
                              </div>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Minor Selection: Immediately revealed when Major is selected */}
                  {selectedMajor ? (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                          <span>৩. মাইনর কোর্স নির্বাচন করুন (Minor Course)</span>
                        </span>
                        {!selectedMinor ? (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold animate-pulse">
                            * নির্বাচন আবশ্যক
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                            <Check className="w-3 h-3" />
                            <span>নির্বাচিত</span>
                          </span>
                        )}
                      </label>
                      <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-2">
                        আপনার মেজরের সাথে নির্ধারিত মাইনরটি সিলেক্ট করুন:
                      </p>

                      <div className="space-y-2">
                        {BBA11_MINORS.map((m) => {
                          const isSelected = selectedMinor === m.code;
                          const isOwnMajor = selectedMajor === m.code;

                          return (
                            <button
                              key={m.code}
                              type="button"
                              disabled={isOwnMajor}
                              onClick={() => {
                                setSelectedMinor(m.code);
                                setBba11Error("");
                              }}
                              className={`w-full p-2.5 rounded-xl border-2 text-left transition-all flex items-center justify-between gap-2 ${
                                isOwnMajor
                                  ? "opacity-40 bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400 cursor-not-allowed"
                                  : isSelected
                                  ? "bg-indigo-50 dark:bg-indigo-500/25 border-indigo-500 text-indigo-950 dark:text-indigo-100 shadow-xs cursor-pointer font-bold"
                                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-300 dark:hover:border-indigo-700 cursor-pointer"
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="px-1.5 py-0.5 rounded-md text-[10px] font-black bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                                    {m.code}
                                  </span>
                                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                    {m.courseTitle}
                                  </span>
                                  {isOwnMajor && (
                                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                                      (আপনার মেজর)
                                    </span>
                                  )}
                                </div>
                                {m.shortDescription && (
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate">
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
                          onClick={() => {
                            setSelectedMinor("None");
                            setBba11Error("");
                          }}
                          className={`w-full p-2.5 rounded-xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                            selectedMinor === "None"
                              ? "bg-indigo-50 dark:bg-indigo-500/25 border-indigo-500 text-indigo-950 dark:text-indigo-100 font-bold"
                              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-300 dark:hover:border-indigo-700"
                          }`}
                        >
                          <span className="text-xs font-semibold">কোনো মাইনর নেই (শুধুমাত্র মেজরের কোর্সসমূহ)</span>
                          {selectedMinor === "None" && (
                            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-[11px] font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                      <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>প্রথমে উপরে আপনার মেজর নির্বাচন করুন, এরপর মাইনর অপশনগুলো উন্মুক্ত হবে।</span>
                    </div>
                  )}

                  {/* Validation Error Notice if any */}
                  {bba11Error && (
                    <div className="text-xs font-bold text-rose-600 dark:text-rose-400 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 flex items-center gap-2 animate-pulse">
                      <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                      <span>{bba11Error}</span>
                    </div>
                  )}

                  {/* Live Combination Preview Badge */}
                  {selectedMajor && selectedMinor && (
                    <div className="p-2.5 rounded-xl bg-sky-100/60 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 text-[11px] text-sky-900 dark:text-sky-200 flex items-center gap-2">
                      <span className="font-bold">সারাংশ:</span>
                      <span className="font-bold">{selectedBatch}</span>
                      <span>•</span>
                      <span className="font-bold">{selectedMajorObj?.name || selectedMajor}</span>
                      {selectedMinor !== "None" && selectedMinorObj && (
                        <>
                          <span>+</span>
                          <span className="font-semibold">{selectedMinorObj.code} ({selectedMinorObj.courseTitle})</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* Field 3 Alternative: Non-BBA-11 Section selection */
                <div className="mb-6 animate-in fade-in">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
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
            </>
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

          <p className="text-xs font-semibold text-center text-slate-600 dark:text-slate-300 mt-2.5">
            পাসওয়ার্ড বা রেজিস্ট্রেশনের প্রয়োজন নেই • ডিভাইসে সংরক্ষিত থাকবে
          </p>
        </div>
      </div>
    </div>
  );
}
