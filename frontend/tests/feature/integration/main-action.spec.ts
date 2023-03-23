import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000");
});

test.describe("Action button", () => {
  test("should open actions and view the option to save study", async ({
    page,
  }) => {
    // Start waiting for download before clicking. Note no await.
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Actions" }).click();
    await page.isVisible("text='Save Study'");
    await page.isVisible(
      "text='Save your study on your computer in a JSON file.'"
    );

    await page.getByText("Save Study").click();
    const download = await downloadPromise;
    // Wait for the download process to complete
    console.log(await download.path());
  });

  test("should open actions and view the option to load study", async ({
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
    await fileChooser.setFiles(["./tests/feature/uploads/test.json"]);
    const locator = page.locator("main");
    await expect(locator.last()).toContainText("Upload failed!", {
      timeout: 9000,
    });
  });
});
