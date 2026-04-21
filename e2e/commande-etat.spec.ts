import { test, expect } from '@playwright/test';

test.describe('Commande State Change Tests', () => {
  
  test('login page loads', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('#mail')).toBeVisible();
    await expect(page.locator('#motdepasse')).toBeVisible();
  });

  test('check login error', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    await page.fill('#mail', 'admin@admin.com');
    await page.fill('#motdepasse', 'admin@admin.com');
    
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    await page.locator('.btn-primary').click();
    await page.waitForTimeout(5000);
    
    const url = page.url();
    console.log('URL after login click:', url);
    console.log('Console errors:', errors);
    
    const errorMsg = await page.locator('.alert, .text-danger').textContent().catch(() => 'none');
    console.log('Error message:', errorMsg);
  });

  test('direct access to commande-client', async ({ page }) => {
    await page.goto('/commande-client');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    const url = page.url();
    console.log('URL when accessing commande-client:', url);
    console.log('Contains login:', url.includes('login'));
  });
});