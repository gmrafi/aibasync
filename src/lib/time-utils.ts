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

export interface ClassStatusResult {
  currentClass: ClassSlot | null;
  nextClass: ClassSlot | null;
  minutesLeftInCurrent: number | null;
  minutesToNext: number | null;
  progressPercent: number;
  isWeekend: boolean;
  allDoneForToday: boolean;
  todayClasses: ClassSlot[];
}

export function getActiveAndUpcomingClass(
  slots: ClassSlot[],
  batch: string,
  majorOrSection: string,
  simulatedTime?: Date
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
      progressPercent: 0,
      isWeekend: true,
      allDoneForToday: false,
      todayClasses: [],
    };
  }

  const todayClasses = slots
    .filter(
      (s) =>
        s.batch === batch &&
        s.majorOrSection === majorOrSection &&
        s.day === currentDay
    )
    .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

  if (todayClasses.length === 0) {
    return {
      currentClass: null,
      nextClass: null,
      minutesLeftInCurrent: null,
      minutesToNext: null,
      progressPercent: 0,
      isWeekend: false,
      allDoneForToday: true,
      todayClasses: [],
    };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  let currentClass: ClassSlot | null = null;
  let nextClass: ClassSlot | null = null;
  let minutesLeftInCurrent: number | null = null;
  let minutesToNext: number | null = null;
  let progressPercent = 0;

  for (const cls of todayClasses) {
    const startM = timeToMinutes(cls.startTime);
    const endM = timeToMinutes(cls.endTime);

    if (currentMinutes >= startM && currentMinutes < endM) {
      currentClass = cls;
      minutesLeftInCurrent = endM - currentMinutes;
      const totalDuration = endM - startM;
      progressPercent = Math.min(
        100,
        Math.max(0, Math.round(((currentMinutes - startM) / totalDuration) * 100))
      );
      break;
    }
  }

  // Find next upcoming class
  for (const cls of todayClasses) {
    const startM = timeToMinutes(cls.startTime);
    if (startM > currentMinutes) {
      nextClass = cls;
      minutesToNext = startM - currentMinutes;
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
