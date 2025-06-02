import { test, expect } from '@playwright/test';

test('Check inventory load time for performance_glitch_user', async ({ page }) => {
  const username = 'performance_glitch_user';
  const password = 'secret_sauce';

  // Start measuring time
  const start = Date.now();

  // Navigate and log in
  await page.goto('https://www.saucedemo.com/v1/');
  await page.fill('#user-name', username);
  await page.fill('#password', password);
  await page.click('#login-button');

  // Wait for inventory page to load
  await page.waitForSelector('.inventory_list');

  const end = Date.now();
  const duration = end - start;

  console.log(`Inventory page load time for ${username}: ${duration}ms`);

  // Optional: assert a max load time threshold
  expect(duration).toBeLessThan(5000); // Repeated running shows this to be around 5000ms
});