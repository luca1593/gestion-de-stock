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
      { path: '', redirectTo: 'dashbord', pathMatch: 'full' },
      { path: 'dashbord', component: PageDashbordComponent, canActivate: [ApplicationGuardService] },
      { path: 'statistiques', component: StatistiquesComponent, canActivate: [ApplicationGuardService] },
      { path: 'articles', component: PageArticleComponent, canActivate: [ApplicationGuardService] },
      { path: 'nouvel-article', component: NouvelArticleComponent, canActivate: [ApplicationGuardService] },
      { path: 'nouvel-article/:idArticle', component: NouvelArticleComponent, canActivate: [ApplicationGuardService] },
      { path: 'detail-article/:id', component: DetailArticlesMvtstkComponent, canActivate: [ApplicationGuardService], data: { origin: 'article' } },
      { path: 'mvtstk', component: PageMvtstkComponent, canActivate: [ApplicationGuardService] },
      { path: 'detail-mvtstk/:id', component: DetailArticlesMvtstkComponent, canActivate: [ApplicationGuardService], data: { origin: 'mvtstk' } },
      { path: 'clients', component: PageClientComponent, canActivate: [ApplicationGuardService] },
      { path: 'nouveau-client', component: NouveauCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'client' } },
      { path: 'nouveau-client/:id', component: NouveauCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'client' } },
      { path: 'detail-client/:id', component: DeatailClientFournisseurComponent, canActivate: [ApplicationGuardService], data: { origin: 'client' } },
      { path: 'commande-client', component: PageCmdCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'client' } },
      { path: 'commande-client/:id', component: PageCmdCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'client', detail: true } },
      { path: 'nouvel-commande-client', component: NouvelCmdCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'client' } },
      { path: 'nouvel-commande-client/:idCmd', component: NouvelCmdCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'client' } },
      { path: 'fournisseurs', component: PageFournisseurComponent, canActivate: [ApplicationGuardService] },
      { path: 'nouveau-fournisseur', component: NouveauCltFrsComponent, data: { origin: 'fournisseur' } },
      { path: 'nouveau-fournisseur/:id', component: NouveauCltFrsComponent, data: { origin: 'fournisseur' } },
      { path: 'detail-fournisseur/:id', component: DeatailClientFournisseurComponent, canActivate: [ApplicationGuardService], data: { origin: 'fournisseur' } },
      { path: 'commande-fournisseur', component: PageCmdCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'fournisseur' } },
      { path: 'commande-fournisseur/:id', component: PageCmdCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'fournisseur', detail: true } },
      { path: 'nouvel-commande-fournisseur', component: NouvelCmdCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'fournisseur' } },
      { path: 'nouvel-commande-fournisseur/:idCmd', component: NouvelCmdCltFrsComponent, canActivate: [ApplicationGuardService], data: { origin: 'fournisseur' } },
      { path: 'vente', component: PageVenteComponent, canActivate: [ApplicationGuardService], data: { origin: 'vente' } },
      { path: 'liste-vente', component: HisistoriqueVenteComponent, canActivate: [ApplicationGuardService], data: { origin: 'vente' } },
      { path: 'avoirs', component: PageHaveurComponent, canActivate: [ApplicationGuardService] },
      { path: 'nouvel-avoir', component: NouvelAvoirComponent, canActivate: [ApplicationGuardService] },
      { path: 'nouvel-avoir/:id', component: NouvelAvoirComponent, canActivate: [ApplicationGuardService] },
      { path: 'categories', component: PageCategorieComponent, canActivate: [ApplicationGuardService] },
      { path: 'nouvel-categorie', component: NouveauCategorieComponent, canActivate: [ApplicationGuardService] },
      { path: 'nouvel-categorie/:idCategory', component: NouveauCategorieComponent, canActivate: [ApplicationGuardService] },
      { path: 'utilisateurs', component: PageUtilisateurComponent, canActivate: [ApplicationGuardService] },
      { path: 'utilisateur/:id', component: DetailUtilisateurComponent, canActivate: [ApplicationGuardService] },
      { path: 'nouvel-utilisateur', component: NouvelUtilisateurComponent, canActivate: [ApplicationGuardService] },
      { path: 'modifier-utilisateur/:id', component: NouvelUtilisateurComponent, canActivate: [ApplicationGuardService] },
      { path: 'profil', component: PageProfilComponent, canActivate: [ApplicationGuardService] },
      { path: 'modifier-profil', component: ModifProfilComponent, canActivate: [ApplicationGuardService] },
      { path: 'changer-mot-de-passe', component: ChangerMotDePasseComponent, canActivate: [ApplicationGuardService] }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
