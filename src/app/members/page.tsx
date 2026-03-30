"use client";

import { useState, useCallback } from "react";
import { NavTabs } from "@/components/shared/nav-tabs";
import { ErrorBanner } from "@/components/shared/error-banner";
import { DateRangePicker } from "@/components/dashboard/date-range-picker";
import { MemberTable } from "@/components/dashboard/member-table";
import { RoleGuard } from "@/components/shared/role-guard";
import { UserMenu } from "@/components/shared/user-menu";
import { useOrgProfile } from "@/hooks/use-org-profile";
import { useMemberUsage } from "@/hooks/use-member-usage";
import { useDateRange } from "@/hooks/use-date-range";
import type { SortBy, SortOrder } from "@/lib/types";

export default function MembersPage() {
  const orgProfile = useOrgProfile();
  const { dateRange, preset, selectPreset } = useDateRange(
    orgProfile.data?.billingPeriodStart,
    orgProfile.data?.billingPeriodEnd,
  );

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy>("sessions");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const members = useMemberUsage({ dateRange, page, sortBy, sortOrder });

  const handleSort = useCallback(
    (column: SortBy) => {
      if (column === sortBy) {
        setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
      } else {
        setSortBy(column);
        setSortOrder("desc");
      }
      setPage(1);
    },
    [sortBy],
  );

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

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

        {members.isError && (
          <ErrorBanner
            message="Failed to load member data. Please try again."
            onRetry={() => members.refetch()}
            isStale={members.data !== undefined}
          />
        )}

        <MemberTable
          members={members.data?.members}
          pagination={members.data?.pagination}
          isLoading={members.isLoading}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onPageChange={handlePageChange}
          timezone={orgProfile.data?.timezone ?? "UTC"}
        />
      </div>
    </RoleGuard>
  );
}
