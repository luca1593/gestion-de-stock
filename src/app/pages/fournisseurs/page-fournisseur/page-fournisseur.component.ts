import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CltfrsService } from 'src/app/services/cltfrs/cltfrs.service';
import { PhotoSyncService } from 'src/app/services/photo-sync/photo-sync.service';
import { FournisseurDto } from 'src/gs-api/src/models';
import { SortState, sortByProperty, matchSearch } from 'src/app/composants/sort-utils';

@Component({
  selector: 'app-page-fournisseur',
  templateUrl: './page-fournisseur.component.html',
  styleUrls: ['./page-fournisseur.component.css']
})
export class PageFournisseurComponent implements OnInit {

  listFournisseur: Array<FournisseurDto> = [];
  listFournisseursFiltre: Array<FournisseurDto> = [];
  errorMsg: string = '';
  page: number = 1;
  pageSize: number = 5;
  loading = true;

  searchNom: string = '';
  searchEmail: string = '';
  searchTelephone: string = '';

  sortState: SortState = { column: '', direction: 'asc' };

  constructor(
    private router: Router,
    private cltfrsService: CltfrsService,
    private photoSyncService: PhotoSyncService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.findAllFournisseur();
  }

  findAllFournisseur(): void {
    this.loading = true;
    this.cltfrsService.findAllFournisseurs().subscribe({
      next: (resp) => {
        this.listFournisseur = this.photoSyncService.mergePhotos('fournisseur', resp);
        this.listFournisseursFiltre = this.listFournisseur;
        this.applySort();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
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
    this.page = 1;
    this.cdr.markForCheck();
  }

  private applySort(): void {
    if (this.sortState.column) {
      this.listFournisseursFiltre = sortByProperty(this.listFournisseursFiltre, this.sortState.column, this.sortState.direction);
    }
  }

  filtrer(): void {
    this.listFournisseursFiltre = this.listFournisseur.filter(fournisseur => {
      const matchNom = !this.searchNom || 
        matchSearch(fournisseur.nom, this.searchNom) || 
        matchSearch(fournisseur.prenom, this.searchNom);
      const matchEmail = !this.searchEmail || matchSearch(fournisseur.email, this.searchEmail);
      const matchTelephone = !this.searchTelephone || (fournisseur.numTel?.includes(this.searchTelephone));
      return matchNom && matchEmail && matchTelephone;
    });
    this.applySort();
    this.page = 1;
  }

  reinitialiserFiltres(): void {
    this.searchNom = '';
    this.searchEmail = '';
    this.searchTelephone = '';
    this.listFournisseursFiltre = this.listFournisseur;
    this.applySort();
    this.page = 1;
  }

  nouveauFournisseur(): void {
    this.router.navigate(['nouveau-fournisseur']);
  }

  voirFournisseur(fournisseur: FournisseurDto): void {
    this.router.navigate(['detail-fournisseur', fournisseur.id]);
  }

  modifierFournisseur(fournisseur: FournisseurDto): void {
    this.router.navigate(['nouveau-fournisseur', fournisseur.id]);
  }

  supprimerFournisseur(fournisseur: FournisseurDto): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le fournisseur "${fournisseur.nom}" ?`)) {
      this.cltfrsService.deleteFournisseur(fournisseur.id!).subscribe({
        next: () => {
          this.photoSyncService.clearEntity('fournisseur', fournisseur.id!);
          this.findAllFournisseur();
        },
        error: (err) => this.errorMsg = err.error?.message || "Erreur lors de la suppression"
      });
    }
  }

  formatAdresse(fournisseur: FournisseurDto): string {
    const addr = fournisseur.adresse;
    if (!addr) return '-';
    const parts = [addr.adresse1, addr.adresse2, addr.ville, addr.codePostal, addr.pays].filter(p => p);
    return parts.join(', ') || '-';
  }

  handleSuppression($event: any): void {
    if ($event === "success") {
      this.findAllFournisseur();
    } else {
      this.errorMsg = $event;
    }
  }

}
