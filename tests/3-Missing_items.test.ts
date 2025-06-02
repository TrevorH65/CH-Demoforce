import { test, expect } from '@playwright/test';

test('verify all inventory item images are loaded', async ({ page }) => {
  // Step 1: Login
  await page.goto('https://www.saucedemo.com/v1/');
  //await page.fill('#user-name', 'standard_user'); // standard_user will pass the test
   await page.fill('#user-name', 'problem_user'); // problem_user will fail the test 
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Step 2: Confirm redirection to inventory page
  await expect(page).toHaveURL('https://www.saucedemo.com/v1/inventory.html');

  // Step 3: Grab all product images
  const images = await page.$$('.inventory_item_img img');

  for (const img of images) {
    const src = await img.getAttribute('src');
    const isVisible = await img.isVisible();

    // Check visibility
    expect(isVisible).toBe(true);

    // Check that the image loads without error
    const response = await page.request.get(`https://www.saucedemo.com/v1/${src}`);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image');
  }
});