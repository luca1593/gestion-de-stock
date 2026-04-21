import { test, expect } from '@playwright/test';

test.describe('Simulation Utilisateur Complet', () => {
  const USER_EMAIL = 'entreprise1@test.com';
  const USER_PASSWORD = 'luca1593';

  async function login(page: any) {
    await page.goto('/login');
    await page.fill('#mail', USER_EMAIL);
    await page.fill('#motdepasse', USER_PASSWORD);
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL(/dashbord/, { timeout: 10000 });
  }

  test('1. Connexion et accés au dashboard', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.fill('#mail', USER_EMAIL);
    await page.fill('#motdepasse', USER_PASSWORD);
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL(/dashbord/, { timeout: 10000 });

    expect(page.url()).toContain('dashbord');
    console.log('✓ Connexion réussie');
  });

  test('2. Navigation vers Articles via le menu', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Articles")');
    await page.click('.submenu-item:has-text("Articles")');
    await page.waitForURL(/articles/);
    console.log('✓ Navigation vers Articles');
  });

  test('3. Navigation vers Clients', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Clients")');
    await page.click('.submenu-item:has-text("Clients")');
    await page.waitForURL(/clients/);
    console.log('✓ Navigation vers Clients');
  });

  test('4. Navigation vers Fournisseurs', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Fournisseurs")');
    await page.click('.submenu-item:has-text("Fournisseurs")');
    await page.waitForURL(/fournisseurs/);
    console.log('✓ Navigation vers Fournisseurs');
  });

  test('5. Navigation vers Vente', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Ventes")');
    await page.click('.submenu-item:has-text("Nouvelle vente")');
    await page.waitForURL(/vente/);
    console.log('✓ Navigation vers Ventes');
  });

  test('6. Navigation vers Commande clients', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Clients")');
    await page.click('.submenu-item:has-text("Commande clients")');
    await page.waitForURL(/commande-client/);
    console.log('✓ Navigation vers Commande clients');
  });

  test('7. Navigation vers Commande fournisseurs', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Fournisseurs")');
    await page.click('.submenu-item:has-text("Commande fournisseur")');
    await page.waitForURL(/commande-fournisseur/);
    console.log('✓ Navigation vers Commande fournisseurs');
  });

  test('8. Navigation vers Catégories', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Paramètres")');
    await page.click('.submenu-item:has-text("Catégories")');
    await page.waitForURL(/categories/);
    console.log('✓ Navigation vers Catégories');
  });

  test('9. Navigation vers Utilisateurs', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Paramètres")');
    await page.click('.submenu-item:has-text("Utilisateurs")');
    await page.waitForURL(/utilisateurs/);
    console.log('✓ Navigation vers Utilisateurs');
  });

  test('10. Navigation vers Profil via header', async ({ page }) => {
    await login(page);
    await page.click('.user-info, [routerlink="/profil"]');
    await page.waitForURL(/profil/);
    console.log('✓ Navigation vers Profil');
  });

  test('11. Test menu collapsed toggle', async ({ page }) => {
    await login(page);
    const toggleBtn = page.locator('button').first();
    await toggleBtn.click();
    await page.waitForTimeout(500);
    console.log('✓ Toggle cliqué');
  });

  test('12. Page inscription accessible', async ({ page }) => {
    await page.goto('/inscription');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('inscription');
    console.log('✓ Page inscription accessible');
  });

  test('13. Routes protegées_redirect vers login', async ({ page }) => {
    const routes = ['/dashbord', '/articles', '/clients'];
    for (const route of routes) {
      await page.goto(route);
      await expect(page).toHaveURL(/login/, { timeout: 5000 });
    }
    console.log('✓ Routes protégées redirigent vers login');
  });

  test('14. Navigation vers Statistiques', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Tableau de bord")');
    await page.click('.submenu-item:has-text("Statistiques")');
    await page.waitForURL(/statistiques/);
    console.log('✓ Navigation vers Statistiques');
  });

  test('15. Navigation vers Avoirs', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Ventes")');
    await page.click('.submenu-item:has-text("Avoirs")');
    await page.waitForURL(/avoirs/);
    console.log('✓ Navigation vers Avoirs');
  });

  test('16. Navigation vers Mouvement de stock', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Articles")');
    await page.click('.submenu-item:has-text("Mouvement de stock")');
    await page.waitForURL(/mvtstk/);
    console.log('✓ Navigation vers Mouvement de stock');
  });

  test('17. Navigation vers Historique des ventes', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Ventes")');
    await page.click('.submenu-item:has-text("Historique des ventes")');
    await page.waitForURL(/liste-vente/);
    console.log('✓ Navigation vers Historique des ventes');
  });

  test('18. Déconnexion', async ({ page }) => {
    await login(page);
    const logoutBtn = page.locator('.menu-item').filter({ hasText: /Déconnexion/ }).first();
    await logoutBtn.click();
    await page.waitForURL(/login/);
    console.log('✓ Déconnexion réussie');
  });
});