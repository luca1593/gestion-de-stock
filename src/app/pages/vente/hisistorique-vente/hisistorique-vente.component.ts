import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { VenteService } from 'src/app/services/vente/vente.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { ExportExcelService } from 'src/app/services/export.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { LigneVenteDto, VenteDto } from 'src/gs-api/src/models';
import { SortState, sortByProperty, matchSearch } from 'src/app/composants/sort-utils';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { arrondiMonetaire, sousTotalLigne } from 'src/app/composants/money-utils';

@Component({
  selector: 'app-hisistorique-vente',
  templateUrl: './hisistorique-vente.component.html',
  styleUrls: ['./hisistorique-vente.component.css']
})
export class HisistoriqueVenteComponent implements OnInit, OnDestroy {

  listVentes: Array<VenteDto> = [];
  listVentesFiltre: Array<VenteDto> = [];
  mapListLigneVente = new Map();
  // Copie de l'ordre API (jamais triée) pour restaurer l'ordre par défaut
  // quand on change de ligne.
  mapListLigneVenteRaw = new Map();
  mapNmbrArticle = new Map();
  mapTotalTtc = new Map();
  mapTotalArticle = new Map();
  private destroy$ = new Subject<void>();
  errorMessage = "";
  pageCmd = 1;
  pageSize = 5;
  totalItems = 0;
  selectedVenteId: number | null = null;
  loading = true;

  searchCode = '';
  searchDate = '';

  sortState: SortState = { column: '', direction: 'asc' };

  constructor(
    private venteService: VenteService,
    private router: Router,
    private modalService: ModalService,
    private exportService: ExportExcelService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.findAllVentes();
  }

  findAllVentes(): void {
    this.venteService.findAllVente().pipe(takeUntil(this.destroy$)).subscribe({
      next: (ventes) => {
        this.listVentes = ventes.sort((a, b) => new Date(b.dateVente || 0).getTime() - new Date(a.dateVente || 0).getTime());
        this.listVentesFiltre = [...this.listVentes];
        this.totalItems = this.listVentes.length;
        this.findAllLigneVente();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Erreur lors du chargement des ventes';
        this.loading = false;
      }
    });
  }

  nouvelleVente(): void {
    this.router.navigate(["vente"]);
  }

  exporterVentes(): void {
    this.exportService.exportVentes();
  }
  async exportPdf(): Promise<void> {
    await this.exportService.exportPdfVentes();
  }

  async printPage(): Promise<void> {
    await this.exportService.printPdfVentes();
  }

  findAllLigneVente(): void {
    this.listVentes.forEach(vente => {
      if (vente.id) {
        this.findAllLigneVenteByIdVente(vente.id);
      }
    });
  }

  findAllLigneVenteByIdVente(idVente: number): void {
    this.venteService.findLigneVenteByVente(idVente).pipe(takeUntil(this.destroy$)).subscribe({
      next: (lignes) => {
        this.mapListLigneVente.set(idVente, lignes);
        this.mapListLigneVenteRaw.set(idVente, [...lignes]);
        // Les reponses arrivent a des moments differents : une reponse tardive
        // ecraserait sinon un tri deja applique par l'utilisateur.
        this.applySortForVente(idVente);
        this.calculerTotalVente(idVente, this.mapListLigneVente.get(idVente) || lignes);
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
    const switching = this.selectedVenteId !== venteId;
    this.selectedVenteId = switching ? venteId : null;
    if (switching) {
      this.resetTriLignes();
    }
  }

  // Chaque ligne affichée repart de l'ordre par défaut (API), sans flèche.
  private resetTriLignes(): void {
    this.sortState = { column: '', direction: 'asc' };
    this.mapListLigneVenteRaw.forEach((lignes, key) => {
      this.mapListLigneVente.set(key, [...lignes]);
    });
  }

  sort(column: string): void {
    if (this.sortState.column === column) {
      this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortState.column = column;
      this.sortState.direction = 'asc';
    }
    this.applySort();
    // Pas de reset de pageCmd ici : ce tri ne concerne que le tableau des
    // lignes de la vente dépliée, pas la liste principale des ventes.
    this.cdr.markForCheck();
  }

  private applySort(): void {
    if (!this.sortState.column) {
      return;
    }
    this.mapListLigneVente.forEach((_, key) => this.applySortForVente(key));
  }

  private applySortForVente(idVente: number): void {
    if (!this.sortState.column) {
      return;
    }
    const lignes = this.mapListLigneVente.get(idVente);
    if (!lignes) {
      return;
    }
    if (this.sortState.column === 'total') {
      const sorted = [...lignes].sort((a, b) => {
        const totalA = (a.quantite || 0) * (a.prixUnitaire || 0);
        const totalB = (b.quantite || 0) * (b.prixUnitaire || 0);
        return this.sortState.direction === 'asc' ? totalA - totalB : totalB - totalA;
      });
      this.mapListLigneVente.set(idVente, sorted);
    } else {
      this.mapListLigneVente.set(idVente, sortByProperty(lignes, this.sortState.column, this.sortState.direction));
    }
  }

  filtrer(): void {
    this.listVentesFiltre = this.listVentes.filter(vente => {
      const matchCode = !this.searchCode || matchSearch(vente.code, this.searchCode);
      const matchDate = !this.searchDate || this.isSameDate(vente.dateVente, this.searchDate);
      return matchCode && matchDate;
    });
    this.applySort();
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
    this.applySort();
    this.totalItems = this.listVentes.length;
    this.pageCmd = 1;
  }


  calculerTotalVente(idVente: number, lignes: Array<any>): void {
    let totalTtc = 0;
    let nmbArticle = 0;
    lignes.forEach(ligne => {
      if (ligne.prixUnitaire && ligne.quantite) {
        totalTtc += sousTotalLigne(ligne.prixUnitaire, ligne.quantite);
        nmbArticle += ligne.quantite;
      }
    });
    this.mapTotalTtc.set(idVente, arrondiMonetaire(totalTtc));
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
        this.mapTotalArticle.set(ligne.article.id, arrondiMonetaire(total));
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: number): void {
    this.pageCmd = event;
  }

}
