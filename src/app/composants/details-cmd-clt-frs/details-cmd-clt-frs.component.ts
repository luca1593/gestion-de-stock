import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/services/modal/modal.service';

@Component({
  selector: 'app-details-cmd-clt-frs',
  templateUrl: './details-cmd-clt-frs.component.html',
  styleUrls: ['./details-cmd-clt-frs.component.css']
})
export class DetailsCmdCltFrsComponent implements OnInit {

  @Input()
  origin="";

  @Input()
  commande: any={};

  @Input()
  lineDeCommande: any;
  cltFrsDto: any={};

  constructor(
    private router: Router,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.extractCltFrs();
  }

  extractCltFrs(): void{
    if (this.origin === "client") {
      this.cltFrsDto=this.commande?.client;
    } else if(this.origin === "fournisseur"){
      this.cltFrsDto=this.commande?.fournisseur;
    }
  }

  modifier(): void {
    if (this.origin === "client") {
      this.router.navigate(['nouvel-commande-client', this.commande.id]);
    } else if (this.origin === "fournisseur") {
      this.router.navigate(['nouvel-commande-fournisseur', this.commande.id]);
    }
  }

  openDetailsModal(): void {
    const modalId = 'modalDetail' + this.commande.code;
    this.modalService.openModal(modalId);
  }

  closeDetailsModal(): void {
    const modalId = 'modalDetail' + this.commande.code;
    this.modalService.closeModal(modalId);
  }

  supprimer(idCommande: number){
    if (idCommande) {
      if (this.origin === "client") {

      } else if(this.origin === "fournisseur"){

      }
    }
  }

  calcluerTotalCommande() : number {
    let total=0;
    this.commande.ligneCommandeFournisseurs?.forEach((ligne: { quantite: number; }) => {
      if(ligne.quantite) {
        total += ligne.quantite;
      }
    });
    return total;
  }

  calculerPrixTotalCommande() : number {
    let total=0;
    if(this.commande){
      console.log(this.lineDeCommande);
    }
    console.log(this.commande.ligneCommandeFournisseurs);
    this.commande.ligneCommandeFournisseurs?.forEach((ligne: { prixUnitaire: number; quantite: number; }) => {
      if(ligne.prixUnitaire && ligne.quantite) {
        total += (ligne.quantite * ligne.prixUnitaire);
      }
    });
    return total;
  }

}
