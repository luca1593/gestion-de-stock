# Gestion de Stock – Agent Guide

Angular 14.2 app (no standalone, classic NgModule). Backend API at `http://12.24.5.100:8085`.

## Quick start

```bash
npm install
npm start              # ng serve --proxy-config src/proxy.conf.json
npm run start:local    # also regenerates GS-API client
ng test                # Karma/Jasmine unit tests (note: HttpClient providers missing)
npx playwright test    # E2E tests (Chromium, localhost:4200)
```

## API & proxy

- Dev proxy (`src/proxy.conf.json`): `/gestiondestock` → `http://12.24.5.100:8085` (path stripped)
- Environment: `apiUrl: 'http://12.24.5.100:8085/'` (with trailing slash in dev, without in prod)
- All API paths: `v1/...` (e.g., `v1/articles/all`, `v1/vente/save`)

## Generated API client

- Source: backend Swagger JSON → `ng-swagger-gen` → `src/gs-api/src/`
- Regenerate: `npm run gs-api` (copies war/swagger.json from Eclipse workspace)
  - Current: `npm run gs-api:create-dist && npm run gs-api:download && npm run gs-api:extract && npm run gs-api:swagger-gen`
  - Manual: copy `tools/swagger/src/swagger.json` to backend
- Two-layer services: app services (`src/app/services/`) wrap generated services (`src/gs-api/`)
- `base-service.ts` resolves root URL from `environment.apiUrl`, falls back to `ApiConfiguration.rootUrl`

## Authentication

- Token key: `gs_access_token` in `sessionStorage`
- Login request uses **`login`** field (NOT `email`) in `AuthenticationRequest`
- Test credentials: `{"login":"entreprise2@test.com","password":"luca1593"}`
- Auto-logout 5min before token expiry, checked every 10s

## Architecture

- **Auth guard**: `ApplicationGuardService` on all child routes of `""` (dashboard shell)
- **Route data**: Shared components use `data.origin` (`'client'`, `'fournisseur'`, `'article'`, `'vente'`, etc.) to adapt behavior
- **Components dir**: `src/app/composants/` — reusable components parameterised by route data
- **Pages dir**: `src/app/pages/` — route-specific page components
- **Forms**: Template-driven (`FormsModule`, no ReactiveFormsModule)
- **Pagination**: `ngx-pagination`
- **Charts**: Chart.js 4.x
- **PDF**: jsPDF + jspdf-autotable (client-side, not API)
- **Excel**: exceljs (client-side)
- **Locale**: French (`fr`)

## Core conventions

### Table & List Patterns
- All list pages share sorting/filtering via `src/app/composants/sort-utils`
- Always reset page to 1 on sort, initialize `listXxxFiltre` in `findAll()`
- CSS `.sortable` on `<th>`, `.sort-arrow` for ▲/▼
- Dates: use `dateLisible()` (returns `—` for null/epoch dates <1990)

### Payments & Factures
- Payments: two‑layer services; detail endpoint (`/paiements/{id}`) doesn't join facture
- Payment page: `factureSoldee` flag shows explanatory banner when invoice fully paid
- Payment amount: `montant` getter = `min(donné, dû)` for partial payments
- Payment creation: use `/factures/save-avec-paiement` for invoice + payment in one call

### Workflow & State
- Commande/Vente workflow: **forward‑only** (en préparation → validée → livrée)
- States are locked based on `etatCommandeOriginal`, forward progress only via `onEtatChange`
- Page state: `pageValide()` recalibrates page after deletions, preserves filter

## Known quirks

- `GET /v1/vente/all` does NOT return `ligneVentes` — must call `findLigneVenteByVente(id)` separately
- `VentesDto.toEntity()` line 43 bug: `ventes.setCode(ventes.getCode())` instead of `dto.getCode()` (backend)
- `POST /v1/utilisateur/save` returns role but doesn't persist it (backend bug)
- `POST /photos/{context}/{id}/{title}` returns 500 (backend bug)
- Dashboard has `identreprise` null for some records → data shows 0
- Commit `e2e8750` changed `/dashbord` route — ensure it points to `PageStatistiquesComponent` not `PageDashbordComponent`

## Testing

- **Unit**: `ng test` (Karma + Jasmine) — note: missing HttpClient providers causes failures, not a test setup issue
- **E2E**: `npx playwright test` (15 spec files in `e2e/`, Chrome only, 2 retries CI)
- E2E web server auto‑starts via `npm start` (Playwright config)
- **Unit test worktree**: `src/app` has dedicated spec files (e.g., `components.spec.ts`)

## Commits

- Messages in French
- Branch: `develop`, push to `origin/develop`

## Helper utilities

### Date handling
- `src/app/composants/list-utils.ts`: `pageValide()` for pagination, `dateLisible()` for safe date display
- Used by 6+ components to show `—` for null/epoch dates

### Money utilities
- `src/app/composants/money-utils.ts`: `arrondiMonetaire()`, `sousTotalLigne()`, `totalLignes()`
- Handles currency precision consistently across app

### Confirmation
- Shared `app-confirmation-dialog` in `src/app/composants/confirmation/` for harmonized deletion/confirmation

## Testing notes

- Test credentials: `entreprise2@test.com` / `luca1593` (modified during tests, restored)
- Unit tests require proper providers setup (HttpClient missing in test module)
- E2E tests: use test data prefix `ZZ` to avoid polluting production
- Login field uses `login` parameter, not `email`

## Build & API regeneration

### GS-API
```bash
# Full regeneration (requires backend swagger.json in Eclipse workspace)
npm run gs-api
# Current steps:
# 1. npm run gs-api:create-dist  (mkdir tools/swagger/dist & src)
# 2. npm run gs-api:download     (copy gestiondestock.war & swagger.json)
# 3. npm run gs-api:extract      (node extract script)
# 4. npm run gs-api:swagger-gen   (ng-swagger-gen)
```

### Environment
- `node --version`: ensure compatible with package-lock.json
- `npm install`: installs all dependencies including testing tools

## Debugging common issues

1. **Montant payé != donné** sur page de paiement partiel
   - Résolu : `EncaissementComponent.montant = min(donné, dû)`
   - Test : vendre article à 12,01 ×3 → total 36,03 affiché, payment 50000 donne 49963,97 monnaie

2. **Facture déjà payée** affiche formulaire editable
   - Ajouté : bannière explicite `factureSoldee`, désactive bouton
   - Message : "Cette facture est déjà entièrement réglée : aucun paiement complémentaire n'est possible."

3. **Dates épiques (1970)** affichent mal
   - Ajouté : `dateLisible()` rejette dates <1990 comme données manquantes
   - Retourne `—` pour epoch dates (peut être trié accidentellement)

4. **Paiements manquants dans détail facture**
   - Ajouté : `chargerPaiements()` sur expansion, API `/paiements/facture/{id}`
   - Historique complet maintenant affiché dans bloc détail

5. **Champs de recherche débordent écran**
   - Corrigé : `Ctrl K` champ responsive, badges sur ligne, responsive menu
   - Correction dans commit `89517e8`

## Project structure

### Key directories
- `src/app/pages/` — route‑specific page components
- `src/app/composants/` — reusable UI components
- `src/gs-api/` — generated Swagger client (regénérer avec `npm run gs-api`)
- `src/app/services/` — app‑level services wrapping generated API

### Major patterns
- **Template‑driven forms** throughout (no ReactiveFormsModule)
- **Route data** (`data.origin`) drives shared component behavior
- **Pagination** via `ngx-pagination` with `pageValide()` helper
- **Payment handling**: separate payment page (`/facture/paiement/:id`) with montant validation

## Last updated

October 2026 — corrections de campagne de tests post‑lancement : arrondis, devise, paiements partiels, dates aberrantes, détail des paiements.

Notez : l'application compilera proprement, mais les unit tests échoueront en raison de providers manquants, pas un problème de code.
