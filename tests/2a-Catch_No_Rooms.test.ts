import { test, expect } from '@playwright/test';

test('Book the first room option', async ({ page }) => {
  // Go to homepage
  await page.goto('https://automationintesting.online/');

 // Click the "Book now" button to load the room cards
  await page.locator('a.btn.btn-primary:has-text("Book now")').first().click();

   // Check if any room cards are present
  const roomCards = page.locator('.room-card');
  const roomCount = await roomCards.count();

  if (roomCount === 0) {
    throw new Error('No room options are offered on the page.');
  }

  try {
    // Proceed with booking the first room
    const firstRoomCard = roomCards.first();
    await expect(firstRoomCard).toBeVisible({ timeout: 5000 });

    // Click "Book now" link within the first room
    await firstRoomCard.locator('a.btn.btn-primary:has-text("Book now")').click();

    // Click the "Reserve" button in the booking modal
    await page.locator('button:has-text("Reserve")').click();

    // Fill in the form fields
    await page.fill('input[name="firstname"]', 'Test');
    await page.fill('input[name="lastname"]', 'User');
    await page.fill('input[name="email"]', 'test.user@example.com');
    await page.fill('input[name="phone"]', '07123456789');

    // Click the "Reserve Now" button (by class and text)
    await page.locator('button.btn.btn-primary.w-100.mb-3:has-text("Reserve Now")').click();

    // Verify booking confirmation message appears
    await expect(page.locator('.booking-card')).toContainText('Booking Confirmed');
  } catch (error) {
    throw new Error('Booking failed: ' + error);
  }
});