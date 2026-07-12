import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ArtcleService } from 'src/app/services/article/artcle.service';
import { CmdCltFrsService } from 'src/app/services/cmdcltfrs/cmd-clt-frs.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { VenteService } from 'src/app/services/vente/vente.service';
import { ArticleDto, DashboardStatsDto, AlertStockDto } from 'src/gs-api/src/models';
import { UserService } from 'src/app/services/user/user.service';
import { CltfrsService } from 'src/app/services/cltfrs/cltfrs.service';
import { AlertStockService } from 'src/app/services/alert-stock/alert-stock.service';
import { SortState, sortByProperty } from 'src/app/composants/sort-utils';

Chart.register(...registerables);

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css'],
})
export class DashbordComponent implements OnInit {
  labels: string[] = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  listdataQnt: number[] = [];
  listDataprix: number[] = [];
  mapQnte: Map<string, number> = new Map();
  mapPrix: Map<string, number> = new Map();
  error = '';
  startDate: any;
  endDate: any;
  afficherDraphe = false;
  totalArticle = 0;
  totalUtilisateur = 0;
  totalFournisseur = 0;
  totalClient = 0;
  listReceteArticle: ArticleDto[] = [];
  stats: DashboardStatsDto = {};
  alertesStock: AlertStockDto[] = [];
  loading = true;
  dataLoadCount = 0;
  totalDataLoads = 7;
  sortState: SortState = { column: '', direction: 'asc' };

  constructor(
    private cmdFrsService: CmdCltFrsService,
    private venteService: VenteService,
    private dashboardService: DashboardService,
    private articleService: ArtcleService,
    private cltFrsService: CltfrsService,
    private userService: UserService,
    private alertStockService: AlertStockService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadStats();
    this.getTotalNumberOfData();
    this.getRecentArticle();
    this.loadAlertesStock();
    this.error = "";
    
    let sDate = new Date();
    sDate.setDate(sDate.getDate() - 30);
    this.startDate = this.formatDateForBackend(sDate);
    this.endDate = this.formatDateForBackend(new Date());
  }

  private checkLoadingComplete(): void {
    this.dataLoadCount++;
    if (this.dataLoadCount >= this.totalDataLoads) {
      this.loading = false;
    }
  }

  loadAlertesStock(): void {
    this.alertStockService.getAlertesActives().subscribe({
      next: (data) => {
        this.alertesStock = data;
        this.checkLoadingComplete();
      },
      error: () => {
        this.alertesStock = [];
        this.checkLoadingComplete();
      }
    });
  }

  loadStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.updateCharts();
        this.checkLoadingComplete();
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors du chargement des statistiques';
        this.checkLoadingComplete();
      }
    });
  }

  onDateChange(): void {
    this.loadStats();
  }

  updateCharts(): void {
    if (this.stats) {
      this.mapQnte.set('Articles', this.stats.totalArticles || 0);
      this.mapQnte.set('Clients', this.stats.totalClients || 0);
      this.mapQnte.set('Fournisseurs', this.stats.totalFournisseurs || 0);
      this.mapQnte.set('Commandes Client', this.stats.totalCommandesClient || 0);
      this.mapQnte.set('Commandes Fournisseur', this.stats.totalCommandesFournisseur || 0);
      this.mapQnte.set('Ventes', this.stats.totalVentes || 0);
      
      this.mapPrix.set('Chiffre d\'affaires', this.stats.chiffreAffaires || 0);
      this.mapPrix.set('Valeur Stock', this.stats.valeurStock || 0);
      
      this.afficherDraphe = true;
      this.updateAdvancedCharts();
    }
  }

  private aggregateByMonth(data: any[]): any[] {
    const groups = new Map<string, { periode: string; chiffreAffaires: number; nbVentes: number }>();
    data.forEach(d => {
      if (!d.periode) return;
      const parts = d.periode.split(' ');
      const datePart = parts[0];
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

  updateAdvancedCharts(): void {
    this.dashboardService.getChiffreAffairesMois().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.createLineChart('caChart', this.aggregateByMonth(data));
        }
      }
    });

    this.dashboardService.getTopArticles(5).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.createPieChart('topArticlesChart', data);
        }
      }
    });
  }

  createLineChart(id: string, data: any[]): void {
    const existingChart = Chart.getChart(id);
    if (existingChart) existingChart.destroy();

    const labels = data.map(d => d.periode || 'N/A');
    const values = data.map(d => d.chiffreAffaires || 0);

    new Chart(id, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Chiffre d\'affaires',
          data: values,
          borderColor: 'rgba(40, 167, 69, 1)',
          backgroundColor: 'rgba(40, 167, 69, 0.1)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true }
        }
      }
    });
  }

  createPieChart(id: string, data: any[]): void {
    const existingChart = Chart.getChart(id);
    if (existingChart) existingChart.destroy();

    const labels = data.map(d => d.article?.codeArticle || 'N/A');
    const values = data.map(d => d.quantite || 0);
    const colors = [
      'rgba(74, 144, 217, 0.8)',
      'rgba(40, 167, 69, 0.8)',
      'rgba(255, 193, 7, 0.8)',
      'rgba(220, 53, 69, 0.8)',
      'rgba(111, 66, 193, 0.8)'
    ];

    new Chart(id, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' }
        }
      }
    });
  }

  getTotalNumberOfData() {
    this.articleService.findAllArticle().subscribe({
      next: (data) => {
        this.totalArticle = data.length;
        this.checkLoadingComplete();
      },
      error: () => this.checkLoadingComplete()
    });
    this.cltFrsService.findAllClient().subscribe({
      next: (data) => {
        this.totalClient = data.length;
        this.checkLoadingComplete();
      },
      error: () => this.checkLoadingComplete()
    });
    this.cltFrsService.findAllFournisseurs().subscribe({
      next: (data) => {
        this.totalFournisseur = data.length;
        this.checkLoadingComplete();
      },
      error: () => this.checkLoadingComplete()
    });
    this.userService.findAll().subscribe({
      next: (data) => {
        this.totalUtilisateur = data.length;
        this.checkLoadingComplete();
      },
      error: () => this.checkLoadingComplete()
    });
  }

  sortObjectKeys(obj: { [key: string]: any }): { [key: string]: any } {
    const sortedKeys = Object.keys(obj).sort();
    const sortedObject: { [key: string]: any } = {};
    sortedKeys.forEach(key => {
      sortedObject[key] = obj[key];
    });
    return sortedObject;
  }

  createChart(id: string, mapData: Map<string, number>, labels: string[], label: string): void {
    this.afficherDraphe = false;
    let data: number[] = [];
    mapData.forEach((v, k) => {
      data.push(v);
    });
    
    const existingChart = Chart.getChart(id);
    if (existingChart) {
      existingChart.destroy();
    }
    
    this.afficherDraphe = true;
    new Chart(id, {
      type: 'bar',
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            animation: {
              easing: 'easeInOutCubic'
            }
          }
        }
      },
      data: {
        labels: Array.from(mapData.keys()),
        datasets: [{
          label: label,
          data: data,
          backgroundColor: [
            'rgba(74, 144, 217, 0.8)',
            'rgba(40, 167, 69, 0.8)',
            'rgba(255, 193, 7, 0.8)',
            'rgba(220, 53, 69, 0.8)',
            'rgba(111, 66, 193, 0.8)',
            'rgba(23, 162, 184, 0.8)'
          ],
          borderColor: [
            'rgba(74, 144, 217, 1)',
            'rgba(40, 167, 69, 1)',
            'rgba(255, 193, 7, 1)',
            'rgba(220, 53, 69, 1)',
            'rgba(111, 66, 193, 1)',
            'rgba(23, 162, 184, 1)'
          ],
          borderWidth: 1
        }]
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
      this.alertesStock = sortByProperty(this.alertesStock, this.sortState.column, this.sortState.direction);
    }
  }

  getRecentArticle() {
    this.articleService.findAllArticle().subscribe({
      next: (data) => {
        this.listReceteArticle = data.sort((a, b) => {
          const dateA = a.creationDate ? new Date(a.creationDate).getTime() : 0;
          const dateB = b.creationDate ? new Date(b.creationDate).getTime() : 0;
          return dateB - dateA;
        }).slice(0, 10);
        this.checkLoadingComplete();
      },
      error: () => this.checkLoadingComplete()
    });
  }

  getPrixValue(): number[] {
    return Array.from(this.mapPrix.values());
  }

  getQuantiteValue(): number[] {
    return Array.from(this.mapQnte.values());
  }

  parceData(chiffre: number): number {
    return parseFloat(chiffre.toFixed(2));
  }

  resetDates(): void {
    this.startDate = null;
    this.endDate = null;
    this.loadStats();
  }

  formatDateForBackend(date: Date | string): string {
    if (!date) return '';
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString();
  }
}