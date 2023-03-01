import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000");
});

test.describe("Validation button", () => {
  test("should press the validate button for validating the json tree", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Validate Study" }).click();
    await page.waitForTimeout(500);

    const locator = page.locator("main");
    await expect(locator.last()).toContainText("Study is valid", {
      timeout: 9000,
    });
  });
});
