import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { OutcomeChart } from "@/components/dashboard/outcome-chart";
import { ErrorCategoryList } from "@/components/dashboard/error-category-list";
import type { OutcomeDistribution, ErrorCategory } from "@/lib/types";

// Mock Recharts
vi.mock("recharts", () => {
  const MockResponsiveContainer = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  );
  const MockPieChart = ({ children, ...props }: Record<string, unknown>) => (
    <div data-testid="pie-chart" aria-label={String(props["aria-label"] ?? "")}>{children as React.ReactNode}</div>
  );
  const MockPie = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pie">{children}</div>
  );
  const MockCell = () => <div data-testid="cell" />;
  const MockTooltip = () => <div data-testid="tooltip" />;

  return {
    ResponsiveContainer: MockResponsiveContainer,
    PieChart: MockPieChart,
    Pie: MockPie,
    Cell: MockCell,
    Tooltip: MockTooltip,
  };
});

const normalOutcomes: OutcomeDistribution[] = [
  { outcome: "success", count: 3810, percentage: 90.07 },
  { outcome: "error", count: 253, percentage: 5.98 },
  { outcome: "timeout", count: 127, percentage: 3.0 },
  { outcome: "cancelled", count: 40, percentage: 0.95 },
];



const normalErrors: ErrorCategory[] = [
  { category: "context_limit_exceeded", count: 102, percentage: 40.32 },
  { category: "tool_execution_failed", count: 89, percentage: 35.18 },
  { category: "rate_limited", count: 62, percentage: 24.51 },
];

describe("OutcomeChart", () => {
  it("renders donut chart with outcome segments and legend", () => {
    render(
      <OutcomeChart outcomes={normalOutcomes} totalSessions={4230} isLoading={false} />,
    );

    expect(screen.getByText("Session Outcomes")).toBeInTheDocument();
    expect(screen.getByText("Total: 4,230 sessions")).toBeInTheDocument();
    expect(screen.getByText("3,810")).toBeInTheDocument();
    expect(screen.getByText("success")).toBeInTheDocument();
    expect(screen.getByText("error")).toBeInTheDocument();
    expect(screen.getByText("timeout")).toBeInTheDocument();
    expect(screen.getByText("cancelled")).toBeInTheDocument();
  });

  it("renders empty state when no outcomes", () => {
    render(<OutcomeChart outcomes={[]} totalSessions={0} isLoading={false} />);
    expect(screen.getByText("No outcome data")).toBeInTheDocument();
  });

  it("renders loading skeleton", () => {
    render(<OutcomeChart outcomes={undefined} totalSessions={undefined} isLoading={true} />);
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThanOrEqual(1);
  });
});

describe("ErrorCategoryList", () => {
  it("renders ranked error categories", () => {
    render(<ErrorCategoryList categories={normalErrors} isLoading={false} />);

    expect(screen.getByText("Top Error Categories")).toBeInTheDocument();
    expect(screen.getByText("Context Limit Exceeded")).toBeInTheDocument();
    expect(screen.getByText("Tool Execution Failed")).toBeInTheDocument();
    expect(screen.getByText("Rate Limited")).toBeInTheDocument();
  });

  it("shows congratulatory empty state when no errors", () => {
    render(<ErrorCategoryList categories={[]} isLoading={false} />);
    expect(screen.getByText("No errors!")).toBeInTheDocument();
    expect(
      screen.getByText("All sessions completed successfully. Great job!"),
    ).toBeInTheDocument();
  });
});
