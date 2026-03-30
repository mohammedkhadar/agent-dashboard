"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { TREND_COLORS } from "@/lib/constants";
import type { UsageTrendPoint } from "@/lib/types";
import { TrendTooltip } from "./trend-tooltip";

interface TrendChartsProps {
  data: { points: UsageTrendPoint[] } | undefined;
  isLoading: boolean;
  timezone: string;
}

export function TrendCharts({ data, isLoading, timezone }: TrendChartsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.points.length === 0) {
    return <EmptyState title="No trend data" message="No usage data for the selected period." />;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Usage Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.points} aria-label="Usage trends line chart">
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(d: string) => d.slice(5)}
                className="text-muted-foreground"
              />
              <YAxis
                yAxisId="left"
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                width={50}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 12 }}
                tickFormatter={(v: number) =>
                  v >= 1_000_000 ? `${(v / 1_000_000).toFixed(1)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)
                }
                className="text-muted-foreground"
                width={50}
              />
              <Tooltip content={<TrendTooltip timezone={timezone} />} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="computeHours" name="Compute Hours" stroke={TREND_COLORS.computeHours} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line yAxisId="left" type="monotone" dataKey="sessions" name="Sessions" stroke={TREND_COLORS.sessions} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
              <Line yAxisId="right" type="monotone" dataKey="tokens" name="Tokens" stroke={TREND_COLORS.tokens} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
