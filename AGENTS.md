# Gestion de Stock – Agent Guide

Angular 14.2 app (no standalone, classic NgModule). Backend API at `http://12.24.5.100:8085`.

## Quick start

```bash
npm install
npm start              # ng serve --proxy-config src/proxy.conf.json
npm run start:local    # also regenerates GS-API client
ng test                # Karma/Jasmine unit tests
npx playwright test    # E2E tests (Chromium, localhost:4200)
```

## API & proxy

- Dev proxy (`src/proxy.conf.json`): `/gestiondestock` → `http://12.24.5.100:8085` (path stripped)
- Environment: `apiUrl: 'http://12.24.5.100:8085/'` (with trailing slash in dev, without in prod)
- All API paths: `v1/...` (e.g., `v1/articles/all`, `v1/vente/save`)

## Generated API client

- Source: backend Swagger JSON → `ng-swagger-gen` → `src/gs-api/src/`
- Regenerate: `npm run gs-api` (copies war/swagger.json from Eclipse workspace)
- Two-layer services: app services (`src/app/services/`) wrap generated services (`src/gs-api/`)
- `base-service.ts` resolves root URL from `environment.apiUrl`, falls back to `ApiConfiguration.rootUrl`

## Authentication

- Token key: `gs_access_token` in `sessionStorage`
- Login request uses **`login`** field (NOT `email`) in `AuthenticationRequest`
- Test credentials: `{"login":"entreprise1@test.com","password":"luca1593"}`
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

## Table conventions

- All list pages share the same sorting/filtering pattern:
  - Import `SortState`, `sortByProperty`, `matchSearch` from `src/app/composants/sort-utils`
  - Sort on filtered data: `sortByProperty(this.listXxxFiltre, sortState.column, sortState.direction)`
  - Filter with `matchSearch()` which supports numeric operators (`>`, `>=`, `<`, `<=`, `=`)
  - **Always reset page to 1 in `sort()`**: `this.page = 1`
  - **Always initialize `listXxxFiltre` in `findAll()`**: `this.listXxxFiltre = list`
- CSS classes: `.sortable` on `<th>`, `.sort-arrow` for ▲/▼ (in `styles.css`)
- `sortByProperty` handles numeric strings via `parseFloat`, treats `null` as `0`

## Known quirks

- `GET /v1/vente/all` does NOT return `ligneVentes` — must call `findLigneVenteByVente(id)` separately
- `VentesDto.toEntity()` line 43 bug: `ventes.setCode(ventes.getCode())` instead of `dto.getCode()` (backend)
- `POST /v1/utilisateur/save` returns role but doesn't persist it (backend bug)
- `POST /photos/{context}/{id}/{title}` returns 500 (backend bug)
- Dashboard has `identreprise` null for some records → data shows 0
- Commit `e2e8750` changed `/dashbord` route — ensure it points to `PageStatistiquesComponent` not `PageDashbordComponent`

## Testing

- **Unit**: `ng test` (Karma + Jasmine)
- **E2E**: `npx playwright test` (15 spec files in `e2e/`, Chrome only, 2 retries CI)
- E2E web server auto-starts via `npm start` (Playwright config)

## Commits

- Messages in French
- Branch: `develop`, push to `origin/develop`
