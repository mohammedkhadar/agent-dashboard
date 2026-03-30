"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { DateRange, SortBy, SortOrder } from "@/lib/types";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

interface UseMemberUsageParams {
  dateRange: DateRange;
  page: number;
  pageSize?: number;
  sortBy: SortBy;
  sortOrder: SortOrder;
}

export function useMemberUsage({
  dateRange,
  page,
  pageSize = DEFAULT_PAGE_SIZE,
  sortBy,
  sortOrder,
}: UseMemberUsageParams) {
  return useQuery({
    queryKey: [
      "member-usage",
      dateRange.startDate,
      dateRange.endDate,
      page,
      pageSize,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      apiClient.getMemberUsage({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        page,
        pageSize,
        sortBy,
        sortOrder,
      }),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
    select: (res) => res.data,
  });
}
