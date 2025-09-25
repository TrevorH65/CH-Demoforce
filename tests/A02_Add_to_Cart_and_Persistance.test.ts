import { test, expect } from '@playwright/test';

function randomUsername() {
  return 'user' + Math.floor(Math.random() * 100000);
}

test.describe.configure({ timeout: 90_000 }); // set test timeout to 90s

test('Register, login, add to cart, logout, relogin and verify cart', async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://www.demoblaze.com/');

  const username = randomUsername();
  const password = 'TestPassword123';
  let productName = '';

  // --- SIGN UP ---
  await page.click('#signin2');
  await page.waitForSelector('#sign-username');
  await page.fill('#sign-username', username);
  await page.fill('#sign-password', password);

  const signupDialog = await Promise.race([
    page.waitForEvent('dialog', { timeout: 5000 }),
    page.click('button[onclick="register()"]')
  ]);

  if (signupDialog) {
    console.log('Signup alert:', (signupDialog as any).message());
    await (signupDialog as any).accept();
  }

  await page.waitForTimeout(2000);

  // --- LOGIN ---
  await page.click('#login2');
  await page.waitForSelector('#loginusername');
  await page.fill('#loginusername', username);
  await page.fill('#loginpassword', password);

  // Sometimes successful login doesn’t show an alert → don’t block test
  try {
    const loginDialog = await Promise.race([
      page.waitForEvent('dialog', { timeout: 5000 }),
      page.click('button[onclick="logIn()"]')
    ]);
    if (loginDialog) {
      console.log('Login alert:', (loginDialog as any).message());
      await (loginDialog as any).accept();
    }
  } catch {
    console.log('No login alert shown, continuing...');
  }

  await page.waitForTimeout(2000);

  // --- ADD PRODUCT TO CART ---
  await page.click('.hrefch'); // first product
  await page.waitForSelector('.name');
  productName = await page.textContent('.name') || '';

  const addDialog = await Promise.race([
    page.waitForEvent('dialog', { timeout: 5000 }),
    page.click('a:has-text("Add to cart")')
  ]);

  if (addDialog) {
    console.log('Add to cart alert:', (addDialog as any).message());
    await (addDialog as any).accept();
  }

  await page.waitForTimeout(2000);

  await context.close(); // simulate closing browser

  // --- REOPEN & LOGIN AGAIN ---
  const newContext = await browser.newContext();
  const newPage = await newContext.newPage();
  await newPage.goto('https://www.demoblaze.com/');

  await newPage.click('#login2');
  await newPage.waitForSelector('#loginusername');
  await newPage.fill('#loginusername', username);
  await newPage.fill('#loginpassword', password);

  try {
    const reloginDialog = await Promise.race([
      newPage.waitForEvent('dialog', { timeout: 5000 }),
      newPage.click('button[onclick="logIn()"]')
    ]);
    if (reloginDialog) {
      console.log('Relogin alert:', (reloginDialog as any).message());
      await (reloginDialog as any).accept();
    }
  } catch {
    console.log('No relogin alert shown, continuing...');
  }

  await newPage.waitForTimeout(2000);

  // --- VERIFY CART ---
  await newPage.click('#cartur');
  await newPage.waitForSelector('.success');
  const cartText = await newPage.textContent('.success');

  expect(cartText).toContain(productName);

  await newContext.close();
});
