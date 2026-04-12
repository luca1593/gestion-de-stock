/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { AlertStockDto } from '../models/alert-stock-dto';

@Injectable({
  providedIn: 'root',
})
class AlertStockService extends __BaseService {
  static readonly AlertStockApiSavePOSTPath = 'v1/alert-stock/save';
  static readonly AlertStockApiFindByIdGETPath = 'v1/alert-stock/{id}';
  static readonly AlertStockApiFindByNiveauGETPath = 'v1/alert-stock/niveau/{niveau}';
  static readonly AlertStockApiFindByEntrepriseGETPath = 'v1/alert-stock/entreprise/{identreprise}';
  static readonly AlertStockApiFindActivesGETPath = 'v1/alert-stock/actives/{identreprise}';
  static readonly AlertStockApiDELETEPath = 'v1/alert-stock/delete/{id}';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  AlertStockApiSavePOSTResponse(body?: AlertStockDto): __Observable<__StrictHttpResponse<AlertStockDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body = body;
    let req = new HttpRequest<any>('POST', this.rootUrl + 'v1/alert-stock/save', __body, {
      headers: __headers,
      params: __params,
      responseType: 'json',
    });
    return this.http.request<any>(req).pipe(__filter((_r) => _r instanceof HttpResponse), __map((_r) => _r as __StrictHttpResponse<AlertStockDto>));
  }

  AlertStockApiSavePOST(body?: AlertStockDto): __Observable<AlertStockDto> {
    return this.AlertStockApiSavePOSTResponse(body).pipe(__map((_r) => _r.body as AlertStockDto));
  }

  AlertStockApiFindByIdGETResponse(id: number): __Observable<__StrictHttpResponse<AlertStockDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `v1/alert-stock/${encodeURIComponent(String(id))}`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json',
    });
    return this.http.request<any>(req).pipe(__filter((_r) => _r instanceof HttpResponse), __map((_r) => _r as __StrictHttpResponse<AlertStockDto>));
  }

  AlertStockApiFindByIdGET(id: number): __Observable<AlertStockDto> {
    return this.AlertStockApiFindByIdGETResponse(id).pipe(__map((_r) => _r.body as AlertStockDto));
  }

  AlertStockApiFindByNiveauGETResponse(niveau: string): __Observable<__StrictHttpResponse<Array<AlertStockDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `v1/alert-stock/niveau/${encodeURIComponent(String(niveau))}`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json',
    });
    return this.http.request<any>(req).pipe(__filter((_r) => _r instanceof HttpResponse), __map((_r) => _r as __StrictHttpResponse<Array<AlertStockDto>>));
  }

  AlertStockApiFindByNiveauGET(niveau: string): __Observable<Array<AlertStockDto>> {
    return this.AlertStockApiFindByNiveauGETResponse(niveau).pipe(__map((_r) => _r.body as Array<AlertStockDto>));
  }

  AlertStockApiFindByEntrepriseGETResponse(identreprise: number): __Observable<__StrictHttpResponse<Array<AlertStockDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `v1/alert-stock/entreprise/${encodeURIComponent(String(identreprise))}`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json',
    });
    return this.http.request<any>(req).pipe(__filter((_r) => _r instanceof HttpResponse), __map((_r) => _r as __StrictHttpResponse<Array<AlertStockDto>>));
  }

  AlertStockApiFindByEntrepriseGET(identreprise: number): __Observable<Array<AlertStockDto>> {
    return this.AlertStockApiFindByEntrepriseGETResponse(identreprise).pipe(__map((_r) => _r.body as Array<AlertStockDto>));
  }

  AlertStockApiFindActivesGETResponse(identreprise: number): __Observable<__StrictHttpResponse<Array<AlertStockDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `v1/alert-stock/actives/${encodeURIComponent(String(identreprise))}`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json',
    });
    return this.http.request<any>(req).pipe(__filter((_r) => _r instanceof HttpResponse), __map((_r) => _r as __StrictHttpResponse<Array<AlertStockDto>>));
  }

  AlertStockApiFindActivesGET(identreprise: number): __Observable<Array<AlertStockDto>> {
    return this.AlertStockApiFindActivesGETResponse(identreprise).pipe(__map((_r) => _r.body as Array<AlertStockDto>));
  }

  AlertStockApiDELETEResponse(id: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('DELETE', this.rootUrl + `v1/alert-stock/delete/${encodeURIComponent(String(id))}`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json',
    });
    return this.http.request<any>(req).pipe(__filter((_r) => _r instanceof HttpResponse), __map((_r) => _r as __StrictHttpResponse<null>));
  }

  AlertStockApiDELETE(id: number): __Observable<null> {
    return this.AlertStockApiDELETEResponse(id).pipe(__map((_r) => _r.body as null));
  }
}

export { AlertStockService };