"use client";

import { FacultyMember } from "@/lib/types";
import { Building, GraduationCap, MapPin, User, X } from "lucide-react";

interface FacultyModalProps {
  faculty: FacultyMember | null;
  onClose: () => void;
}

export function FacultyModal({ faculty, onClose }: FacultyModalProps) {
  if (!faculty) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-cyan-500/30 p-5 shadow-2xl shadow-cyan-950/40 text-slate-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-inner shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                {faculty.code}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-1 leading-snug">
              {faculty.fullName}
            </h3>
            <p className="text-xs text-cyan-400 font-medium mt-0.5">
              {faculty.designation}
            </p>
          </div>
        </div>

        <div className="space-y-2.5 pt-3 border-t border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <GraduationCap className="w-4 h-4 text-violet-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">বিভাগ</div>
              <div className="text-slate-200 font-medium">{faculty.department}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">ফ্যাকাল্টি রুম</div>
              <div className="text-emerald-300 font-bold">{faculty.roomNumber}</div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors cursor-pointer"
        >
          ঠিক আছে
        </button>
      </div>
    </div>
  );
}
