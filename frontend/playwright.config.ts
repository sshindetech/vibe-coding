import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  expect: {
    timeout: 5000,
  },
  webServer: {
    command: 'npx expo start --no-dev --minify',
    port: 8081,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
  use: {
    // baseURL: 'http://localhost:8081',
    headless: false, // Run in headful (interactive) mode
    viewport: { width: 1280, height: 900 },
    ignoreHTTPSErrors: true,
    video: 'on',
    screenshot: 'on',
    trace: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
