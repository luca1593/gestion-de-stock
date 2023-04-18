/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { CommandeClientDto } from '../models/commande-client-dto';
import { LigneCommandeClientDto } from '../models/ligne-commande-client-dto';
import { ClientDto } from '../models';
@Injectable({
  providedIn: 'root',
})
class CommandeClientService extends __BaseService {
  static readonly CommandeClientApiFindAllGETPath = 'gestiondestock/v1/commande-client/all';
  static readonly CommandeClientApiFindByCodeCommandeGETPath = 'gestiondestock/v1/commande-client/code/{codeCommandeClient}';
  static readonly CommandeClientApiFindAllByCommandeClientGETPath = 'gestiondestock/v1/commande-client/list/linge-commande/{idCommande}';
  static readonly CommandeClientApiUpdateArticlePATCHPath = 'gestiondestock/v1/commande-client/update/article/{idCommande}/{idLigneCommande}/{newIdArticle}';
  static readonly CommandeClientApiUpdateEtatCommandePATCHPath = 'gestiondestock/v1/commande-client/update/etat/{idCommande}/{etatCommande}';
  static readonly CommandeClientApiUpdateQuantiterCommandePATCHPath = 'gestiondestock/v1/commande-client/update/quantite/{idCommande}/{idLigneCommande}/{quantite}';
  static readonly CommandeClientApiFindByIdGETPath = 'gestiondestock/v1/commande-client/{idCommandeClient}';

  static readonly CommandeClientApiSavePOSTPath = 'gestiondestock/v1/commande-client/create';
  static readonly CommandeClientApiFindByDateCommandeGETPath = 'gestiondestock/v1/commande-client/date/{dateCommandeClient}';
  static readonly CommandeClientApiDeleteArticleDELETEPath = 'gestiondestock/v1/commande-client/delete/article/{idCommande}/{idLigneCommande}';
  static readonly CommandeClientApiDeleteDELETEPath = 'gestiondestock/v1/commande-client/delete/{idCommandeClient}';
  static readonly CommandeClientApiUpdateClientPATCHPath = 'gestiondestock/v1/commande-client/update/client/{idCommande}/{idClient}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Renvoie la liste des commandes client
   *
   * Cette methode permet de rechercher toutes les commandes client dans la BDD
   * @return La liste des commandes client / liste vide
   */
  CommandeClientApiFindAllGETResponse(): __Observable<__StrictHttpResponse<Array<CommandeClientDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/commande-client/all`,
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
   * Renvoie la liste des commandes client
   *
   * Cette methode permet de rechercher toutes les commandes client dans la BDD
   * @return La liste des commandes client / liste vide
   */
  CommandeClientApiFindAllGET(): __Observable<Array<CommandeClientDto>> {
    return this.CommandeClientApiFindAllGETResponse().pipe(
      __map(_r => _r.body as Array<CommandeClientDto>)
    );
  }

  /**
   * Rechercher une commande client
   *
   * Cette methode permet de rechercher une commande client par son code
   * @param codeCommandeClient undefined
   * @return L'objet commande client a ete trouver dans la BDD
   */
  CommandeClientApiFindByCodeCommandeGETResponse(codeCommandeClient: string): __Observable<__StrictHttpResponse<CommandeClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/commande-client/code/${encodeURIComponent(String(codeCommandeClient))}`,
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
   * Rechercher une commande client
   *
   * Cette methode permet de rechercher une commande client par son code
   * @param codeCommandeClient undefined
   * @return L'objet commande client a ete trouver dans la BDD
   */
  CommandeClientApiFindByCodeCommandeGET(codeCommandeClient: string): __Observable<CommandeClientDto> {
    return this.CommandeClientApiFindByCodeCommandeGETResponse(codeCommandeClient).pipe(
      __map(_r => _r.body as CommandeClientDto)
    );
  }

  /**
   * @param idCommande undefined
   * @return Les lignes de commante de la commande client ont bien ete trouver
   */
  CommandeClientApiFindAllByCommandeClientGETResponse(idCommande: number): __Observable<__StrictHttpResponse<Array<LigneCommandeClientDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/commande-client/list/linge-commande/${encodeURIComponent(String(idCommande))}`,
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
   * @param idCommande undefined
   * @return Les lignes de commante de la commande client ont bien ete trouver
   */
  CommandeClientApiFindAllByCommandeClientGET(idCommande: number): __Observable<Array<LigneCommandeClientDto>> {
    return this.CommandeClientApiFindAllByCommandeClientGETResponse(idCommande).pipe(
      __map(_r => _r.body as Array<LigneCommandeClientDto>)
    );
  }

  /**
   * @param params The `CommandeClientService.CommandeClientApiUpdateArticlePATCHParams` containing the following parameters:
   *
   * - `newIdArticle`:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * @return L'article de la commande client a bien ete modifier
   */
  CommandeClientApiUpdateArticlePATCHResponse(params: CommandeClientService.CommandeClientApiUpdateArticlePATCHParams): __Observable<__StrictHttpResponse<CommandeClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `gestiondestock/v1/commande-client/update/article/${encodeURIComponent(String(params.idCommande))}/${encodeURIComponent(String(params.idLigneCommande))}/${encodeURIComponent(String(params.newIdArticle))}`,
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
   * @param params The `CommandeClientService.CommandeClientApiUpdateArticlePATCHParams` containing the following parameters:
   *
   * - `newIdArticle`:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * @return L'article de la commande client a bien ete modifier
   */
  CommandeClientApiUpdateArticlePATCH(params: CommandeClientService.CommandeClientApiUpdateArticlePATCHParams): __Observable<CommandeClientDto> {
    return this.CommandeClientApiUpdateArticlePATCHResponse(params).pipe(
      __map(_r => _r.body as CommandeClientDto)
    );
  }

  /**
   * @param params The `CommandeClientService.CommandeClientApiUpdateEtatCommandePATCHParams` containing the following parameters:
   *
   * - `idCommande`:
   *
   * - `etatCommande`:
   *
   * @return L'etat de la commande client a bien ete modifier
   */
  CommandeClientApiUpdateEtatCommandePATCHResponse(params: CommandeClientService.CommandeClientApiUpdateEtatCommandePATCHParams): __Observable<__StrictHttpResponse<CommandeClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;


    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `gestiondestock/v1/commande-client/update/etat/${encodeURIComponent(String(params.idCommande))}/${encodeURIComponent(String(params.etatCommande))}`,
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
   * @param params The `CommandeClientService.CommandeClientApiUpdateEtatCommandePATCHParams` containing the following parameters:
   *
   * - `idCommande`:
   *
   * - `etatCommande`:
   *
   * @return L'etat de la commande client a bien ete modifier
   */
  CommandeClientApiUpdateEtatCommandePATCH(params: CommandeClientService.CommandeClientApiUpdateEtatCommandePATCHParams): __Observable<CommandeClientDto> {
    return this.CommandeClientApiUpdateEtatCommandePATCHResponse(params).pipe(
      __map(_r => _r.body as CommandeClientDto)
    );
  }

  /**
   * @param params The `CommandeClientService.CommandeClientApiUpdateQuantiterCommandePATCHParams` containing the following parameters:
   *
   * - `quantite`:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * @return La quantite de la commande client a bien ete modifier
   */
  CommandeClientApiUpdateQuantiterCommandePATCHResponse(params: CommandeClientService.CommandeClientApiUpdateQuantiterCommandePATCHParams): __Observable<__StrictHttpResponse<CommandeClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `gestiondestock/v1/commande-client/update/quantite/${encodeURIComponent(String(params.idCommande))}/${encodeURIComponent(String(params.idLigneCommande))}/${encodeURIComponent(String(params.quantite))}`,
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
   * @param params The `CommandeClientService.CommandeClientApiUpdateQuantiterCommandePATCHParams` containing the following parameters:
   *
   * - `quantite`:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * @return La quantite de la commande client a bien ete modifier
   */
  CommandeClientApiUpdateQuantiterCommandePATCH(params: CommandeClientService.CommandeClientApiUpdateQuantiterCommandePATCHParams): __Observable<CommandeClientDto> {
    return this.CommandeClientApiUpdateQuantiterCommandePATCHResponse(params).pipe(
      __map(_r => _r.body as CommandeClientDto)
    );
  }

  /**
   * Rechercher une commande client
   *
   * Cette methode permet de rechercher une commande client par son ID
   * @param idCommandeClient undefined
   * @return L'objet commande client a ete trouver dans la BDD
   */
  CommandeClientApiFindByIdGETResponse(idCommandeClient: number): __Observable<__StrictHttpResponse<CommandeClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/commande-client/${encodeURIComponent(String(idCommandeClient))}`,
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
   * Rechercher une commande client
   *
   * Cette methode permet de rechercher une commande client par son ID
   * @param idCommandeClient undefined
   * @return L'objet commande client a ete trouver dans la BDD
   */
  CommandeClientApiFindByIdGET(idCommandeClient: number): __Observable<CommandeClientDto> {
    return this.CommandeClientApiFindByIdGETResponse(idCommandeClient).pipe(
      __map(_r => _r.body as CommandeClientDto)
    );
  }

  /**
   * Enregistrement d'une commande client
   *
   * Cette methode permet d'enregidtre ou de modifier une commande client
   * @return L'objet commande client creer ou modifier
   */
   CommandeClientApiSavePOSTResponse(body: CommandeClientDto, dateCommandeClient: number): __Observable<__StrictHttpResponse<CommandeClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body = body;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `gestiondestock/v1/commande-client/create/${encodeURIComponent(String(dateCommandeClient))}`,
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
  CommandeClientApiSavePOST(body: CommandeClientDto, dateCommandeClient: number): __Observable<CommandeClientDto> {
    return this.CommandeClientApiSavePOSTResponse(body, dateCommandeClient).pipe(
      __map(_r => _r.body as CommandeClientDto)
    );
  }

  /**
   * Rechercher liste des commandes client par date
   *
   * Cette methode permet de rechercher liste des commandes client par date
   * @return Aucune commande client n'a ete trouver dans la BDD
   */
  CommandeClientApiFindByDateCommandeGETResponse(dateCommandeClient?: string): __Observable<__StrictHttpResponse<Array<CommandeClientDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/commande-client/date/${encodeURIComponent(String(dateCommandeClient))}`,
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
  CommandeClientApiFindByDateCommandeGET(dateCommandeClient?: string): __Observable<Array<CommandeClientDto>> {
    return this.CommandeClientApiFindByDateCommandeGETResponse(dateCommandeClient).pipe(
      __map(_r => _r.body as Array<CommandeClientDto>)
    );
  }

  /**
   * @return L'article de la commande client a bien ete supprimer
   */
  CommandeClientApiDeleteArticleDELETEResponse(idCommande?: string, idLigneCommande?: string): __Observable<__StrictHttpResponse<CommandeClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `gestiondestock/v1/commande-client/delete/article/${encodeURIComponent(String(idCommande))}/${encodeURIComponent(String(idLigneCommande))}`,
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
  CommandeClientApiDeleteArticleDELETE(idCommande?: string, idLigneCommande?: string): __Observable<CommandeClientDto> {
    return this.CommandeClientApiDeleteArticleDELETEResponse(idCommande, idLigneCommande).pipe(
      __map(_r => _r.body as CommandeClientDto)
    );
  }

  /**
   * Recherche de la liste des lignes de commande d'une commande fournisseur
   *
   * Cette methode permet de rechercher la liste des lignes de commande d'une commande fournisseur par son id
   * @return Liste des lignes de commande fournisseur a ete trouver avec success  Array<LigneCommandeClientDto>
   */
  findAllLigneCommadeByCommandeClientResponse(idCommande?: number): __Observable<__StrictHttpResponse<Array<LigneCommandeClientDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/commande-client/list/ligne-commande/${encodeURIComponent(String(idCommande))}`,
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
   * Recherche de la liste des lignes de commande d'une commande client
   *
   * Cette methode permet de rechercher la liste des lignes de commande d'une commande client par son id
   * @return Liste des lignes de commande client a ete trouver avec succesr
   */
  findAllLigneCommadeByCommandeClient(idCommande?: number): __Observable<Array<LigneCommandeClientDto>> {
    return this.findAllLigneCommadeByCommandeClientResponse(idCommande).pipe(
      __map(_r => _r.body as Array<LigneCommandeClientDto>)
    );
  }

  /**
   * Rechercher liste des commandes client selon le client
   *
   * Cette methode permet de rechercher liste des commandes client selon le client
   * @return Aucune commande client n'a ete trouver dans la BDD
   */
  findAllByClientResponse(clientDto?: ClientDto): __Observable<__StrictHttpResponse<Array<CommandeClientDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = clientDto;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `gestiondestock/v1/commande-client`,
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
   * Rechercher liste des commandes client selon le client
   *
   * Cette methode permet de rechercher liste des commandes client selon le client
   * @return Aucune commande client n'a ete trouver dans la BDD
   */
  findAllByClientPOST(body: ClientDto): __Observable<Array<CommandeClientDto>> {
    return this.findAllByClientResponse(body).pipe(
      __map(_r => _r.body as Array<CommandeClientDto>)
    );
  }


  /**
   * Supprimer une commande client
   *
   * Cette methode permet de supprimer une commande client par son ID
   */
  CommandeClientApiDeleteDELETEResponse(idCommandeClient?: string): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `gestiondestock/v1/commande-client/delete/${encodeURIComponent(String(idCommandeClient))}`,
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
  CommandeClientApiDeleteDELETE(idCommandeClient?: string): __Observable<null> {
    return this.CommandeClientApiDeleteDELETEResponse(idCommandeClient).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * @return Le client de la commande client a bien ete modifier
   */
  CommandeClientApiUpdateClientPATCHResponse(idCommande?: string, idClient?: string): __Observable<__StrictHttpResponse<CommandeClientDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `gestiondestock/v1/commande-client/update/client/${encodeURIComponent(String(idCommande))}/${encodeURIComponent(String(idClient))}`,
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
  CommandeClientApiUpdateClientPATCH(idCommande?: string, idClient?: string): __Observable<CommandeClientDto> {
    return this.CommandeClientApiUpdateClientPATCHResponse(idCommande, idClient).pipe(
      __map(_r => _r.body as CommandeClientDto)
    );
  }

}

module CommandeClientService {

  /**
   * Parameters for CommandeClientApiUpdateArticlePATCH
   */
  export interface CommandeClientApiUpdateArticlePATCHParams {
    newIdArticle: number;
    idLigneCommande: number;
    idCommande: number;
  }

  /**
   * Parameters for CommandeClientApiUpdateEtatCommandePATCH
   */
  export interface CommandeClientApiUpdateEtatCommandePATCHParams {
    idCommande: number;
    etatCommande: 'EN_PREPARATIOM' | 'VALIDEE' | 'LIVREE';
  }

  /**
   * Parameters for CommandeClientApiUpdateQuantiterCommandePATCH
   */
  export interface CommandeClientApiUpdateQuantiterCommandePATCHParams {
    quantite: number;
    idLigneCommande: number;
    idCommande: number;
  }
}

export { CommandeClientService }
