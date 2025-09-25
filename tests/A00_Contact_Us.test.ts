import { test, expect } from '@playwright/test';

test('Contact Us form sends message and handles alert', async ({ page }) => {
  await page.goto('https://www.demoblaze.com/');

  // Open the Contact modal
  await page.click('a:has-text("Contact")');
  await page.waitForSelector('#exampleModal', { state: 'visible' });

  // Fill in the form
  await page.fill('#recipient-email', 'test@example.com');
  await page.fill('#recipient-name', 'Playwright Test');
  await page.fill('#message-text', 'Automated test message');

  // Handle the JS alert that pops up after clicking Send
  page.once('dialog', async dialog => {
    console.log('Alert text:', dialog.message());
    await expect(dialog.message()).toContain('Thanks for the message');
    await dialog.accept(); // clicks "OK"
  });

  // Click the Send message button
  await page.click('button[onclick="send()"]');

  // Optional: wait a bit to confirm modal closes
  await page.waitForTimeout(500);
  await expect(page.locator('#exampleModal')).toBeHidden();
});

// Ideally at this point I'd want to run a check to confirm that the message was received,
// but since I don't have access to the backend or email, I've relied on the alert as confirmation.