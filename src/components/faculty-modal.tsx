"use client";

import { FacultyMember } from "@/lib/types";
import { ExternalLink, GraduationCap, MapPin, User, X } from "lucide-react";

interface FacultyModalProps {
  faculty: FacultyMember | null;
  onClose: () => void;
}

export function FacultyModal({ faculty, onClose }: FacultyModalProps) {
  if (!faculty) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-2xl text-slate-900 dark:text-white relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-500/15 border border-sky-200 dark:border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-sky-100 dark:bg-sky-500/20 text-sky-800 dark:text-sky-200 border border-sky-300 dark:border-sky-500/30">
                {faculty.code}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1 leading-snug">
              {faculty.fullName}
            </h3>
            <p className="text-xs text-sky-600 dark:text-sky-400 font-semibold mt-0.5">
              {faculty.designation}
            </p>
          </div>
        </div>

        <div className="space-y-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
            <GraduationCap className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
            <div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">বিভাগ / প্রতিষ্ঠান</div>
              <div className="text-slate-800 dark:text-slate-200 font-bold">{faculty.department}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800">
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">ফ্যাকাল্টি রুম</div>
              <div className="text-emerald-700 dark:text-emerald-300 font-bold">{faculty.roomNumber}</div>
            </div>
          </div>
        </div>

        {faculty.profileUrl && (
          <a
            href={faculty.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3.5 w-full py-2.5 px-3 rounded-xl bg-sky-50 dark:bg-sky-500/15 hover:bg-sky-100 dark:hover:bg-sky-500/25 border border-sky-200 dark:border-sky-500/30 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>অফিশিয়াল প্রোফাইল দেখুন</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
        >
          ঠিক আছে
        </button>
      </div>
    </div>
  );
}
