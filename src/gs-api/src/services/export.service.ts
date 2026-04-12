/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
class ExportService extends __BaseService {
  static readonly ExportApiExcelArticlesGETPath = 'v1/export/excel/articles';
  static readonly ExportApiExcelClientsGETPath = 'v1/export/excel/clients';
  static readonly ExportApiExcelFournisseursGETPath = 'v1/export/excel/fournisseurs';
  static readonly ExportApiExcelCommandesClientGETPath = 'v1/export/excel/commandes-client';
  static readonly ExportApiExcelStockGETPath = 'v1/export/excel/stock';
  static readonly ExportApiExcelVentesGETPath = 'v1/export/excel/ventes';
  static readonly ExportApiPdfAvoirGETPath = 'v1/export/pdf/avoir/{id}';

  constructor(config: __Configuration, http: HttpClient) {
    super(config, http);
  }

  ExportApiExcelArticlesGETResponse(): __Observable<__StrictHttpResponse<Blob>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + 'v1/export/excel/articles', __body, {
      headers: __headers,
      params: __params,
      responseType: 'blob',
    });
    return this.http.request<any>(req).pipe(__filter((_r) => _r instanceof HttpResponse), __map((_r) => _r as __StrictHttpResponse<Blob>));
  }

  ExportApiExcelArticlesGET(): __Observable<Blob> {
    return this.ExportApiExcelArticlesGETResponse().pipe(__map((_r) => _r.body as Blob));
  }

  ExportApiExcelClientsGETResponse(): __Observable<__StrictHttpResponse<Blob>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + 'v1/export/excel/clients', __body, {
      headers: __headers,
      params: __params,
      responseType: 'blob',
    });
    return this.http.request<any>(req).pipe(__filter((_r) => _r instanceof HttpResponse), __map((_r) => _r as __StrictHttpResponse<Blob>));
  }

  ExportApiExcelClientsGET(): __Observable<Blob> {
    return this.ExportApiExcelClientsGETResponse().pipe(__map((_r) => _r.body as Blob));
  }

  ExportApiExcelFournisseursGETResponse(): __Observable<__StrictHttpResponse<Blob>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + 'v1/export/excel/fournisseurs', __body, {
      headers: __headers,
      params: __params,
      responseType: 'blob',
    });
    return this.http.request<any>(req).pipe(__filter((_r) => _r instanceof HttpResponse), __map((_r) => _r as __StrictHttpResponse<Blob>));
  }

  ExportApiExcelFournisseursGET(): __Observable<Blob> {
    return this.ExportApiExcelFournisseursGETResponse().pipe(__map((_r) => _r.body as Blob));
  }

  ExportApiExcelCommandesClientGETResponse(): __Observable<__StrictHttpResponse<Blob>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + 'v1/export/excel/commandes-client', __body, {
      headers: __headers,
      params: __params,
      responseType: 'blob',
    });
    return this.http.request<any>(req).pipe(__filter((_r) => _r instanceof HttpResponse), __map((_r) => _r as __StrictHttpResponse<Blob>));
  }

  ExportApiExcelCommandesClientGET(): __Observable<Blob> {
    return this.ExportApiExcelCommandesClientGETResponse().pipe(__map((_r) => _r.body as Blob));
  }

  ExportApiExcelStockGETResponse(): __Observable<__StrictHttpResponse<Blob>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + 'v1/export/excel/stock', __body, {
      headers: __headers,
      params: __params,
      responseType: 'blob',
    });
    return this.http.request<any>(req).pipe(__filter((_r) => _r instanceof HttpResponse), __map((_r) => _r as __StrictHttpResponse<Blob>));
  }

  ExportApiExcelStockGET(): __Observable<Blob> {
    return this.ExportApiExcelStockGETResponse().pipe(__map((_r) => _r.body as Blob));
  }

  ExportApiExcelVentesGETResponse(): __Observable<__StrictHttpResponse<Blob>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + 'v1/export/excel/ventes', __body, {
      headers: __headers,
      params: __params,
      responseType: 'blob',
    });
    return this.http.request<any>(req).pipe(__filter((_r) => _r instanceof HttpResponse), __map((_r) => _r as __StrictHttpResponse<Blob>));
  }

  ExportApiExcelVentesGET(): __Observable<Blob> {
    return this.ExportApiExcelVentesGETResponse().pipe(__map((_r) => _r.body as Blob));
  }

  ExportApiPdfAvoirGETResponse(id: number): __Observable<__StrictHttpResponse<Blob>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>('GET', this.rootUrl + `v1/export/pdf/avoir/${encodeURIComponent(String(id))}`, __body, {
      headers: __headers,
      params: __params,
      responseType: 'blob',
    });
    return this.http.request<any>(req).pipe(__filter((_r) => _r instanceof HttpResponse), __map((_r) => _r as __StrictHttpResponse<Blob>));
  }

  ExportApiPdfAvoirGET(id: number): __Observable<Blob> {
    return this.ExportApiPdfAvoirGETResponse(id).pipe(__map((_r) => _r.body as Blob));
  }

  downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}

export { ExportService };