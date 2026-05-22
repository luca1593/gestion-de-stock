import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HaveurService } from 'src/app/services/avoir/avoir.service';
import { ExportExcelService } from 'src/app/services/export.service';
import { AvoirDto } from 'src/gs-api/src/models';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-page-avoir',
  templateUrl: './page-avoir.component.html',
  styleUrls: ['./page-avoir.component.css']
})
export class PageHaveurComponent implements OnInit {
  listAvoirs: AvoirDto[] = [];
  listAvoirsFiltre: AvoirDto[] = [];
  error = '';
  isLoading = false;
  page: number = 1;
  pageSize: number = 5;

  searchCode: string = '';
  searchClient: string = '';
  searchEtat: string = '';

  constructor(
    private avoirService: HaveurService,
    private exportService: ExportExcelService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAvoirs();
  }

  loadAvoirs(): void {
    this.isLoading = true;
    this.avoirService.getAll().subscribe({
      next: (data: any) => {
        this.listAvoirs = data || [];
        this.listAvoirsFiltre = this.listAvoirs;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err: any) => {
        this.error = err.error?.message || 'Erreur lors du chargement des avoirs';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  filtrer(): void {
    this.listAvoirsFiltre = this.listAvoirs.filter(avoir => {
      const matchCode = !this.searchCode || (avoir.code?.toLowerCase().includes(this.searchCode.toLowerCase()));
      const matchClient = !this.searchClient || (avoir.client?.nom?.toLowerCase().includes(this.searchClient.toLowerCase()));
      const matchEtat = !this.searchEtat || (avoir.etat === this.searchEtat);
      return matchCode && matchClient && matchEtat;
    });
    this.page = 1;
  }

  reinitialiserFiltres(): void {
    this.searchCode = '';
    this.searchClient = '';
    this.searchEtat = '';
    this.listAvoirsFiltre = this.listAvoirs;
    this.page = 1;
  }

  getEtatClass(etat: string | undefined): string {
    switch (etat) {
      case 'EN_ATTENTE': return 'etat-warning';
      case 'VALIDE': return 'etat-success';
      case 'ANNULE': return 'etat-danger';
      default: return 'etat-default';
    }
  }

  getEtatLabel(etat: string | undefined): string {
    switch (etat) {
      case 'EN_ATTENTE': return 'En attente';
      case 'VALIDE': return 'Validé';
      case 'ANNULE': return 'Annulé';
      default: return etat || 'N/A';
    }
  }

  nouvelAvoir(): void {
    this.router.navigate(['/nouvel-avoir']);
  }

  voirDetails(avoir: AvoirDto): void {
    // Navigate to detail page or open modal
  }

  deleteAvoir(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet avoir?')) {
      this.avoirService.delete(id).subscribe({
        next: () => {
          this.loadAvoirs();
        },
        error: (err: any) => {
          this.error = err.error?.message || 'Erreur lors de la suppression';
        }
      });
    }
  }

  exportPdf(id: number): void {
    this.exportService.exportPdfAvoir(id);
  }
}