// Shared TypeScript interfaces for all API response types

export interface Organization {
  id: string;
  name: string;
  timezone: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
}

export interface UsageSummary {
  periodStart: string;
  periodEnd: string;
  totalSessions: number;
  totalComputeHours: number;
  totalTokens: number;
  activeUserCount: number;
}

export type MemberRole = "admin" | "manager" | "member" | "billing";
export type MemberStatus = "active" | "removed";

export interface Member {
  id: string;
  organizationId: string;
  name: string;
  email: string;
  role: MemberRole;
  status: MemberStatus;
  joinedAt: string;
}

export interface MemberUsage {
  memberId: string;
  memberName: string;
  memberEmail: string;
  memberStatus: MemberStatus;
  sessions: number;
  computeHours: number;
  totalTokens: number;
  successRate: number;
  lastActiveAt: string | null;
}

export interface UsageTrendPoint {
  date: string;
  sessions: number;
  computeHours: number;
  tokens: number;
}

export type SessionOutcome = "success" | "error" | "timeout" | "cancelled";

export interface OutcomeDistribution {
  outcome: SessionOutcome;
  count: number;
  percentage: number;
}

export interface ErrorCategory {
  category: string;
  count: number;
  percentage: number;
}

// API response wrappers
export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: {
    code: "UNAUTHORIZED" | "FORBIDDEN" | "BAD_REQUEST" | "INTERNAL_ERROR";
    message: string;
  };
}

export interface UsageSummaryResponse {
  data: UsageSummary;
}

export interface UsageTrendsResponse {
  data: {
    points: UsageTrendPoint[];
  };
}

export interface MemberUsageResponse {
  data: {
    members: MemberUsage[];
    pagination: Pagination;
  };
}

export interface OutcomesResponse {
  data: {
    totalSessions: number;
    outcomes: OutcomeDistribution[];
    errorCategories: ErrorCategory[];
  };
}

export interface OrgProfileResponse {
  data: Organization;
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export type SortBy =
  | "memberName"
  | "sessions"
  | "computeHours"
  | "totalTokens"
  | "successRate"
  | "lastActiveAt";

export type SortOrder = "asc" | "desc";

export type DateRangePreset = "last7d" | "last30d" | "last90d" | "custom";

export interface DateRange {
  startDate: string;
  endDate: string;
}

export type DashboardRole = "admin" | "manager" | "billing";
