import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { ArtcleService } from 'src/app/services/article/artcle.service';
import { CltfrsService } from 'src/app/services/cltfrs/cltfrs.service';
import { CmdCltFrsService } from 'src/app/services/cmdcltfrs/cmd-clt-frs.service';
import { AdresseDto, ArticleDto, ClientDto, CommandeClientDto, CommandeFournisseurDto, LigneCommandeClientDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-nouvel-cmd-clt-frs',
  templateUrl: './nouvel-cmd-clt-frs.component.html',
  styleUrls: ['./nouvel-cmd-clt-frs.component.css']
})
export class NouvelCmdCltFrsComponent implements OnInit {

  origin='';
  isModification: boolean = false;
  selectedClientFournisseur: any={};
  selectedAdressCltFrs: AdresseDto={};
  listClientFouenisseur: Array<any>=[];
  searchedArticle: ArticleDto={};
  articleErrorMsg="";
  codeArticle="";
  quantite: number=0;
  ligneDeCommandes: Array<any>=[];
  ligneDeCommandesOriginales: Array<any>=[];
  totalCommande: number=0;
  quantiteListArticle: number=0;
  listArticles: Array<ArticleDto>=[];
  articleNotYetSelected=true;
  errorMsg: Array<string>=[];
  dateCmd="";
  codeCmd="";
  etatCommande: string = 'EN_PREPARATION';
  etatCommandeOriginal: string = '';
  commandeId: number | null = null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cltFrsService: CltfrsService,
    private articleService: ArtcleService,
    private commandeCltFrs: CmdCltFrsService
    ) { }

  ngOnInit():void {
    this.activatedRoute.data.subscribe(data => {
      this.origin=data['origin'];
    });
    this.findAllCltFrs();
    this.findAllArticle();
    const idCmd = this.activatedRoute.snapshot.params['idCmd'];
    if (idCmd) {
      this.isModification = true;
      this.loadCommande(idCmd);
    } else {
      this.initCodeCmd();
    }
    const idCltFrs=this.activatedRoute.snapshot.params['id'];
    if (idCltFrs && !idCmd) {
      if (this.origin === "client") {
        this.cltFrsService.findClientById(idCltFrs).subscribe(clt => {
          this.selectedClientFournisseur=clt;
        });
      } else if (this.origin === "fournisseur") {
        this.cltFrsService.findFournisseurById(idCltFrs).subscribe(frs => {
          this.selectedClientFournisseur=frs;
        });
      }
    }
  }

  loadCommande(idCmd: number): void {
    this.commandeId = idCmd;
    if (this.origin === 'client') {
      this.commandeCltFrs.findCommandeClientById(idCmd).subscribe(cmd => {
        this.codeCmd = cmd.code || '';
        this.etatCommande = cmd.etatcommande || 'EN_PREPARATION';
        this.etatCommandeOriginal = cmd.etatcommande || 'EN_PREPARATION';
        this.selectedClientFournisseur = cmd.client ? {...cmd.client} : {};
        console.log('Client chargé:', this.selectedClientFournisseur);
        if (cmd.dateCommande) {
          const date = new Date(cmd.dateCommande);
          this.dateCmd = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '/' +
            ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '/' +
            date.getFullYear();
        }
        this.commandeCltFrs.findAllLigneCommandeClient(idCmd).subscribe(lignes => {
          this.ligneDeCommandes = lignes || [];
          this.ligneDeCommandesOriginales = JSON.parse(JSON.stringify(lignes || []));
          console.log('Lignes de commande:', this.ligneDeCommandes);
          this.calculateTotal();
        });
        this.findAllArticle();
      });
    } else if (this.origin === 'fournisseur') {
      this.commandeCltFrs.findCommandeFournisseurById(idCmd).subscribe(cmd => {
        this.codeCmd = cmd.code || '';
        this.etatCommande = cmd.etatcommande || 'EN_PREPARATION';
        this.etatCommandeOriginal = cmd.etatcommande || 'EN_PREPARATION';
        this.selectedClientFournisseur = cmd.fournisseur ? {...cmd.fournisseur} : {};
        console.log('Fournisseur chargé:', this.selectedClientFournisseur);
        if (cmd.dateCommande) {
          const date = new Date(cmd.dateCommande);
          this.dateCmd = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '/' +
            ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '/' +
            date.getFullYear();
        }
        this.commandeCltFrs.findAllLigneCommandeFournisseur(idCmd).subscribe(lignes => {
          this.ligneDeCommandes = lignes || [];
          this.ligneDeCommandesOriginales = JSON.parse(JSON.stringify(lignes || []));
          console.log('Lignes de commande:', this.ligneDeCommandes);
          this.calculateTotal();
        });
        this.findAllArticle();
      });
    }
  }

  calculateTotal(): void {
    let total = 0;
    let qnt = 0;
    this.ligneDeCommandes.forEach(ligne => {
      if (ligne.prixUnitaire && ligne.quantite) {
        total += ligne.prixUnitaire * ligne.quantite;
        qnt += ligne.quantite;
      }
    });
    this.totalCommande = Math.floor(total);
    this.quantiteListArticle = qnt;
  }

  onEtatChange(newEtat: string): void {
    this.etatCommande = newEtat;
  }

  compareClientFournisseur(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  initCodeCmd(){
    const date: Date=new Date();
    const jour: string=date.getFullYear() + "" + ((date.getMonth() + 1) <10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1))+ "" + (date.getDate() <10 ? ("0" + date.getDate()) : date.getDate());
    const heure: string=(date.getHours() <10 ? ("0" + date.getHours()) : date.getHours()) + "" + (date.getMinutes() <10 ? ("0" + date.getMinutes()) : date.getMinutes())  + "" + (date.getSeconds() <10 ? ("0" + date.getSeconds()) : date.getSeconds());
    this.dateCmd=(date.getDate() <10 ? ("0" + date.getDate()) : date.getDate()) + "/" + ((date.getMonth() + 1) <10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)) + "/" + date.getFullYear()
    if(this.origin === "client"){
      this.codeCmd="CMDCLT" + jour + heure;
    }else if(this.origin === "fournisseur"){
      this.codeCmd="CMDFRS" + jour + heure;
    }
  }

  saveClick():void {
    if (this.ligneDeCommandes.length === 0) {
      this.errorMsg = ['Veuillez ajouter au moins un article pour la commande'];
      return;
    }
    
    if (this.isModification && this.commandeId) {
      this.processModification();
    } else {
      this.enregistrerNouvelleCommande();
    }
  }

  private processModification(): void {
    if (this.ligneDeCommandes.length === 0) {
      this.errorMsg = ['Veuillez ajouter au moins un article pour la commande'];
      return;
    }
    
    this.errorMsg = [];
    
    if (this.etatCommande !== this.etatCommandeOriginal) {
      console.log('État modifié:', this.etatCommandeOriginal, '->', this.etatCommande);
      if (this.origin === 'client') {
        this.commandeCltFrs.updateEtatCommandeClient(this.commandeId!, this.etatCommande)
          .subscribe({
            next: () => {
              this.processLignesModification();
            },
            error: (err) => {
              this.errorMsg = err.error?.errors || ['Erreur lors de la mise à jour de l\'état'];
            }
          });
      } else {
        this.commandeCltFrs.updateEtatCommandeFournisseur(this.commandeId!, this.etatCommande)
          .subscribe({
            next: () => {
              this.processLignesModification();
            },
            error: (err) => {
              this.errorMsg = err.error?.errors || ['Erreur lors de la mise à jour de l\'état'];
            }
          });
      }
    } else {
      this.processLignesModification();
    }
  }

  private processLignesModification(): void {
    const nouvellesLignes = this.ligneDeCommandes.filter(l => !l.id);
    
    if (nouvellesLignes.length > 0) {
      console.log('Nouvelles lignes à ajouter:', nouvellesLignes);
      const commande = this.preparerCommandePourModification();
      const dateTimestamp = new Date().getTime();
      if (this.origin === 'client') {
        this.commandeCltFrs.updateCommandeClient(commande as CommandeClientDto, dateTimestamp)
          .subscribe({
            next: () => {
              console.log('Commande mise à jour avec succès');
              this.router.navigate(['commande-client']);
            },
            error: (err) => {
              console.error('Erreur:', err);
              this.errorMsg = err.error?.errors || ['Erreur lors de la mise à jour'];
            }
          });
      } else {
        this.commandeCltFrs.updateCommandeFournisseur(commande as CommandeFournisseurDto, dateTimestamp)
          .subscribe({
            next: () => {
              console.log('Commande mise à jour avec succès');
              this.router.navigate(['commande-fournisseur']);
            },
            error: (err) => {
              console.error('Erreur:', err);
              this.errorMsg = err.error?.errors || ['Erreur lors de la mise à jour'];
            }
          });
      }
      return;
    }

    const calls: Observable<any>[] = [];

    this.ligneDeCommandesOriginales.forEach(ligneOrig => {
      const ligneActuelle = this.ligneDeCommandes.find(l => l.id === ligneOrig.id);
      if (!ligneActuelle) {
        console.log('Ligne supprimée:', ligneOrig.id);
        if (this.origin === 'client') {
          calls.push(this.commandeCltFrs.deleteLigneCommandeClient(this.commandeId!, ligneOrig.id!));
        } else {
          calls.push(this.commandeCltFrs.deleteLigneCommandeFournisseur(this.commandeId!, ligneOrig.id!));
        }
      } else {
        if (ligneActuelle.quantite !== ligneOrig.quantite) {
          console.log('Quantité modifiée:', ligneOrig.quantite, '->', ligneActuelle.quantite);
          if (this.origin === 'client') {
            calls.push(this.commandeCltFrs.updateQuantiteCommandeClient(this.commandeId!, ligneOrig.id!, ligneActuelle.quantite));
          } else {
            calls.push(this.commandeCltFrs.updateQuantiteCommandeFournisseur(this.commandeId!, ligneOrig.id!, ligneActuelle.quantite));
          }
        }
        if (ligneActuelle.article?.id !== ligneOrig.article?.id) {
          console.log('Article modifié:', ligneOrig.article?.id, '->', ligneActuelle.article?.id);
          if (this.origin === 'client') {
            calls.push(this.commandeCltFrs.updateArticleCommandeClient(this.commandeId!, ligneOrig.id!, ligneActuelle.article?.id!));
          } else {
            calls.push(this.commandeCltFrs.updateArticleCommandeFournisseur(this.commandeId!, ligneOrig.id!, ligneActuelle.article?.id!));
          }
        }
      }
    });

    if (calls.length === 0) {
      console.log('Aucune modification détectée');
      this.router.navigate([this.origin === 'client' ? 'commande-client' : 'commande-fournisseur']);
      return;
    }

    forkJoin(calls).subscribe({
      next: () => {
        console.log('Modifications terminées');
        this.router.navigate([this.origin === 'client' ? 'commande-client' : 'commande-fournisseur']);
      },
      error: (err) => {
        console.error('Erreur:', err);
        this.errorMsg = err.error?.errors || ['Erreur lors de la mise à jour'];
      }
    });
  }

  private preparerCommandePourModification(): any {
    if (this.origin === 'client') {
      return {
        id: this.commandeId,
        client: this.selectedClientFournisseur,
        code: this.codeCmd,
        etatcommande: this.etatCommande,
        ligneCommandeClients: this.ligneDeCommandes
      };
    } else {
      return {
        id: this.commandeId,
        fournisseur: this.selectedClientFournisseur,
        code: this.codeCmd,
        etatcommande: this.etatCommande,
        ligneCommandeFournisseurs: this.ligneDeCommandes
      };
    }
  }

  private enregistrerNouvelleCommande(): void {
    const commande = this.preparerCommande();
    const dateTimestamp = new Date().getTime();

    if (this.origin === "client") {
      this.commandeCltFrs.enregistrerCommandeClient(commande as CommandeClientDto, dateTimestamp).subscribe(
        cmd => {
          this.router.navigate(['commande-client']);
        }, error => {
          this.errorMsg = error.error.errors;
        }
      );
    } else {
      this.commandeCltFrs.enregistrerCommandeFournisseur(commande as CommandeFournisseurDto, dateTimestamp).subscribe(
        cmd => {
          this.router.navigate(['commande-fournisseur']);
        }, error => {
          this.errorMsg = error.error.errors;
        }
      );
    }
  }

  private preparerCommande(): any{
    if(this.origin === "client"){
      return  {
        client: this.selectedClientFournisseur,
        code: this.codeCmd,
        etatcommande: this.etatCommande,
        ligneCommandeClients: this.ligneDeCommandes
      }
    } else if(this.origin === "fournisseur"){
      return  {
        fournisseur: this.selectedClientFournisseur,
        code: this.codeCmd,
        etatcommande: this.etatCommande,
        ligneCommandeFournisseurs: this.ligneDeCommandes
      }
    }
  }

  cancelClick():void {
    if(this.origin === "client"){
      this.router.navigate(["commande-client"]);
    }else if(this.origin === "fournisseur"){
      this.router.navigate(["commande-fournisseur"]);
    }
  }

  findAllCltFrs():void {
    if(this.origin === "client"){
      this.cltFrsService.findAllClient()
        .subscribe(clients => {
          this.listClientFouenisseur=clients;
        })
    }else if(this.origin === "fournisseur"){
      this.cltFrsService.findAllFournisseurs()
        .subscribe(fournisseurs => {
         this.listClientFouenisseur=fournisseurs;
        })
    }
  }

  findArticleByCode(code: string):void {
    if(code){
      this.articleService.findArticleByCode(code)
      .subscribe(article => {
        this.searchedArticle=article;
        this.articleErrorMsg="";
      }, error => {
        this.articleErrorMsg=error.error.error;
      });
    }
  }

  searchArticle():void {
    if(this.codeArticle.length === 0) {
      this.findAllArticle();
    }
    this.listArticles=this.listArticles.filter(
      art => art?.codeArticle?.startsWith(this.codeArticle)
      || art?.designation?.toLowerCase().startsWith(this.codeArticle.toLowerCase())
    );
    this.articleNotYetSelected=true;
  }

  selectedArticle(article: ArticleDto): void{
    this.searchedArticle=article;
    this.codeArticle=article.codeArticle ? article.codeArticle : "";
    this.articleNotYetSelected=false;
  }

  addLigneCommande():void {
    console.log('searchedArticle:', this.searchedArticle);
    console.log('codeArticle:', this.codeArticle);
    console.log('quantite:', this.quantite);
    
    if (!this.searchedArticle || !this.searchedArticle.id) {
      this.errorMsg = ['Veuillez sélectionner un article valide'];
      return;
    }
    
    let totalCmd=0;
    let totalQnt=0;

    const ligneArleadyExist=this.ligneDeCommandes.find(
      ligne => ligne.article?.codeArticle === this.searchedArticle.codeArticle
    );

    if(ligneArleadyExist){
      this.ligneDeCommandes.forEach(ligne => {
        if(ligne && ligne.article?.codeArticle === this.searchedArticle.codeArticle){
          //@ts-ignore
          ligne.quantite += this.quantite;
        }
      });
    }else{
      const ligneDeCommande: LigneCommandeClientDto={
        article : this.searchedArticle,
        prixUnitaire: this.searchedArticle.prixTtc,
        quantite: +this.quantite
      }
      this.ligneDeCommandes.push(ligneDeCommande);
    }
    
    console.log('ligneDeCommandes après ajout:', this.ligneDeCommandes);

    this.ligneDeCommandes.forEach(ligne => {
      if(ligne.prixUnitaire && ligne.quantite){
        totalCmd += ligne.prixUnitaire * ligne.quantite;
        totalQnt += ligne.quantite;
      }
    });
    this.totalCommande=Math.floor(totalCmd);
    this.quantiteListArticle=totalQnt;
    this.searchedArticle={};
    this.codeArticle="";
    this.quantite=0;
    this.articleNotYetSelected=true;
    this.findAllArticle();
  }

  onDeleteLigne(ligne: any): void {
    const index = this.ligneDeCommandes.indexOf(ligne);
    if (index > -1) {
      this.ligneDeCommandes.splice(index, 1);
      this.calculateTotal();
    }
  }

  trackByLigneId(index: number, ligne: any): number {
    return ligne.id || index;
  }

  findAllArticle(){
    this.articleService.findAllArticle()
    .subscribe(articles => {
      this.listArticles=articles;
    });
  }

}
