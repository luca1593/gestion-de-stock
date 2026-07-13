# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth.spec.ts >> Route Security Tests >> /inscription should be accessible without auth
- Location: e2e/auth.spec.ts:12:9

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
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const PUBLIC_ROUTES = ['/login', '/inscription'];
  4  | 
  5  | const PROTECTED_ROUTES = [
  6  |   '/dashbord', '/statistiques', '/articles', '/clients', '/fournisseurs',
  7  |   '/vente', '/avoirs', '/categories', '/utilisateurs', '/profil'
  8  | ];
  9  | 
  10 | test.describe('Route Security Tests', () => {
  11 |   for (const route of PUBLIC_ROUTES) {
  12 |     test(`${route} should be accessible without auth`, async ({ page }) => {
  13 |       const errors: string[] = [];
  14 |       page.on('console', msg => {
  15 |         if (msg.type() === 'error') errors.push(msg.text());
  16 |       });
  17 |       
  18 |       await page.goto(route);
> 19 |       await page.waitForLoadState('networkidle');
     |                  ^ Error: page.waitForLoadState: Test timeout of 30000ms exceeded.
  20 |       
  21 |       expect(page.url()).toContain(route);
  22 |     });
  23 |   }
  24 | 
  25 |   for (const route of PROTECTED_ROUTES) {
  26 |     test(`${route} should redirect to login without auth`, async ({ page }) => {
  27 |       await page.goto(route);
  28 |       await expect(page).toHaveURL(/login/);
  29 |     });
  30 |   }
  31 | });
  32 | 
  33 | test.describe('Routing Tests', () => {
  34 |   test('login to inscription navigation works', async ({ page }) => {
  35 |     await page.goto('/login');
  36 |     const inscriptionLink = page.locator('a[href="/inscription"]');
  37 |     await inscriptionLink.click();
  38 |     await expect(page).toHaveURL(/inscription/);
  39 |   });
  40 | 
  41 |   test('inscription to login navigation works', async ({ page }) => {
  42 |     await page.goto('/inscription');
  43 |     const loginLink = page.locator('a[href="/login"]');
  44 |     await loginLink.click();
  45 |     await expect(page).toHaveURL(/login/);
  46 |   });
  47 | });
```