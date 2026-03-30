import type { z } from "zod";
import type {
  SortBy,
  SortOrder,
} from "./types";
import {
  usageSummaryResponseSchema,
  usageTrendsResponseSchema,
  memberUsageResponseSchema,
  outcomesResponseSchema,
  orgProfileResponseSchema,
} from "./schemas";

export class ApiClientError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

async function request<T>(url: string, schema: z.ZodType<T>): Promise<T> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const code = body?.error?.code ?? "INTERNAL_ERROR";
    const message = body?.error?.message ?? `Request failed with status ${res.status}`;
    throw new ApiClientError(res.status, code, message);
  }

  const json: unknown = await res.json();
  return schema.parse(json);
}

function qs(params: Record<string, string | number | undefined>): string {
  const entries = Object.entries(params).filter(
    (entry): entry is [string, string | number] => entry[1] !== undefined,
  );
  if (entries.length === 0) return "";
  return "?" + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}

export const apiClient = {
  getUsageSummary(startDate: string, endDate: string) {
    return request(
      `/api/usage/summary${qs({ startDate, endDate })}`,
      usageSummaryResponseSchema,
    );
  },

  getUsageTrends(startDate: string, endDate: string) {
    return request(
      `/api/usage/trends${qs({ startDate, endDate })}`,
      usageTrendsResponseSchema,
    );
  },

  getMemberUsage(params: {
    startDate: string;
    endDate: string;
    page?: number;
    pageSize?: number;
    sortBy?: SortBy;
    sortOrder?: SortOrder;
  }) {
    return request(
      `/api/usage/members${qs(params)}`,
      memberUsageResponseSchema,
    );
  },

  getOutcomes(startDate: string, endDate: string) {
    return request(
      `/api/usage/outcomes${qs({ startDate, endDate })}`,
      outcomesResponseSchema,
    );
  },

  getOrgProfile() {
    return request("/api/org/profile", orgProfileResponseSchema);
  },
};
