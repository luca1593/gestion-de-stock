/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../base-service';
import { ApiConfiguration as __Configuration } from '../api-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

export interface DashboardStatsDto {
  totalArticles?: number;
  totalClients?: number;
  totalFournisseurs?: number;
  totalCommandesClient?: number;
  totalCommandesFournisseur?: number;
  totalVentes?: number;
  chiffreAffaires?: number;
  valeurStock?: number;
  articlesStockBas?: number;
  commandesEnAttente?: number;
}

export interface InventoryStatsDto {
  valeurInventaire?: number;
  valeurStockSortie?: number;
  valeurStockExcedentaire?: number;
  valeurStockManquant?: number;
  valeurStockExcedentairePourcentage?: number;
  quantiteFluxNet?: number;
  quantiteFluxEntrant?: number;
  quantiteFluxSortant?: number;
  positionsRuptureStock?: number;
  positionsRuptureStockPourcentage?: number;
  positionsSousSecurite?: number;
  positionsSousSecuritePourcentage?: number;
  nombreJoursAvantSortie?: number;
}

export interface RotationStockDto {
  articleId?: number;
  codeArticle?: string;
  designation?: string;
  categorie?: string;
  valeurStock?: number;
  valeurSortie?: number;
  tauxRotation?: number;
  joursCouverture?: number;
}

export interface AnalyseStockDto {
  totalArticles?: number;
  articlesEnStock?: number;
  articlesRupture?: number;
  articlesSousSecurite?: number;
  articlesExcedent?: number;
  valeurTotaleStock?: number;
  valeurMoyenneArticle?: number;
  stockMoyen?: number;
  rotationMoyenne?: number;
}

export interface VenteStatsDto {
  periode?: string;
  nbVentes?: number;
  totalVentes?: number;
  chiffreAffaires?: number;
}

export interface ArticleStatsDto {
  articleId?: number;
  codeArticle?: string;
  designation?: string;
  stock?: number;
  prixUnitaire?: number;
  category?: string;
  nbVentes?: number;
  nbCommandesClient?: number;
  nbCommandesFournisseur?: number;
}

@Injectable({
  providedIn: 'root',
})
class DashboardService extends __BaseService {
  constructor(
    config: __Configuration,
    http: HttpClient
  ) {
    super(config, http);
  }

  getStatsResponse(): __Observable<__StrictHttpResponse<DashboardStatsDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `v1/dashboard/stats`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });
    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<DashboardStatsDto>;
      })
    );
  }

  getStats(): __Observable<DashboardStatsDto> {
    return this.getStatsResponse().pipe(
      __map(_r => _r.body as DashboardStatsDto)
    );
  }

  getVentesPeriodeResponse(startDate?: string, endDate?: string): __Observable<__StrictHttpResponse<Array<VenteStatsDto>>> {
    let __params = this.newParams();
    if (startDate) __params = __params.set('startDate', startDate);
    if (endDate) __params = __params.set('endDate', endDate);
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `v1/dashboard/ventes/periode`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });
    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<VenteStatsDto>>;
      })
    );
  }

  getVentesPeriode(startDate?: string, endDate?: string): __Observable<Array<VenteStatsDto>> {
    return this.getVentesPeriodeResponse(startDate, endDate).pipe(
      __map(_r => _r.body as Array<VenteStatsDto>)
    );
  }

  getChiffreAffairesMoisResponse(): __Observable<__StrictHttpResponse<Array<VenteStatsDto>>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `v1/dashboard/chiffre-affaires/mois`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });
    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<VenteStatsDto>>;
      })
    );
  }

  getChiffreAffairesMois(): __Observable<Array<VenteStatsDto>> {
    return this.getChiffreAffairesMoisResponse().pipe(
      __map(_r => _r.body as Array<VenteStatsDto>)
    );
  }

  getTopArticlesResponse(limit?: number): __Observable<__StrictHttpResponse<Array<ArticleStatsDto>>> {
    let __params = this.newParams();
    if (limit) __params = __params.set('limit', String(limit));
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `v1/dashboard/articles/top`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });
    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<ArticleStatsDto>>;
      })
    );
  }

  getTopArticles(limit?: number): __Observable<Array<ArticleStatsDto>> {
    return this.getTopArticlesResponse(limit).pipe(
      __map(_r => _r.body as Array<ArticleStatsDto>)
    );
  }

  getInventoryStatsResponse(): __Observable<__StrictHttpResponse<InventoryStatsDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `v1/dashboard/inventory/stats`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });
    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<InventoryStatsDto>;
      })
    );
  }

  getInventoryStats(): __Observable<InventoryStatsDto> {
    return this.getInventoryStatsResponse().pipe(
      __map(_r => _r.body as InventoryStatsDto)
    );
  }

  getRotationStockResponse(startDate?: string, endDate?: string): __Observable<__StrictHttpResponse<Array<RotationStockDto>>> {
    let __params = this.newParams();
    if (startDate) __params = __params.set('startDate', startDate);
    if (endDate) __params = __params.set('endDate', endDate);
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `v1/dashboard/rotation-stock`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });
    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<Array<RotationStockDto>>;
      })
    );
  }

  getRotationStock(startDate?: string, endDate?: string): __Observable<Array<RotationStockDto>> {
    return this.getRotationStockResponse(startDate, endDate).pipe(
      __map(_r => _r.body as Array<RotationStockDto>)
    );
  }

  getAnalyseStockResponse(): __Observable<__StrictHttpResponse<AnalyseStockDto>> {
    let __params = this.newParams();
    let __headers = new HttpHeaders();
    let __body: any = null;
    let req = new HttpRequest<any>(
      'GET',
      this.rootUrl + `v1/dashboard/analyse-stock`,
      __body,
      {
        headers: __headers,
        params: __params,
        responseType: 'json'
      });
    return this.http.request<any>(req).pipe(
      __filter(_r => _r instanceof HttpResponse),
      __map((_r) => {
        return _r as __StrictHttpResponse<AnalyseStockDto>;
      })
    );
  }

  getAnalyseStock(): __Observable<AnalyseStockDto> {
    return this.getAnalyseStockResponse().pipe(
      __map(_r => _r.body as AnalyseStockDto)
    );
  }
}

module DashboardService {
}

export { DashboardService }