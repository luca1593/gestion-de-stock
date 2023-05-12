/* tslint:disable */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationInterface } from './api-configuration';

import { AuthenticationService } from './services/authentication.service';
import { ArticlesService } from './services/articles.service';
import { ApiService } from './services/api.service';
import { CategoryService } from './services/category.service';
import { ClientService } from './services/client.service';
import { CommandeClientService } from './services/commande-client.service';
import { CommandeFournisseurService } from './services/commande-fournisseur.service';
import { EntrepriseService } from './services/entreprise.service';
import { FournisseurService } from './services/fournisseur.service';
import { MvtstkService } from './services/mvtstk.service';
import { UtilisateurService } from './services/utilisateur.service';
import { VenteService } from './services/vente.service';

/**
 * Provider for all Api services, plus ApiConfiguration
 */
@NgModule({
  imports: [
    HttpClientModule
  ],
  exports: [
    HttpClientModule
  ],
  declarations: [],
  providers: [
    ApiConfiguration,
    AuthenticationService,
    ArticlesService,
    ApiService,
    CategoryService,
    ClientService,
    CommandeClientService,
    CommandeFournisseurService,
    EntrepriseService,
    FournisseurService,
    MvtstkService,
    UtilisateurService,
    VenteService
  ],
})
export class ApiModule {
  static forRoot(customParams: ApiConfigurationInterface): ModuleWithProviders<ApiModule> {
    return {
      ngModule: ApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: {rootUrl: customParams.rootUrl}
        }
      ]
    }
  }
}
