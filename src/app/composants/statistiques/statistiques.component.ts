import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';
import { DashboardService, DashboardStatsDto, VenteStatsDto, ArticleStatsDto, AnalyseStockDto, RotationStockDto, InventoryStatsDto } from 'src/gs-api/src/services/dashboard.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-statistiques',
  templateUrl: './statistiques.component.html',
  styleUrls: ['./statistiques.component.css']
})
export class StatistiquesComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('caChart') caChartRef: any;
  @ViewChild('categorieChart') categorieChartRef: any;
  @ViewChild('stockChart') stockChartRef: any;

  private destroy$ = new Subject<void>();

  loading: boolean = false;
  error: string = '';
  lastUpdate: Date = new Date();
  
  stats: DashboardStatsDto | null = null;
  analyseStock: AnalyseStockDto | null = null;
  inventoryStats: InventoryStatsDto | null = null;
  chiffreAffairesData: VenteStatsDto[] = [];
  topArticles: ArticleStatsDto[] = [];
  rotationStock: RotationStockDto[] = [];
  
  caChart: Chart | null = null;
  categorieChart: Chart | null = null;
  stockChart: Chart | null = null;

  periodeSelected: number = 12;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  ngAfterViewInit(): void {
    // Wait for the view children to be initialized
    const checkCharts = () => {
      if (this.caChartRef?.nativeElement && this.categorieChartRef?.nativeElement && this.stockChartRef?.nativeElement) {
        this.initCharts();
      } else {
        // Retry after a short delay
        setTimeout(checkCharts, 100);
      }
    };
    checkCharts();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.caChart?.destroy();
    this.categorieChart?.destroy();
    this.stockChart?.destroy();
  }

  loadAllData(): void {
    this.loading = true;
    this.error = '';
    this.lastUpdate = new Date();
    let pendingRequests = 6;

    const decrementLoading = () => {
      pendingRequests--;
      if (pendingRequests === 0) {
        this.loading = false;
      }
    };

    this.dashboardService.getStats().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => { this.stats = data; },
      error: (err) => {
        console.error('Erreur stats', err);
        this.error = 'Erreur lors du chargement des statistiques générales';
        decrementLoading();
      },
      complete: () => decrementLoading()
    });

    this.dashboardService.getAnalyseStock().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => { this.analyseStock = data; this.updateStockChart(); },
      error: (err) => {
        console.error('Erreur analyse stock', err);
        this.error = 'Erreur lors du chargement de l\'analyse de stock';
        decrementLoading();
      },
      complete: () => decrementLoading()
    });

    this.dashboardService.getInventoryStats().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => { this.inventoryStats = data; },
      error: (err) => {
        console.error('Erreur inventory stats', err);
        this.error = 'Erreur lors du chargement des statistiques d\'inventaire';
        decrementLoading();
      },
      complete: () => decrementLoading()
    });

    this.dashboardService.getChiffreAffairesMois().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.chiffreAffairesData = this.aggregateByMonth(data || []);
        this.updateCaChart();
      },
      error: (err) => {
        console.error('Erreur CA', err);
        this.error = 'Erreur lors du chargement du chiffre d\'affaires';
        decrementLoading();
      },
      complete: () => decrementLoading()
    });

    this.dashboardService.getTopArticles(10).pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.topArticles = data || [];
        this.updateCategorieChart();
      },
      error: (err) => {
        console.error('Erreur top articles', err);
        this.error = 'Erreur lors du chargement des meilleurs articles';
        decrementLoading();
      },
      complete: () => decrementLoading()
    });

    this.dashboardService.getRotationStock().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => { this.rotationStock = data || []; },
      error: (err) => {
        console.error('Erreur rotation stock', err);
        this.error = 'Erreur lors du chargement de la rotation de stock';
        decrementLoading();
      },
      complete: () => decrementLoading()
    });
  }

  initCharts(): void {
    this.createCaChart();
    this.createCategorieChart();
    this.createStockChart();
  }

  createCaChart(): void {
    const ctx = this.caChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Chiffre d\'Affaires',
          data: [],
          borderColor: '#4a90d9',
          backgroundColor: 'rgba(74,144,217,0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5
        }, {
          label: 'Ventes',
          data: [],
          borderColor: '#28a745',
          backgroundColor: 'transparent',
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 2,
          pointHoverRadius: 4,
          yAxisID: 'y1'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', labels: { usePointStyle: true, padding: 12 } },
          tooltip: { 
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 8,
            cornerRadius: 4,
            titleFont: { size: 11 },
            bodyFont: { size: 10 },
            callbacks: {
              label: (ctx: any) => {
                const value = ctx.raw as number;
                const label = ctx.dataset.label || '';
                if (ctx.dataset.yAxisID === 'y1') {
                  return label + ': ' + value.toFixed(2);
                }
                return label + ': ' + this.formatNumber(value, 2) + ' €';
              }
            }
          }
        },
        scales: {
          x: { grid: { display: false }, ticks: { maxRotation: 0 } },
          y: { position: 'left', grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { callback: (v: any) => Number(v).toFixed(2) + ' €' } },
          y1: { position: 'right', grid: { display: false }, ticks: { callback: (v: any) => Number(v).toFixed(2) } }
        }
      }
    };

    this.caChart = new Chart(ctx, config);
    this.updateCaChart();
  }

  createCategorieChart(): void {
    const ctx = this.categorieChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: ['#4a90d9', '#28a745', '#ffc107', '#dc3545', '#17a2b8', '#6f42c1', '#fd7e14', '#20c997', '#e83e8c', '#6c757d'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right', labels: { usePointStyle: true, padding: 10 } }
        }
      }
    };

    this.categorieChart = new Chart(ctx, config);
    this.updateCategorieChart();
  }

  createStockChart(): void {
    const ctx = this.stockChartRef?.nativeElement?.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: ['En Stock', 'Sous Sécurité', 'Rupture', 'Excédentaire'],
        datasets: [{
          data: [],
          backgroundColor: ['#28a745', '#ffc107', '#dc3545', '#17a2b8'],
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx: any) => {
                const total = this.analyseStock?.totalArticles || 0;
                const value = ctx.raw as number;
                const pct = total > 0 ? ((value / total) * 100).toFixed(1) : '0';
                return ctx.label + ': ' + this.formatNumber(value) + ' articles (' + pct + '%)';
              }
            }
          }
        },
        scales: {
          x: { grid: { color: 'rgba(0,0,0,0.05)' } },
          y: { grid: { display: false } }
        }
      }
    };

    this.stockChart = new Chart(ctx, config);
    this.updateStockChart();
  }

  updateCaChart(): void {
    if (!this.caChart) return;
    const labels = this.chiffreAffairesData.map(d => this.getMonthLabel(d.periode));
    const caData = this.chiffreAffairesData.map(d => d.chiffreAffaires || 0);
    const ventesData = this.chiffreAffairesData.map(d => d.nbVentes || 0);
    this.caChart.data.labels = labels;
    if (this.caChart.data.datasets.length > 0) {
      this.caChart.data.datasets[0].data = caData;
    }
    if (this.caChart.data.datasets.length > 1) {
      this.caChart.data.datasets[1].data = ventesData;
    }
    this.caChart.update();
  }

  updateCategorieChart(): void {
    if (!this.categorieChart || this.topArticles.length === 0) return;
    const categoryMap = new Map<string, number>();
    this.topArticles.forEach(a => {
      const cat = a.category || 'Non catégorisé';
      const current = categoryMap.get(cat) || 0;
      categoryMap.set(cat, current + (a.nbVentes || 0) * (a.prixUnitaire || 0));
    });
    const categories = Array.from(categoryMap.keys());
    const values = Array.from(categoryMap.values());
    this.categorieChart.data.labels = categories;
    this.categorieChart.data.datasets[0].data = values;
    this.categorieChart.update();
  }

  updateStockChart(): void {
    if (!this.stockChart || !this.analyseStock) return;
    const data = [
      this.analyseStock.articlesEnStock || 0,
      this.analyseStock.articlesSousSecurite || 0,
      this.analyseStock.articlesRupture || 0,
      this.analyseStock.articlesExcedent || 0
    ];
    this.stockChart.data.datasets[0].data = data;
    this.stockChart.update();
  }

  onPeriodeChange(event: any): void {
    this.periodeSelected = parseInt(event.target.value);
  }

  formatNumber(value: number | undefined, decimals: number = 2): string {
    if (value === undefined || value === null) return '0';
    return value.toLocaleString('fr-FR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  }

  formatCurrency(value: number | undefined): string {
    return this.formatNumber(value, 2) + ' €';
  }

  formatPercent(value: number | undefined): string {
    if (value === undefined || value === null) return '0%';
    return value.toFixed(2) + '%';
  }

  getMonthLabel(periode: string | undefined): string {
    if (!periode) return '';
    const parts = periode.split(/[\/\s]/);
    if (parts.length >= 2) {
      const month = parseInt(parts[1]);
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
      if (month >= 1 && month <= 12) return months[month - 1];
    }
    return periode.substring(0, 7);
  }

  private aggregateByMonth(data: any[]): any[] {
    const groups = new Map<string, { periode: string; chiffreAffaires: number; nbVentes: number }>();
    data.forEach(d => {
      if (!d.periode) return;
      try {
        // Handle various date formats: DD/MM/YYYY, DD/MM/YYYY HH:MM, YYYY-MM-DD, etc.
        let normalizedDate = d.periode;
        // Remove time part if present
        if (normalizedDate.includes(' ')) {
          normalizedDate = normalizedDate.split(' ')[0];
        }

        // Handle DD/MM/YYYY or MM/DD/YYYY or YYYY-MM-DD
        let day, month, year;
        const parts = normalizedDate.split(/[\/-]/);

        if (parts.length === 3) {
          // Check if first part is likely a year (4 digits or >31)
          if (parts[0].length === 4 || parseInt(parts[0]) > 31) {
            // Format: YYYY-MM-DD or YYYY/MM/DD
            [year, month, day] = parts;
          } else if (parts[2].length === 4 || parseInt(parts[2]) > 31) {
            // Format: DD-MM-YYYY or DD/MM/YYYY
            [day, month, year] = parts;
          } else {
            // Ambiguous, assume DD/MM/YYYY
            [day, month, year] = parts;
          }
        } else {
          // Fallback: try to extract year/month from substring
          const yearMatch = normalizedDate.match(/\d{4}/);
          const monthMatch = normalizedDate.match(/(0[1-9]|1[0-2])/);
          if (yearMatch && monthMatch) {
            year = yearMatch[0];
            month = monthMatch[0];
            day = '01';
          } else {
            return; // Skip invalid date
          }
        }

        // Validate month and year
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);
        if (isNaN(monthNum) || monthNum < 1 || monthNum > 12 || isNaN(yearNum)) {
          return; // Skip invalid date
        }

        const key = `${monthNum}/${yearNum}`;
        const existing = groups.get(key) || { periode: `01/${key}`, chiffreAffaires: 0, nbVentes: 0 };
        existing.chiffreAffaires += (d.chiffreAffaires || 0);
        existing.nbVentes += (d.nbVentes || 0);
        groups.set(key, existing);
      } catch (e) {
        // Skip invalid date entries to prevent crashing the whole aggregation
        console.warn('Skipping invalid date in aggregateByMonth:', d.periode, e);
        return;
      }
    });

    const toMonthNum = (p: string) => {
      const [m, y] = p.split('/');
      return parseInt(y, 10) * 12 + parseInt(m, 10);
    };
    return Array.from(groups.values()).sort((a, b) => toMonthNum(a.periode) - toMonthNum(b.periode));
  }

  getStockStatusClass(stock: number | undefined): string {
    if (!stock) return 'text-muted';
    if (stock === 0) return 'text-danger';
    if (stock < 10) return 'text-warning';
    return 'text-success';
  }

  getRotationClass(taux: number | undefined): string {
    if (!taux) return 'text-muted';
    if (taux >= 4) return 'text-success';
    if (taux >= 2) return 'text-warning';
    return 'text-danger';
  }

  trackByIndex(index: number): number {
    return index;
  }

  getLastUpdateFormatted(): string {
    return this.lastUpdate.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}