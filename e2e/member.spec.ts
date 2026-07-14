import { test, expect } from '@playwright/test';

test('Member flow: Access Dashboard and block Kasir', async ({ page, context }) => {
  // Inject Member role cookie
  await context.addCookies([{ name: 'playwright-role', value: 'MEMBER', url: 'http://localhost:3000' }]);

  // Test 1: Positive Test - Access Member Dashboard
  await page.goto('/member/dashboard');
  
  // Wait for the member dashboard to load and verify the Purnama Gym title
  await expect(page.getByText('Purnama Gym', { exact: true })).toBeVisible();

  // Test 2: Negative Test - Block Kasir Route
  await page.goto('/2026/kasir');
  
  // It should redirect away from kasir. We can assert the URL changes or we see the Member Dashboard
  // Wait for the URL to change
  await expect(page).toHaveURL(/\/member\/dashboard/);
});
