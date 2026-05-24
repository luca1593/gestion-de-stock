import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardStatsDto, VenteStatsDto, ArticleStatsDto } from 'src/app/services/dashboard/dashboard.service';

@Component({
  selector: 'app-page-statistiques',
  templateUrl: './page-statistiques.component.html',
  styleUrls: ['./page-statistiques.component.css']
})
export class PageStatistiquesComponent implements OnInit {

  stats: DashboardStatsDto | null = null;
  chiffreAffairesData: VenteStatsDto[] = [];
  topArticles: ArticleStatsDto[] = [];
  
  commandesClientData: any[] = [];
  commandesFournisseurData: any[] = [];
  mvtStockData: any[] = [];
  
  maxVente: number = 0;
  maxCommandeClient: number = 0;
  maxCommandeFournisseur: number = 0;
  maxMvtStock: number = 0;

  rotationStock: number = 0;
  tauxService: number = 0;
  tauxRupture: number = 0;
  couvertureStock: number = 0;

  selectedChartType: string = 'ventes';
  loading = true;
  apiCallsPending = 0;

  constructor(
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.apiCallsPending = 5;
    this.loadStats();
    this.loadChiffreAffairesMois();
    this.loadTopArticles();
    this.loadCommandesStats();
    this.loadMvtStockStats();
  }

  private checkLoadingComplete(): void {
    this.apiCallsPending--;
    if (this.apiCallsPending <= 0) {
      this.loading = false;
    }
  }

  loadStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.calculateKPIs();
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Erreur chargement stats', err);
        this.checkLoadingComplete();
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
        if (data && Array.isArray(data)) {
          this.chiffreAffairesData = this.aggregateByMonth(data);
          this.maxVente = this.chiffreAffairesData.length > 0 
            ? Math.max(...this.chiffreAffairesData.map(d => d.chiffreAffaires || d.totalVentes || 0), 1) 
            : 1;
        } else {
          this.chiffreAffairesData = [];
          this.maxVente = 1;
        }
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Erreur chargement CA', err);
        this.chiffreAffairesData = [];
        this.maxVente = 1;
        this.checkLoadingComplete();
      }
    });
  }

  loadTopArticles(): void {
    this.dashboardService.getTopArticles(10).subscribe({
      next: (data) => {
        this.topArticles = data || [];
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Erreur chargement top articles', err);
        this.checkLoadingComplete();
      }
    });
  }

  loadCommandesStats(): void {
    this.dashboardService.getCommandesClientStats().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.commandesClientData = data;
          this.maxCommandeClient = data.length;
        }
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Erreur chargement commandes client', err);
        this.checkLoadingComplete();
      }
    });

    this.dashboardService.getCommandesFournisseurStats().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.commandesFournisseurData = data;
          this.maxCommandeFournisseur = data.length;
        }
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Erreur chargement commandes fournisseur', err);
        this.checkLoadingComplete();
      }
    });
  }

  loadMvtStockStats(): void {
    this.dashboardService.getMvtStockStats().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.mvtStockData = data;
          this.maxMvtStock = data.length;
        }
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Erreur chargement mvt stock', err);
        this.checkLoadingComplete();
      }
    });
  }

  onPeriodeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedChartType = value;
  }

  formatNumber(value: number | undefined): string {
    if (value === undefined || value === null) return '0';
    return value.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  getBarHeight(item: any, max: number): number {
    const value = item?.chiffreAffaires || item?.nbVentes || item?.totalVentes || item?.quantite || item?.total || 0;
    if (!value || max === 0) return 5;
    const percentage = (value / max) * 100;
    return Math.min(percentage, 100);
  }

  getMonthLabel(item: any): string {
    const periode = item?.periode || item?.dateCommande || item?.dateMvt || '';
    if (!periode) return '';
    
    if (typeof periode === 'string' && periode.includes('/')) {
      const parts = periode.split(/[\/\s]/);
      if (parts.length >= 2) {
        const month = parseInt(parts[1]);
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        if (month >= 1 && month <= 12) {
          return months[month - 1];
        }
      }
    }
    return String(periode).substring(0, 7);
  }

  getCurrentChartData(): any[] {
    switch (this.selectedChartType) {
      case 'commandes-client': return this.commandesClientData;
      case 'commandes-fournisseur': return this.commandesFournisseurData;
      case 'mvt-stock': return this.mvtStockData;
      default: return this.chiffreAffairesData;
    }
  }

  getCurrentMaxValue(): number {
    switch (this.selectedChartType) {
      case 'commandes-client': return this.maxCommandeClient || 1;
      case 'commandes-fournisseur': return this.maxCommandeFournisseur || 1;
      case 'mvt-stock': return this.maxMvtStock || 1;
      default: return this.maxVente || 1;
    }
  }

  getChartTitle(): string {
    switch (this.selectedChartType) {
      case 'commandes-client': return 'Commandes Clients';
      case 'commandes-fournisseur': return 'Commandes Fournisseurs';
      case 'mvt-stock': return 'Mouvements de Stock';
      default: return 'Chiffre d\'Affaires par Mois';
    }
  }

  getChartUnit(): string {
    switch (this.selectedChartType) {
      case 'commandes-client':
      case 'commandes-fournisseur':
      case 'mvt-stock': return '';
      default: return ' €';
    }
  }

  getItemValue(item: any): number {
    return item?.chiffreAffaires || item?.totalVentes || item?.nbVentes || item?.quantite || 0;
  }

  private aggregateByMonth(data: any[]): any[] {
    const groups = new Map<string, { periode: string; chiffreAffaires: number; nbVentes: number }>();
    data.forEach(d => {
      if (!d.periode) return;
      const datePart = d.periode.split(' ')[0];
      const [day, month, year] = datePart.split('/');
      const key = `${month}/${year}`;
      const existing = groups.get(key) || { periode: `01/${key}`, chiffreAffaires: 0, nbVentes: 0 };
      existing.chiffreAffaires += (d.chiffreAffaires || 0);
      existing.nbVentes += (d.nbVentes || 0);
      groups.set(key, existing);
    });
    const toMonthNum = (p: string) => {
      const [m, y] = p.split('/');
      return parseInt(y) * 12 + parseInt(m);
    };
    return Array.from(groups.values()).sort((a, b) => toMonthNum(a.periode) - toMonthNum(b.periode));
  }
}