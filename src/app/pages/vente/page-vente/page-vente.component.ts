import { ArtcleService } from 'src/app/services/article/artcle.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VenteService } from 'src/app/services/vente/vente.service';
import { UserService } from 'src/app/services/user/user.service';
import { FactureService } from 'src/app/services/facture/facture.service';
import { CltfrsService } from 'src/app/services/cltfrs/cltfrs.service';
import { Encaissement } from 'src/app/composants/encaissement/encaissement.component';
import { ClientDto, ArticleDto, FactureDto, LigneVenteDto, PaiementDto, VenteDto,} from 'src/gs-api/src/models';

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
  stockErrorMsg: string = '';
  dateVente='';
  codeVente='';
  venteDto: VenteDto={};

  /*
   * Facturation : la vente est enregistrée avec sa facture et son encaissement.
   * VenteDto ne porte pas de client, or le backend refuse une facture client
   * sans clientId : le sélecteur ci-dessous est donc obligatoire tant qu'on
   * veut une facture traçable.
   */
  listClients: Array<ClientDto>=[];
  clientFacture: ClientDto | null=null;
  encaissement: Encaissement = {
    paiement: { modePaiement: 'ESPECES' },
    valide: false,
    messages: []
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private venteService: VenteService,
    private articleService: ArtcleService,
    private userService: UserService,
    private factureService: FactureService,
    private cltFrsService: CltfrsService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((data) => {
      this.origin=data['origin'];
    });
    this.searchArticle();
    this.initCodeVente();
    this.findAllClient();
  }

  private findAllClient(): void {
    this.cltFrsService.findAllClient().subscribe(clients => {
      this.listClients = clients;
    });
  }

  onEncaissementChange(encaissement: Encaissement): void {
    this.encaissement = encaissement;
  }

  /** ngModel compare les objets par référence : deux listes de clients
   *  différentes ne désignent pas le même objet. */
  compareClient(c1: ClientDto | null, c2: ClientDto | null): boolean {
    return !!c1 && !!c2 && c1.id === c2.id;
  }

  initCodeVente() {
    const date: Date=new Date();
    const jour: string=date.getFullYear() + '' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
    const heure: string=(date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + '' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + '' + (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
    this.dateVente=(date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '/' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/' + date.getFullYear();
    this.codeVente='VNT' + jour + heure;
    this.venteDto.code=this.codeVente;
    this.venteDto.dateVente=date.toISOString();
  }

  saveClick(): void {
    this.errorMsg = [];

    if (!this.ligneDeVentes.length) {
      this.errorMsg.push('Ajouter au moins un article pour la vente');
      return;
    }

    if (!this.clientFacture?.id) {
      this.errorMsg.push('Sélectionnez le client facturé');
      return;
    }

    if (!this.encaissement.valide) {
      this.errorMsg = this.encaissement.messages.length
        ? this.encaissement.messages
        : ['Renseignez le paiement de la facture'];
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
      dateVente: new Date().toISOString(),
      identreprise: entrepriseId,
      ligneVentes: ligneVentes
    };

    this.venteService.enregistrerVente(venteData).subscribe({
      next: (vente) => {
        this.enregistrerFactureVente(vente);
      },
      error: (error) => {
        console.error('Erreur vente:', error);
        const errorMessage = error.error?.message || error.error?.errors || 'Erreur lors de l\'enregistrement de la vente';
        this.errorMsg = Array.isArray(errorMessage) ? errorMessage : [errorMessage];
      }
    });
  }

  /**
   * La vente est enregistrée : on crée sa facture dans la foulée, avec le
   * paiement saisi. Si la facture échoue, la vente reste enregistrée (elle
   * l'est déjà côté base) et l'erreur est affichée — on ne fait jamais
   * perdre une vente parce que la facturation a un souci.
   */
  private enregistrerFactureVente(vente: VenteDto): void {
    if (!vente?.id) {
      this.router.navigate(['vente']);
      return;
    }
    const facture: FactureDto = this.factureService.preparerFactureSource({
      type: 'CLIENT',
      sourceType: 'VENTE',
      sourceId: vente.id,
      codeSource: vente.code ?? this.codeVente,
      lignes: this.ligneDeVentes,
      clientId: this.clientFacture?.id,
      paiement: this.encaissement.paiement
    });
    this.factureService.saveAvecPaiement(facture).subscribe({
      next: () => this.router.navigate(['liste-vente']),
      error: (error) => {
        this.errorMsg = [
          `Vente ${vente.code} enregistrée, mais la facture n'a pas pu être créée :`,
          ...this.factureService.messagesErreur(error)
        ];
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
    this.stockErrorMsg = '';
  }

  selectedArticle(article: ArticleDto): void {
    this.searchedArticle=article;
    this.codeArticle=article.codeArticle ? article.codeArticle : '';
    this.articleNotYetSelected=false;
    this.stockErrorMsg = '';
  }

  addLigneCommande(): void {
    if (!this.quantite || this.quantite < 1) {
      this.errorMsg = ['La quantité doit être supérieure à 0'];
      return;
    }

    if (!this.searchedArticle || !this.searchedArticle.id) {
      this.errorMsg = ['Veuillez sélectionner un article valide'];
      return;
    }

    const stockDispo = this.searchedArticle.stock || 0;
    const ligneExistante = this.ligneDeVentes.find(
      (ligne) => ligne.article?.codeArticle === this.searchedArticle.codeArticle
    );
    const qteExistante = ligneExistante ? (ligneExistante.quantite || 0) : 0;
    if (qteExistante + this.quantite > stockDispo) {
      this.errorMsg = [];
      this.stockErrorMsg = 'Le stock pour cet article est insuffisant pour cette commande, il reste ' + stockDispo + ' en stock';
      return;
    }

    this.stockErrorMsg = '';
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
    this.stockErrorMsg = '';
  }

  onQuantiteChange(event: {ligne: any, delta: number}): void {
    const nouvelleQte = (event.ligne.quantite || 0) + event.delta;
    if (nouvelleQte < 1) return;

    if (event.delta > 0) {
      const stockDispo = event.ligne.article?.stock || 0;
      if (nouvelleQte > stockDispo) {
        this.stockErrorMsg = 'Le stock pour cet article est insuffisant pour cette commande, il reste ' + stockDispo + ' en stock';
        return;
      }
    }

    this.stockErrorMsg = '';
    event.ligne.quantite = nouvelleQte;
    this.calculerTotalVente();
  }

  onDeleteLigne(ligne: any): void {
    const index = this.ligneDeVentes.indexOf(ligne);
    if (index > -1) {
      this.ligneDeVentes.splice(index, 1);
      this.calculerTotalVente();
    }
    this.stockErrorMsg = '';
  }

  private calculerTotalVente(): void {
    let totalCmd = 0;
    let totalQnt = 0;
    this.ligneDeVentes.forEach((ligne) => {
      if (ligne.prixUnitaire && ligne.quantite) {
        totalCmd += ligne.prixUnitaire * ligne.quantite;
        totalQnt += ligne.quantite;
      }
    });
    this.totalVente = Math.floor(totalCmd);
    this.quantiteListArticle = totalQnt;
  }
}
