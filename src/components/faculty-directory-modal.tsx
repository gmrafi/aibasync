"use client";

import { useMemo, useState } from "react";
import { Search, UserRound, X, Building2 } from "lucide-react";
import { FACULTY_LIST } from "@/data/faculty";
import { FacultyMember } from "@/lib/types";

interface FacultyDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFaculty: (faculty: FacultyMember) => void;
}

export function FacultyDirectoryModal({
  isOpen,
  onClose,
  onSelectFaculty,
}: FacultyDirectoryModalProps) {
  const [query, setQuery] = useState("");

  const filteredFaculty = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return FACULTY_LIST;

    return FACULTY_LIST.filter((faculty) => {
      const haystack = [faculty.fullName, faculty.designation, faculty.institution]
        .join(" ")
        .toLowerCase();

      return haystack.includes(text);
    });
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/65 dark:bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[88vh] overflow-hidden rounded-[28px] border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl text-slate-900 dark:text-slate-100"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 px-4 py-4 sm:px-5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300">
              <UserRound className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-black tracking-tight sm:text-lg">
                ফ্যাকাল্টি ডিরেক্টরি
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:text-white"
            aria-label="Close faculty directory"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-slate-200/80 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-950/30 sm:p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="নাম বা পদবি লিখুন..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-sky-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="max-h-[calc(88vh-146px)] overflow-y-auto p-3 sm:p-4">
          {filteredFaculty.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center text-sm font-medium text-slate-500 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-400">
              কোনো ফ্যাকাল্টি মিলে নি। অন্য কীওয়ার্ড চেষ্টা করুন।
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredFaculty.map((faculty) => (
                <button
                  key={faculty.code}
                  type="button"
                  onClick={() => {
                    onSelectFaculty(faculty);
                    onClose();
                  }}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-3 text-left transition hover:border-sky-300 hover:bg-sky-50 dark:border-slate-800 dark:bg-slate-950/40 dark:hover:border-sky-500/40 dark:hover:bg-sky-500/5"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {faculty.fullName}
                    </div>
                    <div className="mt-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      <span className="rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300">
                        {faculty.designation}
                      </span>
                    </div>
                    {faculty.institution && (
                      <div className="mt-2 flex items-start gap-1.5 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        <Building2 className="mt-0.5 h-3 w-3 shrink-0" />
                        <span>{faculty.institution}</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
