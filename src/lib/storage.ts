import { RiskAnalysisResult } from '@/types';

const STORAGE_KEY = 'payguard_scan_history';
const PREFS_KEY = 'payguard_user_prefs';

export interface UserPreferences {
  preferredLanguage: 'en' | 'ta';
  telemetryEnabled: boolean;
  soundAlerts: boolean;
}

const DEFAULT_PREFS: UserPreferences = {
  preferredLanguage: 'en',
  telemetryEnabled: true,
  soundAlerts: false,
};

// Check if Supabase keys are configured in the environment
export function isSupabaseConfigured(): boolean {
  return (
    typeof process !== 'undefined' &&
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// Client-side LocalStorage implementation (Safe, private, on-device by default)
export function getSavedHistory(): RiskAnalysisResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read scan history from storage:', e);
    return [];
  }
}

export function saveAnalysisResult(result: RiskAnalysisResult): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSavedHistory();
    // Prepend new scan, keep max 25 to respect storage boundaries
    const updated = [result, ...existing.filter((item) => item.id !== result.id)].slice(0, 25);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save analysis result to storage:', e);
  }
}

export function deleteHistoryItem(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getSavedHistory();
    const updated = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete history item:', e);
  }
}

export function clearAllHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear history:', e);
  }
}

export function getUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

export function saveUserPreferences(prefs: Partial<UserPreferences>): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const current = getUserPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(PREFS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_PREFS;
  }
}
