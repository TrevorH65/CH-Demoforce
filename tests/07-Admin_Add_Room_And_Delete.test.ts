import { test, expect } from '@playwright/test';

test('Admin creates and deletes a room', async ({ page }) => {
  // Visit home page
  await page.goto('https://automationintesting.online/');

  // Navigate to Admin Panel
  await page.getByRole('link', { name: 'Admin panel' }).click();

   // Login as admin
  await page.fill('#username', 'admin');
  await page.fill('#password', 'password');
  await page.click('#doLogin');

  // Wait for dashboard
  await expect(page.locator('text=Rooms')).toBeVisible();

  // Generate a unique room number
  const roomNumber = Math.floor(1000 + Math.random() * 9000).toString();

  // Fill the form to create a new room
  await page.fill('#roomName', roomNumber);
  await page.selectOption('#type', 'Single');
  await page.selectOption('#accessible', 'true');
  await page.fill('#roomPrice', '150');
  await page.check('#wifiCheckbox');
  await page.check('#tvCheckbox');
  await page.check('#safeCheckbox');
  await page.click('#createRoom');

// Wait 5 seconds to allow the room to be seen
  await page.waitForTimeout(5000);

  console.log('I have created room number: ' + roomNumber);

  // Confirm room appears in the admin listing table
  const roomNameLocator = page.locator(`#roomName${roomNumber}`);
  await expect(roomNameLocator).toHaveText(roomNumber);

  // Find the parent row for this room
  const roomRow = roomNameLocator.locator('..').locator('..'); // up to .row.detail

  // Click the delete control (span with class 'roomDelete') in this row
  await roomRow.locator('span.roomDelete').click();

  // Confirm the room is removed from the page
  await expect(roomNameLocator).toHaveCount(0);

  // Assert the room number is no longer present in the admin listing table
  await expect(roomNameLocator).not.toBeVisible();

// Wait 5 seconds to allow the user to see the room is deleted
  await page.waitForTimeout(5000);


});