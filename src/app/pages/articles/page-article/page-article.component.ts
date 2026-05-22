import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArtcleService } from 'src/app/services/article/artcle.service';
import { ExportExcelService } from 'src/app/services/export.service';
import { PhotoSyncService } from 'src/app/services/photo-sync/photo-sync.service';
import { ArticleDto } from 'src/gs-api/src/models';
import { CategoryDto } from 'src/gs-api/src/models/category-dto';

@Component({
  selector: 'app-page-article',
  templateUrl: './page-article.component.html',
  styleUrls: ['./page-article.component.css']
})
export class PageArticleComponent implements OnInit {

  listArticle: Array<ArticleDto>=[];
  listArticleFiltre: Array<ArticleDto>=[];
  errorMsg: string="";
  page: number=1;
  pageSize: number = 5;
  loading = true;

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

  supprimerArticle(article: ArticleDto): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer l'article "${article.designation}" ?`)) {
      this.articleService.delete(article.id!).subscribe({
        next: () => {
          this.photoSyncService.clearEntity('article', article.id!);
          this.findAllArticle();
        },
        error: (err) => this.errorMsg = err.error?.message || "Erreur lors de la suppression"
      });
    }
  }

  constructor(
    private router: Router,
    private articleService: ArtcleService,
    private exportService: ExportExcelService,
    private photoSyncService: PhotoSyncService
  ) { }

  ngOnInit(): void {
    this.findAllArticle();
  }

  findAllArticle(): void{
    this.loading = true;
    this.articleService.findAllArticle().subscribe({
      next: (resp) => {
        this.listArticle = this.photoSyncService.mergePhotos('article', resp);
        this.listArticleFiltre = this.listArticle;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  filtrer(): void {
    this.listArticleFiltre = this.listArticle.filter(article => {
      const matchCode = !this.searchCode || (article.codeArticle?.toLowerCase().includes(this.searchCode.toLowerCase()));
      const matchLibelle = !this.searchLibelle || (article.designation?.toLowerCase().includes(this.searchLibelle.toLowerCase()));
      const matchCategory = !this.searchCategory || 
        (article.category?.designation?.toLowerCase().includes(this.searchCategory.toLowerCase())) ||
        (article.category?.id?.toString() === this.searchCategory);
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

  nouveauArticle(): void {
    this.router.navigate(["nouvel-article"]);
  }

  exporterArticles(): void {
    this.exportService.exportArticles();
  }

  exporterStock(): void {
    this.exportService.exportStock();
  }

  handleSuppression($event: any): void {
    if($event === "success"){
      this.findAllArticle();
    }else{
      this.errorMsg=$event;
    }
  }

}
