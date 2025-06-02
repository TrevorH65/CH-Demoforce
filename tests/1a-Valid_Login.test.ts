import { test, expect } from '@playwright/test';

const users = [
  'standard_user',
  'locked_out_user',
  'problem_user'
];

const PASSWORD = 'secret_sauce';

test.describe('Login test for allowed users', () => {
  for (const username of users) {
    test(`Login test for ${username}`, async ({ page }) => {
        await page.goto('https://www.saucedemo.com/v1/');
        await page.evaluate(() => localStorage.clear()); // Clear local storage
        await page.reload();

      // Fill in login form
      await page.fill('#user-name', username);
      await page.fill('#password', PASSWORD);
      await page.click('#login-button');

      if (username === 'locked_out_user') {
        // Expect error message
        await expect(page.locator('[data-test="error"]')).toBeVisible();
        console.log(`${username}: Login failed as expected.`);
      } else {
        // Expect inventory page to load
        const itemCount = await page.locator('.inventory_item').count();
        console.log(`Inventory item count: ${itemCount}`);
        expect(itemCount).toBeGreaterThan(0); // Check if count is greater than 0

        console.log(`${username}: Login successful.`);

      }
    });
  }
});