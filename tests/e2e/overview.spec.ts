import { test, expect } from "@playwright/test";

const AUTH = { email: "alice@acme.com", name: "Alice Chen", role: "admin" };

test.describe("Overview Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((auth) => {
      sessionStorage.setItem("auth", JSON.stringify(auth));
    }, AUTH);
  });

  test("loads and displays 4 summary cards", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Total Sessions" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Compute Hours" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Active Users" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Total Tokens" })).toBeVisible();
  });

  test("shows navigation tabs", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Overview")).toBeVisible();
    await expect(page.getByText("Members")).toBeVisible();
    await expect(page.getByText("Outcomes")).toBeVisible();
  });

  test("navigates between sections", async ({ page }) => {
    await page.goto("/");
    await page.getByText("Members").click();
    await expect(page).toHaveURL("/members");
    await page.getByText("Outcomes").click();
    await expect(page).toHaveURL("/outcomes");
    await page.getByText("Overview").click();
    await expect(page).toHaveURL("/");
  });
});
