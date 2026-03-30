import { describe, it, expect } from "vitest";
import {
  formatNumber,
  formatComputeHours,
  formatTokenCount,
  formatPercentage,
  formatSuccessRate,
  formatDateInTimezone,
} from "@/lib/formatters";

describe("formatNumber", () => {
  it("formats with commas", () => {
    expect(formatNumber(1285)).toBe("1,285");
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(1000000)).toBe("1,000,000");
  });
});

describe("formatComputeHours", () => {
  it("formats to 2 decimal places", () => {
    expect(formatComputeHours(1285.5)).toBe("1285.50");
    expect(formatComputeHours(0)).toBe("0.00");
    expect(formatComputeHours(0.123)).toBe("0.12");
  });
});

describe("formatTokenCount", () => {
  it("formats millions as M", () => {
    expect(formatTokenCount(89420150)).toBe("89.4M");
    expect(formatTokenCount(1000000)).toBe("1.0M");
  });

  it("formats thousands as K", () => {
    expect(formatTokenCount(52300)).toBe("52.3K");
    expect(formatTokenCount(1000)).toBe("1.0K");
  });

  it("formats small numbers as-is", () => {
    expect(formatTokenCount(999)).toBe("999");
    expect(formatTokenCount(0)).toBe("0");
  });
});

describe("formatPercentage", () => {
  it("formats with 1 decimal by default", () => {
    expect(formatPercentage(90.07)).toBe("90.1%");
    expect(formatPercentage(100)).toBe("100.0%");
  });

  it("supports custom decimals", () => {
    expect(formatPercentage(90.076, 2)).toBe("90.08%");
  });
});

describe("formatSuccessRate", () => {
  it("converts 0-1 rate to percentage", () => {
    expect(formatSuccessRate(0.94)).toBe("94.0%");
    expect(formatSuccessRate(1)).toBe("100.0%");
    expect(formatSuccessRate(0)).toBe("0.0%");
  });
});

describe("formatDateInTimezone", () => {
  it("formats date in specified timezone", () => {
    const result = formatDateInTimezone("2026-03-15", "America/New_York");
    expect(result).toContain("Mar");
    expect(result).toContain("2026");
  });
});
