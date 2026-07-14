import { test, expect } from '@playwright/test';

test('Cashier flow: Catat Transaksi', async ({ page, context }) => {
  await context.addCookies([{ name: 'playwright-role', value: 'SUPER_ADMIN', url: 'http://localhost:3000' }]);

  // Navigate directly to kasir page
  await page.goto('/2026/kasir');
  await page.waitForTimeout(2000);
  console.log("Current URL after navigation:", page.url());
  const content = await page.content();
  console.log("Page content snippet:", content.substring(0, 500));
  
  // Wait for the page to load
  await expect(page.getByRole('heading', { name: 'Buku Kas' })).toBeVisible();

  // Intercept Cloudinary API calls
  await page.route('https://api.cloudinary.com/v1_1/**', async (route) => {
    const json = {
      secure_url: 'https://res.cloudinary.com/demo/image/upload/v1/dummy-image.jpg'
    };
    await route.fulfill({ json });
  });

  // Click on 'Catat Transaksi' button
  await page.getByRole('button', { name: 'Catat Transaksi' }).click();

  // Ensure modal opens
  await expect(page.getByRole('heading', { name: 'Catat Transaksi Baru' })).toBeVisible();

  // Fill out the form
  await page.getByPlaceholder('0').fill('150000');
  await page.getByPlaceholder('Contoh: Beli air minum / Pembayaran member baru').fill('Test Income Playwright');

  // Submit form
  await page.getByRole('button', { name: 'Simpan' }).click();

  // Ensure modal closes and we see the new item in the list
  await expect(page.getByText('Test Income Playwright')).toBeVisible();
});
