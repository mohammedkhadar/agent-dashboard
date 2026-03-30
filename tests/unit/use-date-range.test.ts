import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDateRange } from "@/hooks/use-date-range";

// Mock sessionStorage
const mockStorage = new Map<string, string>();
vi.stubGlobal("sessionStorage", {
  getItem: (key: string) => mockStorage.get(key) ?? null,
  setItem: (key: string, value: string) => mockStorage.set(key, value),
  removeItem: (key: string) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
});

describe("useDateRange", () => {
  beforeEach(() => {
    mockStorage.clear();
  });

  it("starts with last30d preset by default", () => {
    const { result } = renderHook(() => useDateRange());
    expect(result.current.preset).toBe("last30d");
    expect(result.current.dateRange.startDate).toBeTruthy();
    expect(result.current.dateRange.endDate).toBeTruthy();
  });

  it("changes preset and updates date range", () => {
    const { result } = renderHook(() => useDateRange());
    act(() => {
      result.current.selectPreset("last7d");
    });
    expect(result.current.preset).toBe("last7d");
  });

  it("sets custom range", () => {
    const { result } = renderHook(() => useDateRange());
    act(() => {
      result.current.setCustomRange("2026-01-01", "2026-01-31");
    });
    expect(result.current.preset).toBe("custom");
    expect(result.current.dateRange.startDate).toBe("2026-01-01");
    expect(result.current.dateRange.endDate).toBe("2026-01-31");
  });

  it("persists to sessionStorage", () => {
    const { result } = renderHook(() => useDateRange());
    act(() => {
      result.current.selectPreset("last7d");
    });
    expect(mockStorage.size).toBeGreaterThan(0);
  });
});
