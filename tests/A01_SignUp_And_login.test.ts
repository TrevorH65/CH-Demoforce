import { test, expect } from '@playwright/test';

// Utility function to generate random usernames
function randomUsername() {
  return `user_${Date.now()}`;
}

test.describe('Demoblaze Auth Tests', () => {
  let username: string;
  const password = 'TestPassword123!';

  test('Sign up a new user', async ({ page }) => {
    username = randomUsername();

    // Go to homepage
    await page.goto('https://www.demoblaze.com/');

    // Open Sign up modal
    await page.click('#signin2');

    // Wait for modal to appear
    await page.waitForSelector('#signInModal', { state: 'visible' });

    // Fill in form
    await page.fill('#sign-username', username);
    await page.fill('#sign-password', password);

    // Click sign up
    await page.click("button[onclick='register()']");

    // Expect alert confirming sign up
    page.once('dialog', async (dialog) => {
      console.log(`Signup alert: ${dialog.message()}`);
      await dialog.accept();
    });

    // Short wait to allow process
    await page.waitForTimeout(2000);
  });

  test('Login with newly created user', async ({ page }) => {
    // Go to homepage
    await page.goto('https://www.demoblaze.com/');

    // Open Login modal
    await page.click('#login2');
    await page.waitForSelector('#logInModal', { state: 'visible' });

    // Fill in credentials
    await page.fill('#loginusername', username);
    await page.fill('#loginpassword', password);

    // Click login
    await page.click("button[onclick='logIn()']");

    // Verify user is logged in (welcome label should appear)
    const welcomeLabel = page.locator('#nameofuser');
    await expect(welcomeLabel).toHaveText(`Welcome ${username}`);
  });
});
