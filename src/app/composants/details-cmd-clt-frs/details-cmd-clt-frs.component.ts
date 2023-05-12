import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-details-cmd-clt-frs',
  templateUrl: './details-cmd-clt-frs.component.html',
  styleUrls: ['./details-cmd-clt-frs.component.css']
})
export class DetailsCmdCltFrsComponent implements OnInit {

  @Input()
  origin="";
  
  @Input()
  commande: any = {};
  cltFrsDto: any = {};

  constructor() { }

  ngOnInit(): void {
    this.extractCltFrs();
  }

  extractCltFrs(): void{
    if (this.origin === "client") {
      this.cltFrsDto = this.commande?.client;
    } else if(this.origin === "fournisseur"){
      this.cltFrsDto = this.commande?.fournisseur;
    }
  }

  supprimer(idCommande: number){
    if (idCommande) {
      if (this.origin === "client") {

      } else if(this.origin === "fournisseur"){
        
      }
    }
  }

}
