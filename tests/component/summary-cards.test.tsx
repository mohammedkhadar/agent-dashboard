import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import type { UsageSummary } from "@/lib/types";

const normalData: UsageSummary = {
  periodStart: "2026-03-01",
  periodEnd: "2026-03-30",
  totalSessions: 4230,
  totalComputeHours: 1285.5,
  totalTokens: 89420150,
  activeUserCount: 42,
};

const emptyData: UsageSummary = {
  periodStart: "2026-03-01",
  periodEnd: "2026-03-30",
  totalSessions: 0,
  totalComputeHours: 0,
  totalTokens: 0,
  activeUserCount: 0,
};

describe("SummaryCards", () => {
  it("renders all 4 metric cards with formatted values", () => {
    render(<SummaryCards data={normalData} isLoading={false} />);

    expect(screen.getByText("Total Sessions")).toBeInTheDocument();
    expect(screen.getByText("4,230")).toBeInTheDocument();

    expect(screen.getByText("Compute Hours")).toBeInTheDocument();
    expect(screen.getByText("1285.50")).toBeInTheDocument();

    expect(screen.getByText("Active Users")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();

    expect(screen.getByText("Total Tokens")).toBeInTheDocument();
    expect(screen.getByText("89.4M")).toBeInTheDocument();
  });

  it("renders skeleton loading state", () => {
    render(<SummaryCards data={undefined} isLoading={true} />);
    expect(screen.getByLabelText("Loading summary data")).toBeInTheDocument();
  });

  it("renders empty state when data is zero", () => {
    render(<SummaryCards data={emptyData} isLoading={false} />);
    expect(screen.getByText("No usage data yet")).toBeInTheDocument();
  });

  it("renders empty state when data is undefined and not loading", () => {
    render(<SummaryCards data={undefined} isLoading={false} />);
    expect(screen.getByText("No usage data yet")).toBeInTheDocument();
  });
});
