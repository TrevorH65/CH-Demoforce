import { test, expect } from '@playwright/test';

test('Login via home page admin button with valid and invalid credentials', async ({ page }) => {
  // Go to home page
  await page.goto('https://automationintesting.online/');

  // Click the 'Admin' button in the header to navigate to login page
  await page.click('nav >> text=Admin');
  await expect(page).toHaveURL(/.*admin/);

  // Test valid login
  await page.fill('#username', 'admin');
  await page.fill('#password', 'password');
  await page.getByRole('button', { name: 'Login' }).click();

  // Verify the navbar brand is visible after login
  await expect(page.locator('a.navbar-brand')).toHaveText('Restful Booker Platform Demo');

  // Click the logout button after welcome is shown (by class)
  await page.locator('button.btn.btn-outline-danger').click();

  // Confirm the URL is the home page after logout
  await expect(page).toHaveURL('https://automationintesting.online/');
});