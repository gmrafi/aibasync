"use client";

import {
  BellRing,
  BusFront,
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  Download,
  FileText,
  GraduationCap,
  Layers,
  Megaphone,
  MoreHorizontal,
  StickyNote,
  X,
} from "lucide-react";

interface MoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSelector: () => void;
  onOpenFacultyDirectory: () => void;
  onOpenCalendar: () => void;
}

const upcomingItems = [
  {
    title: "ক্লাস রিমাইন্ডার",
    description: "পরবর্তী ক্লাসের আগে নোটিফিকেশন পাওয়ার সুবিধা।",
    icon: BellRing,
  },
  {
    title: "ক্যাম্পাস বাস ট্র্যাকার",
    description: "ক্যাম্পাস বাসের রুট, অবস্থান ও সম্ভাব্য সময় দেখা।",
    icon: BusFront,
  },
  {
    title: "রুটিন কার্ড এক্সপোর্ট",
    description: "রুটিন কার্ড ডাউনলোড করার সুবিধা পরে আবার চালু করা হবে।",
    icon: Download,
  },
  {
    title: "অ্যাসাইনমেন্ট কভার পেজ",
    description: "কোর্স ও শিক্ষার্থীর তথ্য দিয়ে কভার পেজ তৈরি করা।",
    icon: FileText,
  },
  {
    title: "অ্যাটেনডেন্স ট্র্যাকার",
    description: "ক্লাস উপস্থিতি ও প্রয়োজনীয় উপস্থিতির হিসাব রাখা।",
    icon: ClipboardCheck,
  },
  {
    title: "পরীক্ষার সময়সূচি",
    description: "পরীক্ষার তারিখ, সময় এবং রুম এক জায়গায় দেখা।",
    icon: CalendarClock,
  },
  {
    title: "ক্যাম্পাস নোটিশ",
    description: "গুরুত্বপূর্ণ একাডেমিক ঘোষণা ও আপডেট দেখা।",
    icon: Megaphone,
  },
  {
    title: "ব্যক্তিগত নোট",
    description: "রুটিন ও ক্লাসের সঙ্গে নিজের ছোট নোট সংরক্ষণ করা।",
    icon: StickyNote,
  },
];

export function MoreModal({
  isOpen,
  onClose,
  onOpenSelector,
  onOpenFacultyDirectory,
  onOpenCalendar,
}: MoreModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-md overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300">
              <MoreHorizontal className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">আরও</h2>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                পরবর্তী আপডেটে আসছে
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:text-white"
            aria-label="আরও মেনু বন্ধ করুন"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 border-b border-border pb-5">
          <p className="mb-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
            দ্রুত অ্যাকশন
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "প্রোফাইল", icon: Layers, action: onOpenSelector },
              { label: "ফ্যাকাল্টি", icon: GraduationCap, action: onOpenFacultyDirectory },
              { label: "ক্যালেন্ডার", icon: CalendarDays, action: onOpenCalendar },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border bg-muted/40 px-2 py-2.5 text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 space-y-2.5">
          {upcomingItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 dark:border-slate-800 dark:bg-slate-950/50"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                      শিগগিরই
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-medium leading-relaxed text-slate-500 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}