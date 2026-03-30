import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { server } from "@/mocks/server";
import { apiClient } from "@/lib/api-client";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const MAX_P95_MS = 500;
const ITERATIONS = 50;

async function measureLatencies(
  fn: () => Promise<unknown>,
  iterations: number,
): Promise<number[]> {
  const latencies: number[] = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    latencies.push(performance.now() - start);
  }
  return latencies.sort((a, b) => a - b);
}

function p95(sorted: number[]): number {
  const idx = Math.ceil(sorted.length * 0.95) - 1;
  return sorted[idx]!;
}

describe("API p95 latency (< 500ms) per constitution Principle IV", () => {
  const startDate = "2026-03-01";
  const endDate = "2026-03-30";

  it("GET /api/org/profile p95 < 500ms", async () => {
    const latencies = await measureLatencies(
      () => apiClient.getOrgProfile(),
      ITERATIONS,
    );
    const p95Val = p95(latencies);
    expect(p95Val).toBeLessThan(MAX_P95_MS);
  });

  it("GET /api/usage/summary p95 < 500ms", async () => {
    const latencies = await measureLatencies(
      () => apiClient.getUsageSummary(startDate, endDate),
      ITERATIONS,
    );
    const p95Val = p95(latencies);
    expect(p95Val).toBeLessThan(MAX_P95_MS);
  });

  it("GET /api/usage/trends p95 < 500ms", async () => {
    const latencies = await measureLatencies(
      () => apiClient.getUsageTrends(startDate, endDate),
      ITERATIONS,
    );
    const p95Val = p95(latencies);
    expect(p95Val).toBeLessThan(MAX_P95_MS);
  });

  it("GET /api/usage/members p95 < 500ms", async () => {
    const latencies = await measureLatencies(
      () =>
        apiClient.getMemberUsage({
          startDate,
          endDate,
          page: 1,
          pageSize: 25,
          sortBy: "sessions",
          sortOrder: "desc",
        }),
      ITERATIONS,
    );
    const p95Val = p95(latencies);
    expect(p95Val).toBeLessThan(MAX_P95_MS);
  });

  it("GET /api/usage/outcomes p95 < 500ms", async () => {
    const latencies = await measureLatencies(
      () => apiClient.getOutcomes(startDate, endDate),
      ITERATIONS,
    );
    const p95Val = p95(latencies);
    expect(p95Val).toBeLessThan(MAX_P95_MS);
  });
});
