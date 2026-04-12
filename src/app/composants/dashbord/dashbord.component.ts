import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ArtcleService } from 'src/app/services/article/artcle.service';
import { CmdCltFrsService } from 'src/app/services/cmdcltfrs/cmd-clt-frs.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { VenteService } from 'src/app/services/vente/vente.service';
import { ArticleDto, DashboardStatsDto } from 'src/gs-api/src/models';
import { UserService } from 'src/app/services/user/user.service';
import { CltfrsService } from 'src/app/services/cltfrs/cltfrs.service';

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

  constructor(
    private cmdFrsService: CmdCltFrsService,
    private venteService: VenteService,
    private dashboardService: DashboardService,
    private articleService: ArtcleService,
    private cltFrsService: CltfrsService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.loadStats();
    this.getTotalNumberOfData();
    this.getRecentArticle();
    this.error = "";
    
    let sDate = new Date();
    sDate.setDate(sDate.getDate() - 30);
    this.startDate = sDate.toISOString().split('T')[0];
    this.endDate = new Date().toISOString().split('T')[0];
  }

  loadStats(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.updateCharts();
      },
      error: (err) => {
        this.error = err.error?.message || 'Erreur lors du chargement des statistiques';
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
    }
  }

  getTotalNumberOfData() {
    this.articleService.findAllArticle().subscribe(data => {
      this.totalArticle = data.length;
    });
    this.cltFrsService.findAllClient().subscribe(data => {
      this.totalClient = data.length;
    });
    this.cltFrsService.findAllFournisseurs().subscribe(data => {
      this.totalFournisseur = data.length;
    });
    this.userService.findAll().subscribe(data => {
      this.totalUtilisateur = data.length;
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

  getRecentArticle() {
    this.articleService.findAllArticle().subscribe(data => {
      this.listReceteArticle = data.sort((a, b) => {
        const dateA = a.creationDate ? new Date(a.creationDate).getTime() : 0;
        const dateB = b.creationDate ? new Date(b.creationDate).getTime() : 0;
        return dateB - dateA;
      }).slice(0, 10);
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
}