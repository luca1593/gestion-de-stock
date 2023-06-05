import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VenteService } from 'src/app/services/vente/vente.service';
import { LigneVenteDto, VenteDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-hisistorique-vente',
  templateUrl: './hisistorique-vente.component.html',
  styleUrls: ['./hisistorique-vente.component.css']
})
export class HisistoriqueVenteComponent implements OnInit {

  listVentes: Array<VenteDto> = [];
  mapListLigneVente: Map<number, Array<LigneVenteDto>> = new Map();
  errorMessage: string = "";
  pageCmd = 1;
  idVenteSelectione = 0;
  mapNmbrArticle = new Map();
  mapTotalArticle: Map<number, number> = new Map();
  mapTotalTtc = new Map();
  mapVente= new Map();
  vente: VenteDto = {};

  constructor(
    private venteService: VenteService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.venteService.findAllVente().subscribe( list => {
      this.listVentes = list;
      this.findAllLigneVente();
    }, error => {
      this.errorMessage = error.error.message;
    });
  }

  nouvelleVente(): void{
    this.router.navigate(["vente"]);
  }

  findAllLigneVente(): void{
    this.listVentes.forEach( vente => {
      this.findAllLigneVenteByIdVente(vente.id!);
      this.mapVente.set(vente.id, vente);
    });
  }

  findAllLigneVenteByIdVente(idVente: number): void{
    this.venteService.findLigneVenteByVente(idVente).subscribe(list => {
      this.mapListLigneVente.set(idVente, list);
      this.calculerTotalVnte(idVente, list);
    }, error => {
      this.errorMessage = error.error.message;
    });
  }

  setVenteSelectione(idSelectione: number): void {
    this.idVenteSelectione = idSelectione;
    this.vente = this.mapVente.get(idSelectione);
    this.calculerTotalArticle(this.idVenteSelectione);
  }

  calculerTotalVnte(idVente: number, list: Array<any>): void {
    let totalTtc = 0;
    let nmbArticle = 0;
    list.forEach(ligne => {
      if (ligne.prixUnitaire && ligne.quantite) {
        totalTtc += ligne.prixUnitaire * ligne.quantite;
        nmbArticle += ligne.quantite;
      }
    });
    this.mapTotalTtc.set(idVente, Math.floor(totalTtc));
    this.mapNmbrArticle.set(idVente, nmbArticle);
  }

  calculTotalVente(idVente: number): number {
    return this.mapTotalTtc.get(idVente);
  }

  calculNombreArticleVente(idVente: number): number {
    return this.mapNmbrArticle.get(idVente);
  }

  calculerTotalArticle(idVente: number): void{
    this.mapListLigneVente.get(idVente)?.forEach(ligne => {
      if (ligne.article?.id) {
        let total = ligne.article.prixTtc! * ligne.quantite!;
        this.mapTotalArticle.set(ligne.article?.id, Math.floor(total));
      }
    })
  }

}
