import { DashboardService as ApiDashboardService, DashboardStatsDto, VenteStatsDto, ArticleStatsDto } from 'src/gs-api/src/services/dashboard.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  constructor(private dashboardService: ApiDashboardService) { }

  getStats(): Observable<DashboardStatsDto> {
    return this.dashboardService.getStats();
  }

  getVentesPeriode(startDate?: string, endDate?: string): Observable<Array<VenteStatsDto>> {
    return this.dashboardService.getVentesPeriode(
      startDate ? formatDateForBackend(startDate) : undefined,
      endDate ? formatDateForBackend(endDate) : undefined
    );
  }

  getChiffreAffairesMois(): Observable<Array<VenteStatsDto>> {
    return this.dashboardService.getChiffreAffairesMois();
  }

  getTopArticles(limit?: number): Observable<Array<ArticleStatsDto>> {
    return this.dashboardService.getTopArticles(limit);
  }

  // Endpoints non disponibles sur le backend (404)
  // getInventoryStats(): Observable<InventoryStatsDto> {
  //   return this.dashboardService.getInventoryStats();
  // }

  // getRotationStock(startDate?: string, endDate?: string): Observable<Array<RotationStockDto>> {
  //   return this.dashboardService.getRotationStock(startDate, endDate);
  // }

  // getAnalyseStock(): Observable<AnalyseStockDto> {
  //   return this.dashboardService.getAnalyseStock();
  // }
}