import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000");
});

test.describe("Switch view button", () => {
  test("switch to calendar view", async ({ page }) => {
    // Wait for the graph view
    await page.waitForSelector('div[data-testid="rf__wrapper"]');

    // Assert that the graph view is displayed
    const calendarViewVisible = await page.isVisible(
      'div[data-testid="rf__wrapper"]'
    );
    expect(calendarViewVisible).toBe(true);

    // Click the button that switches to the calendar view
    await page.getByRole("button", { name: "Switch to calendar view" }).click();

    // Assert that the graph view is not displayed
    const calendarViewInVisible = await page.isHidden(
      'div[data-testid="rf__wrapper"]'
    );
    expect(calendarViewInVisible).toBe(true);

    // Click the button that switches to the react flow
    await page.getByRole("button", { name: "Switch to graph view" }).click();

    // Wait for the graph view to appear
    await page.waitForSelector('div[data-testid="rf__wrapper"]');

    // Assert that the calendar view is displayed
    const calendarViewVisibleAgain = await page.isVisible(
      'div[data-testid="rf__wrapper"]'
    );
    expect(calendarViewVisibleAgain).toBe(true);
  });
});
