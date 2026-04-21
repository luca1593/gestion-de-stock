import { test, expect } from '@playwright/test';

test.describe('All Pages Load Test', () => {
  const protectedPages = [
    '/dashbord',
    '/statistiques',
    '/articles',
    '/mvtstk',
    '/clients',
    '/commande-client',
    '/fournisseurs',
    '/commande-fournisseur',
    '/vente',
    '/liste-vente',
    '/avoirs',
    '/categories',
    '/utilisateurs',
    '/profil'
  ];

  for (const page of protectedPages) {
    test(`${page} should redirect to login when not authenticated`, async ({ page: browserPage }) => {
      await browserPage.goto(page);
      await expect(browserPage).toHaveURL(/login/);
    });
  }
});

test.describe('Login Form Test', () => {
  test('login form should have email and password fields', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('#mail')).toBeVisible();
    await expect(page.locator('#motdepasse')).toBeVisible();
  });

  test('login form should have submit button', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('login form should submit on Enter key in password field', async ({ page }) => {
    await page.goto('/login');
    await page.locator('#mail').fill('test@test.com');
    await page.locator('#motdepasse').fill('password');
    await page.locator('#motdepasse').press('Enter');
    await page.waitForTimeout(500);
  });

  test('login form should have register link', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('a[href="/inscription"]')).toBeVisible();
  });
});

test.describe('Registration Form Test', () => {
  test('registration form should have all required fields', async ({ page }) => {
    await page.goto('/inscription');
    await expect(page.locator('#nom')).toBeVisible();
    await expect(page.locator('#codefiscal')).toBeVisible();
    await expect(page.locator('#mail')).toBeVisible();
    await expect(page.locator('#description')).toBeVisible();
    await expect(page.locator('#numTel')).toBeVisible();
  });

  test('registration form should submit button', async ({ page }) => {
    await page.goto('/inscription');
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('registration form should have back to login link', async ({ page }) => {
    await page.goto('/inscription');
    await expect(page.locator('a[href="/login"]')).toBeVisible();
  });
});

test.describe('Console Error Test', () => {
  test('login page should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    expect(errors.length).toBe(0);
  });

  test('inscription page should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    await page.goto('/inscription');
    await page.waitForLoadState('networkidle');
    
    expect(errors.length).toBe(0);
  });
});