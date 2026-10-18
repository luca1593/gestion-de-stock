/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { FactureDto } from '../models/facture-dto';

@Injectable({
  providedIn: 'root',
})
class FactureService extends __BaseService {
  static readonly FactureApiAllGETPath = 'v1/factures/all';
  static readonly FactureApiByIdGETPath = 'v1/factures/{id}';
  static readonly FactureApiByClientGETPath = 'v1/factures/client/{clientId}';
  static readonly FactureApiByEntrepriseGETPath = 'v1/factures/entreprise/{entrepriseId}';
  static readonly FactureApiByFournisseurGETPath = 'v1/factures/fournisseur/{fournisseurId}';
  static readonly FactureApiBySourceGETPath = 'v1/factures/source/{sourceType}/{sourceId}';
  static readonly FactureApiByStatutGETPath = 'v1/factures/statut/{statut}';
  static readonly FactureApiByTypeGETPath = 'v1/factures/type/{typeFacture}';
  static readonly FactureApiDeleteDELETEPath = 'v1/factures/delete/{id}';
  static readonly FactureApiSavePOSTPath = 'v1/factures/save';
  static readonly FactureApiSaveAvecPaiementPOSTPath = 'v1/factures/save-avec-paiement';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  FactureApiAllGETResponse(): __Observable<__StrictHttpResponse<Array<FactureDto>>> {
    return this.get<Array<FactureDto>>('v1/factures/all');
  }

  FactureApiAllGET(): __Observable<Array<FactureDto>> {
    return this.FactureApiAllGETResponse().pipe(__map((_r) => _r.body as Array<FactureDto>));
  }

  FactureApiByIdGETResponse(id: number): __Observable<__StrictHttpResponse<FactureDto>> {
    return this.get<FactureDto>(`v1/factures/${encodeURIComponent(String(id))}`);
  }

  FactureApiByIdGET(id: number): __Observable<FactureDto> {
    return this.FactureApiByIdGETResponse(id).pipe(__map((_r) => _r.body as FactureDto));
  }

  FactureApiByClientGETResponse(clientId: number): __Observable<__StrictHttpResponse<Array<FactureDto>>> {
    return this.get<Array<FactureDto>>(`v1/factures/client/${encodeURIComponent(String(clientId))}`);
  }

  FactureApiByClientGET(clientId: number): __Observable<Array<FactureDto>> {
    return this.FactureApiByClientGETResponse(clientId).pipe(__map((_r) => _r.body as Array<FactureDto>));
  }

  FactureApiByEntrepriseGETResponse(entrepriseId: number): __Observable<__StrictHttpResponse<Array<FactureDto>>> {
    return this.get<Array<FactureDto>>(`v1/factures/entreprise/${encodeURIComponent(String(entrepriseId))}`);
  }

  FactureApiByEntrepriseGET(entrepriseId: number): __Observable<Array<FactureDto>> {
    return this.FactureApiByEntrepriseGETResponse(entrepriseId).pipe(__map((_r) => _r.body as Array<FactureDto>));
  }

  FactureApiByFournisseurGETResponse(fournisseurId: number): __Observable<__StrictHttpResponse<Array<FactureDto>>> {
    return this.get<Array<FactureDto>>(`v1/factures/fournisseur/${encodeURIComponent(String(fournisseurId))}`);
  }

  FactureApiByFournisseurGET(fournisseurId: number): __Observable<Array<FactureDto>> {
    return this.FactureApiByFournisseurGETResponse(fournisseurId).pipe(__map((_r) => _r.body as Array<FactureDto>));
  }

  FactureApiBySourceGETResponse(sourceType: string, sourceId: number): __Observable<__StrictHttpResponse<Array<FactureDto>>> {
    return this.get<Array<FactureDto>>(
      `v1/factures/source/${encodeURIComponent(String(sourceType))}/${encodeURIComponent(String(sourceId))}`
    );
  }

  FactureApiBySourceGET(sourceType: string, sourceId: number): __Observable<Array<FactureDto>> {
    return this.FactureApiBySourceGETResponse(sourceType, sourceId).pipe(__map((_r) => _r.body as Array<FactureDto>));
  }

  FactureApiByStatutGETResponse(statut: string): __Observable<__StrictHttpResponse<Array<FactureDto>>> {
    return this.get<Array<FactureDto>>(`v1/factures/statut/${encodeURIComponent(String(statut))}`);
  }

  FactureApiByStatutGET(statut: string): __Observable<Array<FactureDto>> {
    return this.FactureApiByStatutGETResponse(statut).pipe(__map((_r) => _r.body as Array<FactureDto>));
  }

  FactureApiByTypeGETResponse(typeFacture: string): __Observable<__StrictHttpResponse<Array<FactureDto>>> {
    return this.get<Array<FactureDto>>(`v1/factures/type/${encodeURIComponent(String(typeFacture))}`);
  }

  FactureApiByTypeGET(typeFacture: string): __Observable<Array<FactureDto>> {
    return this.FactureApiByTypeGETResponse(typeFacture).pipe(__map((_r) => _r.body as Array<FactureDto>));
  }

  FactureApiDeleteDELETEResponse(id: number): __Observable<__StrictHttpResponse<null>> {
    return this.delete(`v1/factures/delete/${encodeURIComponent(String(id))}`);
  }

  FactureApiDeleteDELETE(id: number): __Observable<null> {
    return this.FactureApiDeleteDELETEResponse(id).pipe(__map((_r) => _r.body as null));
  }

  FactureApiSavePOSTResponse(body?: FactureDto): __Observable<__StrictHttpResponse<FactureDto>> {
    return this.post<FactureDto>('v1/factures/save', body);
  }

  FactureApiSavePOST(body?: FactureDto): __Observable<FactureDto> {
    return this.FactureApiSavePOSTResponse(body).pipe(__map((_r) => _r.body as FactureDto));
  }

  FactureApiSaveAvecPaiementPOSTResponse(body?: FactureDto): __Observable<__StrictHttpResponse<FactureDto>> {
    return this.post<FactureDto>('v1/factures/save-avec-paiement', body);
  }

  FactureApiSaveAvecPaiementPOST(body?: FactureDto): __Observable<FactureDto> {
    return this.FactureApiSaveAvecPaiementPOSTResponse(body).pipe(__map((_r) => _r.body as FactureDto));
  }

  /* ------------------------------------------------------------------ */
  /* Raccourcis internes                                                 */
  /*                                                                     */
  /* Les douze endpoints se distinguent uniquement par leur URL et leur    */
  /* paramètre ; on factorise l construction de la requête ici plutôt que */
  /* de la répéter douze fois. Les signatures *Response / * restent, pour */
  /* rester compatibles avec les autres services générés.                 */
  /* ------------------------------------------------------------------ */

  private get<T>(path: string): __Observable<__StrictHttpResponse<T>> {
    const req = new HttpRequest<any>('GET', this.rootUrl + path, null, {
      headers: new HttpHeaders(),
      params: this.newParams(),
      responseType: 'json',
    });
    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => _r as __StrictHttpResponse<T>)
    );
  }

  private post<T>(path: string, body: any): __Observable<__StrictHttpResponse<T>> {
    const req = new HttpRequest<any>('POST', this.rootUrl + path, body, {
      headers: new HttpHeaders(),
      params: this.newParams(),
      responseType: 'json',
    });
    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => _r as __StrictHttpResponse<T>)
    );
  }

  private delete(path: string): __Observable<__StrictHttpResponse<null>> {
    const req = new HttpRequest<any>('DELETE', this.rootUrl + path, null, {
      headers: new HttpHeaders(),
      params: this.newParams(),
      responseType: 'json',
    });
    return this.http.request<any>(req).pipe(
      __filter((_r) => _r instanceof HttpResponse),
      __map((_r) => _r as __StrictHttpResponse<null>)
    );
  }
}

export { FactureService };