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

## Session du 09 Avril 2026 (précédente)

### Résumé
- Connexion au backend distant
- Design moderne avec variables CSS
- Thème sombre/clair
- Composants modernisés (Menu, Header, Dashboard)
- Corrections des endpoints API et du token JWT