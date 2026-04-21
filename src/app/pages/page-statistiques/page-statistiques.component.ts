import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardStatsDto, VenteStatsDto, ArticleStatsDto } from 'src/gs-api/src/services/dashboard.service';

@Component({
  selector: 'app-page-statistiques',
  templateUrl: './page-statistiques.component.html',
  styleUrls: ['./page-statistiques.component.css']
})
export class PageStatistiquesComponent implements OnInit {

  stats: DashboardStatsDto | null = null;
  chiffreAffairesData: VenteStatsDto[] = [];
  topArticles: ArticleStatsDto[] = [];
  
  maxVente: number = 0;

  rotationStock: number = 0;
  tauxService: number = 0;
  tauxRupture: number = 0;
  couvertureStock: number = 0;

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.loadStats();
    this.loadChiffreAffairesMois();
    this.loadTopArticles();
  }

  loadStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.calculateKPIs();
      },
      error: (err) => {
        console.error('Erreur chargement stats', err);
      }
    });
  }

  calculateKPIs(): void {
    if (!this.stats) return;
    
    const ca = this.stats.chiffreAffaires || 0;
    const valeurStock = this.stats.valeurStock || 1;
    
    this.rotationStock = ca > 0 ? parseFloat((ca / valeurStock).toFixed(2)) : 0;
    
    const cmdClient = this.stats.totalCommandesClient || 0;
    const cmdEnAttente = this.stats.commandesEnAttente || 0;
    this.tauxService = cmdClient > 0 ? parseFloat(((cmdClient - cmdEnAttente) / cmdClient * 100).toFixed(1)) : 100;
    
    const articlesBas = this.stats.articlesStockBas || 0;
    const totalArticles = this.stats.totalArticles || 1;
    this.tauxRupture = parseFloat((articlesBas / totalArticles * 100).toFixed(1));
    
    const dailySales = ca / 30;
    this.couvertureStock = dailySales > 0 ? parseFloat((valeurStock / dailySales).toFixed(1)) : 0;
  }

  loadChiffreAffairesMois(): void {
    console.log('Loading chiffre affaires...');
    this.dashboardService.getChiffreAffairesMois().subscribe({
      next: (data) => {
        console.log('CA mois API response:', JSON.stringify(data));
        if (data && Array.isArray(data)) {
          this.chiffreAffairesData = data;
          this.maxVente = data.length > 0 
            ? Math.max(...data.map(d => d.chiffreAffaires || d.totalVentes || 0), 1) 
            : 1;
        } else {
          console.log('CA data empty or invalid:', data);
          this.chiffreAffairesData = [];
          this.maxVente = 1;
        }
      },
      error: (err) => {
        console.error('Erreur chargement CA', err);
        console.log('CA error response:', err);
        this.chiffreAffairesData = [];
        this.maxVente = 1;
      }
    });
  }

  loadTopArticles(): void {
    this.dashboardService.getTopArticles(10).subscribe({
      next: (data) => {
        this.topArticles = data || [];
      },
      error: (err) => {
        console.error('Erreur chargement top articles', err);
      }
    });
  }

  onPeriodeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    console.log('Période sélectionnée:', value);
    this.loadChiffreAffairesMois();
  }

  formatNumber(value: number | undefined): string {
    if (value === undefined || value === null) return '0';
    return value.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  getBarHeight(item: any): number {
    const value = item?.chiffreAffaires || item?.totalVentes || 0;
    if (!value || this.maxVente === 0) return 5;
    return (value / this.maxVente) * 100;
  }

  getMonthLabel(item: any): string {
    const periode = item?.periode;
    if (!periode) return '';
    
    // Format from backend: "10/04/2026 11:34:05" or "2026-04"
    const parts = periode.split(/[\/\s]/);
    if (parts.length >= 2) {
      const month = parseInt(parts[1]);
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
      if (month >= 1 && month <= 12) {
        return months[month - 1];
      }
    }
    return periode.substring(0, 7);
  }
}