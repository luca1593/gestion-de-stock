const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:4200';
const LOGIN_URL = `${BASE_URL}/login`;
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

async function checkCollapseButton(page) {
  console.log('\n  🔍 Testing collapse button...');
  
  const button = await page.$('.sidebar-menu .collapse-btn');
  if (!button) {
    console.log('    ❌ Collapse button not found');
    return { buttonFound: false };
  }
  
  const buttonHtml = await button.evaluate(el => el.outerHTML);
  console.log(`    Button HTML: ${buttonHtml.substring(0, 300)}`);
  
  const iconElement = await button.$('svg, i');
  const iconClasses = iconElement ? iconElement.getAttribute('class') || '' : 'not found';
  console.log(`    Icon classes: ${iconClasses}`);
  
  return { buttonFound: true, iconClasses };
}

async function testCollapseToggle(page) {
  console.log('\n  🔄 Testing collapse toggle...');
  
  const sidebarBefore = await page.$('.sidebar');
  const sidebarWidthBefore = sidebarBefore ? await sidebarBefore.evaluate(el => el.offsetWidth) : 0;
  console.log(`    Sidebar width before: ${sidebarWidthBefore}px`);
  
  const button = await page.$('.sidebar-menu .collapse-btn');
  if (button) {
    await button.click();
    await page.waitForTimeout(1500);
  }
  
  const bodyClass = await page.evaluate(() => document.body.className);
  console.log(`    Body class after click: ${bodyClass}`);
  
  const sidebarAfter = await page.$('.sidebar');
  const sidebarWidthAfter = sidebarAfter ? await sidebarAfter.evaluate(el => el.offsetWidth) : 0;
  console.log(`    Sidebar width after: ${sidebarWidthAfter}px`);
  
  const buttonAfter = await page.$('.sidebar-menu .collapse-btn');
  const iconEl = buttonAfter ? await buttonAfter.$('svg, i') : null;
  const iconAfter = iconEl ? iconEl.getAttribute('class') || '' : 'not found';
  console.log(`    Icon after click: ${iconAfter}`);
  
  if (button) {
    await button.click();
    await page.waitForTimeout(1500);
  }
  
  const sidebarRestore = await page.$('.sidebar');
  const sidebarWidthRestore = sidebarRestore ? await sidebarRestore.evaluate(el => el.offsetWidth) : 0;
  console.log(`    Sidebar width restored: ${sidebarWidthRestore}px`);
  
  return {
    widthBefore: sidebarWidthBefore,
    widthAfter: sidebarWidthAfter,
    widthRestored: sidebarWidthRestore,
    bodyHasClass: bodyClass.includes('menu-collapsed')
  };
}

async function testMultipleToggles(page, count = 5) {
  console.log(`\n  🔁 Testing ${count} collapse/expand toggles...`);
  
  const results = [];
  
  for (let i = 1; i <= count; i++) {
    const button = await page.$('.sidebar-menu .collapse-btn');
    if (button) {
      await button.click();
      await page.waitForTimeout(500);
      
      const iconElements = await button.$$('svg.fas, i.fas');
      const iconClasses = iconElements.map(el => el.getAttribute('class') || '').join(', ');
      const countLeft = (iconClasses.match(/fa-chevron-left/g) || []).length;
      const countRight = (iconClasses.match(/fa-chevron-right/g) || []).length;
      
      console.log(`    Toggle ${i}: icon="${iconClasses.substring(0, 40)}", left=${countLeft}, right=${countRight}`);
      
      results.push({
        toggle: i,
        iconClasses: iconClasses,
        hasMultipleLeft: countLeft > 1,
        hasMultipleRight: countRight > 1
      });
    }
  }
  
  return results;
}

async function main() {
  console.log('='.repeat(60));
  console.log('PLAYWRIGHT TEST - Menu Collapse Functionality');
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
  
  const buttonCheck = await checkCollapseButton(page);
  const toggleTest = await testCollapseToggle(page);
  const multiToggleTest = await testMultipleToggles(page, 3);
  
  await browser.close();
  
  console.log('\n' + '='.repeat(60));
  console.log('RESULTS');
  console.log('='.repeat(60));
  
  console.log(`\n📌 Button check:`);
  console.log(`  Found: ${buttonCheck.buttonFound}`);
  console.log(`  Icon classes: ${buttonCheck.iconClasses}`);
  
  console.log(`\n📌 Toggle test:`);
  console.log(`  Width before: ${toggleTest.widthBefore}px`);
  console.log(`  Width after: ${toggleTest.widthAfter}px`);
  console.log(`  Width restored: ${toggleTest.widthRestored}px`);
  console.log(`  Body has menu-collapsed: ${toggleTest.bodyHasClass}`);
  
  console.log(`\n📌 Multiple toggles:`);
  let hasIssue = false;
  for (const r of multiToggleTest) {
    console.log(`  Toggle ${r.toggle}: left=${r.hasMultipleLeft}, right=${r.hasMultipleRight}`);
    if (r.hasMultipleLeft || r.hasMultipleRight) {
      hasIssue = true;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  if (hasIssue) {
    console.log('❌ ISSUES FOUND: Multiple chevron icons appearing');
  } else if (toggleTest.widthAfter < toggleTest.widthBefore) {
    console.log('✅ TEST PASSED: Menu collapses correctly');
  } else {
    console.log('⚠️ PARTIAL: Check toggle behavior manually');
  }
}

main().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});