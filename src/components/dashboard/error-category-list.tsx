"use client";

import { PartyPopper } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import type { ErrorCategory } from "@/lib/types";
import { formatNumber, formatPercentage } from "@/lib/formatters";

interface ErrorCategoryListProps {
  categories: ErrorCategory[] | undefined;
  isLoading: boolean;
}

function formatCategoryLabel(raw: string): string {
  return raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ErrorCategoryList({ categories, isLoading }: ErrorCategoryListProps) {
  if (isLoading) return null;

  if (!categories || categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-medium">Error Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyState
            title="No errors!"
            message="All sessions completed successfully. Great job!"
            icon={<PartyPopper className="h-12 w-12" />}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Top Error Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.category} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>{formatCategoryLabel(cat.category)}</span>
              <span className="font-medium">
                {formatNumber(cat.count)} ({formatPercentage(cat.percentage)})
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-destructive"
                style={{ width: `${Math.min(cat.percentage, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
