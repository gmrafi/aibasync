export type DayOfWeek = "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";

export interface ClassSlot {
  id: string;
  batch: string; // e.g. "BBA-11", "BBA-12", "BBA-13", "BBA-14", "BBA-15"
  majorOrSection: string; // e.g. "FIN", "ACC", "MKT", "SCM", "MIS-M", "HRM-M", "Alpha", "Bravo", "Charlie"
  day: DayOfWeek;
  startTime: string; // "09:30" (24h)
  endTime: string;   // "11:00" (24h)
  period: 1 | 2 | 3;
  courseTitle: string;
  courseCode?: string;
  instructor: string;
  room: string;
  isClub?: boolean;
  isMinor?: boolean;
}

export interface AcademicEvent {
  date: string;
  title: string;
  type: "holiday" | "exam" | "academic" | "event";
  note?: string;
}

export interface BatchInfo {
  batch: string;
  sectionsOrMajors: string[];
  isMajorBased: boolean;
  minors?: string[];
}

export type MinorDiscipline = "MIS" | "HRM" | "SCM" | "MKT" | "FIN" | "ACC" | "None";

export interface MinorCourseInfo {
  code: "MIS" | "HRM" | "SCM" | "MKT" | "FIN" | "ACC";
  disciplineName: string;
  courseTitle: string;
  shortDescription?: string;
}

export interface UserPreferences {
  studentName?: string;
  batch: string;
  majorOrSection: string;
  minor?: string; // e.g. "MIS", "HRM", "SCM", "MKT", "FIN", "ACC", or "None"
  theme?: "light" | "dark";
  hasOnboarded: boolean;
}

export interface EmptyRoomStatus {
  room: string;
  floor: string;
  isFree: boolean;
  currentClass?: ClassSlot;
  nextClass?: ClassSlot;
  freeUntil?: string;
  freeDurationMinutes?: number;
}

export interface FacultyMember {
  code: string;
  fullName: string;
  designation: string;
  department: string;
  roomNumber: string;
  email?: string;
}
