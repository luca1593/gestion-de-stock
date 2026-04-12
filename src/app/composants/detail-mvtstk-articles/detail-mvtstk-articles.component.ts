import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleDto, MvtStkDto } from 'src/gs-api/src/models';
import { MvtStkService } from 'src/app/services/mvtstk/mvt-stk.service';

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

  isCorrectionOpen = false;
  correctionQuantite: number = 0;
  correctionType: string = 'correctionpos';

  constructor(
    private router: Router,
    private mvtStkService: MvtStkService
  ) { }

  ngOnInit(): void {
  }

  detailArticle() {
    this.router.navigate(["detail-mvtstk", this.article.id]);
  }

  toggleCorrection() {
    this.isCorrectionOpen = !this.isCorrectionOpen;
  }

  sauvegarderCorrection() {
    if (!this.correctionQuantite || this.correctionQuantite <= 0) {
      return;
    }
    const newStock = this.correctionType === 'correctionpos' 
      ? (this.article.stock || 0) + this.correctionQuantite 
      : (this.article.stock || 0) - this.correctionQuantite;
    
    this.mvtStkService.corregerStock(this.article.id!, newStock).subscribe(() => {
      this.article.stock = newStock;
      this.isCorrectionOpen = false;
      this.correctionQuantite = 0;
    });
  }

}
