/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { FournisseurDto } from '../models/fournisseur-dto';
@Injectable({
  providedIn: 'root',
})
class FournisseurService extends __BaseService {
  static readonly FournisseurApiFindAllGETPath = 'gestiondestock/v1/fournisseur/all';
  static readonly FournisseurApiSavePOSTPath = 'gestiondestock/v1/fournisseur/create';
  static readonly FournisseurApiFindByEmailFournisseurGETPath = 'gestiondestock/v1/fournisseur/email/{emailFournisseur}';
  static readonly FournisseurApiFindByIdGETPath = 'gestiondestock/v1/fournisseur/{idFournisseur}';

  static readonly FournisseurApiDeleteDELETEPath = 'gestiondestock/v1/fournisseur/detele/{idFournisseur}';
  static readonly FournisseurApiFindByNomFournisseurGETPath = 'gestiondestock/v1/fournisseur/nom/{nomFournisseur}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Renvoie la liste des fournisseurs
   *
   * Cette methode permet de rechercher toutes les fournisseurs dans la BDD
   * @return La liste des clients / liste vide
   */
  FournisseurApiFindAllGETResponse(): __Observable<__StrictHttpResponse<Array<FournisseurDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/fournisseur/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<FournisseurDto>>;
      })
    );
  }
  /**
   * Renvoie la liste des fournisseurs
   *
   * Cette methode permet de rechercher toutes les fournisseurs dans la BDD
   * @return La liste des clients / liste vide
   */
  FournisseurApiFindAllGET(): __Observable<Array<FournisseurDto>> {
    return this.FournisseurApiFindAllGETResponse().pipe(
      __map(_r => _r.body as Array<FournisseurDto>)
    );
  }

  /**
   * Enregistrement d'un fournisseur
   *
   * Cette methode permet d'enregidtre ou de modifier un fournisseur
   * @param body undefined
   * @return L'objet fournisseur creer ou modifier
   */
  FournisseurApiSavePOSTResponse(body?: FournisseurDto): __Observable<__StrictHttpResponse<FournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `gestiondestock/v1/fournisseur/create`,
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
   * Enregistrement d'un fournisseur
   *
   * Cette methode permet d'enregidtre ou de modifier un fournisseur
   * @param body undefined
   * @return L'objet fournisseur creer ou modifier
   */
  FournisseurApiSavePOST(body?: FournisseurDto): __Observable<FournisseurDto> {
    return this.FournisseurApiSavePOSTResponse(body).pipe(
      __map(_r => _r.body as FournisseurDto)
    );
  }

  /**
   * Rechercher un fournisseur
   *
   * Cette methode permet de rechercher une fournisseur par son email
   * @param emailFournisseur undefined
   * @return L'objet fournisseur a ete trouver dans la BDD
   */
  FournisseurApiFindByEmailFournisseurGETResponse(emailFournisseur: string): __Observable<__StrictHttpResponse<FournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/fournisseur/email/${encodeURIComponent(String(emailFournisseur))}`,
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
   * Cette methode permet de rechercher une fournisseur par son email
   * @param emailFournisseur undefined
   * @return L'objet fournisseur a ete trouver dans la BDD
   */
  FournisseurApiFindByEmailFournisseurGET(emailFournisseur: string): __Observable<FournisseurDto> {
    return this.FournisseurApiFindByEmailFournisseurGETResponse(emailFournisseur).pipe(
      __map(_r => _r.body as FournisseurDto)
    );
  }

  /**
   * Rechercher un fournisseur
   *
   * Cette methode permet de rechercher un fournisseur par son ID
   * @param idFournisseur undefined
   * @return L'objet fournisseur a ete trouver dans la BDD
   */
  FournisseurApiFindByIdGETResponse(idFournisseur: number): __Observable<__StrictHttpResponse<FournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/fournisseur/${encodeURIComponent(String(idFournisseur))}`,
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
   * Cette methode permet de rechercher un fournisseur par son ID
   * @param idFournisseur undefined
   * @return L'objet fournisseur a ete trouver dans la BDD
   */
  FournisseurApiFindByIdGET(idFournisseur: number): __Observable<FournisseurDto> {
    return this.FournisseurApiFindByIdGETResponse(idFournisseur).pipe(
      __map(_r => _r.body as FournisseurDto)
    );
  }

   /**
   * Supprimer un fournisseur
   *
   * Cette methode permet de supprimer un fournisseur par son ID
   */
    FournisseurApiDeleteDELETEResponse(idFournisseur?: number): __Observable<__StrictHttpResponse<null>> {
      let __params = this.newParams();
      let __headers = new HttpHeaders();
      let __body: any = null;
      let req = new HttpRequest<any>(
        'DELETE',
        this.rootUrl + `gestiondestock/v1/fournisseur/detele/${encodeURIComponent(String(idFournisseur))}`,
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
    FournisseurApiDeleteDELETE(idFournisseur?: number): __Observable<null> {
      return this.FournisseurApiDeleteDELETEResponse(idFournisseur).pipe(
        __map(_r => _r.body as null)
      );
    }
  
    /**
     * Rechercher un fournisseur
     *
     * Cette methode permet de rechercher un fournisseur par son nom
     * @return L'objet fournisseur a ete trouver dans la BDD
     */
    FournisseurApiFindByNomFournisseurGETResponse(nomFournisseur?: string): __Observable<__StrictHttpResponse<FournisseurDto>> {
      let __params = this.newParams();
      let __headers = new HttpHeaders();
      let __body: any = null;
      let req = new HttpRequest<any>(
        'GET',
        this.rootUrl + `gestiondestock/v1/fournisseur/nom/${encodeURIComponent(String(nomFournisseur))}`,
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
    FournisseurApiFindByNomFournisseurGET(nomFournisseur?: string): __Observable<FournisseurDto> {
      return this.FournisseurApiFindByNomFournisseurGETResponse(nomFournisseur).pipe(
        __map(_r => _r.body as FournisseurDto)
      );
    }

}

module FournisseurService {
}

export { FournisseurService }
