import { z } from "zod";

export const organizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  timezone: z.string(),
  billingPeriodStart: z.string(),
  billingPeriodEnd: z.string(),
});

export const usageSummarySchema = z.object({
  periodStart: z.string(),
  periodEnd: z.string(),
  totalSessions: z.number().int().min(0),
  totalComputeHours: z.number().min(0),
  totalTokens: z.number().int().min(0),
  activeUserCount: z.number().int().min(0),
});

const memberStatusSchema = z.enum(["active", "removed"]);

export const memberUsageSchema = z.object({
  memberId: z.string(),
  memberName: z.string(),
  memberEmail: z.string(),
  memberStatus: memberStatusSchema,
  sessions: z.number().int().min(0),
  computeHours: z.number().min(0),
  totalTokens: z.number().int().min(0),
  successRate: z.number().min(0).max(1),
  lastActiveAt: z.string().nullable(),
});

export const paginationSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  totalItems: z.number().int().min(0),
  totalPages: z.number().int().min(0),
});

export const usageTrendPointSchema = z.object({
  date: z.string(),
  sessions: z.number().int().min(0),
  computeHours: z.number().min(0),
  tokens: z.number().int().min(0),
});

const outcomeSchema = z.enum(["success", "error", "timeout", "cancelled"]);

export const outcomeDistributionSchema = z.object({
  outcome: outcomeSchema,
  count: z.number().int().min(0),
  percentage: z.number().min(0).max(100),
});

export const errorCategorySchema = z.object({
  category: z.string(),
  count: z.number().int().min(0),
  percentage: z.number().min(0).max(100),
});

// API response schemas
export const usageSummaryResponseSchema = z.object({
  data: usageSummarySchema,
});

export const usageTrendsResponseSchema = z.object({
  data: z.object({
    points: z.array(usageTrendPointSchema),
  }),
});

export const memberUsageResponseSchema = z.object({
  data: z.object({
    members: z.array(memberUsageSchema),
    pagination: paginationSchema,
  }),
});

export const outcomesResponseSchema = z.object({
  data: z.object({
    totalSessions: z.number().int().min(0),
    outcomes: z.array(outcomeDistributionSchema),
    errorCategories: z.array(errorCategorySchema),
  }),
});

export const orgProfileResponseSchema = z.object({
  data: organizationSchema,
});

export const apiErrorSchema = z.object({
  error: z.object({
    code: z.enum(["UNAUTHORIZED", "FORBIDDEN", "BAD_REQUEST", "INTERNAL_ERROR"]),
    message: z.string(),
  }),
});
