import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemberTable } from "@/components/dashboard/member-table";
import type { MemberUsage, Pagination } from "@/lib/types";

const mockMembers: MemberUsage[] = [
  {
    memberId: "m-001",
    memberName: "Alice Chen",
    memberEmail: "alice@acme.com",
    memberStatus: "active",
    sessions: 312,
    computeHours: 95.4,
    totalTokens: 6520300,
    successRate: 0.94,
    lastActiveAt: "2026-03-29T14:23:00Z",
  },
  {
    memberId: "m-002",
    memberName: "Bob Martinez",
    memberEmail: "bob@acme.com",
    memberStatus: "removed",
    sessions: 150,
    computeHours: 46.5,
    totalTokens: 3100000,
    successRate: 0.88,
    lastActiveAt: "2026-03-20T10:00:00Z",
  },
  {
    memberId: "m-003",
    memberName: "Carol White",
    memberEmail: "carol@acme.com",
    memberStatus: "active",
    sessions: 0,
    computeHours: 0,
    totalTokens: 0,
    successRate: 0,
    lastActiveAt: null,
  },
];

const mockPagination: Pagination = {
  page: 1,
  pageSize: 25,
  totalItems: 30,
  totalPages: 2,
};

const defaultProps = {
  sortBy: "sessions" as const,
  sortOrder: "desc" as const,
  onSort: vi.fn(),
  onPageChange: vi.fn(),
  timezone: "America/New_York",
};

describe("MemberTable", () => {
  it("renders all members with correct columns", () => {
    render(
      <MemberTable
        members={mockMembers}
        pagination={mockPagination}
        isLoading={false}
        {...defaultProps}
      />,
    );

    expect(screen.getByText("Alice Chen")).toBeInTheDocument();
    expect(screen.getByText("Bob Martinez")).toBeInTheDocument();
    expect(screen.getByText("Carol White")).toBeInTheDocument();
    expect(screen.getByText("312")).toBeInTheDocument();
    expect(screen.getByText("6.5M")).toBeInTheDocument();
    expect(screen.getByText("94.0%")).toBeInTheDocument();
  });

  it("shows Removed badge for removed members", () => {
    render(
      <MemberTable
        members={mockMembers}
        pagination={mockPagination}
        isLoading={false}
        {...defaultProps}
      />,
    );
    expect(screen.getByText("Removed")).toBeInTheDocument();
  });

  it("shows 'No activity' for zero-session members", () => {
    render(
      <MemberTable
        members={mockMembers}
        pagination={mockPagination}
        isLoading={false}
        {...defaultProps}
      />,
    );
    expect(screen.getByText("No activity")).toBeInTheDocument();
  });

  it("calls onSort when clicking column header", () => {
    const onSort = vi.fn();
    render(
      <MemberTable
        members={mockMembers}
        pagination={mockPagination}
        isLoading={false}
        {...defaultProps}
        onSort={onSort}
      />,
    );

    fireEvent.click(screen.getByLabelText("Sort by Compute Hours"));
    expect(onSort).toHaveBeenCalledWith("computeHours");
  });

  it("renders pagination controls when totalPages > 1", () => {
    const onPageChange = vi.fn();
    render(
      <MemberTable
        members={mockMembers}
        pagination={mockPagination}
        isLoading={false}
        {...defaultProps}
        onPageChange={onPageChange}
      />,
    );

    expect(screen.getByText("Page 1 of 2 (30 members)")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("renders empty state when no members", () => {
    render(
      <MemberTable
        members={[]}
        pagination={undefined}
        isLoading={false}
        {...defaultProps}
      />,
    );
    expect(screen.getByText("No member data")).toBeInTheDocument();
  });

  it("renders loading skeleton", () => {
    render(
      <MemberTable
        members={undefined}
        pagination={undefined}
        isLoading={true}
        {...defaultProps}
      />,
    );
    const skeletons = document.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThanOrEqual(5);
  });
});
