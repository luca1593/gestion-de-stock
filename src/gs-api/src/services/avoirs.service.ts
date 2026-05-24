/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { AvoirDto } from '../models/avoir-dto';

@Injectable({
  providedIn: 'root',
})
class AvoirsService extends __BaseService {
  static readonly AvoirsApiSavePOSTPath = 'v1/avoirs/save';
  static readonly AvoirsApiFindAllGETPath = 'v1/avoirs/all';
  static readonly AvoirsApiFindByIdGETPath = 'v1/avoirs/{id}';
  static readonly AvoirsApiFindByVenteGETPath = 'v1/avoirs/vente/{venteId}';
  static readonly AvoirsApiFindByClientGETPath = 'v1/avoirs/client/{clientId}';
  static readonly AvoirsApiFindByDateRangeGETPath = 'v1/avoirs/date-range';
  static readonly AvoirsApiDELETEPath = 'v1/avoirs/delete/{id}';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  AvoirsApiSavePOSTResponse(body?: AvoirDto): __Observable<__StrictHttpResponse<AvoirDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body = body;
    let req = new HttpRequest<any>('POST', this.rootUrl + 'v1/avoirs/save', __body, {
      headers: __headers,
      params: __params,
      responseType: 'json',
    });
    return this.http.request<any>(req).pipe(__filter((_r) => _r instanceof HttpResponse), __map((_r) => _r as __StrictHttpResponse<AvoirDto>));
  }

  AvoirsApiSavePOST(body?: AvoirDto): __Observable<AvoirDto> {
    return this.AvoirsApiSavePOSTResponse(body).pipe(__map((_r) => _r.body as AvoirDto));
  }

  AvoirsApiFindAllGETResponse(): __Observable<__StrictHttpResponse<Array<AvoirDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + 'v1/avoirs/all', __body, {
      headers: __headers,
      params: __params,
      responseType: 'json',
    });
    return this.http.request<any>(req).pipe(__filter((_r) => _r instanceof HttpResponse), __map((_r) => _r as __StrictHttpResponse<Array<AvoirDto>>));
  }

  AvoirsApiFindAllGET(): __Observable<Array<AvoirDto>> {
    return this.AvoirsApiFindAllGETResponse().pipe(__map((_r) => _r.body as Array<AvoirDto>));
  }

  AvoirsApiFindByIdGETResponse(id: number): __Observable<__StrictHttpResponse<AvoirDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `v1/avoirs/${encodeURIComponent(String(id))}`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json',
    });
    return this.http.request<any>(req).pipe(__filter((_r) => _r instanceof HttpResponse), __map((_r) => _r as __StrictHttpResponse<AvoirDto>));
  }

  AvoirsApiFindByIdGET(id: number): __Observable<AvoirDto> {
    return this.AvoirsApiFindByIdGETResponse(id).pipe(__map((_r) => _r.body as AvoirDto));
  }

  AvoirsApiFindByVenteGETResponse(venteId: number): __Observable<__StrictHttpResponse<Array<AvoirDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `v1/avoirs/vente/${encodeURIComponent(String(venteId))}`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json',
    });
    return this.http.request<any>(req).pipe(__filter((_r) => _r instanceof HttpResponse), __map((_r) => _r as __StrictHttpResponse<Array<AvoirDto>>));
  }

  AvoirsApiFindByVenteGET(venteId: number): __Observable<Array<AvoirDto>> {
    return this.AvoirsApiFindByVenteGETResponse(venteId).pipe(__map((_r) => _r.body as Array<AvoirDto>));
  }

  AvoirsApiFindByClientGETResponse(clientId: number): __Observable<__StrictHttpResponse<Array<AvoirDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `v1/avoirs/client/${encodeURIComponent(String(clientId))}`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json',
    });
    return this.http.request<any>(req).pipe(__filter((_r) => _r instanceof HttpResponse), __map((_r) => _r as __StrictHttpResponse<Array<AvoirDto>>));
  }

  AvoirsApiFindByClientGET(clientId: number): __Observable<Array<AvoirDto>> {
    return this.AvoirsApiFindByClientGETResponse(clientId).pipe(__map((_r) => _r.body as Array<AvoirDto>));
  }

  AvoirsApiFindByDateRangeGETResponse(startDate?: string, endDate?: string): __Observable<__StrictHttpResponse<Array<AvoirDto>>> {
    let __params = this.newParams();
    if (startDate) __params = __params.set('debut', startDate);
    if (endDate) __params = __params.set('fin', endDate);
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + 'v1/avoirs/date-range', __body, {
      headers: __headers,
      params: __params,
      responseType: 'json',
    });
    return this.http.request<any>(req).pipe(__filter((_r) => _r instanceof HttpResponse), __map((_r) => _r as __StrictHttpResponse<Array<AvoirDto>>));
  }

  AvoirsApiFindByDateRangeGET(startDate?: string, endDate?: string): __Observable<Array<AvoirDto>> {
    return this.AvoirsApiFindByDateRangeGETResponse(startDate, endDate).pipe(__map((_r) => _r.body as Array<AvoirDto>));
  }

  AvoirsApiDELETEResponse(id: number): __Observable<__StrictHttpResponse<null>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('DELETE', this.rootUrl + `v1/avoirs/delete/${encodeURIComponent(String(id))}`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'json',
    });
    return this.http.request<any>(req).pipe(__filter((_r) => _r instanceof HttpResponse), __map((_r) => _r as __StrictHttpResponse<null>));
  }

  AvoirsApiDELETE(id: number): __Observable<null> {
    return this.AvoirsApiDELETEResponse(id).pipe(__map((_r) => _r.body as null));
  }
}

export { AvoirsService };