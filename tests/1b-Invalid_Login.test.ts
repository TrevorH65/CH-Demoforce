import { test, expect } from '@playwright/test'; // Correct import

test('login should fail with incorrect credentials', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/v1/');
  
    await page.fill('#user-name', 'invalid_user');
    await page.fill('#password', 'wrong_pass');
  
    await page.click('#login-button');
  
    // Expect an error message
    const error = page.locator('[data-test="error"]');
    await expect(error).toBeVisible();
    await expect(error).toContainText('Username and password do not match');
  });