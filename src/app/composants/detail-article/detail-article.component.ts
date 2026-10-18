import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ArtcleService } from 'src/app/services/article/artcle.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ArticleDto } from 'src/gs-api/src/models';
import { ConfirmationService } from 'src/app/composants/confirmation/confirmation.service';
import { NotificationService } from 'src/app/services/notification/notification.service';

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
    private modalService: ModalService,
    private confirmation: ConfirmationService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
  }

  modifierArticle() {
    this.router.navigate(["nouvel-article", this.articleDTO.id]);
  }

  async openDeleteModal(): Promise<void> {
    if (!this.articleDTO.id) return;

    const ok = await this.confirmation.demander({
      titre: 'Supprimer cet article ?',
      message: 'Voulez-vous vraiment supprimer cet article ?',
      element: this.articleDTO.designation,
      consequence: 'Il disparaîtra des listes, de la recherche et des commandes en cours.',
      icone: 'fas fa-box'
    });
    if (!ok) return;

    this.articleService.delete(this.articleDTO.id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.suppressioResult.emit("success");
        this.notificationService.addSuccess('Suppression', 'Article supprimé');
      },
      error: (error) => {
        this.suppressioResult.emit(error.error.message);
        this.notificationService.addError('Erreur', error.error?.message || 'Erreur lors de la suppression');
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  detailArticle() {
    this.router.navigate(["detail-article", this.articleDTO.id]);
  }

}
