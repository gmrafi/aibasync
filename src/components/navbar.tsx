"use client";

import { useMemo, useState } from "react";
import { Check, ChevronDown, MoreHorizontal, Moon, Search, Sun, UserRound } from "lucide-react";
import { FACULTY_LIST, getFacultyInfo } from "@/data/faculty";
import { FacultyMember } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  role?: "student" | "teacher";
  teacherCode?: string;
  studentName?: string;
  batch: string;
  majorOrSection: string;
  minor?: string;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  onOpenSelector: () => void;
  onOpenMore: () => void;
  onSelectFaculty: (faculty: FacultyMember) => void;
  currentTimeStr: string;
  currentDayStr: string;
}

export function Navbar({
  role = "student",
  teacherCode,
  studentName,
  batch,
  majorOrSection,
  minor,
  theme,
  onToggleTheme,
  onOpenSelector,
  onOpenMore,
  onSelectFaculty,
  currentTimeStr,
  currentDayStr,
}: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const isBba11 = batch === "BBA-11";
  const minorTag = isBba11 && minor && minor !== "None" ? ` + ${minor.replace("-M", "")}` : "";
  const teacherDisplayName = role === "teacher" && teacherCode ? getFacultyInfo(teacherCode).fullName : "";
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return FACULTY_LIST.filter((faculty) =>
      [faculty.fullName, faculty.designation, faculty.code].join(" ").toLowerCase().includes(query)
    ).slice(0, 5);
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 max-w-6xl flex-wrap items-center gap-3 px-3 py-2 sm:flex-nowrap sm:px-5">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:flex-none">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-primary/20 bg-card p-1.5 shadow-sm sm:h-11 sm:w-11">
            <img
              src="/logo.png"
              alt="AIBA Sylhet Crest"
              className="w-10 h-10 sm:w-11 sm:h-11 object-contain transition-transform hover:scale-105"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="truncate text-sm font-black tracking-tight text-foreground sm:text-base">AIBA Sync</div>
            </div>
            <p className="truncate text-[10px] font-medium text-muted-foreground sm:text-[11px]">Routine &amp; Campus Assistant</p>
            <p className="mt-0.5 text-[10px] font-semibold tabular-nums text-primary sm:text-[11px]">
              {currentDayStr} • {currentTimeStr}
            </p>
          </div>
        </div>

        <div className="relative order-3 w-full sm:order-none sm:w-48 md:w-60">
          <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="শিক্ষক খুঁজুন..."
            aria-label="শিক্ষক খুঁজুন"
            className="pl-9 pr-3"
          />
          {searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-11 z-50 overflow-hidden rounded-2xl border border-border bg-popover p-1.5 shadow-lg">
              {searchResults.map((faculty) => (
                <button
                  key={faculty.code}
                  type="button"
                  onClick={() => {
                    onSelectFaculty(faculty);
                    setSearchQuery("");
                  }}
                  className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-muted"
                >
                  <UserRound className="h-4 w-4 shrink-0 text-primary" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-bold text-popover-foreground">{faculty.fullName}</span>
                    <span className="block truncate text-[10px] text-muted-foreground">{faculty.designation}</span>
                  </span>
                  <Check className="h-3.5 w-3.5 shrink-0 text-transparent" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-1 sm:ml-auto sm:gap-1.5">
          <Button
            type="button"
            onClick={onOpenSelector}
            variant="outline"
            size="sm"
            className="group max-w-[170px] gap-1.5 px-2.5 sm:max-w-none sm:px-3"
            title={role === "teacher" ? "ফ্যাকাল্টি প্রোফাইল বা ব্যাচ নির্বাচন করুন" : "ব্যাচ / মেজর / মাইনর নির্বাচন করুন"}
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-primary ring-2 ring-primary/20" />
            {role === "teacher" ? (
              <>
                {teacherDisplayName ? (
                  <>
                    <span className="truncate font-bold">{teacherDisplayName}</span>
                    <span className="text-muted-foreground">•</span>
                  </>
                ) : (
                  <span className="font-bold">শিক্ষক</span>
                )}
                <span className="truncate text-muted-foreground">
                  {batch === "MY_CLASSES" ? "আমার ক্লাস" : batch === "ALL_BATCHES" ? "মাস্টার রুটিন" : batch}
                </span>
              </>
            ) : (
              <>
                <span className="font-bold">{batch}</span>
                <span className="text-muted-foreground">•</span>
                <span className="truncate text-muted-foreground">{majorOrSection}{minorTag}</span>
              </>
            )}
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-y-0.5" />
          </Button>

          <Button
            type="button"
            onClick={onToggleTheme}
            variant="ghost"
            size="icon"
            title={theme === "dark" ? "লাইট মোডে স্যুইচ করুন" : "ডার্ক মোডে স্যুইচ করুন"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <Button
            type="button"
            onClick={onOpenMore}
            variant="ghost"
            size="sm"
            title="আরও অপশন"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="hidden md:inline">আরও</span>
          </Button>

        </div>
      </div>
    </header>
  );
}
