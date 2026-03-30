import type {
  Organization,
  UsageSummary,
  UsageTrendPoint,
  MemberUsage,
  OutcomeDistribution,
  ErrorCategory,
} from "@/lib/types";

// --- Organization Profile ---
export const orgProfile: Organization = {
  id: "org-001",
  name: "Acme Corp",
  timezone: "America/New_York",
  billingPeriodStart: "2026-03-01",
  billingPeriodEnd: "2026-03-31",
};

// --- Usage Summary ---
export const normalSummary: UsageSummary = {
  periodStart: "2026-03-01",
  periodEnd: "2026-03-30",
  totalSessions: 4230,
  totalComputeHours: 1285.5,
  totalTokens: 89420150,
  activeUserCount: 28,
};

export const emptySummary: UsageSummary = {
  periodStart: "2026-03-01",
  periodEnd: "2026-03-30",
  totalSessions: 0,
  totalComputeHours: 0,
  totalTokens: 0,
  activeUserCount: 0,
};

// --- Trend Points (30 days of daily data) ---
function generateTrendPoints(days: number): UsageTrendPoint[] {
  const points: UsageTrendPoint[] = [];
  const baseDate = new Date("2025-12-31");

  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const multiplier = isWeekend ? 0.3 : 1;

    points.push({
      date: date.toISOString().split("T")[0]!,
      sessions: Math.round((120 + Math.random() * 60) * multiplier),
      computeHours: Math.round((35 + Math.random() * 20) * multiplier * 100) / 100,
      tokens: Math.round((2500000 + Math.random() * 1000000) * multiplier),
    });
  }
  return points;
}

export const normalTrendPoints = generateTrendPoints(90);
export const emptyTrendPoints: UsageTrendPoint[] = [];

// --- Members ---
const memberNames = [
  "Alice Chen", "Bob Martinez", "Carol White", "David Kim", "Eva Patel",
  "Frank Wilson", "Grace Lee", "Hank Brown", "Iris Taylor", "Jack Davis",
  "Kate Johnson", "Leo Thomas", "Mia Garcia", "Noah Anderson", "Olivia Moore",
  "Paul Jackson", "Quinn Harris", "Rachel Clark", "Sam Lewis", "Tara Robinson",
  "Uma Walker", "Vic Hall", "Wendy Allen", "Xander Young", "Yara King",
  "Zane Wright", "Amy Scott", "Ben Adams", "Carla Nelson", "Dylan Hill",
];

function generateMembers(count: number): MemberUsage[] {
  return Array.from({ length: count }, (_, i) => {
    const name = memberNames[i % memberNames.length]!;
    const isRemoved = i === count - 1 && count > 5;
    const hasNoActivity = i === count - 2 && count > 5;
    const sessions = hasNoActivity ? 0 : Math.round(300 - i * (250 / count) + Math.random() * 20);

    return {
      memberId: `member-${String(i + 1).padStart(3, "0")}`,
      memberName: name,
      memberEmail: `${name.toLowerCase().replace(" ", ".")}@acme.com`,
      memberStatus: isRemoved ? ("removed" as const) : ("active" as const),
      sessions,
      computeHours: Math.round(sessions * 0.31 * 100) / 100,
      totalTokens: sessions * Math.round(15000 + Math.random() * 10000),
      successRate: hasNoActivity ? 0 : Math.round((0.85 + Math.random() * 0.14) * 100) / 100,
      lastActiveAt: hasNoActivity
        ? null
        : `2026-03-${String(Math.max(1, 30 - i)).padStart(2, "0")}T${String(10 + (i % 12)).padStart(2, "0")}:${String(i * 7 % 60).padStart(2, "0")}:00Z`,
    };
  });
}

export const normalMembers = generateMembers(30);
export const smallOrgMembers = generateMembers(5);
export const largeOrgMembers = generateMembers(500);
export const emptyMembers: MemberUsage[] = [];

// --- Outcomes ---
export const normalOutcomes: OutcomeDistribution[] = [
  { outcome: "success", count: 3810, percentage: 90.07 },
  { outcome: "error", count: 253, percentage: 5.98 },
  { outcome: "timeout", count: 127, percentage: 3.0 },
  { outcome: "cancelled", count: 40, percentage: 0.95 },
];

export const allSuccessOutcomes: OutcomeDistribution[] = [
  { outcome: "success", count: 4230, percentage: 100 },
  { outcome: "error", count: 0, percentage: 0 },
  { outcome: "timeout", count: 0, percentage: 0 },
  { outcome: "cancelled", count: 0, percentage: 0 },
];

export const emptyOutcomes: OutcomeDistribution[] = [];

// --- Error Categories ---
export const normalErrorCategories: ErrorCategory[] = [
  { category: "context_limit_exceeded", count: 102, percentage: 40.32 },
  { category: "tool_execution_failed", count: 89, percentage: 35.18 },
  { category: "rate_limited", count: 62, percentage: 24.51 },
];

export const emptyErrorCategories: ErrorCategory[] = [];
