import { LigneVenteDto } from './../models/ligne-vente-dto';
/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { VenteDto } from '../models/vente-dto';
@Injectable({
  providedIn: 'root',
})
class VenteService extends __BaseService {
  static readonly VenteApiFindByDateVenteGETPath = 'gestiondestock/v1/vente/date/{dateVente}';
  static readonly VenteApiSavePOSTPath = 'gestiondestock/v1/vente/save';

  static readonly VenteApiFindAllGETPath = 'gestiondestock/v1/vente/all';
  static readonly VenteApiFindByCodeVenteGETPath = 'gestiondestock/v1/vente/code/{codeVente}';
  static readonly VenteApiDeleteDELETEPath = 'gestiondestock/v1/vente/detele/{idVente}';
  static readonly VenteApiFindByIdGETPath = 'gestiondestock/v1/vente/{idVente}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Rechercher liste des ventes par date
   *
   * Cette methode permet de rechercher liste des ventes par date
   * @param dateVente undefined
   * @return Aucune vente n'a ete trouver dans la BDD
   */
  VenteApiFindByDateVenteGETResponse(dateVente: number): __Observable<__StrictHttpResponse<Array<VenteDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/vente/date/${encodeURIComponent(String(dateVente))}`,
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
   * Rechercher liste des ventes par date
   *
   * Cette methode permet de rechercher liste des ventes par date
   * @param dateVente undefined
   * @return Aucune vente n'a ete trouver dans la BDD
   */
  VenteApiFindByDateVenteGET(dateVente: number): __Observable<Array<VenteDto>> {
    return this.VenteApiFindByDateVenteGETResponse(dateVente).pipe(
      __map(_r => _r.body as Array<VenteDto>)
    );
  }

  /**
   * Enregistrement d'une vente
   *
   * Cette methode permet d'enregidtre ou de modifier une vente
   * @param body undefined
   * @return L'objet vente creer ou modifier
   */
  VenteApiSavePOSTResponse(body?: VenteDto): __Observable<__StrictHttpResponse<VenteDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `gestiondestock/v1/vente/save`,
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
   * Enregistrement d'une vente
   *
   * Cette methode permet d'enregidtre ou de modifier une vente
   * @param body undefined
   * @return L'objet vente creer ou modifier
   */
  VenteApiSavePOST(body?: VenteDto): __Observable<VenteDto> {
    return this.VenteApiSavePOSTResponse(body).pipe(
      __map(_r => _r.body as VenteDto)
    );
  }

  /**
   * Renvoie la liste des ventes
   *
   * Cette methode permet de rechercher toutes les ventes dans la BDD
   * @return La liste des ventes / liste vide
   */
   VenteApiFindAllGETResponse(): __Observable<__StrictHttpResponse<Array<VenteDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/vente/all`,
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
  VenteApiFindAllGET(): __Observable<Array<VenteDto>> {
    return this.VenteApiFindAllGETResponse().pipe(
      __map(_r => _r.body as Array<VenteDto>)
    );
  }

  /**
   * Rechercher une vente
   *
   * Cette methode permet de rechercher une vente par son code
   * @return L'objet vente a ete trouver dans la BDD
   */
  VenteApiFindByCodeVenteGETResponse(codeVente?: string): __Observable<__StrictHttpResponse<VenteDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/vente/code/${encodeURIComponent(String(codeVente))}`,
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
  VenteApiFindByCodeVenteGET(codeVente?: string): __Observable<VenteDto> {
    return this.VenteApiFindByCodeVenteGETResponse(codeVente).pipe(
      __map(_r => _r.body as VenteDto)
    );
  }

  /**
   * Supprimer une vente
   *
   * Cette methode permet de supprimer un article par son ID
   */
  VenteApiDeleteDELETEResponse(idVente?: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `gestiondestock/v1/vente/detele/${encodeURIComponent(String(idVente))}`,
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
  VenteApiDeleteDELETE(idVente?: string): __Observable<null> {
    return this.VenteApiDeleteDELETEResponse(idVente).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * Rechercher une vente
   *
   * Cette methode permet de rechercher une vente par son ID
   * @return L'objet vente a ete trouver dans la BDD
   */
  VenteApiFindByIdGETResponse(idVente?: string): __Observable<__StrictHttpResponse<VenteDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/vente/${encodeURIComponent(String(idVente))}`,
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
  VenteApiFindByIdGET(idVente?: string): __Observable<VenteDto> {
    return this.VenteApiFindByIdGETResponse(idVente).pipe(
      __map(_r => _r.body as VenteDto)
    );
  }

  /**
   * Recherche de la liste des lignes de vente
   *
   * Cette methode permet de rechercher la liste des lignes de vente par son id
   * @return Liste des lignes de vente ete trouver avec success  Array<LigneVenteDto>
   */
  findAllLigneVenteByVenteResponse(idVente?: number): __Observable<__StrictHttpResponse<Array<LigneVenteDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/vente/list/ligne-vente/${encodeURIComponent(String(idVente))}`,
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
   * Recherche de la liste des lignes de vente
   *
   * Cette methode permet de rechercher la liste des lignes de vente par son id
   * @return Liste des lignes de vente a ete trouver avec success
   */
  findAllLigneVenteByVente(idVente?: number): __Observable<Array<LigneVenteDto>> {
    return this.findAllLigneVenteByVenteResponse(idVente).pipe(
      __map(_r => _r.body as Array<LigneVenteDto>)
    );
  }

}

module VenteService {
}

export { VenteService }
