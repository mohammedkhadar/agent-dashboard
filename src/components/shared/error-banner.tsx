"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBannerProps {
  message?: string;
  onRetry?: () => void;
  isStale?: boolean;
}

export function ErrorBanner({
  message = "Something went wrong. Please try again.",
  onRetry,
  isStale,
}: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4"
    >
      <AlertCircle className="h-5 w-5 shrink-0 text-destructive" />
      <div className="flex-1">
        <p className="text-sm font-medium text-destructive">{message}</p>
        {isStale && (
          <p className="mt-1 text-xs text-muted-foreground">
            Showing cached data. Information may be outdated.
          </p>
        )}
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} aria-label="Retry loading data">
          <RefreshCw className="mr-1 h-3 w-3" />
          Retry
        </Button>
      )}
    </div>
  );
}
