import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CltfrsService } from 'src/app/services/cltfrs/cltfrs.service';
import { FournisseurDto } from 'src/gs-api/src/models';

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
  pageSize: number = 10;

  searchNom: string = '';
  searchEmail: string = '';
  searchTelephone: string = '';

  constructor(
    private router: Router,
    private cltfrsService: CltfrsService
  ) { }

  ngOnInit(): void {
    this.findAllFournisseur();
  }

  findAllFournisseur(): void {
    this.cltfrsService.findAllFournisseurs().subscribe(resp => {
      this.listFournisseur = resp;
      this.listFournisseursFiltre = resp;
    });
  }

  filtrer(): void {
    this.listFournisseursFiltre = this.listFournisseur.filter(fournisseur => {
      const matchNom = !this.searchNom || 
        (fournisseur.nom?.toLowerCase().includes(this.searchNom.toLowerCase())) || 
        (fournisseur.prenom?.toLowerCase().includes(this.searchNom.toLowerCase()));
      const matchEmail = !this.searchEmail || (fournisseur.email?.toLowerCase().includes(this.searchEmail.toLowerCase()));
      const matchTelephone = !this.searchTelephone || (fournisseur.numTel?.includes(this.searchTelephone));
      return matchNom && matchEmail && matchTelephone;
    });
    this.page = 1;
  }

  reinitialiserFiltres(): void {
    this.searchNom = '';
    this.searchEmail = '';
    this.searchTelephone = '';
    this.listFournisseursFiltre = this.listFournisseur;
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
        next: () => this.findAllFournisseur(),
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