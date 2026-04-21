const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:4200';
const LOGIN_URL = `${BASE_URL}/login`;
const BACKEND_URL = 'http://12.24.5.100:8085';

const USER = { email: 'entreprise1@test.com', password: 'luca1593' };

async function login(page, email, password) {
  await page.goto(LOGIN_URL, { timeout: 30000 });
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
  
  const emailInput = await page.$('#mail');
  const passwordInput = await page.$('#motdepasse');
  const submitBtn = await page.$('button:has-text("Se connecter")');
  
  if (!emailInput || !passwordInput) {
    console.log('Login form fields not found');
    return false;
  }
  
  await emailInput.fill(email);
  await passwordInput.fill(password);
  await submitBtn.click();
  await page.waitForTimeout(5000);
  
  const token = await page.evaluate(() => sessionStorage.getItem('gs_access_token'));
  return !!token;
}

async function checkSubmenuActiveStates(page, menuName, submenuItems) {
  console.log(`\n  🔍 Testing menu: ${menuName}`);
  
  let results = [];
  
  for (const submenu of submenuItems) {
    console.log(`    Navigating to: ${submenu.title}`);
    
    await page.goto(`${BASE_URL}${submenu.url}`, { timeout: 15000, waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    const submenuActive = await page.evaluate((title) => {
      const items = Array.from(document.querySelectorAll('.submenu-item'));
      const item = items.find(el => el.textContent.includes(title));
      if (!item) return { found: false };
      return {
        found: true,
        hasActiveClass: item.classList.contains('active'),
        bgColor: window.getComputedStyle(item).backgroundColor,
        color: window.getComputedStyle(item).color,
        textContent: item.textContent.trim()
      };
    }, submenu.title);
    
    console.log(`      Active: ${submenuActive.hasActiveClass}, Color: ${submenuActive.color}, Bg: ${submenuActive.bgColor}`);
    
    results.push({
      url: submenu.url,
      title: submenu.title,
      isActive: submenuActive.hasActiveClass,
      color: submenuActive.color,
      bgColor: submenuActive.bgColor
    });
  }
  
  const activeCount = results.filter(r => r.isActive).length;
  console.log(`    Total active: ${activeCount}/${results.length}`);
  
  return { menu: menuName, results, hasMultipleActive: activeCount > 1 };
}

async function main() {
  console.log('='.repeat(60));
  console.log('PLAYWRIGHT TEST - Menu Submenu Active States');
  console.log('='.repeat(60));
  console.log(`Target: ${BASE_URL}`);
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  console.log('\n🔐 Logging in...');
  const loginSuccess = await login(page, USER.email, USER.password);
  if (!loginSuccess) {
    console.log('❌ Login failed');
    await browser.close();
    process.exit(1);
  }
  console.log('✅ Login successful');
  
  await page.waitForTimeout(1000);
  
  const testMenus = [
    {
      name: 'Ventes',
      submenus: [
        { title: 'Nouvelle vente', url: '/vente' },
        { title: 'Historique des ventes', url: '/historique-vente' }
      ]
    },
    {
      name: 'Articles',
      submenus: [
        { title: 'Articles', url: '/articles' },
        { title: 'Mouvement de stock', url: '/mvtstk' }
      ]
    },
    {
      name: 'Clients',
      submenus: [
        { title: 'Clients', url: '/clients' },
        { title: 'Commande clients', url: '/commande-client' }
      ]
    }
  ];
  
  let allResults = [];
  let hasIssues = false;
  
  for (const menu of testMenus) {
    const result = await checkSubmenuActiveStates(page, menu.name, menu.submenus);
    allResults.push(result);
    if (result.hasMultipleActive) {
      hasIssues = true;
    }
  }
  
  await browser.close();
  
  console.log('\n' + '='.repeat(60));
  console.log('RESULTS');
  console.log('='.repeat(60));
  
  for (const result of allResults) {
    console.log(`\n${result.menu}:`);
    for (const r of result.results) {
      console.log(`  ${r.title}: active=${r.isActive}, color=${r.color}`);
    }
    if (result.hasMultipleActive) {
      console.log(`  ⚠️ ISSUE: Multiple submenus are active at once!`);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  if (hasIssues) {
    console.log('❌ TEST FAILED: Multiple submenus can be active simultaneously');
    process.exit(1);
  } else {
    console.log('✅ TEST PASSED: Only one submenu is active at a time');
  }
}

main().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
