import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  totalCommande: number=0;
  quantiteListArticle: number=0;
  listArticles: Array<ArticleDto>=[];
  articleNotYetSelected=true;
  errorMsg: Array<string>=[];
  dateCmd="";
  codeCmd="";
  etatCommande: string = 'EN_PREPARATION';

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
    const idCmd = this.activatedRoute.snapshot.params['idCmd'];
    if (idCmd) {
      this.isModification = true;
      this.loadCommande(idCmd);
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
    this.findAllCltFrs();
    this.findAllArticle();
    this.initCodeCmd();
  }

  loadCommande(idCmd: number): void {
    if (this.origin === 'client') {
      this.commandeCltFrs.findCommandeClientById(idCmd).subscribe(cmd => {
        this.codeCmd = cmd.code || '';
        this.etatCommande = cmd.etatcommande || 'EN_PREPARATION';
        this.selectedClientFournisseur = cmd.client || {};
        this.ligneDeCommandes = cmd.ligneCommandeClients || [];
        this.calculateTotal();
        if (cmd.dateCommande) {
          const date = new Date(cmd.dateCommande);
          this.dateCmd = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '/' +
            ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '/' +
            date.getFullYear();
        }
        this.findAllArticle();
      });
    } else if (this.origin === 'fournisseur') {
      this.commandeCltFrs.findCommandeFournisseurById(idCmd).subscribe(cmd => {
        this.codeCmd = cmd.code || '';
        this.etatCommande = cmd.etatcommande || 'EN_PREPARATION';
        this.selectedClientFournisseur = cmd.fournisseur || {};
        this.ligneDeCommandes = cmd.ligneCommandeFournisseurs || [];
        this.calculateTotal();
        if (cmd.dateCommande) {
          const date = new Date(cmd.dateCommande);
          this.dateCmd = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '/' +
            ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '/' +
            date.getFullYear();
        }
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
    const commande=this.preparerCommande();
    const dateTimestamp = new Date().getTime();
    
    if (this.isModification) {
      if(this.origin === "client") {
        this.commandeCltFrs.updateCommandeClient(commande as CommandeClientDto, dateTimestamp).subscribe(
          cmd => {
            this.router.navigate(['commande-client']);
          }, error => {
            this.errorMsg=error.error.errors;
          }
        );
      } else if(this.origin === "fournisseur") {
        this.commandeCltFrs.updateCommandeFournisseur(commande as CommandeFournisseurDto, dateTimestamp).subscribe(
          cmd => {
            this.router.navigate(['commande-fournisseur']);
          }, error => {
            this.errorMsg=error.error.errors;
          }
        );
      }
    } else {
      if(this.origin === "client") {
        this.commandeCltFrs.enregistrerCommandeClient(commande as CommandeClientDto, dateTimestamp).subscribe(
          cmd => {
            this.router.navigate(['commande-client']);
          }, error => {
            this.errorMsg=error.error.errors;
          }
        );
      } else if(this.origin === "fournisseur") {
        this.commandeCltFrs.enregistrerCommandeFournisseur(commande as CommandeFournisseurDto, dateTimestamp).subscribe(
          cmd => {
            this.router.navigate(['commande-fournisseur']);
          }, error => {
            this.errorMsg=error.error.errors;
          }
        );
      }
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

  findAllArticle(){
    this.articleService.findAllArticle()
    .subscribe(articles => {
      this.listArticles=articles;
    });
  }

}
