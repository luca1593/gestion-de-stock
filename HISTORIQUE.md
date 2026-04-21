# Historique des modifications - 22 Avril 2026

## Résumé du travail effectué

### Modification / Suppression / État des commandes (22 Avril 2026)

1. **Modification de commande**
   - `page-cmd-clt-frs.component.html` - Ajout boutons modifier/supprimer dans la liste
   - `page-cmd-clt-frs.component.ts` - Méthodes modifierCommande() et supprimerCommande()
   - `cmd-clt-frs.service.ts` - Méthodes supprimerCommandeClient() et supprimerCommandeFournisseur()
   - Navigation vers le formulaire de modification avec pré-chargement des données

2. **Suppression de commande**
   - Confirmation avant suppression
   - Appel aux APIs DELETE (CommandeClientApiDeleteDELETE, CommandeFournisseurApiDELETE)
   - Rafraîchissement automatique de la liste après suppression

3. **Changement d'état**
   - Fonctionnalité existante via LigneActionComponent
   - États: EN_PREPARATION, VALIDEE, LIVREE, ANNULEE
   - Badge avec couleurs selon l'état

4. **Améliorations UI/UX**
   - Boutons sur une seule ligne (col-1)
   - Format date réduit (dd/MM/yy)
   - Thème sombre appliqué entièrement
   - Design moderne avec Bootstrap sombre

5. **DetailsCmdCltFrsComponent**
   - Injection de CmdCltFrsService
   - Suppression fonctionnelle depuis le modal détaillé

---

# Historique des modifications - 21 Avril 2026

## Résumé du travail effectué

### Bugs corrigés

1. **Popper.js pour Bootstrap**
   - Erreur: `Popper__namespace.createPopper is not a function`
   - Solution: Remplacer `bootstrap.js + popper.min.js` par `bootstrap.bundle.min.js` (angular.json)

2. **page-inscription.component.html**
   - Correction de `*ngif` → `*ngIf` (ligne 11)
   - Correction de `*ngfor` → `*ngFor` (ligne 12)

2. **page-dashbord.component.html**
   - Correction de l'année dans le copyright: 2024 → 2026 (ligne 25)

3. **menu.component.css**
   - Suppression des caractères nulls corrompus qui causaient des erreurs de build

4. **ligne-action.component.ts**
   - Suppression des duplicatas de classes CSS

5. **Dropdown Bootstrap**
   - Ajout de Popper.js manquant pour les dropdowns

### Nouvelles fonctionnalités ajoutées

1. **Bouton flottant pour basculer le menu**
   - `page-dashbord.component.html` - Ajout du bouton toggle flottant
   - `page-dashbord.component.ts` - Ajout de la logique toggle
   - `page-dashbord.component.css` - Styles pour le bouton et menu collapse

2. **Menu collapsible avec sous-menus**
   - `menu.component.ts` - Ajout de l'input `collapsed`
   - `menu.component.html` - Templates pour état collapsed
   - `menu.component.css` - Styles pour le mode collapsed (affichage hover)

3. **Améliorations du menu collapsible**
   - Masquage des flèches en mode replié
   - Affichage des sous-menus au click en mode replié
   - Ajout de tooltips au survol en mode replié

4. **Nouveau composant EtatoWorkflowComponent**
   - `src/app/composants/etat-workflow/etat-workflow.component.ts`
   - Deux modes: compact (dropdown badge) et workflow (visualisation)
   - Workflow: EN_PREPARATION → VALIDEE → LIVREE
   - Animations et connecteurs visuels
   - Suppression des composants non utilisés (`change-etat-commande`, `etat-commande`)

5. **Modification commande client/fournisseur**
   - `nouvel-cmd-clt-frs.component.ts`:
     - Détection du mode modification via route `:idCmd`
     - Chargement automatique des données commande
     - Titre dynamique: "Nouvel" / "Modification"
     - Badge workflow visible uniquement en modification
   - `cmd-clt-frs.service.ts`:
     - Ajout de `findCommandeClientById`, `findCommandeFournisseurById`
     - Ajout de `updateCommandeClient`, `updateCommandeFournisseur`
   - `app-routing.module.ts`:
     - Route `nouvel-commande-client/:idCmd` pour éviter conflit avec id client

### Tests Playwright créés

**83 tests au total:**

1. **app.spec.ts** (5 tests)
   - Test de chargement de la page login sans erreurs console
   - Test de chargement de la page inscription sans erreurs console
   - Test de redirection des routes inconnues vers login
   - Test des meta tags
   - Test des assets

2. **auth.spec.ts** (17 tests)
   - Tests de sécurité des routes (15 routes protégées)
   - Tests de navigation login → inscription et inverse

3. **pages.spec.ts** (4 tests)
   - Tests de chargement des pages
   - Tests de validation des formulaires

4. **menu.spec.ts** (28 tests)
   - Tests de routes (toutes les routes du menu)
   - Tests de chargement des pages
   - Tests de motifs de routes

5. **forms.spec.ts** (23 tests)
   - Tests de toutes les pages (redirection)
   - Tests du formulaire de login
   - Tests du formulaire d'inscription
   - Tests d'erreurs console

6. **components.spec.ts** (6 tests)
   - Tests des composants
   - Tests de session

### Résultats

- ✅ Build production réussi
- ✅ 83/83 tests Playwright passent
- ✅ Toutes les routes protégées redirigent vers login
- ✅ Aucune erreur console sur les pages publiques
- ✅ Toutes les pages et formulaires sont fonctionnels
- ✅ Modification commande fonctionne correctement
- ✅ Badge état visible uniquement en modification

### Fichiers créés

- `playwright.config.ts` - Configuration Playwright
- `e2e/app.spec.ts` - Tests principaux
- `e2e/auth.spec.ts` - Tests d'authentification
- `e2e/pages.spec.ts` - Tests des pages
- `e2e/menu.spec.ts` - Tests des menus
- `e2e/forms.spec.ts` - Tests des formulaires
- `e2e/components.spec.ts` - Tests des composants
- `src/app/composants/etat-workflow/` - Nouveau composant workflow

### Tests E2E CRUD Complet (21 Avril 2026)

**Tests simulation utilisateur (18 tests):**
- `e2e/simulation.spec.ts` - Simulation navigation toutes pages

**Tests CRUD UI (25 tests):**
- `e2e/crud-complet.spec.ts` - Tests CRUD toutes pages
  - Categories, Articles, Clients, Fournisseurs
  - Commandes clients/fournisseurs, Ventes, Mouvement stock
  - Utilisateurs, Dashboard, Statistiques, Profil

**Tests Profile Photo (5 tests):**
- `e2e/profil-photo.spec.ts`
  - Download photo internet (picsum.photos)
  - Modification photo profil via input file

### Résultats

- ✅ 43/43 tests UI passent
- ✅ 25/25 tests CRUD passent
- ✅ 5/5 tests photo profil passent
- ✅ Modification photo fonctionne après clic "Modifier"
- ✅ Token récupéré depuis sessionStorage

### Refonte Page Statistiques (21 Avril 2026)

**Nouvelle page statistiques professionnelle:**

1. **Refonte complète du composant statistiques:**
   - `statistiques.component.ts`:
     - Graphiques Chart.js (courbe CA, anneau catégories, barres)
     - Appels API: getStats, getAnalyseStock, getInventoryStats, getChiffreAffairesMois, getTopArticles, getRotationStock
     - Dates de mise à jour (lastUpdate)
     - Décimales (2 chiffres après la virgule)
   
   - `statistiques.component.html`:
     - KPIs (CA total, articles, ruptures, clients)
     - 3 graphiques Chart.js
     - Grille analyse stock (valeur, flux, couverture)
     - 2 tableaux (Top 10 ventes, Rotation stock)
   
   - `statistiques.component.css`:
     - Design modernes (cartes, ombres, gradients)
     - Responsive (dark theme support)
     - Tableaux compacts (table-sm, polices réduites)

2. **Corrections applied:**
   - Décimales formatNumber(value, decimals): "96 000,00 €"
   - Polices KPis réduites: 1.1rem, icônes 44px
   - white-space: nowrap pour éviter retours à la ligne
   - Padding compacts: 1rem, legends: padding 10-12

3. **Fichiers modifiés:**
   - `src/app/composants/statistiques/statistiques.component.ts`
   - `src/app/composants/statistiques/statistiques.component.html`
   - `src/app/composants/statistiques/statistiques.component.css`
