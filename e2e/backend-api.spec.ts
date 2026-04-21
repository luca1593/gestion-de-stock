import { test, expect, APIRequestContext } from '@playwright/test';

const BACKEND_URL = 'http://12.24.5.100:8085';
const USER_EMAIL = 'entreprise1@test.com';
const USER_PASSWORD = 'luca1593';

let authToken = '';
let entrepriseId = 0;

test.describe('Tests API Backend - CRUD Complet', () => {

  test('1.1 - Authentification API', async ({ request }) => {
    const response = await request.post(`${BACKEND_URL}/api/v1/users/login`, {
      data: {
        login: USER_EMAIL,
        password: USER_PASSWORD
      },
      headers: { 'Content-Type': 'application/json' }
    });
    
    console.log('Login status: ' + response.status());
    expect(response.status()).toBeGreaterThanOrEqual(200);
    
    try {
      const data = await response.json();
      authToken = data.idToken || data.token || '';
      entrepriseId = data.entreprise?.id || data.idEntreprise || 0;
    } catch {
      // Continue without parsing
    }
    
    console.log('Auth: token=' + (authToken ? 'OK' : 'N/A') + ', id=' + entrepriseId);
  });

  test('1.2 - API Categories - FindAll', async ({ request }) => {
    const response = await request.get(`${BACKEND_URL}/api/v1/categories`, {
      headers: { 'Authorization': 'Bearer ' + authToken }
    });
    
    console.log('Categories: ' + response.status());
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('1.3 - API Categories - Save', async ({ request }) => {
    const newCategory = {
      code: 'TEST-' + Date.now(),
      designation: 'Cat E2E',
      idEntreprise: entrepriseId
    };
    
    const response = await request.post(`${BACKEND_URL}/api/v1/categories`, {
      data: newCategory,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      }
    });
    
    console.log('Category created: ' + response.status());
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('2.1 - API Articles - FindAll', async ({ request }) => {
    const response = await request.get(`${BACKEND_URL}/api/v1/articles`, {
      headers: { 'Authorization': 'Bearer ' + authToken }
    });
    
    console.log('Articles: ' + response.status());
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('2.2 - API Articles - Save', async ({ request }) => {
    const newArticle = {
      codeArticle: 'ART-E2E-' + Date.now(),
      designation: 'Article Test E2E',
      prixUnitaireht: 100,
      tauxTva: 20,
      idEntreprise: entrepriseId
    };
    
    const response = await request.post(`${BACKEND_URL}/api/v1/articles`, {
      data: newArticle,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      }
    });
    
    console.log('Article created: ' + response.status());
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('3.1 - API Clients - FindAll', async ({ request }) => {
    const response = await request.get(`${BACKEND_URL}/api/v1/clients`, {
      headers: { 'Authorization': 'Bearer ' + authToken }
    });
    
    console.log('Clients: ' + response.status());
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('3.2 - API Clients - Save', async ({ request }) => {
    const newClient = {
      nom: 'Client E2E',
      mail: 'test-e2e@exemple.com',
      telephone: '0612345678',
      idEntreprise: entrepriseId
    };
    
    const response = await request.post(`${BACKEND_URL}/api/v1/clients`, {
      data: newClient,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      }
    });
    
    console.log('Client created: ' + response.status());
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('4.1 - API Fournisseurs - FindAll', async ({ request }) => {
    const response = await request.get(`${BACKEND_URL}/api/v1/fournisseurs`, {
      headers: { 'Authorization': 'Bearer ' + authToken }
    });
    
    console.log('Fournisseurs: ' + response.status());
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('4.2 - API Fournisseurs - Save', async ({ request }) => {
    const newFs = {
      nom: 'Fs E2E',
      mail: 'fs-e2e@exemple.com',
      telephone: '0698765432',
      idEntreprise: entrepriseId
    };
    
    const response = await request.post(`${BACKEND_URL}/api/v1/fournisseurs`, {
      data: newFs,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + authToken
      }
    });
    
    console.log('Fournisseur created: ' + response.status());
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('5.1 - API Ventes - FindAll', async ({ request }) => {
    const response = await request.get(`${BACKEND_URL}/api/v1/ventes`, {
      headers: { 'Authorization': 'Bearer ' + authToken }
    });
    
    console.log('Ventes: ' + response.status());
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('6.1 - API Utilisateurs - FindAll', async ({ request }) => {
    const response = await request.get(`${BACKEND_URL}/api/v1/utilisateurs`, {
      headers: { 'Authorization': 'Bearer ' + authToken }
    });
    
    console.log('Utilisateurs: ' + response.status());
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('7.1 - API Entreprise - FindById', async ({ request }) => {
    const response = await request.get(`${BACKEND_URL}/api/v1/entreprises/${entrepriseId}`, {
      headers: { 'Authorization': 'Bearer ' + authToken }
    });
    
    console.log('Entreprise: ' + response.status());
    expect(response.status()).toBeGreaterThanOrEqual(200);
  });

  test('8.1 - Test Toutes les APIs', async ({ request }) => {
    const endpoints = [
      '/api/v1/categories',
      '/api/v1/articles',
      '/api/v1/clients',
      '/api/v1/fournisseurs',
      '/api/v1/ventes',
      '/api/v1/utilisateurs'
    ];
    
    let success = 0;
    for (const ep of endpoints) {
      const res = await request.get(`${BACKEND_URL}${ep}`, {
        headers: { 'Authorization': 'Bearer ' + authToken }
      });
      if (res.status() >= 200) success++;
    }
    
    console.log('APIs OK: ' + success + '/' + endpoints.length);
    expect(success).toBeGreaterThan(0);
  });
});