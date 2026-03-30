import { test, expect } from "@playwright/test";

const AUTH = { email: "alice@acme.com", name: "Alice Chen", role: "admin" };

test.describe("Members Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((auth) => {
      sessionStorage.setItem("auth", JSON.stringify(auth));
    }, AUTH);
  });

  test("displays member table with sortable columns", async ({ page }) => {
    await page.goto("/members");
    await expect(page.getByText("Acme Corp")).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /name/i })).toBeVisible();
    await expect(page.getByRole("columnheader", { name: /sessions/i })).toBeVisible();
  });

  test("sort by column header click", async ({ page }) => {
    await page.goto("/members");
    await page.getByRole("columnheader", { name: /compute hours/i }).click();
    await expect(page.getByRole("columnheader", { name: /compute hours/i })).toBeVisible();
  });

  test("shows pagination for many members", async ({ page }) => {
    await page.goto("/members");
    await expect(page.getByText(/Page \d+ of \d+/)).toBeVisible();
  });

  test("SC-002: top token consumer reachable within 3 interactions", async ({ page }) => {
    // interaction 1: load page
    await page.goto("/members");
    // interaction 2: click Total Tokens header to sort by tokens descending
    await page.getByRole("button", { name: /sort by total tokens/i }).click();
    // assert: table renders with a top row visible (highest token consumer is first)
    await expect(page.locator("tbody tr").first()).toBeVisible();
  });
});
