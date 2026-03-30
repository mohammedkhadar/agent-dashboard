"use client";

import { Activity, Clock, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkeletonCard } from "@/components/shared/skeleton-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { UsageSummary } from "@/lib/types";
import { formatNumber, formatComputeHours, formatTokenCount } from "@/lib/formatters";

interface SummaryCardsProps {
  data: UsageSummary | undefined;
  isLoading: boolean;
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

function MetricCard({ title, value, icon, iconBg, iconColor }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`rounded-md p-2 ${iconBg}`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

export function SummaryCards({ data, isLoading }: SummaryCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading summary data">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!data || (data.totalSessions === 0 && data.activeUserCount === 0)) {
    return (
      <EmptyState
        title="No usage data yet"
        message="Encourage your team to run their first agent session to see usage metrics here."
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Usage summary">
      <MetricCard
        title="Total Sessions"
        value={formatNumber(data.totalSessions)}
        icon={<Activity className="h-4 w-4" />}
        iconBg="bg-blue-100 dark:bg-blue-900/30"
        iconColor="text-blue-600 dark:text-blue-400"
      />
      <MetricCard
        title="Compute Hours"
        value={formatComputeHours(data.totalComputeHours)}
        icon={<Clock className="h-4 w-4" />}
        iconBg="bg-violet-100 dark:bg-violet-900/30"
        iconColor="text-violet-600 dark:text-violet-400"
      />
      <MetricCard
        title="Active Users"
        value={formatNumber(data.activeUserCount)}
        icon={<Users className="h-4 w-4" />}
        iconBg="bg-emerald-100 dark:bg-emerald-900/30"
        iconColor="text-emerald-600 dark:text-emerald-400"
      />
      <MetricCard
        title="Total Tokens"
        value={formatTokenCount(data.totalTokens)}
        icon={<Zap className="h-4 w-4" />}
        iconBg="bg-amber-100 dark:bg-amber-900/30"
        iconColor="text-amber-600 dark:text-amber-400"
      />
    </div>
  );
}
