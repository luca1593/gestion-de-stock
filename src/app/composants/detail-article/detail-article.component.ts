import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ArtcleService } from 'src/app/services/article/artcle.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { ArticleDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-detail-article',
  templateUrl: './detail-article.component.html',
  styleUrls: ['./detail-article.component.css']
})
export class DetailArticleComponent implements OnInit {

  @Input()
  articleDTO: ArticleDto={};

  @Output()
  suppressioResult=new EventEmitter();

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
      this.articleService.delete(this.articleDTO.id).subscribe( resp => {
        this.suppressioResult.emit("success");
        this.closeDeleteModal();
      }, error => {
        this.suppressioResult.emit(error.error.message);
        this.closeDeleteModal();
      });
    }
  }

  closeDeleteModal(): void {
    const modalId = 'modalConfirmDelete' + this.articleDTO.id;
    this.modalService.closeModal(modalId);
  }

  detailArticle() {
    this.router.navigate(["detail-article", this.articleDTO.id]);
  }

}
