import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CltfrsService } from 'src/app/services/cltfrs/cltfrs.service';
import { ExportExcelService } from 'src/app/services/export.service';
import { PhotoSyncService } from 'src/app/services/photo-sync/photo-sync.service';
import { ClientDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-page-client',
  templateUrl: './page-client.component.html',
  styleUrls: ['./page-client.component.css']
})
export class PageClientComponent implements OnInit {
  
  listClients: Array<ClientDto>=[];
  listClientsFiltre: Array<ClientDto>=[];
  errorMsg: string='';
  page: number=1;
  pageSize: number = 5;
  loading = true;

  searchNom: string = '';
  searchEmail: string = '';
  searchTelephone: string = '';

  constructor(
    private router: Router,
    private cltfrsService: CltfrsService,
    private exportService: ExportExcelService,
    private photoSyncService: PhotoSyncService
    ) { }

  ngOnInit(): void {
    this.finfAllClient();
  }

  finfAllClient(): void{
    this.loading = true;
    this.cltfrsService.findAllClient().subscribe({
      next: (resp) => {
        this.listClients = this.photoSyncService.mergePhotos('client', resp);
        this.listClientsFiltre = this.listClients;
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Erreur lors du chargement';
        this.loading = false;
      }
    });
  }

  filtrer(): void {
    this.listClientsFiltre = this.listClients.filter(client => {
      const matchNom = !this.searchNom || (client.nom?.toLowerCase().includes(this.searchNom.toLowerCase())) || (client.prenom?.toLowerCase().includes(this.searchNom.toLowerCase()));
      const matchEmail = !this.searchEmail || (client.email?.toLowerCase().includes(this.searchEmail.toLowerCase()));
      const matchTelephone = !this.searchTelephone || (client.numTel?.includes(this.searchTelephone));
      return matchNom && matchEmail && matchTelephone;
    });
    this.page = 1;
  }

  reinitialiserFiltres(): void {
    this.searchNom = '';
    this.searchEmail = '';
    this.searchTelephone = '';
    this.listClientsFiltre = this.listClients;
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
      this.cltfrsService.deleteClient(client.id!).subscribe({
        next: () => {
          this.photoSyncService.clearEntity('client', client.id!);
          this.finfAllClient();
        },
        error: (err) => this.errorMsg = err.error?.message || "Erreur lors de la suppression"
      });
    }
  }

  handleSuppression($event: any): void {
    if($event === "success"){
      this.finfAllClient();
    }else{
      this.errorMsg=$event;
    }
  }

}
