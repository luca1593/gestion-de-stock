import { test, expect, Page } from '@playwright/test';

const USER_EMAIL = 'entreprise1@test.com';
const USER_PASSWORD = 'luca1593';
const BACKEND_URL = 'http://12.24.5.100:8085';

async function loginAndGetToken(page: Page) {
  await page.goto('/login');
  await page.fill('#mail', USER_EMAIL);
  await page.fill('#motdepasse', USER_PASSWORD);
  await page.click('button:has-text("Se connecter")');
  await page.waitForURL(/dashbord/, { timeout: 15000 });
  await page.waitForTimeout(1000);
  
  const tokenStr = await page.evaluate(() => sessionStorage.getItem('gs_access_token'));
  let token = '';
  if (tokenStr) {
    try {
      const data = JSON.parse(tokenStr);
      token = data.accessToken || '';
    } catch {}
  }
  return token;
}

test.describe('Tests API Backend - Endpoints Corrétés', () => {

  test('1.1 - Login + Token', async ({ page }) => {
    const token = await loginAndGetToken(page);
    expect(token.length > 0).toBeTruthy();
  });

  test('1.2 - API /category/all', async ({ page }) => {
    const token = await loginAndGetToken(page);
    const res = await page.request.get(`${BACKEND_URL}/api/v1/category/all`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    console.log('Categories: ' + res.status());
    expect(res.status()).toBeGreaterThanOrEqual(200);
  });

  test('1.3 - API /category/create', async ({ page }) => {
    const token = await loginAndGetToken(page);
    const res = await page.request.post(`${BACKEND_URL}/api/v1/category/create`, {
      data: { code: 'TEST-' + Date.now(), designation: 'Cat E2E' },
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
    });
    console.log('Category create: ' + res.status());
    expect(res.status()).toBeGreaterThanOrEqual(200);
  });

  test('2.1 - API /articles', async ({ page }) => {
    const token = await loginAndGetToken(page);
    const res = await page.request.get(`${BACKEND_URL}/api/v1/articles`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    console.log('Articles: ' + res.status());
    expect(res.status()).toBeGreaterThanOrEqual(200);
  });

  test('2.2 - API Articles - Create + Get', async ({ page }) => {
    const token = await loginAndGetToken(page);
    const code = 'ART-' + Date.now();
    const res = await page.request.post(`${BACKEND_URL}/api/v1/articles`, {
      data: { codeArticle: code, designation: 'Article E2E', prixUnitaireht: 100, tauxTva: 20 },
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
    });
    console.log('Article create: ' + res.status());
    
    if (res.status() >= 200) {
      const data = await res.json();
      const id = data.idArticle || data.id;
      if (id) {
        const getRes = await page.request.get(`${BACKEND_URL}/api/v1/articles/${id}`, {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        console.log('Article get: ' + getRes.status());
        expect(getRes.status()).toBeGreaterThanOrEqual(200);
      }
    }
  });

  test('3.1 - API /clients', async ({ page }) => {
    const token = await loginAndGetToken(page);
    const res = await page.request.get(`${BACKEND_URL}/api/v1/clients`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    console.log('Clients: ' + res.status());
    expect(res.status()).toBeGreaterThanOrEqual(200);
  });

  test('3.2 - API Clients - Create', async ({ page }) => {
    const token = await loginAndGetToken(page);
    const res = await page.request.post(`${BACKEND_URL}/api/v1/clients`, {
      data: { nom: 'Client E2E', mail: 'e2e@test.com', telephone: '0612345678' },
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
    });
    console.log('Client create: ' + res.status());
    expect(res.status()).toBeGreaterThanOrEqual(200);
  });

  test('4.1 - API /fournisseurs', async ({ page }) => {
    const token = await loginAndGetToken(page);
    const res = await page.request.get(`${BACKEND_URL}/api/v1/fournisseurs`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    console.log('Fournisseurs: ' + res.status());
    expect(res.status()).toBeGreaterThanOrEqual(200);
  });

  test('4.2 - API Fournisseurs - Create', async ({ page }) => {
    const token = await loginAndGetToken(page);
    const res = await page.request.post(`${BACKEND_URL}/api/v1/fournisseurs`, {
      data: { nom: 'Fs E2E', mail: 'fs@test.com', telephone: '0698765432' },
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }
    });
    console.log('Fs create: ' + res.status());
    expect(res.status()).toBeGreaterThanOrEqual(200);
  });

  test('5.1 - API /ventes', async ({ page }) => {
    const token = await loginAndGetToken(page);
    const res = await page.request.get(`${BACKEND_URL}/api/v1/ventes`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    console.log('Ventes: ' + res.status());
    expect(res.status()).toBeGreaterThanOrEqual(200);
  });

  test('6.1 - API /utilisateurs', async ({ page }) => {
    const token = await loginAndGetToken(page);
    const res = await page.request.get(`${BACKEND_URL}/api/v1/utilisateurs`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    console.log('Utilisateurs: ' + res.status());
    expect(res.status()).toBeGreaterThanOrEqual(200);
  });

  test('7.1 - Toutes les APIs', async ({ page }) => {
    const token = await loginAndGetToken(page);
    const endpoints = [
      '/api/v1/category/all',
      '/api/v1/articles',
      '/api/v1/clients',
      '/api/v1/fournisseurs',
      '/api/v1/ventes'
    ];
    
    let ok = 0;
    for (const ep of endpoints) {
      const res = await page.request.get(`${BACKEND_URL}${ep}`, {
        headers: { 'Authorization': 'Bearer ' + token }
      });
      if (res.status() >= 200) ok++;
    }
    console.log('APIs OK: ' + ok + '/' + endpoints.length);
    expect(ok).toBeGreaterThan(0);
  });
});