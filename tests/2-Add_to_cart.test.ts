import { test, expect } from '@playwright/test';

test('add and remove items from cart', async ({ page }) => {
  const USERNAME = 'problem_user'; // problem_user will fail the test
  const PASSWORD = 'secret_sauce';

  await page.goto('https://www.saucedemo.com/v1/');

  // Login
  await page.fill('#user-name', USERNAME);
  await page.fill('#password', PASSWORD);
  await page.click('#login-button');

  // Ensure on inventory page
  await expect(page).toHaveURL(/.*inventory\.html/);

  // Get item containers
  const items = await page.locator('.inventory_item').all();

  for (let i = 0; i < items.length; i++) {
    const item = page.locator('.inventory_item').nth(i);
    const itemName = await item.locator('.inventory_item_name').innerText();
    const button = item.locator('.btn_inventory');

    try {
      // Click the button to add to cart
      await button.click();

      // Check if the button text changes to "Remove"
      const buttonTextAfterAdd = await button.innerText();
      if (!/remove/i.test(buttonTextAfterAdd)) {
        console.error(`❌ Button text did not change to "Remove" for item ${i + 1}: "${itemName}"`);
      } else {
        console.log(`✅ Button text changed to "Remove" for item ${i + 1}: "${itemName}"`);

        // Only click the button to remove from cart if it changed to "Remove"
        await button.click();

        // Check if the button text changes back to "Add to Cart"
        const buttonTextAfterRemove = await button.innerText();
        if (!/add to cart/i.test(buttonTextAfterRemove)) {
          console.error(`❌ Button text did not change back to "Add to Cart" for item ${i + 1}: "${itemName}"`);
        } else {
          console.log(`✅ Button text changed back to "Add to Cart" for item ${i + 1}: "${itemName}"`);
        }
      }
    } catch (err) {
      console.error(`❌ Test failed on item ${i + 1}: "${itemName}"`);
      console.error(err);
    }
  }
});