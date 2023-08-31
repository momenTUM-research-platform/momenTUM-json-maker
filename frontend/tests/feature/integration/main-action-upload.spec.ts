import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000");
});

test.describe("Action Upload button", () => {
  test("should open actions and view the option to Upload study and Show QR code study ", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Actions" }).click();
    await page.isVisible("text='Load Study'");
    await page.isVisible(
      "text='Load a study from a JSON file on your computer.'"
    );
    // Load a study and validate it before uploading it
    const [fileChooser] = await Promise.all([
      // It is important to call waitForEvent before click to set up waiting.
      page.waitForEvent("filechooser"),
      // Opens the file chooser.
      page.getByText("Load Study").click(),
    ]);

    // Load and confirm loading of the study
    await fileChooser.setFiles(["./tests/feature/uploads/example.json"]);
    const locator = page.locator("main");
    await expect(locator.last()).toContainText("Loaded Successfully!", {
      timeout: 9000,
    });

    // Validate the loaded study
    await page.getByRole("button", { name: "Validate Study" }).click();
    await page.waitForTimeout(1000);
    await expect(locator.last()).toContainText("Study is valid", {
      timeout: 9000,
    });

    // Try to upload the study, but since this study already exist, we expect
    // a return of "study already exists statemtent"
    await page.getByRole("button", { name: "Actions" }).click();
    await page.isVisible("text='Upload'");
    await page.isVisible(
      "text='Save your study on the server and receive a link you can share with anyone.',"
    );
    await page.getByText("Upload").click();

    // Expecting the "Go back to editor'" text to be contained in the page
    await page.waitForTimeout(9000); // Wait for 9 seconds (9000 milliseconds)

    // If it is successful, then the option to get QR code is visible
    await page.getByText("Get Download Link + QR-Code").click();

    // Close the dialog here
    await page.getByText("Go back to editor").click();

    // View the QR code of the study
    await page.getByRole("button", { name: "Actions" }).click();
    await page.isVisible("text='Show QR Code'");
    await page.isVisible(
      "text='See the QR code for the study you are currently working on. You can scan this code with the Momentum app to participate in the study.',"
    );

    await page.getByText("Show QR Code").click();

    // If there is a QR code to be displayed, then the option to get QR code is visible
    await page.isVisible("text='Go back to editor'");
  });
});
