import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000");
});

test.describe("Action button", () => {
  test("should open actions and view the option to Save study", async ({
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

  test("should open actions and view the option to Load study", async ({
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
  });

  
  test("should open actions and view the option to Download study", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Actions" }).click();
    await page.isVisible("text='Download'");
    await page.isVisible(
      "text='Download any study by its study id or permalink from the server.',"
    );

    await page
      .getByText(
        "Download any study by its study id or permalink from the server."
      )
      .click();

    // study id input
    await page.getByLabel("Study ID").fill("study_v3");

    await page.getByText("Next").click();

    // Expecting the "Close" text to be contained in the page
    await page.waitForTimeout(9000); // Wait for 9 seconds (9000 milliseconds)

    // Now use the expect function to check for the presence of the text
    await page.isVisible("text='Close'");
  });

  test("should open actions and view the option to Create redcap project study", async ({
    page,
  }) => {
    await page.getByRole("button", { name: "Actions" }).click();
    await page.isVisible("text='Load Study'");
    await page.isVisible(
      "text='Load a study from a JSON file on your computer.'"
    );
    // Load a study and validate it before creating a project on redcap for it
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

    // Try to create a redcap project for the study
    await page.getByRole("button", { name: "Actions" }).click();
    await page.isVisible("text='Create Redcap Project'");
    await page.isVisible(
      "text='Automagically creates a project in Redcap with your study and stores the responses from your participants in it.',"
    );

    await page.getByText("Create Redcap Project").click();

    // Username input
    await page.getByLabel("RedCap Username").fill("bassefa");

    await page.getByText("Next").click();

    // Expecting the "Visit RedCap" text to be contained in the page
    await page.waitForTimeout(9000); // Wait for 9 seconds (9000 milliseconds)

    // If everything works as expected then next stop is to visit redcap
    // Now use the expect function to check for the presence of the text
    await page.isVisible("text='Visit RedCap'");
  });
});
