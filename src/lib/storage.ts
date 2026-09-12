import { UserPreferences } from "./types";

const STORAGE_KEY = "aiba_sync_user_pref_v3";

export const DEFAULT_PREFERENCES: UserPreferences = {
  role: "student",
  studentName: "",
  teacherCode: "",
  batch: "BBA-11",
  majorOrSection: "Charlie",
  minor: "None",
  theme: "light",
  hasOnboarded: false,
};

export function getStoredPreferences(): UserPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_PREFERENCES;
  }

  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) {
      // Check for legacy keys
      const legacy = localStorage.getItem("aiba_radar_user_pref_v2") || localStorage.getItem("classr_user_pref_v1");
      if (legacy) {
        const p = JSON.parse(legacy);
        const role = p.role === "teacher" ? "teacher" : "student";
        return {
          role,
          studentName: p.studentName || "",
          teacherCode: p.teacherCode || "",
          batch: role === "teacher" ? "MY_CLASSES" : p.batch || DEFAULT_PREFERENCES.batch,
          majorOrSection: p.majorOrSection || DEFAULT_PREFERENCES.majorOrSection,
          minor: p.minor || "None",
          theme: p.theme || "light",
          hasOnboarded: Boolean(p.hasOnboarded),
        };
      }
      return DEFAULT_PREFERENCES;
    }
    const parsed = JSON.parse(item);
    const role = parsed.role === "teacher" ? "teacher" : "student";
    return {
      role,
      studentName: parsed.studentName || "",
      teacherCode: parsed.teacherCode || "",
      batch: role === "teacher" ? "MY_CLASSES" : parsed.batch || DEFAULT_PREFERENCES.batch,
      majorOrSection: parsed.majorOrSection || DEFAULT_PREFERENCES.majorOrSection,
      minor: parsed.minor || "None",
      theme: parsed.theme === "dark" ? "dark" : "light",
      hasOnboarded: Boolean(parsed.hasOnboarded),
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function savePreferences(prefs: Partial<UserPreferences>): UserPreferences {
  if (typeof window === "undefined") {
    return { ...DEFAULT_PREFERENCES, ...prefs };
  }

  try {
    const current = getStoredPreferences();
    const updated: UserPreferences = {
      ...current,
      ...prefs,
      role: prefs.role === "teacher" ? "teacher" : prefs.role || current.role,
      batch: prefs.role === "teacher" ? "MY_CLASSES" : prefs.batch || current.batch,
      hasOnboarded: true,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("aiba_sync_pref_changed", { detail: updated }));
    return updated;
  } catch {
    return { ...DEFAULT_PREFERENCES, ...prefs, hasOnboarded: true };
  }
}
