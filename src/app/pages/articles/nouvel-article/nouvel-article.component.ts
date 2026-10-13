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

  /*
   * Codes deja utilises,-charges a l'ouverture. Le backend n'impose aucune
   * unicite sur codeArticle : sans ce controle, creer « ART_ALL » cinq fois
   * donnait cinq articles au meme code, avec des stocks et des mouvements
   * repartis entre eux.
   */
  private codesArticlesExistants = new Set<string>();
  erreur="";
  file: File | null=null;
  imgUrl: string | ArrayBuffer='data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2212%22%20fill%3D%22%23e9ecef%22%2F%3E%3Crect%20x%3D%2228%22%20y%3D%2230%22%20width%3D%2244%22%20height%3D%2232%22%20rx%3D%224%22%20fill%3D%22%23adb5bd%22%2F%3E%3Crect%20x%3D%2232%22%20y%3D%2270%22%20width%3D%2236%22%20height%3D%224%22%20rx%3D%222%22%20fill%3D%22%23ced4da%22%2F%3E%3Crect%20x%3D%2232%22%20y%3D%2278%22%20width%3D%2224%22%20height%3D%224%22%20rx%3D%222%22%20fill%3D%22%23ced4da%22%2F%3E%3C%2Fsvg%3E';
  loading = true;
  submitted = false;
  isEditMode = false;

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
    let pendingCalls = idArticle ? 3 : 2;
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

    this.articleService.findAllArticle().subscribe({
      next: (articles) => {
        // le parametre de route s'appelle idArticle, pas id : sans cette
        // distinction, la edition d'un article se faisait refuser parce que
        // son propre code etait deja dans la liste
        this.codesArticlesExistants = new Set(
          (articles || [])
            .filter(a => !idArticle || String(a.id) !== String(idArticle))
            .map(a => (a.codeArticle || '').trim().toUpperCase())
            .filter(Boolean)
        );
        checkDone();
      },
      error: () => checkDone()
    });
    if (idArticle) {
      this.isEditMode = true;
      const articleId = +idArticle;
      this.articleService.findArticleById(articleId).subscribe({
        next: (resp) => {
          this.articleDto=resp;
          this.categoryDto=resp.category ? resp.category : { id: null };
          this.imgUrl = resp.photo ? resp.photo : 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20100%22%3E%3Crect%20width%3D%22100%22%20height%3D%22100%22%20rx%3D%2212%22%20fill%3D%22%23e9ecef%22%2F%3E%3Crect%20x%3D%2228%22%20y%3D%2230%22%20width%3D%2244%22%20height%3D%2232%22%20rx%3D%224%22%20fill%3D%22%23adb5bd%22%2F%3E%3Crect%20x%3D%2232%22%20y%3D%2270%22%20width%3D%2236%22%20height%3D%224%22%20rx%3D%222%22%20fill%3D%22%23ced4da%22%2F%3E%3Crect%20x%3D%2232%22%20y%3D%2278%22%20width%3D%2224%22%20height%3D%224%22%20rx%3D%222%22%20fill%3D%22%23ced4da%22%2F%3E%3C%2Fsvg%3E';
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
    // sans cet effacement, l'erreur de la tentative précédente restait
    // affichée alors que l'utilisateur venait de corriger le formulaire
    this.errorMsgs = [];

    /*
     * Un seul message « Veuillez remplir tous les champs obligatoires » pour
     * des problems différents : l'utilisateur lisait que des champs
     * manquaient alors qu'ils etaient tous remplis. On nomme le champ fautif.
     */
    const manquants: string[] = [];
    if (!this.articleDto.codeArticle) manquants.push('code article');
    if (!this.articleDto.designation) manquants.push('désignation');
    if (!this.categoryDto.id) manquants.push('catégorie');
    if (this.articleDto.prixUnitaireht == null) manquants.push('prix unitaire HT');
    if (this.articleDto.tauxTva == null) manquants.push('taux de TVA');
    if (this.articleDto.prixTtc == null) manquants.push('prix unitaire TTC');
    if (manquants.length) {
      this.errorMsgs = ['Merci de renseigner : ' + manquants.join(', ')];
      return;
    }

    const code = (this.articleDto.codeArticle || '').trim();
    if (this.codesArticlesExistants.has(code.toUpperCase())) {
      this.errorMsgs = ['Un article porte déjà le code « ' + code + ' ». '
        + 'Choisissez un code différent : deux articles au même code partageraient leur stock.'];
      return;
    }

    /*
     * Les prix ne peuvent pas etre negatifs, et le stock non plus : sans ce
     * controle, un collage de « -10 » dans le stock passait le min="0" du
     * navigateur et partait en base. (Le min="0" et le blocage de la touche
     * « - » ne couvrent que la saisie au clavier.)
     */
    const ht = +this.articleDto.prixUnitaireht!;
    const tva = +this.articleDto.tauxTva!;
    const ttc = +this.articleDto.prixTtc!;
    const stock = this.articleDto.stock != null ? +this.articleDto.stock : null;

    const negatifs: string[] = [];
    if (ht < 0) negatifs.push('prix unitaire HT');
    if (tva < 0) negatifs.push('taux de TVA');
    if (ttc < 0) negatifs.push('prix unitaire TTC');
    if (stock !== null && stock < 0) negatifs.push('stock');
    if (negatifs.length) {
      this.errorMsgs = ['Les valeurs suivantes ne peuvent pas être négatives : ' + negatifs.join(', ')];
      return;
    }

    if (tva > 100) {
      this.errorMsgs = ['Le taux de TVA ne peut pas dépasser 100 %'];
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

  /*
   * Le test portait sur la véracité (&&) et non sur la présence : un prix HT
   * à 0 ou un taux de TVA à 0 sont des valeurs valides, mais « 0 » étant
   * faux, le TTC restait figé sur la valeur précédente. Un article à 100 HT
   * passé à 0 % de TVA gardait donc un TTC de 120 au lieu de 100.
   */
  calculerPrixTTC(): void {
    if (this.articleDto.prixUnitaireht != null && this.articleDto.tauxTva != null) {
      const ht = +this.articleDto.prixUnitaireht;
      this.articleDto.prixTtc = ht + (ht * (+this.articleDto.tauxTva / 100));
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
