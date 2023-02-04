import { test, expect, type Page } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://demo.playwright.dev/todomvc");
});

test.describe("Download button", () => {

  test("should display the correct text", async ({ page }) => {
    await page.locator(".todo-list li .toggle").first().check();
    await expect(
      page.getByRole("button", { name: "Clear completed" })
    ).toBeVisible();
  });

  test("should remove completed items when clicked", async ({ page }) => {
    const todoItems = page.getByTestId("todo-item");
    await todoItems.nth(1).getByRole("checkbox").check();
    await page.getByRole("button", { name: "Clear completed" }).click();
    await expect(todoItems).toHaveCount(2);
    await expect(todoItems).toHaveText([TODO_ITEMS[0], TODO_ITEMS[2]]);
  });

  test("should be hidden when there are no items that are completed", async ({
    page,
  }) => {
    await page.locator(".todo-list li .toggle").first().check();
    await page.getByRole("button", { name: "Clear completed" }).click();
    await expect(
      page.getByRole("button", { name: "Clear completed" })
    ).toBeHidden();
  });
});
