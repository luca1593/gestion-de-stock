import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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
}

function formatDateForBackend(date: Date | string): string {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient
  ) { }

  private get rootUrl(): string {
    let url = environment.apiUrl;
    if (url && !url.endsWith('/')) {
      url += '/';
    }
    return url;
  }

  private addDateParams(params: HttpParams, debut?: string, fin?: string): HttpParams {
    if (debut) { params = params.set('debut', formatDateForBackend(debut)); }
    if (fin) { params = params.set('fin', formatDateForBackend(fin)); }
    return params;
  }

  getStats(debut?: string, fin?: string): Observable<DashboardStatsDto> {
    let params = new HttpParams();
    params = this.addDateParams(params, debut, fin);
    return this.http.get<DashboardStatsDto>(`${this.rootUrl}v1/dashboard/stats`, { params });
  }

  getVentesPeriode(debut?: string, fin?: string): Observable<Array<VenteStatsDto>> {
    let params = new HttpParams();
    params = this.addDateParams(params, debut, fin);
    return this.http.get<Array<VenteStatsDto>>(`${this.rootUrl}v1/dashboard/ventes/periode`, { params });
  }

  getChiffreAffairesMois(debut?: string, fin?: string): Observable<Array<VenteStatsDto>> {
    let params = new HttpParams();
    params = this.addDateParams(params, debut, fin);
    return this.http.get<Array<VenteStatsDto>>(`${this.rootUrl}v1/dashboard/chiffre-affaires/mois`, { params });
  }

  getTopArticles(limit?: number, debut?: string, fin?: string): Observable<Array<ArticleStatsDto>> {
    let params = new HttpParams();
    if (limit) { params = params.set('limit', String(limit)); }
    params = this.addDateParams(params, debut, fin);
    return this.http.get<Array<ArticleStatsDto>>(`${this.rootUrl}v1/dashboard/articles/top`, { params });
  }

  getCommandesClientStats(debut?: string, fin?: string): Observable<any> {
    let params = new HttpParams();
    params = this.addDateParams(params, debut, fin);
    return this.http.get<any>(`${this.rootUrl}v1/commande-client/all`, { params });
  }

  getCommandesFournisseurStats(debut?: string, fin?: string): Observable<any> {
    let params = new HttpParams();
    params = this.addDateParams(params, debut, fin);
    return this.http.get<any>(`${this.rootUrl}v1/commande-fournisseur/all`, { params });
  }

  getMvtStockStats(debut?: string, fin?: string): Observable<any> {
    let params = new HttpParams();
    params = this.addDateParams(params, debut, fin);
    return this.http.get<any>(`${this.rootUrl}v1/mvtstk/all`, { params });
  }
}