import { test, expect } from '@playwright/test';

const PUBLIC_ROUTES = ['/login', '/inscription'];

const PROTECTED_ROUTES = [
  '/dashbord', '/statistiques', '/articles', '/clients', '/fournisseurs',
  '/vente', '/avoirs', '/categories', '/utilisateurs', '/profil'
];

test.describe('Route Security Tests', () => {
  for (const route of PUBLIC_ROUTES) {
    test(`${route} should be accessible without auth`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });
      
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain(route);
    });
  }

  for (const route of PROTECTED_ROUTES) {
    test(`${route} should redirect to login without auth`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/login/);
    });
  }
});

test.describe('Routing Tests', () => {
  test('login to inscription navigation works', async ({ page }) => {
    await page.goto('/login');
    const inscriptionLink = page.locator('a[href="/inscription"]');
    await inscriptionLink.click();
    await expect(page).toHaveURL(/inscription/);
  });

  test('inscription to login navigation works', async ({ page }) => {
    await page.goto('/inscription');
    const loginLink = page.locator('a[href="/login"]');
    await loginLink.click();
    await expect(page).toHaveURL(/login/);
  });
});