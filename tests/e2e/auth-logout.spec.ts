import { test, expect } from "@playwright/test";

test.describe("Logout Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Log in first
    await page.goto("/login");
    await page.getByLabel("Email").fill("alice@acme.com");
    await page.getByLabel("Password").fill("admin123");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL("/");
  });

  test("displays user identity in the dashboard header", async ({ page }) => {
    await expect(page.getByText("Alice Chen")).toBeVisible();
    await expect(page.getByText("admin")).toBeVisible();
  });

  test("logout clears session and redirects to /login", async ({ page }) => {
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL("/login");
  });

  test("cannot access dashboard after logout without re-login", async ({ page }) => {
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL("/login");

    // Try to navigate back to the dashboard
    await page.goto("/");
    await expect(page).toHaveURL("/login");
  });

  test("user menu is visible on members page", async ({ page }) => {
    await page.getByText("Members").click();
    await expect(page).toHaveURL("/members");
    await expect(page.getByRole("paragraph").filter({ hasText: "Alice Chen" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
  });

  test("user menu is visible on outcomes page", async ({ page }) => {
    await page.getByText("Outcomes").click();
    await expect(page).toHaveURL("/outcomes");
    await expect(page.getByRole("paragraph").filter({ hasText: "Alice Chen" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
  });
});
