import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ArtcleService } from 'src/app/services/article/artcle.service';
import { CategoryService } from 'src/app/services/category/category.service';
import { PhotoSyncService } from 'src/app/services/photo-sync/photo-sync.service';
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
  categoryDto: any = { id: null };
  listCategorie: Array<CategoryDto>=[];
  errorMsgs: Array<string>=[];
  erreur="";
  file: File | null=null;
  imgUrl: string | ArrayBuffer='favicon.ico';
  loading = true;
  submitted = false;

  constructor(
    private articleService: ArtcleService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private photoService: PhotoService,
    private photoSyncService: PhotoSyncService
  ) { }

  ngOnInit(): void {
    const idArticle=this.activatedRoute.snapshot.params['idArticle'];
    let pendingCalls = idArticle ? 2 : 1;
    const checkDone = () => {
      pendingCalls--;
      if (pendingCalls <= 0) {
        this.loading = false;
      }
    };

    this.categoryService.findAll().subscribe({
      next: (categories) => {
        this.listCategorie=categories;
        checkDone();
      },
      error: () => checkDone()
    });
    if (idArticle) {
      const articleId = +idArticle;
      this.articleService.findArticleById(articleId).subscribe({
        next: (resp) => {
          this.articleDto=resp;
          this.categoryDto=resp.category ? resp.category : { id: null };
          this.imgUrl = resp.photo ? resp.photo : 'favicon.ico';
          checkDone();
        },
        error: (err) => {
          console.error('Error loading article:', err);
          checkDone();
        }
      });
    }
  }

  saveClick(): void {
    this.submitted = true;
    this.articleDto.category=this.categoryDto;

    if (!this.articleDto.codeArticle || !this.articleDto.designation ||
        this.articleDto.prixUnitaireht == null || this.articleDto.prixUnitaireht < 0 ||
        this.articleDto.tauxTva == null || this.articleDto.tauxTva < 0 ||
        this.articleDto.prixTtc == null || this.articleDto.prixTtc < 0 ||
        !this.categoryDto.id) {
      this.errorMsgs = ['Veuillez remplir tous les champs obligatoires'];
      return;
    }

    this.articleService.enregistrerArticle(this.articleDto).subscribe(art => {
      this.articleDto = art;
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
      this.photoService.SavePhoto(params).subscribe({
        next: (response: any) => {
          if (response && response.photo) {
            this.photoSyncService.updatePhoto('article', idArticle, response.photo);
            this.articleDto.photo = response.photo;
            this.imgUrl = response.photo;
          }
          this.router.navigate(['articles']);
        },
        error: () => {
          this.router.navigate(['articles']);
        }
      });
    } else {
      this.router.navigate(['articles']);
    }
  }

}
