import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { PageLoginComponent } from './pages/page-login/page-login.component';
import { PageInscriptionComponent } from './pages/page-inscription/page-inscription.component';
import { PageDashbordComponent } from './pages/page-dashbord/page-dashbord.component';
import { PageStatistiquesComponent } from './pages/page-statistiques/page-statistiques.component';
import { StatistiquesComponent } from './composants/statistiques/statistiques.component';
import { MenuComponent } from './composants/menu/menu.component';
import { HeaderComponent } from './composants/header/header.component';

import { PageArticleComponent } from './pages/articles/page-article/page-article.component';
import { DetailArticleComponent } from './composants/detail-article/detail-article.component';
import { BoutonActionComponent } from './composants/bouton-action/bouton-action.component';
import { LigneActionComponent } from './composants/ligne-action/ligne-action.component';
import { NouvelArticleComponent } from './pages/articles/nouvel-article/nouvel-article.component';
import { PageMvtstkComponent } from './pages/mvtstk/page-mvtstk/page-mvtstk.component';
import { DetailMvtstkArticlesComponent } from './composants/detail-mvtstk-articles/detail-mvtstk-articles.component';
import { DetailMvtstkComponent } from './composants/detail-mvtstk/detail-mvtstk.component';
import { DetailCltFrsComponent } from './composants/detail-clt-frs/detail-clt-frs.component';
import { PageClientComponent } from './pages/clients/page-client/page-client.component';
import { PageFournisseurComponent } from './pages/fournisseurs/page-fournisseur/page-fournisseur.component';
import { NouveauCltFrsComponent } from './composants/nouveau-clt-frs/nouveau-clt-frs.component';
import { DetailsCmdCltFrsComponent } from './composants/details-cmd-clt-frs/details-cmd-clt-frs.component';
import { DetailsCmdComponent } from './composants/details-cmd/details-cmd.component';
import { PageCmdCltFrsComponent } from './pages/page-cmd-clt-frs/page-cmd-clt-frs.component';
import { NouvelCmdCltFrsComponent } from './composants/nouvel-cmd-clt-frs/nouvel-cmd-clt-frs.component';
import { PageCategorieComponent } from './pages/categories/page-categorie/page-categorie.component';
import { NouveauCategorieComponent } from './pages/categories/nouveau-categorie/nouveau-categorie.component';
import { PageUtilisateurComponent } from './pages/utilisateurs/page-utilisateur/page-utilisateur.component';
import { DetailUtilisateurComponent } from './composants/detail-utilisateur/detail-utilisateur.component';
import { NouvelUtilisateurComponent } from './pages/utilisateurs/nouvel-utilisateur/nouvel-utilisateur.component';
import { PageProfilComponent } from './pages/profil/page-profil/page-profil.component';
import { ChangerMotDePasseComponent } from './pages/profil/changer-mot-de-passe/changer-mot-de-passe.component';
import { HttpInterceptorService } from './services/interceptor/http-interceptor.service';
import { LoadingInterceptor } from './services/interceptor/loading-interceptor.service';
import { LaoderComponent } from './composants/laoder/laoder.component';
import { DetailArticlesMvtstkComponent } from './composants/detail-articles-mvtstk/detail-articles-mvtstk.component';
import { DeatailClientFournisseurComponent } from './composants/deatail-client-fournisseur/deatail-client-fournisseur.component';
import { ModifProfilComponent } from './pages/profil/modif-profil/modif-profil.component';
import { DashbordComponent } from './composants/dashbord/dashbord.component';
import { CalculatorComponent } from './composants/calculator/calculator.component';
import { HisistoriqueVenteComponent } from './pages/vente/hisistorique-vente/hisistorique-vente.component';
import { PageVenteComponent } from './pages/vente/page-vente/page-vente.component';
import { PageHaveurComponent } from './pages/avoirs/page-avoir/page-avoir.component';
import { NouvelAvoirComponent } from './pages/avoirs/nouvel-avoir/nouvel-avoir.component';
import { EtatoWorkflowComponent } from './composants/etat-workflow/etat-workflow.component';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    PageLoginComponent,
    PageInscriptionComponent,
    PageDashbordComponent,
    PageStatistiquesComponent,
    MenuComponent,
    HeaderComponent,
    PageArticleComponent,
    DetailArticleComponent,
    BoutonActionComponent,
    LigneActionComponent,
    NouvelArticleComponent,
    PageMvtstkComponent,
    DetailMvtstkArticlesComponent,
    DetailMvtstkComponent,
    DetailCltFrsComponent,
    PageClientComponent,
    PageFournisseurComponent,
    NouveauCltFrsComponent,
    DetailsCmdCltFrsComponent,
    DetailsCmdComponent,
    PageCmdCltFrsComponent,
    NouvelCmdCltFrsComponent,
    PageCategorieComponent,
    NouveauCategorieComponent,
    PageUtilisateurComponent,
    DetailUtilisateurComponent,
    NouvelUtilisateurComponent,
    PageProfilComponent,
    ChangerMotDePasseComponent,
    LaoderComponent,
    DeatailClientFournisseurComponent,
    ModifProfilComponent,
    PageVenteComponent,
    DashbordComponent,
    CalculatorComponent,
    HisistoriqueVenteComponent,
    StatistiquesComponent,
    PageHaveurComponent,
    NouvelAvoirComponent,
   EtatoWorkflowComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    NgxPaginationModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpInterceptorService,
    multi: true
  }, {
    provide: HTTP_INTERCEPTORS,
    useClass: LoadingInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
