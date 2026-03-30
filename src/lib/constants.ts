import type { DateRangePreset } from "./types";

export const DATE_RANGE_PRESETS: { label: string; value: DateRangePreset }[] = [
  { label: "Last 7 days", value: "last7d" },
  { label: "Last 30 days", value: "last30d" },
  { label: "Last 90 days", value: "last90d" },
];

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;

export const DEFAULT_DATE_PRESET: DateRangePreset = "last30d";

export const SESSION_STORAGE_KEYS = {
  dateRange: "dashboard-date-range",
} as const;

export const OUTCOME_COLORS: Record<string, string> = {
  success: "hsl(var(--chart-success))",
  error: "hsl(var(--chart-error))",
  timeout: "hsl(var(--chart-timeout))",
  cancelled: "hsl(var(--chart-cancelled))",
};

export const TREND_COLORS = {
  sessions: "hsl(var(--chart-sessions))",
  computeHours: "hsl(var(--chart-compute))",
  tokens: "hsl(var(--chart-tokens))",
};
