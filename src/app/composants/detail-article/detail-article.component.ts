import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ArtcleService } from 'src/app/services/article/artcle.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArticleDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-detail-article',
  templateUrl: './detail-article.component.html',
  styleUrls: ['./detail-article.component.css']
})
export class DetailArticleComponent implements OnInit, OnDestroy {

  @Input()
  articleDTO: ArticleDto={};

  @Output()
  suppressioResult=new EventEmitter();

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private articleService: ArtcleService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
  }

  modifierArticle() {
    this.router.navigate(["nouvel-article", this.articleDTO.id]);
  }

  openDeleteModal(): void {
    const modalId = 'modalConfirmDelete' + this.articleDTO.id;
    this.modalService.openModal(modalId);
  }

  supprimerArticle(): void {
    if(this.articleDTO.id){
      this.articleService.delete(this.articleDTO.id).pipe(takeUntil(this.destroy$)).subscribe( resp => {
        this.suppressioResult.emit("success");
        this.closeDeleteModal();
      }, error => {
        this.suppressioResult.emit(error.error.message);
        this.closeDeleteModal();
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeDeleteModal(): void {
    const modalId = 'modalConfirmDelete' + this.articleDTO.id;
    this.modalService.closeModal(modalId);
  }

  detailArticle() {
    this.router.navigate(["detail-article", this.articleDTO.id]);
  }

}
