import { ArtcleService } from 'src/app/services/article/artcle.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VenteService } from 'src/app/services/vente/vente.service';
import { UserService } from 'src/app/services/user/user.service';
import { ArticleDto, LigneVenteDto, VenteDto,} from 'src/gs-api/src/models';

@Component({
  selector: 'app-pave-vente',
  templateUrl: './page-vente.component.html',
  styleUrls: ['./page-vente.component.css'],
})
export class PageVenteComponent implements OnInit {
  origin='';
  searchedArticle: ArticleDto={};
  articleErrorMsg='';
  codeArticle='';
  quantite: number=0;
  ligneDeVentes: Array<any>=[];
  totalVente: number=0;
  quantiteListArticle: number=0;
  listArticles: Array<ArticleDto>=[];
  articleNotYetSelected=true;
  errorMsg: Array<string>=[];
  dateVente='';
  codeVente='';
  venteDto: VenteDto={};

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private venteService: VenteService,
    private articleService: ArtcleService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      this.origin=data['origin'];
    });
    this.searchArticle();
    this.initCodeVente();
  }

  initCodeVente() {
    const date: Date=new Date();
    const jour: string=date.getFullYear() + '' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    const heure: string=(date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + '' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + '' + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    this.dateVente=(date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '/' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/' + date.getFullYear();
    this.codeVente='VNT' + jour + heure;
    this.venteDto.code=this.codeVente;
    this.venteDto.dateVente=date.getTime();
  }

  saveClick(): void {
    this.errorMsg = [];
    
    if (!this.ligneDeVentes.length) {
      this.errorMsg.push('Ajouter au moins un article pour la vente');
      return;
    }

    const entrepriseId = this.userService.getConnectedUser().entreprise?.id;
    if (!entrepriseId) {
      this.errorMsg.push('Erreur:Entreprise non trouvée. Veuillez vous reconnecter.');
      return;
    }

    const ligneVentes: LigneVenteDto[] = this.ligneDeVentes.map(ligne => ({
      article: ligne.article,
      prixUnitaire: ligne.prixUnitaire,
      quantite: ligne.quantite
    }));

    const venteData: VenteDto = {
      code: this.codeVente,
      dateVente: new Date().getTime(),
      identreprise: entrepriseId,
      ligneVentes: ligneVentes
    };

    this.venteService.enregistrerVente(venteData).subscribe({
      next: (vente) => {
        this.router.navigate(['vente']);
        window.location.reload();
      },
      error: (error) => {
        console.error('Erreur vente:', error);
        const errorMessage = error.error?.message || error.error?.errors || 'Erreur lors de l\'enregistrement de la vente';
        this.errorMsg = Array.isArray(errorMessage) ? errorMessage : [errorMessage];
      }
    });
  }

  cancelClick(): void {
    this.router.navigate(['vente']);
    window.location.reload();
  }

  searchArticle(): void {
    if (this.codeArticle.length === 0) {
      this.findAllArticle();
    }
    this.listArticles=this.listArticles.filter(
      (art) =>
        art?.codeArticle?.startsWith(this.codeArticle) ||
        art?.designation ?.toLowerCase().startsWith(this.codeArticle.toLowerCase())
    );
    this.articleNotYetSelected=true;
  }

  selectedArticle(article: ArticleDto): void {
    this.searchedArticle=article;
    this.codeArticle=article.codeArticle ? article.codeArticle : '';
    this.articleNotYetSelected=false;
  }

  addLigneCommande(): void {
    let totalCmd=0;
    let totalQnt=0;

    const ligneArleadyExist=this.ligneDeVentes.find(
      (ligne) => ligne.article?.codeArticle === this.searchedArticle.codeArticle
    );

    if (ligneArleadyExist) {
      this.ligneDeVentes.forEach((ligne) => {
        if (
          ligne &&
          ligne.article?.codeArticle === this.searchedArticle.codeArticle
        ) {
          //@ts-ignore
          ligne.quantite += this.quantite;
        }
      });
    } else {
      const ligneDeVnt: LigneVenteDto={
        article: this.searchedArticle,
        prixUnitaire: this.searchedArticle.prixTtc,
        quantite: +this.quantite,
      };
      this.ligneDeVentes.push(ligneDeVnt);
    }

    this.ligneDeVentes.forEach((ligne) => {
      if (ligne.prixUnitaire && ligne.quantite) {
        totalCmd += ligne.prixUnitaire * ligne.quantite;
        totalQnt += ligne.quantite;
      }
    });
    this.totalVente=Math.floor(totalCmd);
    this.quantiteListArticle=totalQnt;
    this.searchedArticle={};
    this.codeArticle='';
    this.quantite=0;
    this.articleNotYetSelected=true;
    this.searchArticle();
  }

  findAllArticle() {
    this.articleService.findAllArticle().subscribe((articles) => {
      this.listArticles=articles;
    });
  }
}
