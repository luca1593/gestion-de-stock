import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArtcleService } from 'src/app/services/article/artcle.service';
import { ExportExcelService } from 'src/app/services/export.service';
import { ArticleDto } from 'src/gs-api/src/models';

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

  searchCode: string = '';
  searchLibelle: string = '';
  searchCategory: string = '';

  constructor(
    private router: Router,
    private articleService: ArtcleService,
    private exportService: ExportExcelService
  ) { }

  ngOnInit(): void {
    this.findAllArticle();
  }

  findAllArticle(): void{
    this.articleService.findAllArticle().subscribe(resp => {
      this.listArticle = resp;
      this.listArticleFiltre = resp;
    });
  }

  filtrer(): void {
    this.listArticleFiltre = this.listArticle.filter(article => {
      const matchCode = !this.searchCode || (article.codeArticle?.toLowerCase().includes(this.searchCode.toLowerCase()));
      const matchLibelle = !this.searchLibelle || (article.designation?.toLowerCase().includes(this.searchLibelle.toLowerCase()));
      const matchCategory = !this.searchCategory || (article.category?.id?.toString() === this.searchCategory);
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
