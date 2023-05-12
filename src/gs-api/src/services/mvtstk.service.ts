/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { MvtStkDto } from '../models/mvt-stk-dto';
@Injectable({
  providedIn: 'root',
})
class MvtstkService extends __BaseService {
  static readonly MvtStkApiCorrectionMvtStkPosPOSTPath = 'gestiondestock/v1/mvtstk/correction-pos';
  static readonly MvtStkApiDeleteDELETEPath = 'gestiondestock/v1/mvtstk/detele/{typeMvt}';
  static readonly MvtStkApiStockReelArticleGETPath = 'gestiondestock/v1/mvtstk/stockreel/{idArticle}';
  static readonly MvtStkApiFindMvtStkByTypeGETPath = 'gestiondestock/v1/mvtstk/type/{typeMvt}';

  static readonly MvtStkApiFindAllGETPath = 'gestiondestock/v1/mvtstk/all';
  static readonly MvtStkApiCorrectionMvtStkNegPOSTPath = 'gestiondestock/v1/mvtstk/correction-neg';
  static readonly MvtStkApiFindMvtStkByDateMvtGETPath = 'gestiondestock/v1/mvtstk/date/{dateMvtStk}';
  static readonly MvtStkApiEntreMvtStkPOSTPath = 'gestiondestock/v1/mvtstk/entre';
  static readonly MvtStkApiMvtStkArticleGETPath = 'gestiondestock/v1/mvtstk/filter/article/{idArticle}';
  static readonly MvtStkApiSavePOSTPath = 'gestiondestock/v1/mvtstk/save';
  static readonly MvtStkApiSortieMvtStkPOSTPath = 'gestiondestock/v1/mvtstk/sortie';
  static readonly MvtStkApiFindByIdGETPath = 'gestiondestock/v1/mvtstk/{idMvtstk}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * @param body undefined
   * @return successful operation
   */
  MvtStkApiCorrectionMvtStkPosPOSTResponse(body?: MvtStkDto): __Observable<__StrictHttpResponse<MvtStkDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `gestiondestock/v1/mvtstk/correction-pos`,
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
   * @param body undefined
   * @return successful operation
   */
  MvtStkApiCorrectionMvtStkPosPOST(body?: MvtStkDto): __Observable<MvtStkDto> {
    return this.MvtStkApiCorrectionMvtStkPosPOSTResponse(body).pipe(
      __map(_r => _r.body as MvtStkDto)
    );
  }

  /**
   * Supprimer une commande client
   *
   * Cette methode permet de supprimer un mouvement de stock par son ID
   * @param typeMvt undefined
   */
  MvtStkApiDeleteDELETEResponse(typeMvt: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `gestiondestock/v1/mvtstk/detele/${encodeURIComponent(String(typeMvt))}`,
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
   * Cette methode permet de supprimer un mouvement de stock par son ID
   * @param typeMvt undefined
   */
  MvtStkApiDeleteDELETE(typeMvt: number): __Observable<null> {
    return this.MvtStkApiDeleteDELETEResponse(typeMvt).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @param idArticle undefined
   * @return successful operation
   */
  MvtStkApiStockReelArticleGETResponse(idArticle: number): __Observable<__StrictHttpResponse<number>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/mvtstk/stockreel/${encodeURIComponent(String(idArticle))}`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'text'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return (_r as HttpResponse<any>).clone({ body: parseFloat((_r as HttpResponse<any>).body as string) }) as __StrictHttpResponse<number>
      })
    );
  }
  /**
   * @param idArticle undefined
   * @return successful operation
   */
  MvtStkApiStockReelArticleGET(idArticle: number): __Observable<number> {
    return this.MvtStkApiStockReelArticleGETResponse(idArticle).pipe(
      __map(_r => _r.body as number)
    );
  }

  /**
   * Rechercher liste des mouvements de stock par type
   *
   * Cette methode permet de rechercher liste des mouvements de stock par type
   * @param typeMvt undefined
   * @return Aucun mouvement de stock n'a ete trouver dans la BDD
   */
  MvtStkApiFindMvtStkByTypeGETResponse(typeMvt: string): __Observable<__StrictHttpResponse<Array<MvtStkDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/mvtstk/type/${encodeURIComponent(String(typeMvt))}`,
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
   * Rechercher liste des mouvements de stock par type
   *
   * Cette methode permet de rechercher liste des mouvements de stock par type
   * @param typeMvt undefined
   * @return Aucun mouvement de stock n'a ete trouver dans la BDD
   */
  MvtStkApiFindMvtStkByTypeGET(typeMvt: string): __Observable<Array<MvtStkDto>> {
    return this.MvtStkApiFindMvtStkByTypeGETResponse(typeMvt).pipe(
      __map(_r => _r.body as Array<MvtStkDto>)
    );
  }

  /**
   * Renvoie la liste des mouvements de stock
   *
   * Cette methode permet de rechercher toutes les mouvements de stock dans la BDD
   * @return La liste des mouvements de stock / liste vide
   */
   MvtStkApiFindAllGETResponse(): __Observable<__StrictHttpResponse<Array<MvtStkDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/mvtstk/all`,
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
  MvtStkApiFindAllGET(): __Observable<Array<MvtStkDto>> {
    return this.MvtStkApiFindAllGETResponse().pipe(
      __map(_r => _r.body as Array<MvtStkDto>)
    );
  }

  /**
   * @return successful operation
   */
  MvtStkApiCorrectionMvtStkNegPOSTResponse(): __Observable<__StrictHttpResponse<MvtStkDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `gestiondestock/v1/mvtstk/correction-neg`,
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
  MvtStkApiCorrectionMvtStkNegPOST(): __Observable<MvtStkDto> {
    return this.MvtStkApiCorrectionMvtStkNegPOSTResponse().pipe(
      __map(_r => _r.body as MvtStkDto)
    );
  }

  /**
   * Rechercher une liste mouvements de stock
   *
   * Cette methode permet de rechercher une liste dd mouvements de stock par date
   * @return L'objet mouvements de stock a ete trouver dans la BDD
   */
  MvtStkApiFindMvtStkByDateMvtGETResponse(dateMvtStk?: string): __Observable<__StrictHttpResponse<Array<MvtStkDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/mvtstk/date/${encodeURIComponent(String(dateMvtStk))}`,
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
  MvtStkApiFindMvtStkByDateMvtGET(dateMvtStk?: string): __Observable<Array<MvtStkDto>> {
    return this.MvtStkApiFindMvtStkByDateMvtGETResponse(dateMvtStk).pipe(
      __map(_r => _r.body as Array<MvtStkDto>)
    );
  }

  /**
   * @return successful operation
   */
  MvtStkApiEntreMvtStkPOSTResponse(): __Observable<__StrictHttpResponse<MvtStkDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `gestiondestock/v1/mvtstk/entre`,
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
  MvtStkApiEntreMvtStkPOST(): __Observable<MvtStkDto> {
    return this.MvtStkApiEntreMvtStkPOSTResponse().pipe(
      __map(_r => _r.body as MvtStkDto)
    );
  }

  /**
   * @return successful operation
   */
  MvtStkApiMvtStkArticleGETResponse(idArticle?: number): __Observable<__StrictHttpResponse<Array<MvtStkDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/mvtstk/filter/article/${encodeURIComponent(String(idArticle))}`,
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
  MvtStkApiMvtStkArticleGET(idArticle?: number): __Observable<Array<MvtStkDto>> {
    return this.MvtStkApiMvtStkArticleGETResponse(idArticle).pipe(
      __map(_r => _r.body as Array<MvtStkDto>)
    );
  }

  /**
   * Enregistrement d'un mouvement de stock
   *
   * Cette methode permet d'enregidtre ou de modifier un mouvement de stock
   * @return L'objet mouvement de stock fournisseur creer ou modifier
   */
  MvtStkApiSavePOSTResponse(): __Observable<__StrictHttpResponse<MvtStkDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `gestiondestock/v1/mvtstk/save`,
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
  MvtStkApiSavePOST(): __Observable<MvtStkDto> {
    return this.MvtStkApiSavePOSTResponse().pipe(
      __map(_r => _r.body as MvtStkDto)
    );
  }

  /**
   * @return successful operation
   */
  MvtStkApiSortieMvtStkPOSTResponse(): __Observable<__StrictHttpResponse<MvtStkDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `gestiondestock/v1/mvtstk/sortie`,
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
  MvtStkApiSortieMvtStkPOST(): __Observable<MvtStkDto> {
    return this.MvtStkApiSortieMvtStkPOSTResponse().pipe(
      __map(_r => _r.body as MvtStkDto)
    );
  }

  /**
   * Rechercher un mouvement de stock
   *
   * Cette methode permet de rechercher un mouvement de stock par son ID
   * @return L'objet commande fournisseur a ete trouver dans la BDD
   */
  MvtStkApiFindByIdGETResponse(idMvtstk?: number): __Observable<__StrictHttpResponse<MvtStkDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/mvtstk/${encodeURIComponent(String(idMvtstk))}`,
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
  MvtStkApiFindByIdGET(idMvtstk?: number): __Observable<MvtStkDto> {
    return this.MvtStkApiFindByIdGETResponse(idMvtstk).pipe(
      __map(_r => _r.body as MvtStkDto)
    );
  }

  /**
   * @return successful operation
   */
  PhotoApiSavePhotoPOSTResponse(id?: string,title?: string,context?: string): __Observable<__StrictHttpResponse<{}>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `gestiondestock/v1/photos/${encodeURIComponent(String(id))}/${encodeURIComponent(String(title))}/${encodeURIComponent(String(context))}`,
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

}

module MvtstkService {
}

export { MvtstkService }
