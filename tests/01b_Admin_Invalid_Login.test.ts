// This test script uses Playwright to automate the login process on a demo website.
// It tests the invalid login scenario

import { test, expect } from '@playwright/test';

test('Login via home page admin button with valid and invalid credentials', async ({ page }) => {
  // Go to home page
  await page.goto('https://automationintesting.online/');

  // Click the 'Admin' button in the header to navigate to login page
  await page.click('nav >> text=Admin');
  await expect(page).toHaveURL(/.*admin/);

  // Test invalid login
  await page.fill('#username', 'invalid');
  await page.fill('#password', 'invalid');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator('.alert')).toContainText('Invalid credentials');
});