"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import type { MemberUsage, Pagination, SortBy, SortOrder } from "@/lib/types";
import {
  formatNumber,
  formatComputeHours,
  formatTokenCount,
  formatSuccessRate,
  formatDateTimeInTimezone,
} from "@/lib/formatters";

interface MemberTableProps {
  members: MemberUsage[] | undefined;
  pagination: Pagination | undefined;
  isLoading: boolean;
  sortBy: SortBy;
  sortOrder: SortOrder;
  onSort: (column: SortBy) => void;
  onPageChange: (page: number) => void;
  timezone: string;
}

interface SortableHeaderProps {
  label: string;
  column: SortBy;
  currentSort: SortBy;
  currentOrder: SortOrder;
  onSort: (column: SortBy) => void;
}

function SortableHeader({ label, column, currentSort, currentOrder, onSort }: SortableHeaderProps) {
  const isActive = currentSort === column;
  const Icon = isActive ? (currentOrder === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;

  return (
    <button
      className="flex items-center gap-1 font-medium hover:text-foreground"
      onClick={() => onSort(column)}
      aria-label={`Sort by ${label}`}
    >
      {label}
      <Icon className="h-3 w-3" />
    </button>
  );
}

export function MemberTable({
  members,
  pagination,
  isLoading,
  sortBy,
  sortOrder,
  onSort,
  onPageChange,
  timezone,
}: MemberTableProps) {
  if (isLoading && !members) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!members || members.length === 0) {
    return (
      <EmptyState
        title="No member data"
        message="No member usage data available for the selected period."
      />
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortableHeader
                label="Name"
                column="memberName"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                label="Sessions"
                column="sessions"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                label="Compute Hours"
                column="computeHours"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                label="Total Tokens"
                column="totalTokens"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                label="Success Rate"
                column="successRate"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                label="Last Active"
                column="lastActiveAt"
                currentSort={sortBy}
                currentOrder={sortOrder}
                onSort={onSort}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.memberId}>
              <TableCell className="font-medium">
                {member.memberName}
                {member.memberStatus === "removed" && (
                  <Badge variant="secondary" className="ml-2">
                    Removed
                  </Badge>
                )}
              </TableCell>
              <TableCell>{formatNumber(member.sessions)}</TableCell>
              <TableCell>{formatComputeHours(member.computeHours)}</TableCell>
              <TableCell>{formatTokenCount(member.totalTokens)}</TableCell>
              <TableCell>{formatSuccessRate(member.successRate)}</TableCell>
              <TableCell>
                {member.lastActiveAt
                  ? formatDateTimeInTimezone(member.lastActiveAt, timezone)
                  : "No activity"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.totalPages} ({pagination.totalItems} members)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
              aria-label="Next page"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
