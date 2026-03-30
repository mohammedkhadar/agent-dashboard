"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { DateRange } from "@/lib/types";

export function useSessionOutcomes(dateRange: DateRange) {
  return useQuery({
    queryKey: ["session-outcomes", dateRange.startDate, dateRange.endDate],
    queryFn: () => apiClient.getOutcomes(dateRange.startDate, dateRange.endDate),
    staleTime: 60 * 1000,
    select: (res) => res.data,
  });
}
