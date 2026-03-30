import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { server } from "@/mocks/server";
import { http, HttpResponse } from "msw";
import { useUsageSummary } from "@/hooks/use-usage-summary";
import { useUsageTrends } from "@/hooks/use-usage-trends";
import { useMemberUsage } from "@/hooks/use-member-usage";
import { useSessionOutcomes } from "@/hooks/use-session-outcomes";
import { useOrgProfile } from "@/hooks/use-org-profile";
import type { ReactNode } from "react";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const dateRange = { startDate: "2025-12-31", endDate: "2026-03-31" };

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );
  };
}

describe("Integration: hook → API client → MSW → Zod → rendered state", () => {
  describe("GET /api/org/profile", () => {
    it("returns validated org profile on success", async () => {
      const { result } = renderHook(() => useOrgProfile(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.name).toBe("Acme Corp");
      expect(result.current.data?.timezone).toBe("America/New_York");
      expect(result.current.data?.billingPeriodStart).toBe("2026-03-01");
    });

    it("exposes error state when API returns 500", async () => {
      server.use(
        http.get("/api/org/profile", () =>
          HttpResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Server failure" } },
            { status: 500 },
          ),
        ),
      );

      const { result } = renderHook(() => useOrgProfile(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(result.current.data).toBeUndefined();
    });

    it("exposes error state on Zod validation failure", async () => {
      server.use(
        http.get("/api/org/profile", () =>
          HttpResponse.json({ data: { invalid: true } }),
        ),
      );

      const { result } = renderHook(() => useOrgProfile(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });
  });

  describe("GET /api/usage/summary", () => {
    it("returns validated summary data on success", async () => {
      const { result } = renderHook(() => useUsageSummary(dateRange), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.totalSessions).toBe(4230);
      expect(result.current.data?.totalComputeHours).toBe(1285.5);
      expect(result.current.data?.totalTokens).toBe(89420150);
      expect(result.current.data?.activeUserCount).toBe(28);
    });

    it("exposes error state when API returns 403", async () => {
      server.use(
        http.get("/api/usage/summary", () =>
          HttpResponse.json(
            { error: { code: "FORBIDDEN", message: "Access denied" } },
            { status: 403 },
          ),
        ),
      );

      const { result } = renderHook(() => useUsageSummary(dateRange), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });

    it("exposes error state on Zod validation failure", async () => {
      server.use(
        http.get("/api/usage/summary", () =>
          HttpResponse.json({ data: { badField: "oops" } }),
        ),
      );

      const { result } = renderHook(() => useUsageSummary(dateRange), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });
  });

  describe("GET /api/usage/trends", () => {
    it("returns validated trend points on success", async () => {
      const { result } = renderHook(() => useUsageTrends(dateRange), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.points.length).toBeGreaterThan(0);
      const point = result.current.data!.points[0]!;
      expect(point).toHaveProperty("date");
      expect(point).toHaveProperty("sessions");
      expect(point).toHaveProperty("computeHours");
      expect(point).toHaveProperty("tokens");
    });

    it("exposes error state when API returns 500", async () => {
      server.use(
        http.get("/api/usage/trends", () =>
          HttpResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Server failure" } },
            { status: 500 },
          ),
        ),
      );

      const { result } = renderHook(() => useUsageTrends(dateRange), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });

    it("exposes error state on Zod validation failure", async () => {
      server.use(
        http.get("/api/usage/trends", () =>
          HttpResponse.json({ data: { points: [{ invalid: true }] } }),
        ),
      );

      const { result } = renderHook(() => useUsageTrends(dateRange), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });
  });

  describe("GET /api/usage/members", () => {
    it("returns validated paginated member data on success", async () => {
      const { result } = renderHook(
        () =>
          useMemberUsage({
            dateRange,
            page: 1,
            sortBy: "sessions",
            sortOrder: "desc",
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.members.length).toBeGreaterThan(0);
      expect(result.current.data?.pagination.page).toBe(1);
      expect(result.current.data?.pagination.pageSize).toBe(10);
      const member = result.current.data!.members[0]!;
      expect(member).toHaveProperty("memberId");
      expect(member).toHaveProperty("sessions");
      expect(member).toHaveProperty("successRate");
    });

    it("exposes error state when API returns 401", async () => {
      server.use(
        http.get("/api/usage/members", () =>
          HttpResponse.json(
            { error: { code: "UNAUTHORIZED", message: "Token expired" } },
            { status: 401 },
          ),
        ),
      );

      const { result } = renderHook(
        () =>
          useMemberUsage({
            dateRange,
            page: 1,
            sortBy: "sessions",
            sortOrder: "desc",
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => expect(result.current.isError).toBe(true));
    });

    it("exposes error state on Zod validation failure", async () => {
      server.use(
        http.get("/api/usage/members", () =>
          HttpResponse.json({
            data: { members: [{ bad: true }], pagination: {} },
          }),
        ),
      );

      const { result } = renderHook(
        () =>
          useMemberUsage({
            dateRange,
            page: 1,
            sortBy: "sessions",
            sortOrder: "desc",
          }),
        { wrapper: createWrapper() },
      );

      await waitFor(() => expect(result.current.isError).toBe(true));
    });
  });

  describe("GET /api/usage/outcomes", () => {
    it("returns validated outcome distribution on success", async () => {
      const { result } = renderHook(() => useSessionOutcomes(dateRange), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.outcomes).toHaveLength(4);
      expect(result.current.data?.totalSessions).toBe(4230);
      expect(result.current.data?.errorCategories.length).toBeGreaterThan(0);
    });

    it("exposes error state when API returns 500", async () => {
      server.use(
        http.get("/api/usage/outcomes", () =>
          HttpResponse.json(
            { error: { code: "INTERNAL_ERROR", message: "Server failure" } },
            { status: 500 },
          ),
        ),
      );

      const { result } = renderHook(() => useSessionOutcomes(dateRange), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });

    it("exposes error state on Zod validation failure", async () => {
      server.use(
        http.get("/api/usage/outcomes", () =>
          HttpResponse.json({
            data: { totalSessions: "not a number", outcomes: [] },
          }),
        ),
      );

      const { result } = renderHook(() => useSessionOutcomes(dateRange), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
    });
  });
});
