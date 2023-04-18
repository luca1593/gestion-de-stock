import { Component, Input, OnInit } from '@angular/core';
import { MvtStkService } from 'src/app/services/mvtstk/mvt-stk.service';
import { ArticleDto, MvtStkDto } from 'src/gs-api/src/models';
import { ArtcleService } from 'src/app/services/article/artcle.service';

@Component({
  selector: 'app-page-mvtstk',
  templateUrl: './page-mvtstk.component.html',
  styleUrls: ['./page-mvtstk.component.css']
})
export class PageMvtstkComponent implements OnInit {

  page: number = 0;
  maplistMvtStk = new Map();
  listArticle: Array<ArticleDto> = [];
  errorMsgs: string = "";

  constructor(
    private mvtStkService: MvtStkService,
    private articleService: ArtcleService
  ) { }

  ngOnInit(): void {
    this.findAllArticle();
  }

  findAllArticle(){
    this.articleService.findAllArticle().subscribe( list => {
      this.listArticle = list;
      this.findAllMvtStk();
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
    this.mvtStkService.findAllMvtByArticle(idArticle).subscribe( list => {
      this.maplistMvtStk.set(idArticle, list);
    }, error => {
      this.errorMsgs = error.error.error;
    });
  }

}
