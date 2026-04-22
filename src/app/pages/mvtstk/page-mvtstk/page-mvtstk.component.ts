import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MvtStkService } from 'src/app/services/mvtstk/mvt-stk.service';
import { ArticleDto, MvtStkDto } from 'src/gs-api/src/models';
import { ArtcleService } from 'src/app/services/article/artcle.service';

@Component({
  selector: 'app-page-mvtstk',
  templateUrl: './page-mvtstk.component.html',
  styleUrls: ['./page-mvtstk.component.css']
})
export class PageMvtstkComponent implements OnInit, OnDestroy {

  page: number = 1;
  pageSize: number = 10;
  maplistMvtStk = new Map<number, MvtStkDto[]>();
  listArticle: Array<ArticleDto> = [];
  listArticleFiltre: Array<ArticleDto> = [];
  errorMsg: string = "";

  searchCode: string = '';
  searchLibelle: string = '';
  searchCategory: string = '';

  expandedArticleId: number | null = null;
  correctionArticleId: number | null = null;
  correctionQuantite: number | null = null;
  correctionType: string = 'ENTRER';

  constructor(
    private mvtStkService: MvtStkService,
    private articleService: ArtcleService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.findAllArticle();
  }

  ngOnDestroy(): void {
  }

  findAllArticle() {
    this.articleService.findAllArticle().subscribe({
      next: (list) => {
        this.listArticle = list;
        this.listArticleFiltre = list;
        list.forEach(article => {
          if (article.id && article.stock) {
            this.mvtStkService.setArticleStock(article.id, article.stock);
          }
        });
        this.findAllMvtStk();
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Erreur lors du chargement des articles';
      }
    });
  }

  findAllMvtStk() {
    this.listArticle.forEach(article => {
      if (article.id) {
        this.findAllMvtStkByArticle(article.id);
      }
    });
  }

  findAllMvtStkByArticle(idArticle: number) {
    this.mvtStkService.findAllMvtByArticle(idArticle).subscribe({
      next: (list) => {
        this.maplistMvtStk.set(idArticle, list);
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Erreur lors du chargement des mouvements';
      }
    });
  }

  filtrer(): void {
    this.listArticleFiltre = this.listArticle.filter(article => {
      const matchCode = !this.searchCode || (article.codeArticle?.toLowerCase().includes(this.searchCode.toLowerCase()));
      const matchLibelle = !this.searchLibelle || (article.designation?.toLowerCase().includes(this.searchLibelle.toLowerCase()));
      const matchCategory = !this.searchCategory ||
        (article.category?.designation?.toLowerCase().includes(this.searchCategory.toLowerCase()));
      return matchCode && matchLibelle && matchCategory;
    });
    this.page = 1;
  }

  reinitialiserFiltres(): void {
    this.searchCode = '';
    this.searchLibelle = '';
    this.searchCategory = '';
    this.listArticleFiltre = this.listArticle;
    this.page = 1;
  }

  getStockClass(stock: number | undefined): string {
    if (stock === undefined || stock === 0) return 'critical';
    if (stock < 10) return 'warning';
    return 'good';
  }

  getTotalEntrees(idArticle: number | undefined): number {
    if (!idArticle) return 0;
    const mvts = this.maplistMvtStk.get(idArticle) || [];
    return mvts
      .filter(m => m.typeMvt === 'ENTRER')
      .reduce((sum, m) => sum + (m.quantite || 0), 0);
  }

  getTotalSorties(idArticle: number | undefined): number {
    if (!idArticle) return 0;
    const mvts = this.maplistMvtStk.get(idArticle) || [];
    return mvts
      .filter(m => m.typeMvt === 'SORTIE')
      .reduce((sum, m) => sum + (m.quantite || 0), 0);
  }

  getMouvements(idArticle: number | undefined): MvtStkDto[] {
    if (!idArticle) return [];
    return this.maplistMvtStk.get(idArticle) || [];
  }

  getSourceLabel(source: string | undefined): string {
    switch (source) {
      case 'COMMANDE_CLIENT': return 'Cmd Client';
      case 'COMMANDE_FOURNISSEUR': return 'Cmd Fournisseur';
      case 'VENTE': return 'Vente';
      default: return source || '-';
    }
  }

  toggleDetails(idArticle: number): void {
    if (this.expandedArticleId === idArticle) {
      this.expandedArticleId = null;
    } else {
      this.expandedArticleId = idArticle;
    }
  }

  toggleCorrection(idArticle: number): void {
    if (this.correctionArticleId === idArticle) {
      this.correctionArticleId = null;
      this.correctionQuantite = null;
      this.correctionType = 'ENTRER';
    } else {
      this.correctionArticleId = idArticle;
      this.correctionQuantite = null;
      this.correctionType = 'ENTRER';
    }
  }

  cancelCorrection(): void {
    this.correctionArticleId = null;
    this.correctionQuantite = null;
    this.correctionType = 'ENTRER';
  }

  getNouveauStock(stockActuel: number | undefined): number {
    if (!this.correctionQuantite || this.correctionQuantite <= 0) return stockActuel || 0;
    return this.correctionType === 'ENTREE'
      ? (stockActuel || 0) + this.correctionQuantite
      : (stockActuel || 0) - this.correctionQuantite;
  }

  getNewStockClass(): string {
    const nouveauStock = this.getNouveauStock(0);
    if (nouveauStock < 0) return 'danger';
    if (nouveauStock < 10) return 'warning';
    return 'success';
  }

  sauvegarderCorrection(idArticle: number): void {
    if (!this.correctionQuantite || this.correctionQuantite <= 0) return;

    const currentStock = 0;
    const nouveauStock = this.getNouveauStock(currentStock);

    this.mvtStkService.corregerStock(idArticle, nouveauStock).subscribe({
      next: () => {
        this.findAllArticle();
        this.cancelCorrection();
      },
      error: (err: any) => {
        this.errorMsg = err.error?.message || 'Erreur lors de la correction';
      }
    });
  }

  voirDetails(idArticle: number): void {
    this.router.navigate(['detail-mvtstk', idArticle]);
  }

}