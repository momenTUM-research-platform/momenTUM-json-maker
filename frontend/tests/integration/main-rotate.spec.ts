import { test, expect, type Page } from "@playwright/test";


test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:3000");
});

test.describe("Rotation button", () => {
  
  test("should allow rotating of nodes", async ({ page }) => {
    const nodes = await page.$$('.react-flow__node');
    const node = nodes[nodes.length - 1];
    const initialRotation = await node.evaluate((node) => node.style.transform);
   
    await page.getByRole("button", { name: "Rotate Canvas" }).click();
    await page.waitForTimeout(500);

    const updatedRotation = await node.evaluate((node) => node.style.transform);
    expect(updatedRotation).not.toMatch(initialRotation);
  });
});
