"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { DateRange } from "@/lib/types";

export function useUsageTrends(dateRange: DateRange) {
  return useQuery({
    queryKey: ["usage-trends", dateRange.startDate, dateRange.endDate],
    queryFn: () =>
      apiClient.getUsageTrends(dateRange.startDate, dateRange.endDate),
    staleTime: 60 * 1000,
    select: (res) => res.data,
  });
}
