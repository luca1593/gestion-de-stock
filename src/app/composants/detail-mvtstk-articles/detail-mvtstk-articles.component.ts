import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleDto, MvtStkDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-detail-mvtstk-articles',
  templateUrl: './detail-mvtstk-articles.component.html',
  styleUrls: ['./detail-mvtstk-articles.component.css']
})
export class DetailMvtstkArticlesComponent implements OnInit {

  @Input()
  article: ArticleDto = {};

  @Input()
  listMvtStk:Array<MvtStkDto> = [];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  detailArticle() {
    this.router.navigate(["detail-mvtstk", this.article.id]);
  }

}
