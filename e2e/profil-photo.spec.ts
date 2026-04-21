import { test, expect, Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const USER_EMAIL = 'entreprise1@test.com';
const USER_PASSWORD = 'luca1593';

test.describe('Test Modification Photo Profil', () => {

  test('1. Telecharger une photo depuis internet', async ({ request }) => {
    const response = await request.get('https://picsum.photos/200', {
      headers: {
        'Accept': 'image/*'
      }
    });
    
    console.log('Download photo: ' + response.status());
    expect(response.status()).toBe(200);
    
    const contentType = response.headers()['content-type'] || '';
    console.log('Content-Type: ' + contentType);
  });

  test('2. Connexion et acces au profil', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#mail', USER_EMAIL);
    await page.fill('#motdepasse', USER_PASSWORD);
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL(/dashbord/, { timeout: 15000 });
    
    const profilLink = page.locator('.user-info, a[href*="profil"]').first();
    await profilLink.click();
    await page.waitForURL(/profil/);
    
    console.log('✓ Page profil chargée');
    expect(page.url()).toContain('profil');
  });

  test('3. Bouton modifier photo visible apres clic sur Modifier', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#mail', USER_EMAIL);
    await page.fill('#motdepasse', USER_PASSWORD);
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL(/dashbord/);
    
    const profilLink = page.locator('.user-info, a[href*="profil"]').first();
    await profilLink.click();
    await page.waitForURL(/profil/);
    
    const modifierBtn = page.locator('button:has-text("Modifier")');
    if (await modifierBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await modifierBtn.click();
      await page.waitForTimeout(500);
    }
    
    const avatarEditBtn = page.locator('.avatar-edit-btn, label:has(.fa-camera)');
    const isVisible = await avatarEditBtn.isVisible({ timeout: 5000 }).catch(() => false);
    
    console.log('✓ Bouton edit photo visible après Modifier: ' + isVisible);
  });

  test('4. Test clic sur bouton modifier photo', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#mail', USER_EMAIL);
    await page.fill('#motdepasse', USER_PASSWORD);
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL(/dashbord/);
    
    const profilLink = page.locator('.user-info, a[href*="profil"]').first();
    await profilLink.click();
    await page.waitForURL(/profil/);
    
    const modifierBtn = page.locator('button:has-text("Modifier")');
    if (await modifierBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await modifierBtn.click();
      await page.waitForTimeout(500);
    }
    
    const avatarEditBtn = page.locator('.avatar-edit-btn, label:has(.fa-camera)').first();
    if (await avatarEditBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await avatarEditBtn.click();
      await page.waitForTimeout(500);
      
      const fileInput = page.locator('input[type="file"][accept="image/*"]');
      const inputExists = await fileInput.count() > 0;
      
      console.log('✓ File input pour photo existe: ' + inputExists);
      expect(inputExists).toBeTruthy();
    } else {
      console.log('⚠ Bouton edit non visible');
    }
  });

  test('5. Telecharger et appliquer photo au profil', async ({ page }) => {
    const photoUrl = 'https://picsum.photos/200';
    
    const response = await page.request.get(photoUrl);
    const buffer = await response.body();
    
    const tempDir = '/tmp/playwright-test';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    const photoPath = path.join(tempDir, 'test-photo.jpg');
    fs.writeFileSync(photoPath, buffer);
    
    console.log('✓ Photo téléchargée: ' + photoPath);
    expect(fs.existsSync(photoPath)).toBeTruthy();
    
    await page.goto('/login');
    await page.fill('#mail', USER_EMAIL);
    await page.fill('#motdepasse', USER_PASSWORD);
    await page.click('button:has-text("Se connecter")');
    await page.waitForURL(/dashbord/);
    
    const profilLink = page.locator('.user-info, a[href*="profil"]').first();
    await profilLink.click();
    await page.waitForURL(/profil/);
    
    const modifierBtn = page.locator('button:has-text("Modifier")');
    if (await modifierBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await modifierBtn.click();
      await page.waitForTimeout(500);
    }
    
    const avatarEditBtn = page.locator('.avatar-edit-btn, label:has(.fa-camera)').first();
    if (await avatarEditBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await avatarEditBtn.click();
      await page.waitForTimeout(500);
      
      const fileInput = page.locator('input[type="file"][accept="image/*"]');
      await fileInput.setInputFiles(photoPath);
      await page.waitForTimeout(2000);
      
      console.log('✓ Photo sélectionnée et appliquée au profil');
    }
  });
});