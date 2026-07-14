import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DashboardService, DashboardStatsDto, VenteStatsDto, ArticleStatsDto } from 'src/app/services/dashboard/dashboard.service';
import { SortState, sortByProperty } from 'src/app/composants/sort-utils';

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

  periodeFiltre: string = 'mois';
  dateDebut: string = '';
  dateFin: string = '';
  filtreLabel: string = 'Ce mois-ci';
  groupUnit: 'day' | 'week' | 'month' = 'month';

  sortState: SortState = { column: '', direction: 'asc' };

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.apiCallsPending = 5;
    this.setPeriode('mois');
  }

  setPeriode(type: string, debut?: string, fin?: string): void {
    this.periodeFiltre = type;
    const now = new Date();
    
    switch (type) {
      case 'semaine': {
        const mon = new Date(now);
        mon.setDate(now.getDate() - ((now.getDay() + 6) % 7));
        this.dateDebut = mon.toISOString().split('T')[0];
        this.dateFin = now.toISOString().split('T')[0];
        this.filtreLabel = 'Cette semaine';
        this.groupUnit = 'day';
        break;
      }
      case 'mois': {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        this.dateDebut = monthStart.toISOString().split('T')[0];
        this.dateFin = now.toISOString().split('T')[0];
        this.filtreLabel = 'Ce mois-ci';
        this.groupUnit = 'week';
        break;
      }
      case 'annee': {
        const yearStart = new Date(now.getFullYear(), 0, 1);
        this.dateDebut = yearStart.toISOString().split('T')[0];
        this.dateFin = now.toISOString().split('T')[0];
        this.filtreLabel = 'Cette année';
        this.groupUnit = 'month';
        break;
      }
      case 'custom': {
        this.dateDebut = debut || '';
        this.dateFin = fin || '';
        this.filtreLabel = this.dateDebut && this.dateFin
          ? `Du ${this.dateDebut} au ${this.dateFin}`
          : 'Période personnalisée';
        this.groupUnit = this.guessGroupUnit(this.dateDebut, this.dateFin);
        break;
      }
      default: {
        this.dateDebut = '';
        this.dateFin = '';
        this.filtreLabel = 'Tout';
        this.groupUnit = 'month';
      }
    }
    
    this.loading = true;
    this.apiCallsPending = 5;
    this.loadStats();
    this.loadChiffreAffairesMois();
    this.loadTopArticles();
    this.loadCommandesStats();
    this.loadMvtStockStats();
  }

  private guessGroupUnit(debut: string, fin: string): 'day' | 'week' | 'month' {
    if (!debut || !fin) return 'month';
    const d1 = new Date(debut);
    const d2 = new Date(fin);
    const diffDays = Math.ceil((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24));
    if (diffDays <= 7) return 'day';
    if (diffDays <= 60) return 'week';
    return 'month';
  }

  private checkLoadingComplete(): void {
    this.apiCallsPending--;
    if (this.apiCallsPending <= 0) {
      this.computeFilteredStats();
      this.calculateKPIs();
      this.loading = false;
    }
  }

  private computeFilteredStats(): void {
    if (!this.stats) return;

    if (this.dateDebut && this.dateFin) {
      const caTotal = this.chiffreAffairesData.reduce((sum, d) => sum + (d.chiffreAffaires || d.totalVentes || 0), 0);
      const nbVentesTotal = this.chiffreAffairesData.reduce((sum, d) => sum + (d.nbVentes || 0), 0);

      this.stats = {
        ...this.stats,
        chiffreAffaires: caTotal,
        totalVentes: nbVentesTotal || this.commandesClientData.length,
        totalCommandesClient: this.commandesClientData.length,
        totalCommandesFournisseur: this.commandesFournisseurData.length,
      };

      const clientIds = new Set<number>();
      this.commandesClientData.forEach((cmd: any) => {
        if (cmd.client?.id) clientIds.add(cmd.client.id);
      });
      if (clientIds.size > 0) this.stats.totalClients = clientIds.size;

      const fournisseurIds = new Set<number>();
      this.commandesFournisseurData.forEach((cmd: any) => {
        if (cmd.fournisseur?.id) fournisseurIds.add(cmd.fournisseur.id);
      });
      if (fournisseurIds.size > 0) this.stats.totalFournisseurs = fournisseurIds.size;
    }
  }

  loadStats(): void {
    this.dashboardService.getStats(this.dateDebut || undefined, this.dateFin || undefined).subscribe({
      next: (data) => {
        this.stats = data;
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
    const obs = this.dateDebut && this.dateFin
      ? this.dashboardService.getVentesPeriode(this.dateDebut, this.dateFin)
      : this.dashboardService.getChiffreAffairesMois(this.dateDebut || undefined, this.dateFin || undefined);
    obs.subscribe({
      next: (data) => {
        if (data && Array.isArray(data)) {
          this.chiffreAffairesData = this.groupChartData(data);
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
    this.dashboardService.getTopArticles(10, this.dateDebut || undefined, this.dateFin || undefined).subscribe({
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
    this.dashboardService.getCommandesClientStats(this.dateDebut || undefined, this.dateFin || undefined).subscribe({
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

    this.dashboardService.getCommandesFournisseurStats(this.dateDebut || undefined, this.dateFin || undefined).subscribe({
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
    this.dashboardService.getMvtStockStats(this.dateDebut || undefined, this.dateFin || undefined).subscribe({
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

  sort(column: string): void {
    if (this.sortState.column === column) {
      this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortState.column = column;
      this.sortState.direction = 'asc';
    }
    this.applySort();
    this.cdr.markForCheck();
  }

  private applySort(): void {
    if (this.sortState.column) {
      this.topArticles = sortByProperty(this.topArticles, this.sortState.column, this.sortState.direction);
    }
  }

  onPeriodeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedChartType = value;
  }

  formatNumber(value: number | undefined): string {
    if (value === undefined || value === null) return '0';
    return value.toLocaleString('fr-FR', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  getMonthLabel(item: any): string {
    const raw = item?.periode || item?.dateCommande || item?.dateMvt || '';
    if (!raw) return '';
    const dt = this.parsePeriode(raw);
    if (!dt) return raw.substring(0, 7);
    if (this.groupUnit === 'day') {
      const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
      return days[dt.getDay()] + ' ' + dt.getDate();
    }
    if (this.groupUnit === 'week') {
      return item?.periode || `Sem ${this.getWeekNumber(dt)}`;
    }
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    return months[dt.getMonth()];
  }

  // SVG Line Chart
  readonly svgVbW = 600;
  readonly svgVbH = 240;
  chartPadding = { top: 10, right: 15, bottom: 35, left: 60 };

  get chartData(): any[] { return this.getGroupedChartData(); }
  get chartMax(): number { return this.getGroupedMaxValue(); }

  private getGroupedChartData(): any[] {
    const raw = this.getCurrentChartData();
    if (this.selectedChartType === 'ventes') return raw;
    const normalised = raw.map((d: any) => {
      const value = this.selectedChartType === 'mvt-stock'
        ? (d.quantite || 1)
        : 1;
      return {
        ...d,
        periode: d.periode || d.dateCommande || d.dateMvt || '',
        chiffreAffaires: value,
        nbVentes: value
      };
    });
    return this.groupChartData(normalised);
  }

  private getGroupedMaxValue(): number {
    const data = this.chartData;
    if (data.length === 0) return 1;
    return Math.max(...data.map(d => this.getItemValue(d)), 1);
  }

  get plotW(): number {
    return this.svgVbW - this.chartPadding.left - this.chartPadding.right;
  }
  get plotH(): number {
    return this.svgVbH - this.chartPadding.top - this.chartPadding.bottom;
  }

  getX(i: number): number {
    const count = this.chartData.length;
    if (count <= 1) return this.chartPadding.left + this.plotW / 2;
    return this.chartPadding.left + (i / (count - 1)) * this.plotW;
  }

  getY(value: number): number {
    const max = this.chartMax || 1;
    return this.chartPadding.top + this.plotH - (value / max) * this.plotH;
  }

  get polylinePoints(): string {
    return this.chartData
      .map((d, i) => {
        const x = this.getX(i);
        const y = this.getY(this.getItemValue(d));
        return `${x},${y}`;
      })
      .join(' ');
  }

  get yGridLines(): number[] {
    const steps = 4;
    const max = this.chartMax || 1;
    return Array.from({ length: steps + 1 }, (_, i) => (max / steps) * i);
  }

  yGridY(value: number): number {
    return this.getY(value);
  }

  yGridLabel(value: number): string {
    if (value >= 1000) return (value / 1000).toFixed(0) + 'k';
    return value.toFixed(0);
  }

  get showGradientFill(): boolean {
    return this.chartData.length >= 2;
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
    const base = (() => {
      switch (this.selectedChartType) {
        case 'commandes-client': return 'Commandes Clients';
        case 'commandes-fournisseur': return 'Commandes Fournisseurs';
        case 'mvt-stock': return 'Mouvements de Stock';
        default: return 'Chiffre d\'Affaires';
      }
    })();
    return `${base} — ${this.filtreLabel}`;
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

  private getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private formatDateStr(d: Date): string {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }

  private parsePeriode(periode: string): Date | null {
    if (!periode) return null;
    const p = periode.split(' ')[0];
    if (p.includes('/')) {
      const parts = p.split('/');
      if (parts.length === 3) {
        const [dd, mm, yyyy] = parts.map(Number);
        return new Date(yyyy, mm - 1, dd);
      }
    }
    const d = new Date(p);
    return isNaN(d.getTime()) ? null : d;
  }

  private groupChartData(data: any[]): any[] {
    const groups = new Map<string, { periode: string; chiffreAffaires: number; nbVentes: number; sortKey: number }>();
    data.forEach(d => {
      const dt = this.parsePeriode(d.periode);
      if (!dt) return;
      let key: string;
      let sortKey: number;
      if (this.groupUnit === 'day') {
        key = this.formatDateStr(dt);
        sortKey = dt.getTime();
      } else if (this.groupUnit === 'week') {
        const mon = this.getMonday(dt);
        key = `Sem ${this.getWeekNumber(mon)}`;
        sortKey = mon.getTime();
      } else {
        key = `01/${String(dt.getMonth() + 1).padStart(2, '0')}/${dt.getFullYear()}`;
        sortKey = dt.getFullYear() * 12 + dt.getMonth();
      }
      const existing = groups.get(key) || {
        periode: key,
        chiffreAffaires: 0,
        nbVentes: 0,
        sortKey
      };
      existing.chiffreAffaires += (d.chiffreAffaires || 0);
      existing.nbVentes += (d.nbVentes || 0);
      groups.set(key, existing);
    });
    return Array.from(groups.values())
      .sort((a, b) => a.sortKey - b.sortKey)
      .map(({ sortKey, ...rest }) => rest);
  }

  private getWeekNumber(d: Date): number {
    const temp = new Date(d);
    temp.setHours(0, 0, 0, 0);
    temp.setDate(temp.getDate() + 3 - (temp.getDay() + 6) % 7);
    const week1 = new Date(temp.getFullYear(), 0, 4);
    return 1 + Math.round(((temp.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }
}