import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { PageInscriptionComponent } from './pages/page-inscription/page-inscription.component';
import { PageDashbordComponent } from './pages/page-dashbord/page-dashbord.component';
import { PageStatistiquesComponent } from './pages/page-statistiques/page-statistiques.component';
import { StatistiquesComponent } from './composants/statistiques/statistiques.component';
import { PageArticleComponent } from './pages/articles/page-article/page-article.component';
import { NouvelArticleComponent } from './pages/articles/nouvel-article/nouvel-article.component';
import { PageMvtstkComponent } from './pages/mvtstk/page-mvtstk/page-mvtstk.component';
import { DetailArticlesMvtstkComponent } from './composants/detail-articles-mvtstk/detail-articles-mvtstk.component';
import { PageClientComponent } from './pages/clients/page-client/page-client.component';
import { PageFournisseurComponent } from './pages/fournisseurs/page-fournisseur/page-fournisseur.component';
import { NouveauCltFrsComponent } from './composants/nouveau-clt-frs/nouveau-clt-frs.component';
import { DeatailClientFournisseurComponent } from './composants/deatail-client-fournisseur/deatail-client-fournisseur.component';
import { PageCmdCltFrsComponent } from './pages/page-cmd-clt-frs/page-cmd-clt-frs.component';
import { NouvelCmdCltFrsComponent } from './composants/nouvel-cmd-clt-frs/nouvel-cmd-clt-frs.component';
import { PageCategorieComponent } from './pages/categories/page-categorie/page-categorie.component';
import { NouveauCategorieComponent } from './pages/categories/nouveau-categorie/nouveau-categorie.component';
import { DetailUtilisateurComponent } from './composants/detail-utilisateur/detail-utilisateur.component';
import { PageUtilisateurComponent } from './pages/utilisateurs/page-utilisateur/page-utilisateur.component';
import { NouvelUtilisateurComponent } from './pages/utilisateurs/nouvel-utilisateur/nouvel-utilisateur.component';
import { PageProfilComponent } from './pages/profil/page-profil/page-profil.component';
import { ChangerMotDePasseComponent } from './pages/profil/changer-mot-de-passe/changer-mot-de-passe.component';
import { ModifProfilComponent } from './pages/profil/modif-profil/modif-profil.component';
import { PageVenteComponent } from './pages/vente/page-vente/page-vente.component';
import { HisistoriqueVenteComponent } from './pages/vente/hisistorique-vente/hisistorique-vente.component';
import { PageHaveurComponent } from './pages/avoirs/page-avoir/page-avoir.component';
import { NouvelAvoirComponent } from './pages/avoirs/nouvel-avoir/nouvel-avoir.component';
import { ApplicationGuardService } from './services/guard/application-guard.service';

const routes: Routes=[
  { path: 'login', component: PageLoginComponent },
  { path: 'inscription', component: PageInscriptionComponent },
  {
    path: '', component: PageDashbordComponent,
    canActivate: [ApplicationGuardService],
    children: [
      { path: '', redirectTo: 'dashbord', pathMatch: 'full', data: { breadcrumb: 'Accueil' } },
      { path: 'dashbord', component: PageStatistiquesComponent, canActivate: [ApplicationGuardService], data: { breadcrumb: 'Accueil' } },
      { path: 'statistiques', component: StatistiquesComponent, canActivate: [ApplicationGuardService], data: { breadcrumb: 'Statistiques' } },
      { path: 'articles', component: PageArticleComponent, canActivate: [ApplicationGuardService], data: { breadcrumb: 'Articles' } },
      { path: 'nouvel-article', component: NouvelArticleComponent, canActivate: [ApplicationGuardService], data: { breadcrumb: 'Nouvel article' } },
      { path: 'nouvel-article/:idArticle', component: NouvelArticleComponent, canActivate: [ApplicationGuardService], data: { breadcrumb: 'Nouvel article' } },
      { path: 'detail-article/:id', component: DetailArticlesMvtstkComponent, canActivate: [ApplicationGuardService], data: { origin: 'article', breadcrumb: 'Nom article' } },
      { path: 'mvtstk', component: PageMvtstkComponent, canActivate: [ApplicationGuardService], data: { breadcrumb: 'Mouvements de stock' } },
      { path: 'detail-mvtstk/:id', component: DetailArticlesMvtstkComponent, canActivate: [ApplicationGuardService], data: { origin: 'mvtstk', breadcrumb: 'Détail du mouvement' } },
      { path: 'clients', component: PageClientComponent, canActivate: [ApplicationGuardService], data: { breadcrumb: 'Clients' } },
      { path: 'nouveau-client', component: NouveauCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'client', breadcrumb: 'Nouveau client' } },
      { path: 'nouveau-client/:id', component: NouveauCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'client', breadcrumb: 'Modifier client' } },
      { path: 'detail-client/:id', component: DeatailClientFournisseurComponent, canActivate: [ApplicationGuardService], data: { origin: 'client', breadcrumb: 'Détail client' } },
      { path: 'commande-client', component: PageCmdCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'client', breadcrumb: 'Commandes clients' } },
      { path: 'commande-client/:id', component: PageCmdCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'client', detail: true, breadcrumb: 'Détail commande' } },
      { path: 'nouvel-commande-client', component: NouvelCmdCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'client', breadcrumb: 'Nouvelle commande' } },
      { path: 'nouvel-commande-client/:idCmd', component: NouvelCmdCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'client', breadcrumb: 'Modifier commande' } },
      { path: 'fournisseurs', component: PageFournisseurComponent, canActivate: [ApplicationGuardService], data: { breadcrumb: 'Fournisseurs' } },
      { path: 'nouveau-fournisseur', component: NouveauCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'fournisseur', breadcrumb: 'Nouveau fournisseur' } },
      { path: 'nouveau-fournisseur/:id', component: NouveauCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'fournisseur', breadcrumb: 'Modifier fournisseur' } },
      { path: 'detail-fournisseur/:id', component: DeatailClientFournisseurComponent, canActivate: [ApplicationGuardService], data: { origin: 'fournisseur', breadcrumb: 'Détail fournisseur' } },
      { path: 'commande-fournisseur', component: PageCmdCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'fournisseur', breadcrumb: 'Commandes fournisseurs' } },
      { path: 'commande-fournisseur/:id', component: PageCmdCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'fournisseur', detail: true, breadcrumb: 'Détail commande' } },
      { path: 'nouvel-commande-fournisseur', component: NouvelCmdCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'fournisseur', breadcrumb: 'Nouvelle commande' } },
      { path: 'nouvel-commande-fournisseur/:idCmd', component: NouvelCmdCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'fournisseur', breadcrumb: 'Modifier commande' } },
      { path: 'vente', component: PageVenteComponent, canActivate: [ApplicationGuardService], data: { origin: 'vente', breadcrumb: 'Vente' } },
      { path: 'liste-vente', component: HisistoriqueVenteComponent, canActivate: [ApplicationGuardService], data: { origin: 'vente', breadcrumb: 'Historique des ventes' } },
      { path: 'avoirs', component: PageHaveurComponent, canActivate: [ApplicationGuardService], data: { breadcrumb: 'Avoirs' } },
      { path: 'nouvel-avoir', component: NouvelAvoirComponent, canActivate: [ApplicationGuardService], data: { breadcrumb: 'Nouvel avoir' } },
      { path: 'nouvel-avoir/:id', component: NouvelAvoirComponent, canActivate: [ApplicationGuardService], data: { breadcrumb: 'Modifier avoir' } },
      { path: 'categories', component: PageCategorieComponent, canActivate: [ApplicationGuardService], data: { breadcrumb: 'Catégories' } },
      { path: 'nouvel-categorie', component: NouveauCategorieComponent, canActivate: [ApplicationGuardService], data: { breadcrumb: 'Nouvelle catégorie' } },
      { path: 'nouvel-categorie/:idCategory', component: NouveauCategorieComponent, canActivate: [ApplicationGuardService], data: { breadcrumb: 'Modifier catégorie' } },
      { path: 'utilisateurs', component: PageUtilisateurComponent, canActivate: [ApplicationGuardService], data: { breadcrumb: 'Utilisateurs' } },
      { path: 'utilisateur/:id', component: DetailUtilisateurComponent, canActivate: [ApplicationGuardService], data: { breadcrumb: 'Détail utilisateur' } },
      { path: 'nouvel-utilisateur', component: NouvelUtilisateurComponent, canActivate: [ApplicationGuardService], data: { breadcrumb: 'Nouvel utilisateur' } },
      { path: 'modifier-utilisateur/:id', component: NouvelUtilisateurComponent, canActivate: [ApplicationGuardService], data: { breadcrumb: 'Modifier utilisateur' } },
      { path: 'profil', component: PageProfilComponent, canActivate: [ApplicationGuardService], data: { breadcrumb: 'Profil' } },
      { path: 'modifier-profil', component: ModifProfilComponent, canActivate: [ApplicationGuardService], data: { breadcrumb: 'Modifier profil' } },
      { path: 'changer-mot-de-passe', component: ChangerMotDePasseComponent, canActivate: [ApplicationGuardService], data: { breadcrumb: 'Mot de passe' } }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
