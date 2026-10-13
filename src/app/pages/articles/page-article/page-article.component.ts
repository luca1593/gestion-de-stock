import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArtcleService } from 'src/app/services/article/artcle.service';
import { ExportExcelService } from 'src/app/services/export.service';
import { PhotoSyncService } from 'src/app/services/photo-sync/photo-sync.service';
import { ArticleDto } from 'src/gs-api/src/models';
import { CategoryDto } from 'src/gs-api/src/models/category-dto';
import { SortState, sortByProperty, matchSearch } from 'src/app/composants/sort-utils';
import { ConfirmationService } from 'src/app/composants/confirmation/confirmation.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { pageValide } from 'src/app/composants/list-utils';

@Component({
  selector: 'app-page-article',
  templateUrl: './page-article.component.html',
  styleUrls: ['./page-article.component.css']
})
export class PageArticleComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  listArticle: Array<ArticleDto>=[];
  listArticleFiltre: Array<ArticleDto>=[];
  errorMsg: string="";
  page: number=1;
  pageSize: number = 5;
  loading = true;

  sortState: SortState = { column: '', direction: 'asc' };

  searchCode: string = '';
  searchLibelle: string = '';
  searchCategory: string = '';

  getCategoryClass(category: CategoryDto | undefined): string {
    if (!category || !category.designation) return 'cat-default';
    const cat = category.designation.toLowerCase();
    if (cat.includes('prim') || cat.includes('ele')) return 'cat-primary';
    if (cat.includes('succ') || cat.includes('bas')) return 'cat-success';
    if (cat.includes('warn') || cat.includes('haut')) return 'cat-warning';
    return 'cat-default';
  }

  getStockClass(stock: number | undefined): string {
    if (stock === undefined || stock === 0) return 'critical';
    if (stock < 10) return 'warning';
    return 'good';
  }

  voirArticle(article: ArticleDto): void {
    this.router.navigate(["detail-article", article.id]);
  }

  modifierArticle(article: ArticleDto): void {
    this.router.navigate(["nouvel-article", article.id]);
  }

  async supprimerArticle(article: ArticleDto): Promise<void> {
    const ok = await this.confirmation.demander({
      titre: 'Supprimer cet article ?',
      message: 'Voulez-vous vraiment supprimer cet article ?',
      element: article.designation,
      consequence: 'Il disparaîtra des listes, de la recherche et des commandes en cours.',
      icone: 'fas fa-box'
    });
    if (!ok) return;

    this.articleService.delete(article.id!).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.photoSyncService.clearEntity('article', article.id!);
        this.findAllArticle();
        this.notificationService.addSuccess('Suppression', 'Article supprimé');
      },
      error: (err) => this.errorMsg = err.error?.message || "Erreur lors de la suppression"
    });
  }

  constructor(
    private router: Router,
    private articleService: ArtcleService,
    private exportService: ExportExcelService,
    private photoSyncService: PhotoSyncService,
    private confirmation: ConfirmationService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.findAllArticle();
  }

  findAllArticle(): void{
    this.loading = true;
    this.articleService.findAllArticle().pipe(takeUntil(this.destroy$)).subscribe({
      next: (resp) => {
        this.listArticle = this.photoSyncService.mergePhotos('article', resp);
        this.listArticleFiltre = this.listArticle;
        this.applySort();
        // le filtre saisi reste affiche dans le champ : on le reapplique
        // plutot que de reafficher la liste complete sous ses yeux
        this.filtrer();
        this.page = pageValide(this.page, this.listArticleFiltre.length, this.pageSize);
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error?.message || 'Erreur lors du chargement des articles';
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
    this.page = 1;
    this.cdr.markForCheck();
  }

  private applySort(): void {
    if (this.sortState.column) {
      this.listArticleFiltre = sortByProperty(this.listArticleFiltre, this.sortState.column, this.sortState.direction);
    }
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
        matchSearch(article.prixTtc, this.searchCategory) ||
        (article.category?.id?.toString() === this.searchCategory);
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

  nouveauArticle(): void {
    this.router.navigate(["nouvel-article"]);
  }

  exporterArticles(): void {
    this.exportService.exportArticles();
  }

  exporterStock(): void {
    this.exportService.exportStock();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleSuppression($event: any): void {
    if($event === "success"){
      this.findAllArticle();
    }else{
      this.errorMsg=$event;
    }
  }

}
