import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtcleService } from 'src/app/services/article/artcle.service';
import { ArticleDto, LigneCommandeClientDto, LigneCommandeFournisseurDto, LigneVenteDto } from 'src/gs-api/src/models';
import { Chart, registerables } from 'chart.js';
import { formatDate } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-detail-articles-mvtstk',
  templateUrl: './detail-articles-mvtstk.component.html',
  styleUrls: ['./detail-articles-mvtstk.component.css']
})
export class DetailArticlesMvtstkComponent implements OnInit {

  articleDto: ArticleDto = {};
  creationDate: string = "";
  lastmodificationDate: string = "";
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private articleService: ArtcleService,
    private activatedRouter: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const idArticle = this.activatedRouter.snapshot.params['id'];
    if (idArticle) {
      this.articleService.findArticleById(idArticle).subscribe(article => {
        this.articleDto = article;
        this.initialiseDate(article);
      });
      this.findHistorique(idArticle);
    }
  }

  initialiseDate(article: ArticleDto){
    if (article.creationDate && article.lastModifiedDate) {
      this.creationDate = formatDate(article.creationDate, "dd/MM/YYY", this.locale);
      this.lastmodificationDate = formatDate(article.lastModifiedDate, "dd/MM/YYY", this.locale);
    }
  }

  findHistorique(idArticle: number) {
    this.articleService.findHistoriqueCommandeClient(idArticle)
      .subscribe(list => {
        this.findAllCmdClt(list);
      });
    this.articleService.findHistoriqueCommandeFournisseur(idArticle)
      .subscribe(list => {
        this.findAllCmdFrs(list);
      });
    this.articleService.findHistoriqueVente(idArticle)
      .subscribe(list => {
        this.findAllVente(list);
      });
  }

  findAllCmdClt(list: Array<LigneCommandeClientDto>) {
    let mapQnt = new Map();
    let labels: Array<string> = [];
    let listQntClt: Array<number> = [];
    list.forEach(ligne => {
      if (ligne.commandeClient && ligne.commandeClient.dateCommande && ligne.quantite) {
        let label = formatDate(ligne.commandeClient.dateCommande, "dd/MM/YYY", this.locale);
        if (mapQnt && mapQnt.get(label)) {
          let qnt = mapQnt.get(label) + ligne.quantite;
          mapQnt.set(label, qnt);
        }else{
          mapQnt.set(label, ligne.quantite);
        }
      }
    });
    mapQnt.forEach((map, key) => {
      listQntClt.push(map);
      labels.push(key);
    });
    this.createChart("cmdClt", listQntClt, labels);
  }

  findAllCmdFrs(list: Array<LigneCommandeFournisseurDto>) {
    let mapQnt = new Map();
    let labels: Array<string> = [];
    let listQntFrs: Array<number> = [];
    list.forEach(ligne => {
      if (ligne.commandefournisseur && ligne.commandefournisseur.dateCommande && ligne.quantite) {
        let label = formatDate(ligne.commandefournisseur.dateCommande, "dd/MM/YYY", this.locale);
        if (mapQnt && mapQnt.get(label)) {
          let qnt = mapQnt.get(label) + ligne.quantite;
          mapQnt.set(label, qnt);
        }else{
          mapQnt.set(label, ligne.quantite);
        }
      }
    });
    mapQnt.forEach((map, key) => {
      listQntFrs.push(map);
      labels.push(key);
    });
    this.createChart("cmdFrs", listQntFrs, labels);
  }

  findAllVente(list: Array<LigneVenteDto>) {
    let mapQnt = new Map();
    let labels: Array<string> = [];
    let listQntVente: Array<number> = [];
    list.forEach(ligne => {
      if (ligne.vente && ligne.vente.dateVente && ligne.quantite) {
        let label = formatDate(ligne.vente.dateVente, "dd/MM/YYY", this.locale);
        if (mapQnt && mapQnt.get(label)) {
          let qnt = mapQnt.get(label) + ligne.quantite;
          mapQnt.set(label, qnt);
        }else{
          mapQnt.set(label, ligne.quantite);
        }
      }
    });
    mapQnt.forEach((map, key) => {
      listQntVente.push(map);
      labels.push(key);
    });
    this.createChart("vente", listQntVente, labels);
  }

  createChart(id: string, data: Array<number>, label: Array<string>): void {
    const cmdCltChart = new Chart(id, {
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
        labels: label,
        datasets: [{
          label: ' Quantités',
          data: data,
          borderWidth: 1
        }]
      }
    });
  }

  changeStartDate($event: any){
    console.log(formatDate($event.timeStamp, "dd/MM/YYY", this.locale));
  }

}
