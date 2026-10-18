/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { PaiementDto } from '../models/paiement-dto';

@Injectable({
  providedIn: 'root',
})
class PaiementService extends __BaseService {
  static readonly PaiementApiAllGETPath = 'v1/paiements/all';
  static readonly PaiementApiByFactureGETPath = 'v1/paiements/facture/{factureId}';
  static readonly PaiementApiByIdGETPath = 'v1/paiements/{id}';
  static readonly PaiementApiDeleteDELETEPath = 'v1/paiements/delete/{id}';
  static readonly PaiementApiSavePOSTPath = 'v1/paiements/save';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  PaiementApiAllGETResponse(): __Observable<__StrictHttpResponse<Array<PaiementDto>>> {
    return this.get<Array<PaiementDto>>('v1/paiements/all');
  }

  PaiementApiAllGET(): __Observable<Array<PaiementDto>> {
    return this.PaiementApiAllGETResponse().pipe(__map((_r) => _r.body as Array<PaiementDto>));
  }

  PaiementApiByFactureGETResponse(factureId: number): __Observable<__StrictHttpResponse<Array<PaiementDto>>> {
    return this.get<Array<PaiementDto>>(`v1/paiements/facture/${encodeURIComponent(String(factureId))}`);
  }

  PaiementApiByFactureGET(factureId: number): __Observable<Array<PaiementDto>> {
    return this.PaiementApiByFactureGETResponse(factureId).pipe(__map((_r) => _r.body as Array<PaiementDto>));
  }

  PaiementApiByIdGETResponse(id: number): __Observable<__StrictHttpResponse<PaiementDto>> {
    return this.get<PaiementDto>(`v1/paiements/${encodeURIComponent(String(id))}`);
  }

  PaiementApiByIdGET(id: number): __Observable<PaiementDto> {
    return this.PaiementApiByIdGETResponse(id).pipe(__map((_r) => _r.body as PaiementDto));
  }

  PaiementApiDeleteDELETEResponse(id: number): __Observable<__StrictHttpResponse<null>> {
    return this.delete(`v1/paiements/delete/${encodeURIComponent(String(id))}`);
  }

  PaiementApiDeleteDELETE(id: number): __Observable<null> {
    return this.PaiementApiDeleteDELETEResponse(id).pipe(__map((_r) => _r.body as null));
  }

  PaiementApiSavePOSTResponse(body?: PaiementDto): __Observable<__StrictHttpResponse<PaiementDto>> {
    return this.post<PaiementDto>('v1/paiements/save', body);
  }

  PaiementApiSavePOST(body?: PaiementDto): __Observable<PaiementDto> {
    return this.PaiementApiSavePOSTResponse(body).pipe(__map((_r) => _r.body as PaiementDto));
  }

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

export { PaiementService };