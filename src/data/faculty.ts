import { FacultyMember } from "@/lib/types";

export const FACULTY_DIRECTORY: Record<string, FacultyMember> = {
  "CDG": {
    code: "CDG",
    fullName: "Chinmoy Das Gupta",
    designation: "Assistant Professor",
    department: "Finance & Banking",
    roomNumber: "টিচিং লাউঞ্জ",
    profileUrl: "https://aibasylhet.edu.bd/my-profile-view/6788d9844d073d10650e1e54",
  },
  "DMNI": {
    code: "DMNI",
    fullName: "Dr. Md. Nazrul Islam",
    designation: "Associate Professor",
    department: "Accounting & Taxation",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "DMI": {
    code: "DMI",
    fullName: "Dr. Md. Islam (DMI)",
    designation: "Associate Professor",
    department: "Marketing Research",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "MEU": {
    code: "MEU",
    fullName: "Md. Ehsanul Karim / MEU",
    designation: "Assistant Professor",
    department: "Marketing & Communication",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "MT": {
    code: "MT",
    fullName: "Md. Tariqul Islam",
    designation: "Assistant Professor",
    department: "Supply Chain & Quantitative Analysis",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "MIH": {
    code: "MIH",
    fullName: "Md. Imran Hossain",
    designation: "Assistant Professor",
    department: "Operations & Supply Chain",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "STMH": {
    code: "STMH",
    fullName: "Syed Tariq M. H.",
    designation: "Assistant Professor",
    department: "Human Resource Management",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "SW": {
    code: "SW",
    fullName: "Shabbir W. / SW",
    designation: "Assistant Professor / IT Lead",
    department: "Management Information Systems (MIS)",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "MAI": {
    code: "MAI",
    fullName: "Md. Ashraful Islam",
    designation: "Assistant Professor",
    department: "Business Statistics & Mathematics",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "ANR": {
    code: "ANR",
    fullName: "Abu Naser R.",
    designation: "Assistant Professor",
    department: "Economics",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "LF": {
    code: "LF",
    fullName: "Limuza Fairuz",
    designation: "Lecturer",
    department: "Management & E-Business",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "AA": {
    code: "AA",
    fullName: "Abdullah Al-Mamun",
    designation: "Lecturer",
    department: "Accounting & Auditing",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "MMU": {
    code: "MMU",
    fullName: "Md. Mahbub Ul Alam",
    designation: "Lecturer",
    department: "Environmental Studies",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "STA": {
    code: "STA",
    fullName: "Syed Tanvir Ahmed",
    designation: "Lecturer",
    department: "Management & Leadership",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "KF": {
    code: "KF",
    fullName: "Kazi Farhana",
    designation: "Lecturer",
    department: "English & Business Communication",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "MAA": {
    code: "MAA",
    fullName: "Md Ali Ashraf",
    designation: "Assistant Professor",
    department: "Army Institute of Business Administration (AIBA)",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "AFMS": {
    code: "AFMS",
    fullName: "A. F. M. Shafiullah",
    designation: "Associate Professor",
    department: "Human Resource Management",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "DMMR": {
    code: "DMMR",
    fullName: "Dr. Md. Mizanur Rahman",
    designation: "Professor",
    department: "MIS & Technology Management",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "DMAFC": {
    code: "DMAFC",
    fullName: "Professor Dr. Mohammad Ashraful Ferdous Chowdhury",
    designation: "Professor",
    department: "Banking & Financial Institutions",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "MRM": {
    code: "MRM",
    fullName: "Md. Rezaur Mahmud",
    designation: "Lecturer",
    department: "English Language Studies",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "GMST": {
    code: "GMST",
    fullName: "Golam Morshed Shahriar Tanim",
    designation: "Assistant Professor",
    department: "Marketing & Entrepreneurship",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "N. M. A": {
    code: "N. M. A",
    fullName: "N. M. Ashikuzzaman",
    designation: "Lecturer",
    department: "Financial & Advanced Accounting",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "AS": {
    code: "AS",
    fullName: "A. S. (Guest Faculty)",
    designation: "অ্যাডজাঙ্কট ফ্যাকাল্টি",
    department: "Business Administration",
    roomNumber: "টিচিং লাউঞ্জ",
  },
  "DMNIA": {
    code: "DMNIA",
    fullName: "Dr. Munshi Naser Ibne Afzal",
    designation: "অ্যাডজাঙ্কট ফ্যাকাল্টি (প্রফেসর, SUST)",
    department: "Department of Economics",
    roomNumber: "টিচিং লাউঞ্জ",
  },
};

export const FACULTY_LIST: FacultyMember[] = Object.values(FACULTY_DIRECTORY)
  .filter((faculty, index, self) => index === self.findIndex((f) => f.fullName === faculty.fullName))
  .sort((a, b) => a.fullName.localeCompare(b.fullName));

export function getFacultyInfo(code: string): FacultyMember {
  const cleanCode = code.trim();
  if (FACULTY_DIRECTORY[cleanCode]) {
    return FACULTY_DIRECTORY[cleanCode];
  }
  return {
    code: cleanCode,
    fullName: `Faculty (${cleanCode})`,
    designation: "Course Instructor",
    department: "AIBA BBA Program",
    roomNumber: "টিচিং লাউঞ্জ",
  };
}
