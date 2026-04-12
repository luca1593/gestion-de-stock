import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MvtStkService } from 'src/app/services/mvtstk/mvt-stk.service';
import { ArticleDto, MvtStkDto } from 'src/gs-api/src/models';
import { ArtcleService } from 'src/app/services/article/artcle.service';

@Component({
  selector: 'app-page-mvtstk',
  templateUrl: './page-mvtstk.component.html',
  styleUrls: ['./page-mvtstk.component.css']
})
export class PageMvtstkComponent implements OnInit, OnDestroy {

  page: number=0;
  maplistMvtStk=new Map();
  listArticle: Array<ArticleDto>=[];
  errorMsgs: string="";

  constructor(
    private mvtStkService: MvtStkService,
    private articleService: ArtcleService
  ) { }

  ngOnInit(): void {
    this.findAllArticle();
  }

  ngOnDestroy(): void {
  }

  findAllArticle(){
    this.articleService.findAllArticle().subscribe({
      next: (list) => {
        this.listArticle = list;
        this.listArticle.forEach(article => {
          if (article.id && article.stock) {
            this.mvtStkService.setArticleStock(article.id, article.stock);
          }
        });
        this.findAllMvtStk();
      },
      error: (err) => {
        this.errorMsgs = err.error?.message || 'Erreur lors du chargement des articles';
      }
    });
  }

  findAllMvtStk(){
    this.listArticle.forEach(article => {
      if (article.id) {
        this.findAllMvtStkByArticle(article.id);
      }
    });
  }
  
  findAllMvtStkByArticle(idArticle: number){
    this.mvtStkService.findAllMvtByArticle(idArticle).subscribe({
      next: (list) => {
        this.maplistMvtStk.set(idArticle, list);
      },
      error: (err) => {
        this.errorMsgs = err.error?.error || 'Erreur lors du chargement des mouvements';
      }
    });
  }

}
