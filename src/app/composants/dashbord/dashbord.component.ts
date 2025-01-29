import { formatDate } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { ArtcleService } from 'src/app/services/article/artcle.service';
import { CmdCltFrsService } from 'src/app/services/cmdcltfrs/cmd-clt-frs.service';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { VenteService } from 'src/app/services/vente/vente.service';
import { ArticleDto, DashboardRequest } from 'src/gs-api/src/models';
import { UserService } from 'src/app/services/user/user.service';
import { CltfrsService } from 'src/app/services/cltfrs/cltfrs.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css'],
})
export class DashbordComponent implements OnInit {
  labels: Array<string> = ['Commande client', 'Commande fournisseur', 'Vente'];
  listdataQnt: Array<number> = [];
  listDataprix: Array<number> = [];
  mapQnte: Map<string, number> = new Map();
  mapPrix: Map<string, number> = new Map();
  error = '';
  startDate: any;
  endDate: any;
  afficherDraphe: boolean = false;
  totalArticle : number = 0;
  totalUtilisateur : number = 0;
  totalFournisseur : number = 0;;
  totalClient: number = 0;
  listReceteArticle: Array<ArticleDto> = [];

  constructor(
    private cmdFrsService: CmdCltFrsService,
    private venteService: VenteService,
    private dashboardService: DashboardService,
    private articleService: ArtcleService,
    private cltFrsService: CltfrsService,
    private userService: UserService,

    private router: Router,
    @Inject(LOCALE_ID) private locale: string,
  ) {}

  ngOnInit() {
    this.afficherData();
    this.getTotalNumberOfData();
    this.getRecentArticle();
    this.error = "";
  }

  afficherData(): void {
    this.afficherDraphe = false;
    let sDate = new Date();
    sDate.setDate(sDate.getDate() -1);
    let dashboardRequest: DashboardRequest = {
      startDate: formatDate(this.startDate ? this.startDate : sDate, "dd/MM/YYY", this.locale),
      endDate: formatDate(this.endDate ? this.endDate : Date.now(), "dd/MM/YYY", this.locale)
    };
    this.dashboardService.getDashboardData(dashboardRequest).subscribe(data => {
      if(data.mapDataDashboard){
        data.mapDataDashboard = this.sortObjectKeys(data.mapDataDashboard);
        if (data.mapDataDashboard) {
          for(const key in data.mapDataDashboard){
            if(key.startsWith("prix")){
              this.mapPrix.set(key, parseFloat(data.mapDataDashboard[key].toFixed(2)));
            }else {
              this.mapQnte.set(key, parseFloat(data.mapDataDashboard[key].toFixed(2)));
            }
          }
        }
      }
    }, error => {
      this.afficherDraphe = false;
      this.error = error.error.message;
    });

    setTimeout(() => {
      if (this.mapPrix.size && this.mapQnte.size) {
        this.afficherDraphe = true;
        this.createChart("prx", this.mapPrix, this.labels, ' Ariary');
        this.createChart("qnt", this.mapQnte, this.labels, ' Quantités');
        this.error = "";
      }else{
        this.afficherDraphe = false;
        this.error = "Aucune donnée n'a été trouvé pendant ce période";
      }
    }, 1000);
  }

  getTotalNumberOfData(){
    this.articleService.findAllArticle().subscribe(data => {
      this.totalArticle = data.length;
    });
    this.cltFrsService.findAllClient().subscribe(data => {
      this.totalClient = data.length;
    });
    this.cltFrsService.findAllFournisseurs().subscribe(data =>{
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

  createChart(id: string, mapData: Map<string, number>, labels: Array<string>, label: string): void {
    this.afficherDraphe = false
    let data: Array<number> = [];
    mapData.forEach((v, k) => {
      data.push(v);
    });
    this.afficherDraphe = true;
    const chart = new Chart(id, {
      type: 'line',
      options: {
        responsive: true,
        plugins:{
          legend:{
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
        labels: labels,
        datasets: [{
          label: label,
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      }
    });
  }

  getRecentArticle() {

    this.articleService.findAllArticle().subscribe(data => {
      data.forEach( d => {
        this.listReceteArticle.push(d);
      });
      this.listReceteArticle.sort((a1, a2) => {
        if (a1.creationDate && a2.creationDate) {
          return a1.creationDate - a2.creationDate;
        } else if (a1.creationDate) {
          return -1;
        } else if (a2.creationDate) {
          return 1;
        } else {
          return 0;
        }
      });
    });
  }

  getPrixValue(): number[] {
    return Array.from(this.mapPrix.values());
  }

  getQuantiteValue(): number[] {
    return Array.from(this.mapQnte.values());
  }

  parceData(chiffre : number): number {
    return parseFloat(chiffre.toFixed(2));
  }

}
