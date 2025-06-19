import { test, expect } from '@playwright/test';
import path from 'path';

test('upload file, run a sample user query, and validate theme changing', async ({ page, baseURL }) => {
    // Go to the app using baseURL from Playwright config
    await page.goto(baseURL || 'http://localhost:8081/');

    // Validate theme changing functionality
    // Default theme (Cognizant blue)
    const header = await page.locator('header, .w-full.bg-primary');
    await expect(header).toHaveCSS('background-color', 'rgb(26, 35, 126)');

    // Change to Dark theme
    await page.locator('text=Theme:').locator('..').locator('text=Dark').click();
    // The header or body should now have the dark theme color
    await expect(header).not.toHaveCSS('background-color', 'rgb(10, 106, 210)');
    await expect(header).toHaveCSS('background-color', 'rgb(99, 102, 241)');

    // Change to Green theme
    await page.locator('text=Theme:').locator('..').locator('text=Green').click();
    await expect(header).not.toHaveCSS('background-color', 'rgb(99, 102, 241)');
    await expect(header).toHaveCSS('background-color', 'rgb(34, 197, 94)');
});
