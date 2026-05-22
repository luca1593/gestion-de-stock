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

  articleDto: ArticleDto={};
  creationDate: string="";
  lastmodificationDate: string="";
  startDate: string="";
  endDate: string="";

  rawCmdClt: Array<LigneCommandeClientDto>=[];
  rawCmdFrs: Array<LigneCommandeFournisseurDto>=[];
  rawVente: Array<LigneVenteDto>=[];

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private articleService: ArtcleService,
    private activatedRouter: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const idArticle=this.activatedRouter.snapshot.params['id'];
    if (idArticle) {
      this.articleService.findArticleById(idArticle).subscribe(article => {
        this.articleDto=article;
        this.initialiseDate(article);
      });
      this.findHistorique(idArticle);
    }
  }

  initialiseDate(article: ArticleDto){
    if (article.creationDate && article.lastModifiedDate) {
      this.creationDate=formatDate(article.creationDate, "dd/MM/YYYY", this.locale);
      this.lastmodificationDate=formatDate(article.lastModifiedDate, "dd/MM/YYYY", this.locale);
    }
  }

  findHistorique(idArticle: number) {
    this.articleService.findHistoriqueCommandeClient(idArticle)
      .subscribe(list => {
        this.rawCmdClt = list;
        this.filterAndRender();
      });
    this.articleService.findHistoriqueCommandeFournisseur(idArticle)
      .subscribe(list => {
        this.rawCmdFrs = list;
        this.filterAndRender();
      });
    this.articleService.findHistoriqueVente(idArticle)
      .subscribe(list => {
        this.rawVente = list;
        this.filterAndRender();
      });
  }

  filterAndRender() {
    this.renderChart("vente", this.rawVente, 'vente');
    this.renderChart("cmdClt", this.rawCmdClt, 'cmdClt');
    this.renderChart("cmdFrs", this.rawCmdFrs, 'cmdFrs');
  }

  filterByDate<T>(list: T[], dateGetter: (item: T) => string | undefined): T[] {
    if (!this.startDate && !this.endDate) return list;
    return list.filter(item => {
      const d = dateGetter(item);
      if (!d) return false;
      const date = new Date(d).getTime();
      if (this.startDate && date < new Date(this.startDate).getTime()) return false;
      if (this.endDate) {
        const end = new Date(this.endDate);
        end.setHours(23, 59, 59, 999);
        if (date > end.getTime()) return false;
      }
      return true;
    });
  }

  applyDateFilter() {
    this.filterAndRender();
  }

  resetDateFilter() {
    this.startDate = '';
    this.endDate = '';
    this.filterAndRender();
  }

  onStartDateChange(event: any) {
    this.startDate = event.target?.value || '';
    this.applyDateFilter();
  }

  onEndDateChange(event: any) {
    this.endDate = event.target?.value || '';
    this.applyDateFilter();
  }

  private renderChart(id: string, rawData: any[], type: string) {
    const chart = Chart.getChart(id);
    if (chart) chart.destroy();

    const filtered = type === 'vente'
      ? this.filterByDate(rawData, (i: LigneVenteDto) => i.vente?.dateVente)
      : type === 'cmdClt'
        ? this.filterByDate(rawData, (i: LigneCommandeClientDto) => i.commandeClient?.dateCommande)
        : this.filterByDate(rawData, (i: LigneCommandeFournisseurDto) => i.commandefournisseur?.dateCommande);

    const mapQnt = new Map<string, number>();
    filtered.forEach((item: any) => {
      const dateField = type === 'vente' ? item.vente?.dateVente
        : type === 'cmdClt' ? item.commandeClient?.dateCommande
        : item.commandefournisseur?.dateCommande;
      if (dateField && item.quantite) {
        const label = formatDate(dateField, "dd/MM/YYYY", this.locale);
        mapQnt.set(label, (mapQnt.get(label) || 0) + item.quantite);
      }
    });

    const labels = Array.from(mapQnt.keys());
    const data = Array.from(mapQnt.values());

    new Chart(id, {
      type: 'line',
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            animation: { easing: 'easeInOutCubic' }
          }
        }
      },
      data: {
        labels,
        datasets: [{
          label: 'Quantités',
          data,
          borderWidth: 1
        }]
      }
    });
  }
}
