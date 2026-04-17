import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HaveurService } from 'src/app/services/avoir/avoir.service';
import { CltfrsService } from 'src/app/services/cltfrs/cltfrs.service';
import { VenteService } from 'src/app/services/vente/vente.service';
import { ClientDto, VenteDto, AvoirDto } from 'src/gs-api/src/models';

@Component({
  selector: 'app-nouvel-avoir',
  templateUrl: './nouvel-avoir.component.html',
  styleUrls: ['./nouvel-avoir.component.css']
})
export class NouvelAvoirComponent implements OnInit {
  
  avoirDto: any = {};
  
  listClients: ClientDto[] = [];
  listVentes: VenteDto[] = [];
  
  errorMsg: string = '';
  isLoading = false;
  successMsg: string = '';

  constructor(
    private router: Router,
    private avoirService: HaveurService,
    private clientService: CltfrsService,
    private venteService: VenteService
  ) {}

  ngOnInit(): void {
    this.loadClients();
    this.loadVentes();
    
    // Format date: yyyy-MM-dd pour le backend
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.avoirDto.dateAvoir = `${year}-${month}-${day}`;
    
    this.avoirDto.etat = 'EN_ATTENTE';
    this.avoirDto.code = 'AV-' + Date.now();
  }

  loadClients(): void {
    this.clientService.findAllClient().subscribe({
      next: (data) => {
        this.listClients = data || [];
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Erreur chargement clients';
      }
    });
  }

  loadVentes(): void {
    this.venteService.findAllVente().subscribe({
      next: (data) => {
        this.listVentes = data || [];
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Erreur chargement ventes';
      }
    });
  }

  onClientChange(event: any): void {
    const clientId = event.target.value;
    if (clientId) {
      this.avoirDto.client = { id: parseInt(clientId) };
    } else {
      this.avoirDto.client = null;
    }
  }

  onVenteChange(event: any): void {
    const venteId = event.target.value;
    if (venteId) {
      this.avoirDto.vente = { id: parseInt(venteId) };
    } else {
      this.avoirDto.vente = null;
    }
  }

  save(): void {
    this.isLoading = true;
    this.errorMsg = '';
    this.successMsg = '';

    // Envoyer uniquement les champs simples, pas d'objets imbriqués
    const avoirClean: any = {
      code: this.avoirDto.code,
      dateAvoir: this.avoirDto.dateAvoir,
      montant: parseFloat(this.avoirDto.montant) || 0,
      raison: this.avoirDto.raison,
      etat: this.avoirDto.etat,
      client: this.avoirDto.client ? { id: this.avoirDto.client.id } : null,
      vente: this.avoirDto.vente ? { id: this.avoirDto.vente.id } : null
    };

    console.log('Données envoyées:', JSON.stringify(avoirClean, null, 2));

    this.avoirService.save(avoirClean).subscribe({
      next: (data) => {
        console.log('Réponse:', data);
        this.successMsg = 'Avoir créé avec succès';
        setTimeout(() => {
          this.router.navigate(['/avoirs']);
        }, 1500);
      },
      error: (err) => {
        console.error('Erreur création avoir:', err);
        this.errorMsg = err.error?.message || err.message || 'Erreur lors de la création';
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/avoirs']);
  }
}