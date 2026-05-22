const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:4200';
const LOGIN_URL = `${BASE_URL}/login`;
const BACKEND_URL = 'http://12.24.5.100:8085';
const USER = { email: 'entreprise2@test.com', password: 'luca1593' };

let allResults = [];
let passedTests = 0;
let failedTests = 0;

function recordTest(name, passed, details = '') {
  allResults.push({ name, passed, details });
  if (passed) passedTests++;
  else failedTests++;
  console.log(`  ${passed ? '✅' : '❌'} ${name}${details ? ' - ' + details : ''}`);
}

async function login(page, email, password) {
  await page.goto(LOGIN_URL, { timeout: 30000 });
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
  
  const emailInput = await page.$('#mail');
  const passwordInput = await page.$('#motdepasse');
  const submitBtn = await page.$('button:has-text("Se connecter")');
  
  if (!emailInput || !passwordInput) return false;
  
  await emailInput.fill(email);
  await passwordInput.fill(password);
  await submitBtn.click();
  await page.waitForTimeout(5000);
  
  const token = await page.evaluate(() => sessionStorage.getItem('gs_access_token'));
  return !!token;
}

async function testLogin(page) {
  console.log('\n📋 TEST 1: Login');
  const success = await login(page, USER.email, USER.password);
  recordTest('Login avec credentials', success, success ? 'Token obtenu' : 'Échec login');
  
  if (success) {
    const userData = await page.evaluate(() => {
      const u = sessionStorage.getItem('gs_user');
      return u ? JSON.parse(u) : null;
    });
    recordTest('Données utilisateur en session', !!userData, userData ? userData.nom : 'Aucun');
  }
  return success;
}

async function testHeader(page) {
  console.log('\n📋 TEST 2: Header - Nom utilisateur');
  
  const userName = await page.$('.user-name');
  recordTest('Élément user-name présent', !!userName);
  
  if (userName) {
    const text = await userName.textContent();
    recordTest('Nom affiché', text && text.length > 0, text);
    
    const styles = await userName.evaluate(el => {
      const s = window.getComputedStyle(el);
      return { color: s.color, fontWeight: s.fontWeight };
    });
    recordTest('Style visible', styles.color !== 'rgb(0, 0, 0)', `Color: ${styles.color}, Weight: ${styles.fontWeight}`);
  }
}

async function testMenuCollapse(page) {
  console.log('\n📋 TEST 3: Menu Collapse');
  
  const sidebar = await page.$('.sidebar');
  const widthBefore = sidebar ? await sidebar.evaluate(el => el.offsetWidth) : 0;
  recordTest('Sidebar largeur initiale', widthBefore > 100, `${widthBefore}px`);
  
  const collapseBtn = await page.$('.menu-toggle');
  recordTest('Bouton collapse présent', !!collapseBtn);
  
  if (collapseBtn) {
    const btnHtml = await collapseBtn.evaluate(el => el.outerHTML);
    recordTest('Bouton HTML valide', btnHtml.includes('menu-toggle'));
    
    await collapseBtn.click();
    await page.waitForTimeout(1000);
    
    const sidebarAfter = await page.$('.sidebar');
    const widthAfter = sidebarAfter ? await sidebarAfter.evaluate(el => el.offsetWidth) : 0;
    recordTest('Sidebar réduite', widthAfter < widthBefore, `${widthAfter}px (était ${widthBefore}px)`);
    
    const bodyClass = await page.evaluate(() => document.body.className);
    const hasCollapsedClass = await page.evaluate(() => {
      const sidebar = document.querySelector('.sidebar');
      return sidebar ? sidebar.classList.contains('collapsed') : false;
    });
    recordTest('Classe collapsed ajoutée', hasCollapsedClass);
    
    await collapseBtn.click();
    await page.waitForTimeout(1000);
    
    const sidebarRestored = await page.$('.sidebar');
    const widthRestored = sidebarRestored ? await sidebarRestored.evaluate(el => el.offsetWidth) : 0;
    recordTest('Sidebar restaurée', widthRestored === widthBefore, `${widthRestored}px`);
    
    const hasCollapsedAfter = await page.evaluate(() => {
      const sidebar = document.querySelector('.sidebar');
      return sidebar ? sidebar.classList.contains('collapsed') : false;
    });
    recordTest('Classe collapsed retirée', !hasCollapsedAfter);
    
    // Test multiples toggles
    let hasIssue = false;
    for (let i = 0; i < 5; i++) {
      await collapseBtn.click();
      await page.waitForTimeout(300);
    }
    const finalWidth = await sidebar.evaluate(el => el.offsetWidth);
    const expectedWidth = 70;
    recordTest('5 toggles cohérents', finalWidth === expectedWidth || finalWidth === widthBefore, `Final: ${finalWidth}px`);
  }
}

async function testMenuSubmenus(page) {
  console.log('\n📋 TEST 4: Sous-menus actifs');
  
  const menus = [
    { name: 'Ventes', submenus: ['Nouvelle vente', 'Historique des ventes'], urls: ['/vente', '/liste-vente'] },
    { name: 'Articles', submenus: ['Articles', 'Mouvement de stock'], urls: ['/articles', '/mvtstk'] },
    { name: 'Clients', submenus: ['Clients', 'Commande clients'], urls: ['/clients', '/commande-client'] }
  ];
  
  for (const menu of menus) {
    console.log(`  Menu: ${menu.name}`);
    
    for (let i = 0; i < menu.urls.length; i++) {
      await page.goto(`${BASE_URL}${menu.urls[i]}`, { timeout: 15000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      
      const activeSubmenus = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('.submenu-item.active'));
        return items.map(el => el.textContent.trim());
      });
      
      recordTest(
        `${menu.name} → ${menu.submenus[i]}: 1 seul actif`,
        activeSubmenus.length === 1,
        `Actifs: [${activeSubmenus.join(', ')}]`
      );
      
      recordTest(
        `${menu.submenus[i]} est le seul actif`,
        activeSubmenus.includes(menu.submenus[i]),
        activeSubmenus.join(', ')
      );
    }
  }
}

async function testMenuPersistence(page) {
  console.log('\n📋 TEST 5: Persistance menu ouvert');
  
  await page.goto(`${BASE_URL}/vente`, { timeout: 15000, waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  
  const ventesMenu = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('.menu-item.parent'));
    const ventes = items.find(el => el.textContent.includes('Ventes'));
    if (!ventes) return { found: false };
    return { found: true, hasActive: ventes.classList.contains('active') };
  });
  recordTest('Menu Ventes trouvé', ventesMenu.found);
  recordTest('Menu Ventes actif quand sous-page', ventesMenu.hasActive);
  
  const submenuVisible = await page.evaluate(() => {
    const submenus = document.querySelectorAll('.submenu');
    return Array.from(submenus).some(el => el.offsetParent !== null);
  });
  recordTest('Sous-menu visible si actif', submenuVisible);
}

async function testPagesNavigation(page) {
  console.log('\n📋 TEST 6: Navigation pages');
  
  const pages = [
    { name: 'Dashboard', url: '/dashbord' },
    { name: 'Articles', url: '/articles' },
    { name: 'Clients', url: '/clients' },
    { name: 'Fournisseurs', url: '/fournisseurs' },
    { name: 'Categories', url: '/categories' },
    { name: 'Ventes', url: '/vente' },
    { name: 'MvtStock', url: '/mvtstk' },
    { name: 'Utilisateurs', url: '/utilisateurs' },
    { name: 'Avoirs', url: '/avoirs' }
  ];
  
  for (const p of pages) {
    try {
      await page.goto(`${BASE_URL}${p.url}`, { timeout: 10000, waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(500);
      
      const currentUrl = page.url();
      const hasContent = await page.evaluate(() => document.body.innerText.length > 100);
      
      recordTest(
        `Page ${p.name}`,
        hasContent,
        `URL: ${currentUrl.includes(p.url) ? 'OK' : 'Redirigé'}`
      );
    } catch (e) {
      recordTest(`Page ${p.name}`, false, `Timeout/Erreur`);
    }
  }
}

async function testBackendApi(page) {
  console.log('\n📋 TEST 7: API Backend');
  
  const tokenRaw = await page.evaluate(() => sessionStorage.getItem('gs_access_token'));
  let token = tokenRaw;
  try {
    const parsed = JSON.parse(tokenRaw);
    token = parsed.accessToken || tokenRaw;
  } catch(e) {}
  console.log(`  Token: ${token ? token.substring(0, 30) + '...' : 'AUCUN'}`);
  
  const endpoints = [
    { name: 'Dashboard Stats', path: '/v1/dashboard/stats' },
    { name: 'Articles', path: '/v1/articles/all' },
    { name: 'Clients', path: '/v1/client/all' },
    { name: 'Fournisseurs', path: '/v1/fournisseur/all' },
    { name: 'Categories', path: '/v1/category/all' },
    { name: 'Ventes', path: '/v1/vente/all' },
    { name: 'MvtStk', path: '/v1/mvtstk/all' },
    { name: 'Utilisateurs', path: '/v1/utilisateur/all' },
    { name: 'Avoirs', path: '/v1/avoirs/all' },
    { name: 'Entrepots', path: '/v1/entrepots/all' },
    { name: 'Factures', path: '/v1/factures/all' },
    { name: 'Paiements', path: '/v1/paiements/all' },
    { name: 'Inventaires', path: '/v1/inventaires/all' },
    { name: 'Lots', path: '/v1/lots/all' },
    { name: 'Regles Tarifaires', path: '/v1/regles-tarifaires/all' },
    { name: 'Transferts Stock', path: '/v1/transferts/all' },
    { name: 'Alertes Stock', path: '/v1/alert-stock/actives/2' }
  ];
  
  for (const ep of endpoints) {
    try {
      const result = await page.evaluate(async ({ url, tok }) => {
        try {
          const res = await fetch(url, {
            method: 'GET',
            headers: { 
              'Authorization': 'Bearer ' + tok,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            mode: 'cors',
            credentials: 'include'
          });
          let data = null;
          const text = await res.text();
          try { data = JSON.parse(text); } catch(e) { data = text.substring(0, 200); }
          return { status: res.status, ok: res.ok, data: data };
        } catch (e) {
          return { status: 0, ok: false, error: e.message };
        }
      }, { url: `${BACKEND_URL}${ep.path}`, tok: token });
      
      const detail = result.data ? (typeof result.data === 'string' ? result.data.substring(0, 100) : JSON.stringify(result.data).substring(0, 100)) : '';
      recordTest(
        `API ${ep.name}`,
        result.ok,
        `Status: ${result.status}${result.error ? ' - ' + result.error : ''}${detail ? ' | ' + detail : ''}`
      );
    } catch (e) {
      recordTest(`API ${ep.name}`, false, 'Erreur réseau: ' + e.message);
    }
  }
}

async function testDarkTheme(page) {
  console.log('\n📋 TEST 8: Thème');
  
  const isDark = await page.evaluate(() => document.body.classList.contains('dark-theme'));
  const themeState = isDark ? 'sombre' : 'clair';
  recordTest(`Thème ${themeState} détecté`, true, themeState);
  
  const userNameColor = await page.evaluate(() => {
    const el = document.querySelector('.user-name');
    return el ? window.getComputedStyle(el).color : '';
  });
  recordTest('Nom utilisateur visible', userNameColor !== 'rgb(0, 0, 0)', userNameColor);
  
  const headerBg = await page.evaluate(() => {
    const el = document.querySelector('.header-wrapper');
    return el ? window.getComputedStyle(el).background : '';
  });
  recordTest('Header style appliqué', headerBg.length > 0);
}

async function testResponsive(page) {
  console.log('\n📋 TEST 9: Responsive');
  
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(500);
  
  const mobileSidebar = await page.$('.sidebar');
  const mobileWidth = mobileSidebar ? await mobileSidebar.evaluate(el => el.offsetWidth) : 0;
  recordTest('Menu adapté mobile', mobileWidth <= 260, `${mobileWidth}px`);
  
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.waitForTimeout(500);
  
  const desktopSidebar = await page.$('.sidebar');
  const desktopWidth = desktopSidebar ? await desktopSidebar.evaluate(el => el.offsetWidth) : 0;
  recordTest('Menu adapté desktop', desktopWidth >= 260, `${desktopWidth}px`);
}

async function main() {
  console.log('='.repeat(70));
  console.log('TEST COMPLET - Gestion de Stock Frontend');
  console.log('='.repeat(70));
  console.log(`Frontend: ${BASE_URL}`);
  console.log(`Backend: ${BACKEND_URL}`);
  
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  console.log('\n🔗 Vérification serveur...');
  try {
    await page.goto(BASE_URL, { timeout: 10000 });
    recordTest('Serveur accessible', true);
  } catch (e) {
    recordTest('Serveur accessible', false, e.message);
    await browser.close();
    printResults();
    process.exit(1);
  }
  
  const loginOk = await testLogin(page);
  if (!loginOk) {
    recordTest('Tests suivants', false, 'Login échoué');
    await browser.close();
    printResults();
    process.exit(1);
  }
  
  await page.waitForTimeout(1000);
  
  await testHeader(page);
  await testMenuCollapse(page);
  await testMenuSubmenus(page);
  await testMenuPersistence(page);
  await testPagesNavigation(page);
  await testBackendApi(page);
  await testDarkTheme(page);
  await testResponsive(page);
  
  await browser.close();
  printResults();
}

function printResults() {
  console.log('\n' + '='.repeat(70));
  console.log('RÉSULTATS FINAUX');
  console.log('='.repeat(70));
  console.log(`\nTotal: ${passedTests + failedTests} | ✅ Réussis: ${passedTests} | ❌ Échoués: ${failedTests}`);
  console.log(`Taux de réussite: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);
  
  if (failedTests > 0) {
    console.log('\n❌ Échecs détaillés:');
    allResults.filter(r => !r.passed).forEach(r => {
      console.log(`  - ${r.name}: ${r.details}`);
    });
  }
  
  console.log('\n' + '='.repeat(70));
}

main().catch(e => {
  console.error('Erreur fatale:', e);
  process.exit(1);
});
