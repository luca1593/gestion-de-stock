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

## Session du 13 Avril 2026 (suite)

### 11. Correction affichage liste utilisateurs (13 Avril 2026)

**Problème**: La liste des utilisateurs ne s'affichait pas même avec les données reçues du backend.

**Cause**: Le composant `PageUtilisateurComponent` utilise `ChangeDetectionStrategy.OnPush` mais n'appelait pas `cdr.markForCheck()` lors de la mise à jour des données.

**Solution**: Ajout de `ChangeDetectorRef` et appels de `markForCheck()`:
```typescript
constructor(..., private cdr: ChangeDetectorRef) {}
// Dans findAllUtilisateur():
this.cdr.markForCheck();
```

**Résultat**: ✅ Les utilisateurs s'affichent correctement (4 utilisateurs affichés)

### 12. Jenkinsfile - Pipeline CI/CD (13 Avril 2026)

**Modifications successives du Jenkinsfile**:

1. **Version initiale**: Pipeline complet avec Docker agent
   - Erreur: `docker login failed` (authentification Docker)

2. **Simplification**: `agent any` au lieu de Docker
   - Erreur: `npm: commande introuvable`

3. **Ajout Node.js**: Installation de Node.js 18 dans le pipeline
   - Solution: `curl -fsSL https://deb.nodesource.com/setup_18.x | bash -`

4. **Simplification finale**: 3 stages (Checkout, Build, Deploy)
   - Stage Build: `npm install && npm run build`
   - Stage Deploy: `docker compose up -d --build`

5. **Amélioration Docker Compose**:
   - `--remove-orphans`: Nettoie les containers orphelins
   - `--force-recreate`: Recrée les containers

### 13. Docker - Configuration (13 Avril 2026)

**Ajout des fichiers de configuration Angular dans le Dockerfile**:
```dockerfile
COPY angular.json ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.spec.json ./
```

### 14. Gestion des branches Git (13 Avril 2026)

**Opérations effectuées**:
- Suppression de la branche `master` (local et remote)
- Création de la branche `prod` depuis `develop`
- Synchronisation des branches `develop` et `prod`

**Branches actuelles**:
| Branche | Description |
|---------|-------------|
| develop | Branche de développement |
| prod | Branche de production ( Jenkinsfile + Dockerfile) |

### 15. Résumé final - Tests de session (13 Avril 2026)

**Tests Playwright - 20 itérations**:

| Utilisateur | Login | Token | User | Pages OK |
|------------|-------|-------|------|---------|
| entreprise1@test.com | ✅ | ✅ | ✅ (DEV Tech) | 8/8 ✅ |
| entreprise2@test.com | ✅ | ✅ | ✅ (entreprise 2) | 8/8 ✅ |

**Résultat**: 100% des tests réussis!

**Problème résolu**: Le frontend communique correctement avec le backend distant (http://12.24.5.100:8085)

---

## Session du 14 Avril 2026

### 16. Résolution des erreurs Docker Build (14 Avril 2026)

**Erreurs successives et corrections**:

#### Erreur 1: tsconfig.json not found
```
failed to calculate checksum: "/tsconfig.app.json": not found
```
**Cause**: `.dockerignore` ignorait les fichiers tsconfig*.json

**Solution**: Retiré tsconfig*.json du `.dockerignore`

#### Erreur 2: ENOENT tsconfig.app.json
```
Error: ENOENT: no such file or directory, lstat '/app/tsconfig.app.json'
```
**Cause**: `COPY . .` copiait tous les fichiers SAUF tsconfig (à cause du .dockerignore mal configuré)

**Solution**: Copie explicite des fichiers de config avant npm ci:
```dockerfile
COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.app.json ./
COPY tsconfig.spec.json ./
COPY angular.json ./
RUN npm ci --legacy-peer-deps
COPY src ./src
```

#### Erreur 3: Build Kubernetes/Dockerfield final
**Solution finale**: Structure optimale du Dockerfile:
- Copie fichiers config en premier (pour cache Docker)
- Installation dépendances
- Copie code source
- Build production

### 17. Fichiers de configuration mis à jour (14 Avril 2026)

| Fichier | Modifications |
|---------|---------------|
| Dockerfile | Optimisation pour le build production |
| Jenkinsfile | Pipeline CI/CD complet (Checkout, Build, Deploy) |
| docker-compose.yml | Configuration du service frontend |

### 18. Branches Git (14 Avril 2026)

| Branche | Status | Dernier commit |
|---------|--------|----------------|
| develop | ✅ À jour | cffe5b2 - Mise a jour de la configuration Docker et Jenkins |
| prod | ✅ Synchronisé | 52528db - Sync prod: Docker and Jenkins update |

### 19. Résultat du build Jenkins (14 Avril 2026)

**Étapes du pipeline**:
1. ✅ Checkout - Récupération du code source
2. ✅ Build - npm install + npm run build (3.05 MB)
3. ✅ Deploy - docker compose up -d --build --force-recreate

**Statut**: Build réussi! Application déployée.

---

## Session du 16 Avril 2026

### 20. État actuel du projet

**Branche**: `develop` (propre, à jour avec origin)

**Derniers commits**:
| Commit | Description |
|--------|-------------|
| 44423c8 | Correction environment.prod.ts: URL backend explicite |
| afa834a | Correction: passage par nginx proxy pour le login |
| 7e9bd1f | Correction Docker: ajout du proxy nginx vers backend |
| 270679d | Correction Docker: resolution probleme login |

### 21. Fonctionnalités actives

- Connexion au backend distant (http://12.24.5.100:8085)
- Changement de thème (sombre/clair) avec persistance
- Design responsive avec Bootstrap + variables CSS
- Authentification JWT
- Dashboard avec statistiques et graphiques Chart.js
- Notifications métier (stock faible, commandes en attente)
- Export Excel (articles, clients, stock, ventes)
- Export PDF des avoirs
- Calculatrice avec support clavier complet
- Alerte expiration token en bannière
- CI/CD Jenkins avec Docker Compose
- Deployment automatique sur serveur

### 22. Nouvelles fonctionnalités ajoutées (16 Avril 2026)

#### Alertes de stock dans le dashboard
- Affichage des alertes de stock (CRITIQUE, BAS, MOYEN)
- Service `AlertStockService` ajouté
- Tableau affichant: article, niveau, stock actuel, seuil minimum
- Badges coloriés selon le niveau d'alerte

#### Page des avoirs
- Nouvelle page accessible via menu Ventes > Avoirs
- Liste des avoirs avec: code, date, client, montant, raison, état
- Boutons: détails, export PDF, suppression
- Service `HaveurService` créé
- Filtres par état possibles

#### Export PDF des avoirs
- Intégration avec l'API `ExportApiPdfAvoirGET`
- Bouton d'export PDF dans la page des avoirs

#### Amélioration des graphiques du dashboard
- Graphique linéaire du chiffre d'affaires par mois
- Graphique en anneau (doughnut) des top articles vendus
- Utilisation de l'API existante `getChiffreAffairesMois()` et `getTopArticles()`

#### Filtres avancés dans les listes
- **Articles**: filtres par code, libellé, catégorie
- **Clients**: filtres par nom, email, téléphone
- **Utilisateurs**: filtres par nom, email, entreprise
- Bouton réinitialiser pour chaque groupe de filtres
- Pagination automatique avec les résultats filtrés

#### Statistiques de ventes par période
- Page statistiques déjà fonctionnelle avec:
  - KPIs: rotation stock, taux de service, taux rupture, couverture stock
  - Graphique CA par mois avec sélection de période (6/12 mois)
  - Top articles les plus vendus

#### Gestion des utilisateurs
- Filtres de recherche implémentés
- Page existante pour création de nouveaux utilisateurs
- Utilisation de l'entreprise de l'utilisateur connecté

### 23. Fichiers créés

| Fichier | Description |
|---------|-------------|
| `src/app/services/alert-stock/alert-stock.service.ts` | Service alertes stock |
| `src/app/services/avoir/avoir.service.ts` | Service avoirs (HaveurService) |
| `src/app/pages/avoirs/page-avoir/page-avoir.component.ts` | Page liste avoirs |
| `src/app/pages/avoirs/page-avoir/page-avoir.component.html` | Template page avoirs |
| `src/app/pages/avoirs/page-avoir/page-avoir.component.css` | Styles page avoirs |

### 24. Fichiers modifiés

| Fichier | Modifications |
|---------|---------------|
| `src/app/composants/dashbord/dashbord.component.ts` | Ajout alertes stock, nouveaux graphiques |
| `src/app/composants/dashbord/dashbord.component.html` | Section alertes, graphiques CA et top articles |
| `src/app/composants/menu/menu.component.ts` | Ajout menu "Avoirs" |
| `src/app/app-routing.module.ts` | Route /avoirs |
| `src/app/app.module.ts` | Déclaration PageHaveurComponent |
| `src/app/services/export.service.ts` | Ajout exportPdfAvoir |
| `src/app/pages/articles/page-article/page-article.component.*` | Filtres avancés |
| `src/app/pages/clients/page-client/page-client.component.*` | Filtres avancés |
| `src/app/pages/utilisateurs/page-utilisateur/page-*.component.*` | Filtres avancés |
| `src/gs-api/src/services/avoirs.service.ts` | Correction syntaxe |

### 25. Résultat du build

```
Build at: 2026-04-16T17:46:25.136Z - Hash: 16682605ebc083c7 - Time: 113118ms
Initial Total: 3.06 MB (769.05 kB transfer)
```

---

## Session du 09 Avril 2026 (précédente)

### Résumé
- Connexion au backend distant
- Design moderne avec variables CSS
- Thème sombre/clair
- Composants modernisés (Menu, Header, Dashboard)
- Corrections des endpoints API et du token JWT