"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";

export function useOrgProfile() {
  return useQuery({
    queryKey: ["org-profile"],
    queryFn: () => apiClient.getOrgProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    select: (res) => res.data,
  });
}
