"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { DateRange } from "@/lib/types";

export function useUsageSummary(dateRange: DateRange) {
  return useQuery({
    queryKey: ["usage-summary", dateRange.startDate, dateRange.endDate],
    queryFn: () => apiClient.getUsageSummary(dateRange.startDate, dateRange.endDate),
    staleTime: 60 * 1000,
    select: (res) => res.data,
  });
}
