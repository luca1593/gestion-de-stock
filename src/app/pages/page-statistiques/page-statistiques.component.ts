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
    this.dashboardService.getChiffreAffairesMois().subscribe({
      next: (data) => {
        this.chiffreAffairesData = data || [];
        this.maxVente = Math.max(...this.chiffreAffairesData.map(d => d.totalVentes || 0), 1);
      },
      error: (err) => {
        console.error('Erreur chargement CA', err);
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

  getBarHeight(value: number | undefined): number {
    if (!value || this.maxVente === 0) return 5;
    return (value / this.maxVente) * 100;
  }

  getMonthLabel(periode: string | undefined): string {
    if (!periode) return '';
    const parts = periode.split('-');
    if (parts.length >= 2) {
      const month = parseInt(parts[1]);
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
      return months[month - 1] || periode;
    }
    return periode;
  }
}