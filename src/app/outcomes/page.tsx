"use client";

import { NavTabs } from "@/components/shared/nav-tabs";
import { ErrorBanner } from "@/components/shared/error-banner";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";
import { OutcomeChart } from "@/components/dashboard/outcome-chart";
import { ErrorCategoryList } from "@/components/dashboard/error-category-list";
import { RoleGuard } from "@/components/shared/role-guard";
import { UserMenu } from "@/components/shared/user-menu";
import { useOrgProfile } from "@/hooks/use-org-profile";
import { useSessionOutcomes } from "@/hooks/use-session-outcomes";
import { useDateRange } from "@/hooks/use-date-range";

export default function OutcomesPage() {
  const orgProfile = useOrgProfile();
  const { dateRange, preset, selectPreset } = useDateRange(
    orgProfile.data?.billingPeriodStart,
    orgProfile.data?.billingPeriodEnd,
  );
  const outcomes = useSessionOutcomes(dateRange);

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

        {outcomes.isError && (
          <ErrorBanner
            message="Failed to load outcome data. Please try again."
            onRetry={() => outcomes.refetch()}
            isStale={outcomes.data !== undefined}
          />
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <OutcomeChart
            outcomes={outcomes.data?.outcomes}
            totalSessions={outcomes.data?.totalSessions}
            isLoading={outcomes.isLoading}
          />
          <ErrorCategoryList
            categories={outcomes.data?.errorCategories}
            isLoading={outcomes.isLoading}
          />
        </div>
      </div>
    </RoleGuard>
  );
}
