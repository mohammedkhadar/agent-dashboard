import { test, expect } from "@playwright/test";

const AUTH = { email: "alice@acme.com", name: "Alice Chen", role: "admin" };

test.describe("Outcomes Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((auth) => {
      sessionStorage.setItem("auth", JSON.stringify(auth));
    }, AUTH);
  });
  test("displays session outcomes chart and error categories", async ({ page }) => {
    await page.goto("/outcomes");
    await expect(page.getByText("Session Outcomes")).toBeVisible();
    await expect(page.getByText("Top Error Categories")).toBeVisible();
  });

  test("shows outcome breakdown with counts", async ({ page }) => {
    await page.goto("/outcomes");
    await expect(page.getByText("success", { exact: true })).toBeVisible();
    await expect(page.getByText("error", { exact: true })).toBeVisible();
  });
});
