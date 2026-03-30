import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrendCharts } from "@/components/dashboard/trend-charts";
import type { UsageTrendPoint } from "@/lib/types";

// Mock Recharts to avoid SVG rendering in jsdom
vi.mock("recharts", () => {
  const MockResponsiveContainer = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  );
  const MockLineChart = ({ children, ...props }: Record<string, unknown>) => (
    <div data-testid="line-chart" aria-label={String(props["aria-label"] ?? "")}>{children as React.ReactNode}</div>
  );
  const MockLine = (props: Record<string, unknown>) => <div data-testid="line" data-datakey={String(props.dataKey ?? "")} />;
  const MockXAxis = () => <div data-testid="x-axis" />;
  const MockYAxis = () => <div data-testid="y-axis" />;
  const MockCartesianGrid = () => <div data-testid="cartesian-grid" />;
  const MockTooltip = () => <div data-testid="tooltip" />;
  const MockLegend = () => <div data-testid="legend" />;

  return {
    ResponsiveContainer: MockResponsiveContainer,
    LineChart: MockLineChart,
    Line: MockLine,
    XAxis: MockXAxis,
    YAxis: MockYAxis,
    CartesianGrid: MockCartesianGrid,
    Tooltip: MockTooltip,
    Legend: MockLegend,
  };
});

const samplePoints: UsageTrendPoint[] = [
  { date: "2026-03-01", sessions: 142, computeHours: 43.2, tokens: 2980050 },
  { date: "2026-03-02", sessions: 0, computeHours: 0, tokens: 0 },
  { date: "2026-03-03", sessions: 155, computeHours: 47.1, tokens: 3200000 },
];

describe("TrendCharts", () => {
  it("renders combined bar chart with 3 series", () => {
    render(
      <TrendCharts
        data={{ points: samplePoints }}
        isLoading={false}
        timezone="America/New_York"
      />,
    );
    expect(screen.getByText("Usage Trends")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    const lines = screen.getAllByTestId("line");
    expect(lines).toHaveLength(3);
  });

  it("renders loading skeleton", () => {
    render(<TrendCharts data={undefined} isLoading={true} timezone="UTC" />);
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThanOrEqual(1);
  });

  it("renders empty state when no data", () => {
    render(<TrendCharts data={{ points: [] }} isLoading={false} timezone="UTC" />);
    expect(screen.getByText("No trend data")).toBeInTheDocument();
  });

  it("renders empty state when data is undefined", () => {
    render(<TrendCharts data={undefined} isLoading={false} timezone="UTC" />);
    expect(screen.getByText("No trend data")).toBeInTheDocument();
  });
});
