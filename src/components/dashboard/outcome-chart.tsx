"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import type { OutcomeDistribution } from "@/lib/types";
import { OUTCOME_COLORS } from "@/lib/constants";
import { formatNumber, formatPercentage } from "@/lib/formatters";

interface OutcomeChartProps {
  outcomes: OutcomeDistribution[] | undefined;
  totalSessions: number | undefined;
  isLoading: boolean;
}

function OutcomeTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: OutcomeDistribution }>;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const item = payload[0]?.payload;
  if (!item) return null;

  return (
    <div className="rounded-lg border bg-background px-3 py-2 shadow-md">
      <p className="text-sm font-semibold capitalize">{item.outcome}</p>
      <p className="text-xs text-muted-foreground">
        {formatNumber(item.count)} ({formatPercentage(item.percentage)})
      </p>
    </div>
  );
}

export function OutcomeChart({ outcomes, totalSessions, isLoading }: OutcomeChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="mx-auto h-[300px] w-[300px] rounded-full" />
        </CardContent>
      </Card>
    );
  }

  if (!outcomes || outcomes.length === 0) {
    return <EmptyState title="No outcome data" message="No sessions recorded in this period." />;
  }

  const chartData = outcomes.filter((o) => o.count > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Session Outcomes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div className="h-[300px] w-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart aria-label="Session outcomes donut chart">
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="count"
                  nameKey="outcome"
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.outcome}
                      fill={OUTCOME_COLORS[entry.outcome] ?? "#888"}
                      aria-label={`${entry.outcome}: ${formatNumber(entry.count)} sessions (${formatPercentage(entry.percentage)})`}
                    />
                  ))}
                </Pie>
                <Tooltip content={<OutcomeTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Total: {formatNumber(totalSessions ?? 0)} sessions
            </p>
            {outcomes.map((item) => (
              <div key={item.outcome} className="flex items-center gap-3">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: OUTCOME_COLORS[item.outcome] ?? "#888",
                  }}
                />
                <span className="w-20 text-sm capitalize">{item.outcome}</span>
                <span className="text-sm font-medium">{formatNumber(item.count)}</span>
                <span className="text-xs text-muted-foreground">
                  ({formatPercentage(item.percentage)})
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
