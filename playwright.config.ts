import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    baseURL: 'https://automationintesting.online/',
    headless: false, // Set to true if you want to run tests in headless mode
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }, // Use Chrome browser
    },
  ],
});