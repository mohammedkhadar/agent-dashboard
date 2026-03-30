import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { server } from "@/mocks/server";
import { apiClient, ApiClientError } from "@/lib/api-client";
import { http, HttpResponse } from "msw";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("apiClient", () => {
  describe("getUsageSummary", () => {
    it("returns validated summary data", async () => {
      const result = await apiClient.getUsageSummary("2025-12-31", "2026-03-31");
      expect(result.data.totalSessions).toBe(4230);
      expect(result.data.totalComputeHours).toBe(1285.5);
      expect(result.data.totalTokens).toBe(89420150);
      expect(result.data.activeUserCount).toBe(28);
    });
  });

  describe("getOrgProfile", () => {
    it("returns org profile", async () => {
      const result = await apiClient.getOrgProfile();
      expect(result.data.name).toBe("Acme Corp");
      expect(result.data.timezone).toBe("America/New_York");
    });
  });

  describe("getUsageTrends", () => {
    it("returns trend data", async () => {
      const result = await apiClient.getUsageTrends("2026-03-01", "2026-03-30");
      expect(result.data.points.length).toBeGreaterThan(0);
    });
  });

  describe("getMemberUsage", () => {
    it("returns paginated member data", async () => {
      const result = await apiClient.getMemberUsage({
        startDate: "2026-03-01",
        endDate: "2026-03-30",
        page: 1,
        pageSize: 25,
      });
      expect(result.data.members.length).toBeLessThanOrEqual(25);
      expect(result.data.pagination.page).toBe(1);
    });
  });

  describe("getOutcomes", () => {
    it("returns outcome distribution", async () => {
      const result = await apiClient.getOutcomes("2025-12-31", "2026-03-31");
      expect(result.data.outcomes).toHaveLength(4);
      expect(result.data.totalSessions).toBe(4230);
    });
  });

  describe("error handling", () => {
    it("throws ApiClientError on HTTP error", async () => {
      server.use(
        http.get("/api/usage/summary", () => {
          return HttpResponse.json(
            { error: { code: "FORBIDDEN", message: "Access denied" } },
            { status: 403 },
          );
        }),
      );

      await expect(
        apiClient.getUsageSummary("2026-03-01", "2026-03-30"),
      ).rejects.toThrow(ApiClientError);
    });

    it("throws on Zod validation failure", async () => {
      server.use(
        http.get("/api/usage/summary", () => {
          return HttpResponse.json({ data: { invalid: true } });
        }),
      );

      await expect(
        apiClient.getUsageSummary("2026-03-01", "2026-03-30"),
      ).rejects.toThrow();
    });
  });
});
