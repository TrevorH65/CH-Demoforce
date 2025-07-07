import { test, expect } from '@playwright/test';

test('Submit contact form and verify in admin', async ({ page }) => {
  await page.goto('https://automationintesting.online/');
  await page.fill('#name', 'Test User');
  await page.fill('#email', 'test@example.com');
  await page.fill('#phone', '12345678901');
  await page.fill('#subject', 'Testing Message');
  await page.fill('#description', 'This is a test message of more than 20 characters.');
  await page.click('text=Submit');

// Verify success message appears
await expect(page.locator('#contact h3')).toContainText('Thanks for getting in touch');
});