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
  selectedClientFournisseur: ClientDto = {};
  selectedAdressCltFrs: AdresseDto = {};
  listClientFouenisseur: Array<any> = [];
  searchedArticle: ArticleDto = {};
  articleErrorMsg = "";
  codeArticle = "";
  quantite: number = 0;
  ligneDeCommandes: Array<LigneCommandeClientDto> = [];
  totalCommande: number = 0;
  quantiteListArticle: number = 0;
  listArticles: Array<ArticleDto> = [];
  articleNotYetSelected = true;
  errorMsg: Array<string> = [];

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
    this.findAllCltFrs();
    this.findAllArticle();
  }

  saveClick():void {
    const commande = this.preparerCommande();
    if(this.origin ==="client") {
      this.commandeCltFrs.enregistrerCommandeClient(commande as CommandeClientDto).subscribe(
        cmd => {
          this.router.navigate(['commande-client']);
        }, error => {
          this.errorMsg = error.error.errors;
        }
      );
    }else if(this.origin === "fournisseur"){
      this.commandeCltFrs.enregistrerCommandeFournisseur(commande as CommandeFournisseurDto).subscribe(
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
        code: this.codeArticle,
        dateCommande: new Date().getTime(),
        etatcommande:"EN_PREPARATIOM",
        ligneCommandeClients: this.ligneDeCommandes
      }
    }else if(this.origin === "fournisseur"){
      return  {
        fournisseur: this.selectedClientFournisseur,
        code: this.codeArticle,
        dateCommande: new Date().getTime(),
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
    this.totalCommande = totalCmd;
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
