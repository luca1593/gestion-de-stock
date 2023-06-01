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

  origin = '';
  selectedClientFournisseur: any = {};
  selectedAdressCltFrs: AdresseDto = {};
  listClientFouenisseur: Array<any> = [];
  searchedArticle: ArticleDto = {};
  articleErrorMsg = "";
  codeArticle = "";
  quantite: number = 0;
  ligneDeCommandes: Array<any> = [];
  totalCommande: number = 0;
  quantiteListArticle: number = 0;
  listArticles: Array<ArticleDto> = [];
  articleNotYetSelected = true;
  errorMsg: Array<string> = [];
  dateCmd = "";
  codeCmd = "";

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cltFrsService: CltfrsService,
    private articleService: ArtcleService,
    private commandeCltFrs: CmdCltFrsService
    ) { }

  ngOnInit():void {
    this.activatedRoute.data.subscribe(data => {
      this.origin = data['origin'];
    });
    const idCltFrs = this.activatedRoute.snapshot.params['id'];
    if (idCltFrs) {
      if (this.origin === "client") {
        this.cltFrsService.findClientById(idCltFrs).subscribe(clt => {
          this.selectedClientFournisseur = clt;
        });
      } else if (this.origin === "fournisseur") {
        this.cltFrsService.findFournisseurById(idCltFrs).subscribe(frs => {
          this.selectedClientFournisseur = frs;
        });
      }
    }
    this.findAllCltFrs();
    this.findAllArticle();
    this.initCodeCmd();
  }

  initCodeCmd(){
    const date: Date = new Date();
    const jour: string = date.getFullYear() + "" + ((date.getMonth() + 1) <10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1))+ "" + (date.getDate() <10 ? ("0" + date.getDate()) : date.getDate());
    const heure: string = (date.getHours() <10 ? ("0" + date.getHours()) : date.getHours()) + "" + (date.getMinutes() <10 ? ("0" + date.getMinutes()) : date.getMinutes())  + "" + (date.getSeconds() <10 ? ("0" + date.getSeconds()) : date.getSeconds());
    this.dateCmd = (date.getDate() <10 ? ("0" + date.getDate()) : date.getDate()) + "/" + ((date.getMonth() + 1) <10 ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1)) + "/" + date.getFullYear()
    if(this.origin === "client"){
      this.codeCmd = "CMDCLT" + jour + heure;
    }else if(this.origin === "fournisseur"){
      this.codeCmd = "CMDFRS" + jour + heure;
    }
  }

  saveClick():void {
    const commande = this.preparerCommande();
    if(this.origin ==="client") {
      this.commandeCltFrs.enregistrerCommandeClient(commande as CommandeClientDto, new Date().getTime()).subscribe(
        cmd => {
          this.router.navigate(['commande-client']);
        }, error => {
          this.errorMsg = error.error.errors;
        }
      );
    }else if(this.origin === "fournisseur"){
      this.commandeCltFrs.enregistrerCommandeFournisseur(commande as CommandeFournisseurDto, new Date().getTime()).subscribe(
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
        etatcommande:"EN_PREPARATIOM",
        ligneCommandeClients: this.ligneDeCommandes
      }
    }else if(this.origin === "fournisseur"){
      return  {
        fournisseur: this.selectedClientFournisseur,
        code: this.codeCmd,
        etatcommande:"EN_PREPARATIOM",
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
          this.listClientFouenisseur = clients;
        })
    }else if(this.origin === "fournisseur"){
      this.cltFrsService.findAllFournisseurs()
        .subscribe(fournisseurs => {
         this.listClientFouenisseur = fournisseurs;
        })
    }
  }

  findArticleByCode(code: string):void {
    if(code){
      this.articleService.findArticleByCode(code)
      .subscribe(article => {
        this.searchedArticle = article;
        this.articleErrorMsg = "";
      }, error => {
        this.articleErrorMsg = error.error.error;
      });
    }
  }

  searchArticle():void {
    if(this.codeArticle.length === 0) {
      this.findAllArticle();
    }
    this.listArticles = this.listArticles.filter(
      art => art?.codeArticle?.startsWith(this.codeArticle)
      || art?.designation?.startsWith(this.codeArticle)
    );
    this.articleNotYetSelected = true;
  }

  selectedArticle(article: ArticleDto): void{
    this.searchedArticle = article;
    this.codeArticle = article.codeArticle ? article.codeArticle : "";
    this.articleNotYetSelected = false;
  }

  addLigneCommande():void {
    let totalCmd = 0;
    let totalQnt = 0;

    const ligneArleadyExist = this.ligneDeCommandes.find(
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
      const ligneDeCommande: LigneCommandeClientDto = {
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
    this.totalCommande = Math.floor(totalCmd);
    this.quantiteListArticle = totalQnt;
    this.searchedArticle = {};
    this.codeArticle = "";
    this.quantite = 0;
    this.articleNotYetSelected = true;
    this.findAllArticle();
  }

  findAllArticle(){
    this.articleService.findAllArticle()
    .subscribe(articles => {
      this.listArticles = articles;
    });
  }

}
