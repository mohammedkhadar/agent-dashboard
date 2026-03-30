import { test, expect } from "@playwright/test";

const AUTH = { email: "alice@acme.com", name: "Alice Chen", role: "admin" };

test.describe("Trends on Overview Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((auth) => {
      sessionStorage.setItem("auth", JSON.stringify(auth));
    }, AUTH);
  });
  test("displays trend charts on the overview page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Usage Trends")).toBeVisible();
  });
});
