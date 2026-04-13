# Historique du projet Gestion de Stock - Angular

## Session du 12 Avril 2026

### 1. Analyse du projet
- **Frontend**: Angular 14 avec Bootstrap, Chart.js
- **Backend**: Spring Boot 3.1.1, MySQL (sur serveur distant http://12.24.5.100:8085)

### 2. Modifications effectuées

#### Services API manquants ajoutés
- **AlertStockService** (`src/gs-api/src/services/alert-stock.service.ts`): Gestion des alertes de stock
  - save, findById, findByNiveau, findByEntreprise, findActives, delete
- **AvoirsService** (`src/gs-api/src/services/avoirs.service.ts`): Gestion des avoirs/retours
  - save, findAll, findById, findByVente, findByClient, findByDateRange, delete
- **ExportService** (`src/gs-api/src/services/export.service.ts`): Export Excel/PDF
  - Excel: articles, clients, fournisseurs, commandes-client, stock, ventes
  - PDF: avoir

#### Modèles ajoutés
- `AlertStockDto` - Alerte de stock avec niveaux (CRITIQUE, BAS, MOYEN)
- `AvoirDto` - Avoir note de crédit

#### Notifications système
- **NotificationService** (`src/app/services/notification/notification.service.ts`)
- Affichées dans le header via dropdown (Icône cloche)
- Types: stock faible, commandes en attente
- **Ne plus afficher les erreurs HTTP** dans les notifications
- Alerte d'expiration token reste dans une bannière séparée

#### Calculatrice modernisée
- **CalculatorComponent** (`src/app/composants/calculator/*`)
- Interface redesignée avec style moderne
- Compatible thème sombre/clair
- Support clavier:
  - Chiffres (0-9), opérateurs (+,-,*,/)
  - Enter/= pour calculer
  - Backspace pour effacer dernier caractère
  - Escape pour tout effacer (AC)
- **Focus detection**: clavier fonctionne uniquement quand la calculatrice a le focus
- Bouton C = ⌫ (backspace), AC = tout effacer

#### Fonctionnalités Export
- Boutons exporter ajoutés dans les pages:
  - Page articles → Export Excel articles et stock
  - Page clients → Export Excel clients

#### Page vente restructurée
- Largeurs réduites pour laisser place à la calculatrice
- Inputs plus compacts (form-control-sm)
- Calculatrice plus petite et responsive

#### Améliorations UI
- **Header search box**: bordure visible (#dee2e6 clair / #4a4a5a sombre)
- **Notifications**: Design élégant thème sombre/clair avec icônes colorées
- **Bouton Action**: Ajout du support export (clickExportEvent)

### 3. Fichiers créés

| Fichier | Description |
|---------|-------------|
| `src/gs-api/src/services/alert-stock.service.ts` | Service alertes stock |
| `src/gs-api/src/services/avoirs.service.ts` | Service avoirs |
| `src/gs-api/src/services/export.service.ts` | Service export API |
| `src/gs-api/src/services/export.service.ts` (app) | Service export Excel |
| `src/gs-api/src/models/alert-stock-dto.ts` | Modèle alert stock |
| `src/gs-api/src/models/avoir-dto.ts` | Modèle avoir |
| `src/app/services/notification/notification.service.ts` | Service notifications |
| `src/app/services/export.service.ts` (app) | Export Excel frontend |
| `src/app/composants/calculator/*` | Calculatrice modernisée |

### 4. Fichiers modifiés

| Fichier | Description |
|---------|-------------|
| `src/app/composants/header/*` | Design notifications, search box |
| `src/app/composants/bouton-action/*` | Support export |
| `src/app/pages/articles/page-article/*` | Bouton exporter |
| `src/app/pages/clients/page-client/*` | Bouton exporter |
| `src/app/pages/vente/page-vente/*` | Layout reduit |
| `src/app/services/interceptor/http-interceptor.service.ts` | Supprime erreurs HTTP notifications |
| `src/gs-api/src/models.ts` | Exports nouveaux modèles |

### 5. Commandes útiles

```bash
# Installation des dépendances
npm install

# Build du projet
npm run build

# Démarrage serveur développement
ng serve --host 0.0.0.0 --disable-host-check
```

### 6. Fonctionnalités actives
- Connexion au backend distant (http://12.24.5.100:8085)
- Changement de thème (sombre/clair) avec persistance
- Design responsive et fluide
- Authentification JWT
- Dashboard avec statistiques
- Notifications métier (stock, commandes)
- Export Excel (articles, clients, stock, ventes)
- Calculatrice avec support clavier
- Alerte expiration token en bannière

---

### 7. Corrections apportées (13 Avril 2026)

**Problème identifié**: Les données ne se chargeaient pas depuis le backend.

**Cause**: Incohérence des URLs d'API dans les fichiers de configuration:
- `environment.ts`: `'http://12.24.5.100:8085/'` (slash final causait des doubles slashes)
- `environment.prod.ts`: `'http://12.24.5.100:8085/v1/'` (préfixe /v1/ redondant)
- `api-configuration.ts`: `'http://localhost:8181'` (non utilisé, mais incorrect)

**Solution**: Retirer le slash final et le préfixe /v1/ redondant:
- `environment.ts`: `'http://12.24.5.100:8085'`
- `environment.prod.ts`: `'http://12.24.5.100:8085'`

Les services API utilisent `base-service.ts` qui récupère l'URL depuis `environment.apiUrl`.

### 8. Tests de session et chargement des données (13 Avril 2026)

**Tests effectués via backend direct (Python)**: 4 tests (2 par utilisateur, 2 utilisateurs)

**Résultats des tests API (backend)**:

| Endpoint | entreprise1@test.com | entreprise2@test.com |
|----------|---------------------|---------------------|
| Login | ✅ OK | ✅ OK |
| User info | ✅ OK | ❌ HTTP 500 |
| Articles | ✅ OK (2) | ❌ HTTP 500 |
| Clients | ❌ HTTP 500 | ✅ OK (0) |
| Fournisseurs | ❌ HTTP 500 | ✅ OK (0) |
| Categories | ❌ HTTP 500 | ✅ OK (0) |
| Entreprises | ❌ HTTP 500 | ✅ OK (5) |
| Ventes | ✅ OK (1) | ❌ HTTP 500 |
| Dashboard | ✅ OK | ❌ HTTP 500 |
| Utilisateurs | ✅ OK (3) | ❌ HTTP 500 |

**Analyse du stockage de session (frontend)**:
- ✅ Token JWT stocké dans `sessionStorage` (clé: gs_access_token)
- ✅ Données utilisateur stockées dans `sessionStorage` (clé: gs_user)
- ✅ Comportement correct lors des changements d'utilisateur

**Problèmes identifiés**:
- Le backend retourne des erreurs 500 pour certains endpoints selon l'utilisateur
- Peut être lié aux permissions ou à la séparation des données par entreprise
- Le proxy Angular vers le backend distant doit être configuré correctement

### 9. Configuration communication avec backend (13 Avril 2026)

**Configuration correcte** (d'après branche develop):
- `environment.ts`: `apiUrl: '/gestiondestock'` (chemin relatif vers proxy)
- `proxy.conf.json`: target vers `http://12.24.5.100:8085`

**Résultat**: ✅ Communication fonctionnelle!

### 10. Tests Playwright (13 Avril 2026)

**Configuration**: environment.ts = `http://12.24.5.100:8085/`

**10 tests exécutés** (5 par utilisateur):

| Test | User | Login | Token | User stocké | Pages OK |
|------|------|-------|-------|------------|---------|
| 1 | entreprise1 | ✅ | ✅ | ✅ | 8/8 |
| 2 | entreprise2 | ✅ | ✅ | ❌ (API 500) | 0/8 |
| 3 | entreprise1 | ✅ | ✅ | ✅ | 8/8 |
| 4 | entreprise2 | ✅ | ✅ | ❌ (API 500) | 0/8 |
| 5 | entreprise1 | ✅ | ✅ | ✅ | 8/8 |
| 6 | entreprise2 | ✅ | ✅ | ❌ (API 500) | 0/8 |
| 7 | entreprise1 | ✅ | ✅ | ✅ | 8/8 |
| 8 | entreprise2 | ✅ | ✅ | ❌ (API 500) | 0/8 |
| 9 | entreprise1 | ✅ | ✅ | ✅ | 8/8 |
| 10 | entreprise2 | ✅ | ✅ | ❌ (API 500) | 0/8 |

**Analyse du problème entreprise2**:
- ✅ Login fonctionne (authentification OK)
- ⚠️ API `/v1/utilisateur/email/X` retourne 500
- ⚠️ API `/v1/utilisateur/all` retourne 500
- ⚠️ API `/v1/articles/all` retourne 500

**Conclusion**: Le problème est BACKEND, pas frontend! Le backend a une erreur interne pour l'entreprise 2.

---

## Session du 09 Avril 2026 (précédente)

### Résumé
- Connexion au backend distant
- Design moderne avec variables CSS
- Thème sombre/clair
- Composants modernisés (Menu, Header, Dashboard)
- Corrections des endpoints API et du token JWT