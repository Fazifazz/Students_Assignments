import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'spendwise.preferences';

const DEFAULTS = {
  currency: 'INR',
  weeklySummary: true,
  budgetWarnings: true,
};

/**
 * Display preferences stored on this device.
 *
 * These are presentation settings only — never authentication material, so
 * keeping them in localStorage is safe.
 */
export default function usePreferences() {
  const [preferences, setPreferences] = useState(DEFAULTS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPreferences({ ...DEFAULTS, ...JSON.parse(stored) });
      }
    } catch {
      // Corrupted preferences should never break the app.
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const setPreference = useCallback((key, value) => {
    setPreferences((current) => {
      const next = { ...current, [key]: value };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage may be unavailable (private mode) — keep the in-memory value.
      }
      return next;
    });
  }, []);

  return { preferences, setPreference };
}
