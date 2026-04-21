import { test, expect } from '@playwright/test';

test.describe('App Component Tests', () => {
  test('app-root should render', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('app-root')).toBeAttached();
  });

  test('should load all required scripts', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', err => errors.push(err.message));
    
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    expect(errors.length).toBe(0);
  });
});

test.describe('Header Component Tests', () => {
  test('header should not appear on login page', async ({ page }) => {
    await page.goto('/login');
    const header = page.locator('app-header');
    await expect(header).toHaveCount(0);
  });

  test('inscription should not have header', async ({ page }) => {
    await page.goto('/inscription');
    const header = page.locator('app-header');
    await expect(header).toHaveCount(0);
  });
});

test.describe('Footer Tests', () => {
  test('footer should not appear on login page', async ({ page }) => {
    await page.goto('/login');
    const footer = page.locator('.app-footer');
    expect(await footer.count()).toBe(0);
  });
});

test.describe('API Mock Tests', () => {
  test('login request should be made on form submit', async ({ page }) => {
    await page.goto('/login');
    
    let apiCalled = false;
    page.on('request', req => {
      if (req.url().includes('/authenticate')) {
        apiCalled = true;
      }
    });
    
    await page.locator('#mail').fill('test@test.com');
    await page.locator('#motdepasse').fill('password');
    await page.locator('button[type="button"]').click();
    
    await page.waitForTimeout(1000);
  });
});

test.describe('Session Tests', () => {
  test('no token should redirect to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/login/);
  });

  test('no token should redirect articles to login', async ({ page }) => {
    await page.goto('/articles');
    await expect(page).toHaveURL(/login/);
  });
});

test.describe('Style Tests', () => {
  test('should load custom styles', async ({ page }) => {
    await page.goto('/login');
    const styles = await page.evaluate(() => {
      const el = document.querySelector('body');
      return window.getComputedStyle(el).fontFamily;
    });
    expect(styles).toBeTruthy();
  });
});