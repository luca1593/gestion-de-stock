/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { CommandeFournisseurDto } from '../models/commande-fournisseur-dto';
@Injectable({
  providedIn: 'root',
})
class CommandeFournisseurService extends __BaseService {
  static readonly CommandeFournisseurApiFindByCodeCommandeGETPath = 'gestiondestock/v1/commande-fournisseur/code/{codeCommandeFournisseur}';
  static readonly CommandeFournisseurApiDELETEPath = 'gestiondestock/v1/commande-fournisseur/delete/{idCommandeFournisseur}';
  static readonly CommandeFournisseurApiUpdateArticlePATCHPath = 'gestiondestock/v1/commande-fournisseur/update/article/{idCommande}/{idLigneCommande}/{newIdArticle}';
  static readonly CommandeFournisseurApiFindByIdGETPath = 'gestiondestock/v1/commande-fournisseur/{idCommandeFournisseur}';

  static readonly CommandeFournisseurApiFindAllGETPath = 'gestiondestock/v1/commande-fournisseur/all';
  static readonly CommandeFournisseurApiSavePOSTPath = 'gestiondestock/v1/commande-fournisseur/create';
  static readonly CommandeFournisseurApiFindByDateCommandeGETPath = 'gestiondestock/v1/commande-fournisseur/date/{dateCommandeFournisseur}';
  static readonly CommandeFournisseurApiDeleteArticleDELETEPath = 'gestiondestock/v1/commande-fournisseur/delete/article/{idCommande}/{idLigneCommande}';
  static readonly CommandeFournisseurApiFindAllByCommandeFournisseurGETPath = 'gestiondestock/v1/commande-fournisseur/list/ligne-commande/{idCommande}';
  static readonly CommandeFournisseurApiUpdateEtatCommandePATCHPath = 'gestiondestock/v1/commande-fournisseur/update/etat/{idCommande}/{etatCommande}';
  static readonly CommandeFournisseurApiUpdateFournisseurPATCHPath = 'gestiondestock/v1/commande-fournisseur/update/fournisseur/{idCommande}/{idFournisseur}';
  static readonly CommandeFournisseurApiUpdateQuantiterCommandePATCHPath = 'gestiondestock/v1/commande-fournisseur/update/quantite/{idCommande}/{idLigneCommande}/{quantite}';

  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  /**
   * Rechercher une commande fournisseur
   *
   * Cette methode permet de rechercher une commande fournisseur par son code
   * @param codeCommandeFournisseur undefined
   * @return L'objet commande fournisseur a ete trouver dans la BDD
   */
  CommandeFournisseurApiFindByCodeCommandeGETResponse(codeCommandeFournisseur: string): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/commande-fournisseur/code/${encodeURIComponent(String(codeCommandeFournisseur))}`,
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
   * Rechercher une commande fournisseur
   *
   * Cette methode permet de rechercher une commande fournisseur par son code
   * @param codeCommandeFournisseur undefined
   * @return L'objet commande fournisseur a ete trouver dans la BDD
   */
  CommandeFournisseurApiFindByCodeCommandeGET(codeCommandeFournisseur: string): __Observable<CommandeFournisseurDto> {
    return this.CommandeFournisseurApiFindByCodeCommandeGETResponse(codeCommandeFournisseur).pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

  /**
   * Supprimer une commande client
   *
   * Cette methode permet de supprimer une commande fournisseur par son ID
   * @param idCommandeFournisseur undefined
   */
  CommandeFournisseurApiDELETEResponse(idCommandeFournisseur: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `gestiondestock/v1/commande-fournisseur/delete/${encodeURIComponent(String(idCommandeFournisseur))}`,
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
   * Cette methode permet de supprimer une commande fournisseur par son ID
   * @param idCommandeFournisseur undefined
   */
  CommandeFournisseurApiDELETE(idCommandeFournisseur: number): __Observable<null> {
    return this.CommandeFournisseurApiDELETEResponse(idCommandeFournisseur).pipe(
      __map(_r => _r.body as null)
    );
  }

  /**
   * Mise a jour de l'article d'une commande fournisseur
   *
   * Cette methode permet de mettre a jour l'article d'une commande fournisseur par son id
   * @param params The `CommandeFournisseurService.CommandeFournisseurApiUpdateArticlePATCHParams` containing the following parameters:
   *
   * - `newIdArticle`:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * @return L'article de la commande fournisseur a ete mise a jour
   */
  CommandeFournisseurApiUpdateArticlePATCHResponse(params: CommandeFournisseurService.CommandeFournisseurApiUpdateArticlePATCHParams): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;



    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `gestiondestock/v1/commande-fournisseur/update/article/${encodeURIComponent(String(params.idCommande))}/${encodeURIComponent(String(params.idLigneCommande))}/${encodeURIComponent(String(params.newIdArticle))}`,
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
   * Mise a jour de l'article d'une commande fournisseur
   *
   * Cette methode permet de mettre a jour l'article d'une commande fournisseur par son id
   * @param params The `CommandeFournisseurService.CommandeFournisseurApiUpdateArticlePATCHParams` containing the following parameters:
   *
   * - `newIdArticle`:
   *
   * - `idLigneCommande`:
   *
   * - `idCommande`:
   *
   * @return L'article de la commande fournisseur a ete mise a jour
   */
  CommandeFournisseurApiUpdateArticlePATCH(params: CommandeFournisseurService.CommandeFournisseurApiUpdateArticlePATCHParams): __Observable<CommandeFournisseurDto> {
    return this.CommandeFournisseurApiUpdateArticlePATCHResponse(params).pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

  /**
   * Rechercher une commande fournisseur
   *
   * Cette methode permet de rechercher une commande fournisseur par son ID
   * @param idCommandeFournisseur undefined
   * @return L'objet commande fournisseur a ete trouver dans la BDD
   */
  CommandeFournisseurApiFindByIdGETResponse(idCommandeFournisseur: number): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;

    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/commande-fournisseur/${encodeURIComponent(String(idCommandeFournisseur))}`,
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
   * Rechercher une commande fournisseur
   *
   * Cette methode permet de rechercher une commande fournisseur par son ID
   * @param idCommandeFournisseur undefined
   * @return L'objet commande fournisseur a ete trouver dans la BDD
   */
  CommandeFournisseurApiFindByIdGET(idCommandeFournisseur: number): __Observable<CommandeFournisseurDto> {
    return this.CommandeFournisseurApiFindByIdGETResponse(idCommandeFournisseur).pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

  /**
   * Renvoie la liste des commandes fournisseur
   *
   * Cette methode permet de rechercher toutes les commandes fournisseur dans la BDD
   * @return La liste des commandes fournisseur / liste vide
   */
   CommandeFournisseurApiFindAllGETResponse(): __Observable<__StrictHttpResponse<Array<CommandeFournisseurDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/commande-fournisseur/all`,
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
  CommandeFournisseurApiFindAllGET(): __Observable<Array<CommandeFournisseurDto>> {
    return this.CommandeFournisseurApiFindAllGETResponse().pipe(
      __map(_r => _r.body as Array<CommandeFournisseurDto>)
    );
  }

  /**
   * Enregistrement d'une commande fournisseur
   *
   * Cette methode permet d'enregidtre ou de modifier une commande fournisseur
   * @return L'objet commande fournisseur creer ou modifier
   */
  CommandeFournisseurApiSavePOSTResponse(): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'POST',
      this.rootUrl + `gestiondestock/v1/commande-fournisseur/create`,
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
  CommandeFournisseurApiSavePOST(): __Observable<CommandeFournisseurDto> {
    return this.CommandeFournisseurApiSavePOSTResponse().pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

  /**
   * Rechercher liste des commandes fournisseur par date
   *
   * Cette methode permet de rechercher liste des commandes fournisseur par date
   * @return Aucune commande fournisseur n'a ete trouver dans la BDD
   */
  CommandeFournisseurApiFindByDateCommandeGETResponse(dateCommandeFournisseur?: string): __Observable<__StrictHttpResponse<Array<CommandeFournisseurDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/commande-fournisseur/date/${encodeURIComponent(String(dateCommandeFournisseur))}`,
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
  CommandeFournisseurApiFindByDateCommandeGET(dateCommandeFournisseur?: string): __Observable<Array<CommandeFournisseurDto>> {
    return this.CommandeFournisseurApiFindByDateCommandeGETResponse(dateCommandeFournisseur).pipe(
      __map(_r => _r.body as Array<CommandeFournisseurDto>)
    );
  }

  /**
   * Suppression d'un articl d'une commande fournisseur
   *
   * Cette methode permet de supprimer un article sur 'une commande fournisseur par son id
   * @return L'article de la commande fournisseur a ete supprimer avec success
   */
  CommandeFournisseurApiDeleteArticleDELETEResponse(idCommande?: string, idLigneCommande?: string): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'DELETE',
      this.rootUrl + `gestiondestock/v1/commande-fournisseur/delete/article/${encodeURIComponent(String(idCommande))}/${encodeURIComponent(String(idLigneCommande))}`,
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
  CommandeFournisseurApiDeleteArticleDELETE(idCommande?: string, idLigneCommande?: string): __Observable<CommandeFournisseurDto> {
    return this.CommandeFournisseurApiDeleteArticleDELETEResponse(idCommande, idLigneCommande).pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

  /**
   * Recherche de la liste des lignes de commande d'une commande fournisseur
   *
   * Cette methode permet de rechercher la liste des lignes de commande d'une commande fournisseur par son id
   * @return Liste des lignes de commande fournisseur a ete trouver avec succesr
   */
  CommandeFournisseurApiFindAllByCommandeFournisseurGETResponse(idCommande?: string): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `gestiondestock/v1/commande-fournisseur/list/ligne-commande/${encodeURIComponent(String(idCommande))}`,
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
  CommandeFournisseurApiFindAllByCommandeFournisseurGET(idCommande?: string): __Observable<CommandeFournisseurDto> {
    return this.CommandeFournisseurApiFindAllByCommandeFournisseurGETResponse(idCommande).pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

  /**
   * Mise a jour de l'etat d'une commande fournisseur
   *
   * Cette methode permet de mettre a jour l'etat d'une commande fournisseur par son id
   * @return L'etat de la commande fournisseur a ete mise a jour
   */
  CommandeFournisseurApiUpdateEtatCommandePATCHResponse(idCommande?: string, etatCommande?: string): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `gestiondestock/v1/commande-fournisseur/update/etat/${encodeURIComponent(String(idCommande))}/${encodeURIComponent(String(etatCommande))}`,
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
  CommandeFournisseurApiUpdateEtatCommandePATCH(idCommande?: string, etatCommande?: string): __Observable<CommandeFournisseurDto> {
    return this.CommandeFournisseurApiUpdateEtatCommandePATCHResponse(idCommande, etatCommande).pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

  /**
   * Mise a jour du fournisseur d'une commande fournisseur
   *
   * Cette methode permet de mettre a jour le fournisseur d'une commande fournisseur par son id
   * @return Le fournisseur de la commande fournisseur a ete mise a jour
   */
  CommandeFournisseurApiUpdateFournisseurPATCHResponse(idCommande?: string, idFournisseur?: string): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `gestiondestock/v1/commande-fournisseur/update/fournisseur/${encodeURIComponent(String(idCommande))}/${encodeURIComponent(String(idFournisseur))}`,
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
  CommandeFournisseurApiUpdateFournisseurPATCH(idCommande?: string, idFournisseur?: string): __Observable<CommandeFournisseurDto> {
    return this.CommandeFournisseurApiUpdateFournisseurPATCHResponse(idCommande, idFournisseur).pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

  /**
   * Mise a jour de la quantite d'une commande fournisseur
   *
   * Cette methode permet de mettre a jour la quantite d'une commande fournisseur par son id
   * @return La quantite de la commande fournisseur a ete mise a jour
   */
  CommandeFournisseurApiUpdateQuantiterCommandePATCHResponse(idCommande?: string, idLigneCommande?: string, quantite?: string): __Observable<__StrictHttpResponse<CommandeFournisseurDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'PATCH',
      this.rootUrl + `gestiondestock/v1/commande-fournisseur/update/quantite/${encodeURIComponent(String(idCommande))}/${encodeURIComponent(String(idLigneCommande))}/${encodeURIComponent(String(quantite))}`,
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
  CommandeFournisseurApiUpdateQuantiterCommandePATCH(idCommande?: string, idLigneCommande?: string, quantite?: string): __Observable<CommandeFournisseurDto> {
    return this.CommandeFournisseurApiUpdateQuantiterCommandePATCHResponse(idCommande, idLigneCommande, quantite).pipe(
      __map(_r => _r.body as CommandeFournisseurDto)
    );
  }

}

module CommandeFournisseurService {

  /**
   * Parameters for CommandeFournisseurApiUpdateArticlePATCH
   */
  export interface CommandeFournisseurApiUpdateArticlePATCHParams {
    newIdArticle: number;
    idLigneCommande: number;
    idCommande: number;
  }
}

export { CommandeFournisseurService }
