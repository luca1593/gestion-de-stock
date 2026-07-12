import { Component, Input, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MvtStkService } from 'src/app/services/mvtstk/mvt-stk.service';
import { ArticleDto, MvtStkDto } from 'src/gs-api/src/models';
import { ArtcleService } from 'src/app/services/article/artcle.service';
import { SortState, sortByProperty, matchSearch } from 'src/app/composants/sort-utils';

@Component({
  selector: 'app-page-mvtstk',
  templateUrl: './page-mvtstk.component.html',
  styleUrls: ['./page-mvtstk.component.css']
})
export class PageMvtstkComponent implements OnInit, OnDestroy {

  page: number = 1;
  pageSize: number = 5;
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
  correctionSource: string = 'CORRECTION_STOCK';

  sortState: SortState = { column: '', direction: 'asc' };

  constructor(
    private mvtStkService: MvtStkService,
    private articleService: ArtcleService,
    private router: Router,
    private cdr: ChangeDetectorRef
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
        this.applySort();
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
        this.maplistMvtStk.set(idArticle, list.sort((a, b) => new Date(b.dateMvt || 0).getTime() - new Date(a.dateMvt || 0).getTime()));
      },
      error: (err) => {
        this.errorMsg = err.error?.error || 'Erreur lors du chargement des mouvements';
      }
    });
  }

  filtrer(): void {
    this.listArticleFiltre = this.listArticle.filter(article => {
      const matchCode = !this.searchCode || 
        matchSearch(article.codeArticle, this.searchCode) ||
        matchSearch(article.stock, this.searchCode) ||
        matchSearch(article.prixUnitaireht, this.searchCode) ||
        matchSearch(article.prixTtc, this.searchCode);
      const matchLibelle = !this.searchLibelle || 
        matchSearch(article.designation, this.searchLibelle) ||
        matchSearch(article.stock, this.searchLibelle) ||
        matchSearch(article.prixUnitaireht, this.searchLibelle) ||
        matchSearch(article.prixTtc, this.searchLibelle);
      const matchCategory = !this.searchCategory || 
        matchSearch(article.category?.designation, this.searchCategory) ||
        matchSearch(article.stock, this.searchCategory) ||
        matchSearch(article.prixUnitaireht, this.searchCategory) ||
        matchSearch(article.prixTtc, this.searchCategory);
      return matchCode && matchLibelle && matchCategory;
    });
    this.applySort();
    this.page = 1;
  }

  reinitialiserFiltres(): void {
    this.searchCode = '';
    this.searchLibelle = '';
    this.searchCategory = '';
    this.listArticleFiltre = this.listArticle;
    this.applySort();
    this.page = 1;
  }

  sort(column: string): void {
    if (this.sortState.column === column) {
      this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortState.column = column;
      this.sortState.direction = 'asc';
    }
    this.applySort();
    this.page = 1;
    this.cdr.markForCheck();
  }

  private applySort(): void {
    if (this.sortState.column) {
      if (this.sortState.column === 'totalEntrees' || this.sortState.column === 'totalSorties') {
        this.listArticleFiltre = [...this.listArticleFiltre].sort((a, b) => {
          const valA = this.sortState.column === 'totalEntrees'
            ? this.getTotalEntrees(a.id) : this.getTotalSorties(a.id);
          const valB = this.sortState.column === 'totalEntrees'
            ? this.getTotalEntrees(b.id) : this.getTotalSorties(b.id);
          return this.sortState.direction === 'asc' ? valA - valB : valB - valA;
        });
      } else {
        this.listArticleFiltre = sortByProperty(this.listArticleFiltre, this.sortState.column, this.sortState.direction);
      }
    }
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
      .filter(m => m.typeMvt === 'SORTIR')
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
      case 'INVENTAIRE': return 'Inventaire';
      case 'TRANSFERT': return 'Transfert';
      case 'MANUEL': return 'Manuel';
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
      this.correctionSource = 'CORRECTION_STOCK';
    } else {
      this.correctionArticleId = idArticle;
      this.correctionQuantite = null;
      this.correctionType = 'ENTRER';
      this.correctionSource = 'CORRECTION_STOCK';
    }
  }

  cancelCorrection(): void {
    this.correctionArticleId = null;
    this.correctionQuantite = null;
    this.correctionType = 'ENTRER';
    this.correctionSource = 'CORRECTION_STOCK';
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

    this.mvtStkService.corregerStock(idArticle, nouveauStock, this.correctionSource).subscribe({
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