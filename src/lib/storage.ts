import { UserPreferences } from "./types";

const STORAGE_KEY = "classr_user_pref_v1";

export const DEFAULT_PREFERENCES: UserPreferences = {
  batch: "BBA-14",
  majorOrSection: "Charlie",
  hasOnboarded: false,
};

export function getStoredPreferences(): UserPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_PREFERENCES;
  }

  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (!item) return DEFAULT_PREFERENCES;
    const parsed = JSON.parse(item);
    return {
      batch: parsed.batch || DEFAULT_PREFERENCES.batch,
      majorOrSection: parsed.majorOrSection || DEFAULT_PREFERENCES.majorOrSection,
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
      hasOnboarded: true,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("classr_pref_changed", { detail: updated }));
    return updated;
  } catch {
    return { ...DEFAULT_PREFERENCES, ...prefs, hasOnboarded: true };
  }
}
