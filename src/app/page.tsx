"use client";

import { NavTabs } from "@/components/shared/nav-tabs";
import { ErrorBanner } from "@/components/shared/error-banner";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { TrendCharts } from "@/components/dashboard/trend-charts";
import { RoleGuard } from "@/components/shared/role-guard";
import { UserMenu } from "@/components/shared/user-menu";
import { useOrgProfile } from "@/hooks/use-org-profile";
import { useUsageSummary } from "@/hooks/use-usage-summary";
import { useUsageTrends } from "@/hooks/use-usage-trends";
import { useDateRange } from "@/hooks/use-date-range";

export default function DashboardPage() {
  const orgProfile = useOrgProfile();
  const { dateRange, preset, selectPreset } = useDateRange(
    orgProfile.data?.billingPeriodStart,
    orgProfile.data?.billingPeriodEnd,
  );
  const summary = useUsageSummary(dateRange);
  const trends = useUsageTrends(dateRange);

  return (
    <RoleGuard>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {orgProfile.data?.name ?? "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <DateRangePicker
              selectedPreset={preset}
              onSelectPreset={selectPreset}
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
            />
            <UserMenu />
          </div>
        </div>

        <NavTabs />

        {summary.isError && (
          <ErrorBanner
            message="Failed to load usage summary. Please try again."
            onRetry={() => summary.refetch()}
            isStale={summary.data !== undefined}
          />
        )}

        <SummaryCards data={summary.data} isLoading={summary.isLoading} />

        {trends.isError && (
          <ErrorBanner
            message="Failed to load trend data. Please try again."
            onRetry={() => trends.refetch()}
            isStale={trends.data !== undefined}
          />
        )}

        <TrendCharts
          data={trends.data}
          isLoading={trends.isLoading}
          timezone={orgProfile.data?.timezone ?? "UTC"}
        />
      </div>
    </RoleGuard>
  );
}
