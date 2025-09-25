import { test, expect } from '@playwright/test';

function randomUsername() {
  return 'user' + Math.floor(Math.random() * 100000);
}

test.describe.configure({ timeout: 120_000 }); // give it 2 mins

test('Register, login, add to cart, and complete checkout', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://www.demoblaze.com/');

  const username = randomUsername();
  const password = 'TestPassword123';
  let productName = '';

  // --- SIGN UP ---
  await page.click('#signin2');
  await page.waitForSelector('#sign-username', { timeout: 10000 });
  await page.fill('#sign-username', username);
  await page.fill('#sign-password', password);

  const signupDialog = await Promise.all([
    page.waitForEvent('dialog'),
    page.click('button[onclick="register()"]')
  ]);
  console.log('Signup alert:', signupDialog[0].message());
  await signupDialog[0].accept();

  await page.waitForTimeout(3000);

  // --- LOGIN ---
  await page.click('#login2');
  await page.waitForSelector('#loginusername', { timeout: 10000 });
  await page.fill('#loginusername', username);
  await page.fill('#loginpassword', password);

  const loginDialog = await Promise.all([
    page.waitForEvent('dialog'),
    page.click('button[onclick="logIn()"]')
  ]);
  console.log('Login alert:', loginDialog[0].message());
  await loginDialog[0].accept();

  await page.waitForTimeout(3000);

  // --- ADD PRODUCT TO CART ---
  await page.click('.hrefch'); // click first product
  await page.waitForSelector('.name', { timeout: 10000 });
  productName = await page.textContent('.name') || '';

  const addDialog = await Promise.all([
    page.waitForEvent('dialog'),
    page.click('a:has-text("Add to cart")')
  ]);
  console.log('Add to cart alert:', addDialog[0].message());
  await addDialog[0].accept();

  await page.waitForTimeout(3000);

  // --- GO TO CART ---
  await page.click('#cartur');
  await page.waitForSelector('.success', { timeout: 10000 });
  const cartText = await page.textContent('.success');
  expect(cartText).toContain(productName);

  // --- PLACE ORDER ---
  await page.click('button[data-target="#orderModal"]'); // Place order
  await page.waitForSelector('#orderModal', { timeout: 10000 });

  await page.fill('#name', 'Test User');
  await page.fill('#country', 'UK');
  await page.fill('#city', 'London');
  await page.fill('#card', '4111111111111111');
  await page.fill('#month', '12');
  await page.fill('#year', '2030');

  await page.click('button[onclick="purchaseOrder()"]');
  await page.waitForSelector('.sweet-alert', { timeout: 10000 });

  const confirmationText = await page.textContent('.sweet-alert h2');
  expect(confirmationText).toContain('Thank you for your purchase!');

  await page.click('button.confirm');

  await context.close();
});
