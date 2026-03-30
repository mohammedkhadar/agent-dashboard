import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserMenu } from "@/components/shared/user-menu";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

function renderWithQuery(ui: React.ReactElement) {
  const qc = new QueryClient();
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
});

describe("UserMenu", () => {
  it("renders nothing when no auth in sessionStorage", () => {
    const { container } = renderWithQuery(<UserMenu />);
    expect(container.innerHTML).toBe("");
  });

  it("renders user name and role when authenticated", () => {
    sessionStorage.setItem(
      "auth",
      JSON.stringify({ email: "alice@acme.com", role: "admin", name: "Alice Chen" }),
    );

    renderWithQuery(<UserMenu />);

    expect(screen.getByText("Alice Chen")).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();
  });

  it("renders fallback 'User' when name is missing", () => {
    sessionStorage.setItem(
      "auth",
      JSON.stringify({ email: "alice@acme.com", role: "admin" }),
    );

    renderWithQuery(<UserMenu />);

    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();
  });

  it("clears sessionStorage and redirects to /login on logout click", () => {
    sessionStorage.setItem(
      "auth",
      JSON.stringify({ email: "alice@acme.com", role: "admin", name: "Alice Chen" }),
    );

    renderWithQuery(<UserMenu />);

    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));

    expect(sessionStorage.getItem("auth")).toBeNull();
    expect(pushMock).toHaveBeenCalledWith("/login");
  });

  it("sign out button has accessible label", () => {
    sessionStorage.setItem(
      "auth",
      JSON.stringify({ email: "bob@acme.com", role: "manager", name: "Bob Martinez" }),
    );

    renderWithQuery(<UserMenu />);

    expect(screen.getByRole("button", { name: "Sign out" })).toBeInTheDocument();
  });
});
