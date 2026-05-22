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
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${d.getFullYear()} ${hours}:${minutes}:${seconds}`;
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

  getStats(): Observable<DashboardStatsDto> {
    return this.http.get<DashboardStatsDto>(`${this.rootUrl}v1/dashboard/stats`);
  }

  getVentesPeriode(debut?: string, fin?: string): Observable<Array<VenteStatsDto>> {
    let params = new HttpParams();
    if (debut) {
      params = params.set('debut', formatDateForBackend(debut));
    }
    if (fin) {
      params = params.set('fin', formatDateForBackend(fin));
    }
    return this.http.get<Array<VenteStatsDto>>(`${this.rootUrl}v1/dashboard/ventes/periode`, { params });
  }

  getChiffreAffairesMois(): Observable<Array<VenteStatsDto>> {
    return this.http.get<Array<VenteStatsDto>>(`${this.rootUrl}v1/dashboard/chiffre-affaires/mois`);
  }

  getTopArticles(limit?: number): Observable<Array<ArticleStatsDto>> {
    let params = new HttpParams();
    if (limit) {
      params = params.set('limit', String(limit));
    }
    return this.http.get<Array<ArticleStatsDto>>(`${this.rootUrl}v1/dashboard/articles/top`, { params });
  }

  getCommandesClientStats(): Observable<any> {
    return this.http.get<any>(`${this.rootUrl}v1/commande-client/all`);
  }

  getCommandesFournisseurStats(): Observable<any> {
    return this.http.get<any>(`${this.rootUrl}v1/commande-fournisseur/all`);
  }

  getMvtStockStats(): Observable<any> {
    return this.http.get<any>(`${this.rootUrl}v1/mvtstk/all`);
  }
}