import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PageInscriptionComponent } from './pages/page-inscription/page-inscription.component';
import { PageDashbordComponent } from './pages/page-dashbord/page-dashbord.component';
import { PageStatistiquesComponent } from './pages/page-statistiques/page-statistiques.component';
import { MenuComponent } from './composants/menu/menu.component';
import { HeaderComponent } from './composants/header/header.component';
import { PageArticleComponent } from './pages/articles/page-article/page-article.component';
import { DetailArticleComponent } from './composants/detail-article/detail-article.component';
import { PaginationComponent } from './composants/pagination/pagination.component';
import { BoutonActionComponent } from './composants/bouton-action/bouton-action.component';
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
import { ApplicationGuardService } from './services/guard/application-guard.service';
import { FormsModule } from '@angular/forms';
import { HttpInterceptorService } from './services/interceptor/http-interceptor.service';
import { LaoderComponent } from './composants/laoder/laoder.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { NgxPaginationModule } from 'ngx-pagination';
import { DetailArticlesMvtstkComponent } from './composants/detail-articles-mvtstk/detail-articles-mvtstk.component';
import { DeatailClientFournisseurComponent } from './composants/deatail-client-fournisseur/deatail-client-fournisseur.component';
import { ModifProfilComponent } from './pages/profil/modif-profil/modif-profil.component';
import { PaveVenteComponent } from './pages/pave-vente/pave-vente.component';
import { DashbordComponent } from './composants/dashbord/dashbord.component';
import { CalculatorComponent } from './composants/calculator/calculator.component';

registerLocaleData(localeFr, 'fr');

const routes: Routes = [
  { path: 'login', component: PageLoginComponent },
  { path: 'inscription', component: PageInscriptionComponent },
  {
    path: '', component: PageDashbordComponent,
    canActivate: [ApplicationGuardService],
    children: [
      {
        path: 'dashbord',
        component: DashbordComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path: 'statistiques',
        component: PageStatistiquesComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path: 'articles', component: PageArticleComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path: 'nouvel-article', component: NouvelArticleComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path: 'nouvel-article/:idArticle', component: NouvelArticleComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path: 'detail-article/:id', component: DetailArticlesMvtstkComponent,
        canActivate: [ApplicationGuardService],
        data: {
          origin: "article"
        }
      },
      {
        path: 'mvtstk', component: PageMvtstkComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path: 'detail-mvtstk/:id', component: DetailArticlesMvtstkComponent,
        canActivate: [ApplicationGuardService],
        data: {
          origin: "mvtstk"
        }
      },
      {
        path: 'clients', component: PageClientComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path: 'nouveau-client', component: NouveauCltFrsComponent,
        canActivate: [ApplicationGuardService],
        data: {
          origin: "client"
        }
      },
      {
        path: 'nouveau-client/:id', component: NouveauCltFrsComponent,
        canActivate: [ApplicationGuardService],
        data: {
          origin: "client"
        }
      },
      {
        path: 'detail-client/:id', component: DeatailClientFournisseurComponent,
        canActivate: [ApplicationGuardService],
        data: {
          origin: "client"
        }
      },
      {
        path: 'commande-client', component: PageCmdCltFrsComponent,
        canActivate: [ApplicationGuardService],
        data: {
          origin: "client"
        }
      },
      {
        path: 'nouvel-commande-client', component: NouvelCmdCltFrsComponent,
        canActivate: [ApplicationGuardService],
        data: {
          origin: "client"
        }
      },
      {
        path: 'nouvel-commande-client/:id', component: NouvelCmdCltFrsComponent,
        canActivate: [ApplicationGuardService],
        data: {
          origin: "client"
        }
      },
      {
        path: 'fournisseurs', component: PageFournisseurComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path: 'nouveau-fournisseur', component: NouveauCltFrsComponent,
        data: {
          origin: "fournisseur"
        }
      },

      {
        path: 'nouveau-fournisseur/:id', component: NouveauCltFrsComponent,
        data: {
          origin: "fournisseur"
        }
      },
      {
        path: 'detail-fournisseur/:id', component: DeatailClientFournisseurComponent,
        canActivate: [ApplicationGuardService],
        data: {
          origin: "fournisseur"
        }
      },
      {
        path: 'commande-fournisseur', component: PageCmdCltFrsComponent,
        canActivate: [ApplicationGuardService],
        data: {
          origin: "fournisseur"
        }
      },
      {
        path: 'nouvel-commande-fournisseur', component: NouvelCmdCltFrsComponent,
        canActivate: [ApplicationGuardService],
        data: {
          origin: "fournisseur"
        }
      },
      {
        path: 'nouvel-commande-fournisseur/:id', component: NouvelCmdCltFrsComponent,
        canActivate: [ApplicationGuardService],
        data: {
          origin: "fournisseur"
        }
      },
      {
        path: 'vente', component: PaveVenteComponent,
        canActivate: [ApplicationGuardService],
        data: {
          origin: "vente"
        }
      },
      {
        path: 'categories', component: PageCategorieComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path: 'nouvel-categorie', component: NouveauCategorieComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path: 'nouvel-categorie/:idCategory', component: NouveauCategorieComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path: 'utilisateurs', component: PageUtilisateurComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path: 'nouvel-utilisateur', component: NouvelUtilisateurComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path: 'profil', component: PageProfilComponent,
        canActivate: [ApplicationGuardService]
      },
      {
        path: 'changer-mot-de-passe', component: ChangerMotDePasseComponent,
        canActivate: [ApplicationGuardService]
      }
    ]
  }
];

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
    PaginationComponent,
    BoutonActionComponent,
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
    PaveVenteComponent,
    DashbordComponent,
    CalculatorComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
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
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
