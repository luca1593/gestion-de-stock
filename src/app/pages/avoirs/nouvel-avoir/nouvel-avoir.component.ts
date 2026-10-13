import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HaveurService } from 'src/app/services/avoir/avoir.service';
import { CltfrsService } from 'src/app/services/cltfrs/cltfrs.service';
import { VenteService } from 'src/app/services/vente/vente.service';
import { ClientDto, VenteDto, AvoirDto } from 'src/gs-api/src/models';
import { arrondiMonetaire } from 'src/app/composants/money-utils';

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
  submitted = false;

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
    
    // BROUILLON est l'etat par defaut cote backend : c'est lui qui prevails
    // sur les avoirs deja enregistres
    this.avoirDto.etat = 'BROUILLON';
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

  /*
   * ngModelChange transmet la valeur et non l'evenement DOM : ces deux
   * methodes lisaient event.target.value alors qu'elles recoyaient un
   * nombre, d'ou un undefined qui laissait avoirDto.client a null meme apres
   * un choix valide.
   */
  onClientChange(clientId: number | string | null): void {
    this.avoirDto.client = clientId ? { id: Number(clientId) } : null;
  }

  onVenteChange(venteId: number | string | null): void {
    this.avoirDto.vente = venteId ? { id: Number(venteId) } : null;
  }

  save(): void {
    this.submitted = true;
    this.isLoading = true;
    this.errorMsg = '';
    this.successMsg = '';

    // verification avant l'envoi : un formulaire incomplet partait au serveur
    // et le bouton semblait sans effet si la reponse etait muette
    const manquants: string[] = [];
    if (!this.avoirDto.client) manquants.push('client');
    if (!this.avoirDto.dateAvoir) manquants.push("date de l'avoir");
    if (!this.avoirDto.montant && this.avoirDto.montant !== 0) manquants.push('montant');
    if (this.avoirDto.montant < 0) manquants.push('montant (il ne peut pas etre negatif)');
    if (!this.avoirDto.etat) manquants.push('etat');
    if (!this.avoirDto.raison) manquants.push('raison');
    if (manquants.length) {
      this.errorMsg = 'Merci de renseigner : ' + manquants.join(', ');
      this.isLoading = false;
      return;
    }

    // n'envoyer que les champs simples, pas d'objets imbriques
    const avoirClean: any = {
      code: this.avoirDto.code,
      dateAvoir: this.avoirDto.dateAvoir,
      montant: arrondiMonetaire(parseFloat(this.avoirDto.montant)),
      raison: this.avoirDto.raison,
      etat: this.avoirDto.etat,
      client: this.avoirDto.client ? { id: this.avoirDto.client.id } : null,
      vente: this.avoirDto.vente ? { id: this.avoirDto.vente.id } : null
    };

    this.avoirService.save(avoirClean).subscribe({
      next: () => {
        this.successMsg = 'Avoir cree avec succes';
        setTimeout(() => {
          this.router.navigate(['/avoirs']);
        }, 1500);
      },
      error: (err) => {
        this.errorMsg = err.error?.errors?.[0] || err.error?.message || err.message || 'Erreur lors de la creation';
        this.isLoading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/avoirs']);
  }
}