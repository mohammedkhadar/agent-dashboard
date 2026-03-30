"use client";

import { Globe } from "lucide-react";

interface TimezoneIndicatorProps {
  timezone: string;
}

export function TimezoneIndicator({ timezone }: TimezoneIndicatorProps) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Globe className="h-3 w-3" />
      <span>Times shown in {timezone}</span>
    </div>
  );
}
