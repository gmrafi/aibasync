import { ClassSlot, DayOfWeek, EmptyRoomStatus } from "./types";

export const DAYS_LIST: DayOfWeek[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getDayName(date: Date = new Date()): DayOfWeek {
  const index = date.getDay();
  return DAYS_LIST[index];
}

export function isWeekendDay(day: DayOfWeek): boolean {
  return day === "Friday" || day === "Saturday";
}

export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function minutesToTime12(timeStr: string): string {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const adjustedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  return `${adjustedHours}:${formattedMinutes} ${period}`;
}

export function formatMinutesBengali(totalMinutes: number): string {
  if (totalMinutes <= 0) return "০ মিনিট";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const toBengaliNumber = (num: number) => {
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((d) => bengaliDigits[parseInt(d, 10)] ?? d)
      .join("");
  };

  if (hours > 0 && minutes > 0) {
    return `${toBengaliNumber(hours)} ঘণ্টা ${toBengaliNumber(minutes)} মিনিট`;
  } else if (hours > 0) {
    return `${toBengaliNumber(hours)} ঘণ্টা`;
  } else {
    return `${toBengaliNumber(minutes)} মিনিট`;
  }
}

export function formatSecondsBengali(totalSeconds: number): string {
  if (totalSeconds <= 0) return "০ সেকেন্ড";
  const hours = Math.floor(totalSeconds / 3600);
  const remainder = totalSeconds % 3600;
  const minutes = Math.floor(remainder / 60);
  const seconds = remainder % 60;

  const toBengaliNumber = (num: number) => {
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num
      .toString()
      .split("")
      .map((d) => bengaliDigits[parseInt(d, 10)] ?? d)
      .join("");
  };

  const parts: string[] = [];
  if (hours > 0) parts.push(`${toBengaliNumber(hours)} ঘণ্টা`);
  if (minutes > 0 || hours > 0) parts.push(`${toBengaliNumber(minutes)} মিনিট`);
  parts.push(`${toBengaliNumber(seconds)} সেকেন্ড`);

  return parts.join(" ");
}

export interface ClassStatusResult {
  currentClass: ClassSlot | null;
  nextClass: ClassSlot | null;
  minutesLeftInCurrent: number | null;
  minutesToNext: number | null;
  secondsLeftInCurrent: number | null;
  secondsToNext: number | null;
  progressPercent: number;
  isWeekend: boolean;
  allDoneForToday: boolean;
  todayClasses: ClassSlot[];
}

export const MINOR_COURSE_TITLES: Record<string, string> = {
  MIS: "Management of Innovation and Technology",
  HRM: "Conflict Management and Negotiation",
  SCM: "Procurement Management",
  MKT: "Consumer Behavior",
  FIN: "International Financial Management",
  ACC: "Advanced Accounting -I",
};

export function isSlotMatchingStudent(
  slot: ClassSlot,
  batch: string,
  majorOrSection: string,
  minor?: string
): boolean {
  if (slot.batch !== batch) return false;

  if (batch !== "BBA-11") {
    return slot.majorOrSection === majorOrSection || slot.majorOrSection === "Common";
  }

  // BBA-11 Logic:
  // 1. Matches student's Major
  if (slot.majorOrSection === majorOrSection) {
    return true;
  }

  // 2. Matches student's Minor
  if (minor && minor !== "None" && MINOR_COURSE_TITLES[minor]) {
    const targetTitle = MINOR_COURSE_TITLES[minor].toLowerCase();
    const slotTitle = slot.courseTitle.toLowerCase();
    if (slotTitle.includes(targetTitle) || targetTitle.includes(slotTitle)) {
      return true;
    }
  }

  // 3. Common slots
  if (slot.majorOrSection === "Common") {
    return true;
  }

  return false;
}

export function isSlotMatchingView(
  slot: ClassSlot,
  batch: string,
  majorOrSection: string,
  minor?: string,
  role?: "student" | "teacher",
  teacherCode?: string
): boolean {
  if (role === "teacher") {
    if (teacherCode) {
      if (batch === "ALL_BATCHES") {
        return true;
      }
      return slot.instructor === teacherCode;
    }

    if (batch === "MY_CLASSES" || (!batch && teacherCode)) {
      return slot.instructor === teacherCode;
    }
    if (batch === "ALL_BATCHES") {
      return true;
    }
    return slot.batch === batch;
  }
  return isSlotMatchingStudent(slot, batch, majorOrSection, minor);
}

export function isSlotMinor(slot: ClassSlot, batch: string, minor?: string): boolean {
  if (batch !== "BBA-11" || !minor || minor === "None" || !MINOR_COURSE_TITLES[minor]) return false;
  const targetTitle = MINOR_COURSE_TITLES[minor].toLowerCase();
  const slotTitle = slot.courseTitle.toLowerCase();
  return slotTitle.includes(targetTitle) || targetTitle.includes(slotTitle);
}

export function getActiveAndUpcomingClass(
  slots: ClassSlot[],
  batch: string,
  majorOrSection: string,
  simulatedTime?: Date,
  minor?: string,
  role?: "student" | "teacher",
  teacherCode?: string
): ClassStatusResult {
  const now = simulatedTime || new Date();
  const currentDay = getDayName(now);
  const isWeekend = isWeekendDay(currentDay);

  if (isWeekend) {
    return {
      currentClass: null,
      nextClass: null,
      minutesLeftInCurrent: null,
      minutesToNext: null,
      secondsLeftInCurrent: null,
      secondsToNext: null,
      progressPercent: 0,
      isWeekend: true,
      allDoneForToday: false,
      todayClasses: [],
    };
  }

  const todayClasses = slots
    .filter((s) => s.day === currentDay && isSlotMatchingView(s, batch, majorOrSection, minor, role, teacherCode))
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  if (todayClasses.length === 0) {
    return {
      currentClass: null,
      nextClass: null,
      minutesLeftInCurrent: null,
      minutesToNext: null,
      secondsLeftInCurrent: null,
      secondsToNext: null,
      progressPercent: 0,
      isWeekend: false,
      allDoneForToday: true,
      todayClasses: [],
    };
  }

  const currentTotalSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let currentClass: ClassSlot | null = null;
  let nextClass: ClassSlot | null = null;
  let minutesLeftInCurrent: number | null = null;
  let minutesToNext: number | null = null;
  let secondsLeftInCurrent: number | null = null;
  let secondsToNext: number | null = null;
  let progressPercent = 0;

  for (const cls of todayClasses) {
    const startM = timeToMinutes(cls.startTime);
    const endM = timeToMinutes(cls.endTime);
    const startSec = startM * 60;
    const endSec = endM * 60;

    if (currentTotalSeconds >= startSec && currentTotalSeconds < endSec) {
      currentClass = cls;
      secondsLeftInCurrent = endSec - currentTotalSeconds;
      minutesLeftInCurrent = Math.ceil(secondsLeftInCurrent / 60);
      const totalDurationSec = endSec - startSec;
      progressPercent = Math.min(
        100,
        Math.max(0, Math.round(((currentTotalSeconds - startSec) / totalDurationSec) * 100))
      );
      break;
    }
  }

  // Find next upcoming class
  for (const cls of todayClasses) {
    const startM = timeToMinutes(cls.startTime);
    const startSec = startM * 60;
    if (startSec > currentTotalSeconds) {
      nextClass = cls;
      secondsToNext = startSec - currentTotalSeconds;
      minutesToNext = Math.ceil(secondsToNext / 60);
      break;
    }
  }

  const lastClass = todayClasses[todayClasses.length - 1];
  const lastClassEnd = timeToMinutes(lastClass.endTime);
  const allDoneForToday = !currentClass && currentMinutes >= lastClassEnd;

  return {
    currentClass,
    nextClass,
    minutesLeftInCurrent,
    minutesToNext,
    secondsLeftInCurrent,
    secondsToNext,
    progressPercent,
    isWeekend: false,
    allDoneForToday,
    todayClasses,
  };
}

export function calculateEmptyRooms(
  allSlots: ClassSlot[],
  allRooms: string[],
  now: Date = new Date()
): EmptyRoomStatus[] {
  const currentDay = getDayName(now);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // All classes scheduled today across all batches & majors
  const todayClasses = allSlots.filter((s) => s.day === currentDay);

  return allRooms
    .map((room) => {
      const roomClasses = todayClasses
        .filter((c) => c.room === room)
        .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

      // Check if any class is running in this room right now
      const activeClass = roomClasses.find((cls) => {
        const startM = timeToMinutes(cls.startTime);
        const endM = timeToMinutes(cls.endTime);
        return currentMinutes >= startM && currentMinutes < endM;
      });

      const floor = room.startsWith("2") ? "২য় তলা (Floor 2)" : "৩য় তলা (Floor 3)";

      if (activeClass) {
        return {
          room,
          floor,
          isFree: false,
          currentClass: activeClass,
        };
      }

      // If room is free right now, look for next class in this room
      const upcomingClass = roomClasses.find((cls) => {
        const startM = timeToMinutes(cls.startTime);
        return startM > currentMinutes;
      });

      if (upcomingClass) {
        const startM = timeToMinutes(upcomingClass.startTime);
        const freeDuration = startM - currentMinutes;
        return {
          room,
          floor,
          isFree: true,
          nextClass: upcomingClass,
          freeUntil: upcomingClass.startTime,
          freeDurationMinutes: freeDuration,
        };
      }

      // No more classes today in this room
      return {
        room,
        floor,
        isFree: true,
        freeUntil: "সারা দিন",
        freeDurationMinutes: 9999,
      };
    })
    .sort((a, b) => {
      // Free rooms first
      if (a.isFree && !b.isFree) return -1;
      if (!a.isFree && b.isFree) return 1;
      // Then longer free duration first
      if (a.isFree && b.isFree) {
        return (b.freeDurationMinutes || 0) - (a.freeDurationMinutes || 0);
      }
      return a.room.localeCompare(b.room);
    });
}
