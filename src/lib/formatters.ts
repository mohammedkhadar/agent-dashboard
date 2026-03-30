import { format, formatDistanceToNow } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatComputeHours(hours: number): string {
  return hours.toFixed(2);
}

export function formatTokenCount(tokens: number): string {
  if (tokens >= 1_000_000) {
    return `${(tokens / 1_000_000).toFixed(1)}M`;
  }
  if (tokens >= 1_000) {
    return `${(tokens / 1_000).toFixed(1)}K`;
  }
  return String(tokens);
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatSuccessRate(rate: number): string {
  return formatPercentage(rate * 100);
}

export function formatDateInTimezone(
  isoDate: string,
  timezone: string,
  formatStr = "MMM d, yyyy",
): string {
  const zonedDate = toZonedTime(new Date(isoDate), timezone);
  return format(zonedDate, formatStr);
}

export function formatDateTimeInTimezone(
  isoDate: string,
  timezone: string,
): string {
  return formatDateInTimezone(isoDate, timezone, "MMM d, yyyy h:mm a");
}

export function formatRelativeTime(isoDate: string): string {
  return formatDistanceToNow(new Date(isoDate), { addSuffix: true });
}
