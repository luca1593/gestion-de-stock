# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: simulation.spec.ts >> Simulation Utilisateur Complet >> 12. Page inscription accessible
- Location: e2e/simulation.spec.ts:111:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e5]:
  - generic [ref=e6]:
    - generic [ref=e8]: 
    - heading "Créer un compte" [level=1] [ref=e9]
    - paragraph [ref=e10]: Commencez à gérer votre stock
  - generic [ref=e12]:
    - generic [ref=e13]:
      - generic [ref=e14]:
        - generic [ref=e15]:
          - generic [ref=e16]:
            - generic [ref=e17]: 
            - text: Nom de l'entreprise
          - textbox " Nom de l'entreprise" [ref=e18]:
            - /placeholder: Votre nom
        - generic [ref=e19]:
          - generic [ref=e20]:
            - generic [ref=e21]: 
            - text: Code fiscal
          - textbox " Code fiscal" [ref=e22]:
            - /placeholder: Votre code fiscal
        - generic [ref=e23]:
          - generic [ref=e24]:
            - generic [ref=e25]: 
            - text: Adresse e-mail
          - textbox " Adresse e-mail" [ref=e26]:
            - /placeholder: nom@exemple.com
        - generic [ref=e27]:
          - generic [ref=e28]:
            - generic [ref=e29]: 
            - text: Description
          - textbox " Description" [ref=e30]:
            - /placeholder: Description de votre entreprise
        - generic [ref=e31]:
          - generic [ref=e32]:
            - generic [ref=e33]: 
            - text: Téléphone
          - textbox " Téléphone" [ref=e34]:
            - /placeholder: +261 32 12 345 67
      - generic [ref=e35]:
        - heading " Adresse" [level=5] [ref=e36]:
          - generic [ref=e37]: 
          - text: Adresse
        - generic [ref=e38]:
          - generic [ref=e39]: Adresse principale
          - textbox "Adresse principale" [ref=e40]
        - generic [ref=e41]:
          - generic [ref=e42]: Adresse secondaire
          - textbox "Adresse secondaire" [ref=e43]:
            - /placeholder: Adresse secondaire (optionnel)
        - generic [ref=e44]:
          - generic [ref=e45]:
            - generic [ref=e46]: 
            - text: Ville
          - textbox " Ville" [ref=e47]:
            - /placeholder: Ville
        - generic [ref=e48]:
          - generic [ref=e49]:
            - generic [ref=e50]: 
            - text: Code postal
          - textbox " Code postal" [ref=e51]:
            - /placeholder: Code postal
        - generic [ref=e52]:
          - generic [ref=e53]:
            - generic [ref=e54]: 
            - text: Pays
          - textbox " Pays" [ref=e55]:
            - /placeholder: Pays
    - separator [ref=e56]
    - generic [ref=e57]:
      - link " Retour à la connexion" [ref=e58] [cursor=pointer]:
        - /url: /login
        - generic [ref=e59]: 
        - text: Retour à la connexion
      - button " S'inscrire" [ref=e60] [cursor=pointer]:
        - generic [ref=e61]: 
        - text: S'inscrire
```

# Test source

```ts
  13  |   }
  14  | 
  15  |   test('1. Connexion et accés au dashboard', async ({ page }) => {
  16  |     const errors: string[] = [];
  17  |     page.on('console', msg => {
  18  |       if (msg.type() === 'error') errors.push(msg.text());
  19  |     });
  20  | 
  21  |     await page.goto('/login');
  22  |     await page.waitForLoadState('networkidle');
  23  |     await page.fill('#mail', USER_EMAIL);
  24  |     await page.fill('#motdepasse', USER_PASSWORD);
  25  |     await page.click('button:has-text("Se connecter")');
  26  |     await page.waitForURL(/dashbord/, { timeout: 10000 });
  27  | 
  28  |     expect(page.url()).toContain('dashbord');
  29  |     console.log('✓ Connexion réussie');
  30  |   });
  31  | 
  32  |   test('2. Navigation vers Articles via le menu', async ({ page }) => {
  33  |     await login(page);
  34  |     await page.click('.menu-item:has-text("Articles")');
  35  |     await page.click('.submenu-item:has-text("Articles")');
  36  |     await page.waitForURL(/articles/);
  37  |     console.log('✓ Navigation vers Articles');
  38  |   });
  39  | 
  40  |   test('3. Navigation vers Clients', async ({ page }) => {
  41  |     await login(page);
  42  |     await page.click('.menu-item:has-text("Clients")');
  43  |     await page.click('.submenu-item:has-text("Clients")');
  44  |     await page.waitForURL(/clients/);
  45  |     console.log('✓ Navigation vers Clients');
  46  |   });
  47  | 
  48  |   test('4. Navigation vers Fournisseurs', async ({ page }) => {
  49  |     await login(page);
  50  |     await page.click('.menu-item:has-text("Fournisseurs")');
  51  |     await page.click('.submenu-item:has-text("Fournisseurs")');
  52  |     await page.waitForURL(/fournisseurs/);
  53  |     console.log('✓ Navigation vers Fournisseurs');
  54  |   });
  55  | 
  56  |   test('5. Navigation vers Vente', async ({ page }) => {
  57  |     await login(page);
  58  |     await page.click('.menu-item:has-text("Ventes")');
  59  |     await page.click('.submenu-item:has-text("Nouvelle vente")');
  60  |     await page.waitForURL(/vente/);
  61  |     console.log('✓ Navigation vers Ventes');
  62  |   });
  63  | 
  64  |   test('6. Navigation vers Commande clients', async ({ page }) => {
  65  |     await login(page);
  66  |     await page.click('.menu-item:has-text("Clients")');
  67  |     await page.click('.submenu-item:has-text("Commande clients")');
  68  |     await page.waitForURL(/commande-client/);
  69  |     console.log('✓ Navigation vers Commande clients');
  70  |   });
  71  | 
  72  |   test('7. Navigation vers Commande fournisseurs', async ({ page }) => {
  73  |     await login(page);
  74  |     await page.click('.menu-item:has-text("Fournisseurs")');
  75  |     await page.click('.submenu-item:has-text("Commande fournisseur")');
  76  |     await page.waitForURL(/commande-fournisseur/);
  77  |     console.log('✓ Navigation vers Commande fournisseurs');
  78  |   });
  79  | 
  80  |   test('8. Navigation vers Catégories', async ({ page }) => {
  81  |     await login(page);
  82  |     await page.click('.menu-item:has-text("Paramètres")');
  83  |     await page.click('.submenu-item:has-text("Catégories")');
  84  |     await page.waitForURL(/categories/);
  85  |     console.log('✓ Navigation vers Catégories');
  86  |   });
  87  | 
  88  |   test('9. Navigation vers Utilisateurs', async ({ page }) => {
  89  |     await login(page);
  90  |     await page.click('.menu-item:has-text("Paramètres")');
  91  |     await page.click('.submenu-item:has-text("Utilisateurs")');
  92  |     await page.waitForURL(/utilisateurs/);
  93  |     console.log('✓ Navigation vers Utilisateurs');
  94  |   });
  95  | 
  96  |   test('10. Navigation vers Profil via header', async ({ page }) => {
  97  |     await login(page);
  98  |     await page.click('.user-info, [routerlink="/profil"]');
  99  |     await page.waitForURL(/profil/);
  100 |     console.log('✓ Navigation vers Profil');
  101 |   });
  102 | 
  103 |   test('11. Test menu collapsed toggle', async ({ page }) => {
  104 |     await login(page);
  105 |     const toggleBtn = page.locator('button').first();
  106 |     await toggleBtn.click();
  107 |     await page.waitForTimeout(500);
  108 |     console.log('✓ Toggle cliqué');
  109 |   });
  110 | 
  111 |   test('12. Page inscription accessible', async ({ page }) => {
  112 |     await page.goto('/inscription');
> 113 |     await page.waitForLoadState('networkidle');
      |                ^ Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
  114 |     expect(page.url()).toContain('inscription');
  115 |     console.log('✓ Page inscription accessible');
  116 |   });
  117 | 
  118 |   test('13. Routes protegées_redirect vers login', async ({ page }) => {
  119 |     const routes = ['/dashbord', '/articles', '/clients'];
  120 |     for (const route of routes) {
  121 |       await page.goto(route);
  122 |       await expect(page).toHaveURL(/login/, { timeout: 5000 });
  123 |     }
  124 |     console.log('✓ Routes protégées redirigent vers login');
  125 |   });
  126 | 
  127 |   test('14. Navigation vers Statistiques', async ({ page }) => {
  128 |     await login(page);
  129 |     await page.click('.menu-item:has-text("Tableau de bord")');
  130 |     await page.click('.submenu-item:has-text("Statistiques")');
  131 |     await page.waitForURL(/statistiques/);
  132 |     console.log('✓ Navigation vers Statistiques');
  133 |   });
  134 | 
  135 |   test('15. Navigation vers Avoirs', async ({ page }) => {
  136 |     await login(page);
  137 |     await page.click('.menu-item:has-text("Ventes")');
  138 |     await page.click('.submenu-item:has-text("Avoirs")');
  139 |     await page.waitForURL(/avoirs/);
  140 |     console.log('✓ Navigation vers Avoirs');
  141 |   });
  142 | 
  143 |   test('16. Navigation vers Mouvement de stock', async ({ page }) => {
  144 |     await login(page);
  145 |     await page.click('.menu-item:has-text("Articles")');
  146 |     await page.click('.submenu-item:has-text("Mouvement de stock")');
  147 |     await page.waitForURL(/mvtstk/);
  148 |     console.log('✓ Navigation vers Mouvement de stock');
  149 |   });
  150 | 
  151 |   test('17. Navigation vers Historique des ventes', async ({ page }) => {
  152 |     await login(page);
  153 |     await page.click('.menu-item:has-text("Ventes")');
  154 |     await page.click('.submenu-item:has-text("Historique des ventes")');
  155 |     await page.waitForURL(/liste-vente/);
  156 |     console.log('✓ Navigation vers Historique des ventes');
  157 |   });
  158 | 
  159 |   test('18. Déconnexion', async ({ page }) => {
  160 |     await login(page);
  161 |     const logoutBtn = page.locator('.menu-item').filter({ hasText: /Déconnexion/ }).first();
  162 |     await logoutBtn.click();
  163 |     await page.waitForURL(/login/);
  164 |     console.log('✓ Déconnexion réussie');
  165 |   });
  166 | });
```