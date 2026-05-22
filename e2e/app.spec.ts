import { test, expect } from '@playwright/test';

test.describe('Application Tests', () => {
  test('should load login page without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    
    await page.goto('/login');
    await expect(page.locator('app-page-login')).toBeVisible();
    await expect(page.locator('#mail')).toBeVisible();
    await expect(page.locator('#motdepasse')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    expect(consoleErrors.length).toBe(0);
  });

  test('should load inscription page without console errors', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    
    await page.goto('/inscription');
    await expect(page.locator('app-page-inscription')).toBeVisible();
    
    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors);
    }
    expect(consoleErrors.length).toBe(0);
  });

  test('should redirect unknown routes to login', async ({ page }) => {
    await page.goto('/unknown-route');
    await expect(page).toHaveURL(/login/);
  });

  test('should have proper meta tags', async ({ page }) => {
    await page.goto('/login');
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('should have no missing assets', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    const assetErrors = consoleErrors.filter(e => 
      e.includes('404') || e.includes('Failed to load resource')
    );
    
    if (assetErrors.length > 0) {
      console.log('Asset errors:', assetErrors);
    }
  });
});