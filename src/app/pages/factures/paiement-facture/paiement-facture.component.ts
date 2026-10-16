import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FactureService } from 'src/app/services/facture/facture.service';
import { Encaissement } from 'src/app/composants/encaissement/encaissement.component';
import { FactureDto } from 'src/gs-api/src/models';

/**
 * Encaissement complémentaire sur une facture déjà émise.
 *
 * Le backend n'a qu'un seul point d'entrée d'écriture
 * (POST /v1/factures/save-avec-paiement) : on renvoie la facture telle quelle
 * avec le nouveau paiement imbriqué, et lui recalcule montant payé, restant et
 * statut.
 */
@Component({
  selector: 'app-paiement-facture',
  templateUrl: './paiement-facture.component.html',
  styleUrls: ['./paiement-facture.component.css']
})
export class PaiementFactureComponent implements OnInit {

  facture: FactureDto | null = null;
  loading = true;
  errorMsg: Array<string> = [];
  submitted = false;

  encaissement: Encaissement = {
    paiement: { modePaiement: 'ESPECES' },
    valide: false,
    messages: []
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private factureService: FactureService
  ) { }

  ngOnInit(): void {
    const id = +this.activatedRoute.snapshot.params['idFacture'];
    if (!id) {
      this.loading = false;
      this.errorMsg = ['Facture introuvable'];
      return;
    }
    this.chargerFacture(id);
  }

  private chargerFacture(id: number): void {
    this.loading = true;
    this.factureService.getById(id).subscribe({
      next: (facture) => {
        this.facture = facture ?? null;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = this.factureService.messagesErreur(err);
      }
    });
  }

  onEncaissementChange(encaissement: Encaissement): void {
    this.encaissement = encaissement;
  }

  /** Montant restant dû : base de l'encaissement proposé. */
  get montantRestant(): number {
    if (!this.facture) {
      return 0;
    }
    if (this.facture.montantRestant !== undefined && this.facture.montantRestant !== null) {
      return this.facture.montantRestant;
    }
    return Math.max(0, (this.facture.montantTTC ?? 0) - (this.facture.montantPaye ?? 0));
  }

  /**
   * Facture entierement soldee. Le bouton d'enregistrement est deja grise,
   * mais le formulaire restait editable sans aucune explication : mieux vaut
   * dire pourquoi la page ne sert a rien, plutot que laisser l'utilisateur
   * saisir un montant pour un bouton inerte.
   */
  get factureSoldee(): boolean {
    return this.montantRestant <= 0;
  }

  enregistrer(): void {
    this.submitted = true;
    this.errorMsg = [];

    if (this.factureSoldee) {
      this.errorMsg = ["Cette facture est déjà entièrement réglée : aucun paiement complémentaire n'est possible."];
      return;
    }

    if (!this.facture) {
      this.errorMsg = ['Facture introuvable'];
      return;
    }

    if (!this.encaissement.valide) {
      this.errorMsg = this.encaissement.messages.length
        ? this.encaissement.messages
        : ['Renseignez le montant du paiement'];
      return;
    }

    const facture = this.factureService.preparerPaiementSupplementaire(this.facture, this.encaissement.paiement);
    this.factureService.saveAvecPaiement(facture).subscribe({
      next: () => this.router.navigate(['factures']),
      error: (error) => {
        this.errorMsg = this.factureService.messagesErreur(error);
      }
    });
  }

  annuler(): void {
    this.router.navigate(['factures']);
  }

  /* --- Affichage --- */

  libelleType(type?: string): string {
    return this.factureService.libelleType(type);
  }

  libelleStatut(statut?: string): string {
    return this.factureService.libelleStatut(statut);
  }

  classeBadge(statut?: string): string {
    return this.factureService.classeBadgeStatut(statut);
  }

  libelleSource(sourceType?: string): string {
    return this.factureService.libelleSource(sourceType);
  }
}