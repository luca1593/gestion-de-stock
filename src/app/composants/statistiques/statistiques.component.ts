import { Component, OnInit } from '@angular/core';
import { DashboardService, InventoryStatsDto, RotationStockDto, AnalyseStockDto } from 'src/gs-api/src/services/dashboard.service';

@Component({
  selector: 'app-statistiques',
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.css']
})
export class StatistiquesComponent implements OnInit {

  inventoryStats: InventoryStatsDto | null = null;
  analyseStock: AnalyseStockDto | null = null;
  rotationStockData: RotationStockDto[] = [];
  
  loading: boolean = true;
  error: string = '';

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.loadInventoryStats();
    this.loadAnalyseStock();
    this.loadRotationStock();
  }

  loadInventoryStats(): void {
    this.dashboardService.getInventoryStats().subscribe({
      next: (data) => {
        this.inventoryStats = data;
      },
      error: (err) => {
        console.error('Erreur chargement stats inventaire', err);
      }
    });
  }

  loadAnalyseStock(): void {
    this.dashboardService.getAnalyseStock().subscribe({
      next: (data) => {
        this.analyseStock = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur chargement analyse stock', err);
        this.loading = false;
      }
    });
  }

  loadRotationStock(): void {
    this.dashboardService.getRotationStock().subscribe({
      next: (data) => {
        this.rotationStockData = data || [];
      },
      error: (err) => {
        console.error('Erreur chargement rotation stock', err);
      }
    });
  }

  formatNumber(value: number | undefined): string {
    if (value === undefined || value === null) return '0';
    return value.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  formatPercent(value: number | undefined): string {
    if (value === undefined || value === null) return '0%';
    return value.toFixed(1) + '%';
  }

  getRotationClass(taux: number | undefined): string {
    if (!taux) return 'text-muted';
    if (taux >= 4) return 'text-success';
    if (taux >= 2) return 'text-warning';
    return 'text-danger';
  }
}
