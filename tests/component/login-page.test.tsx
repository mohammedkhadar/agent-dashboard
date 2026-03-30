import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "@/app/login/page";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

// Mock fetch globally
const fetchMock = vi.fn();
vi.stubGlobal("fetch", fetchMock);

beforeEach(() => {
  vi.clearAllMocks();
  sessionStorage.clear();
});

function mockLoginResponse(status: number, body: object) {
  fetchMock.mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
}

describe("LoginPage", () => {
  it("renders the login form with email and password fields", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
  });

  it("calls POST /api/auth/login and redirects on success", async () => {
    mockLoginResponse(200, {
      data: { email: "alice@acme.com", name: "Alice Chen", role: "admin" },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "alice@acme.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "admin123" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "alice@acme.com", password: "admin123" }),
      });
    });

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/");
    });

    const stored = JSON.parse(sessionStorage.getItem("auth")!);
    expect(stored).toEqual({ email: "alice@acme.com", role: "admin", name: "Alice Chen" });
  });

  it("displays error message on invalid credentials", async () => {
    mockLoginResponse(401, {
      error: { message: "Invalid email or password", code: "UNAUTHORIZED" },
    });

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "wrong@acme.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "bad" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid email or password")).toBeInTheDocument();
    });

    expect(pushMock).not.toHaveBeenCalled();
    expect(sessionStorage.getItem("auth")).toBeNull();
  });

  it("displays network error when fetch fails", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "alice@acme.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "admin123" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(screen.getByText("Network error. Please try again.")).toBeInTheDocument();
    });
  });

  it("disables submit button while loading", async () => {
    // Never resolve the fetch to keep the loading state
    fetchMock.mockReturnValueOnce(new Promise(() => {}));

    render(<LoginPage />);

    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "alice@acme.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "admin123" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Signing in..." })).toBeDisabled();
    });
  });
});
