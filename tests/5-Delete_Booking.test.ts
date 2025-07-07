import { test, expect } from '@playwright/test';

test('Delete a booking and ensure it is gone', async ({ page }) => {
  // Log in
  await page.goto('https://automationintesting.online/#/admin');
  await page.fill('#username', 'admin');
  await page.fill('#password', 'password');
  await page.click('text=Login');

  const firstBooking = page.locator('.row .col-sm-12 >> nth=0');
  await expect(firstBooking).toBeVisible();

  // Delete booking
  await firstBooking.locator('button:has-text("Delete")').click();
  await expect(firstBooking).not.toBeVisible();
});