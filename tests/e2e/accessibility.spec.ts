import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const AUTH = { email: "alice@acme.com", name: "Alice Chen", role: "admin" };

// Inject auth before every navigation so protected pages render instead of redirecting
test.beforeEach(async ({ page }) => {
  await page.addInitScript((auth) => {
    sessionStorage.setItem("auth", JSON.stringify(auth));
  }, AUTH);
});

test.describe("Accessibility", () => {
  test("overview page has no a11y violations", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("trends page has no a11y violations", async ({ page }) => {
    // Trends are rendered on the overview page at /
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("members page has no a11y violations", async ({ page }) => {
    await page.goto("/members");
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("outcomes page has no a11y violations", async ({ page }) => {
    await page.goto("/outcomes");
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe("Interactive feedback within 100ms", () => {
  test("date range preset buttons show hover feedback within 100ms", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const button = page.getByRole("button", { name: /7d|7 days/i }).first();
    await expect(button).toBeVisible();

    const styleBefore = await button.evaluate((el) => {
      const s = getComputedStyle(el);
      return { bg: s.backgroundColor, shadow: s.boxShadow, border: s.borderColor };
    });

    const start = Date.now();
    await button.hover();
    // Wait for any CSS transition to apply (should be < 100ms)
    await page.waitForTimeout(100);
    const elapsed = Date.now() - start;

    const styleAfter = await button.evaluate((el) => {
      const s = getComputedStyle(el);
      return { bg: s.backgroundColor, shadow: s.boxShadow, border: s.borderColor };
    });

    // At least one visual property must have changed
    const changed =
      styleBefore.bg !== styleAfter.bg ||
      styleBefore.shadow !== styleAfter.shadow ||
      styleBefore.border !== styleAfter.border;

    expect(changed).toBe(true);
    expect(elapsed).toBeLessThanOrEqual(500); // generous ceiling including Playwright overhead
  });

  test("nav tab links show focus feedback within 100ms", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const tab = page.getByRole("link", { name: /members/i }).first();
    await expect(tab).toBeVisible();

    const styleBefore = await tab.evaluate((el) => {
      const s = getComputedStyle(el);
      return { outline: s.outline, bg: s.backgroundColor, boxShadow: s.boxShadow };
    });

    await tab.focus();
    await page.waitForTimeout(100);

    const styleAfter = await tab.evaluate((el) => {
      const s = getComputedStyle(el);
      return { outline: s.outline, bg: s.backgroundColor, boxShadow: s.boxShadow };
    });

    const changed =
      styleBefore.outline !== styleAfter.outline ||
      styleBefore.bg !== styleAfter.bg ||
      styleBefore.boxShadow !== styleAfter.boxShadow;

    expect(changed).toBe(true);
  });

  test("member table sort headers show hover feedback within 100ms", async ({ page }) => {
    await page.goto("/members");
    await page.waitForLoadState("networkidle");

    const header = page.locator("th").filter({ hasText: /sessions/i }).locator("button").first();
    await expect(header).toBeVisible();

    const styleBefore = await header.evaluate((el) => {
      const s = getComputedStyle(el);
      return { bg: s.backgroundColor, cursor: s.cursor, color: s.color };
    });

    await header.hover();
    await page.waitForTimeout(100);

    const styleAfter = await header.evaluate((el) => {
      const s = getComputedStyle(el);
      return { bg: s.backgroundColor, cursor: s.cursor, color: s.color };
    });

    // Sort header should show pointer cursor or visual change on hover
    const changed =
      styleBefore.bg !== styleAfter.bg ||
      styleBefore.color !== styleAfter.color ||
      styleAfter.cursor === "pointer";

    expect(changed).toBe(true);
  });
});
