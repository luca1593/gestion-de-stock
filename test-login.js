const { chromium } = require('playwright');

const USER1 = { email: 'entreprise1@test.com', password: 'luca1593' };
const USER2 = { email: 'entreprise2@test.com', password: 'luca1593' };
const BASE_URL = 'http://localhost:4200';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForPage(page, selector, timeout = 5000) {
  try {
    await page.waitForSelector(selector, { timeout });
    return true;
  } catch {
    return false;
  }
}

async function testLoginLogoutCycle(browser, user, cycleNum) {
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log(`\n=== Cycle ${cycleNum}: Connexion avec ${user.email} ===`);
  
  try {
    await page.goto(BASE_URL + '/login', { waitUntil: 'domcontentloaded' });
    await sleep(2000);
    
    // Debug: log page URL
    console.log(`  Page URL: ${page.url()}`);
    
    // Wait for login form
    const emailInput = await waitForPage(page, '#mail', 10000);
    if (!emailInput) {
      // Debug: get page content
      const content = await page.content();
      console.log('❌ Login form not found');
      console.log(`  Contient "login": ${content.includes('login')}`);
      return false;
    }
    
    // Fill login form
    await page.fill('#mail', user.email);
    await page.fill('#motdepasse', user.password);
    
    // Click login button - wait for button to be visible
    await page.waitForSelector('button.btn-primary', { state: 'visible', timeout: 5000 });
    await page.click('button.btn-primary');
    await sleep(1000);
    
    // Wait for dashboard
    try {
      await page.waitForURL('**/dashbord', { timeout: 15000 });
    } catch {
      // Check if we're on dashboard anyway
      const currentUrl = page.url();
      if (!currentUrl.includes('dashbord')) {
        console.log(`⚠️ URL actuelle: ${currentUrl}`);
        await context.close();
        return false;
      }
    }
    console.log(`✓ Connecté avec ${user.email}`);
    
    // Wait for user data to load - need more time for the async getUserByEmail
    await sleep(3000);
    
    // Check user name in header
    await page.waitForSelector('.user-name', { timeout: 5000 }).catch(() => null);
    const userName = await page.$eval('.user-name', el => el.textContent).catch(() => null);
    console.log(`✓ Nom affiché: ${userName || 'NON TROUVÉ'}`);
    
    if (!userName) {
      console.log('⚠️ Nom utilisateur NON affiché!');
    }
    
    // Navigate to different pages
    const pages = ['dashbord', 'articles', 'clients', 'fournisseurs', 'vente', 'categories', 'utilisateurs'];
    for (const p of pages) {
      await page.goto(BASE_URL + '/' + p, { waitUntil: 'networkidle' }).catch(() => {});
      await page.waitForTimeout(500);
    }
    console.log(`✓ Navigué vers ${pages.length} pages`);
    
    // Check dashboard data
    await page.goto(BASE_URL + '/dashbord', { waitUntil: 'domcontentloaded' });
    await sleep(3000);
    const hasStats = await page.$('.stats-card, .card-stat, [class*="stat"]').catch(() => null);
    console.log(`✓ Données dashboard: ${hasStats ? 'Présentes' : 'Manquantes'}`);
    
    // Logout
    await sleep(500);
    try {
      const logoutBtn = await page.$('[href*="logout"], .menu-item:has-text("Déconnexion")');
      if (logoutBtn) {
        await logoutBtn.click();
        await page.waitForURL('**/login', { timeout: 5000 });
        console.log('✓ Déconnecté');
      }
    } catch (e) {
      // Force navigation to login
      await page.goto(BASE_URL + '/login', { waitUntil: 'domcontentloaded' });
      await sleep(500);
    }
    
    await context.close();
    return true;
  } catch (error) {
    console.log(`❌ Erreur: ${error.message}`);
    await context.close();
    return false;
  }
}

async function runTests() {
  console.log('🚀 Démarrage des tests de connexion/déconnexion...\n');
  
  const browser = await chromium.launch({ headless: true });
  let success = 0;
  let fail = 0;
  
  // Run 20 cycles, alternating users
  for (let i = 1; i <= 20; i++) {
    const user = i % 2 === 1 ? USER1 : USER2;
    const result = await testLoginLogoutCycle(browser, user, i);
    if (result) success++;
    else fail++;
    await sleep(200);
  }
  
  await browser.close();
  
  console.log('\n=== RÉSULTATS ===');
  console.log(`✅ Succès: ${success}/20`);
  console.log(`❌ Échecs: ${fail}/20`);
  console.log('================\n');
  console.log('================\n');
  
  process.exit(fail > 0 ? 1 : 0);
}

runTests().catch(console.error);