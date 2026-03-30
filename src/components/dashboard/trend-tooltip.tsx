"use client";

import type { TooltipProps } from "recharts";
import { formatDateInTimezone, formatNumber } from "@/lib/formatters";

interface TrendTooltipProps extends TooltipProps<number, string> {
  timezone: string;
}

export function TrendTooltip({ active, payload, label, timezone }: TrendTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const dateStr = label as string;
  const formattedDate = formatDateInTimezone(dateStr, timezone, "EEEE, MMM d, yyyy");

  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
      <p className="text-xs text-muted-foreground">{formattedDate}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-sm font-semibold" style={{ color: entry.color }}>
          {entry.name}: {formatNumber(entry.value as number)}
        </p>
      ))}
    </div>
  );
}
