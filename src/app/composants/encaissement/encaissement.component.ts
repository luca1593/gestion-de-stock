import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { PaiementDto } from 'src/gs-api/src/models';
import { FactureService, ModePaiement } from 'src/app/services/facture/facture.service';

export interface Encaissement {
  paiement: PaiementDto;
  /** true quand les champs sont cohérents : le parent peut enregistrer. */
  valide: boolean;
  messages: string[];
}

/**
 * Saisie de l'encaissement d'une facture : mode de paiement, montant payé,
 * montant donné et monnaie à rendre.
 *
 * Le composant ne connaît ni la vente ni la commande : il reçoit le montant
 * dû (montantDu) et renvoie l'état du paiement. Les trois pages d'écriture
 * (vente, commande client, commande fournisseur) le réutilisent tel quel, ce
 * qui évite trois fois le même formulaire et trois fois les mêmes règles.
 *
 * Montant donné / monnaie à rendre n'ont de sens qu'en espèces : les autres
 * modes encaissent un montant exact, le champ est donc masqué et la monnaie
 * forcée à 0.
 */
@Component({
  selector: 'app-encaissement',
  templateUrl: './encaissement.component.html',
  styleUrls: ['./encaissement.component.css']
})
export class EncaissementComponent implements OnChanges {

  /** Montant TTC à encaisser. */
  @Input() montantDu = 0;

  /** Intitulé du montant dû, pour que le total soit lisible dans le contexte. */
  @Input() libelleMontant = 'Total à payer';

  /** N'affiche le champ « montant donné » que pour ces modes. */
  @Input() modesAvecMonnaie: ModePaiement[] = ['ESPECES'];

  @Output() encaissementChange = new EventEmitter<Encaissement>();

  submitted = false;

  modePaiement: ModePaiement = 'ESPECES';
  montant: number | null = null;
  montantDonne: number | null = null;
  reference = '';
  datePaiement: string = this.aujourdhui();
  note = '';

  /**
   * Passés à true dès que l'utilisateur touche au champ (ngModelChange) : les
   * montants cessent alors de suivre automatiquement le total.
   */
  montantSaisi = false;
  montantDonneSaisi = false;

  constructor(public factureService: FactureService) { }

  /**
   * Tant que l'utilisateur n'a pas saisi de montant, il suit le total : le
   * panier change à chaque ligne ajoutée ou retirée, et un montant figé
   * serait faux dès la première modification. Dès que la saisie est manuelle
   * (paiement partiel, acompte), le montant reste figé.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['montantDu'] && !this.montantSaisi) {
      this.montant = this.montantDu;
      if (this.afficheMontantDonne && !this.montantDonneSaisi) {
        this.montantDonne = this.montantDu;
      }
      this.diffuser();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Valeurs dérivées                                                     */
  /* ------------------------------------------------------------------ */

  /** Le montant payé a été saisi manuellement : on ne le suit plus. */
  onMontantChange(): void {
    this.montantSaisi = true;
    this.diffuser();
  }

  /** Le montant donné a été saisi manuellement : on ne le suit plus. */
  onMontantDonneChange(): void {
    this.montantDonneSaisi = true;
    this.diffuser();
  }

  get modes(): Array<{ value: ModePaiement; label: string }> {
    return this.factureService.modesPaiement;
  }

  /** Le champ « montant donné » n'a de sens qu'en espèces (ou modes proches). */
  get afficheMontantDonne(): boolean {
    return this.modesAvecMonnaie.includes(this.modePaiement);
  }

  /** Chèque et virement se retrouvent : sans référence, le suivi est impossible. */
  get referenceObligatoire(): boolean {
    return this.modePaiement === 'CHEQUE' || this.modePaiement === 'VIREMENT_BANCAIRE';
  }

  get montantDuArrondi(): number {
    return this.arrondi(this.montantDu);
  }

  /** Reste dû si le montant payé est inférieur au montant dû. */
  get resteDu(): number {
    return this.arrondi(Math.max(0, this.montantDu - (this.montant ?? 0)));
  }

  /**
   * Monnaie à rendre : la différence entre ce que le client donne et ce que
   * la facture vaut. Jamais négative — un montant donné inférieur au dû est
   * un paiement partiel, pas une monnaie.
   */
  get monnaie(): number {
    if (!this.afficheMontantDonne) {
      return 0;
    }
    return this.arrondi(Math.max(0, (this.montantDonne ?? 0) - (this.montant ?? 0)));
  }

  /* ------------------------------------------------------------------ */
  /* Actions                                                             */
  /* ------------------------------------------------------------------ */

  /** Le client donne exactement le montant dû : plus de saisie à faire. */
  remplirMontantExact(): void {
    this.montant = this.montantDu;
    this.montantDonne = this.afficheMontantDonne ? this.montantDu : null;
    this.montantSaisi = false;
    this.montantDonneSaisi = false;
    this.diffuser();
  }

  onModeChange(): void {
    if (!this.afficheMontantDonne) {
      this.montantDonne = null;
      this.montantDonneSaisi = false;
      this.reference = '';
    }
    this.diffuser();
  }

  /** Verrouille la saisie d'un montant négatif au clavier. */
  onKeydown(event: KeyboardEvent): void {
    if (event.key === '-') {
      event.preventDefault();
    }
  }

  /** Publie l'état du paiement au parent (vente ou commande). */
  diffuser(): void {
    const messages = this.validation();
    this.encaissementChange.emit({
      paiement: {
        montant: this.arrondi(this.montant ?? 0),
        montantDonne: this.afficheMontantDonne ? this.arrondi(this.montantDonne ?? 0) : undefined,
        monnaie: this.monnaie,
        datePaiement: this.datePaiement,
        modePaiement: this.modePaiement,
        reference: this.reference || undefined,
        note: this.note || undefined
      },
      valide: messages.length === 0,
      messages
    });
  }

  /**
   * Règles de saisie. Le montant payé peut être inférieur au dû (paiement
   * partiel, acompte) mais jamais négatif, et le montant donné ne peut pas
   * être inférieur au montant payé — ce serait un défaut de paiement, pas une
   * monnaie.
   */
  private validation(): string[] {
    const messages: string[] = [];
    const montant = this.montant;

    if (montant === null || montant === undefined || isNaN(montant)) {
      messages.push('Veuillez renseigner le montant payé');
    } else if (montant <= 0) {
      messages.push('Le montant payé doit être supérieur à 0');
    } else if (montant > this.montantDu) {
      messages.push('Le montant payé ne peut pas dépasser le total à payer');
    }

    if (this.afficheMontantDonne) {
      const donne = this.montantDonne;
      if (donne === null || donne === undefined || isNaN(donne)) {
        messages.push('Veuillez renseigner le montant donné');
      } else if (donne < (montant ?? 0)) {
        messages.push('Le montant donné ne peut pas être inférieur au montant payé');
      }
    }

    if (!this.datePaiement) {
      messages.push('Veuillez renseigner la date du paiement');
    }

    if ((this.modePaiement === 'CHEQUE' || this.modePaiement === 'VIREMENT_BANCAIRE')
        && !this.reference.trim()) {
      messages.push('La référence est obligatoire pour un paiement par chèque ou virement');
    }

    return messages;
  }

  private aujourdhui(): string {
    const d = new Date();
    return [
      d.getFullYear(),
      (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1,
      d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
    ].join('-');
  }

  private arrondi(valeur: number): number {
    return Math.round((valeur + Number.EPSILON) * 100) / 100;
  }
}