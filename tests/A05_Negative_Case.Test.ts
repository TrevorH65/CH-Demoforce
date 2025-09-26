import { test, expect } from '@playwright/test';

const baseUrl = 'https://www.demoblaze.com/';

test.describe('Signup Negative Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
    await page.click('#signin2');
    await page.waitForSelector('#sign-username');
  });

  test('should not allow empty username and password', async ({ page }) => {
    const dialog = await Promise.all([
      page.waitForEvent('dialog'),
      page.click('button[onclick="register()"]'),
    ]);
    expect(dialog[0].message().toLowerCase()).toContain('please fill');
    await dialog[0].accept();
  });

  test('should not allow empty username only', async ({ page }) => {
    await page.fill('#sign-password', 'password123');
    const dialog = await Promise.all([
      page.waitForEvent('dialog'),
      page.click('button[onclick="register()"]'),
    ]);
    console.log('Empty username error:', dialog[0].message());
    await dialog[0].accept();
  });

  test('should not allow empty password only', async ({ page }) => {
    await page.fill('#sign-username', 'usernopassword');
    const dialog = await Promise.all([
      page.waitForEvent('dialog'),
      page.click('button[onclick="register()"]'),
    ]);
    console.log('Empty password error:', dialog[0].message());
    await dialog[0].accept();
  });

  test('should reject too short password', async ({ page }) => {
    await page.fill('#sign-username', 'shortpassuser');
    await page.fill('#sign-password', '1');
    const dialog = await Promise.all([
      page.waitForEvent('dialog'),
      page.click('button[onclick="register()"]'),
    ]);
    console.log('Short password error (BUG if passes):', dialog[0].message());
    await dialog[0].accept();
  });

  test('should reject invalid characters in username', async ({ page }) => {
    await page.fill('#sign-username', 'invalid!@#');
    await page.fill('#sign-password', 'password123');
    const dialog = await Promise.all([
      page.waitForEvent('dialog'),
      page.click('button[onclick="register()"]'),
    ]);
    console.log('Invalid chars username error (BUG if passes):', dialog[0].message());
    await dialog[0].accept();
  });

  test('should reject very long username', async ({ page }) => {
    const longUser = 'a'.repeat(300);
    await page.fill('#sign-username', longUser);
    await page.fill('#sign-password', 'password123');
    const dialog = await Promise.all([
      page.waitForEvent('dialog'),
      page.click('button[onclick="register()"]'),
    ]);
    console.log('Long username error (BUG if passes):', dialog[0].message());
    await dialog[0].accept();
  });

  test('should reject duplicate username', async ({ page }) => {
    const username = 'duplicateUser123';
    const password = 'TestPass!';

    // First attempt
    await page.fill('#sign-username', username);
    await page.fill('#sign-password', password);
    let dialog = await Promise.all([
      page.waitForEvent('dialog'),
      page.click('button[onclick="register()"]'),
    ]);
    await dialog[0].accept();
    await page.waitForTimeout(1500);

    // Try again with same username
    await page.click('#signin2');
    await page.waitForSelector('#sign-username');
    await page.fill('#sign-username', username);
    await page.fill('#sign-password', password);
    dialog = await Promise.all([
      page.waitForEvent('dialog'),
      page.click('button[onclick="register()"]'),
    ]);
    expect(dialog[0].message()).toContain('This user already exist');
    await dialog[0].accept();
  });

});
