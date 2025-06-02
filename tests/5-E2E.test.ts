import { test, expect } from '@playwright/test';

test('End-to-end flow for standard_user', async ({ page }) => {
  const USERNAME = 'standard_user';
  const PASSWORD = 'secret_sauce';

  // Navigate to login page
  await page.goto('https://www.saucedemo.com/v1/');

  // Log in
  await page.fill('#user-name', USERNAME);
  await page.fill('#password', PASSWORD);
  await page.click('#login-button');

  // Confirm redirection to inventory page
  await expect(page).toHaveURL(/.*inventory\.html/);

  // Add first two items to cart
  const addButtons = await page.locator('.btn_inventory').all();
  await addButtons[0].click();
  await addButtons[1].click();

  // Verify cart badge shows 2 items
  await expect(page.locator('.shopping_cart_badge')).toHaveText('2');

  // Go to cart page
  await page.click('.shopping_cart_link');
  await expect(page).toHaveURL(/.*cart\.html/);

  // Proceed to checkout
  await page.click('.checkout_button');

  // Fill checkout information
  await page.fill('#first-name', 'John');
  await page.fill('#last-name', 'Doe');
  await page.fill('#postal-code', '12345');
  await page.click('.cart_button'); // Continue

  // Confirm overview page and finish order
  await expect(page).toHaveURL(/.*checkout-step-two\.html/);
  await page.click('.cart_button'); // Finish

  // Confirm order completion
  await expect(page.locator('.complete-header')).toHaveText('THANK YOU FOR YOUR ORDER');


});