import { DashboardService as ApiDashboardService, DashboardStatsDto, VenteStatsDto, ArticleStatsDto, InventoryStatsDto, RotationStockDto, AnalyseStockDto } from 'src/gs-api/src/services/dashboard.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private dashboardService: ApiDashboardService) { }

  getStats(): Observable<DashboardStatsDto> {
    return this.dashboardService.getStats();
  }

  getVentesPeriode(startDate?: string, endDate?: string): Observable<Array<VenteStatsDto>> {
    return this.dashboardService.getVentesPeriode(startDate, endDate);
  }

  getChiffreAffairesMois(): Observable<Array<VenteStatsDto>> {
    return this.dashboardService.getChiffreAffairesMois();
  }

  getTopArticles(limit?: number): Observable<Array<ArticleStatsDto>> {
    return this.dashboardService.getTopArticles(limit);
  }

  getInventoryStats(): Observable<InventoryStatsDto> {
    return this.dashboardService.getInventoryStats();
  }

  getRotationStock(startDate?: string, endDate?: string): Observable<Array<RotationStockDto>> {
    return this.dashboardService.getRotationStock(startDate, endDate);
  }

  getAnalyseStock(): Observable<AnalyseStockDto> {
    return this.dashboardService.getAnalyseStock();
  }
}