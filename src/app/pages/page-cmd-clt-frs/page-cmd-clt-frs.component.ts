import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CmdCltFrsService } from 'src/app/services/cmdcltfrs/cmd-clt-frs.service';
import { CommandeClientDto, LigneCommandeClientDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-page-cmd-clt-frs',
  templateUrl: './page-cmd-clt-frs.component.html',
  styleUrls: ['./page-cmd-clt-frs.component.css']
})
export class PageCmdCltFrsComponent implements OnInit {

  origin = '';
  listCommandes: Array<any> = [];
  mapLigneComandes = new Map();
  mapNmbrArticle = new Map();
  mapTotalTtc = new Map();
  errorMsg = "";
  page: number = 1;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private commandeCltFrsService: CmdCltFrsService
    ) { }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(data => {
      this.origin = data['origin'];
    });
    this.finAllCommandeCltFrs();
  }

  nouveauCommande(): void{
    if(this.origin === "client"){
      this.router.navigate(["nouvel-commande-client"]);
    }else if(this.origin === "fournisseur"){
      this.router.navigate(["nouvel-commande-fournisseur"]);
    }
  }

  finAllCommandeCltFrs(){
    if(this.origin === "client"){
      this.commandeCltFrsService.findAllCommandeClient()
      .subscribe( commandes => {
        this.listCommandes = commandes;
        this.findAllLigneCommande();
      }, error => {
        this.errorMsg = error.error.error;
      });
    }else if(this.origin === "fournisseur"){
      this.commandeCltFrsService.findAllCommandeFournisseur()
      .subscribe( commandes => {
        this.listCommandes = commandes;
        this.findAllLigneCommande();
      }, error => {
        this.errorMsg = error.error.error;
      });
    }
  }

  findAllLigneCommande(): void{
    this.listCommandes.forEach(ligne => {
      this.findAllLigneCommandeByIdCommande(ligne.id);
    });
  }

  findAllLigneCommandeByIdCommande(idCommande: number): void{
    if(this.origin === "client"){
      this.commandeCltFrsService.findAllLigneCommandeClient(idCommande)
      .subscribe( list => {
        this.mapLigneComandes.set(idCommande, list);
        this.calculerTotalCmd(idCommande, list);
      }, error => {
        this.errorMsg = error.error.error;
      });
    }else if(this.origin === "fournisseur"){
      this.commandeCltFrsService.findAllLigneCommandeFournisseur(idCommande)
      .subscribe( list => {
        this.mapLigneComandes.set(idCommande, list);
        this.calculerTotalCmd(idCommande, list);
      }, error => {
        this.errorMsg = error.error.error;
      });
    }
  }

  calculerTotalCmd(idCommande: number, list: Array<any>): void{
    let totalTtc = 0;
    let nmbArticle = 0;
    list.forEach(ligne => {
      if(ligne.prixUnitaire && ligne.quantite){
        totalTtc += ligne.prixUnitaire * ligne.quantite;
        nmbArticle += ligne.quantite;
      }
    });
    this.mapTotalTtc.set(idCommande, Math.floor(totalTtc));
    this.mapNmbrArticle.set(idCommande, nmbArticle);
  }

  calculTotalCommande(idCommande: number): number{
    return this.mapTotalTtc.get(idCommande);
  }

  calculNombreArticleCommande(idCommande: number): number{
    return this.mapNmbrArticle.get(idCommande);
  }

}
