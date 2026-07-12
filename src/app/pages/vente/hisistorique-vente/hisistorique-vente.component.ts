import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { VenteService } from 'src/app/services/vente/vente.service';
import { ModalService } from 'src/app/services/modal/modal.service';
import { ExportExcelService } from 'src/app/services/export.service';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { LigneVenteDto, VenteDto } from 'src/gs-api/src/models';
import { SortState, sortByProperty, matchSearch } from 'src/app/composants/sort-utils';
import { firstValueFrom } from 'rxjs';
import * as ExcelJS from 'exceljs';

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
    this.venteService.findAllVente().subscribe({
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

  async importerVentes(event: any): Promise<void> {
    const file: File = event.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(buffer);
      const ws = workbook.getWorksheet(1);
      if (!ws) {
        this.notificationService.addError('Erreur', 'Fichier Excel invalide');
        return;
      }

      const rows: any[] = [];
      ws.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;
        const codeVente = row.getCell(1).text?.trim();
        const dateVente = row.getCell(2).text?.trim();
        const codeArticle = row.getCell(3).text?.trim();
        const designation = row.getCell(4).text?.trim();
        const quantite = parseFloat(row.getCell(5).text?.trim()) || 0;
        const pu = parseFloat(row.getCell(6).text?.trim()) || 0;
        if (codeVente && quantite > 0 && pu > 0) {
          rows.push({ codeVente, dateVente, codeArticle, designation, quantite, pu });
        }
      });

      if (rows.length === 0) {
        this.notificationService.addError('Erreur', 'Aucune donnée trouvée dans le fichier');
        return;
      }

      const grouped = new Map<string, { code: string; dateVente: string; lignes: any[] }>();
      rows.forEach(r => {
        if (!grouped.has(r.codeVente)) {
          grouped.set(r.codeVente, { code: r.codeVente, dateVente: r.dateVente, lignes: [] });
        }
        grouped.get(r.codeVente)!.lignes.push({
          quantite: r.quantite,
          prixUnitaire: r.pu,
          article: { codeArticle: r.codeArticle, designation: r.designation }
        });
      });

      let imported = 0;
      let errors = 0;

      for (const [code, venteData] of grouped) {
        try {
          const dto: VenteDto = {
            code,
            dateVente: venteData.dateVente || new Date().toISOString(),
            ligneVentes: venteData.lignes
          };
          await firstValueFrom(this.venteService.enregistrerVente(dto));
          imported++;
        } catch {
          errors++;
        }
      }

      if (errors > 0) {
        this.notificationService.addWarning('Attention', `${imported} importée(s), ${errors} erreur(s)`);
      } else {
        this.notificationService.addSuccess('Succès', `${imported} vente(s) importée(s)`);
      }

      this.findAllVentes();
    } catch (err) {
      this.notificationService.addError('Erreur', 'Échec de la lecture du fichier');
    }
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

  sort(column: string): void {
    if (this.sortState.column === column) {
      this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortState.column = column;
      this.sortState.direction = 'asc';
    }
    this.applySort();
    this.pageCmd = 1;
    this.cdr.markForCheck();
  }

  private applySort(): void {
    if (this.sortState.column) {
      if (this.sortState.column === 'total') {
        this.mapListLigneVente.forEach((lignes, key) => {
          const sorted = [...lignes].sort((a, b) => {
            const totalA = (a.quantite || 0) * (a.prixUnitaire || 0);
            const totalB = (b.quantite || 0) * (b.prixUnitaire || 0);
            return this.sortState.direction === 'asc' ? totalA - totalB : totalB - totalA;
          });
          this.mapListLigneVente.set(key, sorted);
        });
      } else {
        this.mapListLigneVente.forEach((lignes, key) => {
          this.mapListLigneVente.set(key, sortByProperty(lignes, this.sortState.column, this.sortState.direction));
        });
      }
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
