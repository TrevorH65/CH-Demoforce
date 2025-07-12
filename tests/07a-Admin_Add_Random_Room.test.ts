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

  // Generate random room data
  const roomNumber = Math.floor(1000 + Math.random() * 9000).toString();
  const types = ['Single', 'Twin', 'Double', 'Family', 'Suite'];
  const type = types[Math.floor(Math.random() * types.length)];
  const accessible = Math.random() > 0.5 ? 'true' : 'false';
  const price = (100 + Math.floor(Math.random() * 200)).toString();
  const features = [
    { id: '#wifiCheckbox', enabled: Math.random() > 0.5 },
    { id: '#tvCheckbox', enabled: Math.random() > 0.5 },
    { id: '#safeCheckbox', enabled: Math.random() > 0.5 },
    { id: '#radioCheckbox', enabled: Math.random() > 0.5 },
    { id: '#refreshCheckbox', enabled: Math.random() > 0.5 },
    { id: '#viewsCheckbox', enabled: Math.random() > 0.5 }
  ];

  // Fill the form to create a new room with random options
  await page.fill('#roomName', roomNumber);
  await page.selectOption('#type', type);
  await page.selectOption('#accessible', accessible);
  await page.fill('#roomPrice', price);
  for (const feature of features) {
    if (feature.enabled) {
      await page.check(feature.id);
    } else {
      await page.uncheck(feature.id);
    }
  }
  await page.click('#createRoom');

  console.log('I have created room number: ' + roomNumber);

// Wait 5 seconds to allow the room to be seen
  await page.waitForTimeout(5000);

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

console.log('I have deleted room number: ' + roomNumber);

// Wait 5 seconds to allow the user to see the room is deleted
  await page.waitForTimeout(5000);


});