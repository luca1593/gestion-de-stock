/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { ArticleDto } from '../models/article-dto';
import { LigneCommandeFournisseurDto } from '../models/ligne-commande-fournisseur-dto';
import { LigneVenteDto } from '../models/ligne-vente-dto';
import { CategoryDto } from '../models/category-dto';
import { ClientDto } from '../models/client-dto';
import { CommandeClientDto } from '../models/commande-client-dto';
import { CommandeFournisseurDto } from '../models/commande-fournisseur-dto';
import { EntrepriseDto } from '../models/entreprise-dto';
import { FournisseurDto } from '../models/fournisseur-dto';
import { MvtStkDto } from '../models/mvt-stk-dto';
import { UtilisateurDto } from '../models/utilisateur-dto';
import { VenteDto } from '../models/vente-dto';
@Injectable({
  providedIn: 'root',
})
class ApiService extends __BaseService {
  static readonly ArticleControllerSavePOSTPath = '/gestiondestock/v1/articles/create';
  static readonly ArticleControllerDeleteDELETEPath = '/gestiondestock/v1/articles/delete/{idArticle}';
  static readonly ArticleControllerFindAllByCategorieGETPath = '/gestiondestock/v1/articles/filtre/category/{idCategore}';
  static readonly ArticleControllerFindHistoriqueCommandeFournisseurGETPath = '/gestiondestock/v1/articles/historiques/commande-fournisseur/{idArticle}';
  static readonly ArticleControllerFindHistoriqueVenteGETPath = '/gestiondestock/v1/articles/historiques/vente/{idArticle}';
  static readonly CategoryControllerFindAllGETPath = '/gestiondestock/v1/category/all';
  static readonly CategoryControllerSavePOSTPath = '/gestiondestock/v1/category/create';
  static readonly CategoryControllerDeleteDELETEPath = '/gestiondestock/v1/category/detele/{idCategory}';
  static readonly CategoryControllerFindByIdGETPath = '/gestiondestock/v1/category/{idCategory}';
  static readonly ClientControllerFindbyNomClientGETPath = '/gestiondestock/v1/client/nom/{nomClient}';
  static readonly ClientControllerSavePOSTPath = '/gestiondestock/v1/client/save';
  static readonly ClientControllerFindByIdGETPath = '/gestiondestock/v1/client/{idClient}';
  static readonly CommandeClientControllerSavePOSTPath = '/gestiondestock/v1/commande-client/create';
  static readonly CommandeClientControllerFindByDateCommandeGETPath = '/gestiondestock/v1/commande-client/date/{dateCommandeClient}';
  static readonly CommandeClientControllerDeleteArticleDELETEPath = '/gestiondestock/v1/commande-client/delete/article/{idCommande}/{idLigneCommande}';
  static readonly CommandeClientControllerDeleteDELETEPath = '/gestiondestock/v1/commande-client/delete/{idCommandeClient}';
  static readonly CommandeClientControllerUpdateClientPATCHPath = '/gestiondestock/v1/commande-client/update/client/{idCommande}/{idClient}';
  static readonly CommandeFournisseurControllerFindAllGETPath = '/gestiondestock/v1/commande-fournisseur/all';
  static readonly CommandeFournisseurControllerSavePOSTPath = '/gestiondestock/v1/commande-fournisseur/create';
  static readonly CommandeFournisseurControllerFindByDateCommandeGETPath = '/gestiondestock/v1/commande-fournisseur/date/{dateCommandeFournisseur}';
  static readonly CommandeFournisseurControllerDeleteArticleDELETEPath = '/gestiondestock/v1/commande-fournisseur/delete/article/{idCommande}/{idLigneCommande}';
  static readonly CommandeFournisseurControllerFindAllByCommandeFournisseurGETPath = '/gestiondestock/v1/commande-fournisseur/list/ligne-commande/{idCommande}';
  static readonly CommandeFournisseurControllerUpdateEtatCommandePATCHPath = '/gestiondestock/v1/commande-fournisseur/update/etat/{idCommande}/{etatCommande}';
  static readonly CommandeFournisseurControllerUpdateFournisseurPATCHPath = '/gestiondestock/v1/commande-fournisseur/update/fournisseur/{idCommande}/{idFournisseur}';
  static readonly CommandeFournisseurControllerUpdateQuantiterCommandePATCHPath = '/gestiondestock/v1/commande-fournisseur/update/quantite/{idCommande}/{idLigneCommande}/{quantite}';
  static readonly EntrepriseControllerFindAllGETPath = '/gestiondestock/v1/entreprise/all';
  static readonly EntrepriseControllerSavePOSTPath = '/gestiondestock/v1/entreprise/create';
  static readonly EntrepriseControllerDeleteDELETEPath = '/gestiondestock/v1/entreprise/delete{idEntreprise}';
  static readonly EntrepriseControllerFindByNomEntrepriseGETPath = '/gestiondestock/v1/entreprise/nom{nomEntreprise}';
  static readonly EntrepriseControllerFindByIdGETPath = '/gestiondestock/v1/entreprise/{idEntreprise}';
  static readonly FournisseurControllerDeleteDELETEPath = '/gestiondestock/v1/fournisseur/detele/{idFournisseur}';
  static readonly FournisseurControllerFindByNomFournisseurGETPath = '/gestiondestock/v1/fournisseur/nom/{nomFournisseur}';
  static readonly HomeControllerHomeGETPath = '/gestiondestock/v1/home';
  static readonly MvtStkControllerFindAllGETPath = '/gestiondestock/v1/mvtstk/all';
  static readonly MvtStkControllerCorrectionMvtStkNegPOSTPath = '/gestiondestock/v1/mvtstk/correction-neg';
  static readonly MvtStkControllerFindMvtStkByDateMvtGETPath = '/gestiondestock/v1/mvtstk/date/{dateMvtStk}';
  static readonly MvtStkControllerEntreMvtStkPOSTPath = '/gestiondestock/v1/mvtstk/entre';
  static readonly MvtStkControllerMvtStkArticleGETPath = '/gestiondestock/v1/mvtstk/filter/article/{idArticle}';
  static readonly MvtStkControllerSavePOSTPath = '/gestiondestock/v1/mvtstk/save';
  static readonly MvtStkControllerSortieMvtStkPOSTPath = '/gestiondestock/v1/mvtstk/sortie';
  static readonly MvtStkControllerFindByIdGETPath = '/gestiondestock/v1/mvtstk/{idMvtstk}';
  static readonly PhotoControllerSavePhotoPOSTPath = '/gestiondestock/v1/photos/{context}/{id}';
  static readonly UtilisateurControllerDeleteDELETEPath = '/gestiondestock/v1/utilisateur/detele/{idUtilisateur}';
  static readonly UtilisateurControllerFindByEmailUtilisateurGETPath = '/gestiondestock/v1/utilisateur/email/{emailUtilisateur}';
  static readonly UtilisateurControllerFindByIdGETPath = '/gestiondestock/v1/utilisateur/{idUtilisateur}';
  static readonly VenteControllerFindAllGETPath = '/gestiondestock/v1/vente/all';
  static readonly VenteControllerFindByCodeVenteGETPath = '/gestiondestock/v1/vente/code/{codeVente}';
  static readonly VenteControllerDeleteDELETEPath = '/gestiondestock/v1/vente/detele/{idVente}';
  static readonly VenteControllerFindByIdGETPath = '/gestiondestock/v1/vente/{idVente}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Enregistrement d'un article
   *
   * Cette methode permet d'enregidtre ou de modifier un article
   * @return L'objet article creer ou modifier
   */
  ArticleControllerSavePOSTResponse(): __Observable<__StrictHttpResponse<ArticleDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/gestiondestock/v1/articles/create`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ArticleDto>;
      })
    );
  }
  /**
   * Enregistrement d'un article
   *
   * Cette methode permet d'enregidtre ou de modifier un article
   * @return L'objet article creer ou modifier
   */
  ArticleControllerSavePOST(): __Observable<ArticleDto> {
    return this.ArticleControllerSavePOSTResponse().pipe(
      __map(_r => _r.body as ArticleDto)
    );
  }

  /**
   * Supprimer un article
   *
   * Cette methode permet de supprimer un article par son ID
   */
  ArticleControllerDeleteDELETEResponse(idArticle?: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/gestiondestock/v1/articles/delete/${encodeURIComponent(String(idArticle))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * Supprimer un article
   *
   * Cette methode permet de supprimer un article par son ID
   */
  ArticleControllerDeleteDELETE(idArticle?: string): __Observable<null> {
    return this.ArticleControllerDeleteDELETEResponse(idArticle).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @return successful operation
   */
  ArticleControllerFindAllByCategorieGETResponse(idCategory?: string): __Observable<__StrictHttpResponse<Array<ArticleDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/articles/filtre/category/${encodeURIComponent(String(idCategory))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<ArticleDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  ArticleControllerFindAllByCategorieGET(idCategory?: string): __Observable<Array<ArticleDto>> {
    return this.ArticleControllerFindAllByCategorieGETResponse(idCategory).pipe(
      __map(_r => _r.body as Array<ArticleDto>)
    );
  }

  /**
   * @return successful operation
   */
  ArticleControllerFindHistoriqueCommandeFournisseurGETResponse(idArticle?: string): __Observable<__StrictHttpResponse<Array<LigneCommandeFournisseurDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/articles/historiques/commande-fournisseur/${encodeURIComponent(String(idArticle))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<LigneCommandeFournisseurDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  ArticleControllerFindHistoriqueCommandeFournisseurGET(idArticle?: string): __Observable<Array<LigneCommandeFournisseurDto>> {
    return this.ArticleControllerFindHistoriqueCommandeFournisseurGETResponse(idArticle).pipe(
      __map(_r => _r.body as Array<LigneCommandeFournisseurDto>)
    );
  }

  /**
   * @return successful operation
   */
  ArticleControllerFindHistoriqueVenteGETResponse(idArticle?: string): __Observable<__StrictHttpResponse<Array<LigneVenteDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/articles/historiques/vente/${encodeURIComponent(String(idArticle))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<LigneVenteDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  ArticleControllerFindHistoriqueVenteGET(idArticle?: string): __Observable<Array<LigneVenteDto>> {
    return this.ArticleControllerFindHistoriqueVenteGETResponse(idArticle).pipe(
      __map(_r => _r.body as Array<LigneVenteDto>)
    );
  }

  /**
   * Renvoie la liste des categories
   *
   * Cette methode permet de rechercher toutes les categories dans la BDD
   * @return La liste des categories / liste vide
   */
  CategoryControllerFindAllGETResponse(): __Observable<__StrictHttpResponse<Array<CategoryDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/category/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<CategoryDto>>;
      })
    );
  }
  /**
   * Renvoie la liste des categories
   *
   * Cette methode permet de rechercher toutes les categories dans la BDD
   * @return La liste des categories / liste vide
   */
  CategoryControllerFindAllGET(): __Observable<Array<CategoryDto>> {
    return this.CategoryControllerFindAllGETResponse().pipe(
      __map(_r => _r.body as Array<CategoryDto>)
    );
  }

  /**
   * Enregistrement d'une categorie
   *
   * Cette methode permet d'enregidtre ou de modifier une categorie
   * @return L'objet categorie creer ou modifier
   */
  CategoryControllerSavePOSTResponse(): __Observable<__StrictHttpResponse<CategoryDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/gestiondestock/v1/category/create`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CategoryDto>;
      })
    );
  }
  /**
   * Enregistrement d'une categorie
   *
   * Cette methode permet d'enregidtre ou de modifier une categorie
   * @return L'objet categorie creer ou modifier
   */
  CategoryControllerSavePOST(): __Observable<CategoryDto> {
    return this.CategoryControllerSavePOSTResponse().pipe(
      __map(_r => _r.body as CategoryDto)
    );
  }

  /**
   * Supprimer un article
   *
   * Cette methode permet de supprimer un categorie par son ID
   */
  CategoryControllerDeleteDELETEResponse(idCategory?: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/gestiondestock/v1/category/detele/${encodeURIComponent(String(idCategory))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * Supprimer un article
   *
   * Cette methode permet de supprimer un categorie par son ID
   */
  CategoryControllerDeleteDELETE(idCategory?: string): __Observable<null> {
    return this.CategoryControllerDeleteDELETEResponse(idCategory).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * Rechercher une categorie
   *
   * Cette methode permet de rechercher une categorie par son ID
   * @return L'objet categorie a ete trouver dans la BDD
   */
  CategoryControllerFindByIdGETResponse(idCategory?: string): __Observable<__StrictHttpResponse<CategoryDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/category/${encodeURIComponent(String(idCategory))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CategoryDto>;
      })
    );
  }
  /**
   * Rechercher une categorie
   *
   * Cette methode permet de rechercher une categorie par son ID
   * @return L'objet categorie a ete trouver dans la BDD
   */
  CategoryControllerFindByIdGET(idCategory?: string): __Observable<CategoryDto> {
    return this.CategoryControllerFindByIdGETResponse(idCategory).pipe(
      __map(_r => _r.body as CategoryDto)
    );
  }

  /**
   * Rechercher un client
   *
   * Cette methode permet de rechercher un client par son nom
   * @return L'objet client a ete trouver dans la BDD
   */
  ClientControllerFindbyNomClientGETResponse(nomClient?: string): __Observable<__StrictHttpResponse<ClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/client/nom/${encodeURIComponent(String(nomClient))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ClientDto>;
      })
    );
  }
  /**
   * Rechercher un client
   *
   * Cette methode permet de rechercher un client par son nom
   * @return L'objet client a ete trouver dans la BDD
   */
  ClientControllerFindbyNomClientGET(nomClient?: string): __Observable<ClientDto> {
    return this.ClientControllerFindbyNomClientGETResponse(nomClient).pipe(
      __map(_r => _r.body as ClientDto)
    );
  }

  /**
   * Enregistrement d'un client
   *
   * Cette methode permet d'enregidtre ou de modifier un client
   * @return L'objet client creer ou modifier
   */
  ClientControllerSavePOSTResponse(): __Observable<__StrictHttpResponse<ClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/gestiondestock/v1/client/save`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ClientDto>;
      })
    );
  }
  /**
   * Enregistrement d'un client
   *
   * Cette methode permet d'enregidtre ou de modifier un client
   * @return L'objet client creer ou modifier
   */
  ClientControllerSavePOST(): __Observable<ClientDto> {
    return this.ClientControllerSavePOSTResponse().pipe(
      __map(_r => _r.body as ClientDto)
    );
  }

  /**
   * Rechercher un client
   *
   * Cette methode permet de rechercher un client par son ID
   * @return L'objet client a ete trouver dans la BDD
   */
  ClientControllerFindByIdGETResponse(idClient?: string): __Observable<__StrictHttpResponse<ClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/client/${encodeURIComponent(String(idClient))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<ClientDto>;
      })
    );
  }
  /**
   * Rechercher un client
   *
   * Cette methode permet de rechercher un client par son ID
   * @return L'objet client a ete trouver dans la BDD
   */
  ClientControllerFindByIdGET(idClient?: string): __Observable<ClientDto> {
    return this.ClientControllerFindByIdGETResponse(idClient).pipe(
      __map(_r => _r.body as ClientDto)
    );
  }

  /**
   * Enregistrement d'une commande client
   *
   * Cette methode permet d'enregidtre ou de modifier une commande client
   * @return L'objet commande client creer ou modifier
   */
  CommandeClientControllerSavePOSTResponse(): __Observable<__StrictHttpResponse<CommandeClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/gestiondestock/v1/commande-client/create`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeClientDto>;
      })
    );
  }
  /**
   * Enregistrement d'une commande client
   *
   * Cette methode permet d'enregidtre ou de modifier une commande client
   * @return L'objet commande client creer ou modifier
   */
  CommandeClientControllerSavePOST(): __Observable<CommandeClientDto> {
    return this.CommandeClientControllerSavePOSTResponse().pipe(
      __map(_r => _r.body as CommandeClientDto)
    );
  }

  /**
   * Rechercher liste des commandes client par date
   *
   * Cette methode permet de rechercher liste des commandes client par date
   * @return Aucune commande client n'a ete trouver dans la BDD
   */
  CommandeClientControllerFindByDateCommandeGETResponse(dateCommandeClient?: string): __Observable<__StrictHttpResponse<Array<CommandeClientDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/commande-client/date/${encodeURIComponent(String(dateCommandeClient))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<CommandeClientDto>>;
      })
    );
  }
  /**
   * Rechercher liste des commandes client par date
   *
   * Cette methode permet de rechercher liste des commandes client par date
   * @return Aucune commande client n'a ete trouver dans la BDD
   */
  CommandeClientControllerFindByDateCommandeGET(dateCommandeClient?: string): __Observable<Array<CommandeClientDto>> {
    return this.CommandeClientControllerFindByDateCommandeGETResponse(dateCommandeClient).pipe(
      __map(_r => _r.body as Array<CommandeClientDto>)
    );
  }

  /**
   * @return L'article de la commande client a bien ete supprimer
   */
  CommandeClientControllerDeleteArticleDELETEResponse(idCommande?: string, idLigneCommande?: string): __Observable<__StrictHttpResponse<CommandeClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/gestiondestock/v1/commande-client/delete/article/${encodeURIComponent(String(idCommande))}/${encodeURIComponent(String(idLigneCommande))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeClientDto>;
      })
    );
  }
  /**
   * @return L'article de la commande client a bien ete supprimer
   */
  CommandeClientControllerDeleteArticleDELETE(idCommande?: string, idLigneCommande?: string): __Observable<CommandeClientDto> {
    return this.CommandeClientControllerDeleteArticleDELETEResponse(idCommande, idLigneCommande).pipe(
      __map(_r => _r.body as CommandeClientDto)
    );
  }

  /**
   * Supprimer une commande client
   *
   * Cette methode permet de supprimer une commande client par son ID
   */
  CommandeClientControllerDeleteDELETEResponse(idCommandeClient?: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/gestiondestock/v1/commande-client/delete/${encodeURIComponent(String(idCommandeClient))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * Supprimer une commande client
   *
   * Cette methode permet de supprimer une commande client par son ID
   */
  CommandeClientControllerDeleteDELETE(idCommandeClient?: string): __Observable<null> {
    return this.CommandeClientControllerDeleteDELETEResponse(idCommandeClient).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @return Le client de la commande client a bien ete modifier
   */
  CommandeClientControllerUpdateClientPATCHResponse(idCommande?: string, idClient?: string): __Observable<__StrictHttpResponse<CommandeClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `/gestiondestock/v1/commande-client/update/client/${encodeURIComponent(String(idCommande))}/${encodeURIComponent(String(idClient))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeClientDto>;
      })
    );
  }
  /**
   * @return Le client de la commande client a bien ete modifier
   */
  CommandeClientControllerUpdateClientPATCH(idCommande?: string, idClient?: string): __Observable<CommandeClientDto> {
    return this.CommandeClientControllerUpdateClientPATCHResponse(idCommande, idClient).pipe(
      __map(_r => _r.body as CommandeClientDto)
    );
  }

  /**
   * Renvoie la liste des commandes fournisseur
   *
   * Cette methode permet de rechercher toutes les commandes fournisseur dans la BDD
   * @return La liste des commandes fournisseur / liste vide
   */
  CommandeFournisseurControllerFindAllGETResponse(): __Observable<__StrictHttpResponse<Array<CommandeFournisseurDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/commande-fournisseur/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<CommandeFournisseurDto>>;
      })
    );
  }
  /**
   * Renvoie la liste des commandes fournisseur
   *
   * Cette methode permet de rechercher toutes les commandes fournisseur dans la BDD
   * @return La liste des commandes fournisseur / liste vide
   */
  CommandeFournisseurControllerFindAllGET(): __Observable<Array<CommandeFournisseurDto>> {
    return this.CommandeFournisseurControllerFindAllGETResponse().pipe(
      __map(_r => _r.body as Array<CommandeFournisseurDto>)
    );
  }

  /**
   * Enregistrement d'une commande fournisseur
   *
   * Cette methode permet d'enregidtre ou de modifier une commande fournisseur
   * @return L'objet commande fournisseur creer ou modifier
   */
  CommandeFournisseurControllerSavePOSTResponse(): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/gestiondestock/v1/commande-fournisseur/create`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeFournisseurDto>;
      })
    );
  }
  /**
   * Enregistrement d'une commande fournisseur
   *
   * Cette methode permet d'enregidtre ou de modifier une commande fournisseur
   * @return L'objet commande fournisseur creer ou modifier
   */
  CommandeFournisseurControllerSavePOST(): __Observable<CommandeFournisseurDto> {
    return this.CommandeFournisseurControllerSavePOSTResponse().pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

  /**
   * Rechercher liste des commandes fournisseur par date
   *
   * Cette methode permet de rechercher liste des commandes fournisseur par date
   * @return Aucune commande fournisseur n'a ete trouver dans la BDD
   */
  CommandeFournisseurControllerFindByDateCommandeGETResponse(dateCommandeFournisseur?: string): __Observable<__StrictHttpResponse<Array<CommandeFournisseurDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/commande-fournisseur/date/${encodeURIComponent(String(dateCommandeFournisseur))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<CommandeFournisseurDto>>;
      })
    );
  }
  /**
   * Rechercher liste des commandes fournisseur par date
   *
   * Cette methode permet de rechercher liste des commandes fournisseur par date
   * @return Aucune commande fournisseur n'a ete trouver dans la BDD
   */
  CommandeFournisseurControllerFindByDateCommandeGET(dateCommandeFournisseur?: string): __Observable<Array<CommandeFournisseurDto>> {
    return this.CommandeFournisseurControllerFindByDateCommandeGETResponse(dateCommandeFournisseur).pipe(
      __map(_r => _r.body as Array<CommandeFournisseurDto>)
    );
  }

  /**
   * Suppression d'un articl d'une commande fournisseur
   *
   * Cette methode permet de supprimer un article sur 'une commande fournisseur par son id
   * @return L'article de la commande fournisseur a ete supprimer avec success
   */
  CommandeFournisseurControllerDeleteArticleDELETEResponse(idCommande?: string, idLigneCommande?: string): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/gestiondestock/v1/commande-fournisseur/delete/article/${encodeURIComponent(String(idCommande))}/${encodeURIComponent(String(idLigneCommande))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeFournisseurDto>;
      })
    );
  }
  /**
   * Suppression d'un articl d'une commande fournisseur
   *
   * Cette methode permet de supprimer un article sur 'une commande fournisseur par son id
   * @return L'article de la commande fournisseur a ete supprimer avec success
   */
  CommandeFournisseurControllerDeleteArticleDELETE(idCommande?: string, idLigneCommande?: string): __Observable<CommandeFournisseurDto> {
    return this.CommandeFournisseurControllerDeleteArticleDELETEResponse(idCommande, idLigneCommande).pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

  /**
   * Recherche de la liste des lignes de commande d'une commande fournisseur
   *
   * Cette methode permet de rechercher la liste des lignes de commande d'une commande fournisseur par son id
   * @return Liste des lignes de commande fournisseur a ete trouver avec succesr
   */
  CommandeFournisseurControllerFindAllByCommandeFournisseurGETResponse(idCommande?: string): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/commande-fournisseur/list/ligne-commande/${encodeURIComponent(String(idCommande))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeFournisseurDto>;
      })
    );
  }
  /**
   * Recherche de la liste des lignes de commande d'une commande fournisseur
   *
   * Cette methode permet de rechercher la liste des lignes de commande d'une commande fournisseur par son id
   * @return Liste des lignes de commande fournisseur a ete trouver avec succesr
   */
  CommandeFournisseurControllerFindAllByCommandeFournisseurGET(idCommande?: string): __Observable<CommandeFournisseurDto> {
    return this.CommandeFournisseurControllerFindAllByCommandeFournisseurGETResponse(idCommande).pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

  /**
   * Mise a jour de l'etat d'une commande fournisseur
   *
   * Cette methode permet de mettre a jour l'etat d'une commande fournisseur par son id
   * @return L'etat de la commande fournisseur a ete mise a jour
   */
  CommandeFournisseurControllerUpdateEtatCommandePATCHResponse(idCommande?: string, etatCommande?: string): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `/gestiondestock/v1/commande-fournisseur/update/etat/${encodeURIComponent(String(idCommande))}/${encodeURIComponent(String(etatCommande))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeFournisseurDto>;
      })
    );
  }
  /**
   * Mise a jour de l'etat d'une commande fournisseur
   *
   * Cette methode permet de mettre a jour l'etat d'une commande fournisseur par son id
   * @return L'etat de la commande fournisseur a ete mise a jour
   */
  CommandeFournisseurControllerUpdateEtatCommandePATCH(idCommande?: string, etatCommande?: string): __Observable<CommandeFournisseurDto> {
    return this.CommandeFournisseurControllerUpdateEtatCommandePATCHResponse(idCommande, etatCommande).pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

  /**
   * Mise a jour du fournisseur d'une commande fournisseur
   *
   * Cette methode permet de mettre a jour le fournisseur d'une commande fournisseur par son id
   * @return Le fournisseur de la commande fournisseur a ete mise a jour
   */
  CommandeFournisseurControllerUpdateFournisseurPATCHResponse(idCommande?: string, idFournisseur?: string): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `/gestiondestock/v1/commande-fournisseur/update/fournisseur/${encodeURIComponent(String(idCommande))}/${encodeURIComponent(String(idFournisseur))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeFournisseurDto>;
      })
    );
  }
  /**
   * Mise a jour du fournisseur d'une commande fournisseur
   *
   * Cette methode permet de mettre a jour le fournisseur d'une commande fournisseur par son id
   * @return Le fournisseur de la commande fournisseur a ete mise a jour
   */
  CommandeFournisseurControllerUpdateFournisseurPATCH(idCommande?: string, idFournisseur?: string): __Observable<CommandeFournisseurDto> {
    return this.CommandeFournisseurControllerUpdateFournisseurPATCHResponse(idCommande, idFournisseur).pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

  /**
   * Mise a jour de la quantite d'une commande fournisseur
   *
   * Cette methode permet de mettre a jour la quantite d'une commande fournisseur par son id
   * @return La quantite de la commande fournisseur a ete mise a jour
   */
  CommandeFournisseurControllerUpdateQuantiterCommandePATCHResponse(idCommande?: string, idLigneCommande?: string, quantite?: string): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `/gestiondestock/v1/commande-fournisseur/update/quantite/${encodeURIComponent(String(idCommande))}/${encodeURIComponent(String(idLigneCommande))}/${encodeURIComponent(String(quantite))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<CommandeFournisseurDto>;
      })
    );
  }
  /**
   * Mise a jour de la quantite d'une commande fournisseur
   *
   * Cette methode permet de mettre a jour la quantite d'une commande fournisseur par son id
   * @return La quantite de la commande fournisseur a ete mise a jour
   */
  CommandeFournisseurControllerUpdateQuantiterCommandePATCH(idCommande?: string, idLigneCommande?: string, quantite?: string): __Observable<CommandeFournisseurDto> {
    return this.CommandeFournisseurControllerUpdateQuantiterCommandePATCHResponse(idCommande, idLigneCommande, quantite).pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

  /**
   * Renvoie la liste des entreprises
   *
   * Cette methode permet de rechercher toutes les entreprises dans la BDD
   * @return La liste des clients / liste vide
   */
  EntrepriseControllerFindAllGETResponse(): __Observable<__StrictHttpResponse<Array<EntrepriseDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/entreprise/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<EntrepriseDto>>;
      })
    );
  }
  /**
   * Renvoie la liste des entreprises
   *
   * Cette methode permet de rechercher toutes les entreprises dans la BDD
   * @return La liste des clients / liste vide
   */
  EntrepriseControllerFindAllGET(): __Observable<Array<EntrepriseDto>> {
    return this.EntrepriseControllerFindAllGETResponse().pipe(
      __map(_r => _r.body as Array<EntrepriseDto>)
    );
  }

  /**
   * Enregistrement d'une entreprise
   *
   * Cette methode permet d'enregidtre ou de modifier une entreprise
   * @return L'objet client creer ou modifier
   */
  EntrepriseControllerSavePOSTResponse(): __Observable<__StrictHttpResponse<EntrepriseDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/gestiondestock/v1/entreprise/create`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<EntrepriseDto>;
      })
    );
  }
  /**
   * Enregistrement d'une entreprise
   *
   * Cette methode permet d'enregidtre ou de modifier une entreprise
   * @return L'objet client creer ou modifier
   */
  EntrepriseControllerSavePOST(): __Observable<EntrepriseDto> {
    return this.EntrepriseControllerSavePOSTResponse().pipe(
      __map(_r => _r.body as EntrepriseDto)
    );
  }

  /**
   * Supprimer un entreprise
   *
   * Cette methode permet de supprimer une entreprise par son ID
   */
  EntrepriseControllerDeleteDELETEResponse(idEntreprise?: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/gestiondestock/v1/entreprise/delete${encodeURIComponent(String(idEntreprise))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * Supprimer un entreprise
   *
   * Cette methode permet de supprimer une entreprise par son ID
   */
  EntrepriseControllerDeleteDELETE(idEntreprise?: string): __Observable<null> {
    return this.EntrepriseControllerDeleteDELETEResponse().pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * Rechercher un entreprise
   *
   * Cette methode permet de rechercher une entreprise par son nom
   * @return L'objet entreprise a ete trouver dans la BDD
   */
  EntrepriseControllerFindByNomEntrepriseGETResponse(nomEntreprise?: string): __Observable<__StrictHttpResponse<EntrepriseDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/entreprise/nom${encodeURIComponent(String(nomEntreprise))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<EntrepriseDto>;
      })
    );
  }
  /**
   * Rechercher un entreprise
   *
   * Cette methode permet de rechercher une entreprise par son nom
   * @return L'objet entreprise a ete trouver dans la BDD
   */
  EntrepriseControllerFindByNomEntrepriseGET(nomEntreprise?: string): __Observable<EntrepriseDto> {
    return this.EntrepriseControllerFindByNomEntrepriseGETResponse(nomEntreprise).pipe(
      __map(_r => _r.body as EntrepriseDto)
    );
  }

  /**
   * Rechercher un entreprise
   *
   * Cette methode permet de rechercher un entreprise par son ID
   * @return L'objet entreprise a ete trouver dans la BDD
   */
  EntrepriseControllerFindByIdGETResponse(idEntreprise?: string): __Observable<__StrictHttpResponse<EntrepriseDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/entreprise/${encodeURIComponent(String(idEntreprise))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<EntrepriseDto>;
      })
    );
  }
  /**
   * Rechercher un entreprise
   *
   * Cette methode permet de rechercher un entreprise par son ID
   * @return L'objet entreprise a ete trouver dans la BDD
   */
  EntrepriseControllerFindByIdGET(idEntreprise?: string): __Observable<EntrepriseDto> {
    return this.EntrepriseControllerFindByIdGETResponse(idEntreprise).pipe(
      __map(_r => _r.body as EntrepriseDto)
    );
  }

  /**
   * Supprimer un fournisseur
   *
   * Cette methode permet de supprimer un fournisseur par son ID
   */
  FournisseurControllerDeleteDELETEResponse(idFournisseur?: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/gestiondestock/v1/fournisseur/detele/${encodeURIComponent(String(idFournisseur))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * Supprimer un fournisseur
   *
   * Cette methode permet de supprimer un fournisseur par son ID
   */
  FournisseurControllerDeleteDELETE(idFournisseur?: string): __Observable<null> {
    return this.FournisseurControllerDeleteDELETEResponse(idFournisseur).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * Rechercher un fournisseur
   *
   * Cette methode permet de rechercher un fournisseur par son nom
   * @return L'objet fournisseur a ete trouver dans la BDD
   */
  FournisseurControllerFindByNomFournisseurGETResponse(nomFournisseur?: string): __Observable<__StrictHttpResponse<FournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/fournisseur/nom/${encodeURIComponent(String(nomFournisseur))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<FournisseurDto>;
      })
    );
  }
  /**
   * Rechercher un fournisseur
   *
   * Cette methode permet de rechercher un fournisseur par son nom
   * @return L'objet fournisseur a ete trouver dans la BDD
   */
  FournisseurControllerFindByNomFournisseurGET(nomFournisseur?: string): __Observable<FournisseurDto> {
    return this.FournisseurControllerFindByNomFournisseurGETResponse(nomFournisseur).pipe(
      __map(_r => _r.body as FournisseurDto)
    );
  }

  /**
   * @return successful operation
   */
  HomeControllerHomeGETResponse(): __Observable<__StrictHttpResponse<string>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/home`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<string>;
      })
    );
  }
  /**
   * @return successful operation
   */
  HomeControllerHomeGET(): __Observable<string> {
    return this.HomeControllerHomeGETResponse().pipe(
      __map(_r => _r.body as string)
    );
  }

  /**
   * Renvoie la liste des mouvements de stock
   *
   * Cette methode permet de rechercher toutes les mouvements de stock dans la BDD
   * @return La liste des mouvements de stock / liste vide
   */
  MvtStkControllerFindAllGETResponse(): __Observable<__StrictHttpResponse<Array<MvtStkDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/mvtstk/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<MvtStkDto>>;
      })
    );
  }
  /**
   * Renvoie la liste des mouvements de stock
   *
   * Cette methode permet de rechercher toutes les mouvements de stock dans la BDD
   * @return La liste des mouvements de stock / liste vide
   */
  MvtStkControllerFindAllGET(): __Observable<Array<MvtStkDto>> {
    return this.MvtStkControllerFindAllGETResponse().pipe(
      __map(_r => _r.body as Array<MvtStkDto>)
    );
  }

  /**
   * @return successful operation
   */
  MvtStkControllerCorrectionMvtStkNegPOSTResponse(): __Observable<__StrictHttpResponse<MvtStkDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/gestiondestock/v1/mvtstk/correction-neg`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<MvtStkDto>;
      })
    );
  }
  /**
   * @return successful operation
   */
  MvtStkControllerCorrectionMvtStkNegPOST(): __Observable<MvtStkDto> {
    return this.MvtStkControllerCorrectionMvtStkNegPOSTResponse().pipe(
      __map(_r => _r.body as MvtStkDto)
    );
  }

  /**
   * Rechercher une liste mouvements de stock
   *
   * Cette methode permet de rechercher une liste dd mouvements de stock par date
   * @return L'objet mouvements de stock a ete trouver dans la BDD
   */
  MvtStkControllerFindMvtStkByDateMvtGETResponse(dateMvtStk?: string): __Observable<__StrictHttpResponse<Array<MvtStkDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/mvtstk/date/${encodeURIComponent(String(dateMvtStk))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<MvtStkDto>>;
      })
    );
  }
  /**
   * Rechercher une liste mouvements de stock
   *
   * Cette methode permet de rechercher une liste dd mouvements de stock par date
   * @return L'objet mouvements de stock a ete trouver dans la BDD
   */
  MvtStkControllerFindMvtStkByDateMvtGET(dateMvtStk?: string): __Observable<Array<MvtStkDto>> {
    return this.MvtStkControllerFindMvtStkByDateMvtGETResponse(dateMvtStk).pipe(
      __map(_r => _r.body as Array<MvtStkDto>)
    );
  }

  /**
   * @return successful operation
   */
  MvtStkControllerEntreMvtStkPOSTResponse(): __Observable<__StrictHttpResponse<MvtStkDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/gestiondestock/v1/mvtstk/entre`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<MvtStkDto>;
      })
    );
  }
  /**
   * @return successful operation
   */
  MvtStkControllerEntreMvtStkPOST(): __Observable<MvtStkDto> {
    return this.MvtStkControllerEntreMvtStkPOSTResponse().pipe(
      __map(_r => _r.body as MvtStkDto)
    );
  }

  /**
   * @return successful operation
   */
  MvtStkControllerMvtStkArticleGETResponse(idArticle?: string): __Observable<__StrictHttpResponse<Array<MvtStkDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/mvtstk/filter/article/${encodeURIComponent(String(idArticle))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<MvtStkDto>>;
      })
    );
  }
  /**
   * @return successful operation
   */
  MvtStkControllerMvtStkArticleGET(idArticle?: string): __Observable<Array<MvtStkDto>> {
    return this.MvtStkControllerMvtStkArticleGETResponse(idArticle).pipe(
      __map(_r => _r.body as Array<MvtStkDto>)
    );
  }

  /**
   * Enregistrement d'un mouvement de stock
   *
   * Cette methode permet d'enregidtre ou de modifier un mouvement de stock
   * @return L'objet mouvement de stock fournisseur creer ou modifier
   */
  MvtStkControllerSavePOSTResponse(): __Observable<__StrictHttpResponse<MvtStkDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/gestiondestock/v1/mvtstk/save`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<MvtStkDto>;
      })
    );
  }
  /**
   * Enregistrement d'un mouvement de stock
   *
   * Cette methode permet d'enregidtre ou de modifier un mouvement de stock
   * @return L'objet mouvement de stock fournisseur creer ou modifier
   */
  MvtStkControllerSavePOST(): __Observable<MvtStkDto> {
    return this.MvtStkControllerSavePOSTResponse().pipe(
      __map(_r => _r.body as MvtStkDto)
    );
  }

  /**
   * @return successful operation
   */
  MvtStkControllerSortieMvtStkPOSTResponse(): __Observable<__StrictHttpResponse<MvtStkDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/gestiondestock/v1/mvtstk/sortie`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<MvtStkDto>;
      })
    );
  }
  /**
   * @return successful operation
   */
  MvtStkControllerSortieMvtStkPOST(): __Observable<MvtStkDto> {
    return this.MvtStkControllerSortieMvtStkPOSTResponse().pipe(
      __map(_r => _r.body as MvtStkDto)
    );
  }

  /**
   * Rechercher un mouvement de stock
   *
   * Cette methode permet de rechercher un mouvement de stock par son ID
   * @return L'objet commande fournisseur a ete trouver dans la BDD
   */
  MvtStkControllerFindByIdGETResponse(idMvtstk?: string): __Observable<__StrictHttpResponse<MvtStkDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/mvtstk/${encodeURIComponent(String(idMvtstk))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<MvtStkDto>;
      })
    );
  }
  /**
   * Rechercher un mouvement de stock
   *
   * Cette methode permet de rechercher un mouvement de stock par son ID
   * @return L'objet commande fournisseur a ete trouver dans la BDD
   */
  MvtStkControllerFindByIdGET(idMvtstk?: string): __Observable<MvtStkDto> {
    return this.MvtStkControllerFindByIdGETResponse(idMvtstk).pipe(
      __map(_r => _r.body as MvtStkDto)
    );
  }

  /**
   * @return successful operation
   */
  PhotoControllerSavePhotoPOSTResponse(id?: string,title?: string,context?: string): __Observable<__StrictHttpResponse<{}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `/gestiondestock/v1/photos/${encodeURIComponent(String(id))}/${encodeURIComponent(String(title))}/${encodeURIComponent(String(context))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<{}>;
      })
    );
  }
  /**
   * @return successful operation
   */
  PhotoControllerSavePhotoPOST(id?: string,title?: string,context?: string): __Observable<{}> {
    return this.PhotoControllerSavePhotoPOSTResponse(id, title, context).pipe(
      __map(_r => _r.body as {})
    );
  }

  /**
   * Supprimer un utilisateur
   *
   * Cette methode permet de supprimer un utilisateur par son ID
   */
  UtilisateurControllerDeleteDELETEResponse(idUtilisateur?: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/gestiondestock/v1/utilisateur/detele/${encodeURIComponent(String(idUtilisateur))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * Supprimer un utilisateur
   *
   * Cette methode permet de supprimer un utilisateur par son ID
   */
  UtilisateurControllerDeleteDELETE(idUtilisateur?: string): __Observable<null> {
    return this.UtilisateurControllerDeleteDELETEResponse(idUtilisateur).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * Rechercher un utilisateur
   *
   * Cette methode permet de rechercher une utilisateur par son email
   * @return L'objet utilisateur a ete trouver dans la BDD
   */
  UtilisateurControllerFindByEmailUtilisateurGETResponse(emailUtilisateur?: string): __Observable<__StrictHttpResponse<UtilisateurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/utilisateur/email/${encodeURIComponent(String(emailUtilisateur))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UtilisateurDto>;
      })
    );
  }
  /**
   * Rechercher un utilisateur
   *
   * Cette methode permet de rechercher une utilisateur par son email
   * @return L'objet utilisateur a ete trouver dans la BDD
   */
  UtilisateurControllerFindByEmailUtilisateurGET(emailUtilisateur?: string): __Observable<UtilisateurDto> {
    return this.UtilisateurControllerFindByEmailUtilisateurGETResponse(emailUtilisateur).pipe(
      __map(_r => _r.body as UtilisateurDto)
    );
  }

  /**
   * Rechercher un utilisateur
   *
   * Cette methode permet de rechercher un utilisateur par son ID
   * @return L'objet utilisateur a ete trouver dans la BDD
   */
  UtilisateurControllerFindByIdGETResponse(idUtilisateur?: string): __Observable<__StrictHttpResponse<UtilisateurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/utilisateur/${encodeURIComponent(String(idUtilisateur))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<UtilisateurDto>;
      })
    );
  }
  /**
   * Rechercher un utilisateur
   *
   * Cette methode permet de rechercher un utilisateur par son ID
   * @return L'objet utilisateur a ete trouver dans la BDD
   */
  UtilisateurControllerFindByIdGET(idUtilisateur?: string): __Observable<UtilisateurDto> {
    return this.UtilisateurControllerFindByIdGETResponse(idUtilisateur).pipe(
      __map(_r => _r.body as UtilisateurDto)
    );
  }

  /**
   * Renvoie la liste des ventes
   *
   * Cette methode permet de rechercher toutes les ventes dans la BDD
   * @return La liste des ventes / liste vide
   */
  VenteControllerFindAllGETResponse(): __Observable<__StrictHttpResponse<Array<VenteDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/vente/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<VenteDto>>;
      })
    );
  }
  /**
   * Renvoie la liste des ventes
   *
   * Cette methode permet de rechercher toutes les ventes dans la BDD
   * @return La liste des ventes / liste vide
   */
  VenteControllerFindAllGET(): __Observable<Array<VenteDto>> {
    return this.VenteControllerFindAllGETResponse().pipe(
      __map(_r => _r.body as Array<VenteDto>)
    );
  }

  /**
   * Rechercher une vente
   *
   * Cette methode permet de rechercher une vente par son code
   * @return L'objet vente a ete trouver dans la BDD
   */
  VenteControllerFindByCodeVenteGETResponse(codeVente?: string): __Observable<__StrictHttpResponse<VenteDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/vente/code/${encodeURIComponent(String(codeVente))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<VenteDto>;
      })
    );
  }
  /**
   * Rechercher une vente
   *
   * Cette methode permet de rechercher une vente par son code
   * @return L'objet vente a ete trouver dans la BDD
   */
  VenteControllerFindByCodeVenteGET(codeVente?: string): __Observable<VenteDto> {
    return this.VenteControllerFindByCodeVenteGETResponse(codeVente).pipe(
      __map(_r => _r.body as VenteDto)
    );
  }

  /**
   * Supprimer une vente
   *
   * Cette methode permet de supprimer un article par son ID
   */
  VenteControllerDeleteDELETEResponse(idVente?: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `/gestiondestock/v1/vente/detele/${encodeURIComponent(String(idVente))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<null>;
      })
    );
  }
  /**
   * Supprimer une vente
   *
   * Cette methode permet de supprimer un article par son ID
   */
  VenteControllerDeleteDELETE(idVente?: string): __Observable<null> {
    return this.VenteControllerDeleteDELETEResponse(idVente).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * Rechercher une vente
   *
   * Cette methode permet de rechercher une vente par son ID
   * @return L'objet vente a ete trouver dans la BDD
   */
  VenteControllerFindByIdGETResponse(idVente?: string): __Observable<__StrictHttpResponse<VenteDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `/gestiondestock/v1/vente/${encodeURIComponent(String(idVente))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<VenteDto>;
      })
    );
  }
  /**
   * Rechercher une vente
   *
   * Cette methode permet de rechercher une vente par son ID
   * @return L'objet vente a ete trouver dans la BDD
   */
  VenteControllerFindByIdGET(idVente?: string): __Observable<VenteDto> {
    return this.VenteControllerFindByIdGETResponse(idVente).pipe(
      __map(_r => _r.body as VenteDto)
    );
  }
}

module ApiService {
}

export { ApiService }
