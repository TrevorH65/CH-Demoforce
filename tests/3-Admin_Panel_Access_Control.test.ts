import { test, expect } from '@playwright/test';

test('Access admin page only after login', async ({ page }) => {
  await page.goto('https://automationintesting.online/#/admin');
  await expect(page).toHaveURL(/.*login/);

  await page.fill('#username', 'admin');
  await page.fill('#password', 'password');
  await page.click('text=Login');
  await expect(page).toHaveURL(/.*admin/);
});