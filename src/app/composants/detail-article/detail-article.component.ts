import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ArtcleService } from 'src/app/services/article/artcle.service';
import { ArticleDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-detail-article',
  templateUrl: './detail-article.component.html',
  styleUrls: ['./detail-article.component.css']
})
export class DetailArticleComponent implements OnInit {

  @Input()
  articleDTO: ArticleDto = {};

  @Output()
  suppressioResult = new EventEmitter();

  constructor(
    private router: Router,
    private articleService: ArtcleService
  ) { }

  ngOnInit(): void {
  }

  modifierArticle() {
    this.router.navigate(["nouvel-article", this.articleDTO.id]);
  }

  supprimerArticle(): void {
    if(this.articleDTO.id){
      this.articleService.delete(this.articleDTO.id).subscribe( resp => {
        this.suppressioResult.emit("success");
      }, error => {
        this.suppressioResult.emit(error.error.error);
      });
    }
  }

}
