const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:4200';
const LOGIN_URL = `${BASE_URL}/login`;
const BACKEND_URL = 'http://12.24.5.100:8085';

const USERS = [
  { email: 'entreprise1@test.com', password: 'luca1593' },
  { email: 'entreprise2@test.com', password: 'luca1593' }
];

const PAGES = [
  { name: 'Dashboard', path: '/dashbord' },
  { name: 'Articles', path: '/articles' },
  { name: 'Clients', path: '/clients' },
  { name: 'Fournisseurs', path: '/fournisseurs' },
  { name: 'Categories', path: '/categories' },
  { name: 'Ventes', path: '/vente' },
  { name: 'MvtStock', path: '/mvtstk' },
  { name: 'Utilisateurs', path: '/utilisateurs' }
];

let testResults = [];
let totalTests = 0;
let successfulTests = 0;
let failedTests = 0;

async function backendLogin(email, password) {
  // First authenticate with the backend directly
  const loginData = JSON.stringify({ login: email, password: password });
  
  try {
    const response = await fetch(`${BACKEND_URL}/v1/auth/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: loginData
    });
    
    const data = await response.json();
    return { success: response.ok, data };
  } catch (e) {
    return { success: false, error: e.message };
  }
}

async function login(page, email, password) {
  try {
    console.log(`\n  🔐 Login with ${email}...`);
    await page.goto(LOGIN_URL, { timeout: 30000 });
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    
    // Fill login form using ID selectors
    const emailInput = await page.$('#mail');
    const passwordInput = await page.$('#motdepasse');
    const submitBtn = await page.$('button:has-text("Se connecter")');
    
    if (!emailInput || !passwordInput) {
      console.log(`     ❌ Login form fields not found`);
      return { success: false, error: 'Form not found' };
    }
    
    // Clear and fill
    await emailInput.fill('');
    await passwordInput.fill('');
    await emailInput.fill(email);
    await passwordInput.fill(password);
    
    console.log(`     Filled form with credentials`);
    
    // Click submit
    await submitBtn.click();
    console.log(`     Clicked submit button`);
    
    // Wait for response
    await page.waitForTimeout(5000);
    
    // Check for error messages
    const errorAlert = await page.$('.alert-danger, .alert');
    if (errorAlert) {
      const errorText = await errorAlert.textContent();
      console.log(`     ⚠️ Error alert found: ${errorText}`);
    }
    
    // Check current URL
    const currentUrl = page.url();
    const urlChanged = !currentUrl.includes('/login');
    
    console.log(`     Current URL: ${currentUrl}`);
    
    // Also check what's in the page
    const bodyText = await page.evaluate(() => document.body.innerText.substring(0, 500));
    console.log(`     Page preview: ${bodyText.substring(0, 200)}...`);
    
    // Try to get session storage
    const sessionData = await page.evaluate(() => {
      return {
        token: sessionStorage.getItem('gs_access_token') ? 'exists' : 'none',
        user: sessionStorage.getItem('gs_user') ? 'exists' : 'none'
      };
    });
    console.log(`     Session: ${sessionData.token}, ${sessionData.user}`);
    
    return { success: urlChanged || sessionData.token === 'exists', url: currentUrl };
  } catch (e) {
    console.log(`  ❌ Login error: ${e.message}`);
    return { success: false, error: e.message };
  }
}

async function checkHeaderUserName(page) {
  const sessionData = await page.evaluate(() => {
    const userStr = sessionStorage.getItem('gs_user');
    let user = null;
    if (userStr) {
      try { user = JSON.parse(userStr); } catch(e) {}
    }
    return { 
      token: !!sessionStorage.getItem('gs_access_token'),
      hasUser: !!userStr,
      userData: user
    };
  });
  
  console.log(`     Session: token=${sessionData.token}, user=${sessionData.hasUser}`);
  if (sessionData.userData) {
    console.log(`     User name: ${sessionData.userData.nom} ${sessionData.userData.prenom || ''}`);
  }
  
  return { success: sessionData.token && sessionData.hasUser, data: sessionData };
}

async function checkPageData(page, pageInfo) {
  try {
    console.log(`    📄 Checking ${pageInfo.name} page...`);
    await page.goto(`${BASE_URL}${pageInfo.path}`, { timeout: 15000 });
    await page.waitForTimeout(2000);
    await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    
    const currentUrl = page.url();
    const urlSuccess = currentUrl.includes(pageInfo.path) || currentUrl.includes('login') === false;
    
    const content = await page.content();
    const hasPageContent = content.length > 500;
    
    const tables = await page.$$('table');
    let tableRows = 0;
    if (tables.length > 0) {
      for (const table of tables) {
        const rows = await table.$$('tr');
        tableRows += rows.length;
      }
    }
    
    const result = {
      success: urlSuccess && hasPageContent,
      url: currentUrl,
      hasTable: tables.length > 0,
      tableRows: tableRows,
      path: pageInfo.path
    };
    
    console.log(`       ${result.success ? '✅' : '⚠️'} ${pageInfo.name}: url=${urlSuccess}, rows=${tableRows}`);
    
    return result;
  } catch (e) {
    return { success: false, error: e.message, path: pageInfo.path };
  }
}

async function logout(page) {
  try {
    await page.goto(LOGIN_URL);
    await page.evaluate(() => sessionStorage.clear());
    console.log(`  👋 Session cleared`);
    return true;
  } catch (e) {
    return false;
  }
}

async function runTest(page, userNum, testNum) {
  const user = USERS[userNum - 1];
  console.log(`\n${'='.repeat(50)}`);
  console.log(`TEST ${testNum}: ${user.email}`);
  console.log(`${'='.repeat(50)}`);
  
  totalTests++;
  
  // Login using the actual login flow
  const loginResult = await login(page, user.email, user.password);
  
  if (!loginResult.success) {
    console.log(`  ❌ Login FAILED`);
    failedTests++;
    return { test: testNum, user: user.email, login: false, success: false };
  }
  
  console.log(`  ✅ Login successful`);
  
  // Wait for data to load
  await page.waitForTimeout(1000);
  
  // Check session data
  const headerCheck = await checkHeaderUserName(page);
  
  // Navigate through pages
  let pagesWithData = 0;
  for (const pageInfo of PAGES) {
    const pageData = await checkPageData(page, pageInfo);
    if (pageData.success) pagesWithData++;
  }
  
  // Logout
  await logout(page);
  
  const success = loginResult.success && headerCheck.success;
  if (success) successfulTests++;
  else failedTests++;
  
  const result = {
    test: testNum,
    user: user.email,
    login: loginResult.success,
    headerCheck: headerCheck.success,
    storageToken: headerCheck.data?.token,
    pagesWithData,
    success
  };
  
  console.log(`\n--- Test ${testNum} Summary ---`);
  console.log(`✅ Passed: ${successfulTests} | ❌ Failed: ${failedTests}`);
  
  return result;
}

async function main() {
  console.log('='.repeat(60));
  console.log('PLAYWRIGHT TEST - 20+ TESTS WITH SESSION');
  console.log('='.repeat(60));
  console.log(`Target: ${BASE_URL}`);
  console.log(`Backend: ${BACKEND_URL}`);
  
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 }
  });
  
  const page = await context.newPage();
  
  // Verify server
  console.log(`\n🔗 Verifying server...`);
  try {
    await page.goto(BASE_URL, { timeout: 10000 });
    await page.waitForLoadState('domcontentloaded');
    console.log(`✅ Server is running`);
  } catch (e) {
    console.log(`❌ Server not accessible: ${e.message}`);
    await browser.close();
    process.exit(1);
  }
  
  // Run 20+ tests
  for (let i = 0; i < 20; i++) {
    const userNum = (i % 2) + 1;
    const result = await runTest(page, userNum, i + 1);
    testResults.push(result);
    await page.waitForTimeout(500);
  }
  
  await browser.close();
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('FINAL RESULTS');
  console.log('='.repeat(60));
  
  console.log(`\nTotal: ${totalTests} | Passed: ${successfulTests} | Failed: ${failedTests}`);
  console.log(`Success rate: ${(successfulTests/totalTests*100).toFixed(1)}%`);
  
  testResults.forEach((r, i) => {
    console.log(`Test ${i+1} [${r.user}]: login=${r.login}, token=${r.storageToken}, pages=${r.pagesWithData} → ${r.success ? 'PASS' : 'FAIL'}`);
  });
  
  const fs = require('fs');
  fs.writeFileSync('playwright-test-results.json', JSON.stringify({
    summary: { total: totalTests, passed: successfulTests, failed: failedTests },
    tests: testResults
  }, null, 2));
}

main().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});