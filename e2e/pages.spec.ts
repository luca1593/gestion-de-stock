import { test, expect } from '@playwright/test';

test.describe('Page Loading Tests', () => {
  test('login page loads correctly', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    await page.goto('/login');
    await expect(page.locator('app-page-login')).toBeVisible();
    await expect(page.locator('.login-card')).toBeVisible();
    expect(errors.length).toBe(0);
  });

  test('inscription page loads correctly', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    
    await page.goto('/inscription');
    await expect(page.locator('app-page-inscription')).toBeVisible();
    expect(errors.length).toBe(0);
  });

  test('unauthorized routes redirect to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/login/);
    
    await page.goto('/articles');
    await expect(page).toHaveURL(/login/);
    
    await page.goto('/clients');
    await expect(page).toHaveURL(/login/);
  });
});

test.describe('Form Validation Tests', () => {
  test('login form has required fields', async ({ page }) => {
    await page.goto('/login');
    
    const emailInput = page.locator('#mail');
    const passwordInput = page.locator('#motdepasse');
    const submitButton = page.locator('button[type="button"]');
    
    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });

  test('inscription form has all required fields', async ({ page }) => {
    await page.goto('/inscription');
    
    const nomInput = page.locator('#nom');
    const codeFiscalInput = page.locator('#codefiscal');
    const emailInput = page.locator('#mail');
    const descriptionInput = page.locator('#description');
    const numTelInput = page.locator('#numTel');
    const submitButton = page.locator('button[type="button"]');
    
    await expect(nomInput).toBeVisible();
    await expect(codeFiscalInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(descriptionInput).toBeVisible();
    await expect(numTelInput).toBeVisible();
    await expect(submitButton).toBeVisible();
  });
});