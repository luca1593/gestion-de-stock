/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';
import { EntrepriseDto } from '../models/entreprise-dto';
@Injectable({
  providedIn: 'root',
})
class EntrepriseService extends __BaseService {
  static readonly EntrepriseApiFindAllGETPath = 'gestiondestock/v1/entreprise/all';
  static readonly EntrepriseApiFindByEmailEntrepriseGETPath = 'gestiondestock/v1/entreprise/email/{emailEntreprise}';
  static readonly EntrepriseApiSavePOSTPath = 'gestiondestock/v1/entreprise/create';
  static readonly EntrepriseApiDeleteDELETEPath = 'gestiondestock/v1/entreprise/delete{idEntreprise}';
  static readonly EntrepriseApiFindByNomEntrepriseGETPath = 'gestiondestock/v1/entreprise/nom{nomEntreprise}';
  static readonly EntrepriseApiFindByIdGETPath = 'gestiondestock/v1/entreprise/{idEntreprise}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Renvoie la liste des entreprises
   *
   * Cette methode permet de rechercher toutes les entreprises dans la BDD
   * @return La liste des clients / liste vide
   */
   EntrepriseApiFindAllGETResponse(): __Observable<__StrictHttpResponse<Array<EntrepriseDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/entreprise/all`,
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
  EntrepriseApiFindAllGET(): __Observable<Array<EntrepriseDto>> {
    return this.EntrepriseApiFindAllGETResponse().pipe(
      __map(_r => _r.body as Array<EntrepriseDto>)
    );
  }

  /**
   * Rechercher un entreprise
   *
   * Cette methode permet de rechercher une entreprise par son email
   * @param emailEntreprise undefined
   * @return L'objet entreprise a ete trouver dans la BDD
   */
  EntrepriseApiFindByEmailEntrepriseGETResponse(emailEntreprise: string): __Observable<__StrictHttpResponse<EntrepriseDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/entreprise/email/${encodeURIComponent(String(emailEntreprise))}`,
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
   * Cette methode permet de rechercher une entreprise par son email
   * @param emailEntreprise undefined
   * @return L'objet entreprise a ete trouver dans la BDD
   */
 ApiFindByEmailEntrepriseGET(emailEntreprise: string): __Observable<EntrepriseDto> {
    return this.EntrepriseApiFindByEmailEntrepriseGETResponse(emailEntreprise).pipe(
      __map(_r => _r.body as EntrepriseDto)
    );
  }

 /**
   * Enregistrement d'une entreprise
   *
   * Cette methode permet d'enregidtre ou de modifier une entreprise
   * @return L'objet client creer ou modifier
   */
  EntrepriseApiSavePOSTResponse(body?: EntrepriseDto): __Observable<__StrictHttpResponse<EntrepriseDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `gestiondestock/v1/entreprise/create`,
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
  EntrepriseApiSavePOST(body?: EntrepriseDto): __Observable<EntrepriseDto> {
    return this.EntrepriseApiSavePOSTResponse(body).pipe(
      __map(_r => _r.body as EntrepriseDto)
    );
  }

  /**
   * Supprimer un entreprise
   *
   * Cette methode permet de supprimer une entreprise par son ID
   */
   EntrepriseApiDeleteDELETEResponse(idEntreprise: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `gestiondestock/v1/entreprise/delete${encodeURIComponent(String(idEntreprise))}`,
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
  EntrepriseApiDeleteDELETE(idEntreprise: number): __Observable<null> {
    return this.EntrepriseApiDeleteDELETEResponse(idEntreprise).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * Rechercher un entreprise
   *
   * Cette methode permet de rechercher une entreprise par son nom
   * @return L'objet entreprise a ete trouver dans la BDD
   */
   EntrepriseApiFindByNomEntrepriseGETResponse(nomEntreprise?: string): __Observable<__StrictHttpResponse<EntrepriseDto>> {
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
  EntrepriseApiFindByNomEntrepriseGET(nomEntreprise?: string): __Observable<EntrepriseDto> {
    return this.EntrepriseApiFindByNomEntrepriseGETResponse(nomEntreprise).pipe(
      __map(_r => _r.body as EntrepriseDto)
    );
  }

  /**
   * Rechercher un entreprise
   *
   * Cette methode permet de rechercher un entreprise par son ID
   * @return L'objet entreprise a ete trouver dans la BDD
   */
  EntrepriseApiFindByIdGETResponse(idEntreprise?: string): __Observable<__StrictHttpResponse<EntrepriseDto>> {
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
  EntrepriseApiFindByIdGET(idEntreprise?: string): __Observable<EntrepriseDto> {
    return this.EntrepriseApiFindByIdGETResponse(idEntreprise).pipe(
      __map(_r => _r.body as EntrepriseDto)
    );
  }
}

module EntrepriseService {}

export { EntrepriseService }