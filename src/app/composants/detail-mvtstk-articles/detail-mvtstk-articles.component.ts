import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleDto, MvtStkDto } from 'src/gs-api/src/models';
import { MvtStkService } from 'src/app/services/mvtstk/mvt-stk.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-detail-mvtstk-articles',
  templateUrl: './detail-mvtstk-articles.component.html',
  styleUrls: ['./detail-mvtstk-articles.component.css']
})
export class DetailMvtstkArticlesComponent implements OnInit, OnDestroy {

  @Input()
  article: ArticleDto = {};

  @Input()
  listMvtStk:Array<MvtStkDto> = [];

  isCorrectionOpen = false;
  correctionQuantite: number = 0;
  correctionType: string = 'correctionpos';
  correctionSource: string = 'CORRECTION_STOCK';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private mvtStkService: MvtStkService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  detailArticle() {
    this.router.navigate(["detail-mvtstk", this.article.id]);
  }

  toggleCorrection() {
    this.isCorrectionOpen = !this.isCorrectionOpen;
    if (!this.isCorrectionOpen) {
      this.correctionQuantite = 0;
      this.correctionSource = 'CORRECTION_STOCK';
    }
  }

  sauvegarderCorrection() {
    if (!this.correctionQuantite || this.correctionQuantite <= 0) {
      return;
    }
    const newStock = this.correctionType === 'correctionpos' 
      ? (this.article.stock || 0) + this.correctionQuantite 
      : (this.article.stock || 0) - this.correctionQuantite;
    
    this.mvtStkService.corregerStock(this.article.id!, newStock, this.correctionSource).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.article.stock = newStock;
      this.isCorrectionOpen = false;
      this.correctionQuantite = 0;
    });
  }

}
