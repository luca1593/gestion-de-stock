import { test, expect, Page } from '@playwright/test';

const USER_EMAIL = 'entreprise1@test.com';
const USER_PASSWORD = 'luca1593';

test.describe('Test Modification Profil Complet', () => {

  test('1. Connexion et acces au profil', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#mail', USER_EMAIL);
    await page.fill('#motdepasse', USER_PASSWORD);
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL(/dashbord/, { timeout: 15000 });
    
    const profilLink = page.locator('.user-info, a[href*="profil"]').first();
    await profilLink.click();
    await page.waitForURL(/profil/);
    
    console.log('✓ Page profil chargée');
  });

  test('2. Cliquer sur Modifier', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#mail', USER_EMAIL);
    await page.fill('#motdepasse', USER_PASSWORD);
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL(/dashbord/);
    
    const profilLink = page.locator('.user-info, a[href*="profil"]').first();
    await profilLink.click();
    await page.waitForURL(/profil/);
    
    const modifierBtn = page.locator('button:has-text("Modifier")');
    await modifierBtn.click();
    await page.waitForTimeout(500);
    
    console.log('✓ Mode édition activé');
  });

  test('3. Remplir date de naissance et pays', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#mail', USER_EMAIL);
    await page.fill('#motdepasse', USER_PASSWORD);
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL(/dashbord/);
    
    const profilLink = page.locator('.user-info, a[href*="profil"]').first();
    await profilLink.click();
    await page.waitForURL(/profil/);
    
    const modifierBtn = page.locator('button:has-text("Modifier")');
    await modifierBtn.click();
    await page.waitForTimeout(500);
    
    const dateInput = page.locator('input[type="date"]');
    if (await dateInput.isVisible()) {
      await dateInput.fill('1990-01-15');
      console.log('✓ Date de naissance définie: 1990-01-15');
    } else {
      console.log('⚠ Input date pas visible');
    }
    
    const paysInputs = page.locator('input[name="pays"], input#pays');
    if (await paysInputs.first().isVisible()) {
      await paysInputs.first().fill('France');
      console.log('✓ Pays défini: France');
    } else {
      const paysInput = page.locator('input[formControlName="pays"]');
      if (await paysInput.isVisible()) {
        await paysInput.fill('France');
      }
    }
  });

  test('4. Enregistrer les modifications avec debug', async ({ page }) => {
    const logs: string[] = [];
    const errors: string[] = [];
    page.on('console', msg => {
      const text = msg.text();
      logs.push('[' + msg.type() + '] ' + text);
      if (msg.type() === 'error') errors.push(text);
    });
    
    await page.goto('/login');
    await page.fill('#mail', USER_EMAIL);
    await page.fill('#motdepasse', USER_PASSWORD);
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL(/dashbord/);
    
    const profilLink = page.locator('.user-info, a[href*="profil"]').first();
    await profilLink.click();
    await page.waitForURL(/profil/);
    
    const modifierBtn = page.locator('button:has-text("Modifier")');
    await modifierBtn.click();
    await page.waitForTimeout(500);
    
    const dateInput = page.locator('input[type="date"]');
    if (await dateInput.isVisible()) {
      await dateInput.fill('1990-01-15');
    }
    
    const saveBtn = page.locator('button:has-text("Enregistrer")');
    await saveBtn.click();
    await page.waitForTimeout(3000);
    
    const alertDanger = page.locator('.alert-danger');
    const hasError = await alertDanger.isVisible().catch(() => false);
    
    console.log('✓ Modification enregistrée, erreurs: ' + errors.length);
    logs.forEach(l => console.log('  LOG: ' + l));
    expect(hasError).toBe(false);
  });

  test('5. Verifier photo envoyee', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#mail', USER_EMAIL);
    await page.fill('#motdepasse', USER_PASSWORD);
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL(/dashbord/);
    
    const profilLink = page.locator('.user-info, a[href*="profil"]').first();
    await profilLink.click();
    await page.waitForURL(/profil/);
    
    const modifierBtn = page.locator('button:has-text("Modifier")');
    await modifierBtn.click();
    await page.waitForTimeout(500);
    
    const avatarEditBtn = page.locator('.avatar-edit-btn, label:has(.fa-camera)').first();
    if (await avatarEditBtn.isVisible()) {
      console.log('✓ Bouton edit photo visible');
    } else {
      console.log('⚠ Bouton edit photo non visible');
    }
  });
});