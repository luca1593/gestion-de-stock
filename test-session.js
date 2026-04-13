const fs = require('fs');
const axios = require('axios');

const LOGIN_URL = 'http://localhost:4200/gestiondestock/v1/auth/authenticate';
const BACKEND_URL = 'http://12.24.5.100:8085';

const USERS = [
  { email: 'entreprise1@test.com', password: 'luca1593' },
  { email: 'entreprise2@test.com', password: 'luca1593' }
];

const PAGES_TO_TEST = [
  '/v1/articles/all',
  '/v1/client/all',
  '/v1/fournisseur/all',
  '/v1/category/all',
  '/v1/vente/all',
  '/v1/entreprise/all',
  '/v1/utilisateur/all'
];

let testResults = [];
let testCount = 1;

async function login(email, password) {
  try {
    const response = await axios.post(BACKEND_URL + '/v1/auth/authenticate', {
      login: email,
      password: password
    });
    return response.data.accessToken;
  } catch (error) {
    console.error(`❌ Login failed for ${email}:`, error.message);
    return null;
  }
}

async function testEndpoint(token, endpoint) {
  try {
    const response = await axios.get(BACKEND_URL + endpoint, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 10000
    });
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message, status: error.response?.status };
  }
}

async function runTests(userEmail, password) {
  const testRun = { user: userEmail, tests: [], timestamp: new Date().toISOString() };
  
  console.log(`\n=== Test ${testCount}: Login avec ${userEmail} ===`);
  
  const token = await login(userEmail, password);
  if (!token) {
    testResults.push({ ...testRun, error: 'Login failed' });
    return;
  }
  
  console.log(`✅ Login successful`);
  
  for (const endpoint of PAGES_TO_TEST) {
    const result = await testEndpoint(token, endpoint);
    const endpointName = endpoint.split('/').pop();
    console.log(`  ${result.success ? '✅' : '❌'} ${endpointName}: ${result.success ? 'OK' : result.error}`);
    testRun.tests.push({
      endpoint,
      success: result.success,
      hasData: result.success && Array.isArray(result.data) && result.data.length > 0,
      dataCount: result.success && Array.isArray(result.data) ? result.data.length : 0
    });
  }
  
  testResults.push(testRun);
}

async function main() {
  console.log('Starting session tests...\n');
  
  for (let i = 0; i < USERS.length; i++) {
    for (let j = 0; j < 2; j++) {
      await runTests(USERS[i].email, USERS[i].password);
      testCount++;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  
  fs.writeFileSync('test-results.json', JSON.stringify(testResults, null, 2));
  console.log('\n=== Résumé ===');
  console.log(`Total tests: ${testResults.length}`);
  testResults.forEach((tr, i) => {
    const passed = tr.tests?.filter(t => t.success).length || 0;
    console.log(`Test ${i+1} (${tr.user}): ${passed}/${tr.tests?.length || 0} endpoints OK`);
  });
}

main().catch(console.error);