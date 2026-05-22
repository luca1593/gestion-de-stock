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
  mapListLigneVente = new Map();
  mapNmbrArticle = new Map();
  mapTotalTtc = new Map();
  mapTotalArticle = new Map();
  errorMessage = "";
  pageCmd = 1;
  pageSize = 5;
  totalItems = 0;
  selectedVenteId: number | null = null;
  loading = true;

  searchCode = '';
  searchDate = '';

  constructor(
    private venteService: VenteService,
    private router: Router,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.findAllVentes();
  }

  findAllVentes(): void {
    this.venteService.findAllVente().subscribe({
      next: (ventes) => {
        this.listVentes = ventes;
        this.listVentesFiltre = ventes;
        this.totalItems = ventes.length;
        this.findAllLigneVente();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors du chargement des ventes';
        this.loading = false;
      }
    });
  }

  findAllLigneVente(): void {
    this.listVentes.forEach(vente => {
      if (vente.id) {
        this.findAllLigneVenteByIdVente(vente.id);
      }
    });
  }

  findAllLigneVenteByIdVente(idVente: number): void {
    this.venteService.findLigneVenteByVente(idVente).subscribe({
      next: (lignes) => {
        this.mapListLigneVente.set(idVente, lignes);
        this.calculerTotalVente(idVente, lignes);
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors du chargement des lignes';
        this.loading = false;
      }
    });
  }

  shouldExpandVente(venteId: number): boolean {
    return this.selectedVenteId === venteId;
  }

  toggleVente(venteId: number): void {
    if (this.selectedVenteId === venteId) {
      this.selectedVenteId = null;
    } else {
      this.selectedVenteId = venteId;
    }
  }

  filtrer(): void {
    const searchLower = this.searchCode.toLowerCase().trim();
    this.listVentesFiltre = this.listVentes.filter(vente => {
      const matchCode = !searchLower || (vente.code?.toLowerCase().includes(searchLower));
      const matchDate = !this.searchDate || this.isSameDate(vente.dateVente, this.searchDate);
      return matchCode && matchDate;
    });
    this.totalItems = this.listVentesFiltre.length;
    this.pageCmd = 1;
  }

  isSameDate(date: string | undefined, searchDate: string): boolean {
    if (!date || !searchDate) return false;
    const venteDate = new Date(date);
    const search = new Date(searchDate);
    return venteDate.toDateString() === search.toDateString();
  }

  reinitialiserFiltres(): void {
    this.searchCode = '';
    this.searchDate = '';
    this.listVentesFiltre = this.listVentes;
    this.totalItems = this.listVentes.length;
    this.pageCmd = 1;
  }

  nouvelleVente(): void {
    this.router.navigate(["vente"]);
  }

  calculerTotalVente(idVente: number, lignes: Array<any>): void {
    let totalTtc = 0;
    let nmbArticle = 0;
    lignes.forEach(ligne => {
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
    this.mapListLigneVente.get(idVente)?.forEach((ligne: LigneVenteDto) => {
      if (ligne.article?.id && ligne.article.prixTtc && ligne.quantite) {
        const total = ligne.article.prixTtc * ligne.quantite;
        this.mapTotalArticle.set(ligne.article.id, Math.floor(total));
      }
    });
  }

  onPageChange(event: number): void {
    this.pageCmd = event;
  }

}
