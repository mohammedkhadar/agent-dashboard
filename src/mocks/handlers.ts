import { http, HttpResponse } from "msw";
import {
  orgProfile,
  normalSummary,
  normalTrendPoints,
  normalMembers,
  normalOutcomes,
  normalErrorCategories,
} from "./fixtures";
import type { MemberUsage, SortBy, SortOrder } from "@/lib/types";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

function sortMembers(members: MemberUsage[], sortBy: SortBy, sortOrder: SortOrder): MemberUsage[] {
  const sorted = [...members].sort((a, b) => {
    let cmp = 0;
    switch (sortBy) {
      case "memberName":
        cmp = a.memberName.localeCompare(b.memberName);
        break;
      case "sessions":
        cmp = a.sessions - b.sessions;
        break;
      case "computeHours":
        cmp = a.computeHours - b.computeHours;
        break;
      case "totalTokens":
        cmp = a.totalTokens - b.totalTokens;
        break;
      case "successRate":
        cmp = a.successRate - b.successRate;
        break;
      case "lastActiveAt":
        cmp =
          (a.lastActiveAt ?? "").localeCompare(b.lastActiveAt ?? "");
        break;
    }
    return sortOrder === "asc" ? cmp : -cmp;
  });
  return sorted;
}

export const handlers = [
  // GET /api/org/profile
  http.get("/api/org/profile", () => {
    return HttpResponse.json({ data: orgProfile });
  }),

  // GET /api/usage/summary
  http.get("/api/usage/summary", ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    let summary = { ...normalSummary };
    if (startDate && endDate) {
      const days = Math.max(1, Math.round(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000,
      ));
      const scale = Math.min(1, days / 90);
      // Derive activeUserCount from actual member data to stay consistent with members endpoint
      const activeUserCount = normalMembers.filter((m) => {
        if (m.memberStatus === "removed") return false;
        if (m.sessions === 0) return false;
        if (!m.lastActiveAt) return false;
        const activeDate = m.lastActiveAt.slice(0, 10);
        return activeDate >= startDate && activeDate <= endDate;
      }).length;
      summary = {
        periodStart: startDate,
        periodEnd: endDate,
        totalSessions: Math.round(normalSummary.totalSessions * scale),
        totalComputeHours: Math.round(normalSummary.totalComputeHours * scale * 100) / 100,
        totalTokens: Math.round(normalSummary.totalTokens * scale),
        activeUserCount,
      };
    }

    return HttpResponse.json({ data: summary });
  }),

  // GET /api/usage/trends
  http.get("/api/usage/trends", ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    let points = normalTrendPoints;
    if (startDate && endDate) {
      points = normalTrendPoints.filter(
        (p) => p.date >= startDate && p.date <= endDate,
      );
    }

    return HttpResponse.json({
      data: {
        points,
      },
    });
  }),

  // GET /api/usage/members
  http.get("/api/usage/members", ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(
      url.searchParams.get("pageSize") ?? String(DEFAULT_PAGE_SIZE),
      10,
    );
    const sortBy = (url.searchParams.get("sortBy") ?? "sessions") as SortBy;
    const sortOrder = (url.searchParams.get("sortOrder") ?? "desc") as SortOrder;
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    let filtered = normalMembers;
    let scale = 1;
    if (startDate && endDate) {
      filtered = normalMembers.filter((m) => {
        if (!m.lastActiveAt) return false;
        const activeDate = m.lastActiveAt.slice(0, 10);
        return activeDate >= startDate && activeDate <= endDate;
      });
      const days = Math.max(1, Math.round(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000,
      ));
      scale = Math.min(1, days / 90);
    }

    const scaled = filtered.map((m) => ({
      ...m,
      sessions: Math.round(m.sessions * scale),
      computeHours: Math.round(m.computeHours * scale * 100) / 100,
      totalTokens: Math.round(m.totalTokens * scale),
    }));

    const sorted = sortMembers(scaled, sortBy, sortOrder);
    const start = (page - 1) * pageSize;
    const paged = sorted.slice(start, start + pageSize);

    return HttpResponse.json({
      data: {
        members: paged,
        pagination: {
          page,
          pageSize,
          totalItems: scaled.length,
          totalPages: Math.ceil(scaled.length / pageSize),
        },
      },
    });
  }),

  // GET /api/usage/outcomes
  http.get("/api/usage/outcomes", ({ request }) => {
    const url = new URL(request.url);
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    const baseTotalSessions = 4230;
    let scale = 1;
    if (startDate && endDate) {
      const days = Math.max(1, Math.round(
        (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86_400_000,
      ));
      scale = Math.min(1, days / 90);
    }

    const scaledTotal = Math.round(baseTotalSessions * scale);
    const outcomes = normalOutcomes.map((o) => {
      const count = Math.round(o.count * scale);
      return { ...o, count, percentage: scaledTotal > 0 ? Math.round(count / scaledTotal * 10000) / 100 : 0 };
    });
    const errorTotal = outcomes.find((o) => o.outcome === "error")?.count ?? 0;
    const errorCategories = normalErrorCategories.map((c) => {
      const count = Math.round(c.count * scale);
      return { ...c, count, percentage: errorTotal > 0 ? Math.round(count / errorTotal * 10000) / 100 : 0 };
    });

    return HttpResponse.json({
      data: {
        totalSessions: scaledTotal,
        outcomes,
        errorCategories,
      },
    });
  }),

  // POST /api/auth/login
  http.post("/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string };
    const { email, password } = body;

    const users = [
      { email: "alice@acme.com", password: "admin123", role: "admin", name: "Alice Chen" },
      { email: "bob@acme.com", password: "manager123", role: "manager", name: "Bob Martinez" },
      { email: "carol@acme.com", password: "billing123", role: "billing", name: "Carol White" },
      { email: "dave@acme.com", password: "member123", role: "member", name: "Dave Kim" },
    ];

    const user = users.find(
      (u) => u.email === email?.trim().toLowerCase() && u.password === password,
    );

    if (!user) {
      return HttpResponse.json(
        { error: { message: "Invalid email or password", code: "UNAUTHORIZED" } },
        { status: 401 },
      );
    }

    return HttpResponse.json({
      data: { email: user.email, name: user.name, role: user.role },
    });
  }),

  // POST /api/auth/logout
  http.post("/api/auth/logout", () => {
    return HttpResponse.json({ data: { success: true } });
  }),
];
