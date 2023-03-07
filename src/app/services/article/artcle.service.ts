import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticleDto } from 'src/gs-api/src/models';
import { ArticlesService as ApiArticleService } from "src/gs-api/src/services/articles.service";
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ArtcleService {
  
  constructor(
    private userService: UserService,
    private articleService: ApiArticleService
  ) { }

  enregistrerArticle(articleDTO: ArticleDto): Observable<ArticleDto>{
    articleDTO.entreprise = this.userService.getConnectedUser().entreprise;
    return this.articleService.ArticleApiSavePOST(articleDTO);
  }

  findAllArticle(): Observable<ArticleDto[]>{
    return this.articleService.ArticleApiFindAllGET();
  }

  findArticleById(idArticle: number): Observable<ArticleDto>{
    return this.articleService.ArticleApiFindByIdGET(idArticle);
  }

  delete(idArticle: number): Observable<any> {
    return this.articleService.ArticleApiDELETE(idArticle);
  }

}
