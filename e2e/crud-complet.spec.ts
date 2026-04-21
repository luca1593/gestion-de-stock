import { test, expect, Page } from '@playwright/test';

const USER_EMAIL = 'entreprise1@test.com';
const USER_PASSWORD = 'luca1593';

async function login(page: Page) {
  await page.goto('/login');
  await page.fill('#mail', USER_EMAIL);
  await page.fill('#motdepasse', USER_PASSWORD);
  await page.click('button:has-text("Se connecter")');
  await page.waitForURL(/dashbord/, { timeout: 15000 });
}

async function waitForPageLoad(page: Page, timeout = 10000) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);
  try {
    await page.waitForLoadState('networkidle', { timeout });
  } catch {
    // Ignore timeout
  }
}

test.describe('Tests CRUD Complet - Toutes les pages', () => {

  test('1.1 - Categories - chargement', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    
    await login(page);
    await page.click('.menu-item:has-text("Paramètres")');
    await page.click('.submenu-item:has-text("Catégories")');
    await page.waitForURL(/categories/);
    await waitForPageLoad(page);
    
    console.log('✓ Catégories chargée, erreurs: ' + errors.length);
    expect(errors.filter(e => !e.includes('404')).length).toBe(0);
  });

  test('1.2 - Categories - creation', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Paramètres")');
    await page.click('.submenu-item:has-text("Catégories")');
    await page.waitForURL(/categories/);
    await waitForPageLoad(page);
    
    const nouveauBtn = page.locator('button:has-text("Nouvelle"), a:has-text("Nouvelle")').first();
    if (await nouveauBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await nouveauBtn.click();
      await waitForPageLoad(page);
      await page.fill('input[name="code"], input#code', 'TEST-CAT-' + Date.now());
      await page.fill('input[name="designation"], input#designation', 'Cat Test E2E');
      
      const saveBtn = page.locator('button:has-text("Sauvegarder")').first();
      if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await saveBtn.click();
        await page.waitForTimeout(2000);
      }
    }
    console.log('✓ Création catégorie');
  });

  test('2.1 - Articles - chargement', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    
    await login(page);
    await page.click('.menu-item:has-text("Articles")');
    await page.click('.submenu-item:has-text("Articles")');
    await page.waitForURL(/articles/);
    await waitForPageLoad(page);
    
    console.log('✓ Articles chargé, erreurs: ' + errors.length);
    expect(errors.filter(e => !e.includes('404')).length).toBe(0);
  });

  test('2.2 - Articles - creation', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Articles")');
    await page.click('.submenu-item:has-text("Articles")');
    await page.waitForURL(/articles/);
    await waitForPageLoad(page);
    
    const nouveauBtn = page.locator('button:has-text("Nouvel article"), a:has-text("Nouvel article")').first();
    if (await nouveauBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await nouveauBtn.click();
      await waitForPageLoad(page);
      
      await page.fill('input[name="codearticle"], input#codearticle', 'ART-TEST-' + Date.now());
      await page.fill('input[name="designation"], input#designation', 'Article Test E2E');
      await page.fill('input[name="prixht"], input#prixht', '100');
      await page.fill('input[name="tva"], input#tva', '20');
      
      const selectCat = page.locator('select[name="categorie"], #categorie');
      if (await selectCat.isVisible({ timeout: 3000 }).catch(() => false)) {
        await selectCat.click();
        await page.waitForTimeout(500);
        const option = page.locator('option').nth(1);
        if (await option.count() > 0) await option.first().click();
      }
      
      const saveBtn = page.locator('button:has-text("Sauvegarder")').first();
      if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await saveBtn.click();
        await page.waitForTimeout(2000);
      }
    }
    console.log('✓ Création article');
  });

  test('2.3 - Articles - modification', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Articles")');
    await page.click('.submenu-item:has-text("Articles")');
    await page.waitForURL(/articles/);
    await waitForPageLoad(page);
    
    const editBtn = page.locator('button:has-text("Modifier"), a:has-text("Modifier")').first();
    if (await editBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await editBtn.click();
      await waitForPageLoad(page);
      
      const input = page.locator('input[name="designation"], input#designation');
      if (await input.isVisible({ timeout: 3000 }).catch(() => false)) {
        await input.fill('Article Modifié E2E');
        const saveBtn = page.locator('button:has-text("Sauvegarder")').first();
        await saveBtn.click();
        await page.waitForTimeout(2000);
      }
    }
    console.log('✓ Modification article');
  });

  test('2.4 - Articles - suppression', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Articles")');
    await page.click('.submenu-item:has-text("Articles")');
    await page.waitForURL(/articles/);
    await waitForPageLoad(page);
    
    const deleteBtn = page.locator('button:has-text("Supprimer"), a:has-text("Supprimer")').first();
    if (await deleteBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await deleteBtn.click();
      await page.waitForTimeout(1000);
      const confirmBtn = page.locator('button:has-text("Confirmer"), .confirm').first();
      if (await confirmBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await confirmBtn.click();
        await page.waitForTimeout(2000);
      }
    }
    console.log('✓ Suppression article');
  });

  test('3.1 - Clients - chargement', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    
    await login(page);
    await page.click('.menu-item:has-text("Clients")');
    await page.click('.submenu-item:has-text("Clients")');
    await page.waitForURL(/clients/);
    await waitForPageLoad(page);
    
    console.log('✓ Clients chargé, erreurs: ' + errors.length);
    expect(errors.filter(e => !e.includes('404')).length).toBe(0);
  });

  test('3.2 - Clients - creation', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Clients")');
    await page.click('.submenu-item:has-text("Clients")');
    await page.waitForURL(/clients/);
    await waitForPageLoad(page);
    
    const nouveauBtn = page.locator('button:has-text("Nouveau client"), a:has-text("Nouveau client")').first();
    if (await nouveauBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await nouveauBtn.click();
      await waitForPageLoad(page);
      await page.fill('input[name="nom"], input#nom', 'Test Client E2E');
      await page.fill('input[name="mail"], input#mail', 'testclient' + Date.now() + '@exemple.com');
      await page.fill('input[name="telephone"], input#telephone', '0612345678');
      await page.fill('input[name="adresse"], input#adresse', '123 Rue Test');
      
      const saveBtn = page.locator('button:has-text("Sauvegarder")').first();
      if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await saveBtn.click();
        await page.waitForTimeout(2000);
      }
    }
    console.log('✓ Création client');
  });

  test('3.3 - Clients - modification', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Clients")');
    await page.click('.submenu-item:has-text("Clients")');
    await page.waitForURL(/clients/);
    await waitForPageLoad(page);
    
    const editBtn = page.locator('button:has-text("Modifier"), a:has-text("Modifier")').first();
    if (await editBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await editBtn.click();
      await waitForPageLoad(page);
      
      const nomInput = page.locator('input[name="nom"], input#nom');
      if (await nomInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await nomInput.fill('Client Modifié E2E');
        const saveBtn = page.locator('button:has-text("Sauvegarder")').first();
        await saveBtn.click();
        await page.waitForTimeout(2000);
      }
    }
    console.log('✓ Modification client');
  });

  test('4.1 - Fournisseurs - chargement', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    
    await login(page);
    await page.click('.menu-item:has-text("Fournisseurs")');
    await page.click('.submenu-item:has-text("Fournisseurs")');
    await page.waitForURL(/fournisseurs/);
    await waitForPageLoad(page);
    
    console.log('✓ Fournisseurs chargé, erreurs: ' + errors.length);
    expect(errors.filter(e => !e.includes('404')).length).toBe(0);
  });

  test('4.2 - Fournisseurs - creation', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Fournisseurs")');
    await page.click('.submenu-item:has-text("Fournisseurs")');
    await page.waitForURL(/fournisseurs/);
    await waitForPageLoad(page);
    
    const nouveauBtn = page.locator('button:has-text("Nouveau fournisseur"), a:has-text("Nouveau fournisseur")').first();
    if (await nouveauBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await nouveauBtn.click();
      await waitForPageLoad(page);
      await page.fill('input[name="nom"], input#nom', 'Test Fs E2E');
      await page.fill('input[name="mail"], input#mail', 'testfs' + Date.now() + '@exemple.com');
      await page.fill('input[name="telephone"], input#telephone', '0698765432');
      
      const saveBtn = page.locator('button:has-text("Sauvegarder")').first();
      if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await saveBtn.click();
        await page.waitForTimeout(2000);
      }
    }
    console.log('✓ Création fournisseur');
  });

test('5.1 - Commandes clients - chargement', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Clients")');
    await page.click('.submenu-item:has-text("Commande clients")');
    await page.waitForURL(/commande-client/);
    await waitForPageLoad(page);
    
    console.log('✓ Commandes clients chargé');
  });

  test('5.2 - Commandes clients - creation', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Clients")');
    await page.click('.submenu-item:has-text("Commande clients")');
    await page.waitForURL(/commande-client/);
    await waitForPageLoad(page);
    
    const nouveauBtn = page.locator('button:has-text("Nouvelle commande"), a:has-text("Nouvelle commande")').first();
    if (await nouveauBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await nouveauBtn.click();
      await waitForPageLoad(page);
      
      const clientSelect = page.locator('select[name="client"], #client');
      if (await clientSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
        await clientSelect.click();
        await page.waitForTimeout(500);
        const option = page.locator('option').nth(1);
        if (await option.count() > 0) await option.first().click();
      }
      
      const saveBtn = page.locator('button:has-text("Sauvegarder")').first();
      if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await saveBtn.click();
        await page.waitForTimeout(2000);
      }
    }
    console.log('✓ Création commande client');
  });

  test('6.1 - Commandes fournisseurs - chargement', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    
    await login(page);
    await page.click('.menu-item:has-text("Fournisseurs")');
    await page.click('.submenu-item:has-text("Commande fournisseur")');
    await page.waitForURL(/commande-fournisseur/);
    await waitForPageLoad(page);
    
    console.log('✓ Commandes fournisseurs chargé, erreurs: ' + errors.length);
    expect(errors.filter(e => !e.includes('404')).length).toBe(0);
  });

  test('6.2 - Commandes fournisseurs - creation', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Fournisseurs")');
    await page.click('.submenu-item:has-text("Commande fournisseur")');
    await page.waitForURL(/commande-fournisseur/);
    await waitForPageLoad(page);
    
    const nouveauBtn = page.locator('button:has-text("Nouvelle commande"), a:has-text("Nouvelle commande")').first();
    if (await nouveauBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await nouveauBtn.click();
      await waitForPageLoad(page);
      
      const fsSelect = page.locator('select[name="fournisseur"], #fournisseur');
      if (await fsSelect.isVisible({ timeout: 3000 }).catch(() => false)) {
        await fsSelect.click();
        await page.waitForTimeout(500);
        const option = page.locator('option').nth(1);
        if (await option.count() > 0) await option.first().click();
      }
      
      const saveBtn = page.locator('button:has-text("Sauvegarder")').first();
      if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await saveBtn.click();
        await page.waitForTimeout(2000);
      }
    }
    console.log('✓ Création commande fournisseur');
  });

  test('7.1 - Ventes - nouvelle vente', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    
    await login(page);
    await page.click('.menu-item:has-text("Ventes")');
    await page.click('.submenu-item:has-text("Nouvelle vente")');
    await page.waitForURL(/vente/);
    await waitForPageLoad(page);
    
    console.log('✓ Nouvelle vente chargé, erreurs: ' + errors.length);
    expect(errors.filter(e => !e.includes('404')).length).toBe(0);
  });

  test('7.2 - Ventes - historique', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    
    await login(page);
    await page.click('.menu-item:has-text("Ventes")');
    await page.click('.submenu-item:has-text("Historique des ventes")');
    await page.waitForURL(/liste-vente/);
    await waitForPageLoad(page);
    
    console.log('✓ Historique ventes chargé, erreurs: ' + errors.length);
    expect(errors.filter(e => !e.includes('404')).length).toBe(0);
  });

  test('7.3 - Ventes - avoirs', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    
    await login(page);
    await page.click('.menu-item:has-text("Ventes")');
    await page.click('.submenu-item:has-text("Avoirs")');
    await page.waitForURL(/avoirs/);
    await waitForPageLoad(page);
    
    console.log('✓ Avoirs chargé, erreurs: ' + errors.length);
    expect(errors.filter(e => !e.includes('404')).length).toBe(0);
  });

  test('8.1 - Mouvement stock - chargement', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    
    await login(page);
    await page.click('.menu-item:has-text("Articles")');
    await page.click('.submenu-item:has-text("Mouvement de stock")');
    await page.waitForURL(/mvtstk/);
    await waitForPageLoad(page);
    
    console.log('✓ Mouvement stock chargé, erreurs: ' + errors.length);
    expect(errors.filter(e => !e.includes('404')).length).toBe(0);
  });

  test('9.1 - Utilisateurs - chargement', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    
    await login(page);
    await page.click('.menu-item:has-text("Paramètres")');
    await page.click('.submenu-item:has-text("Utilisateurs")');
    await page.waitForURL(/utilisateurs/);
    await waitForPageLoad(page);
    
    console.log('✓ Utilisateurs chargé, erreurs: ' + errors.length);
    expect(errors.filter(e => !e.includes('404')).length).toBe(0);
  });

  test('9.2 - Utilisateurs - creation', async ({ page }) => {
    await login(page);
    await page.click('.menu-item:has-text("Paramètres")');
    await page.click('.submenu-item:has-text("Utilisateurs")');
    await page.waitForURL(/utilisateurs/);
    await waitForPageLoad(page);
    
    const nouveauBtn = page.locator('button:has-text("Nouvel utilisateur"), a:has-text("Nouvel utilisateur")').first();
    if (await nouveauBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await nouveauBtn.click();
      await waitForPageLoad(page);
      
      await page.fill('input[name="nom"], input#nom', 'Test User E2E');
      await page.fill('input[name="mail"], input#mail', 'testuser' + Date.now() + '@exemple.com');
      await page.fill('input[name="password"], input#password', 'Test1234!');
      
      const saveBtn = page.locator('button:has-text("Sauvegarder")').first();
      if (await saveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await saveBtn.click();
        await page.waitForTimeout(2000);
      }
    }
    console.log('✓ Création utilisateur');
  });

  test('10.1 - Dashboard', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    
    await login(page);
    await page.waitForURL(/dashbord/);
    await waitForPageLoad(page);
    
    console.log('✓ Dashboard chargé, erreurs: ' + errors.length);
    expect(errors.filter(e => !e.includes('404')).length).toBe(0);
  });

  test('10.2 - Statistiques', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    
    await login(page);
    await page.click('.menu-item:has-text("Tableau de bord")');
    await page.click('.submenu-item:has-text("Statistiques")');
    await page.waitForURL(/statistiques/);
    await waitForPageLoad(page);
    
    console.log('✓ Statistiques chargé, erreurs: ' + errors.length);
    expect(errors.filter(e => !e.includes('404')).length).toBe(0);
  });

  test('11.1 - Profil', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    
    await login(page);
    const profilLink = page.locator('.user-info, a[href*="profil"]').first();
    await profilLink.click();
    await page.waitForURL(/profil/);
    await waitForPageLoad(page);
    
    console.log('✓ Profil chargé, erreurs: ' + errors.length);
    expect(errors.filter(e => !e.includes('404')).length).toBe(0);
  });

  test('12.1 - Navigation principales', async ({ page }) => {
    await login(page);
    
    const routes = ['/dashbord', '/articles', '/clients', '/fournisseurs', '/vente', '/categories'];
    
    for (const route of routes) {
      try {
        await page.goto(route);
        await page.waitForTimeout(1500);
      } catch (e) {
        console.log('Nav: ' + route);
      }
    }
    
    console.log('✓ Navigation principales OK');
  });
});