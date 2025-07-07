import { test, expect } from '@playwright/test';

test('Admin adds a new numbered room and verifies it exists', async ({ page }) => {
  // Visit home page
  await page.goto('https://automationintesting.online/');

  // Navigate to Admin Panel
  await page.getByRole('link', { name: 'Admin panel' }).click();

  // Login as admin
  await page.fill('input[name="username"]', 'admin');
  await page.fill('input[name="password"]', 'password');
  await page.getByRole('button', { name: 'Log in' }).click();

  // Wait for dashboard to be visible
  await expect(page.locator('text=Rooms')).toBeVisible();

  // Define unique room number to avoid duplication issues
  const roomNumber = Math.floor(1000 + Math.random() * 9000).toString();

  // Fill out new room form
  await page.fill('input[name="roomNumber"]', roomNumber);
  await page.fill('input[name="type"]', 'Single');
  await page.selectOption('select[name="accessible"]', 'true'); // true or false
  await page.fill('input[name="roomPrice"]', '150');
  await page.check('input[name="wifi"]');
  await page.check('input[name="tv"]');
  await page.check('input[name="safe"]');

  // Create the room
  await page.getByRole('button', { name: 'Create' }).click();

  // Confirm the room appears in the list
  const roomCard = page.locator('.room-info').filter({ hasText: roomNumber });
  await expect(roomCard).toBeVisible();
});