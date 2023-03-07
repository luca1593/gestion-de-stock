/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { UtilisateurDto } from '../models/utilisateur-dto';
import { ChangerMotDePasseUtilisateurDto } from '../models';
@Injectable({
  providedIn: 'root',
})
class UtilisateurService extends __BaseService {
  static readonly UtilisateurApiFindAllGETPath = 'gestiondestock/v1/utilisateur/all';
  static readonly UtilisateurApiFindByNomUtilisateurGETPath = 'gestiondestock/v1/utilisateur/nom/{nomUtilisateur}';
  static readonly UtilisateurApiSavePOSTPath = 'gestiondestock/v1/utilisateur/save';

  static readonly UtilisateurApiDELETEPath = 'gestiondestock/v1/utilisateur/detele/{idUtilisateur}';
  static readonly UtilisateurApiFindByEmailUtilisateurGETPath = 'gestiondestock/v1/utilisateur/email/{emailUtilisateur}';
  static readonly UtilisateurApiFindByIdGETPath = 'gestiondestock/v1/utilisateur/{idUtilisateur}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Renvoie la liste des utilisateurs
   *
   * Cette methode permet de rechercher toutes les utilisateurs dans la BDD
   * @return La liste des clients / liste vide
   */
  UtilisateurApiFindAllGETResponse(): __Observable<__StrictHttpResponse<Array<UtilisateurDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/utilisateur/all`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });

    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<UtilisateurDto>>;
      })
    );
  }
  /**
   * Renvoie la liste des utilisateurs
   *
   * Cette methode permet de rechercher toutes les utilisateurs dans la BDD
   * @return La liste des clients / liste vide
   */
  UtilisateurApiFindAllGET(): __Observable<Array<UtilisateurDto>> {
    return this.UtilisateurApiFindAllGETResponse().pipe(
      __map(_r => _r.body as Array<UtilisateurDto>)
    );
  }

  /**
   * Rechercher un utilisateur
   *
   * Cette methode permet de rechercher un utilisateur par son nom
   * @param nomUtilisateur undefined
   * @return L'objet utilisateur a ete trouver dans la BDD
   */
  UtilisateurApiFindByNomUtilisateurGETResponse(nomUtilisateur: string): __Observable<__StrictHttpResponse<UtilisateurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/utilisateur/nom/${encodeURIComponent(String(nomUtilisateur))}`,
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
   * Cette methode permet de rechercher un utilisateur par son nom
   * @param nomUtilisateur undefined
   * @return L'objet utilisateur a ete trouver dans la BDD
   */
  UtilisateurApiFindByNomUtilisateurGET(nomUtilisateur: string): __Observable<UtilisateurDto> {
    return this.UtilisateurApiFindByNomUtilisateurGETResponse(nomUtilisateur).pipe(
      __map(_r => _r.body as UtilisateurDto)
    );
  }

  /**
   * Enregistrement d'un utilisateur
   *
   * Cette methode permet d'enregidtre ou de modifier un utilisateur
   * @param body undefined
   * @return L'objet utilisateur creer ou modifier
   */
  UtilisateurApiSavePOSTResponse(body?: UtilisateurDto): __Observable<__StrictHttpResponse<UtilisateurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `gestiondestock/v1/utilisateur/save`,
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
   * Enregistrement d'un utilisateur
   *
   * Cette methode permet d'enregidtre ou de modifier un utilisateur
   * @param body undefined
   * @return L'objet utilisateur creer ou modifier
   */
  UtilisateurApiSavePOST(body?: UtilisateurDto): __Observable<UtilisateurDto> {
    return this.UtilisateurApiSavePOSTResponse(body).pipe(
      __map(_r => _r.body as UtilisateurDto)
    );
  }

  /**
   * Renvoie un profil utilisateur
   *
   * Cette methode permet de changer le mot de passe de l'utilisateurs dans la BDD
   * @param body undefined
   * @return Mot de passe changer avec succes
   */
   changerMotDePassePOSTResponse(body?: ChangerMotDePasseUtilisateurDto): __Observable<__StrictHttpResponse<UtilisateurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `gestiondestock/v1/utilisateur/changer-mot-de-passe`,
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
   * Renvoie un profil utilisateur
   *
   * Cette methode permet de changer le mot de passe de l'utilisateurs dans la BDD
   * @param body undefined
   * @return Mot de passe changer avec succes
   */
   changerMotDePassePOST(body?: ChangerMotDePasseUtilisateurDto): __Observable<UtilisateurDto> {
    return this.changerMotDePassePOSTResponse(body).pipe(
      __map(_r => _r.body as UtilisateurDto)
    );
  }

  /**
   * Supprimer un utilisateur
   *
   * Cette methode permet de supprimer un utilisateur par son ID
   */
   UtilisateurApiDELETEResponse(idUtilisateur?: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `gestiondestock/v1/utilisateur/detele/${encodeURIComponent(String(idUtilisateur))}`,
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
  UtilisateurApiDELETE(idUtilisateur?: string): __Observable<null> {
    return this.UtilisateurApiDELETEResponse(idUtilisateur).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * Rechercher un utilisateur
   *
   * Cette methode permet de rechercher une utilisateur par son email
   * @return L'objet utilisateur a ete trouver dans la BDD
   */
  UtilisateurApiFindByEmailUtilisateurGETResponse(emailUtilisateur?: string): __Observable<__StrictHttpResponse<UtilisateurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/utilisateur/email/${encodeURIComponent(String(emailUtilisateur))}`,
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
  UtilisateurApiFindByEmailUtilisateurGET(emailUtilisateur?: string): __Observable<UtilisateurDto> {
    return this.UtilisateurApiFindByEmailUtilisateurGETResponse(emailUtilisateur).pipe(
      __map(_r => _r.body as UtilisateurDto)
    );
  }

  /**
   * Rechercher un utilisateur
   *
   * Cette methode permet de rechercher un utilisateur par son ID
   * @return L'objet utilisateur a ete trouver dans la BDD
   */
  UtilisateurApiFindByIdGETResponse(idUtilisateur?: string): __Observable<__StrictHttpResponse<UtilisateurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/utilisateur/${encodeURIComponent(String(idUtilisateur))}`,
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
  UtilisateurApiFindByIdGET(idUtilisateur?: string): __Observable<UtilisateurDto> {
    return this.UtilisateurApiFindByIdGETResponse(idUtilisateur).pipe(
      __map(_r => _r.body as UtilisateurDto)
    );
  }

}

module UtilisateurService {
}

export { UtilisateurService }
