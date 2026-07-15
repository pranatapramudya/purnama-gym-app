import { test, expect } from '@playwright/test';

test('Kasir flow: Access Cashflow and blocked from Staff', async ({ page, context }) => {
  // Inject Kasir role cookie
  await context.addCookies([{ name: 'playwright-role', value: 'ADMIN_KASIR', url: 'http://localhost:3000' }]);

  // Positive Test: Navigate to Kasir (Cashflow module)
  await page.goto('/2026/kasir');
  
  // Wait for the Kasir page to load (should see Buku Kas)
  await expect(page.getByRole('heading', { name: 'Buku Kas' })).toBeVisible();

  // Negative Test: Attempt to access Super Admin exclusive route (Staff)
  await page.goto('/2026/staff');

  // Should redirect away from Staff to dashboard.
  await expect(page).toHaveURL(/\/2026\/dashboard/);
});
