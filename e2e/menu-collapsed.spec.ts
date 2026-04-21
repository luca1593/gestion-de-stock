import { test, expect } from '@playwright/test';

test.describe('Menu Collapsed Mode - Direct Access', () => {
  test('should access dashboard with mock auth', async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem('gs_access_token', JSON.stringify({
        accessToken: 'mock-token',
        utilisateur: { id: '1', nom: 'Test', email: 'test@test.com' }
      }));
    });
    
    await page.goto('/dashbord');
    await page.waitForTimeout(3000);
    
    console.log('URL:', page.url());
    
    const toggleBtn = page.locator('button.menu-toggle');
    const toggleCount = await toggleBtn.count();
    console.log('Toggle button count:', toggleCount);
    
    if (toggleCount > 0) {
      await toggleBtn.click();
      await page.waitForTimeout(1000);
    }
  });

  test('should read page HTML after auth mock', async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem('gs_access_token', JSON.stringify({
        accessToken: 'mock-token-123',
        utilisateur: { id: '1', nom: 'Admin', email: 'admin@test.com' }
      }));
    });
    
    await page.goto('/dashbord');
    await page.waitForTimeout(5000);
    
    const html = await page.content();
    console.log('Contains page-dashbord:', html.includes('dashbord'));
    console.log('Contains menu-toggle:', html.includes('menu-toggle'));
    console.log('Contains sidebar-menu:', html.includes('sidebar-menu'));
    
    const toggle = page.locator('.menu-toggle');
    const count = await toggle.count();
    console.log('Toggle count:', count);
  });
});