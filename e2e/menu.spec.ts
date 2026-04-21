import { test, expect } from '@playwright/test';

const MENU_ITEMS = [
  { menu: 'Tableau de bord', submenu: 'Vue d\'ensemble', url: '/dashbord', title: 'Tableau de bord' },
  { menu: 'Tableau de bord', submenu: 'Statistiques', url: '/statistiques', title: 'Statistiques' },
  { menu: 'Articles', submenu: 'Articles', url: '/articles', title: 'Articles' },
  { menu: 'Articles', submenu: 'Mouvement de stock', url: '/mvtstk', title: 'Mouvements de stock' },
  { menu: 'Clients', submenu: 'Clients', url: '/clients', title: 'Clients' },
  { menu: 'Clients', submenu: 'Commande clients', url: '/commande-client', title: 'Commandes' },
  { menu: 'Fournisseurs', submenu: 'Fournisseurs', url: '/fournisseurs', title: 'Fournisseurs' },
  { menu: 'Fournisseurs', submenu: 'Commande fournisseur', url: '/commande-fournisseur', title: 'Commandes' },
  { menu: 'Ventes', submenu: 'Nouvelle vente', url: '/vente', title: 'Vente' },
  { menu: 'Ventes', submenu: 'Historique des ventes', url: '/liste-vente', title: 'Historique' },
  { menu: 'Ventes', submenu: 'Avoirs', url: '/avoirs', title: 'Avoirs' },
  { menu: 'Paramètres', submenu: 'Catégories', url: '/categories', title: 'Catégories' },
  { menu: 'Paramètres', submenu: 'Utilisateurs', url: '/utilisateurs', title: 'Utilisateurs' }
];

test.describe('Menu Route Tests', () => {
  for (const item of MENU_ITEMS) {
    test(`route ${item.url} should redirect to login when not authenticated`, async ({ page }) => {
      await page.goto(item.url);
      await expect(page).toHaveURL(/login/);
    });
  }
});

test.describe('Page Loading Tests', () => {
  test('login page should load without menu', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('.login-container')).toBeVisible();
  });

  test('inscription page should load without menu', async ({ page }) => {
    await page.goto('/inscription');
    await expect(page.locator('.register-container')).toBeVisible();
  });
});

test.describe('Route Pattern Tests', () => {
  const routes = [
    '/vente',
    '/liste-vente', 
    '/avoirs',
    '/articles',
    '/mvtstk',
    '/clients',
    '/commande-client',
    '/fournisseurs',
    '/commande-fournisseur',
    '/categories',
    '/utilisateurs',
    '/dashbord',
    '/statistiques'
  ];

  for (const route of routes) {
    test(`${route} should redirect to login`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveURL(/login/);
    });
  }
});