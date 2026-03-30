"use client";

import { Button } from "@/components/ui/button";
import { DATE_RANGE_PRESETS } from "@/lib/constants";
import type { DateRangePreset } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  selectedPreset: DateRangePreset;
  onSelectPreset: (preset: DateRangePreset) => void;
  startDate?: string;
  endDate?: string;
}

export function DateRangePicker({
  selectedPreset,
  onSelectPreset
}: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-2" role="group" aria-label="Date range selection">
      {DATE_RANGE_PRESETS.filter((p) => p.value !== "custom").map((preset) => (
        <Button
          key={preset.value}
          variant={selectedPreset === preset.value ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectPreset(preset.value)}
          className={cn("text-xs")}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );
}
