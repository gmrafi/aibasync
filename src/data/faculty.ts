import { FacultyMember } from "@/lib/types";

export const FACULTY_DIRECTORY: Record<string, FacultyMember> = {
  "CDG": {
    code: "CDG",
    fullName: "Col. / Dr. Chowdhury (CDG)",
    designation: "Professor & Senior Faculty",
    department: "Finance & Banking",
    roomNumber: "Faculty Room 206 (2nd Floor)",
  },
  "DMNI": {
    code: "DMNI",
    fullName: "Dr. Md. Nazrul Islam",
    designation: "Associate Professor",
    department: "Accounting & Taxation",
    roomNumber: "Faculty Room 204 (2nd Floor)",
  },
  "DMI": {
    code: "DMI",
    fullName: "Dr. Md. Islam (DMI)",
    designation: "Associate Professor",
    department: "Marketing Research",
    roomNumber: "Faculty Room 204 (2nd Floor)",
  },
  "MEU": {
    code: "MEU",
    fullName: "Md. Ehsanul Karim / MEU",
    designation: "Assistant Professor",
    department: "Marketing & Communication",
    roomNumber: "Faculty Room 309 (3rd Floor)",
  },
  "MT": {
    code: "MT",
    fullName: "Md. Tariqul Islam",
    designation: "Assistant Professor",
    department: "Supply Chain & Quantitative Analysis",
    roomNumber: "Faculty Room 206 (2nd Floor)",
  },
  "MIH": {
    code: "MIH",
    fullName: "Md. Imran Hossain",
    designation: "Assistant Professor",
    department: "Operations & Supply Chain",
    roomNumber: "Faculty Room 206 (2nd Floor)",
  },
  "STMH": {
    code: "STMH",
    fullName: "Syed Tariq M. H.",
    designation: "Assistant Professor",
    department: "Human Resource Management",
    roomNumber: "Faculty Room 309 (3rd Floor)",
  },
  "SW": {
    code: "SW",
    fullName: "Shabbir W. / SW",
    designation: "Assistant Professor / IT Lead",
    department: "Management Information Systems (MIS)",
    roomNumber: "Computer Lab / Room 204",
  },
  "MAI": {
    code: "MAI",
    fullName: "Md. Ashraful Islam",
    designation: "Assistant Professor",
    department: "Business Statistics & Mathematics",
    roomNumber: "Faculty Room 204 (2nd Floor)",
  },
  "ANR": {
    code: "ANR",
    fullName: "Abu Naser R.",
    designation: "Assistant Professor",
    department: "Economics",
    roomNumber: "Faculty Room 309 (3rd Floor)",
  },
  "LF": {
    code: "LF",
    fullName: "Lubna Farzana",
    designation: "Lecturer",
    department: "Management & E-Business",
    roomNumber: "Faculty Lounge 309 (3rd Floor)",
  },
  "AA": {
    code: "AA",
    fullName: "Abdullah Al-Mamun",
    designation: "Lecturer",
    department: "Accounting & Auditing",
    roomNumber: "Faculty Room 204 (2nd Floor)",
  },
  "MMU": {
    code: "MMU",
    fullName: "Md. Mahbub Ul Alam",
    designation: "Lecturer",
    department: "Environmental Studies",
    roomNumber: "Faculty Room 309 (3rd Floor)",
  },
  "STA": {
    code: "STA",
    fullName: "Syed Tanvir Ahmed",
    designation: "Lecturer",
    department: "Management & Leadership",
    roomNumber: "Faculty Room 309 (3rd Floor)",
  },
  "KF": {
    code: "KF",
    fullName: "Kazi Farhana",
    designation: "Lecturer",
    department: "English & Business Communication",
    roomNumber: "Faculty Lounge 309 (3rd Floor)",
  },
  "MAA": {
    code: "MAA",
    fullName: "Md. Asaduzzaman Ali",
    designation: "Assistant Professor",
    department: "Finance & Leadership",
    roomNumber: "Faculty Room 206 (2nd Floor)",
  },
  "AFMS": {
    code: "AFMS",
    fullName: "A. F. M. Shafiullah",
    designation: "Associate Professor",
    department: "Human Resource Management",
    roomNumber: "Faculty Room 204 (2nd Floor)",
  },
  "DMMR": {
    code: "DMMR",
    fullName: "Dr. Md. Mizanur Rahman",
    designation: "Professor",
    department: "MIS & Technology Management",
    roomNumber: "Faculty Room 206 (2nd Floor)",
  },
  "DMAFC": {
    code: "DMAFC",
    fullName: "Dr. Md. A. F. Chowdhury",
    designation: "Professor",
    department: "Banking & Financial Institutions",
    roomNumber: "Faculty Room 206 (2nd Floor)",
  },
  "MRM": {
    code: "MRM",
    fullName: "Md. Rezaur Mahmud",
    designation: "Lecturer",
    department: "English Language Studies",
    roomNumber: "Faculty Room 309 (3rd Floor)",
  },
  "GMST": {
    code: "GMST",
    fullName: "G. M. S. Tariq",
    designation: "Assistant Professor",
    department: "Marketing & Entrepreneurship",
    roomNumber: "Faculty Room 206 (2nd Floor)",
  },
  "N. M. A": {
    code: "N. M. A",
    fullName: "N. M. Al-Amin",
    designation: "Assistant Professor",
    department: "Financial & Advanced Accounting",
    roomNumber: "Faculty Room 204 (2nd Floor)",
  },
};

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
    roomNumber: "Faculty Lounge (AIBA Campus)",
  };
}
