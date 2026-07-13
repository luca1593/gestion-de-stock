import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CltfrsService } from 'src/app/services/cltfrs/cltfrs.service';
import { ExportExcelService } from 'src/app/services/export.service';
import { PhotoSyncService } from 'src/app/services/photo-sync/photo-sync.service';
import { ClientDto } from 'src/gs-api/src/models';
import { SortState, sortByProperty, matchSearch } from 'src/app/composants/sort-utils';

@Component({
  selector: 'app-page-client',
  templateUrl: './page-client.component.html',
  styleUrls: ['./page-client.component.css']
})
export class PageClientComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();
  
  listClients: Array<ClientDto>=[];
  listClientsFiltre: Array<ClientDto>=[];
  errorMsg: string='';
  page: number=1;
  pageSize: number = 5;
  loading = true;

  searchNom: string = '';
  searchEmail: string = '';
  searchTelephone: string = '';

  sortState: SortState = { column: '', direction: 'asc' };

  constructor(
    private router: Router,
    private cltfrsService: CltfrsService,
    private exportService: ExportExcelService,
    private photoSyncService: PhotoSyncService,
    private cdr: ChangeDetectorRef
    ) { }

  ngOnInit(): void {
    this.finfAllClient();
  }

  finfAllClient(): void{
    this.loading = true;
    this.cltfrsService.findAllClient().pipe(takeUntil(this.destroy$)).subscribe({
      next: (resp) => {
        this.listClients = this.photoSyncService.mergePhotos('client', resp);
        this.listClientsFiltre = this.listClients;
        this.applySort();
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Erreur lors du chargement';
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
      this.listClientsFiltre = sortByProperty(this.listClientsFiltre, this.sortState.column, this.sortState.direction);
    }
  }

  filtrer(): void {
    this.listClientsFiltre = this.listClients.filter(client => {
      const matchNom = !this.searchNom || matchSearch(client.nom, this.searchNom) || matchSearch(client.prenom, this.searchNom);
      const matchEmail = !this.searchEmail || matchSearch(client.email, this.searchEmail);
      const matchTelephone = !this.searchTelephone || (client.numTel?.includes(this.searchTelephone));
      return matchNom && matchEmail && matchTelephone;
    });
    this.applySort();
    this.page = 1;
  }

  reinitialiserFiltres(): void {
    this.searchNom = '';
    this.searchEmail = '';
    this.searchTelephone = '';
    this.listClientsFiltre = this.listClients;
    this.applySort();
    this.page = 1;
  }

  nouveauClient():void{
    this.router.navigate(['nouveau-client']);
  }

  exporterClients(): void {
    this.exportService.exportClients();
  }

  voirClient(client: ClientDto): void {
    this.router.navigate(['detail-client', client.id]);
  }

  modifierClient(client: ClientDto): void {
    this.router.navigate(['nouveau-client', client.id]);
  }

  supprimerClient(client: ClientDto): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le client "${client.nom}" ?`)) {
      this.cltfrsService.deleteClient(client.id!).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.photoSyncService.clearEntity('client', client.id!);
          this.finfAllClient();
        },
        error: (err) => this.errorMsg = err.error?.message || "Erreur lors de la suppression"
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleSuppression($event: any): void {
    if($event === "success"){
      this.finfAllClient();
    }else{
      this.errorMsg=$event;
    }
  }

}
