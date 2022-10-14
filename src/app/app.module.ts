import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { PageLoginComponent } from './pages/page-login/page-login.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PageInscriptionComponent } from './pages/page-inscription/page-inscription.component';
import { PageDashbordComponent } from './pages/page-dashbord/page-dashbord.component';
import { PageStatistiquesComponent } from './pages/page-statistiques/page-statistiques.component';
import { MenuComponent } from './composans/menu/menu.component';
import { HeaderComponent } from './composans/header/header.component';
import { PageArticleComponent } from './pages/articles/page-article/page-article.component';
import { DetailArticleComponent } from './composans/detail-article/detail-article.component';

const routes: Routes = [
  { path: 'login', component: PageLoginComponent },
  { path: 'inscription', component: PageInscriptionComponent},
  { 
    path: '', component: PageDashbordComponent,
    children: [
      { path: 'statistiques', component: PageStatistiquesComponent},
      { path: 'articles', component: PageArticleComponent}
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
    DetailArticleComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AppRoutingModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
