import { test, expect } from '@playwright/test';

test('User sends a message and admin sees it', async ({ page }) => {
 
  const name = `Auto User ${Date.now()}`;
  const email = `autouser${Date.now()}@example.com`;
  const phone = '12345678901';
  const subject = `Playwright Message Test ${Math.floor(Math.random() * 1000000)}`;
  const message = 'This is a test message of more than 20 characters.';

  // Step 1: Send a message
  await page.goto('https://automationintesting.online/');
  await page.fill('#name', name);
  await page.fill('#email', email);
  await page.fill('#phone', phone);
  await page.fill('#subject', subject);
  await page.fill('#description', message);
  await page.click('text=Submit');

  // Confirm thank-you message is shown
  await expect(page.locator('text=Thanks for getting in touch')).toBeVisible();
  await expect(page.locator('body')).toContainText(name);
  await expect(page.locator('body')).toContainText(subject);

  //wait 5 seconds to allow the confirmation message to be seen
  await page.waitForTimeout(5000);

  // Step 2: Click the Admin button to go to login page
  await page.click('nav >> text=Admin');

  // Log into admin to check the message
  await page.fill('#username', 'admin');
  await page.fill('#password', 'password');
  await page.getByRole('button', { name: 'Login' }).click();

  await expect(page).toHaveURL(/.*admin/);

 // Click the Messages nav link before checking for the message
  await page.click('a.nav-link:has-text("Messages")');


// Step 3: Look for the message in admin dashboard
  const messageRow = page.locator('.messages .row.detail', { has: page.locator(`p:has-text("${name}")`) })
    .filter({ has: page.locator(`p:has-text("${subject}")`) });
  await expect(messageRow).toBeVisible();

  // Wait 5 seconds to allow the message to be seen
  await page.waitForTimeout(5000);

  // Click the delete button in the identified message row
  await messageRow.locator('span.roomDelete').click();

  // Confirm the message is removed from the page
  await expect(messageRow).toHaveCount(0);

    //wait 5 seconds to allow the message deletion to be seen
  await page.waitForTimeout(5000);

});