import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000");
});

test.describe("Validation button", () => {
  test("should press the validate button for validating the json tree", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Actions" }).click();
    await page.isVisible("text='Load Study'");
    await page.isVisible(
      "text='Load a study from a JSON file on your computer.'"
    );
    const [fileChooser] = await Promise.all([
      // It is important to call waitForEvent before click to set up waiting.

      page.waitForEvent("filechooser"),
      // Opens the file chooser.
      page.getByText("Load Study").click(),
    ]);
    await fileChooser.setFiles(["./tests/feature/uploads/example.json"]);

    const locator = page.locator("main");

    await expect(locator.last()).toContainText("Loaded Successfully!", {
      timeout: 9000,
    });

    await page.getByRole("button", { name: "Validate Study" }).click();

    await page.waitForTimeout(1000);

    await expect(locator.last()).toContainText("Study is valid", {
      timeout: 9000,
    });
  });
});
