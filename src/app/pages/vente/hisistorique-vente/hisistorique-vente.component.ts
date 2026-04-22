import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VenteService } from 'src/app/services/vente/vente.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { LigneVenteDto, VenteDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-hisistorique-vente',
  templateUrl: './hisistorique-vente.component.html',
  styleUrls: ['./hisistorique-vente.component.css']
})
export class HisistoriqueVenteComponent implements OnInit {

  listVentes: Array<VenteDto> = [];
  listVentesFiltre: Array<VenteDto> = [];
  mapListLigneVente: Map<number, Array<LigneVenteDto>> = new Map();
  errorMessage: string = "";
  pageCmd: number = 1;
  pageSize: number = 10;
  idVenteSelectione: number = 0;
  mapNmbrArticle = new Map();
  mapTotalArticle: Map<number, number> = new Map();
  mapTotalTtc = new Map();
  mapVente = new Map();
  vente: VenteDto = {};

  searchCode: string = '';
  searchDate: string = '';

  constructor(
    private venteService: VenteService,
    private router: Router,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.venteService.findAllVente().subscribe(list => {
      this.listVentes = list;
      this.listVentesFiltre = list;
      this.findAllLigneVente();
    }, error => {
      this.errorMessage = error.error.message;
    });
  }

  filtrer(): void {
    this.listVentesFiltre = this.listVentes.filter(vente => {
      const matchCode = !this.searchCode || (vente.code?.toLowerCase().includes(this.searchCode.toLowerCase()));
      const matchDate = !this.searchDate || this.isSameDate(vente.dateVente, this.searchDate);
      return matchCode && matchDate;
    });
    this.pageCmd = 1;
  }

  isSameDate(date: number | undefined, searchDate: string): boolean {
    if (!date || !searchDate) return false;
    const venteDate = new Date(date);
    const search = new Date(searchDate);
    return venteDate.toDateString() === search.toDateString();
  }

  reinitialiserFiltres(): void {
    this.searchCode = '';
    this.searchDate = '';
    this.listVentesFiltre = this.listVentes;
    this.pageCmd = 1;
  }

  nouvelleVente(): void {
    this.router.navigate(["vente"]);
  }

  setVenteSelectione(idSelectione: number): void {
    this.idVenteSelectione = idSelectione;
    this.vente = this.mapVente.get(idSelectione);
    this.calculerTotalArticle(this.idVenteSelectione);
    this.modalService.openModal('modalDetail');
  }

  closeDetailsModal(): void {
    this.modalService.closeModal('modalDetail');
  }

  findAllLigneVente(): void {
    this.listVentes.forEach(vente => {
      this.findAllLigneVenteByIdVente(vente.id!);
      this.mapVente.set(vente.id, vente);
    });
  }

  findAllLigneVenteByIdVente(idVente: number): void {
    this.venteService.findLigneVenteByVente(idVente).subscribe(list => {
      this.mapListLigneVente.set(idVente, list);
      this.calculerTotalVnte(idVente, list);
    }, error => {
      this.errorMessage = error.error.message;
    });
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
    return this.mapTotalTtc.get(idVente) || 0;
  }

  calculNombreArticleVente(idVente: number): number {
    return this.mapNmbrArticle.get(idVente) || 0;
  }

  calculerTotalArticle(idVente: number): void {
    this.mapListLigneVente.get(idVente)?.forEach(ligne => {
      if (ligne.article?.id) {
        let total = ligne.article.prixTtc! * ligne.quantite!;
        this.mapTotalArticle.set(ligne.article?.id, Math.floor(total));
      }
    });
  }

}