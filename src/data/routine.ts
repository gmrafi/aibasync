import { AcademicEvent, BatchInfo, ClassSlot, MinorCourseInfo } from "@/lib/types";

export const INSTITUTION_INFO = {
  name: "Army Institute of Business Administration",
  shortName: "AIBA Sylhet",
  subTitle: "Sylhet Cantonment Road, Sylhet",
  term: "Fall 2026 (BBA Program)",
  appName: "AIBA Sync",
};

export const TIME_PERIODS = [
  { period: 1 as const, name: "Period 1", startTime: "09:30", endTime: "11:00", label: "09:30 AM – 11:00 AM" },
  { period: 0 as const, name: "Break", startTime: "11:00", endTime: "11:30", label: "11:00 AM – 11:30 AM", isBreak: true },
  { period: 2 as const, name: "Period 2", startTime: "11:30", endTime: "13:00", label: "11:30 AM – 01:00 PM" },
  { period: 0 as const, name: "Break / Lunch", startTime: "13:00", endTime: "13:30", label: "01:00 PM – 01:30 PM", isBreak: true },
  { period: 3 as const, name: "Period 3", startTime: "13:30", endTime: "15:00", label: "01:30 PM – 03:00 PM" },
];

export const ALL_ROOMS = [
  "201", "202", "203", "205", "207",
  "301", "302", "303", "304", "305", "306", "307", "308", "310", "311", "312"
];

export const BBA11_MAJORS = [
  { code: "FIN", name: "Finance (FIN)", fullName: "Finance" },
  { code: "ACC", name: "Accounting (ACC)", fullName: "Accounting" },
  { code: "MKT", name: "Marketing (MKT)", fullName: "Marketing" },
  { code: "SCM", name: "Supply Chain Management (SCM)", fullName: "Supply Chain Management" },
  { code: "HRM", name: "Human Resource Management (HRM)", fullName: "Human Resource Management" },
  { code: "MIS", name: "Management Information Systems (MIS)", fullName: "Management Information Systems" },
];

export const BBA11_MINORS: MinorCourseInfo[] = [
  {
    code: "MIS",
    disciplineName: "Management Information Systems",
    courseTitle: "Management of Innovation and Technology",
    shortDescription: "Prof. DMMR • Mon 09:30 (R201) & Thu 13:30 (R207)",
  },
  {
    code: "HRM",
    disciplineName: "Human Resource Management",
    courseTitle: "Conflict Management and Negotiation",
    shortDescription: "Prof. AFMS • Mon 09:30 (R307) & Wed 09:30 (R201)",
  },
  {
    code: "SCM",
    disciplineName: "Supply Chain Management",
    courseTitle: "Procurement Management",
    shortDescription: "Prof. MIH • Tue 13:30 (R205) & Wed 09:30 (R205)",
  },
  {
    code: "MKT",
    disciplineName: "Marketing",
    courseTitle: "Consumer Behavior",
    shortDescription: "Prof. MEU • Sun 13:30 (R312) & Wed 13:30 (R312)",
  },
  {
    code: "FIN",
    disciplineName: "Finance",
    courseTitle: "International Financial Management",
    shortDescription: "Prof. MAA • Mon 13:30 (R207) & Wed 13:30 (R207)",
  },
  {
    code: "ACC",
    disciplineName: "Accounting",
    courseTitle: "Advanced Accounting -I",
    shortDescription: "Prof. N. M. A • Sun 13:30 (R311) & Tue 13:30 (R311)",
  },
];

export const MINOR_COURSE_MAP: Record<string, { discipline: string; title: string }> = {
  MIS: { discipline: "Management Information Systems", title: "Management of Innovation and Technology" },
  HRM: { discipline: "Human Resource Management", title: "Conflict Management and Negotiation" },
  SCM: { discipline: "Supply Chain Management", title: "Procurement Management" },
  MKT: { discipline: "Marketing", title: "Consumer Behavior" },
  FIN: { discipline: "Finance", title: "International Financial Management" },
  ACC: { discipline: "Accounting", title: "Advanced Accounting -I" },
};

export const BATCH_LIST: BatchInfo[] = [
  {
    batch: "BBA-11",
    isMajorBased: true,
    sectionsOrMajors: ["FIN", "ACC", "MKT", "SCM"],
    minors: ["MIS", "HRM", "SCM", "MKT", "FIN", "ACC"],
  },
  {
    batch: "BBA-12",
    isMajorBased: false,
    sectionsOrMajors: ["Alpha", "Bravo"],
  },
  {
    batch: "BBA-13",
    isMajorBased: false,
    sectionsOrMajors: ["Alpha", "Bravo", "Charlie"],
  },
  {
    batch: "BBA-14",
    isMajorBased: false,
    sectionsOrMajors: ["Alpha", "Bravo", "Charlie"],
  },
  {
    batch: "BBA-15",
    isMajorBased: false,
    sectionsOrMajors: ["Alpha", "Bravo"],
  },
];

export const ACADEMIC_CALENDAR: AcademicEvent[] = [
  { date: "02 Aug – 06 Aug", title: "Course Registration with payments for Fall 2026", type: "academic" },
  { date: "05 Aug", title: "July Uprising Day", type: "holiday" },
  { date: "12 Aug", title: "Akheri Chahar Shamba", type: "holiday", note: "Subject to moon appearance" },
  { date: "16 Aug", title: "Class Starts: BBA-11 to BBA-14 & Materials Distribution", type: "academic" },
  { date: "23 Aug", title: "Students' Orientation & Class Starts: BBA-15", type: "academic" },
  { date: "26 Aug", title: "Eid-e-Miladun-Nabi", type: "holiday", note: "Subject to moon appearance" },
  { date: "04 Sept", title: "Janmashtami", type: "holiday" },
  { date: "24 Sept", title: "Fateha-e-Yazdaham", type: "holiday", note: "Subject to moon appearance" },
  { date: "04 Oct – 07 Oct", title: "Collection of Admit Card for Midterm Exam", type: "exam" },
  { date: "11 Oct – 15 Oct", title: "Midterm Exam", type: "exam" },
  { date: "20 Oct – 22 Oct", title: "Durga Puja", type: "holiday" },
  { date: "25 Oct", title: "Probarona Purnima", type: "holiday" },
  { date: "08 Nov", title: "Shyama Puja", type: "holiday" },
  { date: "13 Nov", title: "AIBA National Half Marathon 2026", type: "event" },
  { date: "21 Nov", title: "Armed Forces Day Observance", type: "event" },
  { date: "16 Dec", title: "Victory Day: Bijoy Utshab", type: "event" },
  { date: "20 Dec – 23 Dec", title: "Collection of Admit Cards for Final Exam", type: "exam" },
  { date: "20 Dec – 24 Dec", title: "Make-up Class / Preparation Leave for Final Exam", type: "academic" },
  { date: "25 Dec", title: "Christmas Day", type: "holiday" },
  { date: "27 Dec – 07 Jan 2027", title: "Final Exam", type: "exam" },
  { date: "08 Jan – 23 Jan 2027", title: "Semester Break & Winter Vacation", type: "holiday" },
  { date: "24 Jan 2027", title: "Class Starts for Spring 2027", type: "academic" },
];

export const ROUTINE_DATA: ClassSlot[] = [
  // ==========================
  // SUNDAY
  // ==========================
  // BBA-11
  { id: "sun-11-fin-2", batch: "BBA-11", majorOrSection: "FIN", day: "Sunday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Corporate Finance", instructor: "CDG", room: "207" },
  
  { id: "sun-11-acc-1", batch: "BBA-11", majorOrSection: "ACC", day: "Sunday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Taxation", instructor: "DMNI", room: "311" },
  { id: "sun-11-acc-3", batch: "BBA-11", majorOrSection: "ACC", day: "Sunday", period: 3, startTime: "13:30", endTime: "15:00", courseTitle: "Advanced Accounting -I", instructor: "N. M. A", room: "311", isMinor: true },

  { id: "sun-11-mkt-1", batch: "BBA-11", majorOrSection: "MKT", day: "Sunday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Marketing Research", instructor: "DMI", room: "312" },
  { id: "sun-11-mkt-2", batch: "BBA-11", majorOrSection: "MKT", day: "Sunday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Strategic Marketing", instructor: "DMI", room: "312" },
  { id: "sun-11-mkt-3", batch: "BBA-11", majorOrSection: "MKT", day: "Sunday", period: 3, startTime: "13:30", endTime: "15:00", courseTitle: "Consumer Behavior", instructor: "MEU", room: "312", isMinor: true },

  { id: "sun-11-scm-1", batch: "BBA-11", majorOrSection: "SCM", day: "Sunday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Strategic Supply Chain Management", instructor: "MT", room: "205" },
  { id: "sun-11-scm-2", batch: "BBA-11", majorOrSection: "SCM", day: "Sunday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Production Planning & Control", instructor: "MIH", room: "205" },

  // BBA-12
  { id: "sun-12-a-1", batch: "BBA-12", majorOrSection: "Alpha", day: "Sunday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Human Resources Management", instructor: "STMH", room: "202" },
  { id: "sun-12-a-2", batch: "BBA-12", majorOrSection: "Alpha", day: "Sunday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Management Information System", instructor: "SW", room: "202" },

  { id: "sun-12-b-1", batch: "BBA-12", majorOrSection: "Bravo", day: "Sunday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Business Statistics", instructor: "MAI", room: "203" },
  { id: "sun-12-b-2", batch: "BBA-12", majorOrSection: "Bravo", day: "Sunday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Human Resources Management", instructor: "STMH", room: "203" },

  // BBA-13
  { id: "sun-13-a-1", batch: "BBA-13", majorOrSection: "Alpha", day: "Sunday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Microeconomics", instructor: "ANR", room: "306" },
  { id: "sun-13-a-2", batch: "BBA-13", majorOrSection: "Alpha", day: "Sunday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Fundamentals of Marketing", instructor: "DMNI", room: "306" },

  { id: "sun-13-b-1", batch: "BBA-13", majorOrSection: "Bravo", day: "Sunday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "E-Business Management", instructor: "LF", room: "308" },
  { id: "sun-13-b-2", batch: "BBA-13", majorOrSection: "Bravo", day: "Sunday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Business Mathematics", instructor: "MAI", room: "308" },

  { id: "sun-13-c-1", batch: "BBA-13", majorOrSection: "Charlie", day: "Sunday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Fundamentals of Marketing", instructor: "AA", room: "310" },
  { id: "sun-13-c-2", batch: "BBA-13", majorOrSection: "Charlie", day: "Sunday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Business Mathematics", instructor: "MT", room: "310" },

  // BBA-14
  { id: "sun-14-a-1", batch: "BBA-14", majorOrSection: "Alpha", day: "Sunday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Environmental Studies", instructor: "MMU", room: "303" },
  { id: "sun-14-a-2", batch: "BBA-14", majorOrSection: "Alpha", day: "Sunday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Communication for Business Leaders", instructor: "MEU", room: "303" },

  { id: "sun-14-b-1", batch: "BBA-14", majorOrSection: "Bravo", day: "Sunday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Business Leadership", instructor: "STA", room: "304" },
  { id: "sun-14-b-2", batch: "BBA-14", majorOrSection: "Bravo", day: "Sunday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Environmental Studies", instructor: "MMU", room: "304" },

  { id: "sun-14-c-1", batch: "BBA-14", majorOrSection: "Charlie", day: "Sunday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Principles of Accounting", instructor: "N. M. A", room: "305" },
  { id: "sun-14-c-2", batch: "BBA-14", majorOrSection: "Charlie", day: "Sunday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Business Leadership", instructor: "STA", room: "305" },

  // BBA-15
  { id: "sun-15-a-1", batch: "BBA-15", majorOrSection: "Alpha", day: "Sunday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Computer and Its Application in Business", instructor: "SW", room: "301" },
  { id: "sun-15-a-2", batch: "BBA-15", majorOrSection: "Alpha", day: "Sunday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Functional English", instructor: "KF", room: "301" },

  { id: "sun-15-b-1", batch: "BBA-15", majorOrSection: "Bravo", day: "Sunday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Presentation Skill Development", instructor: "MIH", room: "302" },
  { id: "sun-15-b-2", batch: "BBA-15", majorOrSection: "Bravo", day: "Sunday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Fundamentals of Management", instructor: "LF", room: "302" },

  // ==========================
  // MONDAY
  // ==========================
  // BBA-11
  { id: "mon-11-fin-3", batch: "BBA-11", majorOrSection: "FIN", day: "Monday", period: 3, startTime: "13:30", endTime: "15:00", courseTitle: "International Financial Management", instructor: "MAA", room: "207", isMinor: true },
  { id: "mon-11-acc-2", batch: "BBA-11", majorOrSection: "ACC", day: "Monday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Auditing", instructor: "AA", room: "311" },
  { id: "mon-11-mkt-2", batch: "BBA-11", majorOrSection: "MKT", day: "Monday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Brand Management", instructor: "GMST", room: "312" },
  { id: "mon-11-scm-2", batch: "BBA-11", majorOrSection: "SCM", day: "Monday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Logistics Management", instructor: "MT", room: "205" },
  { id: "mon-11-mis-1", batch: "BBA-11", majorOrSection: "MIS", day: "Monday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Management of Innovation and Technology", instructor: "DMMR", room: "201", isMinor: true },
  { id: "mon-11-hrm-1", batch: "BBA-11", majorOrSection: "HRM", day: "Monday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Conflict Management and Negotiation", instructor: "AFMS", room: "307", isMinor: true },

  // BBA-12
  { id: "mon-12-a-1", batch: "BBA-12", majorOrSection: "Alpha", day: "Monday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Entrepreneurship", instructor: "GMST", room: "202" },
  { id: "mon-12-a-2", batch: "BBA-12", majorOrSection: "Alpha", day: "Monday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Macroeconomics", instructor: "ANR", room: "202" },

  { id: "mon-12-b-1", batch: "BBA-12", majorOrSection: "Bravo", day: "Monday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Macroeconomics", instructor: "ANR", room: "203" },
  { id: "mon-12-b-2", batch: "BBA-12", majorOrSection: "Bravo", day: "Monday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Management Information System", instructor: "SW", room: "203" },

  // BBA-13
  { id: "mon-13-a-1", batch: "BBA-13", majorOrSection: "Alpha", day: "Monday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "E-Business Management", instructor: "LF", room: "306" },
  { id: "mon-13-a-2", batch: "BBA-13", majorOrSection: "Alpha", day: "Monday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Business Mathematics", instructor: "MAI", room: "306" },

  { id: "mon-13-b-1", batch: "BBA-13", majorOrSection: "Bravo", day: "Monday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Microeconomics", instructor: "DMNIA", room: "308" },
  { id: "mon-13-b-2", batch: "BBA-13", majorOrSection: "Bravo", day: "Monday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Principles of Finance", instructor: "CDG", room: "308" },

  { id: "mon-13-c-1", batch: "BBA-13", majorOrSection: "Charlie", day: "Monday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Principles of Finance", instructor: "MIH", room: "310" },
  { id: "mon-13-c-2", batch: "BBA-13", majorOrSection: "Charlie", day: "Monday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "E-Business Management", instructor: "DMMR", room: "310" },

  // BBA-14
  { id: "mon-14-a-1", batch: "BBA-14", majorOrSection: "Alpha", day: "Monday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Principles of Accounting", instructor: "N. M. A", room: "303" },
  { id: "mon-14-a-2", batch: "BBA-14", majorOrSection: "Alpha", day: "Monday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Business Leadership", instructor: "MAA", room: "303" },

  { id: "mon-14-b-1", batch: "BBA-14", majorOrSection: "Bravo", day: "Monday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Communicative English", instructor: "KF", room: "304" },
  { id: "mon-14-b-2", batch: "BBA-14", majorOrSection: "Bravo", day: "Monday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Principles of Accounting", instructor: "N. M. A", room: "304" },

  { id: "mon-14-c-1", batch: "BBA-14", majorOrSection: "Charlie", day: "Monday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Environmental Studies", instructor: "MT", room: "305" },
  { id: "mon-14-c-2", batch: "BBA-14", majorOrSection: "Charlie", day: "Monday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Communicative English", instructor: "KF", room: "305" },

  // BBA-15
  { id: "mon-15-a-1", batch: "BBA-15", majorOrSection: "Alpha", day: "Monday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Bangladesh & International Studies", instructor: "MAH", room: "301" },
  { id: "mon-15-a-2", batch: "BBA-15", majorOrSection: "Alpha", day: "Monday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Fundamentals of Management", instructor: "LF", room: "301" },

  { id: "mon-15-b-1", batch: "BBA-15", majorOrSection: "Bravo", day: "Monday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Computer and Its Application in Business", instructor: "SW", room: "302" },
  { id: "mon-15-b-2", batch: "BBA-15", majorOrSection: "Bravo", day: "Monday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Bangladesh & International Studies", instructor: "MAH", room: "302" },

  // ==========================
  // TUESDAY
  // ==========================
  // BBA-11
  { id: "tue-11-fin-1", batch: "BBA-11", majorOrSection: "FIN", day: "Tuesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Bank Fund Management", instructor: "DMAFC", room: "207" },
  { id: "tue-11-fin-2", batch: "BBA-11", majorOrSection: "FIN", day: "Tuesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Financial Institutions & Markets", instructor: "DMAFC", room: "207" },

  { id: "tue-11-acc-1", batch: "BBA-11", majorOrSection: "ACC", day: "Tuesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Cost Accounting", instructor: "AA", room: "311" },
  { id: "tue-11-acc-3", batch: "BBA-11", majorOrSection: "ACC", day: "Tuesday", period: 3, startTime: "13:30", endTime: "15:00", courseTitle: "Advanced Accounting -I", instructor: "N. M. A", room: "311", isMinor: true },

  { id: "tue-11-mkt-1", batch: "BBA-11", majorOrSection: "MKT", day: "Tuesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Marketing Research", instructor: "DMI", room: "312" },
  { id: "tue-11-mkt-2", batch: "BBA-11", majorOrSection: "MKT", day: "Tuesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Strategic Marketing", instructor: "DMI", room: "312" },

  { id: "tue-11-scm-1", batch: "BBA-11", majorOrSection: "SCM", day: "Tuesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Production Planning & Control", instructor: "MIH", room: "205" },
  { id: "tue-11-scm-3", batch: "BBA-11", majorOrSection: "SCM", day: "Tuesday", period: 3, startTime: "13:30", endTime: "15:00", courseTitle: "Procurement Management", instructor: "MIH", room: "205", isMinor: true },

  // BBA-12
  { id: "tue-12-a-1", batch: "BBA-12", majorOrSection: "Alpha", day: "Tuesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Human Resources Management", instructor: "STMH", room: "202" },
  { id: "tue-12-a-2", batch: "BBA-12", majorOrSection: "Alpha", day: "Tuesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Macroeconomics", instructor: "ANR", room: "202" },

  { id: "tue-12-b-1", batch: "BBA-12", majorOrSection: "Bravo", day: "Tuesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Management Information System", instructor: "SW", room: "203" },
  { id: "tue-12-b-2", batch: "BBA-12", majorOrSection: "Bravo", day: "Tuesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Human Resources Management", instructor: "STMH", room: "203" },

  // BBA-13
  { id: "tue-13-a-1", batch: "BBA-13", majorOrSection: "Alpha", day: "Tuesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "E-Business Management", instructor: "LF", room: "306" },
  { id: "tue-13-a-2", batch: "BBA-13", majorOrSection: "Alpha", day: "Tuesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Business Mathematics", instructor: "MAI", room: "306" },

  { id: "tue-13-b-1", batch: "BBA-13", majorOrSection: "Bravo", day: "Tuesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Principles of Finance", instructor: "CDG", room: "308" },
  { id: "tue-13-b-2", batch: "BBA-13", majorOrSection: "Bravo", day: "Tuesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "E-Business Management", instructor: "LF", room: "308" },

  { id: "tue-13-c-1", batch: "BBA-13", majorOrSection: "Charlie", day: "Tuesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Microeconomics", instructor: "ANR", room: "310" },
  { id: "tue-13-c-2", batch: "BBA-13", majorOrSection: "Charlie", day: "Tuesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Fundamentals of Marketing", instructor: "AA", room: "310" },

  // BBA-14
  { id: "tue-14-a-1", batch: "BBA-14", majorOrSection: "Alpha", day: "Tuesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Environmental Studies", instructor: "MMU", room: "303" },
  { id: "tue-14-a-2", batch: "BBA-14", majorOrSection: "Alpha", day: "Tuesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Communicative English", instructor: "KF", room: "303" },

  { id: "tue-14-b-1", batch: "BBA-14", majorOrSection: "Bravo", day: "Tuesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Communication for Business Leaders", instructor: "AS", room: "304" },
  { id: "tue-14-b-2", batch: "BBA-14", majorOrSection: "Bravo", day: "Tuesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Environmental Studies", instructor: "MMU", room: "304" },

  { id: "tue-14-c-1", batch: "BBA-14", majorOrSection: "Charlie", day: "Tuesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Principles of Accounting", instructor: "N. M. A", room: "305" },
  { id: "tue-14-c-2", batch: "BBA-14", majorOrSection: "Charlie", day: "Tuesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Communication for Business Leaders", instructor: "AS", room: "305" },

  // BBA-15
  { id: "tue-15-a-1", batch: "BBA-15", majorOrSection: "Alpha", day: "Tuesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Functional English", instructor: "KF", room: "301" },
  { id: "tue-15-a-2", batch: "BBA-15", majorOrSection: "Alpha", day: "Tuesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Presentation Skill Development", instructor: "MAA", room: "301" },

  { id: "tue-15-b-1", batch: "BBA-15", majorOrSection: "Bravo", day: "Tuesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Functional English", instructor: "MRM", room: "302" },
  { id: "tue-15-b-2", batch: "BBA-15", majorOrSection: "Bravo", day: "Tuesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Computer and Its Application in Business", instructor: "SW", room: "302" },

  // ==========================
  // WEDNESDAY
  // ==========================
  // BBA-11
  { id: "wed-11-fin-2", batch: "BBA-11", majorOrSection: "FIN", day: "Wednesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Corporate Finance", instructor: "CDG", room: "207" },
  { id: "wed-11-fin-3", batch: "BBA-11", majorOrSection: "FIN", day: "Wednesday", period: 3, startTime: "13:30", endTime: "15:00", courseTitle: "International Financial Management", instructor: "MAA", room: "207", isMinor: true },

  { id: "wed-11-acc-2", batch: "BBA-11", majorOrSection: "ACC", day: "Wednesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Auditing", instructor: "AA", room: "311" },

  { id: "wed-11-mkt-2", batch: "BBA-11", majorOrSection: "MKT", day: "Wednesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Brand Management", instructor: "GMST", room: "312" },
  { id: "wed-11-mkt-3", batch: "BBA-11", majorOrSection: "MKT", day: "Wednesday", period: 3, startTime: "13:30", endTime: "15:00", courseTitle: "Consumer Behavior", instructor: "MEU", room: "312", isMinor: true },

  { id: "wed-11-scm-1", batch: "BBA-11", majorOrSection: "SCM", day: "Wednesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Procurement Management", instructor: "MIH", room: "205", isMinor: true },
  { id: "wed-11-scm-2", batch: "BBA-11", majorOrSection: "SCM", day: "Wednesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Logistics Management", instructor: "MT", room: "205" },

  { id: "wed-11-hrm-1", batch: "BBA-11", majorOrSection: "HRM", day: "Wednesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Conflict Management and Negotiation", instructor: "AFMS", room: "201", isMinor: true },

  // BBA-12
  { id: "wed-12-a-1", batch: "BBA-12", majorOrSection: "Alpha", day: "Wednesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Business Statistics", instructor: "MAI", room: "202" },
  { id: "wed-12-a-2", batch: "BBA-12", majorOrSection: "Alpha", day: "Wednesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Management Information System", instructor: "SW", room: "202" },

  { id: "wed-12-b-1", batch: "BBA-12", majorOrSection: "Bravo", day: "Wednesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Entrepreneurship", instructor: "GMST", room: "203" },
  { id: "wed-12-b-2", batch: "BBA-12", majorOrSection: "Bravo", day: "Wednesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Business Statistics", instructor: "MAI", room: "203" },

  // BBA-13
  { id: "wed-13-a-1", batch: "BBA-13", majorOrSection: "Alpha", day: "Wednesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Principles of Finance", instructor: "CDG", room: "306" },
  { id: "wed-13-a-2", batch: "BBA-13", majorOrSection: "Alpha", day: "Wednesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Microeconomics", instructor: "ANR", room: "306" },

  { id: "wed-13-b-1", batch: "BBA-13", majorOrSection: "Bravo", day: "Wednesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Fundamentals of Marketing", instructor: "AA", room: "308" },
  { id: "wed-13-b-2", batch: "BBA-13", majorOrSection: "Bravo", day: "Wednesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Microeconomics", instructor: "DMNIA", room: "308" },

  { id: "wed-13-c-1", batch: "BBA-13", majorOrSection: "Charlie", day: "Wednesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Business Mathematics", instructor: "MT", room: "310" },
  { id: "wed-13-c-2", batch: "BBA-13", majorOrSection: "Charlie", day: "Wednesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Principles of Finance", instructor: "MIH", room: "310" },

  // BBA-14
  { id: "wed-14-a-1", batch: "BBA-14", majorOrSection: "Alpha", day: "Wednesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Business Leadership", instructor: "MAA", room: "303" },
  { id: "wed-14-a-2", batch: "BBA-14", majorOrSection: "Alpha", day: "Wednesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Communication for Business Leaders", instructor: "MEU", room: "303" },

  { id: "wed-14-b-1", batch: "BBA-14", majorOrSection: "Bravo", day: "Wednesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Business Leadership", instructor: "STA", room: "304" },
  { id: "wed-14-b-2", batch: "BBA-14", majorOrSection: "Bravo", day: "Wednesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Principles of Accounting", instructor: "N. M. A", room: "304" },

  { id: "wed-14-c-1", batch: "BBA-14", majorOrSection: "Charlie", day: "Wednesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Communicative English", instructor: "KF", room: "305" },
  { id: "wed-14-c-2", batch: "BBA-14", majorOrSection: "Charlie", day: "Wednesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Business Leadership", instructor: "STA", room: "305" },

  // BBA-15
  { id: "wed-15-a-1", batch: "BBA-15", majorOrSection: "Alpha", day: "Wednesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Computer and Its Application in Business", instructor: "SW", room: "301" },
  { id: "wed-15-a-2", batch: "BBA-15", majorOrSection: "Alpha", day: "Wednesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Fundamentals of Management", instructor: "LF", room: "301" },

  { id: "wed-15-b-1", batch: "BBA-15", majorOrSection: "Bravo", day: "Wednesday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Fundamentals of Management", instructor: "LF", room: "302" },
  { id: "wed-15-b-2", batch: "BBA-15", majorOrSection: "Bravo", day: "Wednesday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Functional English", instructor: "MRM", room: "302" },

  // ==========================
  // THURSDAY
  // ==========================
  // BBA-11
  { id: "thu-11-fin-1", batch: "BBA-11", majorOrSection: "FIN", day: "Thursday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Bank Fund Management", instructor: "DMAFC", room: "207" },
  { id: "thu-11-fin-2", batch: "BBA-11", majorOrSection: "FIN", day: "Thursday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Financial Institutions & Markets", instructor: "DMAFC", room: "207" },
  { id: "thu-11-mis-3", batch: "BBA-11", majorOrSection: "MIS", day: "Thursday", period: 3, startTime: "13:30", endTime: "15:00", courseTitle: "Management of Innovation and Technology", instructor: "DMMR", room: "207", isMinor: true },

  { id: "thu-11-acc-1", batch: "BBA-11", majorOrSection: "ACC", day: "Thursday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Taxation", instructor: "DMNI", room: "311" },
  { id: "thu-11-acc-2", batch: "BBA-11", majorOrSection: "ACC", day: "Thursday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Cost Accounting", instructor: "AA", room: "311" },

  { id: "thu-11-scm-1", batch: "BBA-11", majorOrSection: "SCM", day: "Thursday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Strategic Supply Chain Management", instructor: "MT", room: "205" },

  // BBA-12
  { id: "thu-12-a-1", batch: "BBA-12", majorOrSection: "Alpha", day: "Thursday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Business Statistics", instructor: "MAI", room: "202" },
  { id: "thu-12-a-2", batch: "BBA-12", majorOrSection: "Alpha", day: "Thursday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Entrepreneurship", instructor: "GMST", room: "202" },

  { id: "thu-12-b-1", batch: "BBA-12", majorOrSection: "Bravo", day: "Thursday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Entrepreneurship", instructor: "GMST", room: "203" },
  { id: "thu-12-b-2", batch: "BBA-12", majorOrSection: "Bravo", day: "Thursday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Macroeconomics", instructor: "ANR", room: "203" },

  // BBA-13
  { id: "thu-13-a-1", batch: "BBA-13", majorOrSection: "Alpha", day: "Thursday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Principles of Finance", instructor: "CDG", room: "306" },
  { id: "thu-13-a-2", batch: "BBA-13", majorOrSection: "Alpha", day: "Thursday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Fundamentals of Marketing", instructor: "DMNI", room: "306" },

  { id: "thu-13-b-1", batch: "BBA-13", majorOrSection: "Bravo", day: "Thursday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Fundamentals of Marketing", instructor: "AA", room: "308" },
  { id: "thu-13-b-2", batch: "BBA-13", majorOrSection: "Bravo", day: "Thursday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Business Mathematics", instructor: "MAI", room: "308" },

  { id: "thu-13-c-1", batch: "BBA-13", majorOrSection: "Charlie", day: "Thursday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Microeconomics", instructor: "ANR", room: "310" },
  { id: "thu-13-c-2", batch: "BBA-13", majorOrSection: "Charlie", day: "Thursday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "E-Business Management", instructor: "DMMR", room: "310" },

  // BBA-14
  { id: "thu-14-a-1", batch: "BBA-14", majorOrSection: "Alpha", day: "Thursday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Principles of Accounting", instructor: "N. M. A", room: "303" },
  { id: "thu-14-a-2", batch: "BBA-14", majorOrSection: "Alpha", day: "Thursday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Communicative English", instructor: "KF", room: "303" },

  { id: "thu-14-b-1", batch: "BBA-14", majorOrSection: "Bravo", day: "Thursday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Communicative English", instructor: "KF", room: "304" },
  { id: "thu-14-b-2", batch: "BBA-14", majorOrSection: "Bravo", day: "Thursday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Communication for Business Leaders", instructor: "AS", room: "304" },

  { id: "thu-14-c-1", batch: "BBA-14", majorOrSection: "Charlie", day: "Thursday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Communication for Business Leaders", instructor: "AS", room: "305" },
  { id: "thu-14-c-2", batch: "BBA-14", majorOrSection: "Charlie", day: "Thursday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Environmental Studies", instructor: "MT", room: "305" },

  // BBA-15
  { id: "thu-15-a-1", batch: "BBA-15", majorOrSection: "Alpha", day: "Thursday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Bangladesh & International Studies", instructor: "MAH", room: "301" },
  { id: "thu-15-a-2", batch: "BBA-15", majorOrSection: "Alpha", day: "Thursday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Presentation Skill Development", instructor: "MAA", room: "301" },

  { id: "thu-15-b-1", batch: "BBA-15", majorOrSection: "Bravo", day: "Thursday", period: 1, startTime: "09:30", endTime: "11:00", courseTitle: "Presentation Skill Development", instructor: "MIH", room: "302" },
  { id: "thu-15-b-2", batch: "BBA-15", majorOrSection: "Bravo", day: "Thursday", period: 2, startTime: "11:30", endTime: "13:00", courseTitle: "Bangladesh & International Studies", instructor: "MAH", room: "302" },
];
