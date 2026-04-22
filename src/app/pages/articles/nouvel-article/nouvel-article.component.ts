import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtcleService } from 'src/app/services/article/artcle.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { ArticleDto, CategoryDto } from 'src/gs-api/src/models';
import { PhotoService } from 'src/gs-api/src/services';
import SavePhotoParams=PhotoService.SavePhotoParams;

@Component({
  selector: 'app-nouvel-article',
  templateUrl: './nouvel-article.component.html',
  styleUrls: ['./nouvel-article.component.css']
})
export class NouvelArticleComponent implements OnInit {

  articleDto: ArticleDto={};
  categoryDto: CategoryDto={};
  listCategorie: Array<CategoryDto>=[];
  errorMsgs: Array<string>=[];
  erreur="";
  file: File | null=null;
  imgUrl: string | ArrayBuffer='favicon.ico';

  constructor(
    private articleService: ArtcleService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private photoService: PhotoService
  ) { }

  ngOnInit(): void {
    this.categoryService.findAll().subscribe(categories => {
      this.listCategorie=categories;
    });
    const idArticle=this.activatedRoute.snapshot.params['idArticle'];
    console.log('idArticle from URL:', idArticle, typeof idArticle);
    if (idArticle) {
      const articleId = +idArticle;
      console.log('Fetching article with id:', articleId);
      this.articleService.findArticleById(articleId).subscribe({
        next: (resp) => {
          console.log('Article loaded:', resp);
          console.log('prixFrs:', resp.prixFrs);
          this.articleDto=resp;
          this.categoryDto=resp.category ? resp.category : {};
          this.imgUrl = resp.photo ? resp.photo : 'favicon.ico';
        },
        error: (err) => {
          console.error('Error loading article:', err);
        }
      });
    }
  }

  saveClick(): void {
    this.articleDto.category=this.categoryDto;
    this.articleService.enregistrerArticle(this.articleDto).subscribe(art => {
      this.savePhoto(art.id, art.codeArticle);
    }, error => {
      this.errorMsgs=error.error.errors;
    });
  }

  cancelClick(): void {
    this.router.navigate(["articles"]);
  }

  calculerPrixTTC(): void {
    if (this.articleDto.prixUnitaireht && this.articleDto.tauxTva) {
      this.articleDto.prixTtc =
        +this.articleDto.prixUnitaireht + (+(this.articleDto.prixUnitaireht *
          (this.articleDto.tauxTva / 100)));
    }
  }

  onFileInput(files: FileList | null): void {
    if (files) {
      this.file=files.item(0);
      if (this.file) {
        const fileReader=new FileReader();
        fileReader.readAsDataURL(this.file);
        fileReader.onload=(event) => {
          if (fileReader.result) {
            this.imgUrl=fileReader.result;
            this.articleDto.photo="";
          }
        };
      }
    }
  }

  savePhoto(idArticle?: number, titre?: string): void {
    if (idArticle && titre && this.file) {
      const params: SavePhotoParams={
        id: idArticle,
        file: this.file,
        title: titre,
        context: 'article'
      };
      this.photoService.SavePhoto(params)
      .subscribe(res => {
        this.router.navigate(['articles']);
      });
    } else {
      this.router.navigate(['articles']);
    }
  }

}
