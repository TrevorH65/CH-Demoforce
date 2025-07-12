import { test, expect } from '@playwright/test';

// Format a Date object as dd/mm/yyyy
// This is used to fill in the date fields on the booking form
function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Format a Date object as yyyy-mm-dd
// This is used to check date fields in the confirmation message
function toISODateString(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

test('Check availability on automationintesting.online', async ({ page }) => {
  // Generate check-in date 14 days ahead
  const today = new Date();
  const checkIn = new Date(today);
  checkIn.setDate(today.getDate() + 14);

  // Generate check-out date between 1 and 7 days after check-in
  const stayLength = Math.floor(Math.random() * 7) + 1;
  const checkOut = new Date(checkIn);
  checkOut.setDate(checkIn.getDate() + stayLength);

  const checkInFormatted = formatDate(checkIn);
  const checkOutFormatted = formatDate(checkOut);

  const checkInISO = toISODateString(checkIn);
  const checkOutISO = toISODateString(checkOut); 

  console.log(`Check-in: ${checkInFormatted}, Check-out: ${checkOutFormatted}`);

  // Go to the site
  await page.goto('https://automationintesting.online/');

  // Enter the dates
  const checkInInput = page.locator('#checkin');
  const checkOutInput = page.locator('#checkout');

  await page.locator('.dateWrapper input.form-control').nth(0).fill(checkInFormatted); // Check-in
  await page.locator('.dateWrapper input.form-control').nth(1).fill(checkOutFormatted); // Check-out
  
    // Click the "Check Availability" button
  await page.getByRole('button', { name: 'Check Availability' }).click();

/// Wait for room cards to appear
const firstRoomCard = page.locator('.room-card').first();

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

    // Verify the confirmation message contains the correct dates
    await expect(page.locator('.booking-card')).toContainText(checkInISO);
    await expect(page.locator('.booking-card')).toContainText(checkOutISO);
    
    // Wait for a few seconds to allow the confirmation message to be seen
    await page.waitForTimeout(5000);


    // Click the "Return home" link to go back to the home page
    await page.locator('a:has-text("Return home")').click();

// From here I could add checks to ensure that the booking appears in the admin messages, etc....

});