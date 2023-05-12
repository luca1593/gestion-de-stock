/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { ClientDto } from '../models/client-dto';
@Injectable({
  providedIn: 'root',
})
class ClientService extends __BaseService {
  static readonly FindAllPath = 'gestiondestock/v1/client/all';
  static readonly DeleteDELETEPath = 'gestiondestock/v1/client/detele/{idClient}';
  static readonly FindbyEmailClientPath = 'gestiondestock/v1/client/email/{emailClient}';
  static readonly FindbyNomClientPath = 'gestiondestock/v1/client/nom/{nomClient}';
  static readonly SavePOSTPath = 'gestiondestock/v1/client/save';
  static readonly FindByIdPath = 'gestiondestock/v1/client/{idClient}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Rechercher un client
   *
   * Cette methode permet de rechercher un client par son nom
   * @return L'objet client a ete trouver dans la BDD
   */
   FindbyNomClientResponse(nomClient?: string): __Observable<__StrictHttpResponse<ClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      '',
      this.rootUrl + `gestiondestock/v1/client/nom/${encodeURIComponent(String(nomClient))}`,
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
  FindbyNomClient(nomClient?: string): __Observable<ClientDto> {
    return this.FindbyNomClientResponse(nomClient).pipe(
      __map(_r => _r.body as ClientDto)
    );
  }

  /**
   * Enregistrement d'un client
   *
   * Cette methode permet d'enregidtre ou de modifier un client
   * @return L'objet client creer ou modifier
   */
  SaveResponse(body?: ClientDto): __Observable<__StrictHttpResponse<ClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `gestiondestock/v1/client/save`,
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
  SavePOST(body?: ClientDto): __Observable<ClientDto> {
    return this.SaveResponse(body).pipe(
      __map(_r => _r.body as ClientDto)
    );
  }

  /**
   * Rechercher un client
   *
   * Cette methode permet de rechercher un client par son ID
   * @return L'objet client a ete trouver dans la BDD
   */
  FindByIdResponse(idClient?: number): __Observable<__StrictHttpResponse<ClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/client/${encodeURIComponent(String(idClient))}`,
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
  FindById(idClient?: number): __Observable<ClientDto> {
    return this.FindByIdResponse(idClient).pipe(
      __map(_r => _r.body as ClientDto)
    );
  }

  /**
   * Renvoie la liste des clients
   *
   * Cette methode permet de rechercher toutes les clients dans la BDD
   * @return La liste des clients / liste vide
   */
  FindAllResponse(): __Observable<__StrictHttpResponse<Array<ClientDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/client/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<ClientDto>>;
      })
    );
  }
  /**
   * Renvoie la liste des clients
   *
   * Cette methode permet de rechercher toutes les clients dans la BDD
   * @return La liste des clients / liste vide
   */
  FindAll(): __Observable<Array<ClientDto>> {
    return this.FindAllResponse().pipe(
      __map(_r => _r.body as Array<ClientDto>)
    );
  }

  /**
   * Supprimer un client
   *
   * Cette methode permet de supprimer un client par son ID
   * @param idClient undefined
   */
  DeleteDELETEResponse(idClient: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `gestiondestock/v1/client/detele/${encodeURIComponent(String(idClient))}`,
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
   * Supprimer un client
   *
   * Cette methode permet de supprimer un client par son ID
   * @param idClient undefined
   */
  DeleteDELETE(idClient: number): __Observable<null> {
    return this.DeleteDELETEResponse(idClient).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * Rechercher un client
   *
   * Cette methode permet de rechercher un client par son email
   * @param emailClient undefined
   * @return L'objet client a ete trouver dans la BDD
   */
  FindbyEmailClientResponse(emailClient: string): __Observable<__StrictHttpResponse<ClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/client/email/${encodeURIComponent(String(emailClient))}`,
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
   * Cette methode permet de rechercher un client par son email
   * @param emailClient undefined
   * @return L'objet client a ete trouver dans la BDD
   */
  FindbyEmailClient(emailClient: string): __Observable<ClientDto> {
    return this.FindbyEmailClientResponse(emailClient).pipe(
      __map(_r => _r.body as ClientDto)
    );
  }
}

module ClientService {
}

export { ClientService }
