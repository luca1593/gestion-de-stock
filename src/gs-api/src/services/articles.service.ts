/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { ArticleDto } from '../models/article-dto';
import { LigneCommandeClientDto } from '../models/ligne-commande-client-dto';
import { LigneVenteDto } from '../models/ligne-vente-dto';
import { LigneCommandeFournisseurDto } from '../models/ligne-commande-fournisseur-dto';
@Injectable({
  providedIn: 'root',
})
class ArticlesService extends __BaseService {
  static readonly ArticleApiSavePOSTPath = 'gestiondestock/v1/articles/create';
  static readonly ArticleApiFindAllGETPath = 'gestiondestock/v1/articles/all';
  static readonly ArticleApiFindByCodeArticleGETPath = 'gestiondestock/v1/articles/code/{codeArticle}';
  static readonly ArticleApiFindHistoriqueCommandeClientGETPath = 'gestiondestock/v1/articles/historiques/commande-client/{idArticle}';
  static readonly ArticleApiFindByIdGETPath = 'gestiondestock/v1/articles/{idArticle}';

  static readonly ArticleApiDELETEPath = 'gestiondestock/v1/articles/delete/{idArticle}';
  static readonly ArticleApiFindAllByCategorieGETPath = 'gestiondestock/v1/articles/filtre/category/{idCategore}';
  static readonly ArticleApiFindHistoriqueCommandeFournisseurGETPath = 'gestiondestock/v1/articles/historiques/commande-fournisseur/{idArticle}';
  static readonly ArticleApiFindHistoriqueVenteGETPath = 'gestiondestock/v1/articles/historiques/vente/{idArticle}';

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
   ArticleApiSavePOSTResponse(body?: ArticleDto): __Observable<__StrictHttpResponse<ArticleDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `gestiondestock/v1/articles/create`,
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
  ArticleApiSavePOST(body?: ArticleDto): __Observable<ArticleDto> {
    return this.ArticleApiSavePOSTResponse(body).pipe(
      __map(_r => _r.body as ArticleDto)
    );
  }

  /**
   * Renvoie la liste des articles
   *
   * Cette methode permet de rechercher toutes les articles dans la BDD
   * @return La liste des article / liste vide
   */
  ArticleApiFindAllGETResponse(): __Observable<__StrictHttpResponse<Array<ArticleDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/articles/all`,
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
   * Renvoie la liste des articles
   *
   * Cette methode permet de rechercher toutes les articles dans la BDD
   * @return La liste des article / liste vide
   */
  ArticleApiFindAllGET(): __Observable<Array<ArticleDto>> {
    return this.ArticleApiFindAllGETResponse().pipe(
      __map(_r => _r.body as Array<ArticleDto>)
    );
  }

  /**
   * Rechercher un article
   *
   * Cette methode permet de rechercher un article par son code
   * @param codeArticle undefined
   * @return L'objet article a ete trouver dans la BDD
   */
  ArticleApiFindByCodeArticleGETResponse(codeArticle: string): __Observable<__StrictHttpResponse<ArticleDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/articles/code/${encodeURIComponent(String(codeArticle))}`,
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
   * Rechercher un article
   *
   * Cette methode permet de rechercher un article par son code
   * @param codeArticle undefined
   * @return L'objet article a ete trouver dans la BDD
   */
  ArticleApiFindByCodeArticleGET(codeArticle: string): __Observable<ArticleDto> {
    return this.ArticleApiFindByCodeArticleGETResponse(codeArticle).pipe(
      __map(_r => _r.body as ArticleDto)
    );
  }

  /**
   * @param idArticle undefined
   * @return successful operation
   */
  ArticleApiFindHistoriqueCommandeClientGETResponse(idArticle: number): __Observable<__StrictHttpResponse<Array<LigneCommandeClientDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/articles/historiques/commande-client/${encodeURIComponent(String(idArticle))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<LigneCommandeClientDto>>;
      })
    );
  }
  /**
   * @param idArticle undefined
   * @return successful operation
   */
  ArticleApiFindHistoriqueCommandeClientGET(idArticle: number): __Observable<Array<LigneCommandeClientDto>> {
    return this.ArticleApiFindHistoriqueCommandeClientGETResponse(idArticle).pipe(
      __map(_r => _r.body as Array<LigneCommandeClientDto>)
    );
  }

  /**
   * Rechercher un article
   *
   * Cette methode permet de rechercher un article par son ID
   * @param idArticle undefined
   * @return L'objet article a ete trouver dans la BDD
   */
  ArticleApiFindByIdGETResponse(idArticle: number): __Observable<__StrictHttpResponse<ArticleDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/articles/${encodeURIComponent(String(idArticle))}`,
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
   * Rechercher un article
   *
   * Cette methode permet de rechercher un article par son ID
   * @param idArticle undefined
   * @return L'objet article a ete trouver dans la BDD
   */
  ArticleApiFindByIdGET(idArticle: number): __Observable<ArticleDto> {
    return this.ArticleApiFindByIdGETResponse(idArticle).pipe(
      __map(_r => _r.body as ArticleDto)
    );
  }

  /**
   * Supprimer un article
   *
   * Cette methode permet de supprimer un article par son ID
   */
   ArticleApiDELETEResponse(idArticle: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `gestiondestock/v1/articles/delete/${encodeURIComponent(String(idArticle))}`,
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
  ArticleApiDELETE(idArticle: number): __Observable<null> {
    return this.ArticleApiDELETEResponse(idArticle).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @return successful operation
   */
  ArticleApiFindAllByCategorieGETResponse(idCategory?: string): __Observable<__StrictHttpResponse<Array<ArticleDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/articles/filtre/category/${encodeURIComponent(String(idCategory))}`,
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
  ArticleApiFindAllByCategorieGET(idCategory?: string): __Observable<Array<ArticleDto>> {
    return this.ArticleApiFindAllByCategorieGETResponse(idCategory).pipe(
      __map(_r => _r.body as Array<ArticleDto>)
    );
  }

  /**
   * @return successful operation
   */
  ArticleApiFindHistoriqueCommandeFournisseurGETResponse(idArticle?: string): __Observable<__StrictHttpResponse<Array<LigneCommandeFournisseurDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/articles/historiques/commande-fournisseur/${encodeURIComponent(String(idArticle))}`,
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
  ArticleApiFindHistoriqueCommandeFournisseurGET(idArticle?: string): __Observable<Array<LigneCommandeFournisseurDto>> {
    return this.ArticleApiFindHistoriqueCommandeFournisseurGETResponse(idArticle).pipe(
      __map(_r => _r.body as Array<LigneCommandeFournisseurDto>)
    );
  }

  /**
   * @return successful operation
   */
  ArticleApiFindHistoriqueVenteGETResponse(idArticle?: string): __Observable<__StrictHttpResponse<Array<LigneVenteDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/articles/historiques/vente/${encodeURIComponent(String(idArticle))}`,
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
  ArticleApiFindHistoriqueVenteGET(idArticle?: string): __Observable<Array<LigneVenteDto>> {
    return this.ArticleApiFindHistoriqueVenteGETResponse(idArticle).pipe(
      __map(_r => _r.body as Array<LigneVenteDto>)
    );
  }

}

module ArticlesService {
}

export { ArticlesService }
