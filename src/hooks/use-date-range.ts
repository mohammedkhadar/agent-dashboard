"use client";

import { useState, useCallback, useEffect } from "react";
import { format, subDays, startOfDay } from "date-fns";
import type { DateRange, DateRangePreset } from "@/lib/types";
import { DEFAULT_DATE_PRESET, SESSION_STORAGE_KEYS } from "@/lib/constants";

function computeDateRange(preset: DateRangePreset): DateRange {
  const today = startOfDay(new Date());
  const endDate = format(today, "yyyy-MM-dd");

  switch (preset) {
    case "last7d":
      return { startDate: format(subDays(today, 6), "yyyy-MM-dd"), endDate };
    case "last30d":
      return { startDate: format(subDays(today, 29), "yyyy-MM-dd"), endDate };
    case "last90d":
      return { startDate: format(subDays(today, 89), "yyyy-MM-dd"), endDate };
    case "custom":
      return { startDate: format(subDays(today, 29), "yyyy-MM-dd"), endDate };
  }
}

function loadFromSession<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = sessionStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToSession(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors
  }
}

export function useDateRange(billingPeriodStart?: string, billingPeriodEnd?: string) {
  const [preset, setPreset] = useState<DateRangePreset>(() =>
    loadFromSession(SESSION_STORAGE_KEYS.dateRange + "-preset", DEFAULT_DATE_PRESET),
  );
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const saved = loadFromSession<DateRange | null>(SESSION_STORAGE_KEYS.dateRange, null);
    if (saved) return saved;
    if (billingPeriodStart && billingPeriodEnd) {
      return { startDate: billingPeriodStart, endDate: billingPeriodEnd };
    }
    return computeDateRange(DEFAULT_DATE_PRESET);
  });

  // Persist to sessionStorage
  useEffect(() => {
    saveToSession(SESSION_STORAGE_KEYS.dateRange, dateRange);
    saveToSession(SESSION_STORAGE_KEYS.dateRange + "-preset", preset);
  }, [dateRange, preset]);

  const selectPreset = useCallback(
    (newPreset: DateRangePreset) => {
      setPreset(newPreset);
      if (newPreset !== "custom") {
        setDateRange(computeDateRange(newPreset));
      }
    },
    [],
  );

  const setCustomRange = useCallback((startDate: string, endDate: string) => {
    setPreset("custom");
    setDateRange({ startDate, endDate });
  }, []);

  return {
    dateRange,
    preset,
    selectPreset,
    setCustomRange,
  };
}
