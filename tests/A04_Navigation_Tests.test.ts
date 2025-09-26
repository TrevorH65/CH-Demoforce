import { test, expect } from '@playwright/test';

const baseUrl = 'https://www.demoblaze.com/';

test.describe('Category Navigation Tests', () => {
  const categories = [
    { name: 'Phones', expected: 7 },
    { name: 'Laptops', expected: 6 },
    { name: 'Monitors', expected: 2 }
  ];

  for (const category of categories) {
    test(`should display ${category.name} correctly`, async ({ page }) => {
      await page.goto(baseUrl);
      await page.waitForSelector('#cat');

      // Click the category
      await page.locator('#itemc', { hasText: category.name }).click();

      // Wait for the first product title to be visible (ensures refresh)
      await page.waitForSelector('.card-title', { state: 'visible' });

      // Extra step: wait for network to finish loading products
      await page.waitForTimeout(1000);

      // Now collect product titles
      const productTitles = await page.locator('.card-title').allInnerTexts();
      const productCount = productTitles.length;

      // Log results
      console.log(`${category.name}: Found ${productCount} products`);
      console.log('Products:', productTitles);

      // Assert correct number of products (if we want to be strict)
      expect(productCount).toBe(category.expected);
    });
  }
});
