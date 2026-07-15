import { test, expect } from '@playwright/test';

test('Trainer flow: Access Trainer module and blocked from Kasir', async ({ page, context }) => {
  // Inject Trainer role cookie
  await context.addCookies([{ name: 'playwright-role', value: 'PERSONAL_TRAINER', url: 'http://localhost:3000' }]);

  // Positive Test: Navigate to Trainer module
  await page.goto('/2026/personal-trainer');
  
  // Wait for the Trainer page to load (checking for elements that indicate success)
  // According to page.tsx it redirects or renders ClassesClient. 
  // We can just verify the URL stays there, or some heading is visible.
  await expect(page).toHaveURL(/\/2026\/personal-trainer/);

  // Negative Test: Attempt to access Kasir route
  await page.goto('/2026/kasir');

  // Should redirect away from Kasir (layout.tsx redirects trainer to /2026/personal-trainer?error=unauthorized)
  await expect(page).toHaveURL(/\/2026\/personal-trainer\?error=unauthorized/);
});
